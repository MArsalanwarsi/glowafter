import {
  PresetContext,
  ThemeAnimationDirection,
} from '../../src/presets/types'

export function createStandardContext(
  overrides?: Partial<PresetContext>
): PresetContext {
  const width = overrides?.width ?? 1920
  const height = overrides?.height ?? 1080
  const x = overrides?.x ?? width / 2
  const y = overrides?.y ?? height / 2

  return {
    x,
    y,
    width,
    height,
    maxRadius: Math.hypot(
      Math.max(x, width - x),
      Math.max(y, height - y)
    ),
    isDarkMode: overrides?.isDarkMode ?? true,
    duration: overrides?.duration ?? 750,
    easing: overrides?.easing ?? 'ease-in-out',
    direction: overrides?.direction ?? ThemeAnimationDirection.LTR,
    accentColor: overrides?.accentColor ?? '#6366f1',
    ...overrides,
  }
}

export const CORNER_ORIGINS = [
  { name: 'Top-Left (0, 0)', x: 0, y: 0 },
  { name: 'Subpixel Top-Left (1, 1)', x: 1, y: 1 },
  { name: 'Top-Right (w, 0)', x: 1920, y: 0 },
  { name: 'Bottom-Left (0, h)', x: 0, y: 1080 },
  { name: 'Bottom-Right (w, h)', x: 1920, y: 1080 },
  { name: 'Negative Offset (-50, -50)', x: -50, y: -50 },
  { name: 'Out of Bounds (w + 100, h + 100)', x: 2020, y: 1180 },
]

export const TEST_VIEWPORTS = [
  { name: 'Desktop Standard', width: 1920, height: 1080 },
  { name: 'Mobile Portrait (iPhone 14/15)', width: 390, height: 844 },
  { name: 'Mobile Landscape', width: 844, height: 390 },
  { name: 'Tablet Portrait (iPad Mini)', width: 768, height: 1024 },
  { name: 'Ultra-wide (32:9)', width: 3840, height: 1080 },
  { name: '4K UHD', width: 3840, height: 2160 },
  { name: 'Square Tiny Container', width: 50, height: 50 },
]

export const TEST_DIRECTIONS: ThemeAnimationDirection[] = [
  ThemeAnimationDirection.LTR,
  ThemeAnimationDirection.RTL,
  ThemeAnimationDirection.TTB,
  ThemeAnimationDirection.BTT,
]
