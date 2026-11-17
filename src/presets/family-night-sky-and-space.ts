import { PresetRecipe, PresetContext } from './types'

export const nightSkyAndSpacePresets: PresetRecipe[] = [
  {
    id: 'orbital-eclipse',
    numId: '064',
    name: 'Orbital Eclipse',
    family: 'night-sky-and-space',
    description: 'Two offset discs cross near the trigger. Their overlap leaves a thin crescent, then a quiet corona, before the shadow carries dark mode to the far corners. On the return trip, let a sliver of daylight emerge first.',
    motionKeywords: ['orbital eclipse', 'eclipse', 'moon', 'sun', 'corona', 'crescent', 'shadow'],
    defaultDuration: 950,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    supportsOrigin: true,
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      const maxR = Math.hypot(w, h) * 0.7
      const r = t * maxR
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      // Corona glow edge
      if (t > 0.1 && t < 0.9) {
        ctx.strokeStyle = isDark ? 'rgba(96,165,250,0.8)' : 'rgba(251,191,36,0.8)'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx: PresetContext) => `
      ::view-transition-new(root) {
        animation: orbitalEclipse ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes orbitalEclipse {
        0% { clip-path: circle(0% at ${ctx.x}px ${ctx.y}px); }
        40% { clip-path: circle(35% at ${ctx.x}px ${ctx.y}px); }
        100% { clip-path: circle(150% at ${ctx.x}px ${ctx.y}px); }
      }
    `
  },
  {
    id: 'constellation-atlas',
    numId: '065',
    name: 'Constellation Atlas',
    family: 'night-sky-and-space',
    description: 'A small set of stars appears. Lines connect neighboring stars, and each triangular region fills when its third edge closes.',
    motionKeywords: ['constellation', 'atlas', 'stars', 'triangles', 'astronomy', 'lines'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const polyW = w * t
      ctx.beginPath()
      ctx.moveTo(w * 0.2, h * 0.2)
      ctx.lineTo(w * 0.2 + polyW * 0.6, h * 0.3)
      ctx.lineTo(w * 0.2 + polyW * 0.5, h * 0.8)
      ctx.lineTo(w * 0.1, h * 0.7)
      ctx.closePath()
      ctx.fill()
      // Star dots
      ctx.fillStyle = isDark ? '#38bdf8' : '#818cf8'
      ;[[w*0.2, h*0.2], [w*0.2 + polyW*0.6, h*0.3], [w*0.2 + polyW*0.5, h*0.8], [w*0.1, h*0.7]].forEach(([sx, sy]) => {
        ctx.beginPath()
        ctx.arc(sx, sy, 3, 0, Math.PI * 2)
        ctx.fill()
      })
      if (t > 0.6) {
        ctx.fillRect(0, 0, w * ((t - 0.6) / 0.4), h)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: constellationFill ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes constellationFill {
        0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
        60% { clip-path: polygon(20% 20%, 80% 30%, 70% 80%, 10% 70%); }
        100% { clip-path: polygon(-50% -50%, 150% -50%, 150% 150%, -50% 150%); }
      }
    `
  },
  {
    id: 'aurora-ribbons',
    numId: '066',
    name: 'Aurora Ribbons',
    family: 'night-sky-and-space',
    description: 'Two broad curtains undulate out of phase. The destination appears first where they overlap, then their separated folds widen to expose the rest.',
    motionKeywords: ['aurora', 'borealis', 'ribbons', 'curtains', 'undulate', 'waves'],
    defaultDuration: 950,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const curH = h * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      for (let x = 0; x <= w; x += 20) {
        const wave = Math.sin((x / w) * Math.PI * 4 + t * 5) * 15
        ctx.lineTo(x, curH + wave)
      }
      ctx.lineTo(w, 0)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: auroraWave ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes auroraWave {
        0% { clip-path: inset(0 0 100% 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'comet-wake',
    numId: '067',
    name: 'Comet Wake',
    family: 'night-sky-and-space',
    description: 'A bright head follows one curved route and exits early. Three nested tail lengths peel away in succession, leaving a steadily widening destination behind.',
    motionKeywords: ['comet', 'wake', 'tail', 'meteor', 'peel away', 'celestial'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const tipX = w * t
      const tipY = h * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(tipX, tipY)
      ctx.lineTo(0, tipY)
      ctx.closePath()
      ctx.fill()
      // Comet head
      ctx.fillStyle = isDark ? '#38bdf8' : '#fbbf24'
      ctx.beginPath()
      ctx.arc(tipX, tipY, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: cometWake ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes cometWake {
        0% { clip-path: polygon(0 0, 0 0, 0 0); }
        100% { clip-path: polygon(0 0, 250% 0, 0 250%); }
      }
    `
  },
  {
    id: 'saturn-ringplane',
    numId: '068',
    name: 'Saturn Ringplane',
    family: 'night-sky-and-space',
    description: 'A tilted ring passes behind a disc on one side and in front on the other. The ring tips toward the viewer and spreads beyond the frame.',
    motionKeywords: ['saturn', 'ringplane', 'planet', 'disc', 'tilt', 'rings'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const rw = w * 0.7 * t
      const rh = h * 0.2 * t
      ctx.beginPath()
      ctx.ellipse(cx, cy, rw, rh, Math.PI / 6, 0, Math.PI * 2)
      ctx.fill()
      if (t > 0.4) {
        ctx.beginPath()
        ctx.arc(cx, cy, (t - 0.4) * Math.hypot(w, h), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: saturnRing ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes saturnRing {
        0% { clip-path: ellipse(0% 0% at 50% 50%); }
        50% { clip-path: ellipse(70% 20% at 50% 50%); }
        100% { clip-path: ellipse(150% 150% at 50% 50%); }
      }
    `
  },
  {
    id: 'star-trails',
    numId: '069',
    name: 'Star Trails',
    family: 'night-sky-and-space',
    description: 'Short, separated arcs lengthen around an off-center celestial pole. They join into circular tracks that broaden until their gaps close.',
    motionKeywords: ['star trails', 'arcs', 'celestial pole', 'long exposure', 'concentric'],
    defaultDuration: 950,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w * 0.3
      const cy = h * 0.4
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.8
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: starTrails ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes starTrails {
        0% { clip-path: circle(0% at 30% 40%); }
        100% { clip-path: circle(150% at 30% 40%); }
      }
    `
  },
  {
    id: 'binary-orbit',
    numId: '070',
    name: 'Binary Orbit',
    family: 'night-sky-and-space',
    description: 'Two apertures orbit a common center and trade positions. Their trails join into a figure eight whose lobes grow across the canvas.',
    motionKeywords: ['binary orbit', 'figure eight', 'stars', 'orbit', 'lobes', 'dual'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      const dist = 50
      const a = t * Math.PI * 2
      const r = t * (Math.hypot(w, h) / 2)
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.arc(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, r, 0, Math.PI * 2)
      ctx.arc(cx - Math.cos(a) * dist, cy - Math.sin(a) * dist, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: binaryOrbit ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes binaryOrbit {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'starflight',
    numId: '071',
    name: 'Starflight',
    family: 'night-sky-and-space',
    description: 'Points in a deep star field stretch into radial streaks at different speeds. The target appears in the widening corridors between near and far streaks.',
    motionKeywords: ['starflight', 'warp speed', 'hyperspace', 'radial streaks', 'sci-fi'],
    defaultDuration: 850,
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
      // Warp speed lines
      ctx.strokeStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.lineWidth = 2
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(a) * r * 0.3, cy + Math.sin(a) * r * 0.3)
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: warpSpeed ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes warpSpeed {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'solar-prominence',
    numId: '072',
    name: 'Solar Prominence',
    family: 'night-sky-and-space',
    description: 'Loops rise from a curved horizon while their two feet stay anchored. The new view fills each arch from the top down before their feet spread apart.',
    motionKeywords: ['solar prominence', 'flare', 'loops', 'horizon', 'magnetic arch', 'sun'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const loopH = h * t
      ctx.beginPath()
      ctx.arc(w / 2, h, loopH, Math.PI, 0)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: solarLoop ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes solarLoop {
        0% { clip-path: circle(0% at 50% 100%); }
        100% { clip-path: circle(150% at 50% 100%); }
      }
    `
  }
]
