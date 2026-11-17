import { PresetRecipe } from './types'

export const mechanicalMotionPresets: PresetRecipe[] = [
  {
    id: 'escapement-tick',
    numId: '055',
    name: 'Escapement Tick',
    family: 'mechanical-motion',
    description: 'Two pallets alternately catch a notched wheel. Each release exposes a new wedge in a deliberate tick before the remaining teeth withdraw.',
    motionKeywords: ['escapement', 'tick', 'clockwork', 'pendulum', 'notched wheel', 'pallets'],
    defaultDuration: 900,
    defaultEasing: 'steps(6)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      const r = Math.hypot(w, h) * 0.7
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const ticks = 6
      const currentTick = Math.floor(t * ticks) + 1
      for (let i = 0; i < currentTick; i++) {
        const a1 = (i * Math.PI * 2) / ticks
        const a2 = ((i + 1) * Math.PI * 2) / ticks
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, r, a1, a2)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: escapement ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes escapement {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'rack-and-pinion',
    numId: '056',
    name: 'Rack and Pinion',
    family: 'mechanical-motion',
    description: 'A wheel drives a toothed rack. Interlocking teeth form the moving boundary between the old and new interfaces.',
    motionKeywords: ['rack and pinion', 'gear', 'teeth', 'linear drive', 'mechanical seam'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const rx = w * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      for (let y = 0; y <= h; y += 20) {
        ctx.lineTo(rx + ((y / 20) % 2 === 0 ? 12 : -12), y)
      }
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: rackPinion ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes rackPinion {
        0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'scissor-lift',
    numId: '057',
    name: 'Scissor Lift',
    family: 'mechanical-motion',
    description: 'Crossed arms extend under a rigid deck. Diamond gaps in the mechanism expose the new view first, then the rising deck clears the rest.',
    motionKeywords: ['scissor lift', 'crossed arms', 'deck', 'diamonds', 'vertical lift'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const liftH = h * t
      ctx.fillRect(0, h - liftH, w, liftH)
      // Scissor criss-cross lines
      ctx.strokeStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.lineWidth = 2
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, h)
        ctx.lineTo(x + 20, h - liftH)
        ctx.lineTo(x + 40, h)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: scissorLift ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes scissorLift {
        0% { clip-path: inset(100% 0 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'piston-bank',
    numId: '058',
    name: 'Piston Bank',
    family: 'mechanical-motion',
    description: 'Wide pistons compress to unequal depths, hold, then retract in firing order. Their stepped crowns carry the boundary.',
    motionKeywords: ['piston bank', 'engine', 'cylinders', 'stepped', 'firing order'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const pistons = 6
      const pw = w / pistons
      for (let i = 0; i < pistons; i++) {
        const factor = Math.min(1, Math.max(0, (t * 1.5 - ((i * 3) % pistons) * 0.1)))
        ctx.fillRect(i * pw, 0, pw, h * factor)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: pistonBank ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes pistonBank {
        0% { clip-path: inset(0 0 100% 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'pantograph',
    numId: '059',
    name: 'Pantograph',
    family: 'mechanical-motion',
    description: 'A hinged linkage traces a small rectangular loop and a synchronized, enlarged loop. The expanding region between the outlines reveals the page.',
    motionKeywords: ['pantograph', 'linkage', 'hinged', 'scaling', 'drafting', 'tracing'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const rectW = w * t
      const rectH = h * t
      ctx.fillRect((w - rectW) / 2, (h - rectH) / 2, rectW, rectH)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: pantograph ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes pantograph {
        0% { clip-path: inset(50% 50% 50% 50%); }
        100% { clip-path: inset(0% 0% 0% 0%); }
      }
    `
  },
  {
    id: 'combination-dial',
    numId: '060',
    name: 'Combination Dial',
    family: 'mechanical-motion',
    description: 'Three rings turn independently until their notches align. A bar passes through all three and releases the old surface in two halves.',
    motionKeywords: ['combination dial', 'safe', 'vault', 'rings', 'notches', 'lock'],
    defaultDuration: 950,
    defaultEasing: 'steps(3)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const maxR = Math.hypot(w, h) * 0.7
      const rings = 3
      const ringStep = Math.floor(t * rings) + 1
      for (let i = 1; i <= ringStep; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (maxR / rings) * i, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: comboDial ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes comboDial {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'conveyor-sort',
    numId: '061',
    name: 'Conveyor Sort',
    family: 'mechanical-motion',
    description: 'The old view separates into parcels traveling along a common belt. A diverter sends alternating parcels onto two branches, uncovering the target between them.',
    motionKeywords: ['conveyor', 'sort', 'diverter', 'parcels', 'branches', 'belt'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const openGap = (h / 2) * t
      ctx.fillRect(0, h / 2 - openGap, w, openGap * 2)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: conveyorSplit ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes conveyorSplit {
        0% { clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'pendulum-gate',
    numId: '062',
    name: 'Pendulum Gate',
    family: 'mechanical-motion',
    description: 'A weighted gate sweeps around a fixed overhead pivot. Each damped swing leaves a new fan-shaped region exposed until the gate parks at the edge.',
    motionKeywords: ['pendulum', 'gate', 'damped', 'pivot', 'fan-shaped', 'swing'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = 0
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = Math.hypot(w, h) * 1.2
      const a = t * Math.PI
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, Math.PI / 2 - a / 2, Math.PI / 2 + a / 2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: pendulumGate ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes pendulumGate {
        0% { clip-path: polygon(50% 0, 50% 0, 50% 0); }
        100% { clip-path: polygon(50% -150%, 250% 250%, -150% 250%); }
      }
    `
  },
  {
    id: 'telescoping-sleeves',
    numId: '063',
    name: 'Telescoping Sleeves',
    family: 'mechanical-motion',
    description: 'The old view sits on nested sleeves. The narrow tip retreats into the next sleeve, picks it up, and carries the growing stack into its housing.',
    motionKeywords: ['telescoping', 'sleeves', 'nested cylinders', 'retract', 'housing'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const sleeves = 4
      const sw = (w / sleeves) * t
      for (let i = 0; i < sleeves; i++) {
        ctx.fillRect(i * (w / sleeves), 0, sw, h)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: telescoping ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes telescoping {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  }
]
