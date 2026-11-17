/**
 * Unified Test Runner for theme-switch-animations
 * Validates all 114 animations across 4 Tiers:
 *   Tier 1: Feature Coverage (Metadata, CSS generation, fill-mode, will-change, shapes & vertex counts)
 *   Tier 2: Boundary & Corner Cases (Origins, directions, duration limits, extreme viewports)
 *   Tier 3: Cross-Feature Combinations (Custom easing, durations, rapid theme switching)
 *   Tier 4: Real-World Simulation (Canvas renderPreview t=0..1, dark/light, valid coords, no t=0 solid fill)
 *
 * Usage:
 *   npx tsx tests/run-all.ts
 *   npx tsx tests/run-all.ts --tier=1
 *   npx tsx tests/run-all.ts --json
 */

import { ALL_PRESETS, ALL_FAMILIES } from '../src/presets/index'
import { ThemeAnimationDirection } from '../src/presets/types'
import { analyzePresetCss } from './helpers/css-analyzer'
import { MockCanvasRenderingContext2D } from './helpers/canvas-mock'
import {
  createStandardContext,
  CORNER_ORIGINS,
  TEST_VIEWPORTS,
  TEST_DIRECTIONS,
} from './helpers/test-context'

interface TestResult {
  tier: string
  suite: string
  name: string
  presetId?: string
  presetNumId?: string
  family?: string
  passed: boolean
  error?: string
}

const results: TestResult[] = []

function recordTest(result: TestResult) {
  results.push(result)
}

function runTier1() {
  console.log('\n--- Running Tier 1: Feature Coverage ---')
  const stdContext = createStandardContext()

  // Catalog count
  const countPassed = ALL_PRESETS.length === 114
  recordTest({
    tier: 'Tier 1',
    suite: 'Catalog Integrity',
    name: 'Exactly 114 presets registered',
    passed: countPassed,
    error: countPassed ? undefined : `Expected 114 presets, found ${ALL_PRESETS.length}`,
  })

  // Check unique IDs
  const idSet = new Set<string>()
  const numIdSet = new Set<string>()
  let uniquePassed = true
  let idError = ''
  for (const p of ALL_PRESETS) {
    if (idSet.has(p.id)) {
      uniquePassed = false
      idError = `Duplicate id: ${p.id}`
      break
    }
    idSet.add(p.id)
    if (numIdSet.has(p.numId)) {
      uniquePassed = false
      idError = `Duplicate numId: ${p.numId}`
      break
    }
    numIdSet.add(p.numId)
  }
  recordTest({
    tier: 'Tier 1',
    suite: 'Catalog Integrity',
    name: 'Unique preset IDs and numeric IDs',
    passed: uniquePassed,
    error: uniquePassed ? undefined : idError,
  })

  // Validate every preset's CSS generation, fill-mode, will-change, and keyframe shapes
  for (const p of ALL_PRESETS) {
    let css: string
    try {
      css = p.generateStyle!(stdContext)
    } catch (e: any) {
      recordTest({
        tier: 'Tier 1',
        suite: 'CSS Generation',
        name: `[${p.numId}] ${p.id}: generateStyle executes without exception`,
        presetId: p.id,
        presetNumId: p.numId,
        family: p.family,
        passed: false,
        error: `Threw exception: ${e?.message || e}`,
      })
      continue
    }

    const analysis = analyzePresetCss(css)

    // View Transition Pseudo Target
    recordTest({
      tier: 'Tier 1',
      suite: 'View Transition Target',
      name: `[${p.numId}] ${p.id}: targets ::view-transition-new/old(root)`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: analysis.hasViewTransitionTarget,
      error: analysis.hasViewTransitionTarget
        ? undefined
        : 'Missing ::view-transition-new(root) or ::view-transition-old(root)',
    })

    // Animation fill mode: both
    recordTest({
      tier: 'Tier 1',
      suite: 'Fill Mode Declaration',
      name: `[${p.numId}] ${p.id}: specifies animation-fill-mode: both`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: analysis.hasFillModeBoth,
      error: analysis.hasFillModeBoth ? undefined : 'Missing animation-fill-mode: both',
    })

    // will-change optimization
    recordTest({
      tier: 'Tier 1',
      suite: 'GPU / will-change Promotion',
      name: `[${p.numId}] ${p.id}: declares will-change optimization`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: analysis.hasWillChange,
      error: analysis.hasWillChange ? undefined : 'Missing will-change declaration',
    })

    // Shape Function Compatibility
    const shapeOk = analysis.shapeMismatches.length === 0
    recordTest({
      tier: 'Tier 1',
      suite: 'Shape Compatibility',
      name: `[${p.numId}] ${p.id}: basic shape functions match across stops`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: shapeOk,
      error: shapeOk ? undefined : analysis.shapeMismatches.map((m) => m.details).join('; '),
    })

    // Polygon Vertex Count Integrity
    const vertexOk = analysis.vertexMismatches.length === 0
    recordTest({
      tier: 'Tier 1',
      suite: 'Polygon Vertex Matching',
      name: `[${p.numId}] ${p.id}: polygon vertex count matches across stops`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: vertexOk,
      error: vertexOk ? undefined : analysis.vertexMismatches.map((m) => m.details).join('; '),
    })
  }
}

