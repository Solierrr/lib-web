import { redactValue } from './redact'

export type Attributes = Record<string, unknown>

export type LogRecord = {
  timeUnixNano: string
  severityNumber: number
  severityText: string
  body: string
  attributes: Attributes
  traceId?: string
  spanId?: string
}

export type SpanRecord = {
  traceId: string
  spanId: string
  name: string
  kind: number
  startTimeUnixNano: string
  endTimeUnixNano: string
  attributes: Attributes
  statusCode: 0 | 1 | 2
}

export type ExporterOptions = {
  endpoint: string
  resource: Attributes
  headers?: Record<string, string>
  flushIntervalMs?: number
  maxBatchSize?: number
  maxQueueSize?: number
  fetchFn?: typeof fetch
}

export function randomHex(bytes: number): string {
  const buffer = new Uint8Array(bytes)
  globalThis.crypto.getRandomValues(buffer)
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function nowNano(): string {
  return (BigInt(Date.now()) * 1_000_000n).toString()
}

export function toTraceparent(traceId: string, spanId: string): string {
  return `00-${traceId}-${spanId}-01`
}

type AnyValue = Record<string, unknown>

export function toAnyValue(value: unknown): AnyValue {
  if (typeof value === 'string') return { stringValue: value }
  if (typeof value === 'boolean') return { boolValue: value }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { intValue: String(value) } : { doubleValue: value }
  }
  if (value === null || value === undefined) return { stringValue: '' }
  return { stringValue: JSON.stringify(redactValue(value)) }
}

export function toKeyValues(attributes: Attributes): { key: string; value: AnyValue }[] {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ({ key, value: toAnyValue(value) }))
}

const SCOPE = { name: '@solaria.network/web-lib' }

export function encodeLogs(resource: Attributes, records: LogRecord[]) {
  return {
    resourceLogs: [
      {
        resource: { attributes: toKeyValues(resource) },
        scopeLogs: [
          {
            scope: SCOPE,
            logRecords: records.map((record) => ({
              timeUnixNano: record.timeUnixNano,
              severityNumber: record.severityNumber,
              severityText: record.severityText,
              body: { stringValue: record.body },
              attributes: toKeyValues(record.attributes),
              traceId: record.traceId,
              spanId: record.spanId,
            })),
          },
        ],
      },
    ],
  }
}

export function encodeSpans(resource: Attributes, spans: SpanRecord[]) {
  return {
    resourceSpans: [
      {
        resource: { attributes: toKeyValues(resource) },
        scopeSpans: [
          {
            scope: SCOPE,
            spans: spans.map((span) => ({
              traceId: span.traceId,
              spanId: span.spanId,
              name: span.name,
              kind: span.kind,
              startTimeUnixNano: span.startTimeUnixNano,
              endTimeUnixNano: span.endTimeUnixNano,
              attributes: toKeyValues(span.attributes),
              status: { code: span.statusCode },
            })),
          },
        ],
      },
    ],
  }
}

export class Exporter {
  private logs: LogRecord[] = []
  private spans: SpanRecord[] = []
  private timer: ReturnType<typeof setInterval> | undefined
  private readonly base: string
  private readonly resource: Attributes
  private readonly headers: Record<string, string>
  private readonly maxBatchSize: number
  private readonly maxQueueSize: number
  private readonly fetchFn: typeof fetch | undefined

  constructor(options: ExporterOptions) {
    this.base = options.endpoint.replace(/\/+$/, '')
    this.resource = options.resource
    this.headers = options.headers ?? {}
    this.maxBatchSize = options.maxBatchSize ?? 50
    this.maxQueueSize = options.maxQueueSize ?? 500
    this.fetchFn = options.fetchFn
    this.timer = setInterval(() => void this.flush(), options.flushIntervalMs ?? 5000)
  }

  get endpoint(): string {
    return this.base
  }

  log(record: LogRecord): void {
    if (this.logs.length >= this.maxQueueSize) this.logs.shift()
    this.logs.push(record)
    if (this.logs.length >= this.maxBatchSize) void this.flush()
  }

  span(record: SpanRecord): void {
    if (this.spans.length >= this.maxQueueSize) this.spans.shift()
    this.spans.push(record)
    if (this.spans.length >= this.maxBatchSize) void this.flush()
  }

  async flush(): Promise<void> {
    const logs = this.logs.splice(0)
    const spans = this.spans.splice(0)
    const sends: Promise<void>[] = []
    if (logs.length) sends.push(this.post('/v1/logs', encodeLogs(this.resource, logs)))
    if (spans.length) sends.push(this.post('/v1/traces', encodeSpans(this.resource, spans)))
    await Promise.all(sends)
  }

  async shutdown(): Promise<void> {
    if (this.timer !== undefined) clearInterval(this.timer)
    this.timer = undefined
    await this.flush()
  }

  private async post(path: string, body: unknown): Promise<void> {
    const send = this.fetchFn ?? globalThis.fetch.bind(globalThis)
    try {
      await send(`${this.base}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.headers },
        body: JSON.stringify(body),
        keepalive: true,
      })
    } catch {
      return
    }
  }
}
