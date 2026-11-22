<h1 align="center">glowafter</h1>

<p align="center">
  <strong>Cinematic, stutter-free theme transition animations for React & Next.js</strong><br />
  Powered by the native View Transitions API with GSAP canvas fallback.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/glowafter"><img src="https://img.shields.io/npm/v/glowafter.svg?style=flat-square&color=black" alt="npm version" /></a>
  <a href="https://github.com/MArsalanwarsi/light-dark-theme-switch/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/React-17%20%7C%2018%20%7C%2019-61DAFB?style=flat-square" alt="React 17, 18, 19" />
</p>

---

## 🌟 Highlights

- **17 Procedural Presets**: 6 high-energy cinematic animations + 11 physical nature-inspired reveals.
- **Custom GIF Alpha Masks**: Use any animated GIF as a dynamic alpha reveal mask.
- **Zero-Stutter Mobile Touch**: Native touch event coordinate extraction (`touches[0]` / `changedTouches[0]`) with GPU compositor layer promotion (`transform: translateZ(0)` and `will-change: clip-path`).
- **Mathematical Coverage Contract**: Guaranteed `< 0.02` initial coverage and `> 0.99` final coverage across any screen resolution (mobile, tablet, desktop, ultra-wide, and 4K).
- **Reduced Motion Built-In**: Automatically respects `prefers-reduced-motion` with instantaneous theme state changes.
- **GSAP Canvas Fallback**: Gracefully falls back to high-performance canvas rendering on browsers lacking native View Transitions support.
- **First-Class shadcn/ui & next-themes**: Seamless 2-line integration with Tailwind CSS and Next.js App Router.

---

## 📦 Installation

```bash
# npm
npm install glowafter next-themes

# pnpm
pnpm add glowafter next-themes

# yarn
yarn add glowafter next-themes

# bun
bun add glowafter next-themes
```

---

## 🚀 Quickstart (Next.js App Router + shadcn/ui)

### 1. Theme Provider Setup (`components/theme-provider.tsx`)

```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'
import * as React from 'react'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

Wrap your root layout in `app/layout.tsx`:

```tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Animated Theme Toggle Button (`components/theme-toggle.tsx`)

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { useModeAnimation, type NaturePresetId } from 'glowafter'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

interface ThemeToggleProps {
  presetId?: NaturePresetId
}

