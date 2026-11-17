import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { ALL_PRESETS } from '../src/presets/index'
import { MockCanvasRenderingContext2D } from './helpers/canvas-mock'

describe('Tier 4: Real-World Canvas Preview Simulation', () => {
  const PROGRESS_STEPS = [0, 0.25, 0.5, 0.75, 1.0]
  const PREVIEW_SIZES = [
    { name: 'Card Thumbnail', w: 300, h: 180 },
    { name: 'Square Container', w: 400, h: 400 },
    { name: 'Wide HD Preview', w: 800, h: 450 },
  ]

  describe('Canvas Render Execution & Coordinate Integrity', () => {
    for (const preset of ALL_PRESETS) {
      test(`[${preset.numId}] ${preset.id}: renders across all t steps, light & dark modes with zero errors and valid coords`, () => {
        for (const size of PREVIEW_SIZES) {
          for (const isDark of [false, true]) {
            for (const t of PROGRESS_STEPS) {
              const ctx = new MockCanvasRenderingContext2D(size.w, size.h)

              try {
                preset.renderPreview(
                  ctx as unknown as CanvasRenderingContext2D,
                  size.w,
                  size.h,
                  t,
                  isDark,
                  '#6366f1'
                )
              } catch (err: any) {
                assert.fail(
                  `Preset ${preset.id} threw an unhandled exception at t=${t}, isDark=${isDark}, size=${size.name}: ${err?.message || err}`
                )
              }

              // Check for NaN or non-finite numbers passed to canvas methods
              assert.strictEqual(
                ctx.errors.length,
                0,
                `Preset ${preset.id} passed invalid arguments or caused errors at t=${t}, isDark=${isDark}: ${ctx.errors.join('; ')}`
              )

              // Check save/restore balance to ensure no leaked transformations or clip paths
              assert.strictEqual(
                ctx.stackDepth,
                0,
                `Preset ${preset.id} has unbalanced save()/restore() calls at t=${t}, isDark=${isDark}. Remaining stack depth: ${ctx.stackDepth}`
              )
            }
          }
        }
      })
    }
  })

  describe('Zero Premature Solid Fill at t = 0', () => {
    for (const preset of ALL_PRESETS) {
      test(`[${preset.numId}] ${preset.id}: does not draw permanent solid full-screen fill at t = 0`, () => {
        for (const isDark of [false, true]) {
          const w = 300
          const h = 180
          const ctx = new MockCanvasRenderingContext2D(w, h)

          try {
            preset.renderPreview(
              ctx as unknown as CanvasRenderingContext2D,
              w,
              h,
              0,
              isDark,
              '#6366f1'
            )
          } catch (err: any) {
            assert.fail(
              `Preset ${preset.id} threw at t=0, isDark=${isDark}: ${err?.message || err}`
            )
          }

          const hasSolidFill = ctx.hasPermanentSolidFillAtT0(w, h)
          assert.strictEqual(
            hasSolidFill,
            false,
            `Preset ${preset.id} drawn permanent solid fullscreen fill across entire canvas at t = 0 (isDark=${isDark})`
          )
        }
      })
    }
  })

  describe('Accent Color Support & Robustness', () => {
    test('All presets handle missing (undefined) accentColor without error', () => {
      const w = 300
      const h = 180
      for (const preset of ALL_PRESETS) {
        for (const t of [0, 0.5, 1.0]) {
          const ctx = new MockCanvasRenderingContext2D(w, h)
          assert.doesNotThrow(
            () => {
              preset.renderPreview(
                ctx as unknown as CanvasRenderingContext2D,
                w,
                h,
                t,
                true,
                undefined
              )
            },
            `Preset ${preset.id} failed when accentColor is undefined at t=${t}`
          )
        }
      }
    })
  })
})
