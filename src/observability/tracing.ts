import { nowNano, randomHex, toTraceparent, type Exporter } from './otlp'
import { stripQuery } from './redact'

export type PropagationTarget = string | RegExp

export type TracingOptions = {
  exporter: Exporter
  propagateTo?: PropagationTarget[]
  sampleRate?: number
}

function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

function absolute(url: string): URL {
  const base = globalThis.location?.href ?? 'http://localhost/'
  return new URL(url, base)
}

function matches(target: PropagationTarget, url: URL): boolean {
  return typeof target === 'string' ? url.origin === target.replace(/\/+$/, '') : target.test(url.href)
}

export function shouldPropagate(url: URL, propagateTo: PropagationTarget[]): boolean {
  const sameOrigin = globalThis.location !== undefined && url.origin === globalThis.location.origin
  return sameOrigin || propagateTo.some((target) => matches(target, url))
}

export function instrumentFetch({ exporter, propagateTo = [], sampleRate = 1 }: TracingOptions): () => void {
  const original = globalThis.fetch
  const ownOrigin = absolute(exporter.endpoint).origin

  const wrapped: typeof fetch = async (input, init) => {
    const url = absolute(resolveUrl(input))
    if (url.origin === ownOrigin || !shouldPropagate(url, propagateTo) || Math.random() >= sampleRate) {
      return original(input, init)
    }

    const traceId = randomHex(16)
    const spanId = randomHex(8)
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
    headers.set('traceparent', toTraceparent(traceId, spanId))
    const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
    const start = nowNano()

    const record = (statusCode: 0 | 1 | 2, status?: number) =>
      exporter.span({
        traceId,
        spanId,
        name: `HTTP ${method}`,
        kind: 3,
        startTimeUnixNano: start,
        endTimeUnixNano: nowNano(),
        statusCode,
        attributes: {
          'http.request.method': method,
          'url.full': stripQuery(url.href),
          'server.address': url.hostname,
          'http.response.status_code': status,
        },
      })

    try {
      const response = await original(input, { ...init, headers })
      record(response.status >= 500 ? 2 : 1, response.status)
      return response
    } catch (error) {
      record(2)
      throw error
    }
  }

  globalThis.fetch = wrapped
  return () => {
    globalThis.fetch = original
  }
}
