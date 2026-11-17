import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { ALL_PRESETS, ALL_FAMILIES } from '../src/presets/index'
import { PresetRecipe, PresetFamily } from '../src/presets/types'
import { analyzePresetCss } from './helpers/css-analyzer'
import { createStandardContext } from './helpers/test-context'

describe('Tier 1: Feature Coverage (All 114 Presets)', () => {
  const stdContext = createStandardContext()

  test('Catalog Integrity: Exactly 114 presets exist across 13 families', () => {
    assert.strictEqual(
      ALL_PRESETS.length,
      114,
      `Expected exactly 114 presets, got ${ALL_PRESETS.length}`
    )

    const expectedFamilies: PresetFamily[] = [
      'originals',
      'film-and-camera',
      'paper-and-folds',
      'ink-and-water',
      'pixels-and-algorithms',
      'textile-and-thread',
      'glass-and-optics',
      'mechanical-motion',
      'night-sky-and-space',
      'sound-and-signals',
      'landscape-and-growth',
      'everyday-objects',
      'type-and-print',
    ]

    assert.strictEqual(
      ALL_FAMILIES.length,
      expectedFamilies.length,
      `Expected ${expectedFamilies.length} families in ALL_FAMILIES, got ${ALL_FAMILIES.length}`
    )

    for (const fam of ALL_FAMILIES) {
      assert.ok(
        expectedFamilies.includes(fam.id),
        `Unexpected family id: ${fam.id}`
      )
      const countInPresets = ALL_PRESETS.filter((p) => p.family === fam.id).length
      assert.strictEqual(
        fam.count,
        countInPresets,
        `Family ${fam.id} metadata count (${fam.count}) does not match presets count (${countInPresets})`
      )
    }
  })

  test('Catalog Integrity: Unique IDs and numeric IDs', () => {
    const ids = new Set<string>()
    const numIds = new Set<string>()

    for (const preset of ALL_PRESETS) {
      assert.ok(preset.id, `Preset missing id`)
      assert.ok(preset.numId, `Preset ${preset.id} missing numId`)

      assert.ok(
        !ids.has(preset.id),
        `Duplicate preset id detected: ${preset.id}`
      )
      ids.add(preset.id)

      assert.ok(
        !numIds.has(preset.numId),
        `Duplicate preset numId detected: ${preset.numId} (${preset.id})`
      )
      numIds.add(preset.numId)
    }
  })

  test('Catalog Integrity: Every preset has required metadata fields', () => {
    for (const preset of ALL_PRESETS) {
      assert.ok(
        preset.name && preset.name.trim().length > 0,
        `Preset ${preset.id} missing name`
      )
      assert.ok(
        preset.description && preset.description.trim().length > 0,
        `Preset ${preset.id} missing description`
      )
      assert.ok(
        Array.isArray(preset.motionKeywords) && preset.motionKeywords.length > 0,
        `Preset ${preset.id} missing motionKeywords`
      )
      assert.ok(
        typeof preset.defaultDuration === 'number' && preset.defaultDuration > 0,
        `Preset ${preset.id} has invalid defaultDuration: ${preset.defaultDuration}`
      )
      assert.ok(
        typeof preset.defaultEasing === 'string' &&
          preset.defaultEasing.trim().length > 0,
        `Preset ${preset.id} missing defaultEasing`
      )
      assert.strictEqual(
        typeof preset.renderPreview,
        'function',
        `Preset ${preset.id} missing renderPreview function`
      )
      assert.strictEqual(
        typeof preset.generateStyle,
        'function',
        `Preset ${preset.id} missing generateStyle function`
      )
    }
  })

  describe('CSS Generation & Pseudo-Element Targeting', () => {
    for (const preset of ALL_PRESETS) {
      test(`[${preset.numId}] ${preset.id}: generates CSS with View Transition pseudo-element`, () => {
        const css = preset.generateStyle!(stdContext)
        assert.ok(
          css && typeof css === 'string' && css.trim().length > 0,
          `Preset ${preset.id} generateStyle returned empty CSS`
        )

        const analysis = analyzePresetCss(css)
        assert.ok(
          analysis.hasViewTransitionTarget,
          `Preset ${preset.id} CSS does not target ::view-transition-new(root) or ::view-transition-old(root)`
        )
      })
    }
  })

  describe('Fill Mode & Will-Change Declarations', () => {
    for (const preset of ALL_PRESETS) {
      test(`[${preset.numId}] ${preset.id}: specifies animation-fill-mode: both`, () => {
        const css = preset.generateStyle!(stdContext)
        const analysis = analyzePresetCss(css)
        assert.ok(
          analysis.hasFillModeBoth,
          `Preset ${preset.id} CSS missing animation-fill-mode: both`
        )
      })

      test(`[${preset.numId}] ${preset.id}: declares will-change optimization`, () => {
        const css = preset.generateStyle!(stdContext)
        const analysis = analyzePresetCss(css)
        assert.ok(
          analysis.hasWillChange,
          `Preset ${preset.id} CSS missing will-change property`
        )
      })
    }
  })

  describe('Shape Compatibility & Vertex Count Integrity', () => {
    for (const preset of ALL_PRESETS) {
      test(`[${preset.numId}] ${preset.id}: matching shape functions and polygon vertex counts`, () => {
        const css = preset.generateStyle!(stdContext)
        const analysis = analyzePresetCss(css)

        // Basic shape type consistency
        assert.strictEqual(
          analysis.shapeMismatches.length,
          0,
          `Preset ${preset.id} has incompatible basic shapes in @keyframes: ${analysis.shapeMismatches
            .map((m) => m.details)
            .join('; ')}`
        )

        // Polygon vertex count consistency
        assert.strictEqual(
          analysis.vertexMismatches.length,
          0,
          `Preset ${preset.id} has polygon vertex count mismatches: ${analysis.vertexMismatches
            .map((m) => m.details)
            .join('; ')}`
        )
      })
    }
  })
})
