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
type CodeRecipeTab = 'nextjs' | 'vite' | 'gif' | 'perform'

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
  const [activePm, setActivePm] = useState<PackageManager>('npm')
  const [pmCopied, setPmCopied] = useState(false)
  const [activeRecipe, setActiveRecipe] = useState<CodeRecipeTab>('nextjs')
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

  const snippet = `'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useModeAnimation } from 'glowafter'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { toggleSwitchTheme, mounted, isAnimating } =
    useModeAnimation({
      presetId: '${selected.id}',
      duration: ${duration},${selected.supportsGif ? "\n      gifUrl: '/motion/reveal.gif'," : ''}
      isDarkMode: resolvedTheme === 'dark',
      onDarkModeChange: dark => setTheme(dark ? 'dark' : 'light'),
    })

  return (
    <Button onClick={toggleSwitchTheme}
      disabled={!mounted || isAnimating}>
      Change theme
    </Button>
  )
}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
    } catch {
      setError('Select the code below to copy it manually.')
    }
  }

  const copyInstallBadge = async () => {
    try {
      await navigator.clipboard.writeText('npm install glowafter next-themes')
      setBadgeCopied(true)
      setTimeout(() => setBadgeCopied(false), 2000)
    } catch {
      // Ignore
    }
  }

  const pmCommands: Record<PackageManager, string> = {
    npm: 'npm install glowafter next-themes',
    pnpm: 'pnpm add glowafter next-themes',
    yarn: 'yarn add glowafter next-themes',
    bun: 'bun add glowafter next-themes',
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

  const recipeCodes: Record<CodeRecipeTab, { filename: string; code: string }> = {
    nextjs: {
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
    },
    vite: {
      filename: 'src/ThemeToggle.tsx',
      code: `import React from 'react'
import { useModeAnimation } from 'glowafter'

export function ThemeToggle() {
  const { ref, toggleSwitchTheme, isDarkMode, mounted, isAnimating } = useModeAnimation({
    presetId: 'glass-shatter',
    duration: 1400,
  })

  if (!mounted) return null

  return (
    <button
      ref={ref}
      onClick={toggleSwitchTheme}
      disabled={isAnimating}
      className="px-4 py-2 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
    >
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}`,
    },
    gif: {
      filename: 'components/gif-theme-toggle.tsx',
      code: `'use client'

import { useModeAnimation } from 'glowafter'

export function GifThemeToggle() {
  const { ref, toggleSwitchTheme, isAnimating } = useModeAnimation({
    presetId: 'gif',
    gifUrl: '/assets/reveal-mask.gif',
    duration: 2200,
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme} disabled={isAnimating}>
      Switch Theme with Animated GIF
    </button>
  )
}`,
    },
    perform: {
      filename: 'utils/theme-trigger.ts',
      code: `import { performSwitch } from 'glowafter'

// Headless direct execution for vanilla JS, state machines, or custom triggers
export async function handleThemeSwitch(event: MouseEvent | TouchEvent) {
  await performSwitch({
    presetId: 'viral-sweep',
    trigger: event, // Preserves touch/mouse coordinates
    duration: 1200,
    updateTheme: async () => {
      document.documentElement.classList.toggle('dark')
    },
  })
}`,
    },
  }

  const copyActiveRecipe = async () => {
    try {
      await navigator.clipboard.writeText(recipeCodes[activeRecipe].code)
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
          <p className="eyebrow">OPEN-SOURCE REACT ANIMATION ENGINE</p>
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
              <code>npm i glowafter next-themes</code>
              {badgeCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
            <span className="hero-badge">
              <Sparkles size={12} /> 17 Procedural Presets + GIF Mask
            </span>
            <span className="hero-badge">
              <Smartphone size={12} /> Zero Mobile Stutter
            </span>
            <span className="hero-badge">
              <ShieldCheck size={12} /> View Transitions API + GSAP
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
                  Use your shadcn Button with a next-themes provider configured with attribute=&quot;class&quot;.
                </DialogDescription>
              </DialogHeader>
              <code className="install-command">npm install glowafter next-themes</code>
              <p className="text-sm text-muted-foreground">
                These presets are in this local development build. Publish or install the local package to use them.
              </p>
              <pre tabIndex={0}>
                <code>{snippet}</code>
              </pre>
              <Button onClick={copy}>
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
            <p className="eyebrow">HIGH PERFORMANCE ENGINEERING</p>
            <h2>
              Why <em>glowafter?</em>
            </h2>
            <p>
              Standard theme switchers either flash abruptly or stutter heavily on mobile touch screens. glowafter is
              engineered to deliver flawless 60/120 FPS transitions across all modern devices.
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-card-icon">
                <Smartphone size={22} />
              </div>
              <h3>Zero-Stutter Mobile Touch</h3>
              <p>
                Mobile browsers often misreport <code>document.hidden</code> during tap gestures and lack mouse
                coordinates. glowafter extracts raw coordinates from <code>touches[0]</code> /{' '}
                <code>changedTouches[0]</code>, eliminates false-skip visibility checks, and applies GPU compositor
                promotion via <code>transform: translateZ(0)</code> and <code>will-change: clip-path</code>.
              </p>
            </div>
            <div className="why-card">
              <div className="why-card-icon">
                <Sparkles size={22} />
              </div>
              <h3>Procedural Vector Mathematics</h3>
              <p>
                Zero heavy video files or massive pre-rendered textures. All 17 presets are computed mathematically in
                pure SVG geometry: multi-harmonic wave harmonics, Voronoi fracture shards, and elastic tension curves.
                Every preset strictly guarantees &lt;0.02 coverage at t=0 and &gt;0.99 at t=1 across 320px to 4K
                viewports.
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
                <code>prefers-reduced-motion</code> with instantaneous theme state swaps.
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
              Designed for Next.js App Router, Vite, shadcn/ui, and Tailwind CSS. Add cinematic theme switching with a
              single hook.
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
                    <strong>Next.js 14, 15, and 16</strong> App Router and Pages Router compatible.
                  </span>
                </div>
                <div className="flex gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Official shadcn/ui & next-themes</strong> 2-line drop-in setup.
                  </span>
                </div>
                <div className="flex gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Full TypeScript Strict Mode</strong> declarations and auto-completion.
                  </span>
                </div>
                <div className="flex gap-2">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dynamic GIF Mask Engine</strong> for branded and custom alpha transitions.
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="recipe-tabs flex gap-2 mb-3">
                <button
                  className="pm-btn"
                  data-active={activeRecipe === 'nextjs'}
                  onClick={() => setActiveRecipe('nextjs')}
                >
                  Next.js App Router
                </button>
                <button
                  className="pm-btn"
                  data-active={activeRecipe === 'vite'}
                  onClick={() => setActiveRecipe('vite')}
                >
                  Vite / React SPA
                </button>
                <button className="pm-btn" data-active={activeRecipe === 'gif'} onClick={() => setActiveRecipe('gif')}>
                  Custom GIF
                </button>
                <button
                  className="pm-btn"
                  data-active={activeRecipe === 'perform'}
                  onClick={() => setActiveRecipe('perform')}
                >
                  Headless API
                </button>
              </div>

              <div className="recipe-card">
                <div className="recipe-header">
                  <span>{recipeCodes[activeRecipe].filename}</span>
                  <button onClick={copyActiveRecipe} className="copy-pill-btn" aria-label="Copy snippet">
                    {recipeCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span>{recipeCopied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="recipe-body">
                  <code>{recipeCodes[activeRecipe].code}</code>
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
        <span>Cinematic Theme Transitions for React & Next.js</span>
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
