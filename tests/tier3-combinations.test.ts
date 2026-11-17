import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { ALL_PRESETS } from '../src/presets/index'
import { ThemeAnimationDirection } from '../src/presets/types'
import { createStandardContext } from './helpers/test-context'

describe('Tier 3: Cross-Feature Combinations', () => {
  const combinationMatrix = [
    {
      name: 'Top-Left Corner + Custom Bezier + Fast Duration (Dark Mode)',
      overrides: {
        x: 0,
        y: 0,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        duration: 350,
        isDarkMode: true,
        direction: ThemeAnimationDirection.LTR,
      },
    },
    {
      name: 'Bottom-Right Corner + Linear Easing + Long Duration (Light Mode)',
      overrides: {
        x: 1920,
        y: 1080,
        easing: 'linear',
        duration: 2200,
        isDarkMode: false,
        direction: ThemeAnimationDirection.RTL,
      },
    },
    {
      name: 'Center Origin + Stepped Easing + Mid Duration (TTB Direction)',
      overrides: {
        x: 960,
        y: 540,
        easing: 'steps(4, jump-end)',
        duration: 1200,
        isDarkMode: true,
        direction: ThemeAnimationDirection.TTB,
      },
    },
    {
      name: 'Subpixel Offset + Complex Spring Easing + Extreme Duration',
      overrides: {
        x: 42.7,
        y: 99.3,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        duration: 1850,
        isDarkMode: false,
        direction: ThemeAnimationDirection.BTT,
      },
    },
  ]

  for (const combo of combinationMatrix) {
    test(`Combination: ${combo.name}`, () => {
      const ctx = createStandardContext(combo.overrides)

      for (const preset of ALL_PRESETS) {
        const css = preset.generateStyle!(ctx)

        assert.ok(
          css && css.trim().length > 0,
          `Preset ${preset.id} failed to generate CSS for combination ${combo.name}`
        )
        assert.ok(
          !css.includes('NaN'),
          `Preset ${preset.id} generated NaN for combination ${combo.name}`
        )
        assert.ok(
          !css.includes('undefined'),
          `Preset ${preset.id} generated undefined for combination ${combo.name}`
        )

        // Easing interpolation verification
        assert.ok(
          css.includes(combo.overrides.easing),
          `Preset ${preset.id} did not propagate custom easing "${combo.overrides.easing}" into generated CSS`
        )

        // Duration interpolation verification
        assert.ok(
          css.includes(`${combo.overrides.duration}ms`),
          `Preset ${preset.id} did not propagate custom duration "${combo.overrides.duration}ms" into generated CSS`
        )
      }
    })
  }

  describe('Rapid Sequential Switching & Statelessness', () => {
    test('Rapid consecutive alternating theme switches remain deterministic and stateless', () => {
      const iterations = 50

      for (const preset of ALL_PRESETS) {
        const prevCss = ''
        for (let i = 0; i < iterations; i++) {
          const isDark = i % 2 === 0
          const x = (i * 37) % 1920
          const y = (i * 29) % 1080
          const ctx = createStandardContext({
            isDarkMode: isDark,
            x,
            y,
            duration: 600,
            easing: 'ease-in-out',
          })

          const css = preset.generateStyle!(ctx)
          assert.ok(
            css && css.trim().length > 0,
            `Preset ${preset.id} failed at iteration ${i}`
          )
          assert.ok(!css.includes('NaN'))

          // Verify that calling again with exact same context produces identical CSS
          const cssAgain = preset.generateStyle!(ctx)
          assert.strictEqual(
            css,
            cssAgain,
            `Preset ${preset.id} is non-deterministic or mutates internal state across calls`
          )
        }
      }
    })
  })
})
