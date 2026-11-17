<h1 align="center">React Theme Switch Animation Hook</h1>

<p align="center">
  Beautiful, smooth animations for theme switching in React applications. Built with TypeScript and powered by the View Transition API.
</p>

## Nature transitions

Water Tank (`waterfall`) is the default. These procedural masks reveal the actual incoming page snapshot in both directions. The native path runs only during a toggle. Reduced motion switches immediately. The canvas fallback loads GSAP on demand.

| Preset ID | Motion |
| --- | --- |
| `waterfall` | Central pour and a rising, rippling surface |
| `silver-rain` | Accelerating drops, splashes and a filling screen |
| `puddle-bloom` | Expanding pools and travelling ripple rings |
| `falling-leaves` | Drifting maple leaves that unfold into the new theme |
| `paper-shred` | Staggered narrow strips |
| `paper-tear` | An irregular seam pulling open |
| `wall-break` | Fractured masonry blocks |
| `glass-break` | Radiating cracks and triangular facets |
| `tidal-silk` | A broad flowing wave |
| `ink-bloom` | Organic ink spreading outward |
| `woven-blinds` | Sequential horizontal bands |
| `gif` | A supplied animated alpha mask |

`FEATURED_PRESETS` provides this collection. Older catalog IDs remain resolvable through `getPresetById`. The nature recipes include their own motion timing and use linear playback of that geometry.

### Use with a shadcn Button and next-themes

Configure your ThemeProvider with `attribute="class"` and use your existing Button.

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useModeAnimation } from 'react-theme-switch-animation'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { ref, toggleSwitchTheme, mounted, isAnimating } = useModeAnimation({
    presetId: 'waterfall',
    isDarkMode: resolvedTheme === 'dark',
    onDarkModeChange: dark => setTheme(dark ? 'dark' : 'light'),
  })
  return <Button ref={ref} disabled={!mounted || isAnimating} onClick={toggleSwitchTheme}>
    Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} theme
  </Button>
}
```

For a custom reveal, set `presetId: 'gif'`, `gifUrl: '/motion/reveal.gif'` and `duration` to one loop in milliseconds. Transparent pixels preserve the outgoing page. Opaque pixels reveal the incoming theme. The entire new theme appears when the duration ends. Use a same-origin asset or a CORS-enabled URL. Each play loads a fresh blob URL to restart the GIF. A failed load rejects the toggle promise before changing the theme, so callers can show an error. With native View Transitions unavailable, a GIF switches immediately.

## 📦 Installation

Install the package using npm or yarn:

```bash
npm install react-theme-switch-animation
```

or

```bash
yarn add react-theme-switch-animation
```

## 📚 Usage

Here’s how to use the `useModeAnimation` hook in your React component:

```jsx
'use client'

import React from 'react'
import { useModeAnimation } from 'react-theme-switch-animation'

const MyComponent = () => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation()

  return (
    <button ref={ref} onClick={toggleSwitchTheme}>
      Toggle Dark Mode (Currently {isDarkMode ? 'Dark' : 'Light'} Mode)
    </button>
  )
}

export default MyComponent
```

## 📚 API

`useModeAnimation` accepts an optional `props` object with the following properties:

| Property           | Type                      | Default                         | Description                                                                                                 |
| ------------------ | ------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `duration` | number | Preset default | Duration in milliseconds, clamped to 0–15000. Water Tank defaults to 2400. |
| `easing`           | string                    | `"ease-in-out"`                 | CSS easing for the animation (defaults to an expo curve for `POLYGON`, `POLYGON_GRADIENT`, and `GIF`).      |
| `pseudoElement`    | string                    | `"::view-transition-new(root)"` | Pseudo-element used for the animation.                                                                      |
| `globalClassName`  | string                    | `"dark"`                        | Class name to apply to the root element.                                                                    |
| `animationType`    | ThemeAnimationType        | `undefined`     | Type of animation effect (`CIRCLE`, `BLUR_CIRCLE`, `QR_SCAN`, `POLYGON`, `POLYGON_GRADIENT`, `GIF`)         |
| `direction`        | ThemeAnimationDirection   | `ThemeAnimationDirection.LTR`   | Sweep direction for the `QR_SCAN` animation (`LTR`, `RTL`, `TTB`, `BTT`).                                   |
| `blurAmount`       | number                    | `2`                             | Blur intensity for blur circle animation.                                                                   |
| `gifUrl`           | string                    | `undefined`                     | URL of the GIF used as the reveal mask (required for the `GIF` animation type).                             |
| `styleId`          | string                    | `"theme-switch-style"`          | ID for the injected style element (blur circle, polygon gradient, and gif animations).                      |
| `isDarkMode`       | boolean                   | `undefined`                     | Controlled theme state.                                                                                    |
| `onDarkModeChange` | (isDark: boolean) => void | `undefined`                     | Callback function to handle dark mode change.                                                               |

Use `presetId` to select a named preset. Without `presetId` or `animationType`, the hook selects Water Tank.

### Animation Types

The hook supports six types of animations:

- `ThemeAnimationType.CIRCLE`: A clean circle expansion animation (default)
- `ThemeAnimationType.BLUR_CIRCLE`: A circle expansion with blur effect on the edges
- `ThemeAnimationType.QR_SCAN`: A scanning line that sweeps across the screen — configurable direction via the `direction` prop (left to right by default)
- `ThemeAnimationType.POLYGON`: A diagonal wipe — toward dark it sweeps from the top-left corner, back to light from the bottom-right
- `ThemeAnimationType.POLYGON_GRADIENT`: A diagonal wipe with a soft gradient edge expanding from the top-left corner
- `ThemeAnimationType.GIF`: Reveals the new theme through a custom GIF mask that releases at the end of the configured duration (requires `gifUrl`)

### Examples for Each Animation Type

#### Circle Animation (Default)

```jsx
'use client'

