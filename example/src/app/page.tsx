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
import { ArrowDown, ArrowUpRight, Check, Code2, Copy, Moon, Play, Sun, Upload } from 'lucide-react'
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

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme()
  const [selected, setSelected] = useState(FEATURED_PRESETS[0])
  const [category, setCategory] = useState('All motion')
  const [duration, setDuration] = useState(selected.defaultDuration)
  const [gifUrl, setGifUrl] = useState('')
  const [gifName, setGifName] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
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

  return (
    <div className="site-shell">
      <a className="skip-link" href="#playground">
        Skip to playground
      </a>
      <header className="site-header">
        <a href="#" className="wordmark" aria-label="Afterglow home">
          <span className="brand-symbol" />
          afterglow
        </a>
        <nav aria-label="Main navigation">
          <a href="#collection">Collection</a>
          <a href="#integration">
            Integration <ArrowUpRight size={13} />
          </a>
        </nav>
        <Button
          variant="outline"
          className="header-toggle"
          onClick={play}
          disabled={!canPlay}
          aria-label="Toggle page theme"
        >
          {isDarkMode ? <Sun /> : <Moon />} <span>{isDarkMode ? 'Light' : 'Dark'} mode</span>
        </Button>
      </header>

      <main>
        <section className="intro">
          <p className="eyebrow">A collection of theme transitions</p>
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
                <br className="desktop-break" /> and dark a feeling.
              </p>
              <a className="text-link" href="#collection">
                Find your motion <ArrowDown size={15} />
              </a>
            </div>
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

        <section id="integration" className="integration">
          <div>
            <p className="eyebrow">Made to fit</p>
            <h2>
              Your theme.
              <br />
              <em>A new way there.</em>
            </h2>
          </div>
          <div className="integration-copy">
            <p>
              One hook, your existing theme provider, and the button you already use. Built for React and shadcn/ui.
            </p>
            <p className="muted-copy">Motion runs when you switch. Reduced-motion preferences are respected.</p>
            <a href="#playground" className="text-link">
              Choose a transition to get its code <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      </main>
      <footer>
        <span className="wordmark">afterglow</span>
        <span>React Theme Switch Animation</span>
        <span>Made by Muhammad Arsalan Warsi</span>
      </footer>
    </div>
  )
}
