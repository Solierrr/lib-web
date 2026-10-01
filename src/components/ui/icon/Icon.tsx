import {
  Building2,
  ChevronDown,
  ChevronLeft,
  Eye,
  EyeOff,
  Globe,
  Heart,
  Home,
  LoaderCircle,
  Search,
  Settings,
  ShoppingCart,
  User,
  X,
  type LucideIcon,
} from 'lucide-react'

const icons = {
  home: Home,
  user: User,
  settings: Settings,
  search: Search,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  x: X,
  eye: Eye,
  eyeOff: EyeOff,
  shoppingCart: ShoppingCart,
  globe: Globe,
  heart: Heart,
  loader: LoaderCircle,
  building: Building2,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof icons

export interface IconProps {
  name: IconName
  color?: string
  size?: number
  strokeWidth?: number
  absoluteStrokeWidth?: boolean
  className?: string
}

export function Icon({ name, color = 'var(--color-black)', size = 24, strokeWidth = 2, absoluteStrokeWidth = false, className }: IconProps) {
  const IconComponent = icons[name]
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} absoluteStrokeWidth={absoluteStrokeWidth} className={className} />
}

export default Icon
