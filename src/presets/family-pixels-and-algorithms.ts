import { PresetRecipe } from './types'

export const pixelsAndAlgorithmsPresets: PresetRecipe[] = [
  {
    id: 'bayer-dither',
    numId: '028',
    name: 'Bayer Dither',
    family: 'pixels-and-algorithms',
    description: 'An ordered threshold matrix changes isolated pixels into a checker field, then fills the interleaved gaps. Keep the intermediate dot patterns legible.',
    motionKeywords: ['bayer', 'dither', 'matrix', 'checkerboard', 'dots', 'ordered dither'],
    defaultDuration: 900,
    defaultEasing: 'steps(4)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const size = 16
      const cols = Math.ceil(w / size)
      const rows = Math.ceil(h / size)
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const threshold = ((c * 3 + r * 5) % 16) / 16
          if (t >= threshold) {
            ctx.fillRect(c * size, r * size, size, size)
          }
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-old(root) {
        animation: bayerDitherOld ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
      }
      ::view-transition-new(root) {
        animation: bayerDitherNew ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes bayerDitherOld {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes bayerDitherNew {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
    `
  },
  {
    id: 'quadtree-bloom',
    numId: '029',
    name: 'Quadtree Bloom',
    family: 'pixels-and-algorithms',
    description: 'Large blocks recursively split into quarters along the active frontier. Small leaves change first beside larger, still-intact blocks.',
    motionKeywords: ['quadtree', 'bloom', 'recursive', 'quarters', 'hierarchy', 'subdivision'],
    defaultDuration: 950,
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const splitBlocks = (x: number, y: number, bw: number, bh: number, depth: number) => {
        const factor = Math.min(1, Math.max(0, (t * 4 - depth * 0.8)))
        if (factor > 0.8 || depth >= 3) {
          ctx.fillRect(x, y, bw, bh)
          ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.3)' : 'rgba(99,102,241,0.3)'
          ctx.strokeRect(x, y, bw, bh)
        } else if (factor > 0) {
          const hw = bw / 2
          const hh = bh / 2
          splitBlocks(x, y, hw, hh, depth + 1)
          splitBlocks(x + hw, y, hw, hh, depth + 1)
          splitBlocks(x, y + hh, hw, hh, depth + 1)
          splitBlocks(x + hw, y + hh, hw, hh, depth + 1)
        }
      }
      splitBlocks(0, 0, w, h, 0)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: quadtreeZoom ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes quadtreeZoom {
        0% { clip-path: inset(40% 40% 40% 40%); }
        100% { clip-path: inset(0% 0% 0% 0%); }
      }
    `
  },
  {
    id: 'sliding-puzzle',
    numId: '030',
    name: 'Sliding Puzzle',
    family: 'pixels-and-algorithms',
    description: 'One empty cell travels across a puzzle, inviting adjacent tiles to slide into it. Solved regions expose the new interface as the blank moves on.',
    motionKeywords: ['sliding puzzle', '15-puzzle', 'tiles', 'empty cell', 'shift'],
    defaultDuration: 900,
    defaultEasing: 'steps(6)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const grid = 4
      const tw = w / grid
      const th = h / grid
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const totalTiles = grid * grid
      const solved = Math.floor(t * totalTiles)
      for (let i = 0; i < solved; i++) {
        const c = i % grid
        const r = Math.floor(i / grid)
        ctx.fillRect(c * tw + 1, r * th + 1, tw - 2, th - 2)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: slidingPuzzle ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes slidingPuzzle {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0% 0 0); }
      }
    `
  },
  {
    id: 'tetromino-stack',
    numId: '031',
    name: 'Tetromino Stack',
    family: 'pixels-and-algorithms',
    description: 'Four-cell pieces fall into a shallow well. Completed rows lock into continuous strips of the destination and stack until the whole page resolves.',
    motionKeywords: ['tetromino', 'tetris', 'stack', 'blocks', 'arcade', 'retro'],
    defaultDuration: 900,
    defaultEasing: 'steps(5)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const stackH = h * t
      ctx.fillRect(0, h - stackH, w, stackH)
      // Block seams
      ctx.strokeStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.lineWidth = 1
      for (let y = h; y > h - stackH; y -= 24) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: tetrominoStack ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes tetrominoStack {
        0% { clip-path: inset(100% 0 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'maze-flood',
    numId: '032',
    name: 'Maze Flood',
    family: 'pixels-and-algorithms',
    description: 'The theme travels through connected maze corridors, branches at junctions and reaches dead ends. Thin maze walls dissolve last.',
    motionKeywords: ['maze', 'flood', 'pathfinding', 'corridors', 'junctions', 'labyrinth'],
    defaultDuration: 950,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.fillRect(0, 0, w * t, h)
      // Maze grid lines
      ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1'
      ctx.lineWidth = 2
      const step = 20
      for (let x = 0; x < w * t; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: mazeFlood ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes mazeFlood {
        0% { clip-path: circle(0% at 0% 0%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'hex-colony',
    numId: '033',
    name: 'Hex Colony',
    family: 'pixels-and-algorithms',
    description: 'A few isolated cells seed a hex lattice. Cells turn when enough neighbors have changed, producing separate colonies that meet along jagged fronts.',
    motionKeywords: ['hex', 'colony', 'honeycomb', 'automata', 'lattice', 'cellular'],
    defaultDuration: 950,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const centers = [
        [w * 0.2, h * 0.3],
        [w * 0.8, h * 0.4],
        [w * 0.5, h * 0.7],
      ]
      const r = t * Math.hypot(w, h) * 0.7
      centers.forEach(([cx, cy]) => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: hexColony ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes hexColony {
        0% {
          clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%);
        }
        100% {
          clip-path: polygon(50% -60%, 160% 0%, 160% 100%, 50% 160%, -60% 100%, -60% 0%);
        }
      }
    `
  },
  {
    id: 'pixel-sort',
    numId: '034',
    name: 'Pixel Sort',
    family: 'pixels-and-algorithms',
    description: 'Selected image columns stretch into uneven vertical streaks. Their ends align in clusters and retract to reconstruct the correctly positioned interface.',
    motionKeywords: ['pixel sort', 'glitch', 'streaks', 'columns', 'algorithmic', 'datamosh'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const cols = 20
      const cw = w / cols
      for (let i = 0; i < cols; i++) {
        const factor = Math.min(1, Math.max(0, (t * 1.5 - ((i * 13) % 10) * 0.05)))
        ctx.fillRect(i * cw, 0, cw, h * factor)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: pixelSort ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes pixelSort {
        0% { clip-path: inset(0 0 100% 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'turning-grille',
    numId: '035',
    name: 'Turning Grille',
    family: 'pixels-and-algorithms',
    description: 'A rigid stencil with square holes turns through quarter turns. Each registered position leaves new cells visible in the holes it has visited.',
    motionKeywords: ['turning grille', 'cipher', 'stencil', 'rotation', 'quarter turns'],
    defaultDuration: 900,
    defaultEasing: 'steps(4)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const grid = 6
      const sw = w / grid
      const sh = h / grid
      const steps = Math.floor(t * 4) + 1
      for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
          if ((r + c * 2) % 4 < steps) {
            ctx.fillRect(c * sw, r * sh, sw, sh)
          }
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: turningGrille ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes turningGrille {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'isometric-cubes',
    numId: '036',
    name: 'Isometric Cubes',
    family: 'pixels-and-algorithms',
    description: 'A tessellated field tips from top rhombi onto two visible side faces. The destination arrives on the faces as they settle into a flat plane.',
    motionKeywords: ['isometric', 'cubes', 'rhombi', 'tessellation', '3d projection', 'voxels'],
    defaultDuration: 950,
    defaultEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const cubeW = w * t
      ctx.fillRect(0, 0, cubeW, h)
      ctx.strokeStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.lineWidth = 1.5
      for (let x = 0; x < cubeW; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x + 15, h)
        ctx.stroke()
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: isoCubes ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes isoCubes {
        0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
    `
  }
]