export function ThemeToggle({ presetId = 'viral-sweep' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { ref, toggleSwitchTheme, mounted, isAnimating } = useModeAnimation({
    presetId,
    isDarkMode: resolvedTheme === 'dark',
    onDarkModeChange: (dark) => setTheme(dark ? 'dark' : 'light'),
  })

  if (!mounted) {
    return <Button variant="outline" size="icon" disabled />
  }

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      disabled={isAnimating}
      onClick={toggleSwitchTheme}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
```

---

## 🎬 Animation Presets

| Category      | Preset ID                 | Title             | Description                                                              |
| :------------ | :------------------------ | :---------------- | :----------------------------------------------------------------------- |
| **Cinematic** | `viral-sweep` _(Default)_ | Viral Sweep       | Smooth exponential circular shockwave radiating outward                  |
| **Cinematic** | `glass-shatter`           | Glass Shatter     | Voronoi crystalline fracture shards radiating from origin                |
| **Cinematic** | `seaside-waves`           | Seaside Waves     | Sinusoidal ocean tidal surf with multi-harmonic wave crests              |
| **Cinematic** | `balloon-pop`             | Balloon Pop       | Elastic bubble stretch followed by a sudden radial pop rupture           |
| **Cinematic** | `bomb-drop`               | Bomb Drop         | Descending gravity projectile arc detonating into a concussive shockwave |
| **Cinematic** | `party`                   | Celebration Party | Starburst explosion with dispersing confetti ribbons & streamers         |
| **Water**     | `waterfall`               | Water Tank        | Central pour meeting a rising, rippling waterline                        |
| **Water**     | `silver-rain`             | Rainfall          | Rain droplets accelerating into a splash pool                            |
| **Water**     | `puddle-bloom`            | Puddle Ripple     | Expanding concentric circular ripples                                    |
| **Water**     | `tidal-silk`              | Tidal Silk        | Sweeping diagonal sinusoidal tide                                        |
| **Material**  | `paper-shred`             | Paper Shred       | Vertical slicing ribbons cascading down                                  |
| **Material**  | `paper-tear`              | Paper Tear        | Ragged diagonal tearing fissure                                          |
| **Material**  | `wall-break`              | Wall Break        | Heavy masonry blocks tumbling apart                                      |
| **Material**  | `glass-break`             | Glass Fracture    | Jagged radial spiderweb fractures                                        |
| **Material**  | `woven-blinds`            | Woven Blinds      | Alternating Venetian slat aperture reveal                                |
| **Organic**   | `falling-leaves`          | Autumn Leaves     | Swirling autumnal foliage with gravitational drift                       |
| **Organic**   | `ink-bloom`               | Ink Bloom         | Multi-capillary fluid diffusion blossom                                  |
| **Custom**    | `gif`                     | Custom GIF        | User-provided animated alpha mask                                        |

---

## 🖼️ Custom GIF Masking

Reveal the incoming theme through any animated GIF mask:

```tsx
'use client'

import { useModeAnimation } from 'glowafter'

export function GifToggle() {
  const { ref, toggleSwitchTheme } = useModeAnimation({
    presetId: 'gif',
    gifUrl: '/motion/reveal.gif', // Path to transparent alpha GIF
    duration: 2000,
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme}>
      Toggle with GIF
    </button>
  )
}
```

> **Note**: Transparent pixels in the GIF preserve the outgoing page, while opaque pixels reveal the incoming theme. At completion, the mask is automatically released.

---

## ⚙️ Direct Function API (`performSwitch`)

For headless or event-driven theme toggles outside of React hooks:

```typescript
import { performSwitch } from 'glowafter'

await performSwitch({
  presetId: 'viral-sweep',
  trigger: mouseOrTouchEvent, // touch/mouse event for origin coordinates
  duration: 1200,
  updateTheme: async () => {
    document.documentElement.classList.toggle('dark')
  },
})
```

---

## 📚 Props Reference (`useModeAnimation`)

| Property           | Type                      | Default         | Description                                                |
| :----------------- | :------------------------ | :-------------- | :--------------------------------------------------------- |
| `presetId`         | `NaturePresetId`          | `'viral-sweep'` | Named preset ID from the 17 procedural presets or `'gif'`. |
| `duration`         | `number`                  | Preset default  | Animation duration in milliseconds (clamped to 0–15000ms). |
| `easing`           | `string`                  | `'linear'`      | CSS transition easing function.                            |
| `gifUrl`           | `string`                  | `undefined`     | Required when `presetId: 'gif'`.                           |
| `isDarkMode`       | `boolean`                 | `undefined`     | Controlled dark mode state.                                |
| `onDarkModeChange` | `(dark: boolean) => void` | `undefined`     | Callback invoked when dark mode is toggled.                |
| `globalClassName`  | `string`                  | `'dark'`        | Class applied to `document.documentElement` during switch. |

---

## 🛠️ Local Development & Playground

```bash
# Build the library
npm run build

# Run unit & coverage test suite (1,621 tests)
npm test

# Run Playwright browser test suite (58 tests across 3 viewports)
npm run test:browser

# Launch Afterglow interactive demo playground
npm --prefix example run dev -- --hostname 127.0.0.1 --port 3175
```

Open [http://127.0.0.1:3175/react-theme-switch-animation](http://127.0.0.1:3175/react-theme-switch-animation) to view the playground.

---

## 📜 License

[MIT](LICENSE) © Muhammad Arsalan Warsi