function runTier2() {
  console.log('\n--- Running Tier 2: Boundary & Corner Cases ---')

  // Corner origins
  for (const corner of CORNER_ORIGINS) {
    let allValid = true
    let firstError = ''

    for (const p of ALL_PRESETS) {
      const ctx = createStandardContext({ x: corner.x, y: corner.y })
      const css = p.generateStyle!(ctx)
      if (!css || css.includes('NaN') || css.includes('undefined')) {
        allValid = false
        firstError = `Preset ${p.id} produced invalid CSS at ${corner.name}`
        break
      }
    }

    recordTest({
      tier: 'Tier 2',
      suite: 'Origin Boundaries',
      name: `All presets generate valid CSS at ${corner.name}`,
      passed: allValid,
      error: allValid ? undefined : firstError,
    })
  }

  // supportsOrigin coordinates reflection
  const originPresets = ALL_PRESETS.filter((p) => p.supportsOrigin)
  const testX = 345
  const testY = 678
  const originCtx = createStandardContext({ x: testX, y: testY })
  for (const p of originPresets) {
    const css = p.generateStyle!(originCtx)
    const hasCoords =
      (css.includes(`${testX}px`) || css.includes(`${testX}`)) &&
      (css.includes(`${testY}px`) || css.includes(`${testY}`))
    recordTest({
      tier: 'Tier 2',
      suite: 'Origin Reflection',
      name: `[${p.numId}] ${p.id}: reflects (x, y) coordinates into CSS`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: hasCoords,
      error: hasCoords
        ? undefined
        : `Marked supportsOrigin=true but CSS does not contain (${testX}, ${testY})`,
    })
  }

  // Direction handling
  for (const dir of TEST_DIRECTIONS) {
    let dirValid = true
    let firstError = ''
    for (const p of ALL_PRESETS) {
      const ctx = createStandardContext({ direction: dir })
      const css = p.generateStyle!(ctx)
      if (!css || css.includes('NaN')) {
        dirValid = false
        firstError = `Preset ${p.id} failed for direction ${dir}`
        break
      }
    }
    recordTest({
      tier: 'Tier 2',
      suite: 'Direction Handling',
      name: `All presets valid under direction ${dir}`,
      passed: dirValid,
      error: dirValid ? undefined : firstError,
    })
  }

  // QR Scan direction support
  const qrScan = ALL_PRESETS.find((p) => p.id === 'qr-scan')
  if (qrScan) {
    const cssLtr = qrScan.generateStyle!(createStandardContext({ direction: ThemeAnimationDirection.LTR }))
    const cssRtl = qrScan.generateStyle!(createStandardContext({ direction: ThemeAnimationDirection.RTL }))
    const qrOk = cssLtr.trim() !== cssRtl.trim()
    recordTest({
      tier: 'Tier 2',
      suite: 'Direction Handling',
      name: '[orig-03] qr-scan: differentiates LTR vs RTL directions',
      presetId: qrScan.id,
      presetNumId: qrScan.numId,
      family: qrScan.family,
      passed: qrOk,
      error: qrOk ? undefined : 'qr-scan produced identical CSS for LTR and RTL',
    })
  }

  // Duration interpolation
  for (const duration of [250, 750, 2500]) {
    const ctx = createStandardContext({ duration })
    for (const p of ALL_PRESETS) {
      const css = p.generateStyle!(ctx)
      const hasDur = css.includes(`${duration}ms`) || css.includes(`${duration / 1000}s`)
      recordTest({
        tier: 'Tier 2',
        suite: 'Duration Limits',
        name: `[${p.numId}] ${p.id}: interpolates duration ${duration}ms`,
        presetId: p.id,
        presetNumId: p.numId,
        family: p.family,
        passed: hasDur,
        error: hasDur ? undefined : `Missing ${duration}ms in CSS`,
      })
    }
  }

  // Extreme Viewports
  for (const vp of TEST_VIEWPORTS) {
    let vpValid = true
    let firstError = ''
    for (const p of ALL_PRESETS) {
      const ctx = createStandardContext({
        width: vp.width,
        height: vp.height,
        x: vp.width / 2,
        y: vp.height / 2,
      })
      const css = p.generateStyle!(ctx)
      if (!css || css.includes('NaN') || css.includes('Infinity')) {
        vpValid = false
        firstError = `Preset ${p.id} produced NaN/Infinity on ${vp.name}`
        break
      }
    }
    recordTest({
      tier: 'Tier 2',
      suite: 'Viewport Boundaries',
      name: `All presets generate valid CSS on ${vp.name} (${vp.width}x${vp.height})`,
      passed: vpValid,
      error: vpValid ? undefined : firstError,
    })
  }
}

