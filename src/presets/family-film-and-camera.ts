import { PresetRecipe, PresetFamily, PresetContext } from './types'

export const filmAndCameraPresets: PresetRecipe[] = [
  {
    id: 'shutter-iris',
    numId: '001',
    name: 'Shutter Iris',
    family: 'film-and-camera',
    description: 'Six curved blades pivot around fixed pins. A rotating hexagonal opening grows between the blade tips and clears the corners.',
    motionKeywords: ['shutter', 'iris', 'camera', 'aperture', 'hexagonal', 'rotate', 'blades'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    supportsOrigin: true,
    renderPreview: (ctx, w, h, t, isDark) => {
      const cx = w / 2
      const cy = h / 2
      const maxR = Math.hypot(w, h) / 1.7
      const r = t * maxR
      const rot = t * Math.PI * 0.5
      ctx.save()
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = rot + (i * Math.PI) / 3
        const px = cx + Math.cos(a) * r
        const py = cy + Math.sin(a) * r
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.fill()
      ctx.strokeStyle = isDark ? '#3b82f6' : '#6366f1'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx: PresetContext) => {
      const x = ctx.x ?? ctx.width / 2
      const y = ctx.y ?? ctx.height / 2
      const r = ctx.maxRadius ?? Math.hypot(ctx.width, ctx.height)
      const r50 = r * 0.35
      const r100 = r * 1.5
      const hex50 = Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3
        return `${Math.round(x + Math.cos(a) * r50)}px ${Math.round(y + Math.sin(a) * r50)}px`
      }).join(', ')
      const hex100 = Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3
        return `${Math.round(x + Math.cos(a) * r100)}px ${Math.round(y + Math.sin(a) * r100)}px`
      }).join(', ')
      const hex0 = Array.from({ length: 6 }, () => `${x}px ${y}px`).join(', ')

      return `
        ::view-transition-new(root) {
          animation: irisReveal ${ctx.duration}ms ${ctx.easing};
          animation-fill-mode: both;
          will-change: clip-path;
        }
        @keyframes irisReveal {
          0% { clip-path: polygon(${hex0}); }
          50% { clip-path: polygon(${hex50}); }
          100% { clip-path: polygon(${hex100}); }
        }
      `
    }
  },
  {
    id: 'film-advance',
    numId: '002',
    name: 'Film Advance',
    family: 'film-and-camera',
    description: 'A sprocket catches the outgoing frame, pulls it past the gate, and registers the incoming frame with one small corrective nudge.',
    motionKeywords: ['film', 'advance', 'sprocket', 'gate', 'vertical', 'slide', 'nudge'],
    defaultDuration: 750,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      const shift = (1 - t) * h
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.fillRect(0, shift, w, h)
      // Sprocket holes along the sides
      ctx.fillStyle = isDark ? '#222' : '#ddd'
      for (let y = shift + 10; y < shift + h; y += 30) {
        ctx.fillRect(8, y, 12, 16)
        ctx.fillRect(w - 20, y, 12, 16)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-old(root) {
        animation: filmOld ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: transform;
      }
      ::view-transition-new(root) {
        animation: filmNew ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: transform;
      }
      @keyframes filmOld {
        0% { transform: translateY(0); }
        80% { transform: translateY(-105%); }
        100% { transform: translateY(-100%); }
      }
      @keyframes filmNew {
        0% { transform: translateY(100%); }
        85% { transform: translateY(-3%); }
        100% { transform: translateY(0); }
      }
    `
  },
  {
    id: 'film-burn',
    numId: '003',
    name: 'Film Burn',
    family: 'film-and-camera',
    description: 'Two leaks bite into opposite film margins. Ragged holes break through ahead of them, join, and leave a few shrinking islands of the old frame.',
    motionKeywords: ['film burn', 'leaks', 'margins', 'ragged', 'islands', 'fire', 'burn'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const r1 = t * (w * 0.7)
      const r2 = t * (w * 0.7)
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.arc(0, h * 0.3, r1, 0, Math.PI * 2)
      ctx.arc(w, h * 0.7, r2, 0, Math.PI * 2)
      ctx.fill()
      if (t > 0.4) {
        ctx.beginPath()
        ctx.arc(w * 0.5, h * 0.5, (t - 0.4) * w, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: filmBurnReveal ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes filmBurnReveal {
        0% { clip-path: circle(0% at 0% 30%); }
        40% { clip-path: circle(40% at 0% 30%); }
        70% { clip-path: circle(80% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'contact-sheet',
    numId: '004',
    name: 'Contact Sheet',
    family: 'film-and-camera',
    description: 'The scene divides into a sheet of exposures. One exposure in the new theme enlarges across the white gutters until its edges meet the viewport.',
    motionKeywords: ['contact sheet', 'exposures', 'gutters', 'grid', 'enlarge', 'zoom'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const rows = 3
      const cols = 3
      const gw = w / cols
      const gh = h / rows
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const curW = gw + (w - gw) * t
      const curH = gh + (h - gh) * t
      const curX = (w - curW) / 2
      const curY = (h - curH) / 2
      ctx.fillRect(curX, curY, curW, curH)
      ctx.strokeStyle = isDark ? '#38bdf8' : '#6366f1'
      ctx.lineWidth = (1 - t) * 3
      if (t < 0.95) {
        ctx.strokeRect(curX, curY, curW, curH)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: contactZoom ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes contactZoom {
        0% { clip-path: inset(35% 35% 35% 35% round 8px); }
        100% { clip-path: inset(0% 0% 0% 0% round 0px); }
      }
    `
  },
  {
    id: 'dolly-through',
    numId: '005',
    name: 'Dolly Through',
    family: 'film-and-camera',
    description: 'Three nested rectangular frames enlarge at different rates. The viewer passes through each opening before the deepest frame becomes the live page.',
    motionKeywords: ['dolly', 'camera', 'nested', 'rectangles', 'zoom', 'depth', 'frames'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      for (let i = 3; i >= 1; i--) {
        const factor = Math.min(1, Math.max(0, t * 1.3 - i * 0.15))
        const fw = w * (0.2 + 0.8 * factor)
        const fh = h * (0.2 + 0.8 * factor)
        const fx = (w - fw) / 2
        const fy = (h - fh) / 2
        ctx.fillRect(fx, fy, fw, fh)
        ctx.strokeStyle = isDark ? 'rgba(96,165,250,0.5)' : 'rgba(99,102,241,0.5)'
        ctx.lineWidth = 2
        ctx.strokeRect(fx, fy, fw, fh)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: dollyZoom ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes dollyZoom {
        0% { clip-path: inset(45% 45% 45% 45%); }
        40% { clip-path: inset(25% 25% 25% 25%); }
        100% { clip-path: inset(0% 0% 0% 0%); }
      }
    `
  },
  {
    id: 'split-diopter',
    numId: '006',
    name: 'Split Diopter',
    family: 'film-and-camera',
    description: 'Two offset half-lenses show near and far magnifications at once. Their dividing seam rolls away while both halves settle at normal scale.',
    motionKeywords: ['split diopter', 'lens', 'half', 'seam', 'magnification', 'focus'],
    defaultDuration: 800,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const splitX = w * t
      ctx.fillRect(0, 0, splitX, h)
      ctx.strokeStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(splitX, 0)
      ctx.lineTo(splitX, h)
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: splitDiopter ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes splitDiopter {
        0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
        50% { clip-path: polygon(0 0, 60% 0, 40% 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'loose-lens-cap',
    numId: '007',
    name: 'Loose Lens Cap',
    family: 'film-and-camera',
    description: 'An oversized disc containing the old view tips onto its lower rim, rocks once and rolls off, revealing the destination in its wake.',
    motionKeywords: ['lens cap', 'disc', 'tilt', 'roll off', 'gravity', 'camera'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      if (t > 0) {
        ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
        ctx.fillRect(0, 0, w, h)
      }
      // Old disc falling away
      const angle = t * 1.2
      const cx = w * 0.5 + t * w * 0.6
      const cy = h * 0.5 + t * h * 0.7
      const r = Math.hypot(w, h) * 0.6
      ctx.fillStyle = isDark ? '#f8f9fa' : '#111317'
      ctx.beginPath()
      ctx.arc(cx, cy, Math.max(0, r * (1 - t * 0.6)), 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-old(root) {
        animation: lensCapRoll ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        transform-origin: bottom center;
        z-index: 2;
        will-change: transform, opacity;
      }
      ::view-transition-new(root) {
        z-index: 1;
      }
      @keyframes lensCapRoll {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        40% { transform: translateY(20px) rotate(15deg); }
        100% { transform: translateY(120%) rotate(45deg); opacity: 0; }
      }
    `
  },
  {
    id: 'clapper-slate',
    numId: '008',
    name: 'Clapper Slate',
    family: 'film-and-camera',
    description: 'A striped upper jaw pivots shut against a tilted slate. At contact, the jaw and board separate along different paths, opening a V onto the new page.',
    motionKeywords: ['clapper', 'slate', 'striped', 'hollywood', 'cut', 'v-shape', 'jaw'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      if (t > 0) {
        const openH = h * t
        const y = (h - openH) / 2
        ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
        ctx.fillRect(0, y, w, openH)
      }
      if (t < 0.95) {
        const topH = (1 - t) * (h / 2)
        const botH = (1 - t) * (h / 2)
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b'
        // Top jaw
        ctx.fillRect(0, 0, w, topH)
        // Bottom slate
        ctx.fillRect(0, h - botH, w, botH)
        // Clapper stripes
        ctx.fillStyle = isDark ? '#000' : '#fff'
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x + 20, 0)
          ctx.lineTo(x + 10, topH)
          ctx.lineTo(x - 10, topH)
          ctx.fill()
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: clapperOpen ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes clapperOpen {
        0% { clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'anamorphic-slit',
    numId: '009',
    name: 'Anamorphic Slit',
    family: 'film-and-camera',
    description: 'The old scene squeezes vertically into a thin horizontal slit. The new scene unfolds out of that same slit at full width.',
    motionKeywords: ['anamorphic', 'slit', 'squeeze', 'horizontal', 'cinemascope', 'lens'],
    defaultDuration: 800,
    defaultEasing: 'cubic-bezier(0.65, 0, 0.35, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const openH = h * t
      const y = (h - openH) / 2
      ctx.fillRect(0, y, w, openH)
      ctx.strokeStyle = isDark ? '#60a5fa' : '#3b82f6'
      ctx.lineWidth = 2
      ctx.strokeRect(0, y, w, openH)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: anamorphicSlit ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes anamorphicSlit {
        0% { clip-path: inset(49.5% 0 49.5% 0); }
        30% { clip-path: inset(40% 0 40% 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  }
]
