import { configureLogger, createLogger, logger, type LogLevel, type LogsMode } from './logger'
import { Exporter } from './otlp'
import { instrumentFetch, type PropagationTarget } from './tracing'

export type ObservabilityOptions = {
  serviceName: string
  serviceVersion?: string
  environment?: string
  endpoint?: string
  headers?: Record<string, string>
  mode?: LogsMode
  exportLevel?: LogLevel
  propagateTo?: PropagationTarget[]
  sampleRate?: number
  flushIntervalMs?: number
}

export type Observability = {
  shutdown(): Promise<void>
}

export function initObservability(options: ObservabilityOptions): Observability {
  configureLogger({ mode: options.mode ?? 'activated', exportLevel: options.exportLevel ?? 'warn' })

  if (!options.endpoint || options.mode === 'deactivated') {
    return { shutdown: async () => undefined }
  }

  const exporter = new Exporter({
    endpoint: options.endpoint,
    headers: options.headers,
    flushIntervalMs: options.flushIntervalMs,
    resource: {
      'service.name': options.serviceName,
      'service.namespace': 'solaria',
      'service.version': options.serviceVersion,
      'deployment.environment': options.environment ?? 'local',
      'telemetry.sdk.language': 'webjs',
    },
  })
  configureLogger({ exporter })

  const restoreFetch = instrumentFetch({
    exporter,
    propagateTo: options.propagateTo,
    sampleRate: options.sampleRate,
  })

  const onError = (event: ErrorEvent) => logger.error('Uncaught error', event.error ?? event.message)
  const onRejection = (event: PromiseRejectionEvent) => logger.error('Unhandled rejection', event.reason)
  const onHidden = () => {
    if (document.visibilityState === 'hidden') void exporter.flush()
  }
  globalThis.addEventListener?.('error', onError)
  globalThis.addEventListener?.('unhandledrejection', onRejection)
  globalThis.document?.addEventListener('visibilitychange', onHidden)

  return {
    async shutdown() {
      restoreFetch()
      globalThis.removeEventListener?.('error', onError)
      globalThis.removeEventListener?.('unhandledrejection', onRejection)
      globalThis.document?.removeEventListener('visibilitychange', onHidden)
      configureLogger({ exporter: undefined })
      await exporter.shutdown()
    },
  }
}

export { createLogger, logger }
export type { LogLevel, LogsMode, Logger, ServiceErrorContext } from './logger'
export type { PropagationTarget } from './tracing'
