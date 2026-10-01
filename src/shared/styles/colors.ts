const Colors = {
  WHITE: 'var(--color-white)',
  GRAY: 'var(--color-gray)',
  BLACK: 'var(--color-black)',
  ORANGE: 'var(--color-orange)',
  GREEN: 'var(--color-green)',
  INPUTICON: 'var(--color-input-icon)',
  HYPERLINK: 'var(--color-hyperlink)',
} as const

export default Colors
export type Color = (typeof Colors)[keyof typeof Colors]
