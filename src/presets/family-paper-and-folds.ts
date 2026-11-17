import { PresetRecipe, PresetContext } from './types'

export const paperAndFoldsPresets: PresetRecipe[] = [
  {
    id: 'corner-curl',
    numId: '010',
    name: 'Corner Curl',
    family: 'paper-and-folds',
    description: 'Lift one paper corner into a curved flap. The turned underside and its shadow travel along a diagonal as the target appears underneath.',
    motionKeywords: ['corner curl', 'paper', 'curl', 'flap', 'peel', 'diagonal'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const d = (w + h) * t
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.min(w, d), 0)
      ctx.lineTo(0, Math.min(h, d))
      ctx.closePath()
      ctx.fill()
      // Turned curl flap
      ctx.fillStyle = isDark ? '#334155' : '#cbd5e1'
      ctx.beginPath()
      ctx.moveTo(Math.min(w, d), 0)
      ctx.lineTo(Math.min(w, d * 0.8), 0)
      ctx.lineTo(0, Math.min(h, d * 0.8))
      ctx.lineTo(0, Math.min(h, d))
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: cornerCurl ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes cornerCurl {
        0% { clip-path: polygon(0 0, 0 0, 0 0); }
        100% { clip-path: polygon(0 0, 200% 0, 0 200%); }
      }
    `
  },
  {
    id: 'accordion-map',
    numId: '011',
    name: 'Accordion Map',
    family: 'paper-and-folds',
    description: 'Alternating mountain and valley folds gather an entire sheet into a short stack at one edge. The incoming page appears in the widening valleys.',
    motionKeywords: ['accordion', 'map', 'folds', 'pleats', 'valleys', 'mountain'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const strips = 6
      const sw = w / strips
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      for (let i = 0; i < strips; i++) {
        const factor = Math.min(1, Math.max(0, (t * strips - i * 0.5) / 0.8))
        const sx = i * sw
        ctx.fillRect(sx, 0, sw * factor, h)
        if (factor > 0 && factor < 1) {
          ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8'
          ctx.beginPath()
          ctx.moveTo(sx + sw * factor, 0)
          ctx.lineTo(sx + sw * factor, h)
          ctx.stroke()
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: accordionUnfold ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes accordionUnfold {
        0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'perforation-tear',
    numId: '012',
    name: 'Perforation Tear',
    family: 'paper-and-folds',
    description: 'Punched holes give way one at a time along a bent seam. The two unequal halves pull apart only after the last paper bridge breaks.',
    motionKeywords: ['perforation', 'tear', 'punched holes', 'ticket', 'seam', 'rip'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const tearProgress = Math.min(1, t * 1.3)
      const tearY = h * tearProgress
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.fillRect(0, 0, w * t, h)
      // Perforation dots
      ctx.fillStyle = isDark ? '#38bdf8' : '#6366f1'
      for (let y = 10; y < h; y += 15) {
        if (y < tearY) {
          ctx.beginPath()
          ctx.arc(w * t, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: perforationTear ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes perforationTear {
        0% { clip-path: polygon(0 0, 0 0, 0 50%, 0 100%, 0 100%); }
        50% { clip-path: polygon(0 0, 50% 0, 48% 50%, 50% 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'pop-up-spread',
    numId: '013',
    name: 'Pop-Up Spread',
    family: 'paper-and-folds',
    description: 'A center spine opens first. Hinged triangular tabs pull two nested paper faces upright, then those faces unfold into the destination page.',
    motionKeywords: ['pop-up', 'spine', 'book', 'triangular tabs', '3d', 'origami'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const midX = w / 2
      const spreadW = (w / 2) * t
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.moveTo(midX - spreadW, 0)
      ctx.lineTo(midX + spreadW, 0)
      ctx.lineTo(midX + spreadW, h)
      ctx.lineTo(midX - spreadW, h)
      ctx.closePath()
      ctx.fill()
      // Spine fold line
      ctx.strokeStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(midX, 0)
      ctx.lineTo(midX, h)
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: popUpSpread ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes popUpSpread {
        0% { clip-path: inset(0 50% 0 50%); }
        100% { clip-path: inset(0 0% 0 0%); }
      }
    `
  },
  {
    id: 'envelope-flap',
    numId: '014',
    name: 'Envelope Flap',
    family: 'paper-and-folds',
    description: 'A triangular flap lifts away from two stationary side pockets. The incoming page rises like an insert and covers the pockets on its way out.',
    motionKeywords: ['envelope', 'flap', 'letter', 'mail', 'insert', 'unfold'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const flapY = h * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(w, 0)
      ctx.lineTo(w / 2, flapY)
      ctx.closePath()
      ctx.fill()
      if (t > 0.4) {
        const slideH = (t - 0.4) * (h / 0.6)
        ctx.fillRect(0, 0, w, slideH)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: envelopeOpen ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes envelopeOpen {
        0% { clip-path: polygon(0 0, 100% 0, 50% 0, 50% 0); }
        40% { clip-path: polygon(0 0, 100% 0, 50% 50%, 50% 50%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'paper-snowflake',
    numId: '015',
    name: 'Paper Snowflake',
    family: 'paper-and-folds',
    description: 'Mirrored cuts spread through six folded sectors. The sheet opens in two stages, exposing a symmetric field of cutouts that grows together.',
    motionKeywords: ['snowflake', 'paper cuts', 'symmetric', 'sectors', 'hexagonal', 'bloom'],
    defaultDuration: 950,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const petals = 6
      const r = t * Math.hypot(w, h) * 0.7
      for (let i = 0; i < petals; i++) {
        const a = (i * Math.PI * 2) / petals
        ctx.beginPath()
        ctx.arc(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5, r * 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: snowflakeOpen ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes snowflakeOpen {
        0% {
          clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%);
        }
        50% {
          clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%);
        }
        100% {
          clip-path: polygon(50% -100%, 150% -50%, 200% 50%, 200% 150%, 150% 200%, 50% 200%, -50% 200%, -100% 150%, -100% 50%, -50% -50%);
        }
      }
    `
  },
  {
    id: 'shredded-fringe',
    numId: '016',
    name: 'Shredded Fringe',
    family: 'paper-and-folds',
    description: 'Slits climb to unequal heights in the old sheet. The resulting strips drop independently, leaving a briefly recognizable fringe.',
    motionKeywords: ['shredded', 'fringe', 'strips', 'paper ribbons', 'vertical', 'drop'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const count = 10
      const sw = w / count
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      for (let i = 0; i < count; i++) {
        const offset = ((i * 7) % 5) * 0.1
        const stripT = Math.min(1, Math.max(0, (t - offset) / 0.6))
        ctx.fillRect(i * sw, 0, sw, h * stripT)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: fringeDrop ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes fringeDrop {
        0% { clip-path: inset(0 0 100% 0); }
        100% { clip-path: inset(0 0 0% 0); }
      }
    `
  },
  {
    id: 'pull-tab-window',
    numId: '017',
    name: 'Pull-Tab Window',
    family: 'paper-and-folds',
    description: 'A tab slides behind two fixed paper slots. Its travel first exposes narrow windows, then unfolds the hidden panel between them.',
    motionKeywords: ['pull tab', 'slots', 'window', 'sliding', 'reveal', 'card'],
    defaultDuration: 800,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const winW = (w * 0.4) * t
      ctx.fillRect(w * 0.1, h * 0.2, winW, h * 0.6)
      ctx.fillRect(w * 0.5, h * 0.2, winW, h * 0.6)
      if (t > 0.5) {
        const bridgeT = (t - 0.5) / 0.5
        ctx.fillRect(0, 0, w, h * bridgeT)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: pullTab ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes pullTab {
        0% { clip-path: inset(20% 80% 20% 10%); }
        50% { clip-path: inset(20% 20% 20% 10%); }
        100% { clip-path: inset(0% 0% 0% 0%); }
      }
    `
  },
  {
    id: 'tabbed-index',
    numId: '018',
    name: 'Tabbed Index',
    family: 'paper-and-folds',
    description: 'Three staggered thumb tabs appear at the page edge. Selecting the deepest sheet displaces the sheets above it in steps, then the target sheet squares up.',
    motionKeywords: ['tabs', 'index', 'binder', 'organizer', 'sheets', 'staggered'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const sheetX = w * (1 - t)
      ctx.fillRect(0, 0, w - sheetX, h)
      // Tabs
      ctx.fillStyle = isDark ? '#60a5fa' : '#3b82f6'
      for (let i = 0; i < 3; i++) {
        const tabY = 40 + i * 50
        ctx.fillRect(Math.max(0, w - sheetX - 10), tabY, 15, 30)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: tabbedIndex ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes tabbedIndex {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0% 0 0); }
      }
    `
  }
]
