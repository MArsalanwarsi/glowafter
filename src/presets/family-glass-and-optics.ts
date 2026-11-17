import { PresetRecipe } from './types'

export const glassAndOpticsPresets: PresetRecipe[] = [
  {
    id: 'prism-split',
    numId: '046',
    name: 'Prism Split',
    family: 'glass-and-optics',
    description: 'A triangular wedge divides the scene into three displaced image slices. The gaps expose the target before the slices align again. The split must read in grayscale.',
    motionKeywords: ['prism', 'split', 'triangular', 'refraction', 'wedge', 'dispersion'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const splitH = (h / 3) * t
      ctx.fillRect(0, 0, w, splitH)
      ctx.fillRect(0, h * 0.33, w, splitH)
      ctx.fillRect(0, h * 0.66, w, splitH)
      if (t > 0.7) ctx.fillRect(0, 0, w, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: prismSplit ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes prismSplit {
        0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'stained-glass',
    numId: '047',
    name: 'Stained Glass',
    family: 'glass-and-optics',
    description: 'An irregular lead outline appears across the page. Alternating groups of enclosed panes fill with the new view, then the leading recedes.',
    motionKeywords: ['stained glass', 'panes', 'lead came', 'cathedral', 'mosaics', 'facets'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.fillRect(0, 0, w * t, h)
      // Glass lead lines
      ctx.strokeStyle = isDark ? '#1e293b' : '#94a3b8'
      ctx.lineWidth = 3
      for (let x = 30; x < w * t; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x - 20, h)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: stainedGlass ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes stainedGlass {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'sugar-glass',
    numId: '048',
    name: 'Sugar Glass',
    family: 'glass-and-optics',
    description: 'Cracks radiate from the point of impact, pause under tension, then release broad shards that tip at different angles and fall away.',
    motionKeywords: ['sugar glass', 'shatter', 'cracks', 'shards', 'impact', 'break'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      // Radial crack lines
      ctx.strokeStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.lineWidth = 2
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI * 2) / 8
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: sugarGlass ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes sugarGlass {
        0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%); }
        100% { clip-path: polygon(-50% -50%, 50% -100%, 150% -50%, 200% 50%, 150% 150%, 50% 200%, -50% 150%, -100% 50%); }
      }
    `
  },
  {
    id: 'lenticular-tilt',
    numId: '049',
    name: 'Lenticular Tilt',
    family: 'glass-and-optics',
    description: 'Parallel optical ribs expose alternating slivers of the two themes. The ribs turn edge-on and settle with every visible facet showing the destination.',
    motionKeywords: ['lenticular', 'tilt', 'ribs', 'optical slats', 'hologram', 'slits'],
    defaultDuration: 850,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const slats = 12
      const sw = w / slats
      for (let i = 0; i < slats; i++) {
        ctx.fillRect(i * sw, 0, sw * t, h)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: lenticularTilt ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes lenticularTilt {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'fresnel-steps',
    numId: '050',
    name: 'Fresnel Steps',
    family: 'glass-and-optics',
    description: 'Concentric lens zones show discontinuous magnifications of the interface. They come into register one ring at a time until the page is flat.',
    motionKeywords: ['fresnel', 'rings', 'concentric', 'lighthouse', 'stepped lens'],
    defaultDuration: 900,
    defaultEasing: 'steps(5)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const maxR = Math.hypot(w, h) * 0.6
      const rings = 5
      const activeRings = Math.floor(t * rings) + 1
      for (let i = 1; i <= activeRings; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (maxR / rings) * i, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: fresnelSteps ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes fresnelSteps {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'kaleidoscope-lock',
    numId: '051',
    name: 'Kaleidoscope Lock',
    family: 'glass-and-optics',
    description: 'Reflected wedges turn in opposing directions. Their landmarks line up at one angle and their mirrored seams retract.',
    motionKeywords: ['kaleidoscope', 'wedges', 'mirrored', 'symmetry', 'radial rotation'],
    defaultDuration: 950,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      const wedges = 8
      for (let i = 0; i < wedges; i++) {
        if (i % 2 === 0) {
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          const a1 = (i * Math.PI * 2) / wedges
          const a2 = ((i + 1) * Math.PI * 2) / wedges
          ctx.arc(cx, cy, r, a1, a2)
          ctx.closePath()
          ctx.fill()
        }
      }
      if (t > 0.5) {
        ctx.beginPath()
        ctx.arc(cx, cy, r * (t - 0.5) * 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: kaleidoscope ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes kaleidoscope {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'caustic-web',
    numId: '052',
    name: 'Caustic Web',
    family: 'glass-and-optics',
    description: 'Moving, curved ridges enclose shifting pools. The destination settles into each pool as two ridges meet, then the ridges flatten.',
    motionKeywords: ['caustic', 'web', 'underwater', 'light rays', 'ridges', 'refraction'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.fillRect(0, 0, w * t, h)
      ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.5)' : 'rgba(99,102,241,0.5)'
      ctx.lineWidth = 2
      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.arc(w * 0.3 * i, h * 0.5, (w * 0.4) * t, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: causticWeb ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes causticWeb {
        0% { clip-path: circle(0% at 0% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'twin-polarizers',
    numId: '053',
    name: 'Twin Polarizers',
    family: 'glass-and-optics',
    description: 'Overlapping slotted grids rotate against one another. Their apertures contract into a field of pinholes before opening onto the new view.',
    motionKeywords: ['polarizers', 'slotted grids', 'pinholes', 'cross-polarization', 'optics'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const openR = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, openR, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: polarizers ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes polarizers {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'rolling-magnifier',
    numId: '054',
    name: 'Rolling Magnifier',
    family: 'glass-and-optics',
    description: 'A convex lens travels on a curved path, magnifying the destination inside its rim. It deposits that view at normal scale in its widening wake.',
    motionKeywords: ['magnifier', 'convex lens', 'curved path', 'glass', 'wake', 'lens'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const magX = w * t
      ctx.fillRect(0, 0, magX, h)
      // Magnifier rim
      ctx.strokeStyle = isDark ? '#38bdf8' : '#3b82f6'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(magX, h / 2, 40, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: rollingMagnifier ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes rollingMagnifier {
        0% { clip-path: circle(0% at 0% 50%); }
        100% { clip-path: circle(150% at 100% 50%); }
      }
    `
  }
]
