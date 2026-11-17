'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PresetRecipe } from '../../../src'

interface InteractivePreviewProps {
  recipe: PresetRecipe
  pageDarkMode: boolean
  duration: number
  easing: string
  accentColor?: string
  onSwitchPage: (buttonEl?: HTMLButtonElement | null) => void
}

function parseEasing(easingStr: string): (p: number) => number {
  const str = (easingStr || '').trim()
  if (!str || str === 'linear') {
    return (p: number) => p
  }

  if (str === 'ease') {
    return solveCubicBezier(0.25, 0.1, 0.25, 1.0)
  }
  if (str === 'ease-in') {
    return solveCubicBezier(0.42, 0.0, 1.0, 1.0)
  }
  if (str === 'ease-out') {
    return solveCubicBezier(0.0, 0.0, 0.58, 1.0)
  }
  if (str === 'ease-in-out') {
    return solveCubicBezier(0.42, 0.0, 0.58, 1.0)
  }

  const cubicMatch = str.match(
    /^cubic-bezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)$/i
  )
  if (cubicMatch) {
    const x1 = parseFloat(cubicMatch[1])
    const y1 = parseFloat(cubicMatch[2])
    const x2 = parseFloat(cubicMatch[3])
    const y2 = parseFloat(cubicMatch[4])
    return solveCubicBezier(x1, y1, x2, y2)
  }

  const stepsMatch = str.match(
    /^steps\(\s*(\d+)(?:\s*,\s*(start|end|jump-start|jump-end|jump-none|jump-both))?\s*\)$/i
  )
  if (stepsMatch) {
    const n = Math.max(1, parseInt(stepsMatch[1], 10))
    const pos = stepsMatch[2] ? stepsMatch[2].toLowerCase() : 'end'
    return (p: number) => {
      if (p <= 0) return 0
      if (p >= 1) return 1
      if (pos === 'start' || pos === 'jump-start') {
        return Math.min(1, Math.floor(p * n + 1) / n)
      }
      if (pos === 'jump-none') {
        return n <= 1 ? 1 : Math.floor(p * (n - 1)) / (n - 1)
      }
      if (pos === 'jump-both') {
        return (Math.floor(p * (n + 1)) + 1) / (n + 1)
      }
      return Math.floor(p * n) / n
    }
  }

  return (p: number) => p
}

function solveCubicBezier(x1: number, y1: number, x2: number, y2: number): (p: number) => number {
  const ax = 1 - 3 * x2 + 3 * x1
  const bx = 3 * x2 - 6 * x1
  const cx = 3 * x1

  const ay = 1 - 3 * y2 + 3 * y1
  const by = 3 * y2 - 6 * y1
  const cy = 3 * y1

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1

    let t = x
    for (let i = 0; i < 8; i++) {
      const xEst = sampleCurveX(t) - x
      if (Math.abs(xEst) < 1e-6) return sampleCurveY(t)
      const dX = sampleCurveDerivativeX(t)
      if (Math.abs(dX) < 1e-6) break
      t -= xEst / dX
    }

    let t0 = 0
    let t1 = 1
    t = x
    while (t0 < t1) {
      const xEst = sampleCurveX(t) - x
      if (Math.abs(xEst) < 1e-6) return sampleCurveY(t)
      if (xEst > 0) {
        t1 = t
      } else {
        t0 = t
      }
      t = (t0 + t1) * 0.5
    }

    return sampleCurveY(t)
  }
}

const easingCache = new Map<string, (p: number) => number>()

