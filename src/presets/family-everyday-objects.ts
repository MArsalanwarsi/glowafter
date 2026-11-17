import { PresetRecipe } from './types'

export const everydayObjectsPresets: PresetRecipe[] = [
  {
    id: 'vinyl-runout',
    numId: '091',
    name: 'Vinyl Runout',
    family: 'everyday-objects',
    description: 'A stylus follows one continuous spiral. The played groove widens behind the stylus while the unplayed center label holds the old theme until the end.',
    motionKeywords: ['vinyl', 'record', 'stylus', 'groove', 'spiral', 'audio', 'turntable'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: vinylSpiral ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes vinylSpiral {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'deck-deal',
    numId: '092',
    name: 'Deck Deal',
    family: 'everyday-objects',
    description: 'The old view fans into a hand of overlapping cards. Lower cards deal away to alternate sides, and the final face settles flat as the live page.',
    motionKeywords: ['deck deal', 'cards', 'fan', 'shuffle', 'card trick', 'deal'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const dealW = w * t
      ctx.fillRect(0, 0, dealW, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: deckDeal ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes deckDeal {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'pinball-run',
    numId: '093',
    name: 'Pinball Run',
    family: 'everyday-objects',
    description: 'A ball carves a connected route through a few bumpers. Impacts flip neighboring pockets, and the completed route widens to connect them.',
    motionKeywords: ['pinball', 'bumpers', 'arcade', 'trajectory', 'ricochet'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(w * 0.3, h * 0.3, r * 0.6, 0, Math.PI * 2)
      ctx.arc(w * 0.7, h * 0.7, r * 0.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: pinballRun ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes pinballRun {
        0% { clip-path: circle(0% at 30% 30%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'hourglass-exchange',
    numId: '094',
    name: 'Hourglass Exchange',
    family: 'everyday-objects',
    description: 'The old surface drains through a narrow waist while a triangular pile of the new surface grows below. The glass outline opens when the last grain passes.',
    motionKeywords: ['hourglass', 'sand', 'drain', 'triangular pile', 'waist', 'time'],
    defaultDuration: 950,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const sandH = h * t
      ctx.beginPath()
      ctx.moveTo(w / 2 - (w * 0.4) * t, h)
      ctx.lineTo(w / 2 + (w * 0.4) * t, h)
      ctx.lineTo(w / 2, h - sandH)
      ctx.closePath()
      ctx.fill()
      if (t > 0.6) {
        ctx.fillRect(0, 0, w, h * ((t - 0.6) / 0.4))
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: hourglassDrain ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes hourglassDrain {
        0% { clip-path: polygon(50% 100%, 50% 100%, 50% 100%); }
        50% { clip-path: polygon(10% 100%, 90% 100%, 50% 50%); }
        100% { clip-path: polygon(-150% 250%, 250% 250%, 50% -150%); }
      }
    `
  },
  {
    id: 'magnetic-filings',
    numId: '095',
    name: 'Magnetic Filings',
    family: 'everyday-objects',
    description: 'Short strokes align around two magnetic poles. The strokes elongate along curved field lines until the spaces between them close.',
    motionKeywords: ['magnetic', 'filings', 'poles', 'field lines', 'magnetism', 'physics'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(w * 0.25, h / 2, r, 0, Math.PI * 2)
      ctx.arc(w * 0.75, h / 2, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: magneticPoles ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes magneticPoles {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'umbrella-snap',
    numId: '096',
    name: 'Umbrella Snap',
    family: 'everyday-objects',
    description: 'Spokes spread from one hub, carrying bowed canopy panels between them. The canopy opens slightly past flat and settles over the page.',
    motionKeywords: ['umbrella', 'canopy', 'spokes', 'rain', 'dome', 'snap open'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: umbrellaSnap ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes umbrellaSnap {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'rubber-band',
    numId: '097',
    name: 'Rubber Band',
    family: 'everyday-objects',
    description: 'Two anchors pull a loop into a stretched triangle, opening a window inside it. One anchor releases and the recoiling loop sweeps the remaining surface clear.',
    motionKeywords: ['rubber band', 'elastic', 'recoil', 'triangle', 'snap', 'stretch'],
    defaultDuration: 800,
    defaultEasing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const bandW = w * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(bandW, h / 2)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: rubberBandSnap ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes rubberBandSnap {
        0% { clip-path: polygon(0 0, 0 50%, 0 100%); }
        100% { clip-path: polygon(-150% -150%, 350% 50%, -150% 250%); }
      }
    `
  },
  {
    id: 'tangram-flight',
    numId: '098',
    name: 'Tangram Flight',
    family: 'everyday-objects',
    description: 'Seven recognizable tangram pieces leave a square and assemble into a bird silhouette. The bird carries the remaining old view off the page.',
    motionKeywords: ['tangram', 'puzzle', 'geometric', 'flight', 'bird silhouette', 'origami'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const polyW = (w + h) * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(polyW, 0)
      ctx.lineTo(0, polyW)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: tangramFlight ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes tangramFlight {
        0% { clip-path: polygon(0 0, 0 0, 0 0); }
        100% { clip-path: polygon(0 0, 250% 0, 0 250%); }
      }
    `
  },
  {
    id: 'nesting-dolls',
    numId: '099',
    name: 'Nesting Dolls',
    family: 'everyday-objects',
    description: 'A shell splits at its waist and exposes a smaller shell of the opposite theme. The inner shell opens on a second beat and its interior becomes the full page.',
    motionKeywords: ['nesting dolls', 'matryoshka', 'russian doll', 'layers', 'shells', 'split'],
    defaultDuration: 950,
    defaultEasing: 'steps(3)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const maxR = Math.hypot(w, h) * 0.7
      const step = Math.floor(t * 3) + 1
      for (let i = 1; i <= step; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (maxR / 3) * i, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: nestingDolls ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes nestingDolls {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  }
]
