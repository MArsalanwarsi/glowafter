import { naturePresets } from './nature'
import { PresetRecipe, PresetFamily } from './types'
import { originalsPresets } from './family-originals'
import { filmAndCameraPresets } from './family-film-and-camera'
import { paperAndFoldsPresets } from './family-paper-and-folds'
import { inkAndWaterPresets } from './family-ink-and-water'
import { pixelsAndAlgorithmsPresets } from './family-pixels-and-algorithms'
import { textileAndThreadPresets } from './family-textile-and-thread'
import { glassAndOpticsPresets } from './family-glass-and-optics'
import { mechanicalMotionPresets } from './family-mechanical-motion'
import { nightSkyAndSpacePresets } from './family-night-sky-and-space'
import { soundAndSignalsPresets } from './family-sound-and-signals'
import { landscapeAndGrowthPresets } from './family-landscape-and-growth'
import { everydayObjectsPresets } from './family-everyday-objects'
import { typeAndPrintPresets } from './family-type-and-print'

export * from './types'

export const ALL_FAMILIES: Array<{ id: PresetFamily; label: string; count: number }> = [
  { id: 'originals', label: 'Originals', count: originalsPresets.length },
  { id: 'film-and-camera', label: 'Film & Camera', count: filmAndCameraPresets.length },
  { id: 'paper-and-folds', label: 'Paper & Folds', count: paperAndFoldsPresets.length },
  { id: 'ink-and-water', label: 'Ink & Water', count: inkAndWaterPresets.length },
  { id: 'pixels-and-algorithms', label: 'Pixels & Algorithms', count: pixelsAndAlgorithmsPresets.length },
  { id: 'textile-and-thread', label: 'Textile & Thread', count: textileAndThreadPresets.length },
  { id: 'glass-and-optics', label: 'Glass & Optics', count: glassAndOpticsPresets.length },
  { id: 'mechanical-motion', label: 'Mechanical Motion', count: mechanicalMotionPresets.length },
  { id: 'night-sky-and-space', label: 'Night Sky & Space', count: nightSkyAndSpacePresets.length },
  { id: 'sound-and-signals', label: 'Sound & Signals', count: soundAndSignalsPresets.length },
  { id: 'landscape-and-growth', label: 'Landscape & Growth', count: landscapeAndGrowthPresets.length },
  { id: 'everyday-objects', label: 'Everyday Objects', count: everydayObjectsPresets.length },
  { id: 'type-and-print', label: 'Type & Print', count: typeAndPrintPresets.length },
]

export const ALL_PRESETS: PresetRecipe[] = [
  ...originalsPresets,
  ...filmAndCameraPresets,
  ...paperAndFoldsPresets,
  ...inkAndWaterPresets,
  ...pixelsAndAlgorithmsPresets,
  ...textileAndThreadPresets,
  ...glassAndOpticsPresets,
  ...mechanicalMotionPresets,
  ...nightSkyAndSpacePresets,
  ...soundAndSignalsPresets,
  ...landscapeAndGrowthPresets,
  ...everydayObjectsPresets,
  ...typeAndPrintPresets,
]

export const PRESET_REGISTRY = new Map<string, PresetRecipe>(
  [...ALL_PRESETS, ...naturePresets].map((preset) => [preset.id, preset])
)

export const getPresetById = (id: string): PresetRecipe | undefined => {
  return PRESET_REGISTRY.get(id)
}

export const FEATURED_PRESETS = [...naturePresets, originalsPresets.find(p => p.supportsGif)!]
