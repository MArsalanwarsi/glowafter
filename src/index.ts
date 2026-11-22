'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { getPresetById, PresetContext, PresetRecipe } from './presets/index'

export * from './presets/index'
export * from './presets/nature'

const activeDocuments = new WeakSet<Document>()
const storeTheme = (dark: boolean) => {
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {
    /* Storage can be disabled. */
  }
}
const readTheme = () => {
  try {
    return localStorage.getItem('theme')
  } catch {
    return null
  }
}

const isBrowser = typeof window !== 'undefined'

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

export type ThemeSwitchEngine = 'auto' | 'view-transition' | 'gsap'

export type ThemeSwitchTrigger =
  | React.MouseEvent<HTMLElement>
  | React.TouchEvent<HTMLElement>
  | TouchEvent
  | MouseEvent
  | HTMLElement
  | { clientX: number; clientY: number }
  | null
  | undefined

// Exponential easing curves (CSS linear() approximations)
const EXPO_OUT_EASING =
  'linear(' +
  '0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%,' +
  '0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%,' +
  '0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%,' +
  '0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%,' +
  '0.9833 59.06%, 0.9915 68.74%, 1 100%' +
  ')'

const EXPO_IN_EASING =
  'linear(' +
  '0 0%, 0.0085 31.26%, 0.0167 40.94%, 0.0289 48.86%,' +
  '0.0471 55.92%, 0.0717 61.99%, 0.1038 67.32%,' +
  '0.1443 72.07%, 0.1989 76.7%, 0.2659 80.89%,' +
  '0.3465 84.71%, 0.4419 88.22%, 0.554 91.48%,' +
  '0.6835 94.51%, 0.8316 97.34%, 1 100%' +
  ')'

