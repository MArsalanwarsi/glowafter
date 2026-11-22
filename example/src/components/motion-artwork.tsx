'use client'

import { useEffect, useRef } from 'react'
import type { PresetRecipe } from '../../../src'

export function MotionArtwork({ recipe, large = false }: { recipe: PresetRecipe; large?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const render = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!width || !height) return
      const scale = Math.min(devicePixelRatio, 1.5)
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(scale, scale)
      const backgrounds: Record<string, string> = {
        'viral-sweep': '#bcc6d8',
        'glass-shatter': '#c4d0d9',
        'seaside-waves': '#b8ccd4',
        'balloon-pop': '#d8c2c0',
        'bomb-drop': '#c2beb8',
        party: '#d8c8b4',
        waterfall: '#bec9b7',
        'silver-rain': '#bdc9ce',
        'puddle-bloom': '#c3c6b1',
        'falling-leaves': '#d8bf9f',
        'paper-shred': '#d8d4c7',
        'paper-tear': '#dfd8c9',
        'wall-break': '#c9c4bb',
        'glass-break': '#c6cfcb',
        'tidal-silk': '#bdc8bb',
        'ink-bloom': '#b6beb2',
        'woven-blinds': '#c9c4b3',
        gif: '#cec7d6',
      }
      ctx.fillStyle = backgrounds[recipe.id] ?? '#c6cbbd'
      ctx.fillRect(0, 0, width, height)
      // Quiet deterministic grain keeps the illustration tactile at every size.
      for (let i = 0; i < 2200; i++) {
        ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.045)'
        ctx.fillRect((i * 73.71) % width, (i * 39.37) % height, 1, 1)
      }
      if (recipe.revealPath) {
        const path = new Path2D(recipe.revealPath(width, height, large ? 0.52 : 0.46))
        ctx.fillStyle = '#2d3933'
        ctx.fill(path)
        ctx.save()
        ctx.clip(path)
        const gloss = ctx.createLinearGradient(0, 0, width, height)
        gloss.addColorStop(0, 'rgba(247,250,231,.32)')
        gloss.addColorStop(0.5, 'rgba(9,28,21,.1)')
        gloss.addColorStop(1, 'rgba(1,13,10,.5)')
        ctx.fillStyle = gloss
        ctx.fillRect(0, 0, width, height)
        ctx.restore()
        ctx.strokeStyle = 'rgba(255,255,240,.38)'
        ctx.lineWidth = 1
        ctx.stroke(path)
      } else {
        ctx.fillStyle = '#484055'
        ctx.font = (large ? 130 : 65) + 'px Georgia'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Aa', width / 2, height / 2)
      }
    }
    const observer = new ResizeObserver(render)
    observer.observe(canvas)
    render()
    return () => observer.disconnect()
  }, [recipe, large])

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full block" />
}
