import { PresetRecipe } from './types'

export const inkAndWaterPresets: PresetRecipe[] = [
  {
    id: 'capillary-ink',
    numId: '019',
    name: 'Capillary Ink',
    family: 'ink-and-water',
    description: 'Thin branching veins race ahead across paper fibers. Ink soaks sideways out of the veins until the untouched islands disappear.',
    motionKeywords: ['capillary', 'ink', 'veins', 'fibers', 'branching', 'soak'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.fillRect(0, 0, w * t, h)
      // Branching lines ahead
      ctx.strokeStyle = isDark ? '#38bdf8' : '#6366f1'
      ctx.lineWidth = 3
      const frontX = w * t
      for (let i = 0; i < 5; i++) {
        const y = (h / 6) * (i + 1)
        ctx.beginPath()
        ctx.moveTo(frontX, y)
        ctx.lineTo(frontX + 40 * Math.sin(t * 10 + i), y + (i % 2 === 0 ? 20 : -20))
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: capillaryInk ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes capillaryInk {
        0% { clip-path: polygon(0 0, 0 0, 0 50%, 0 100%, 0 100%); }
        50% { clip-path: polygon(0 0, 60% 0, 45% 50%, 55% 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'mercury-merge',
    numId: '020',
    name: 'Mercury Merge',
    family: 'ink-and-water',
    description: 'Separate rounded droplets approach, form narrow necks and become one continuous pool. Preserve the moment of joining.',
    motionKeywords: ['mercury', 'merge', 'droplets', 'metaball', 'liquid', 'fluid'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * (Math.hypot(w, h) / 2)
      ctx.beginPath()
      ctx.arc(w * 0.35, h * 0.5, r, 0, Math.PI * 2)
      ctx.arc(w * 0.65, h * 0.5, r, 0, Math.PI * 2)
      ctx.fill()
      // Joining bridge
      if (t > 0.3) {
        ctx.fillRect(w * 0.35, h * 0.5 - r * 0.7, w * 0.3, r * 1.4)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: mercuryMerge ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes mercuryMerge {
        0% { clip-path: circle(0% at 35% 50%); }
        40% { clip-path: circle(30% at 35% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'tidal-slosh',
    numId: '021',
    name: 'Tidal Slosh',
    family: 'ink-and-water',
    description: 'A tilted waterline rises, overshoots at one wall, then sends one returning crest across the page as the last dry corner floods.',
    motionKeywords: ['tidal', 'slosh', 'wave', 'waterline', 'flood', 'crest'],
    defaultDuration: 950,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(w, h)
      const waterH = h * (1 - t)
      const wave = Math.sin(t * Math.PI * 2) * 20
      ctx.lineTo(w, Math.max(0, waterH - wave))
      ctx.lineTo(0, Math.max(0, waterH + wave))
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: tidalSlosh ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes tidalSlosh {
        0% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); }
        60% { clip-path: polygon(0 40%, 100% 20%, 100% 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'whirlpool-drain',
    numId: '022',
    name: 'Whirlpool Drain',
    family: 'ink-and-water',
    description: 'The old view narrows into a curved ribbon around a fixed drain. The outside clears first and the last turn disappears into the eye.',
    motionKeywords: ['whirlpool', 'drain', 'spiral', 'vortex', 'curved ribbon'],
    defaultDuration: 950,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      if (t > 0) {
        const maxR = Math.hypot(w, h) * 0.75
        const r = t * maxR
        ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      // Remaining spiral of old theme
      if (t < 0.95) {
        const remainingR = (1 - t) * Math.hypot(w, h) * 0.5
        ctx.fillStyle = isDark ? '#f8f9fa' : '#111317'
        ctx.beginPath()
        ctx.arc(cx, cy, remainingR, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: whirlpool ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes whirlpool {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'marbled-comb',
    numId: '023',
    name: 'Marbled Comb',
    family: 'ink-and-water',
    description: 'Parallel bands enter together. A moving comb draws alternating hooks through the bands, and their S-shaped spaces close.',
    motionKeywords: ['marbled', 'comb', 'bands', 'ebru', 's-curves', 'patterns'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const bands = 8
      const bh = h / bands
      for (let i = 0; i < bands; i++) {
        const dir = i % 2 === 0 ? 1 : -1
        const bx = dir > 0 ? 0 : w * (1 - t)
        ctx.fillRect(bx, i * bh, w * t, bh)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: marbledComb ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes marbledComb {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0% 0 0); }
      }
    `
  },
  {
    id: 'bubble-raft',
    numId: '024',
    name: 'Bubble Raft',
    family: 'ink-and-water',
    description: 'A cluster of touching foam cells holds the old view. Shared walls pop in a visible chain, merging the windows before the outer rim disappears.',
    motionKeywords: ['bubble raft', 'foam', 'cells', 'pop', 'cluster', 'spheres'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const cells = 7
      const r = t * (w * 0.4)
      const centers = [
        [w * 0.5, h * 0.5],
        [w * 0.3, h * 0.3],
        [w * 0.7, h * 0.3],
        [w * 0.2, h * 0.6],
        [w * 0.8, h * 0.6],
        [w * 0.4, h * 0.8],
        [w * 0.6, h * 0.8],
      ]
      centers.forEach(([cx, cy]) => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: bubbleRaft ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes bubbleRaft {
        0% { clip-path: circle(0% at 50% 50%); }
        50% { clip-path: circle(40% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'dry-brush',
    numId: '025',
    name: 'Dry Brush',
    family: 'ink-and-water',
    description: 'A broad diagonal stroke leaves broken channels between its bristles. A shorter crossing stroke catches the missed spaces.',
    motionKeywords: ['dry brush', 'bristles', 'stroke', 'calligraphy', 'texture', 'paint'],
    defaultDuration: 850,
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
      // Crossing stroke
      if (t > 0.4) {
        const cW = (w + h) * (t - 0.4)
        ctx.beginPath()
        ctx.moveTo(w, h)
        ctx.lineTo(w - cW, h)
        ctx.lineTo(w, h - cW)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: dryBrush ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes dryBrush {
        0% { clip-path: polygon(0 0, 0 0, 0 0, 0 0); }
        60% { clip-path: polygon(0 0, 100% 0, 0 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'meandering-stream',
    numId: '026',
    name: 'Meandering Stream',
    family: 'ink-and-water',
    description: 'A narrow continuous stream doubles back across the page. Its bends widen unevenly until neighboring loops cut through and join.',
    motionKeywords: ['meandering', 'stream', 'river', 'bends', 'flood', 'oxbow'],
    defaultDuration: 950,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const streamW = w * t
      ctx.fillRect(0, 0, streamW, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: streamFlood ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes streamFlood {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0% 0 0); }
      }
    `
  },
  {
    id: 'drop-crown',
    numId: '027',
    name: 'Drop Crown',
    family: 'ink-and-water',
    description: 'A drop strikes and pushes up a serrated crown with a hollow center. The crown collapses inward while its outward sheet reaches the edges.',
    motionKeywords: ['drop crown', 'splash', 'serrated', 'impact', 'water droplet'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      // Crown points
      ctx.strokeStyle = isDark ? '#38bdf8' : '#6366f1'
      ctx.lineWidth = 3
      ctx.beginPath()
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI * 2) / 12
        const pr = r + (i % 2 === 0 ? 10 : -5)
        const px = cx + Math.cos(a) * pr
        const py = cy + Math.sin(a) * pr
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: dropCrown ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes dropCrown {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  }
]
