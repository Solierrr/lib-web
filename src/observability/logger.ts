import { redactText, redactValue } from './redact'
import { nowNano, type Exporter } from './otlp'

export type LogsMode = 'debug' | 'activated' | 'deactivated'
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type ServiceErrorContext = {
  service: string
  operation: string
  status?: number
  error?: unknown
}

export type Logger = {
  debug(message: string, data?: unknown): void
  info(message: string, data?: unknown): void
  warn(message: string, data?: unknown): void
  error(message: string, error?: unknown): void
  serviceError(context: ServiceErrorContext): void
}

const ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }
const SEVERITY: Record<LogLevel, number> = { debug: 5, info: 9, warn: 13, error: 17 }
const LABEL: Record<LogLevel, string> = {
  debug: '[DEBUG]',
  info: '[INFO]',
  warn: '[WARN]',
  error: '[ERROR]',
}

type State = {
  mode: LogsMode
  exporter?: Exporter
  exportLevel: LogLevel
}

const state: State = { mode: 'activated', exportLevel: 'warn' }

export function configureLogger(next: Partial<State>): void {
  Object.assign(state, next)
}

function emit(level: LogLevel, source: string, message: string, data: unknown): void {
  if (state.mode === 'deactivated') return
  if (level === 'debug' && state.mode !== 'debug') return

  const safeMessage = redactText(message)
  const prefix = source ? `${LABEL[level]} [${source}] ${safeMessage}` : `${LABEL[level]} ${safeMessage}`
  const method = level === 'debug' ? 'info' : level
  console[method](prefix, data ?? '')

  if (state.exporter && ORDER[level] >= ORDER[state.exportLevel]) {
    state.exporter.log({
      timeUnixNano: nowNano(),
      severityNumber: SEVERITY[level],
      severityText: level.toUpperCase(),
      body: safeMessage,
      attributes: {
        'log.source': source || undefined,
        'log.data': data === undefined ? undefined : redactValue(data),
      },
    })
  }
}

export function createLogger(source = ''): Logger {
  return {
    debug: (message, data) => emit('debug', source, message, data),
    info: (message, data) => emit('info', source, message, data),
    warn: (message, data) => emit('warn', source, message, data),
    error: (message, error) => emit('error', source, message, error),
    serviceError({ service, operation, status, error }) {
      const label = status === undefined ? '' : ` (HTTP ${status})`
      emit('error', source, `${service}.${operation} failed${label}`, error)
    },
  }
}

export const logger: Logger = createLogger()
