import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'
import { configureLogger, createLogger } from './logger'
import { Exporter, encodeLogs, encodeSpans, toAnyValue, toTraceparent } from './otlp'
import { redactText, redactValue, stripQuery } from './redact'
import { instrumentFetch, shouldPropagate } from './tracing'

describe('redact', () => {
  it('masks e-mails, tokens and Brazilian document numbers', () => {
    const text = redactText('user ana@example.com cpf 123.456.789-09 Bearer abc.def.ghi cnpj 12.345.678/0001-95')
    assert.equal(text.includes('ana@example.com'), false)
    assert.equal(text.includes('123.456.789-09'), false)
    assert.equal(text.includes('abc.def.ghi'), false)
    assert.equal(text.includes('12.345.678/0001-95'), false)
  })

  it('masks values under sensitive keys, at any depth', () => {
    const value = redactValue({ id: 1, password: 'x', nested: { authorization: 'y', ok: 'fine' } })
    assert.deepEqual(value, { id: 1, password: '[redacted]', nested: { authorization: '[redacted]', ok: 'fine' } })
  })

  it('removes the query string and the hash from urls', () => {
    assert.equal(stripQuery('https://a.test/p?token=1#x'), 'https://a.test/p')
    assert.equal(stripQuery('/p'), '/p')
  })
})

describe('otlp encoding', () => {
  it('encodes attribute types', () => {
    assert.deepEqual(toAnyValue('a'), { stringValue: 'a' })
    assert.deepEqual(toAnyValue(3), { intValue: '3' })
    assert.deepEqual(toAnyValue(1.5), { doubleValue: 1.5 })
    assert.deepEqual(toAnyValue(true), { boolValue: true })
  })

  it('encodes logs and spans under a resource', () => {
    const logs = encodeLogs({ 'service.name': 's' }, [
      { timeUnixNano: '1', severityNumber: 17, severityText: 'ERROR', body: 'boom', attributes: {} },
    ])
    assert.equal(logs.resourceLogs[0].scopeLogs[0].logRecords[0].body.stringValue, 'boom')
    const spans = encodeSpans({ 'service.name': 's' }, [
      {
        traceId: 'a'.repeat(32),
        spanId: 'b'.repeat(16),
        name: 'HTTP GET',
        kind: 3,
        startTimeUnixNano: '1',
        endTimeUnixNano: '2',
        attributes: {},
        statusCode: 1,
      },
    ])
    assert.equal(spans.resourceSpans[0].scopeSpans[0].spans[0].status.code, 1)
  })

  it('formats a traceparent header', () => {
    assert.equal(toTraceparent('a'.repeat(32), 'b'.repeat(16)), `00-${'a'.repeat(32)}-${'b'.repeat(16)}-01`)
  })
})

describe('exporter', () => {
  it('posts batched logs and spans, and never throws when the collector is down', async () => {
    const calls: { url: string; body: string }[] = []
    const fetchFn: typeof fetch = async (url, init) => {
      calls.push({ url: String(url), body: String(init?.body) })
      return new Response(null, { status: 200 })
    }
    const exporter = new Exporter({ endpoint: 'http://c.test/', resource: {}, fetchFn, flushIntervalMs: 60_000 })
    exporter.log({ timeUnixNano: '1', severityNumber: 9, severityText: 'INFO', body: 'a', attributes: {} })
    exporter.span({
      traceId: 'a'.repeat(32),
      spanId: 'b'.repeat(16),
      name: 'x',
      kind: 3,
      startTimeUnixNano: '1',
      endTimeUnixNano: '2',
      attributes: {},
      statusCode: 1,
    })
    await exporter.shutdown()
    assert.deepEqual(calls.map((call) => call.url).sort(), ['http://c.test/v1/logs', 'http://c.test/v1/traces'])

    const failing = new Exporter({
      endpoint: 'http://c.test',
      resource: {},
      fetchFn: async () => {
        throw new Error('down')
      },
      flushIntervalMs: 60_000,
    })
    failing.log({ timeUnixNano: '1', severityNumber: 9, severityText: 'INFO', body: 'a', attributes: {} })
    await assert.doesNotReject(failing.shutdown())
  })
})

describe('logger', () => {
  afterEach(() => configureLogger({ mode: 'activated', exporter: undefined, exportLevel: 'warn' }))

  it('exports only the configured level and redacts the message', async () => {
    const records: { body: string; severityText: string }[] = []
    const exporter = { log: (record: { body: string; severityText: string }) => records.push(record) }
    configureLogger({ mode: 'activated', exporter: exporter as unknown as Exporter, exportLevel: 'warn' })
    const original = { info: console.info, warn: console.warn }
    console.info = () => undefined
    console.warn = () => undefined
    try {
      const log = createLogger('test')
      log.info('quiet ana@example.com')
      log.warn('loud ana@example.com')
    } finally {
      console.info = original.info
      console.warn = original.warn
    }
    assert.equal(records.length, 1)
    assert.equal(records[0].severityText, 'WARN')
    assert.equal(records[0].body.includes('ana@example.com'), false)
  })

  it('stays silent when deactivated', () => {
    configureLogger({ mode: 'deactivated' })
    let called = false
    const original = console.error
    console.error = () => {
      called = true
    }
    try {
      createLogger().error('x')
    } finally {
      console.error = original
    }
    assert.equal(called, false)
  })
})

describe('tracing', () => {
  it('propagates only to same-origin and allowed targets', () => {
    assert.equal(shouldPropagate(new URL('https://api.test/x'), ['https://api.test']), true)
    assert.equal(shouldPropagate(new URL('https://api.test/x'), [/other\.test/]), false)
    assert.equal(shouldPropagate(new URL('https://other.test/x'), [/other\.test/]), true)
  })

  it('adds traceparent, records a span and skips the collector itself', async () => {
    const seen: { url: string; traceparent: string | null }[] = []
    const original = globalThis.fetch
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      seen.push({ url: String(input), traceparent: new Headers(init?.headers).get('traceparent') })
      return new Response(null, { status: 200 })
    }) as typeof fetch

    const spans: { name: string; attributes: Record<string, unknown> }[] = []
    const exporter = { endpoint: 'http://collector.test', span: (span: (typeof spans)[number]) => spans.push(span) }
    const restore = instrumentFetch({ exporter: exporter as unknown as Exporter, propagateTo: ['https://api.test'] })
    try {
      await fetch('https://api.test/users?token=1')
      await fetch('http://collector.test/v1/logs')
      await fetch('https://elsewhere.test/x')
    } finally {
      restore()
      globalThis.fetch = original
    }

    assert.match(seen[0].traceparent ?? '', /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/)
    assert.equal(seen[1].traceparent, null)
    assert.equal(seen[2].traceparent, null)
    assert.equal(spans.length, 1)
    assert.equal(spans[0].attributes['url.full'], 'https://api.test/users')
  })
})
