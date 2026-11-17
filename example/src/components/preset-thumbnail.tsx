'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { PresetRecipe } from '../../../src'

interface PresetThumbnailProps {
  recipe: PresetRecipe
  isDarkMode: boolean
  accentColor?: string
  className?: string
  isPaused?: boolean
}

export const PresetThumbnail = React.memo(function PresetThumbnail({
  recipe,
  isDarkMode,
  accentColor,
  className = '',
  isPaused = false,
}: PresetThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const pendingRenderRef = useRef(false)

  // IntersectionObserver: Only render thumbnails for visible cards
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(el)
          }
        })
      },
      { rootMargin: '150px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const renderThumbnail = useCallback(() => {
    if (!isVisible || isPaused) return
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const w = Math.round(rect.width) || 280
    const h = Math.round(rect.height) || 96
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1

    const pixelW = Math.round(w * dpr)
    const pixelH = Math.round(h * dpr)

    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW
      canvas.height = pixelH
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.resetTransform()
    ctx.scale(dpr, dpr)

    // Background representing outgoing theme
    ctx.fillStyle = isDarkMode ? '#1e293b' : '#f1f5f9'
    ctx.fillRect(0, 0, w, h)

    // Render mid-transition silhouette with canvas safety
    ctx.save()
    try {
      recipe.renderPreview(ctx, w, h, 0.5, !isDarkMode, accentColor)
    } catch {
      ctx.fillStyle = accentColor || (isDarkMode ? '#3b82f6' : '#6366f1')
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.35, 0, Math.PI * 2)
      ctx.fill()
    } finally {
      ctx.restore()
    }
  }, [isVisible, isPaused, recipe, isDarkMode, accentColor])

  useEffect(() => {
    if (!isVisible) return

    // If a full-page transition is running, pause thumbnail re-renders to prevent main thread/GPU thrashing
    if (isPaused) {
      pendingRenderRef.current = true
      return
    }

    pendingRenderRef.current = false
    const rafId = requestAnimationFrame(() => {
      renderThumbnail()
    })

    return () => cancelAnimationFrame(rafId)
  }, [isVisible, isPaused, renderThumbnail])

  return (
    <div
      ref={containerRef}
      className={`w-full h-24 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden relative ${className}`}
    >
      {isVisible ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      ) : (
        <div className="w-full h-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
      )}
    </div>
  )
})
