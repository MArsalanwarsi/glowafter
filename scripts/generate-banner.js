const { chromium } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

async function renderBanner() {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      width: 1200px;
      height: 675px;
      overflow: hidden;
      background: #080b11;
      color: #f1f5f9;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px 56px 40px;
    }

    /* Ambient Glowing Gradients */
    .glow-cyan {
      position: absolute;
      width: 480px;
      height: 480px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(56, 189, 248, 0) 70%);
      top: -120px;
      left: -80px;
      filter: blur(50px);
      pointer-events: none;
    }
    .glow-purple {
      position: absolute;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(168, 85, 247, 0) 70%);
      top: 100px;
      right: 180px;
      filter: blur(60px);
      pointer-events: none;
    }
    .glow-emerald {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0) 70%);
      bottom: -100px;
      left: 300px;
      filter: blur(50px);
      pointer-events: none;
    }

    /* Subtle grid overlay */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: radial-gradient(circle at 60% 40%, black 40%, transparent 85%);
      pointer-events: none;
    }

    /* Top Brand Bar */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }
    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 0 12px rgba(56, 189, 248, 0.2);
    }
    .brand-symbol {
      width: 22px;
      height: 22px;
      border: 2px solid #38bdf8;
      border-radius: 50%;
      background: linear-gradient(90deg, #38bdf8 50%, transparent 50%);
      transform: rotate(-35deg);
    }
    .brand-name {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .version-tag {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 12px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      font-weight: 600;
    }
    .install-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.14);
      padding: 8px 18px;
      border-radius: 24px;
      font-family: monospace;
      font-size: 13px;
      color: #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .install-pill span {
      color: #38bdf8;
      font-weight: 700;
    }

    /* Main Grid */
    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 40px;
      align-items: center;
      z-index: 10;
      margin: 10px 0;
    }

    /* Left Copy Column */
    .left-col {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #34d399;
    }
    .hero-eyebrow-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 8px #34d399;
    }
    h1 {
      font-size: 44px;
      line-height: 1.12;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #ffffff;
    }
    h1 em {
      font-style: normal;
      background: linear-gradient(135deg, #38bdf8, #818cf8 50%, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      font-size: 15px;
      line-height: 1.6;
      color: #94a3b8;
      max-width: 540px;
    }

    /* Code Card */
    .code-box {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px 18px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 12px;
      line-height: 1.65;
      color: #cbd5e1;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(12px);
    }
    .code-box .kw { color: #f43f5e; font-weight: 600; }
    .code-box .fn { color: #38bdf8; }
    .code-box .str { color: #34d399; }
    .code-box .cm { color: #64748b; font-style: italic; }

    /* Feature Badges Bar */
    .badge-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 4px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      font-size: 11.5px;
      font-weight: 500;
      color: #e2e8f0;
    }

    /* Right Preview Mockup Card */
    .preview-card {
      position: relative;
      width: 440px;
      height: 310px;
      background: #111622;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15);
      display: flex;
      flex-direction: column;
    }
    .preview-header {
      height: 32px;
      background: rgba(0, 0, 0, 0.4);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      padding: 0 14px;
      gap: 6px;
    }
    .window-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }
    .preview-title {
      font-size: 10px;
      color: #64748b;
      margin-left: 8px;
      font-family: monospace;
    }

    /* Split Screen Theme Demo */
    .split-stage {
      flex: 1;
      position: relative;
      display: flex;
      overflow: hidden;
    }
    .half-light {
      width: 48%;
      background: #f7f6f2;
      color: #1e293b;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .half-dark {
      width: 52%;
      background: #141814;
      color: #f1f5f9;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-left: 2px solid #38bdf8;
      box-shadow: -6px 0 20px rgba(56, 189, 248, 0.4);
    }
    .mock-text-line {
      height: 8px;
      border-radius: 4px;
      opacity: 0.6;
    }
    .half-light .mock-text-line { background: #cbd5e1; }
    .half-dark .mock-text-line { background: #334155; }
    .mock-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .mock-card {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 11px;
    }
    .half-light .mock-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }
    .half-dark .mock-card {
      background: #212921;
      border: 1px solid #2f3a2f;
      color: #cbd5e1;
    }

    /* Center Wave Shockwave Marker */
    .wave-badge {
      position: absolute;
      top: 50%;
      left: 48%;
      transform: translate(-50%, -50%);
      background: #0f172a;
      border: 1.5px solid #38bdf8;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.5), 0 4px 10px rgba(0, 0, 0, 0.5);
      white-space: nowrap;
      z-index: 20;
    }

    /* Bottom Info Bar */
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 16px;
      font-size: 12px;
      color: #64748b;
      z-index: 10;
    }
    .links-group {
      display: flex;
      gap: 20px;
    }
    .links-group span {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #94a3b8;
    }
    .author-credit {
      color: #cbd5e1;
      font-weight: 500;
    }
    .author-credit strong {
      color: #ffffff;
    }
  </style>
</head>
<body>
  <!-- Ambient Gradients -->
  <div class="glow-cyan"></div>
  <div class="glow-purple"></div>
  <div class="glow-emerald"></div>
  <div class="grid-overlay"></div>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="brand-wrap">
      <div class="brand-logo">
        <div class="brand-symbol"></div>
      </div>
      <div class="brand-name">
        glowafter
        <span class="version-tag">v1.0.2</span>
      </div>
    </div>
    <div class="install-pill">
      <span>$</span> npm install glowafter
    </div>
  </div>

  <!-- Hero Grid -->
  <div class="hero-grid">
    <div class="left-col">
      <div class="hero-eyebrow">
        <div class="hero-eyebrow-dot"></div>
        Open-Source React Animation Engine
      </div>
      <h1>
        A different kind of <em>theme switch.</em>
      </h1>
      <p class="hero-desc">
        Say goodbye to abrupt screen flashes and mobile touch stutter. Powered by native View Transitions with automatic GSAP canvas fallback.
      </p>

      <div class="code-box">
        <span class="kw">import</span> { useModeAnimation } <span class="kw">from</span> <span class="str">'glowafter'</span><br>
        <span class="kw">const</span> { ref, toggleSwitchTheme, isDarkMode } = <span class="fn">useModeAnimation</span>({<br>
        &nbsp;&nbsp;presetId: <span class="str">'viral-sweep'</span>, <span class="cm">// 17 procedural presets + GIF</span><br>
        &nbsp;&nbsp;duration: <span class="str">1200</span><br>
        })
      </div>

      <div class="badge-strip">
        <div class="badge">⚡ Zero-Stutter Mobile Touch</div>
        <div class="badge">🎨 JS &amp; TS (Vite, Next.js, CRA)</div>
        <div class="badge">🌊 17 Procedural Presets</div>
        <div class="badge">🛡️ View Transitions + GSAP</div>
      </div>
    </div>

    <!-- Right Mockup Column -->
    <div class="preview-card">
      <div class="preview-header">
        <div class="window-dot dot-red"></div>
        <div class="window-dot dot-yellow"></div>
        <div class="window-dot dot-green"></div>
        <span class="preview-title">glowafter-demo.tsx · 120 FPS</span>
      </div>
      <div class="split-stage">
        <div class="half-light">
          <div class="mock-title">Light Mode</div>
          <div class="mock-text-line" style="width: 70%;"></div>
          <div class="mock-text-line" style="width: 90%;"></div>
          <div class="mock-card">
            <strong>Smooth Radiance</strong><br>
            Zero visual flash
          </div>
        </div>
        <div class="half-dark">
          <div class="mock-title">Dark Mode</div>
          <div class="mock-text-line" style="width: 80%;"></div>
          <div class="mock-text-line" style="width: 60%;"></div>
          <div class="mock-card">
            <strong>Deep Nocturnal</strong><br>
            GPU accelerated
          </div>
        </div>
        <div class="wave-badge">
          ✨ Viral Sweep
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Bar -->
  <div class="bottom-bar">
    <div class="links-group">
      <span>📦 npm: glowafter</span>
      <span>🌐 glowafter.vercel.app</span>
      <span>⭐ github.com/MArsalanwarsi/glowafter</span>
    </div>
    <div class="author-credit">
      Engineered by <strong>Muhammad Arsalan Warsi</strong>
    </div>
  </div>
</body>
</html>
  `

  const htmlPath = path.resolve('assets/linkedin-banner.html')
  const pngPath = path.resolve('assets/linkedin-banner.png')

  fs.writeFileSync(htmlPath, htmlContent, 'utf8')

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 2 })
  await page.goto('file:///' + htmlPath.replace(/\\\\/g, '/'))
  await page.waitForTimeout(500)
  await page.screenshot({ path: pngPath, type: 'png' })
  await browser.close()

  console.log('Successfully generated high-resolution banner at:', pngPath)
}

renderBanner().catch((err) => {
  console.error('Error rendering banner:', err)
  process.exit(1)
})
