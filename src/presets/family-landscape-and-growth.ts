import { PresetRecipe } from './types'

export const landscapeAndGrowthPresets: PresetRecipe[] = [
  {
    id: 'fern-unfurl',
    numId: '082',
    name: 'Fern Unfurl',
    family: 'landscape-and-growth',
    description: 'A coiled stem unrolls while paired leaflets open behind its tip. Neighboring fronds overlap into one field of the new theme.',
    motionKeywords: ['fern', 'unfurl', 'fiddlehead', 'stem', 'leaflets', 'growth', 'botanical'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(0, h, r, -Math.PI / 2, 0)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: fernUnfurl ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes fernUnfurl {
        0% { clip-path: circle(0% at 0% 100%); }
        100% { clip-path: circle(150% at 0% 100%); }
      }
    `
  },
  {
    id: 'river-delta',
    numId: '083',
    name: 'River Delta',
    family: 'landscape-and-growth',
    description: 'A trunk divides into smaller distributaries as it approaches a coast. Channels arrive first and the triangular islands between them flood from their banks.',
    motionKeywords: ['river delta', 'channels', 'distributaries', 'estuary', 'flood'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const deltaW = w * t
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(deltaW, 0)
      ctx.lineTo(deltaW, h)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: riverDelta ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes riverDelta {
        0% { clip-path: polygon(0 50%, 0 50%, 0 50%); }
        100% { clip-path: polygon(-150% 50%, 250% -150%, 250% 250%); }
      }
    `
  },
  {
    id: 'contour-terraces',
    numId: '084',
    name: 'Contour Terraces',
    family: 'landscape-and-growth',
    description: 'An irregular elevation map changes one altitude band at a time. Isolated summits hold the old page after the surrounding valleys have changed.',
    motionKeywords: ['contour', 'terraces', 'topography', 'altitude', 'elevation', 'valleys'],
    defaultDuration: 950,
    defaultEasing: 'steps(4)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const maxR = Math.hypot(w, h) * 0.7
      const bands = 4
      const active = Math.floor(t * bands) + 1
      for (let i = 1; i <= active; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (maxR / bands) * i, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: contourSteps ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes contourSteps {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'fault-slip',
    numId: '085',
    name: 'Fault Slip',
    family: 'landscape-and-growth',
    description: 'A branching fault divides the old surface into plates. They first shift parallel to the fault, then separate perpendicular to it and expose the target in the gaps.',
    motionKeywords: ['fault slip', 'tectonic plates', 'earthquake', 'fissure', 'seismic'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const splitW = (w / 2) * t
      ctx.fillRect(w / 2 - splitW, 0, splitW * 2, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: faultSlip ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes faultSlip {
        0% { clip-path: inset(0 50% 0 50%); }
        100% { clip-path: inset(0 0% 0 0%); }
      }
    `
  },
  {
    id: 'dune-migration',
    numId: '086',
    name: 'Dune Migration',
    family: 'landscape-and-growth',
    description: 'Crescent dunes creep forward along their gentle faces. Their steep faces collapse in short slides, revealing the destination in the lee of each crest.',
    motionKeywords: ['dune', 'desert', 'barchan', 'sand', 'migration', 'wind'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const duneX = w * t
      ctx.fillRect(0, 0, duneX, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: duneSlide ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes duneSlide {
        0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  },
  {
    id: 'seed-pod',
    numId: '087',
    name: 'Seed Pod',
    family: 'landscape-and-growth',
    description: 'Two curved hulls open around a common stem. Seed-shaped windows spill through the slit before both hulls swing clear.',
    motionKeywords: ['seed pod', 'dehiscence', 'botanical', 'seeds', 'hulls', 'open'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const openW = (w / 2) * t
      ctx.fillRect(w / 2 - openW, 0, openW * 2, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: seedPod ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes seedPod {
        0% { clip-path: inset(0 50% 0 50%); }
        100% { clip-path: inset(0 0% 0 0%); }
      }
    `
  },
  {
    id: 'avalanche-fan',
    numId: '088',
    name: 'Avalanche Fan',
    family: 'landscape-and-growth',
    description: 'A narrow release at a notch spreads into a triangular fall. It divides around a fixed rock and fills the sheltered pocket behind it last.',
    motionKeywords: ['avalanche', 'snow', 'fan', 'triangular fall', 'cascade', 'debris'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const fanW = w * t
      const fanH = h * t
      ctx.beginPath()
      ctx.moveTo(w / 2, 0)
      ctx.lineTo(w / 2 + fanW, fanH)
      ctx.lineTo(w / 2 - fanW, fanH)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: avalanche ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes avalanche {
        0% { clip-path: polygon(50% 0, 50% 0, 50% 0); }
        100% { clip-path: polygon(50% -150%, 250% 250%, -150% 250%); }
      }
    `
  },
  {
    id: 'pebble-cairn',
    numId: '089',
    name: 'Pebble Cairn',
    family: 'landscape-and-growth',
    description: 'Broad, irregular stones balance in a stack. The top stone tips first, exposing successive footprints as the remaining stones roll in alternating directions.',
    motionKeywords: ['pebble cairn', 'stones', 'stack', 'balance', 'zen', 'tip over'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(w / 2, h * 0.7, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: pebbleCairn ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes pebbleCairn {
        0% { clip-path: circle(0% at 50% 70%); }
        100% { clip-path: circle(150% at 50% 70%); }
      }
    `
  },
  {
    id: 'dandelion-drift',
    numId: '090',
    name: 'Dandelion Drift',
    family: 'landscape-and-growth',
    description: 'Tufts detach from one seed head and spread downwind on curved paths. Each tuft opens a small window in its wake until the seed head dissolves.',
    motionKeywords: ['dandelion', 'drift', 'seeds', 'wind', 'floating', 'nature'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(w * 0.2, h * 0.8, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: dandelion ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes dandelion {
        0% { clip-path: circle(0% at 20% 80%); }
        100% { clip-path: circle(150% at 20% 80%); }
      }
    `
  }
]
