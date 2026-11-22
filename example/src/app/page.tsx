'use client'

import { MotionArtwork } from '@/components/motion-artwork'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Moon,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Terminal,
  Upload,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { FEATURED_PRESETS, useModeAnimation, type PresetRecipe } from '../../../src'

const groups = ['All motion', 'Cinematic', 'Water', 'Material', 'Organic', 'Custom'] as const

function group(recipe: PresetRecipe) {
  if (recipe.supportsGif) return 'Custom'
  if (['falling-leaves', 'ink-bloom'].includes(recipe.id)) return 'Organic'
  if (['viral-sweep', 'glass-shatter', 'balloon-pop', 'bomb-drop', 'party'].includes(recipe.id)) return 'Cinematic'
  if (recipe.family === 'ink-and-water') return 'Water'
  return 'Material'
}

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'
type CodeLanguage = 'js' | 'ts'
type FrameworkTarget = 'react' | 'nextjs' | 'vanilla' | 'gif'

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme()
  const [selected, setSelected] = useState(FEATURED_PRESETS[0])
  const [category, setCategory] = useState('All motion')
  const [duration, setDuration] = useState(selected.defaultDuration)
  const [gifUrl, setGifUrl] = useState('')
  const [gifName, setGifName] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [badgeCopied, setBadgeCopied] = useState(false)

  // Dialog Code Generator options
  const [modalLang, setModalLang] = useState<CodeLanguage>('js')
  const [modalTarget, setModalTarget] = useState<'react' | 'nextjs'>('react')

  // Quickstart Section options
  const [activePm, setActivePm] = useState<PackageManager>('npm')
  const [pmCopied, setPmCopied] = useState(false)
  const [quickstartLang, setQuickstartLang] = useState<CodeLanguage>('js')
  const [quickstartTarget, setQuickstartTarget] = useState<FrameworkTarget>('react')
  const [recipeCopied, setRecipeCopied] = useState(false)

  const localGif = useRef<string | null>(null)
  const { toggleSwitchTheme, isDarkMode, mounted, isAnimating } = useModeAnimation({
    presetId: selected.id,
    duration,
    gifUrl,
    isDarkMode: resolvedTheme === 'dark',
    onDarkModeChange: (dark) => setTheme(dark ? 'dark' : 'light'),
  })

  useEffect(
    () => () => {
      if (localGif.current) URL.revokeObjectURL(localGif.current)
    },
    []
  )

  const canPlay = mounted && !isAnimating && (!selected.supportsGif || Boolean(gifUrl))

  const play = async () => {
    setError('')
    try {
      await toggleSwitchTheme()
    } catch {
      setError('The animation could not load. Check your GIF URL and try again.')
    }
  }

  const select = (recipe: PresetRecipe) => {
    setSelected(recipe)
    setDuration(recipe.defaultDuration)
    setError('')
  }

  const selectAndScroll = (recipe: PresetRecipe) => {
    select(recipe)
    const el = document.getElementById('playground')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Generate dynamic snippet for the Dialog based on current preset, duration, language, and target
  const getModalSnippet = () => {
    const gifLine = selected.supportsGif ? "\n    gifUrl: '/motion/reveal.gif'," : ''

    if (modalTarget === 'react') {
      if (modalLang === 'js') {
        return `// src/components/ThemeToggle.jsx
import { useModeAnimation } from 'glowafter'

export function ThemeToggle() {
  const { ref, toggleSwitchTheme, isDarkMode, mounted, isAnimating } = useModeAnimation({
    presetId: '${selected.id}',
    duration: ${duration},${gifLine}
  })

  if (!mounted) return null

  return (
    <button
      ref={ref}
      onClick={toggleSwitchTheme}
      disabled={isAnimating}
      className="px-4 py-2 rounded-lg font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}`
      }
      return `// src/components/ThemeToggle.tsx
import React from 'react'
import { useModeAnimation, type NaturePresetId } from 'glowafter'

export const ThemeToggle: React.FC = () => {
  const { ref, toggleSwitchTheme, isDarkMode, mounted, isAnimating } = useModeAnimation({
    presetId: '${selected.id}' as NaturePresetId,
    duration: ${duration},${gifLine}
  })

  if (!mounted) return null

  return (
    <button
      ref={ref}
      onClick={toggleSwitchTheme}
      disabled={isAnimating}
      className="px-4 py-2 rounded-lg font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}`
    }

    // Next.js with next-themes
    if (modalLang === 'js') {
      return `// components/ThemeToggle.jsx
'use client'

import { useTheme } from 'next-themes'
import { useModeAnimation } from 'glowafter'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { ref, toggleSwitchTheme, mounted, isAnimating } = useModeAnimation({
    presetId: '${selected.id}',
    duration: ${duration},${gifLine}
    isDarkMode: resolvedTheme === 'dark',
    onDarkModeChange: dark => setTheme(dark ? 'dark' : 'light'),
  })

  if (!mounted) return null

  return (
    <button ref={ref} onClick={toggleSwitchTheme} disabled={isAnimating}>
      {resolvedTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}`
    }

    return `// components/theme-toggle.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useModeAnimation, type NaturePresetId } from 'glowafter'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { ref, toggleSwitchTheme, mounted, isAnimating } = useModeAnimation({
    presetId: '${selected.id}' as NaturePresetId,
    duration: ${duration},${gifLine}
    isDarkMode: resolvedTheme === 'dark',
    onDarkModeChange: dark => setTheme(dark ? 'dark' : 'light'),
  })

  return (
    <Button ref={ref} onClick={toggleSwitchTheme} disabled={!mounted || isAnimating}>
      Change theme
    </Button>
  )
}`
  }

  const copyModalSnippet = async () => {
    try {
      await navigator.clipboard.writeText(getModalSnippet())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Select the code below to copy it manually.')
    }
  }

  const copyInstallBadge = async () => {
    try {
      await navigator.clipboard.writeText('npm install glowafter')
      setBadgeCopied(true)
      setTimeout(() => setBadgeCopied(false), 2000)
    } catch {
      // Ignore
    }
  }

  const pmCommands: Record<PackageManager, string> = {
    npm: 'npm install glowafter',
    pnpm: 'pnpm add glowafter',
    yarn: 'yarn add glowafter',
    bun: 'bun add glowafter',
  }

  const copyPmCommand = async () => {
    try {
      await navigator.clipboard.writeText(pmCommands[activePm])
      setPmCopied(true)
      setTimeout(() => setPmCopied(false), 2000)
    } catch {
      // Ignore
    }
  }

  // Quickstart code generator based on language and framework
  const getQuickstartCode = (): { filename: string; code: string } => {
    if (quickstartTarget === 'react') {
      if (quickstartLang === 'js') {
        return {
          filename: 'src/components/ThemeToggle.jsx',
          code: `import { useModeAnimation } from 'glowafter'

export function ThemeToggle() {
  // glowafter manages .dark on <html> & syncs with localStorage automatically
  const { ref, toggleSwitchTheme, isDarkMode, mounted, isAnimating } = useModeAnimation({
    presetId: 'viral-sweep',
    duration: 1200,
  })

  if (!mounted) return null

  return (
    <button
      ref={ref}
      onClick={toggleSwitchTheme}
      disabled={isAnimating}
      className="px-4 py-2 rounded-lg font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 transition"
      aria-label="Toggle theme"
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}`,
        }
      }
      return {
        filename: 'src/components/ThemeToggle.tsx',
        code: `import React from 'react'
import { useModeAnimation, type NaturePresetId } from 'glowafter'

interface ThemeToggleProps {
  presetId?: NaturePresetId
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ presetId = 'viral-sweep' }) => {
  const { ref, toggleSwitchTheme, isDarkMode, mounted, isAnimating } = useModeAnimation({
    presetId,
    duration: 1200,
  })

  if (!mounted) return null

  return (
    <button
      ref={ref}
      onClick={toggleSwitchTheme}
      disabled={isAnimating}
      className="px-4 py-2 rounded-lg font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 transition"
      aria-label="Toggle theme"
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}`,
      }
    }

    if (quickstartTarget === 'nextjs') {
      if (quickstartLang === 'js') {
        return {
          filename: 'components/ThemeToggle.jsx',
          code: `'use client'

import { useTheme } from 'next-themes'
import { useModeAnimation } from 'glowafter'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { ref, toggleSwitchTheme, mounted, isAnimating } = useModeAnimation({
    presetId: 'glass-shatter',
    duration: 1400,
    isDarkMode: resolvedTheme === 'dark',
    onDarkModeChange: (dark) => setTheme(dark ? 'dark' : 'light'),
  })

  if (!mounted) return null

  return (
    <button ref={ref} onClick={toggleSwitchTheme} disabled={isAnimating} className="p-2 border rounded-md">
      {resolvedTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}`,
        }
      }
      return {
        filename: 'components/theme-toggle.tsx',
        code: `'use client'

import { Button } from '@/components/ui/button'
import { useModeAnimation, type NaturePresetId } from 'glowafter'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle({ presetId = 'viral-sweep' }: { presetId?: NaturePresetId }) {
  const { resolvedTheme, setTheme } = useTheme()
  const { ref, toggleSwitchTheme, mounted, isAnimating } = useModeAnimation({
    presetId,
    duration: 1200,
    isDarkMode: resolvedTheme === 'dark',
    onDarkModeChange: (dark) => setTheme(dark ? 'dark' : 'light'),
  })

  if (!mounted) return <Button variant="outline" size="icon" disabled />

  return (
    <Button ref={ref} variant="outline" size="icon" disabled={isAnimating} onClick={toggleSwitchTheme}>
      {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}`,
      }
    }

    if (quickstartTarget === 'gif') {
      const ext = quickstartLang === 'js' ? 'jsx' : 'tsx'
      return {
        filename: `src/components/GifToggle.${ext}`,
        code: `${quickstartLang === 'js' ? '' : "'use client'\n\n"}import { useModeAnimation } from 'glowafter'

export function GifToggle() {
  const { ref, toggleSwitchTheme, isAnimating } = useModeAnimation({
    presetId: 'gif',
    gifUrl: '/assets/reveal-mask.gif',
    duration: 2200,
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme} disabled={isAnimating} className="px-4 py-2 border rounded-md">
      Switch Theme with Custom GIF Mask
    </button>
  )
}`,
      }
    }

    // Vanilla JavaScript / Headless performSwitch
    return {
      filename: 'src/theme-switch.js',
      code: `import { performSwitch } from 'glowafter'

// Headless direct function for vanilla JS, Svelte, Vue, or event listeners
const button = document.getElementById('theme-toggle-btn')

button.addEventListener('click', async (event) => {
  await performSwitch({
    presetId: 'viral-sweep',
    trigger: event, // Preserves exact touch/mouse coordinates
    duration: 1200,
    updateTheme: () => {
      // Optional: defaults to toggling 'dark' on <html> & saving in localStorage
      document.documentElement.classList.toggle('dark')
    },
  })
})`,
    }
  }

  const activeRecipe = getQuickstartCode()

  const copyActiveRecipe = async () => {
    try {
      await navigator.clipboard.writeText(activeRecipe.code)
      setRecipeCopied(true)
      setTimeout(() => setRecipeCopied(false), 2000)
    } catch {
      // Ignore
    }
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#playground">
        Skip to playground
      </a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="glowafter home">
          <span className="brand-symbol" />
          glowafter
        </a>
        <nav aria-label="Main navigation">
          <a href="#playground">Playground</a>
          <a href="#collection">Collection</a>
          <a href="#why">Why glowafter?</a>
          <a href="#quickstart">Quickstart</a>
          <a href="#catalog">Preset Matrix</a>
        </nav>
        <div className="header-actions">
          <a
            href="https://github.com/MArsalanwarsi/glowafter"
            target="_blank"
            rel="noreferrer"
            className="header-github-btn"
            aria-label="View glowafter on GitHub"
          >
            <GithubIcon size={16} /> <span>GitHub</span>
          </a>
          <Button
            variant="outline"
            className="header-toggle"
            onClick={play}
            disabled={!canPlay}
            aria-label="Toggle page theme"
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />} <span>{isDarkMode ? 'Light' : 'Dark'} mode</span>
          </Button>
        </div>
      </header>

      <main>
        <section className="intro">
          <p className="eyebrow">UNIVERSAL REACT ANIMATION ENGINE · JAVASCRIPT &amp; TYPESCRIPT</p>
          <div className="intro-row">
            <h1>
              A different kind
              <br />
              of <em>switch.</em>
            </h1>
            <div className="intro-aside">
              <p>
                A little nature. A little theatre. <br />
                Give the space between light
                <br className="desktop-break" /> and dark a cinematic feeling.
              </p>
              <a className="text-link" href="#playground">
                Launch interactive stage <ArrowDown size={15} />
              </a>
            </div>
          </div>
          <div className="hero-badges">
            <button
              onClick={copyInstallBadge}
              className="hero-badge hero-badge-interactive"
              title="Click to copy install command"
            >
              <Terminal size={12} />
              <code>npm i glowafter</code>
              {badgeCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
            <span className="hero-badge">
              <Sparkles size={12} /> JavaScript &amp; TypeScript
            </span>
            <span className="hero-badge">
              <Smartphone size={12} /> React · Vite · Next.js · CRA
            </span>
            <span className="hero-badge">
              <ShieldCheck size={12} /> Zero Mobile Stutter
            </span>
          </div>
        </section>

        <section id="playground" className="playground" aria-label="Theme transition playground">
          <div className="stage-copy">
            <div className="stage-top">
              <span className="status-dot" />
              <span>Live on this page</span>
            </div>
            <div className="stage-heading">
              <p className="eyebrow">{group(selected)} in motion</p>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
            </div>
            <Button className="play-button" onClick={play} disabled={!canPlay} aria-label="Play selected transition">
              <Play size={15} fill="currentColor" /> {isAnimating ? 'In motion…' : 'Make the switch'}
              <span className="play-destination">
                {isDarkMode ? 'Light' : 'Dark'} <ArrowUpRight size={13} />
              </span>
            </Button>
          </div>
          <div className="stage-art">
            <MotionArtwork recipe={selected} large />
            <span className="art-caption">
              {selected.supportsGif ? 'Your motion, your signature.' : 'Light flows into dark.'}
            </span>
          </div>
        </section>

        <div className="control-bar">
          <div className="duration-control">
            <label id="duration-label">Duration</label>
            <Slider
              aria-labelledby="duration-label"
              min={600}
              max={selected.supportsGif ? 15000 : 5000}
              step={100}
              value={[duration]}
              onValueChange={([value]) => setDuration(value)}
              disabled={isAnimating}
            />
            <output>{(duration / 1000).toFixed(1)}s</output>
          </div>
          <span className="control-hint">Try it in both directions.</span>
          <Dialog onOpenChange={() => setCopied(false)}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="code-trigger">
                <Code2 size={16} /> Get the code <ArrowUpRight size={14} />
              </Button>
            </DialogTrigger>
            <DialogContent className="code-dialog">
              <DialogHeader>
                <DialogTitle>{selected.name} in your project</DialogTitle>
                <DialogDescription>
                  Copy the code below for pure React (Vite / CRA) or Next.js in JavaScript or TypeScript.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex gap-1.5">
                  <button
                    className="pm-btn text-xs"
                    data-active={modalTarget === 'react'}
                    onClick={() => setModalTarget('react')}
                  >
                    React (Vite / CRA)
                  </button>
                  <button
                    className="pm-btn text-xs"
                    data-active={modalTarget === 'nextjs'}
                    onClick={() => setModalTarget('nextjs')}
                  >
                    Next.js
                  </button>
                </div>
                <div className="lang-toggle">
                  <button className="lang-btn" data-active={modalLang === 'js'} onClick={() => setModalLang('js')}>
                    JavaScript
                  </button>
                  <button className="lang-btn" data-active={modalLang === 'ts'} onClick={() => setModalLang('ts')}>
                    TypeScript
                  </button>
                </div>
              </div>

              <code className="install-command">npm install glowafter</code>
              <pre tabIndex={0}>
                <code>{getModalSnippet()}</code>
              </pre>
              <Button onClick={copyModalSnippet}>
                {copied ? <Check /> : <Copy />}
                {copied ? 'Copied' : 'Copy component'}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {selected.supportsGif && (
          <div className="gif-controls">
            <label className="upload-label">
              <Upload size={17} />
              {gifName || 'Upload a transparent GIF'}
              <input
                type="file"
                accept="image/gif"
                disabled={isAnimating}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  if (localGif.current) URL.revokeObjectURL(localGif.current)
                  localGif.current = URL.createObjectURL(file)
                  setGifUrl(localGif.current)
                  setGifName(file.name)
                }}
              />
            </label>
            <Input
              aria-label="GIF URL"
              placeholder="Or paste a GIF URL"
              value={gifName ? '' : gifUrl}
              disabled={isAnimating}
              onChange={(event) => {
                setGifUrl(event.target.value)
                setGifName('')
              }}
            />
            <p>Opaque pixels reveal the new theme. Set duration to one loop.</p>
          </div>
        )}
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}
        <p className="sr-only" role="status">
          {isAnimating
            ? 'Theme transition playing'
            : mounted
              ? isDarkMode
                ? 'Dark mode active'
                : 'Light mode active'
              : 'Loading theme'}
        </p>

        <section id="collection" className="collection">
          <div className="collection-heading">
            <div>
              <p className="eyebrow">The motion library</p>
              <h2>
                Small moments.
                <br />
                <em>Lasting impressions.</em>
              </h2>
            </div>
            <p>
              Choose a material.
              <br />
              See how it moves.
            </p>
          </div>
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="category-tabs" aria-label="Filter transitions">
              {groups.map((item) => (
                <TabsTrigger key={item} value={item}>
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="motion-grid">
            {FEATURED_PRESETS.filter((recipe) => category === 'All motion' || group(recipe) === category).map(
              (recipe) => (
                <button
                  key={recipe.id}
                  className="motion-card"
                  data-selected={selected.id === recipe.id}
                  aria-pressed={selected.id === recipe.id}
                  disabled={isAnimating}
                  onClick={() => select(recipe)}
                  aria-label={'Select ' + recipe.name}
                >
                  <div className="card-art">
                    <MotionArtwork recipe={recipe} />
                    {selected.id === recipe.id && (
                      <span className="selected-check">
                        <Check size={14} />
                      </span>
                    )}
                  </div>
                  <div className="card-label">
                    <span>{recipe.name}</span>
                    <ArrowUpRight size={16} />
                  </div>
                  <p>
                    {group(recipe)} <span>·</span> {(recipe.defaultDuration / 1000).toFixed(1)}s
                  </p>
                </button>
              )
            )}
          </div>
        </section>

        {/* ========================================================
            Section: Why glowafter?
            ======================================================== */}
        <section id="why" className="why-section">
          <div className="section-header">
            <p className="eyebrow">UNIVERSAL &amp; HIGH PERFORMANCE</p>
            <h2>
              Why <em>glowafter?</em>
            </h2>
            <p>
              Standard theme switchers either flash abruptly or stutter heavily on mobile touch screens. glowafter is
              engineered to deliver flawless 60/120 FPS transitions in any React app using JavaScript or TypeScript.
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-card-icon">
                <Smartphone size={22} />
              </div>
              <h3>Universal React (JS &amp; TS)</h3>
              <p>
                Works across Vite, Next.js (App &amp; Pages Router), Remix, Astro, and CRA. Requires zero configuration
                and no external state libraries. Features first-class support for both <strong>JavaScript</strong> and{' '}
                <strong>TypeScript</strong>.
              </p>
            </div>
            <div className="why-card">
              <div className="why-card-icon">
                <Sparkles size={22} />
              </div>
              <h3>Zero-Stutter Mobile Touch</h3>
              <p>
                Mobile browsers often misreport <code>document.hidden</code> during tap gestures. glowafter extracts raw
                touch coordinates from <code>touches[0]</code> / <code>changedTouches[0]</code> and promotes GPU
                compositor layers via <code>transform: translateZ(0)</code> and <code>will-change: clip-path</code>.
              </p>
            </div>
            <div className="why-card">
              <div className="why-card-icon">
                <ShieldCheck size={22} />
              </div>
              <h3>Dual-Engine Graceful Fallback</h3>
              <p>
                Leverages the native browser View Transitions API for peak 120 FPS hardware performance, and seamlessly
                falls back to GSAP canvas rendering on older WebKit and Firefox browsers. Automatically honors{' '}
                <code>prefers-reduced-motion</code> with instant swaps.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            Section: Quickstart & Setup
            ======================================================== */}
        <section id="quickstart" className="quickstart-section">
          <div className="section-header">
            <p className="eyebrow">INTEGRATION IN SECONDS</p>
            <h2>
              Install once. <em>Use anywhere.</em>
            </h2>
            <p>
              Designed for Vite, Next.js, Remix, CRA, and vanilla JS. Toggle below between JavaScript and TypeScript to
              view matching code recipes.
            </p>
          </div>

          <div className="quickstart-container">
            <div>
              <p className="text-sm font-semibold mb-1">Choose Package Manager</p>
              <div className="pm-selector">
                {(['npm', 'pnpm', 'yarn', 'bun'] as PackageManager[]).map((pm) => (
                  <button key={pm} className="pm-btn" data-active={activePm === pm} onClick={() => setActivePm(pm)}>
                    {pm}
                  </button>
                ))}
              </div>

              <div className="install-box">
                <code>{pmCommands[activePm]}</code>
                <button onClick={copyPmCommand} className="copy-pill-btn" aria-label="Copy install command">
                  {pmCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{pmCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>JavaScript &amp; TypeScript</strong> ready out of the box with complete types.
                  </span>
                </div>
                <div className="flex gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Vite, CRA, Next.js &amp; Remix</strong> zero-config compatibility.
                  </span>
                </div>
                <div className="flex gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero lock-in</strong>: automatically manages <code>classList</code> &amp;{' '}
                    <code>localStorage</code>, or connects to your state.
                  </span>
                </div>
                <div className="flex gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Headless performSwitch() API</strong> for vanilla JS and custom UI buttons.
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    className="pm-btn"
                    data-active={quickstartTarget === 'react'}
                    onClick={() => setQuickstartTarget('react')}
                  >
                    React (Vite / CRA)
                  </button>
                  <button
                    className="pm-btn"
                    data-active={quickstartTarget === 'nextjs'}
                    onClick={() => setQuickstartTarget('nextjs')}
                  >
                    Next.js
                  </button>
                  <button
                    className="pm-btn"
                    data-active={quickstartTarget === 'vanilla'}
                    onClick={() => setQuickstartTarget('vanilla')}
                  >
                    Vanilla JS
                  </button>
                  <button
                    className="pm-btn"
                    data-active={quickstartTarget === 'gif'}
                    onClick={() => setQuickstartTarget('gif')}
                  >
                    Custom GIF
                  </button>
                </div>
                {quickstartTarget !== 'vanilla' && (
                  <div className="lang-toggle">
                    <button
                      className="lang-btn"
                      data-active={quickstartLang === 'js'}
                      onClick={() => setQuickstartLang('js')}
                    >
                      JS
                    </button>
                    <button
                      className="lang-btn"
                      data-active={quickstartLang === 'ts'}
                      onClick={() => setQuickstartLang('ts')}
                    >
                      TS
                    </button>
                  </div>
                )}
              </div>

              <div className="recipe-card">
                <div className="recipe-header">
                  <span>{activeRecipe.filename}</span>
                  <button onClick={copyActiveRecipe} className="copy-pill-btn" aria-label="Copy snippet">
                    {recipeCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span>{recipeCopied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="recipe-body">
                  <code>{activeRecipe.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            Section: Complete Presets Matrix
            ======================================================== */}
        <section id="catalog" className="catalog-section">
          <div className="section-header">
            <p className="eyebrow">THE MOTION CATALOG</p>
            <h2>
              17 Presets. <em>Zero Stutter.</em>
            </h2>
            <p>
              Inspect all procedural recipes and their physical mechanics. Click &quot;Preview&quot; on any preset to
              test it on this page.
            </p>
          </div>

          <div className="table-wrapper">
            <table className="catalog-table">
              <thead>
                <tr>
                  <th>Preset ID</th>
                  <th>Family</th>
                  <th>Title</th>
                  <th>Motion Mechanics</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {FEATURED_PRESETS.map((recipe) => (
                  <tr key={recipe.id}>
                    <td>
                      <code>{recipe.id}</code>
                    </td>
                    <td>
                      <span className="badge-family">{group(recipe)}</span>
                    </td>
                    <td className="font-medium text-foreground">{recipe.name}</td>
                    <td>{recipe.description}</td>
                    <td>{(recipe.defaultDuration / 1000).toFixed(1)}s</td>
                    <td>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isAnimating}
                        onClick={() => selectAndScroll(recipe)}
                        className="h-7 text-xs px-2.5"
                      >
                        Preview <ArrowUpRight size={12} className="ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>
        <div className="flex items-center gap-3">
          <span className="brand-symbol" />
          <span className="wordmark">glowafter</span>
        </div>
        <span>Cinematic Theme Transitions for React in JavaScript &amp; TypeScript</span>
        <div className="footer-meta">
          <a
            href="https://github.com/MArsalanwarsi/glowafter"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
          >
            GitHub <ExternalLink size={11} />
          </a>
          <a
            href="https://www.npmjs.com/package/glowafter"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
          >
            npm <ExternalLink size={11} />
          </a>
          <a
            href="https://github.com/MArsalanwarsi/glowafter/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
          >
            MIT License
          </a>
        </div>
        <span>Crafted with precision by Muhammad Arsalan Warsi</span>
      </footer>
    </div>
  )
}
