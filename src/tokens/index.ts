import values from './tokens.json' with { type: 'json' }

export const theme = { ...values } as const
export const tailwindTheme = `@theme {\n${Object.entries(theme).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`
export const designTokens = {
  colors: {
    orange: theme['--color-orange'],
    white: theme['--color-white'],
    black: theme['--color-black'],
    gray: theme['--color-gray'],
    hyperlink: theme['--color-hyperlink'],
    surface: theme['--color-operational-surface'],
    border: theme['--color-border'],
  },
  radius: { medium: theme['--radius-medium'], hard: theme['--radius-hard'] },
  typography: {
    fontFamily: theme['--font-ui'],
    body: theme['--text-body'],
    semibold: Number(theme['--font-weight-semi-bold']),
  },
} as const