function getEasingFunction(easingStr: string): (p: number) => number {
  const key = easingStr.trim()
  let fn = easingCache.get(key)
  if (!fn) {
    fn = parseEasing(key)
    easingCache.set(key, fn)
  }
  return fn
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  recipe,
  pageDarkMode,
  duration,
  easing,
  accentColor = '#7c3aed',
  onSwitchPage,
}) => {
  const [prevPageDarkMode, setPrevPageDarkMode] = useState(pageDarkMode)
  const [sampleDarkMode, setSampleDarkMode] = useState(pageDarkMode)
  const [prevRecipeId, setPrevRecipeId] = useState(recipe.id)
  const [isAnimating, setIsAnimating] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const switchPageBtnRef = useRef<HTMLButtonElement>(null)
  const animFrameRef = useRef<number | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sizeRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 800,
    height: 320,
    dpr: 1,
  })

  // Synchronize state with incoming prop updates during rendering (avoids setState in useEffect)
  if (pageDarkMode !== prevPageDarkMode) {
    setPrevPageDarkMode(pageDarkMode)
    if (!isAnimating) {
      setSampleDarkMode(pageDarkMode)
    }
  }

  // Cancel ongoing animation when recipe changes
  if (recipe.id !== prevRecipeId) {
    setPrevRecipeId(recipe.id)
    if (isAnimating) {
      setIsAnimating(false)
    }
  }

  // Handle recipe change cleanup in effect
  useEffect(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    const canvas = canvasRef.current
    if (canvas && ctxRef.current) {
      ctxRef.current.resetTransform()
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [recipe.id])

  // Setup ResizeObserver with DPR scaling
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
      if (w > 0 && h > 0) {
        sizeRef.current = { width: w, height: h, dpr }
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctxRef.current = ctx
        }
      }
    }

    updateSize()

    const ro = new ResizeObserver(() => {
      updateSize()
    })
    ro.observe(container)

    return () => ro.disconnect()
  }, [])

  // Clean unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
  }, [])

  const playPreviewTransition = () => {
    if (isAnimating) return
    setIsAnimating(true)

    const canvas = canvasRef.current
    if (!canvas) {
      setIsAnimating(false)
      return
    }

    let ctx = ctxRef.current
    if (!ctx) {
      ctx = canvas.getContext('2d')
      ctxRef.current = ctx
    }
    if (!ctx) {
      setIsAnimating(false)
      return
    }

    const startTime = performance.now()
    const targetMode = !sampleDarkMode
    const easingFn = getEasingFunction(easing)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const p = Math.min(1, Math.max(0, elapsed / duration))
      const easedT = easingFn(p)

      const { width: cssWidth, height: cssHeight, dpr } = sizeRef.current

      // Ensure bitmap size is synced
      const targetW = Math.round(cssWidth * dpr)
      const targetH = Math.round(cssHeight * dpr)
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW
        canvas.height = targetH
      }

      ctx.resetTransform()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)
      ctx.save()
      try {
        recipe.renderPreview(ctx, cssWidth, cssHeight, easedT, targetMode, accentColor)
      } catch (err) {
        console.error('Canvas preview error in ' + recipe.id, err)
      } finally {
        ctx.restore()
      }

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        setSampleDarkMode(targetMode)
        setIsAnimating(false)
        animFrameRef.current = null

        // Seamlessly clear canvas on next frame after DOM has updated to targetMode
        requestAnimationFrame(() => {
          if (canvasRef.current && ctxRef.current) {
            ctxRef.current.resetTransform()
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          }
        })
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)
  }

  return (
    <div className="w-full bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xl relative overflow-hidden transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-violet-500/15 text-violet-600 dark:text-violet-400">
              #{recipe.numId}
            </span>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
              {recipe.name}
            </h2>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            {recipe.description}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Preview button */}
          <button
            onClick={playPreviewTransition}
            disabled={isAnimating}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition shadow-sm active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            <span>▶ Preview Sample</span>
          </button>

          {/* Switch Page Button showing currently selected preset */}
          <button
            ref={switchPageBtnRef}
            onClick={(e) => onSwitchPage(e.currentTarget)}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 font-semibold rounded-xl transition shadow-sm active:scale-95 text-sm flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>🌓 Switch Page</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 dark:bg-stone-200 text-stone-300 dark:text-stone-700 font-normal">
              with {recipe.name}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Sample Container */}
      <div
        ref={containerRef}
        suppressHydrationWarning
        className={`relative w-full rounded-xl border p-6 overflow-hidden ${
          isAnimating ? '' : 'transition-colors duration-200'
        } ${
          sampleDarkMode
            ? 'bg-stone-950 border-stone-800 text-white'
            : 'bg-amber-50/50 border-amber-200/60 text-stone-900'
        }`}
      >
        {/* Canvas overlay that runs the exact recipe geometry */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        <div className="relative z-0 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-violet-600 dark:text-violet-400">
              Sample Live Interface
            </span>
            <span
              suppressHydrationWarning
              className="text-xs px-2 py-0.5 rounded-full border border-current opacity-70"
            >
              {sampleDarkMode ? 'Dark State' : 'Light State'}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-2">
            Optimized, 60fps hardware-accelerated transitions
          </h3>
          <p className="text-sm opacity-80 mb-6 leading-relaxed">
            Zero layout thrashing, pure GPU transforms &amp; SVG mask animations. Every component maintains full accessibility.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={playPreviewTransition}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-white shadow transition active:scale-95 bg-violet-600 hover:bg-violet-500"
            >
              Action Button
            </button>
            <div
              className={`px-3 py-1.5 text-xs rounded-lg border ${
                sampleDarkMode
                  ? 'border-stone-800 bg-stone-900 text-stone-300'
                  : 'border-amber-200 bg-white text-stone-700'
              }`}
            >
              Badge Component
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
