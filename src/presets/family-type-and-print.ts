import { PresetRecipe } from './types'

export const typeAndPrintPresets: PresetRecipe[] = [
  {
    id: 'counterform-bloom',
    numId: '100',
    name: 'Counterform Bloom',
    family: 'type-and-print',
    description: 'The interior spaces of oversized O, A and P letterforms open first. Their counters grow through the surrounding strokes and merge.',
    motionKeywords: ['counterform', 'typography', 'letters', 'counters', 'bloom', 'fonts'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(cx - 50, cy, r * 0.7, 0, Math.PI * 2)
      ctx.arc(cx + 50, cy, r * 0.7, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: counterform ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes counterform {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'baseline-drop',
    numId: '101',
    name: 'Baseline Drop',
    family: 'type-and-print',
    description: 'Bands hang from typographic baselines, then fall in reading order. Descenders briefly catch below each line, leaving uneven old-theme fragments.',
    motionKeywords: ['baseline drop', 'typography', 'descenders', 'reading order', 'bands'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const lines = 6
      const lh = h / lines
      for (let i = 0; i < lines; i++) {
        const factor = Math.min(1, Math.max(0, (t * 1.5 - (i / lines) * 0.5)))
        ctx.fillRect(0, i * lh, w, lh * factor)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: baselineDrop ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes baselineDrop {
        0% { clip-path: inset(0 0 100% 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'letterpress-kiss',
    numId: '102',
    name: 'Letterpress Kiss',
    family: 'type-and-print',
    description: 'A plate of raised, reversed glyphs tips into contact. Its high points transfer first, its broader impression follows, and the plate lifts clear.',
    motionKeywords: ['letterpress', 'kiss', 'printing', 'impression', 'relief', 'glyphs'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const pressW = w * t
      ctx.fillRect((w - pressW) / 2, 0, pressW, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: letterpress ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes letterpress {
        0% { clip-path: inset(0 50% 0 50%); }
        100% { clip-path: inset(0 0% 0 0%); }
      }
    `
  },
  {
    id: 'typewriter-carriage',
    numId: '103',
    name: 'Typewriter Carriage',
    family: 'type-and-print',
    description: 'Monospaced character windows expose the destination across each line. A visible carriage return starts the next line while completed characters stay open.',
    motionKeywords: ['typewriter', 'carriage return', 'monospace', 'keystrokes', 'analog'],
    defaultDuration: 900,
    defaultEasing: 'steps(8)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const lines = 5
      const lh = h / lines
      const lineProgress = t * lines
      const completedLines = Math.floor(lineProgress)
      for (let i = 0; i < completedLines; i++) {
        ctx.fillRect(0, i * lh, w, lh)
      }
      if (completedLines < lines) {
        const curLineW = (lineProgress - completedLines) * w
        ctx.fillRect(0, completedLines * lh, curLineW, lh)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: typewriter ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes typewriter {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'chisel-nib',
    numId: '104',
    name: 'Chisel Nib',
    family: 'type-and-print',
    description: 'A broad, angled nib draws a loop with visibly different thick and thin strokes. A final crossbar connects the enclosed spaces into the full reveal.',
    motionKeywords: ['chisel nib', 'calligraphy', 'pen', 'strokes', 'thick and thin', 'lettering'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const strokeW = (w + h) * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(strokeW, 0)
      ctx.lineTo(0, strokeW)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: chiselNib ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes chiselNib {
        0% { clip-path: polygon(0 0, 0 0, 0 0); }
        100% { clip-path: polygon(0 0, 250% 0, 0 250%); }
      }
    `
  },
  {
    id: 'hatch-engraving',
    numId: '105',
    name: 'Hatch Engraving',
    family: 'type-and-print',
    description: 'Long parallel cuts expose the first layer. Shorter crossing cuts deepen selected regions before the uncut ridges flatten.',
    motionKeywords: ['hatch engraving', 'crosshatch', 'etching', 'woodcut', 'printmaking'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const cuts = 10
      const ch = h / cuts
      for (let i = 0; i < cuts; i++) {
        ctx.fillRect(0, i * ch, w * t, ch * 0.7)
      }
      if (t > 0.6) {
        ctx.fillRect(0, 0, w * ((t - 0.6) / 0.4), h)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: hatchEngrave ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes hatchEngrave {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'stencil-bridges',
    numId: '106',
    name: 'Stencil Bridges',
    family: 'type-and-print',
    description: 'A stencil deposits large islands of the destination at once. The small physical bridges supporting its inner shapes lift away in a separate beat.',
    motionKeywords: ['stencil', 'bridges', 'spray paint', 'street art', 'templates'],
    defaultDuration: 850,
    defaultEasing: 'steps(3)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: stencilBridge ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes stencilBridge {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'ligature-join',
    numId: '107',
    name: 'Ligature Join',
    family: 'type-and-print',
    description: 'An oversized f and i move in from different baselines and interlock. Their new connecting stroke stretches sideways to unfold the destination page.',
    motionKeywords: ['ligature', 'join', 'fi ligature', 'typography', 'interlock', 'connecting'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const spanW = (w / 2) * t
      ctx.fillRect(w / 2 - spanW, 0, spanW * 2, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: ligatureJoin ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes ligatureJoin {
        0% { clip-path: inset(0 50% 0 50%); }
        100% { clip-path: inset(0 0% 0 0%); }
      }
    `
  },
  {
    id: 'redaction-lift',
    numId: '108',
    name: 'Redaction Lift',
    family: 'type-and-print',
    description: 'The space around word-length redaction bars changes first. The remaining old-theme bars lift from alternating ends like removable strips.',
    motionKeywords: ['redaction', 'censorship', 'bars', 'classified', 'strips', 'lift'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const revealH = h * t
      ctx.fillRect(0, 0, w, revealH)
      // Remaining redaction bars
      if (t < 0.95) {
        ctx.fillStyle = isDark ? '#f8f9fa' : '#111317'
        const barH = 14
        const bars = 4
        for (let i = 0; i < bars; i++) {
          const factor = Math.max(0, 1 - (t * 1.5 - i * 0.2))
          ctx.fillRect(40, 30 + i * 40, (w - 80) * factor, barH)
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: redactionLift ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes redactionLift {
        0% { clip-path: inset(0 0 100% 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  }
]