// Inject base CSS for view transitions once
const injectBaseStyles = () => {
  if (isBrowser) {
    const styleId = 'theme-switch-base-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        ::view-transition-group(root) {
          mix-blend-mode: normal;
        }
        ::view-transition-image-pair(root) {
          isolation: isolate;
        }
        ::view-transition-old(root),
        ::view-transition-new(root) {
          mix-blend-mode: normal;
          transform: translateZ(0);
          will-change: clip-path;
          backface-visibility: hidden;
        }
      `
      document.head.appendChild(style)
    }
  }
}

export interface ReactThemeSwitchAnimationHook {
  ref: React.RefObject<HTMLButtonElement | null>
  toggleSwitchTheme: (trigger?: ThemeSwitchTrigger) => Promise<void>
  isDarkMode: boolean
  mounted: boolean
  engine: 'view-transition' | 'gsap'
  isAnimating: boolean
}

export interface ReactThemeSwitchAnimationProps {
  duration?: number
  easing?: string
  pseudoElement?: string
  globalClassName?: string
  animationType?: ThemeAnimationType
  presetId?: string
  direction?: ThemeAnimationDirection | `${ThemeAnimationDirection}`
  blurAmount?: number
  gifUrl?: string
  accentColor?: string
  styleId?: string
  isDarkMode?: boolean
  onDarkModeChange?: (isDark: boolean) => void
  engine?: ThemeSwitchEngine
}

// Helper cubic-bezier solver for 60fps canvas tweening
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
      if (xEst > 0) t1 = t
      else t0 = t
      t = (t0 + t1) * 0.5
    }
    return sampleCurveY(t)
  }
}

function parseEasingCurve(easingStr: string): (p: number) => number {
  const str = (easingStr || '').trim()
  if (!str || str === 'linear') return (p: number) => p
  if (str === 'ease') return solveCubicBezier(0.25, 0.1, 0.25, 1.0)
  if (str === 'ease-in') return solveCubicBezier(0.42, 0.0, 1.0, 1.0)
  if (str === 'ease-out') return solveCubicBezier(0.0, 0.0, 0.58, 1.0)
  if (str === 'ease-in-out') return solveCubicBezier(0.42, 0.0, 0.58, 1.0)

  const cubicMatch = str.match(
    /^cubic-bezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)$/i
  )
  if (cubicMatch) {
    return solveCubicBezier(
      parseFloat(cubicMatch[1]),
      parseFloat(cubicMatch[2]),
      parseFloat(cubicMatch[3]),
      parseFloat(cubicMatch[4])
    )
  }

  const stepsMatch = str.match(/^steps\(\s*(\d+)(?:\s*,\s*(start|end|jump-start|jump-end|jump-none|jump-both))?\s*\)$/i)
  if (stepsMatch) {
    const n = Math.max(1, parseInt(stepsMatch[1], 10))
    return (p: number) => Math.floor(p * n) / n
  }

  return (p: number) => p
}

/**
 * Runs a 60fps full-screen transition overlay powered by GSAP and Canvas 2D
 */
export const runGsapCanvasTransition = async (options: {
  recipe: PresetRecipe
  duration: number
  easing: string
  isDarkMode: boolean
  accentColor?: string
  onThemeSwitch: () => void
}): Promise<void> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    options.onThemeSwitch()
    return
  }

  // Safely locate GSAP if available without breaking bundlers when building subdirectories on Vercel
  let gsap: any = (window as any)?.gsap || null
  if (!gsap) {
    try {
      const loadDynamic = new Function('mod', 'return import(mod)')
      const imported = await loadDynamic('gsap')
      gsap = imported?.default || imported
    } catch {
      gsap = null
    }
  }

  return new Promise<void>((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.id = 'theme-switch-gsap-overlay'
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    canvas.style.zIndex = '999999'
    canvas.style.pointerEvents = 'none'

    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(2000000 / (w * h)))
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)

    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      options.onThemeSwitch()
      canvas.remove()
      resolve()
      return
    }

    const state = { progress: 0 }
    let switched = false

    if (gsap && typeof gsap.to === 'function') {
      // Map CSS easing string to GSAP easing name
      let gsapEase = 'power2.out'
      const easeStr = options.easing || ''
      if (easeStr.includes('0.16, 1, 0.3, 1')) gsapEase = 'power3.out'
      else if (easeStr.includes('0.34, 1.56, 0.64, 1')) gsapEase = 'back.out(1.4)'
      else if (easeStr.includes('0.25, 1, 0.5, 1')) gsapEase = 'expo.out'
      else if (easeStr.includes('linear')) gsapEase = 'none'
      else if (easeStr.includes('steps')) gsapEase = 'steps(5)'
      else if (easeStr.includes('ease-in-out')) gsapEase = 'power2.inOut'

      gsap.to(state, {
        progress: 1,
        duration: Math.max(0.2, options.duration / 1000),
        ease: gsapEase,
        onUpdate: () => {
          ctx.resetTransform()
          ctx.scale(dpr, dpr)
          ctx.clearRect(0, 0, w, h)
          ctx.save()
          try {
            options.recipe.renderPreview(ctx, w, h, state.progress, options.isDarkMode, options.accentColor)
          } catch {
            ctx.fillStyle = options.isDarkMode ? '#0f172a' : '#f8fafc'
            ctx.beginPath()
            ctx.arc(w / 2, h / 2, Math.hypot(w, h) * state.progress, 0, Math.PI * 2)
            ctx.fill()
          } finally {
            ctx.restore()
          }

          if (state.progress >= 1 && !switched) {
            switched = true
            options.onThemeSwitch()
          }
        },
        onComplete: () => {
          if (!switched) {
            options.onThemeSwitch()
          }
          gsap.to(canvas, {
            opacity: 0,
            duration: 0.1,
            ease: 'power1.out',
            onComplete: () => {
              canvas.remove()
              resolve()
            },
          })
        },
      })
    } else {
      // High-performance 60fps native canvas tween ticker fallback
      const startTime = performance.now()
      const totalDuration = Math.max(200, options.duration)
      const easingFn = parseEasingCurve(options.easing)

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const p = Math.min(1, Math.max(0, elapsed / totalDuration))
        const easedT = easingFn(p)

        ctx.resetTransform()
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, w, h)
        ctx.save()
        try {
          options.recipe.renderPreview(ctx, w, h, easedT, options.isDarkMode, options.accentColor)
        } catch {
          ctx.fillStyle = options.isDarkMode ? '#0f172a' : '#f8fafc'
          ctx.beginPath()
          ctx.arc(w / 2, h / 2, Math.hypot(w, h) * easedT, 0, Math.PI * 2)
          ctx.fill()
        } finally {
          ctx.restore()
        }

        if (p >= 1 && !switched) {
          switched = true
          options.onThemeSwitch()
        }

        if (p < 1) {
          requestAnimationFrame(animate)
        } else {
          if (!switched) {
            options.onThemeSwitch()
          }
          canvas.style.transition = 'opacity 0.1s ease-out'
          canvas.style.opacity = '0'
          setTimeout(() => {
            canvas.remove()
            resolve()
          }, 100)
        }
      }

      requestAnimationFrame(animate)
    }
  })
}

export interface PerformSwitchOptions {
  presetId?: string
  animationType?: ThemeAnimationType
  duration?: number
  easing?: string
  trigger?: ThemeSwitchTrigger
  globalClassName?: string
  pseudoElement?: string
  gifUrl?: string
  accentColor?: string
  direction?: ThemeAnimationDirection | `${ThemeAnimationDirection}`
  blurAmount?: number
  engine?: ThemeSwitchEngine
  styleId?: string
  updateTheme?: () => void | Promise<void>
}

export const performSwitch = async (options?: PerformSwitchOptions): Promise<void> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const {
    presetId,
    animationType: directAnimationType,
    duration: customDuration,
    easing: customEasing,
    trigger,
    globalClassName = 'dark',
    gifUrl,
    accentColor,
    direction = ThemeAnimationDirection.LTR,
    engine = 'auto',
    styleId = 'theme-switch-style',
    updateTheme,
  } = options || {}

  injectBaseStyles()

  const preset = getPresetById(presetId ?? (directAnimationType ? '' : 'viral-sweep')) ?? getPresetById('waterfall')
  const animationType = directAnimationType ?? preset?.originalType ?? ThemeAnimationType.CIRCLE

  const propsDuration =
    customDuration ??
    preset?.defaultDuration ??
    (animationType === ThemeAnimationType.GIF
      ? 2000
      : animationType === ThemeAnimationType.POLYGON_GRADIENT
        ? 1500
        : 750)

  const easing =
    customEasing ??
    preset?.defaultEasing ??
    (animationType === ThemeAnimationType.POLYGON || animationType === ThemeAnimationType.POLYGON_GRADIENT
      ? EXPO_OUT_EASING
      : animationType === ThemeAnimationType.GIF
        ? EXPO_IN_EASING
        : 'ease-in-out')

  const duration = Number.isFinite(propsDuration) ? Math.max(0, Math.min(15000, propsDuration)) : 1500

  const isCurrentlyDark = document.documentElement.classList.contains(globalClassName)
  const willBeDark = !isCurrentlyDark

  const applyThemeUpdate = async () => {
    if (updateTheme) {
      await updateTheme()
    } else {
      document.documentElement.classList.toggle(globalClassName, willBeDark)
      storeTheme(willBeDark)
    }
  }

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || duration === 0) {
    await applyThemeUpdate()
    return
  }

  // Determine trigger origin (x, y) with reliable touch and viewport center fallback
  let x = window.innerWidth / 2
  let y = window.innerHeight / 2

  if (trigger) {
    const touchTarget = trigger as any
    const touch =
      (touchTarget.touches && touchTarget.touches.length > 0 && touchTarget.touches[0]) ||
      (touchTarget.changedTouches && touchTarget.changedTouches.length > 0 && touchTarget.changedTouches[0]) ||
      (touchTarget.nativeEvent?.touches &&
        touchTarget.nativeEvent.touches.length > 0 &&
        touchTarget.nativeEvent.touches[0]) ||
      (touchTarget.nativeEvent?.changedTouches &&
        touchTarget.nativeEvent.changedTouches.length > 0 &&
        touchTarget.nativeEvent.changedTouches[0])

    if (touch && typeof touch.clientX === 'number' && typeof touch.clientY === 'number') {
      x = touch.clientX
      y = touch.clientY
    } else if ('clientX' in trigger && typeof trigger.clientX === 'number' && typeof trigger.clientY === 'number') {
      x = trigger.clientX
      y = trigger.clientY
    } else if ('getBoundingClientRect' in trigger && typeof trigger.getBoundingClientRect === 'function') {
      const rect = trigger.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }
  }

  const effectiveEngine: 'view-transition' | 'gsap' =
    engine === 'gsap'
      ? 'gsap'
      : engine === 'view-transition'
        ? 'view-transition'
        : !(document as any).startViewTransition
          ? 'gsap'
          : 'view-transition'

  if (gifUrl && animationType === ThemeAnimationType.GIF && !(document as any).startViewTransition) {
    await applyThemeUpdate()
    return
  }

  // Run GSAP Canvas Engine if requested or if View Transition API is not supported
  if (effectiveEngine === 'gsap' && preset && !(animationType === ThemeAnimationType.GIF && gifUrl)) {
    await runGsapCanvasTransition({
      recipe: preset,
      duration,
      easing,
      isDarkMode: willBeDark,
      accentColor,
      onThemeSwitch: async () => {
        await applyThemeUpdate()
      },
    })
    return
  }

  // Fallback if startViewTransition is missing in browser
  if (!(document as any).startViewTransition) {
    if (preset) {
      await runGsapCanvasTransition({
        recipe: preset,
        duration,
        easing,
        isDarkMode: willBeDark,
        accentColor,
        onThemeSwitch: async () => {
          await applyThemeUpdate()
        },
      })
    } else {
      await applyThemeUpdate()
    }
    return
  }

  // Clean up any stale transition style element
  const existingStyle = document.getElementById(styleId)
  if (existingStyle) {
    existingStyle.remove()
  }

  const topLeft = Math.hypot(x, y)
  const topRight = Math.hypot(window.innerWidth - x, y)
  const bottomLeft = Math.hypot(x, window.innerHeight - y)
  const bottomRight = Math.hypot(window.innerWidth - x, window.innerHeight - y)
  const maxRadius = Math.max(topLeft, topRight, bottomLeft, bottomRight)

  const presetCtx: PresetContext = {
    x,
    y,
    width: window.innerWidth,
    height: window.innerHeight,
    maxRadius,
    isDarkMode: willBeDark,
    direction,
    duration,
    easing,
    accentColor,
  }

  let customCss: string
  let gifObjectUrl: string | undefined
  if (animationType === ThemeAnimationType.GIF && gifUrl) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    try {
      const response = await fetch(gifUrl, { signal: controller.signal })
      if (!response.ok) throw new Error('Could not load the GIF mask')
      const blob = await response.blob()
      gifObjectUrl = URL.createObjectURL(blob)
      const image = new Image()
      image.src = gifObjectUrl
      await image.decode()
    } catch (error) {
      if (gifObjectUrl) URL.revokeObjectURL(gifObjectUrl)
      throw error
    } finally {
      clearTimeout(timeout)
    }
  }

  if (animationType === ThemeAnimationType.GIF && gifUrl) {
    const mask = 'url(' + JSON.stringify(gifObjectUrl ?? gifUrl).replace(/</g, '%3C') + ')'
    customCss = `
      ::view-transition-new(root) {
        mask: ${mask} center / contain no-repeat;
        mask-mode: alpha;
        animation: gifReveal ${duration}ms linear both !important;
      }
      @keyframes gifReveal {
        0%, 99.99% { mask-image: ${mask}; }
        100% { mask-image: none; }
      }`
  } else if (preset?.generateStyle) {
    customCss = preset.generateStyle(presetCtx)
  } else if (animationType === ThemeAnimationType.QR_SCAN) {
    const scanDir = direction || ThemeAnimationDirection.LTR
    let fromInset = 'inset(0 100% 0 0)'
    if (scanDir === ThemeAnimationDirection.RTL) fromInset = 'inset(0 0 0 100%)'
    else if (scanDir === ThemeAnimationDirection.TTB) fromInset = 'inset(0 0 100% 0)'
    else if (scanDir === ThemeAnimationDirection.BTT) fromInset = 'inset(100% 0 0 0)'

    customCss = `
      ::view-transition-new(root) {
        animation: qrScanReveal ${duration}ms ${easing} both !important;
        will-change: clip-path;
      }
      @keyframes qrScanReveal {
        0% { clip-path: ${fromInset}; }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  } else if (animationType === ThemeAnimationType.POLYGON || animationType === ThemeAnimationType.POLYGON_GRADIENT) {
    customCss = `
      ::view-transition-new(root) {
        animation: polyReveal ${duration}ms ${easing} both !important;
        will-change: clip-path;
      }
      @keyframes polyReveal {
        0% { clip-path: polygon(0 0, 0 0, 0 0); }
        100% { clip-path: polygon(0 0, 250% 0, 0 250%); }
      }
    `
  } else {
    customCss = `
      ::view-transition-new(root) {
        animation: circleReveal ${duration}ms ${easing} both !important;
        will-change: clip-path;
      }
      @keyframes circleReveal {
        0% { clip-path: circle(0% at ${x}px ${y}px); }
        100% { clip-path: circle(150% at ${x}px ${y}px); }
      }
    `
  }

  const fullStyleText = `
    ::view-transition-group(root) {
      animation-duration: ${duration}ms !important;
      animation-timing-function: ${easing} !important;
    }
    ::view-transition-image-pair(root) {
      isolation: isolate !important;
    }
    ::view-transition-old(root) {
      animation: none !important;
      mix-blend-mode: normal !important;
      z-index: 1 !important;
      backface-visibility: hidden !important;
      transform: translateZ(0) !important;
      will-change: clip-path !important;
    }
    ::view-transition-new(root) {
      mix-blend-mode: normal !important;
      z-index: 9999 !important;
      backface-visibility: hidden !important;
      transform: translateZ(0) !important;
      will-change: clip-path !important;
      animation-duration: ${duration}ms !important;
      animation-timing-function: ${easing} !important;
      animation-fill-mode: both !important;
    }
    ${customCss}
  `

  const styleElement = document.createElement('style')
  styleElement.id = styleId
  styleElement.textContent = fullStyleText
  document.head.appendChild(styleElement)

  try {
    const transition = (document as any).startViewTransition(async () => {
      await applyThemeUpdate()
    })
    await transition.finished
  } catch {
    await applyThemeUpdate()
  } finally {
    if (gifObjectUrl) URL.revokeObjectURL(gifObjectUrl)
    const injected = document.getElementById(styleId)
    if (injected === styleElement) {
      injected.remove()
    }
  }
}