function runTier3() {
  console.log('\n--- Running Tier 3: Cross-Feature Combinations ---')

  const combos = [
    {
      name: 'Custom Bezier Easing Propagation',
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      duration: 1420,
    },
    {
      name: 'Linear Easing Propagation',
      easing: 'linear',
      duration: 500,
    },
    {
      name: 'Stepped Easing Propagation',
      easing: 'steps(4, jump-end)',
      duration: 900,
    },
  ]

  for (const combo of combos) {
    const ctx = createStandardContext({ easing: combo.easing, duration: combo.duration })
    for (const p of ALL_PRESETS) {
      const css = p.generateStyle!(ctx)
      const hasEase = css.includes(combo.easing)
      recordTest({
        tier: 'Tier 3',
        suite: 'Custom Easing Combination',
        name: `[${p.numId}] ${p.id}: propagates custom easing "${combo.easing}"`,
        presetId: p.id,
        presetNumId: p.numId,
        family: p.family,
        passed: hasEase,
        error: hasEase ? undefined : `Custom easing "${combo.easing}" was ignored in generated CSS`,
      })
    }
  }

  // Rapid switching idempotency
  for (const p of ALL_PRESETS) {
    let idempotent = true
    let err = ''
    for (let i = 0; i < 20; i++) {
      const isDark = i % 2 === 0
      const ctx = createStandardContext({ isDarkMode: isDark, x: 200, y: 150 })
      const css1 = p.generateStyle!(ctx)
      const css2 = p.generateStyle!(ctx)
      if (css1 !== css2) {
        idempotent = false
        err = `Non-deterministic output on call ${i}`
        break
      }
    }
    recordTest({
      tier: 'Tier 3',
      suite: 'Rapid Switching Idempotency',
      name: `[${p.numId}] ${p.id}: deterministic under rapid sequential invocations`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: idempotent,
      error: idempotent ? undefined : err,
    })
  }
}