import React from 'react'
import { ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation'

const CircleAnimation = () => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.CIRCLE,
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme}>
      {isDarkMode ? '🌙' : '☀️'} Toggle Theme
    </button>
  )
}
```

#### Blur Circle Animation

```jsx
'use client'

import React from 'react'
import { ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation'

const BlurCircleAnimation = () => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    blurAmount: 4, // Optional: adjust blur intensity
    duration: 1000, // Optional: adjust animation duration
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme}>
      {isDarkMode ? '🌙' : '☀️'} Toggle Theme (Blur)
    </button>
  )
}
```

#### QR Scan Animation

```jsx
'use client'

import React from 'react'
import { ThemeAnimationDirection, ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation'

const QRScanAnimation = () => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.QR_SCAN,
    direction: ThemeAnimationDirection.LTR, // Optional: LTR (default), RTL, TTB, or BTT
    duration: 500, // Faster scan animation
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme}>
      {isDarkMode ? '🌙' : '☀️'} Toggle Theme (QR Scan)
    </button>
  )
}
```

The scan direction can be customized with `ThemeAnimationDirection`:

- `ThemeAnimationDirection.LTR`: left to right (default)
- `ThemeAnimationDirection.RTL`: right to left
- `ThemeAnimationDirection.TTB`: top to bottom
- `ThemeAnimationDirection.BTT`: bottom to top

String literals (`'ltr'`, `'rtl'`, `'ttb'`, `'btt'`) are also accepted.

#### Polygon Animation

```jsx
'use client'

import React from 'react'
import { ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation'

const PolygonAnimation = () => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.POLYGON,
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme}>
      {isDarkMode ? '🌙' : '☀️'} Toggle Theme (Polygon)
    </button>
  )
}
```

#### Polygon Gradient Animation

```jsx
'use client'

import React from 'react'
import { ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation'

const PolygonGradientAnimation = () => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.POLYGON_GRADIENT,
    duration: 1500, // Optional: defaults to 1500ms for this animation
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme}>
      {isDarkMode ? '🌙' : '☀️'} Toggle Theme (Polygon Gradient)
    </button>
  )
}
```

#### Custom GIF Animation

```jsx
'use client'

import React from 'react'
import { ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation'

const GifAnimation = () => {
  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.GIF,
    gifUrl: 'https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif', // Any GIF URL
    duration: 2000, // Optional: defaults to 2000ms for this animation
  })

  return (
    <button ref={ref} onClick={toggleSwitchTheme}>
      {isDarkMode ? '🌙' : '☀️'} Toggle Theme (GIF)
    </button>
  )
}
```

> **Tip:** GIFs with transparent backgrounds work best as masks — the theme is revealed through the opaque parts of the GIF. If `gifUrl` is omitted, the hook falls back to the circle animation.

Returns an object containing:

- `ref`: React ref for attaching to the component that will trigger the dark mode toggle.
- `toggleSwitchTheme`: Async function to toggle dark mode.
- `mounted`: Whether browser initialization has completed.
- `isAnimating`: Whether a transition or GIF preparation is active.
- `isDarkMode`: Current state of dark mode (`true` for dark, `false` for light).

## ⚡ Performance & Optimization

The native path generates a bounded set of interpolated clip paths at toggle time. It uses the browser's old and new page snapshots. Temporary transition styles and GIF blob URLs are removed on completion. Animation cost depends on viewport, browser and device.

GSAP is imported only when the canvas fallback is used. Reduced-motion requests skip animation. Concurrent clicks are ignored while a transition is active.

## Browser support

Native reveals require `document.startViewTransition` and CSS clip paths. Feature detection selects the canvas fallback otherwise. The browser regression suite uses Chromium. Test other browsers and physical devices used by your audience before release.

## 📝 Requirements

- React 17, 18 or 19
- TypeScript for compiling the package during installation
- TailwindCSS for styling (ensure dark mode is configured)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement suggestions.

## 📜 License

MIT License (c) Muhammad Arsalan Warsi


## Local development and verification

Run `npm --prefix example run dev -- --hostname 127.0.0.1 --port 3175` and open http://127.0.0.1:3175/react-theme-switch-animation.

Run `npm run build`, `npm --prefix example run build`, then `npm run test:browser`. Install Playwright Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_EXECUTABLE_PATH` to an existing Chromium executable. Browser checks cover the production export, actual path parsing and coverage, both theme directions, three viewport sizes, GIFs, reduced motion, unavailable storage, repeated clicks, fallback cleanup and keyboard controls.

The native implementation uses browser snapshots and procedural masks. The canvas fallback displays a colored reveal before committing the theme. Measure on your target devices before choosing durations for production.

# light-dark-theme-switch
