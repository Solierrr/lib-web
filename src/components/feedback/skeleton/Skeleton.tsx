import type { CSSProperties, HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
}

export function Skeleton({ width = '100%', height = '100%', className, style, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      className={`animate-pulse select-none rounded-medium bg-skeleton ${className ?? ''}`}
      aria-hidden="true"
      style={{ width, height, maxWidth: '100%', maxHeight: '100%', ...style }}
    />
  )
}

export default Skeleton
