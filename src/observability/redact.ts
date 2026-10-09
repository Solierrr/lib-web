const REDACTED = '[redacted]'

const PATTERNS: RegExp[] = [
  /\beyJ[\w-]+\.[\w-]+\.[\w-]+\b/g,
  /\b(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi,
  /[\w.+-]+@[\w-]+\.[\w.-]+/g,
  /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g,
  /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
]

const SENSITIVE_KEYS = /pass(word)?|senha|token|authorization|cookie|secret|api[-_]?key|cpf|cnpj|e-?mail/i

export function redactText(value: string): string {
  return PATTERNS.reduce((text, pattern) => text.replace(pattern, REDACTED), value)
}

export function stripQuery(url: string): string {
  const cut = url.search(/[?#]/)
  return cut === -1 ? url : url.slice(0, cut)
}

export function redactValue(value: unknown, depth = 0): unknown {
  if (typeof value === 'string') return redactText(value)
  if (value === null || typeof value !== 'object') return value
  if (depth >= 4) return REDACTED
  if (value instanceof Error) {
    return {
      name: value.name,
      message: redactText(value.message),
      stack: value.stack ? redactText(value.stack) : undefined,
    }
  }
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => redactValue(item, depth + 1))
  const output: Record<string, unknown> = {}
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    output[key] = SENSITIVE_KEYS.test(key) ? REDACTED : redactValue(item, depth + 1)
  }
  return output
}