export const useModeAnimation = (props?: ReactThemeSwitchAnimationProps): ReactThemeSwitchAnimationHook => {
  const {
    duration: customDuration,
    easing: customEasing,
    pseudoElement = '::view-transition-new(root)',
    globalClassName = 'dark',
    animationType: directAnimationType,
    presetId,
    direction = ThemeAnimationDirection.LTR,
    blurAmount = 2,
    gifUrl,
    accentColor,
    styleId = 'theme-switch-style',
    isDarkMode: externalDarkMode,
    onDarkModeChange,
    engine = 'auto',
  } = props || {}

  // Hydration-safe state initialization (always starts false on both server and client)
  const [internalDarkMode, setInternalDarkMode] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const transitionRef = useRef<{ skipTransition: () => void } | null>(null)
  useEffect(() => () => transitionRef.current?.skipTransition(), [])
  const [mounted, setMounted] = useState<boolean>(false)

  // Look up preset if provided
  const preset = getPresetById(presetId ?? (directAnimationType ? '' : 'viral-sweep')) ?? getPresetById('waterfall')
  const animationType = directAnimationType ?? preset?.originalType ?? ThemeAnimationType.CIRCLE

  const propsDuration =
    customDuration ??
    preset?.defaultDuration ??
    (animationType === ThemeAnimationType.GIF
      ? 2000
      : animationType === ThemeAnimationType.POLYGON_GRADIENT
        ? 1500
        : 750)

  const easing =
    customEasing ??
    preset?.defaultEasing ??
    (animationType === ThemeAnimationType.POLYGON || animationType === ThemeAnimationType.POLYGON_GRADIENT
      ? EXPO_OUT_EASING
      : animationType === ThemeAnimationType.GIF
        ? EXPO_IN_EASING
        : 'ease-in-out')

  const duration = Number.isFinite(propsDuration) ? Math.max(0, Math.min(15000, propsDuration)) : 1500

  // Inject base styles on mount and synchronize theme state with DOM & storage
  useEffect(() => {
    setMounted(true)
    injectBaseStyles()

    const isDarkInDom = document.documentElement.classList.contains(globalClassName)
    if (externalDarkMode !== undefined) return
    const isDarkInStorage = readTheme() === 'dark'
    const initialDark = isDarkInDom || isDarkInStorage

    if (initialDark) {
      document.documentElement.classList.add(globalClassName)
    } else {
      document.documentElement.classList.remove(globalClassName)
    }
    setInternalDarkMode(initialDark)
  }, [globalClassName, externalDarkMode])

  const isDarkMode = mounted ? (externalDarkMode ?? internalDarkMode) : false

  const setIsDarkMode = (value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === 'function' ? value(isDarkMode) : value
    if (onDarkModeChange) {
      onDarkModeChange(newValue)
    } else {
      setInternalDarkMode(newValue)
    }
  }

  const ref = useRef<HTMLButtonElement>(null)

  // Determine active animation engine (hydration-safe default to 'view-transition' on both SSR and initial client paint)
  const effectiveEngine: 'view-transition' | 'gsap' =
    engine === 'gsap'
      ? 'gsap'
      : engine === 'view-transition'
        ? 'view-transition'
        : mounted && typeof document !== 'undefined' && !(document as any).startViewTransition
          ? 'gsap'
          : 'view-transition'

  const busy = useRef(false)

  return {
    ref,
    toggleSwitchTheme: async (trigger) => {
      if (typeof document === 'undefined' || busy.current || activeDocuments.has(document)) return
      busy.current = true
      activeDocuments.add(document)
      setIsAnimating(true)
      try {
        const isCurrentlyDark = document.documentElement.classList.contains(globalClassName)
        const willBeDark = !isCurrentlyDark
        const resolvedTrigger = trigger || (ref.current ? ref.current : undefined)

        await performSwitch({
          presetId,
          animationType: directAnimationType,
          duration,
          easing,
          trigger: resolvedTrigger,
          globalClassName,
          pseudoElement,
          gifUrl,
          accentColor,
          direction,
          blurAmount,
          engine: effectiveEngine,
          styleId,
          updateTheme: () => {
            document.documentElement.classList.toggle(globalClassName, willBeDark)
            storeTheme(willBeDark)
            flushSync(() => setIsDarkMode(willBeDark))
          },
        })
      } finally {
        busy.current = false
        activeDocuments.delete(document)
        setIsAnimating(false)
      }
    },
    isDarkMode,
    mounted,
    isAnimating,
    engine: effectiveEngine,
  }
}