function runTier4() {
  console.log('\n--- Running Tier 4: Real-World Canvas Simulation ---')

  const PROGRESS_STEPS = [0, 0.25, 0.5, 0.75, 1.0]
  const w = 300
  const h = 180

  for (const p of ALL_PRESETS) {
    const previewErrors: string[] = []
    let leakedStack = false

    for (const isDark of [false, true]) {
      for (const t of PROGRESS_STEPS) {
        const ctx = new MockCanvasRenderingContext2D(w, h)
        try {
          p.renderPreview(ctx as any, w, h, t, isDark, '#6366f1')
          if (ctx.errors.length > 0) {
            previewErrors.push(...ctx.errors.map((e) => `[t=${t}, dark=${isDark}] ${e}`))
          }
          if (ctx.stackDepth !== 0) {
            leakedStack = true
            previewErrors.push(`[t=${t}, dark=${isDark}] Unbalanced save/restore (depth ${ctx.stackDepth})`)
          }
        } catch (e: any) {
          previewErrors.push(`[t=${t}, dark=${isDark}] Threw: ${e?.message || e}`)
        }
      }
    }

    const previewOk = previewErrors.length === 0
    recordTest({
      tier: 'Tier 4',
      suite: 'Canvas Simulation Execution',
      name: `[${p.numId}] ${p.id}: renders across t=0..1 with valid coords and balanced state`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: previewOk,
      error: previewOk ? undefined : previewErrors.join('; '),
    })

    // Premature solid fill at t = 0
    let solidFillAtT0 = false
    for (const isDark of [false, true]) {
      const ctx = new MockCanvasRenderingContext2D(w, h)
      try {
        p.renderPreview(ctx as any, w, h, 0, isDark, '#6366f1')
        if (ctx.hasPermanentSolidFillAtT0(w, h)) {
          solidFillAtT0 = true
        }
      } catch {
        // Handled in simulation execution test above
      }
    }

    recordTest({
      tier: 'Tier 4',
      suite: 'No Premature Solid Fill at t=0',
      name: `[${p.numId}] ${p.id}: does not draw premature solid fill across canvas at t=0`,
      presetId: p.id,
      presetNumId: p.numId,
      family: p.family,
      passed: !solidFillAtT0,
      error: solidFillAtT0 ? 'Premature solid full-screen fill detected at t = 0' : undefined,
    })
  }
}

export function executeFullSuite(): { passedCount: number; failedCount: number; totalCount: number } {
  const selectedTier = process.argv.find((a) => a.startsWith('--tier='))?.split('=')[1]

  if (!selectedTier || selectedTier === '1') runTier1()
  if (!selectedTier || selectedTier === '2') runTier2()
  if (!selectedTier || selectedTier === '3') runTier3()
  if (!selectedTier || selectedTier === '4') runTier4()

  const totalCount = results.length
  const passedCount = results.filter((r) => r.passed).length
  const failedCount = results.filter((r) => !r.passed).length

  console.log('\n======================================================')
  console.log(`TEST SUITE RESULTS: ${passedCount}/${totalCount} PASSED (${failedCount} FAILURES)`)
  console.log('======================================================\n')

  // Breakdown by Tier
  const tiers = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4']
  for (const t of tiers) {
    const tResults = results.filter((r) => r.tier === t)
    if (tResults.length === 0) continue
    const tPass = tResults.filter((r) => r.passed).length
    const tFail = tResults.filter((r) => !r.passed).length
    console.log(`${t}: ${tPass}/${tResults.length} passed (${tFail} failed)`)
  }

  // Breakdown of Failures by Category
  if (failedCount > 0) {
    console.log('\n--- DETAILED FAILURE SUMMARY BY PRESET ---')
    const failures = results.filter((r) => !r.passed)

    const failuresByPreset = new Map<string, string[]>()
    for (const f of failures) {
      const key = f.presetId ? `[${f.presetNumId}] ${f.presetId} (${f.family})` : f.suite
      if (!failuresByPreset.has(key)) {
        failuresByPreset.set(key, [])
      }
      failuresByPreset.get(key)!.push(`[${f.tier} - ${f.suite}] ${f.error || f.name}`)
    }

    for (const [preset, issues] of failuresByPreset.entries()) {
      console.log(`\n• ${preset}:`);
      for (const iss of issues) {
        console.log(`    - ${iss}`)
      }
    }
  }

  return { passedCount, failedCount, totalCount }
}

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('run-all.ts')) {
  const { failedCount } = executeFullSuite()
  if (failedCount > 0) {
    process.exit(1)
  }
}
