import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { ALL_PRESETS } from '../src/presets/index'
import { ThemeAnimationDirection } from '../src/presets/types'
import {
  createStandardContext,
  CORNER_ORIGINS,
  TEST_VIEWPORTS,
  TEST_DIRECTIONS,
} from './helpers/test-context'

describe('Tier 2: Boundary & Corner Cases', () => {
  describe('Origin Support & Corner Coordinates', () => {
    for (const corner of CORNER_ORIGINS) {
      test(`All presets generate valid CSS at origin ${corner.name}`, () => {
        for (const preset of ALL_PRESETS) {
          const ctx = createStandardContext({ x: corner.x, y: corner.y })
          const css = preset.generateStyle!(ctx)

          assert.ok(css && css.trim().length > 0, `Preset ${preset.id} returned empty CSS`)
          assert.ok(
            !css.includes('NaN'),
            `Preset ${preset.id} CSS contains NaN at origin ${corner.name}`
          )
          assert.ok(
            !css.includes('undefined'),
            `Preset ${preset.id} CSS contains undefined at origin ${corner.name}`
          )
        }
      })
    }

    test('Presets with supportsOrigin=true reflect origin coordinates in CSS', () => {
      const originPresets = ALL_PRESETS.filter((p) => p.supportsOrigin)
      assert.ok(
        originPresets.length > 0,
        'Expected at least some presets to support origin'
      )

      const testX = 345
      const testY = 678
      const ctx = createStandardContext({ x: testX, y: testY })

      for (const preset of originPresets) {
        const css = preset.generateStyle!(ctx)
        const hasX = css.includes(`${testX}px`) || css.includes(`${testX}`)
        const hasY = css.includes(`${testY}px`) || css.includes(`${testY}`)
        assert.ok(
          hasX && hasY,
          `Preset ${preset.id} marked supportsOrigin=true but generated CSS does not incorporate (${testX}, ${testY})`
        )
      }
    })
  })

  describe('Direction Handling (LTR, RTL, TTB, BTT)', () => {
    for (const dir of TEST_DIRECTIONS) {
      test(`All presets generate valid CSS under direction: ${dir}`, () => {
        for (const preset of ALL_PRESETS) {
          const ctx = createStandardContext({ direction: dir })
          const css = preset.generateStyle!(ctx)
          assert.ok(css && css.trim().length > 0)
          assert.ok(!css.includes('NaN'))
          assert.ok(!css.includes('undefined'))
        }
      })
    }

    test('Presets with supportsDirection=true produce distinct CSS across opposite directions', () => {
      const dirPresets = ALL_PRESETS.filter((p) => p.supportsDirection)
      for (const preset of dirPresets) {
        const ctxLtr = createStandardContext({ direction: ThemeAnimationDirection.LTR })
        const ctxRtl = createStandardContext({ direction: ThemeAnimationDirection.RTL })
        const cssLtr = preset.generateStyle!(ctxLtr)
        const cssRtl = preset.generateStyle!(ctxRtl)

        assert.notStrictEqual(
          cssLtr.trim(),
          cssRtl.trim(),
          `Preset ${preset.id} marked supportsDirection=true but produced identical CSS for LTR and RTL`
        )
      }
    })

    test('Original preset QR Scan honors ctx.direction', () => {
      const qrScan = ALL_PRESETS.find((p) => p.id === 'qr-scan')
      assert.ok(qrScan, 'QR Scan preset must exist')

      const ctxLtr = createStandardContext({ direction: ThemeAnimationDirection.LTR })
      const ctxRtl = createStandardContext({ direction: ThemeAnimationDirection.RTL })
      const ctxTtb = createStandardContext({ direction: ThemeAnimationDirection.TTB })
      const ctxBtt = createStandardContext({ direction: ThemeAnimationDirection.BTT })

      const cssLtr = qrScan.generateStyle!(ctxLtr)
      const cssRtl = qrScan.generateStyle!(ctxRtl)
      const cssTtb = qrScan.generateStyle!(ctxTtb)
      const cssBtt = qrScan.generateStyle!(ctxBtt)

      assert.notStrictEqual(
        cssLtr.trim(),
        cssRtl.trim(),
        'QR Scan must produce different CSS for LTR vs RTL'
      )
      assert.notStrictEqual(
        cssTtb.trim(),
        cssBtt.trim(),
        'QR Scan must produce different CSS for TTB vs BTT'
      )
    })
  })

  describe('Duration Limits & Interpolation', () => {
    const testDurations = [250, 500, 750, 1500, 2500]

    for (const duration of testDurations) {
      test(`All presets correctly interpolate ${duration}ms duration in CSS`, () => {
        const ctx = createStandardContext({ duration })
        for (const preset of ALL_PRESETS) {
          const css = preset.generateStyle!(ctx)
          assert.ok(
            css.includes(`${duration}ms`) || css.includes(`${duration / 1000}s`),
            `Preset ${preset.id} did not interpolate ${duration}ms into generated CSS`
          )
        }
      })
    }

    test('All presets handle zero duration (0ms) gracefully without error', () => {
      const ctx = createStandardContext({ duration: 0 })
      for (const preset of ALL_PRESETS) {
        const css = preset.generateStyle!(ctx)
        assert.ok(css && css.trim().length > 0)
        assert.ok(!css.includes('NaN'))
      }
    })
  })

  describe('Extreme Viewport Dimensions', () => {
    for (const vp of TEST_VIEWPORTS) {
      test(`All presets generate valid CSS on viewport: ${vp.name} (${vp.width}x${vp.height})`, () => {
        const ctx = createStandardContext({
          width: vp.width,
          height: vp.height,
          x: vp.width / 2,
          y: vp.height / 2,
        })

        for (const preset of ALL_PRESETS) {
          const css = preset.generateStyle!(ctx)
          assert.ok(css && css.trim().length > 0)
          assert.ok(
            !css.includes('NaN'),
            `Preset ${preset.id} produced NaN on viewport ${vp.name}`
          )
          assert.ok(
            !css.includes('Infinity'),
            `Preset ${preset.id} produced Infinity on viewport ${vp.name}`
          )
        }
      })
    }
  })
})
