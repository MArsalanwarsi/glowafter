<div align="center">
  <img src="public/logo.svg" alt="glowafter logo" width="96" height="96" />

# glowafter Playground

  <p><strong>Interactive demonstration portal and live testing playground for glowafter.</strong></p>
  <p>Engineered with Next.js 16 App Router, React 19, Tailwind CSS v4, and shadcn/ui.</p>

  <p>
    <a href="https://glowafter.vercel.app"><img src="https://img.shields.io/badge/demo-live_playground-090a0c.svg?style=flat-square" alt="Live Demo" /></a>
    <a href="https://www.npmjs.com/package/glowafter"><img src="https://img.shields.io/npm/v/glowafter.svg?style=flat-square&color=38bdf8" alt="npm version" /></a>
    <a href="https://github.com/MArsalanwarsi/glowafter"><img src="https://img.shields.io/badge/github-glowafter-181717.svg?style=flat-square&logo=github" alt="GitHub Repository" /></a>
  </p>
</div>

---

This is the official demonstration playground for **`glowafter`**, showcasing all 17 procedural theme transition presets and the custom GIF alpha mask engine in action.

## 🌟 Features Demonstrated

- **Live Full-Screen Theme Transitions**: Test all 17 procedural presets (Cinematic, Water, Material, Organic) directly on the page layout.
- **Interactive Duration Slider**: Dynamically adjust transition durations from 0.6s to 15s to inspect motion curves and keyframe interpolation.
- **Custom GIF Mask Studio**: Upload your own transparent animated GIF or paste a GIF URL to test custom dynamic alpha masking.
- **1-Click Production Code Generator**: Generates copy-pasteable React + shadcn/ui + next-themes code snippets tailored to your selected preset and duration.
- **Zero-Stutter Mobile Touch Verification**: Validates responsive multi-touch event extraction and GPU layer promotion across mobile, tablet, and desktop viewports.

---

## 🚀 Getting Started

### 1. Install Dependencies

From the repository root:

```bash
npm install
npm --prefix example install
```

### 2. Start the Development Server

```bash
npm --prefix example run dev
```

Open [http://localhost:3000](http://localhost:3000) (or your designated port) in your browser.

---

## 🛠️ Building for Production

The playground is configured for static HTML export (`output: 'export'`), ready to deploy to Vercel, Netlify, or GitHub Pages.

```bash
# Production export to example/out
npm --prefix example run build
```

When building for GitHub Pages, provide `GITHUB_PAGES=true` to automatically prefix assets with `/glowafter`:

```bash
GITHUB_PAGES=true npm --prefix example run build
```

---

## 🧪 Browser E2E Testing with Playwright

Run the Playwright test suite to verify theme transitions across multiple viewports:

```bash
# Run 58 tests across Mobile (390x844), Tablet (768x1024), and Desktop (1440x900)
npm run test:browser
```

---

## 📄 License

MIT © [Muhammad Arsalan Warsi](https://github.com/MArsalanwarsi)
