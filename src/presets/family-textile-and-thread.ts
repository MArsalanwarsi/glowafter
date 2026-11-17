import { PresetRecipe } from './types'

export const textileAndThreadPresets: PresetRecipe[] = [
  {
    id: 'loom-weave',
    numId: '037',
    name: 'Loom Weave',
    family: 'textile-and-thread',
    description: 'Spaced warp strips appear first. A shuttle threads alternating over-and-under weft strips through them, closing the remaining gaps.',
    motionKeywords: ['loom', 'weave', 'warp', 'weft', 'shuttle', 'fabric', 'textile'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const strips = 10
      const sw = w / strips
      for (let i = 0; i < strips; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(i * sw, 0, sw, h * Math.min(1, t * 1.5))
        } else if (t > 0.3) {
          ctx.fillRect(i * sw, 0, sw, h * ((t - 0.3) / 0.7))
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: loomWeave ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes loomWeave {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'zipper-seam',
    numId: '038',
    name: 'Zipper Seam',
    family: 'textile-and-thread',
    description: 'A slider travels from the trigger along a seam. Teeth disengage just behind its tip, and the two cloth edges bow apart to reveal the page.',
    motionKeywords: ['zipper', 'seam', 'teeth', 'slider', 'cloth', 'bow apart', 'fastener'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const zipY = h * t
      ctx.beginPath()
      ctx.moveTo(w / 2, 0)
      ctx.lineTo(w / 2 - (w * 0.5) * t, 0)
      ctx.lineTo(w / 2 - (w * 0.5) * t, zipY)
      ctx.lineTo(w / 2, zipY)
      ctx.lineTo(w / 2 + (w * 0.5) * t, zipY)
      ctx.lineTo(w / 2 + (w * 0.5) * t, 0)
      ctx.closePath()
      ctx.fill()
      // Zipper teeth indicator
      ctx.strokeStyle = isDark ? '#38bdf8' : '#6366f1'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: zipperReveal ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes zipperReveal {
        0% { clip-path: polygon(50% 0, 50% 0, 50% 0, 50% 0); }
        50% { clip-path: polygon(0 0, 100% 0, 60% 50%, 40% 50%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'dropped-stitch',
    numId: '039',
    name: 'Dropped Stitch',
    family: 'textile-and-thread',
    description: 'A single knit loop slips through the loop below it. A vertical ladder runs through the fabric, which then releases sideways from the ladder.',
    motionKeywords: ['dropped stitch', 'knit', 'ladder', 'vertical split', 'yarn'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const spread = (w / 2) * t
      ctx.fillRect(w / 2 - spread, 0, spread * 2, h)
      ctx.strokeStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(w / 2, 0)
      ctx.lineTo(w / 2, h)
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: droppedStitch ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes droppedStitch {
        0% { clip-path: inset(0 50% 0 50%); }
        100% { clip-path: inset(0 0% 0 0%); }
      }
    `
  },
  {
    id: 'ribbon-braid',
    numId: '040',
    name: 'Ribbon Braid',
    family: 'textile-and-thread',
    description: 'Three broad bands exchange front and back as they plait across the viewport. The plait opens sideways until the spaces between crossings disappear.',
    motionKeywords: ['ribbon', 'braid', 'plait', 'bands', 'intertwine', 'crossing'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const bh = (h / 3) * t
      ctx.fillRect(0, 0, w, bh)
      ctx.fillRect(0, h * 0.35, w, bh)
      ctx.fillRect(0, h * 0.7, w, bh)
      if (t > 0.6) {
        ctx.fillRect(0, 0, w, h)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: ribbonBraid ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes ribbonBraid {
        0% { clip-path: inset(40% 0 40% 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'sequin-flip',
    numId: '041',
    name: 'Sequin Flip',
    family: 'textile-and-thread',
    description: 'Overlapping round scales rotate around their stitched tops. A traveling patch turns edge-on, reveals the new side, and settles over the next row.',
    motionKeywords: ['sequin', 'flip', 'scales', 'shimmer', 'rotate', 'discs'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const cols = 8
      const rows = 6
      const cw = w / cols
      const rh = h / rows
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const threshold = (c + r) / (cols + rows)
          if (t >= threshold) {
            ctx.beginPath()
            ctx.arc(c * cw + cw / 2, r * rh + rh / 2, cw * 0.45, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: sequinFlip ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes sequinFlip {
        0% { clip-path: polygon(0 0, 0 0, 0 0); }
        100% { clip-path: polygon(0 0, 250% 0, 0 250%); }
      }
    `
  },
  {
    id: 'gathered-velvet',
    numId: '042',
    name: 'Gathered Velvet',
    family: 'textile-and-thread',
    description: 'An off-center tie pulls a soft sheet into a bunch. Its lower edge rises in unequal hanging curves, exposing the destination beneath.',
    motionKeywords: ['gathered velvet', 'curtain', 'drape', 'fabric bunch', 'theater'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const rise = h * t
      ctx.fillRect(0, 0, w, rise)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: velvetRise ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes velvetRise {
        0% { clip-path: inset(100% 0 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'embroidery-hoop',
    numId: '043',
    name: 'Embroidery Hoop',
    family: 'textile-and-thread',
    description: 'A short running stitch closes an outline. Closely spaced satin stitches span that outline in sequence and spread outward into the page.',
    motionKeywords: ['embroidery', 'hoop', 'needlework', 'stitch', 'thread', 'satin stitch'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      const r = t * Math.hypot(w, h) * 0.6
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = isDark ? '#38bdf8' : '#6366f1'
      ctx.lineWidth = 3
      ctx.setLineDash([8, 6])
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: hoopCircle ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes hoopCircle {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'bias-stretch',
    numId: '044',
    name: 'Bias Stretch',
    family: 'textile-and-thread',
    description: 'A diamond mesh shears under tension. Narrow eyelets widen into long skewed windows, then the threads draw taut and release.',
    motionKeywords: ['bias stretch', 'mesh', 'shear', 'diamond', 'tension', 'elastic'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const diaW = w * t
      const diaH = h * t
      ctx.beginPath()
      ctx.moveTo(w / 2, h / 2 - diaH)
      ctx.lineTo(w / 2 + diaW, h / 2)
      ctx.lineTo(w / 2, h / 2 + diaH)
      ctx.lineTo(w / 2 - diaW, h / 2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: biasDiamond ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes biasDiamond {
        0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
        100% { clip-path: polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%); }
      }
    `
  },
  {
    id: 'carpet-roll',
    numId: '045',
    name: 'Carpet Roll',
    family: 'textile-and-thread',
    description: 'The old surface winds around a cylinder traveling across the floor plane. Show the coiled end gaining thickness as it exposes the flat page behind it.',
    motionKeywords: ['carpet roll', 'cylinder', 'rug', 'unroll', 'floor', 'scroll'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const rollX = w * t
      ctx.fillRect(0, 0, rollX, h)
      // Rolled edge cylinder
      ctx.fillStyle = isDark ? '#475569' : '#cbd5e1'
      ctx.fillRect(Math.max(0, rollX - 15), 0, 15, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: carpetRoll ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes carpetRoll {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  }
]
