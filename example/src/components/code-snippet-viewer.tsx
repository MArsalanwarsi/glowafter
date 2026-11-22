'use client'

import React, { useState } from 'react'
import { PresetRecipe, ThemeAnimationDirection } from '../../../src'

interface CodeSnippetViewerProps {
  recipe: PresetRecipe
  duration: number
  easing: string
  accentColor: string
  direction: ThemeAnimationDirection | `${ThemeAnimationDirection}`
}

export const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({
  recipe,
  duration,
  easing,
  accentColor,
  direction,
}) => {
  const [copied, setCopied] = useState(false)

  const snippetCode = `'use client'

import React from 'react'
import { useModeAnimation } from 'glowafter'

export const ThemeToggle = () => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    presetId: '${recipe.id}',${recipe.supportsGif ? `\n    gifUrl: '/motion/reveal.gif',` : ''}${recipe.supportsDirection ? `\n    direction: '${direction}',` : ''}
    duration: ${duration},
    easing: '${easing}',
    accentColor: '${accentColor}',
  })

  return (
    <button
      ref={ref}
      onClick={toggleSwitchTheme}
      className="px-4 py-2 rounded-xl font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 transition active:scale-95"
      aria-label="Toggle theme"
    >
      {isDarkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippetCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore
    }
  }

  return (
    <div className="w-full bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono text-stone-400 ml-2">ThemeToggle.tsx</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition active:scale-95 flex items-center gap-1.5"
        >
          {copied ? '✓ Copied!' : '📋 Copy Component'}
        </button>
      </div>

      <pre className="font-mono text-xs overflow-x-auto text-stone-300 leading-relaxed py-2">
        <code>{snippetCode}</code>
      </pre>

      <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
        <span>
          Package: <code>glowafter</code>
        </span>
        <span className="text-violet-400 font-medium">114 Transitions • Zero Stutter</span>
      </div>
    </div>
  )
}
