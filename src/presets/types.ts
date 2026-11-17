export enum ThemeAnimationType {
  CIRCLE = 'circle',
  BLUR_CIRCLE = 'blur-circle',
  QR_SCAN = 'qr-scan',
  POLYGON = 'polygon',
  POLYGON_GRADIENT = 'polygon-gradient',
  GIF = 'gif',
}

export enum ThemeAnimationDirection {
  LTR = 'ltr',
  RTL = 'rtl',
  TTB = 'ttb',
  BTT = 'btt',
}

export type PresetFamily =
  | 'originals'
  | 'film-and-camera'
  | 'paper-and-folds'
  | 'ink-and-water'
  | 'pixels-and-algorithms'
  | 'textile-and-thread'
  | 'glass-and-optics'
  | 'mechanical-motion'
  | 'night-sky-and-space'
  | 'sound-and-signals'
  | 'landscape-and-growth'
  | 'everyday-objects'
  | 'type-and-print'

export interface PresetContext {
  x: number
  y: number
  width: number
  height: number
  maxRadius: number
  isDarkMode: boolean
  direction?: ThemeAnimationDirection | `${ThemeAnimationDirection}`
  duration: number
  easing: string
  accentColor?: string
}

export interface PresetRecipe {
  id: string
  numId: string
  name: string
  family: PresetFamily
  description: string
  motionKeywords: string[]
  defaultDuration: number
  defaultEasing: string
  supportsDirection?: boolean
  supportsOrigin?: boolean
  supportsBlur?: boolean
  supportsGif?: boolean
  originalType?: ThemeAnimationType
  revealPath?: (width: number, height: number, progress: number) => string
  // Generates canvas drawing at progress t in [0, 1]
  renderPreview: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    t: number,
    isDark: boolean,
    accentColor?: string
  ) => void
  // Generates CSS / SVG mask / keyframe rules for View Transition API
  generateStyle?: (ctx: PresetContext) => string
}

export interface PresetRegistryEntry {
  id: string
  recipe: PresetRecipe
}
