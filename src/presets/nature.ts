import type { PresetFamily, PresetRecipe } from './types'

type Shape = (width: number, height: number, progress: number) => string
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const smooth = (n: number) => {
  const p = clamp(n)
  return p * p * (3 - 2 * p)
}
const point = (x: number, y: number) => x.toFixed(1) + ' ' + y.toFixed(1)
const random = (seed: number) => {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return n - Math.floor(n)
}
const polygon = (points: number[][]) => 'M' + points.map(([x, y]) => point(x, y)).join(' L') + ' Z'
const ellipse = (x: number, y: number, rx: number, ry: number) =>
  'M' +
  point(x - rx, y) +
  'a' +
  point(rx, ry) +
  ' 0 1 0 ' +
  point(rx * 2, 0) +
  'a' +
  point(rx, ry) +
  ' 0 1 0 ' +
  point(-rx * 2, 0) +
  'Z'

// ==========================================
// 6 Cinematic Theme Transition Animations
// ==========================================

// 1. Viral Sweep: Smooth exponential circular shockwave expanding from the trigger origin
const viralSweep: Shape = (w, h, t) => {
  const cx = w * 0.5,
    cy = h * 0.5
  if (t <= 0)
    return polygon([
      [cx, cy],
      [cx, cy],
      [cx, cy],
    ])
  const maxR = Math.hypot(w, h) * 0.75
  const p = smooth(t)
  const r = maxR * Math.pow(p, 1.4)
  const points: number[][] = []
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2
    const wave = 1 + Math.sin(a * 12 - t * 18) * 0.035 * (1 - p) * Math.sin(Math.PI * p)
    points.push([cx + Math.cos(a) * r * wave, cy + Math.sin(a) * r * wave])
  }
  return polygon(points)
}

// 2. Glass Shatter: Multi-facet Voronoi crystalline fracture shards radiating outward
const glassShatter: Shape = (w, h, t) => {
  const cx = w * 0.5,
    cy = h * 0.5
  if (t <= 0)
    return polygon([
      [cx, cy],
      [cx, cy],
      [cx, cy],
    ])
  const maxR = Math.hypot(w, h) * 0.76
  const count = 20
  let path = ''
  for (let i = 0; i < count; i++) {
    const a0 = (i / count) * Math.PI * 2
    const a1 = ((i + 1) / count) * Math.PI * 2
    const midA = (a0 + a1) / 2
    const shardT = smooth(clamp((t - random(i * 3 + 7) * 0.12) / 0.88))
    const r = maxR * Math.pow(shardT, 1.4)
    const separation = Math.sin(Math.PI * shardT) * 10 * random(i + 1)
    const ox = cx + Math.cos(midA) * separation
    const oy = cy + Math.sin(midA) * separation
    const f0 = [ox, oy]
    const f1 = [
      ox + Math.cos(a0) * r * (0.97 + 0.06 * random(i + 11)),
      oy + Math.sin(a0) * r * (0.97 + 0.06 * random(i + 11)),
    ]
    const f2 = [
      ox + Math.cos(midA - 0.04) * r * (1.03 + 0.05 * random(i + 12)),
      oy + Math.sin(midA - 0.04) * r * (1.03 + 0.05 * random(i + 12)),
    ]
    const f3 = [
      ox + Math.cos(midA + 0.04) * r * (1.02 + 0.05 * random(i + 13)),
      oy + Math.sin(midA + 0.04) * r * (1.02 + 0.05 * random(i + 13)),
    ]
    const f4 = [
      ox + Math.cos(a1) * r * (0.97 + 0.06 * random(i + 14)),
      oy + Math.sin(a1) * r * (0.97 + 0.06 * random(i + 14)),
    ]
    path += polygon([f0, f1, f2, f3, f4])
  }
  return path
}

// 3. Seaside Waves: Sinusoidal ocean tidal surf with multi-harmonic wave crests
const seasideWaves: Shape = (w, h, t) => {
  const fill = smooth(t)
  const level = h * (1.08 - 1.2 * fill)
  const amp = Math.sin(Math.PI * fill) * Math.min(h * 0.07, 35)
  const edge: number[][] = []
  for (let i = 0; i <= 48; i++) {
    const x = (i / 48) * w
    const nx = i / 48
    const wave =
      Math.sin(nx * 10 + t * 14) * 0.55 +
      Math.sin(nx * 22 - t * 18 + 1.4) * 0.3 +
      Math.sin(nx * 38 + t * 24 + 0.8) * 0.15
    const peak = Math.pow(Math.max(0, Math.sin(nx * 10 + t * 14)), 2) * 0.25 * amp
    const y = level + wave * amp - peak
    edge.push([x, y])
  }
  let path = polygon([[0, h + 20], ...edge, [w, h + 20]])
  if (fill > 0.15 && fill < 0.85) {
    for (let j = 0; j < 8; j++) {
      const dropX = w * (0.1 + 0.8 * (j / 8))
      const dropY = level - amp * 1.3 - Math.sin(t * 12 + j) * 8
      const dropR = Math.sin(Math.PI * fill) * (1.5 + random(j) * 2)
      path += ellipse(dropX, dropY, dropR, dropR)
    }
  }
  return path
}

// 4. Balloon Pop: Elastic rubber bubble stretch followed by a sudden radial pop rupture
const balloonPop: Shape = (w, h, t) => {
  const cx = w * 0.5,
    cy = h * 0.5
  if (t <= 0)
    return polygon([
      [cx, cy],
      [cx, cy],
      [cx, cy],
    ])
  const maxR = Math.hypot(w, h) * 0.76
  if (t <= 0.45) {
    const p = t / 0.45
    const r = Math.min(w, h) * 0.35 * smooth(p)
    const points: number[][] = []
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2
      const stretch = 1 + 0.08 * Math.sin(3 * a) * Math.sin(p * 9) + 0.05 * Math.cos(2 * a)
      points.push([cx + Math.cos(a) * r * stretch, cy + Math.sin(a) * r * stretch * 1.08])
    }
    return polygon(points)
  }
  const popP = smooth((t - 0.45) / 0.55)
  const rBase = Math.min(w, h) * 0.35
  const blastR = rBase + (maxR - rBase) * Math.pow(popP, 1.35)
  const points: number[][] = []
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2
    const recoil = 1 + 0.12 * Math.sin(18 * a) * (1 - popP)
    points.push([cx + Math.cos(a) * blastR * recoil, cy + Math.sin(a) * blastR * recoil])
  }
  return polygon(points)
}

// 5. Bomb Drop: Descending gravity projectile arc that detonates into a concussive shockwave
const bombDrop: Shape = (w, h, t) => {
  const maxR = Math.hypot(w, h) * 0.82
  const impactX = w * 0.5,
    impactY = h * 0.58
  if (t <= 0)
    return polygon([
      [-10, -60],
      [10, -60],
      [0, -40],
    ])
  if (t <= 0.32) {
    const pDrop = t / 0.32
    const y = -h * 0.15 + (impactY + h * 0.15) * (pDrop * pDrop)
    const x = w * 0.5 + Math.sin(pDrop * Math.PI) * w * 0.03
    const r = 8 + 6 * pDrop
    return ellipse(x, y, r, r * 1.4)
  }
  const pDet = smooth((t - 0.32) / 0.68)
  const r = maxR * Math.pow(pDet, 1.3)
  const points: number[][] = []
  for (let i = 0; i < 56; i++) {
    const a = (i / 56) * Math.PI * 2
    const spike = 1 + 0.1 * Math.sin(14 * a + pDet * 8) * (1 - pDet) + 0.05 * Math.sin(28 * a) * (1 - pDet)
    points.push([impactX + Math.cos(a) * r * spike, impactY + Math.sin(a) * r * spike])
  }
  return polygon(points)
}

// 6. Party: Starburst explosion with dispersing confetti ribbons and geometric streamers
const party: Shape = (w, h, t) => {
  const cx = w * 0.5,
    cy = h * 0.5
  if (t <= 0)
    return polygon([
      [cx, cy],
      [cx, cy],
      [cx, cy],
    ])
  const maxR = Math.hypot(w, h) * 0.78
  const p = smooth(t)
  const coreR = maxR * Math.pow(p, 1.4)
  const points: number[][] = []
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2
    const isRay = i % 2 === 1
    const rayExt = isRay ? 1.0 + 0.18 * Math.sin(Math.PI * p) : 0.88
    points.push([cx + Math.cos(a) * coreR * rayExt, cy + Math.sin(a) * coreR * rayExt])
  }
  let path = polygon(points)
  if (p > 0.1 && p < 0.95) {
    for (let k = 0; k < 12; k++) {
      const ca = (k / 12) * Math.PI * 2 + p * 2
      const cdist = coreR * 1.08 + Math.sin(Math.PI * p) * (20 + 35 * random(k))
      const px = cx + Math.cos(ca) * cdist
      const py = cy + Math.sin(ca) * cdist
      const sz = (6 + 8 * random(k + 2)) * Math.sin(Math.PI * p)
      path += polygon([
        [px - sz, py],
        [px, py - sz],
        [px + sz, py],
        [px, py + sz],
      ])
    }
  }
  return path
}

// ==========================================
// Nature & Material Transition Animations
// ==========================================

const water: (rain: boolean) => Shape = (rain) => (w, h, t) => {
  const fill = smooth((t - 0.06) / 0.94)
  const level = h * (1.04 - fill * 1.1)
  const amplitude = Math.sin(Math.PI * t) * Math.min(h * 0.023, 18)
  const surface = (x: number) =>
    level +
    amplitude *
      (Math.sin((x / w) * 13 + t * 24) * 0.6 +
        Math.sin((x / w) * 31 - t * 35) * 0.25 +
        (rain ? 0 : Math.exp(-Math.pow((x / w - 0.5) * 10, 2)) * Math.sin((x / w) * 65 + t * 46)))
  const edge = Array.from({ length: 41 }, (_, i) => [(i / 40) * w, surface((i / 40) * w)])
  let path = polygon([[0, h + 1], ...edge, [w, h + 1]])
  if (!rain) {
    const strength = smooth(t / 0.06) * (1 - smooth((t - 0.94) / 0.06))
    const left: number[][] = []
    const right: number[][] = []
    for (let row = 0; row <= 24; row++) {
      const y = (row / 24) * Math.max(0, surface(w / 2))
      const bend = Math.sin(row * 0.6 - t * 35) * w * 0.002 * strength
      const half = w * (0.023 + 0.008 * Math.cos(row * 0.75 + t * 40)) * strength
      left.push([w / 2 + bend - half, y])
      right.push([w / 2 + bend + half, y])
    }
    path += polygon([...left, ...right.reverse()])
  }
  const count = rain ? 32 : 10
  for (let i = 0; i < count; i++) {
    const x = w * (rain ? random(i + 2) : 0.46 + i * 0.02)
    const phase = rain ? clamp((t - random(i + 30) * 0.75) / 0.23) : (t * 3 + random(i + 30)) % 1
    const speed = phase * phase
    const y = rain ? -h * 0.16 + speed * (Math.max(0, level) + h * 0.24) : surface(x)
    const appear = smooth(t / 0.06) * (1 - smooth((t - 0.9) / 0.1)) * (rain ? Math.sin(Math.PI * phase) : 1)
    const halfWidth = (rain ? 0.7 + random(i) * 1.2 : w * 0.009) * appear
    const length = (rain ? 18 + random(i + 3) * 40 : Math.max(0, level)) * appear
    const top = rain ? y - length : -2
    if (rain)
      path += polygon([
        [x - halfWidth, top],
        [x + halfWidth, top],
        [x + halfWidth, y],
        [x - halfWidth, y],
      ])
    const splash = Math.sin(phase * Math.PI)
    path += ellipse(
      x + Math.sin(i + t * 20) * 14,
      surface(x) - splash * 25,
      appear * splash * 2.3,
      appear * splash * 3.2
    )
  }
  return path
}

const ripple: Shape = (w, h, t) => {
  let path = ''
  for (let i = 0; i < 4; i++) {
    const x = w * (0.2 + random(i + 1) * 0.6)
    const y = h * (0.15 + random(i + 9) * 0.7)
    const p = smooth((t - i * 0.055) / (1 - i * 0.055))
    const r = Math.hypot(w, h) * p
    path += ellipse(x, y, r * 0.85, r * 0.65)
    const ring = r + Math.sin(Math.PI * p) * 12
    path += ellipse(x, y, ring * 0.85, ring * 0.65).replace(/ 0 1 0 /g, ' 0 1 1 ')
    path += ellipse(x, y, (ring + 1.5 * Math.sin(Math.PI * p)) * 0.85, (ring + 1.5 * Math.sin(Math.PI * p)) * 0.65)
  }
  return path
}

const curtain: Shape = (w, h, t) => {
  const points = Array.from({ length: 49 }, (_, i) => {
    const x = i / 48
    const wave = (Math.sin(x * 7 - t * 5) * 0.13 + Math.sin(x * 17 + t * 8) * 0.035) * Math.sin(Math.PI * t)
    return [w * x, h * (t + wave)]
  })
  return polygon([[0, 0], ...points, [w, 0]])
}

const shred: Shape = (w, h, t) => {
  let path = ''
  for (let i = 0; i < 22; i++) {
    const p = smooth((t - random(i) * 0.22) / 0.78)
    const x = (i * w) / 22
    const y = h * p
    path += polygon([
      [x, 0],
      [x + w / 22 + 0.5, 0],
      [x + w / 22 + 0.5, y],
      [x + w / 44, y - Math.sin(Math.PI * p) * 30],
      [x, y],
    ])
  }
  return path
}

const tear: Shape = (w, h, t) => {
  const opening = smooth(t) * w * 0.62
  const edge = Array.from({ length: 41 }, (_, i) => {
    const y = (h * i) / 40
    const teeth = (random(i + 101) - 0.5) * 20 * Math.sin(Math.PI * t)
    return [w / 2 - opening + teeth, y]
  })
  const other = edge.map(([x, y], i) => [w - x + (random(i + 44) - 0.5) * 8 * Math.sin(Math.PI * t), y]).reverse()
  return polygon([...edge, ...other])
}

const fracture: Shape = (w, h, t) => {
  const cx = w * 0.5,
    cy = h * 0.46
  const radius = Math.hypot(w, h)
  let path = ''
  const count = 18
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const next = ((i + 1) / count) * Math.PI * 2
    const p = smooth((t - random(i + 8) * 0.16) / 0.84)
    const r = radius * p
    const separation = Math.sin(Math.PI * p) * 4
    const originX = cx + Math.cos((angle + next) / 2) * separation
    const originY = cy + Math.sin((angle + next) / 2) * separation
    const a = [originX + Math.cos(angle) * r, originY + Math.sin(angle) * r]
    const b = [originX + Math.cos(next) * r, originY + Math.sin(next) * r]
    path += polygon([
      [originX, originY],
      a,
      [(a[0] + b[0]) / 2 + Math.sin(angle * 7) * r * 0.08, (a[1] + b[1]) / 2 + Math.cos(angle * 3) * r * 0.08],
      b,
    ])
    const crack = Math.min(radius, r * 1.5)
    path += polygon([
      [cx, cy],
      [cx + Math.cos(angle) * crack, cy + Math.sin(angle) * crack],
      [cx + Math.cos(angle + 0.002) * crack, cy + Math.sin(angle + 0.002) * crack],
    ])
  }
  return path
}

const wall: Shape = (w, h, t) => {
  let path = polygon([
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ])
  const cols = 7,
    rows = 5
  const vertex = (col: number, row: number) => [
    w * (col / cols + (col > 0 && col < cols ? (random(col + row * 13) - 0.5) * 0.07 : 0)),
    h * (row / rows + (row > 0 && row < rows ? (random(col + row * 27) - 0.5) * 0.1 : 0)),
  ]
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const corners = [vertex(col, row), vertex(col, row + 1), vertex(col + 1, row + 1), vertex(col + 1, row)]
      const cx = corners.reduce((sum, p) => sum + p[0], 0) / 4
      const cy = corners.reduce((sum, p) => sum + p[1], 0) / 4
      const delay = Math.hypot(cx / w - 0.5, cy / h - 0.5) * 0.35
      const broken = smooth((t - delay) / (1 - delay))
      path += polygon(corners.map(([x, y]) => [cx + (x - cx) * (1 - broken), cy + (y - cy) * (1 - broken)]))
    }
  }
  return path
}

const leaves: Shape = (w, h, t) => {
  let path = ''
  for (let i = 0; i < 18; i++) {
    const p = clamp((t - random(i + 81) * 0.18) / 0.82)
    const fall = smooth(p)
    const bloom = smooth((p - 0.68) / 0.32)
    const size =
      Math.min(w, h) * (0.045 + random(i) * 0.025) * smooth(p / 0.08) * (1 - bloom) + Math.hypot(w, h) * bloom
    const x = w * random(i + 5) + Math.sin(p * 9 + i) * w * 0.1 * (1 - bloom)
    const y = h * (-0.15 + fall * (0.65 + random(i + 18) * 0.5))
    const angle = Math.sin(p * 6 + i) * 1.2
    const at = (a: number, b: number) =>
      point(
        x + size * (a * Math.cos(angle) - b * Math.sin(angle)),
        y + size * (a * Math.sin(angle) + b * Math.cos(angle))
      )
    const outline = [
      [0, -1.2],
      [0.25, -0.48],
      [0.65, -0.65],
      [0.53, -0.12],
      [1, -0.2],
      [0.74, 0.15],
      [0.84, 0.4],
      [0.18, 0.55],
      [0.08, 0.94],
      [-0.08, 0.94],
      [-0.18, 0.55],
      [-0.84, 0.4],
      [-0.74, 0.15],
      [-1, -0.2],
      [-0.53, -0.12],
      [-0.65, -0.65],
      [-0.25, -0.48],
    ]
    path += 'M' + outline.map(([a, b]) => at(a, b)).join(' L') + 'Z'
  }
  return path
}

const ink: Shape = (w, h, t) => {
  const r = Math.hypot(w, h) * smooth(t)
  return polygon(
    Array.from({ length: 81 }, (_, i) => {
      const a = (i / 80) * Math.PI * 2
      const organic = 1 + Math.sin(a * 7 + t * 2) * 0.07 + Math.sin(a * 13) * 0.025
      return [w / 2 + Math.cos(a) * r * organic, h / 2 + Math.sin(a) * r * organic]
    })
  )
}

const blinds: Shape = (w, h, t) => {
  let path = ''
  for (let i = 0; i < 12; i++) {
    const p = smooth((t - i * 0.012) / 0.868)
    const y = (i * h) / 12
    path += polygon([
      [0, y],
      [w, y],
      [w, y + (h / 12) * p],
      [0, y + (h / 12) * p],
    ])
  }
  return path
}

function recipe(
  id: string,
  name: string,
  description: string,
  family: PresetFamily,
  shape: Shape,
  duration: number,
  supportsOrigin: boolean = false,
  supportsDirection: boolean = false
): PresetRecipe {
  const frame: Shape = (w, h, t) => shape(w, h, clamp(t))
  return {
    id,
    numId: id,
    name,
    family,
    description,
    motionKeywords: [id, name.toLowerCase()],
    defaultDuration: duration,
    defaultEasing: 'linear',
    supportsOrigin,
    supportsDirection,
    revealPath: frame,
    renderPreview(ctx, w, h, t, dark) {
      ctx.save()
      ctx.fillStyle = dark ? '#242723' : '#f4f2eb'
      try {
        ctx.fill(new Path2D(frame(w, h, t)))
      } finally {
        ctx.restore()
      }
    },
    generateStyle({ width, height, duration }) {
      const frames = Array.from({ length: 49 }, (_, i) => {
        const p = i / 48
        const clip = p === 1 ? 'inset(0)' : 'path(' + '"' + frame(width, height, p) + '")'
        return (p * 100).toFixed(3) + '% {clip-path:' + clip + '}'
      })
      return (
        '::view-transition-new(root){animation:natureReveal ' +
        duration +
        'ms linear both!important;will-change:clip-path;transform:translateZ(0)}' +
        '::view-transition-old(root){transform:translateZ(0);will-change:clip-path}' +
        '@keyframes natureReveal{' +
        frames.join('') +
        '}'
      )
    },
  }
}

export const naturePresets = [
  // 6 Cinematic Theme Transition Animations
  recipe(
    'viral-sweep',
    'Viral Sweep',
    'Smooth exponential circular shockwave expanding from the trigger origin.',
    'sound-and-signals',
    viralSweep,
    1200,
    true
  ),
  recipe(
    'glass-shatter',
    'Glass Shatter',
    'Multi-facet Voronoi crystalline fracture shards radiating outward.',
    'glass-and-optics',
    glassShatter,
    1400,
    true
  ),
  recipe(
    'seaside-waves',
    'Seaside Waves',
    'Sinusoidal ocean tidal surf with multi-harmonic wave crests.',
    'ink-and-water',
    seasideWaves,
    1600,
    false,
    true
  ),
  recipe(
    'balloon-pop',
    'Balloon Pop',
    'Elastic rubber bubble stretch followed by a sudden radial pop rupture.',
    'everyday-objects',
    balloonPop,
    1300,
    true
  ),
  recipe(
    'bomb-drop',
    'Bomb Drop',
    'Descending gravity projectile arc that detonates into a concussive shockwave.',
    'mechanical-motion',
    bombDrop,
    1500,
    true
  ),
  recipe(
    'party',
    'Party',
    'Starburst explosion with dispersing confetti ribbons and geometric streamers.',
    'paper-and-folds',
    party,
    1400,
    true
  ),

  // Nature & Material Transition Animations
  recipe(
    'waterfall',
    'Water Tank',
    'A continuous pour meets a rippling waterline as the screen fills from below.',
    'ink-and-water',
    water(false),
    2400
  ),
  recipe(
    'silver-rain',
    'Rainfall',
    'Fine drops accelerate into a pool. Splashes dance along its rising surface.',
    'ink-and-water',
    water(true),
    2200
  ),
  recipe(
    'puddle-bloom',
    'Puddle Ripple',
    'Expanding pools meet as delicate rings travel beyond their edges.',
    'ink-and-water',
    ripple,
    1600
  ),
  recipe(
    'falling-leaves',
    'Autumn Leaves',
    'A staggered canopy drifts and turns before unfolding into the next theme.',
    'landscape-and-growth',
    leaves,
    2300
  ),
  recipe(
    'paper-shred',
    'Paper Shred',
    'Narrow paper ribbons peel away at individually staggered speeds.',
    'paper-and-folds',
    shred,
    1450
  ),
  recipe(
    'paper-tear',
    'Paper Tear',
    'An irregular seam opens through the middle and pulls the page apart.',
    'paper-and-folds',
    tear,
    1500
  ),
  recipe(
    'wall-break',
    'Wall Break',
    'Cracks spread through irregular blocks before the wall crumbles away.',
    'mechanical-motion',
    wall,
    1350
  ),
  recipe(
    'glass-break',
    'Glass Fracture',
    'Fine cracks radiate outward before the sharp facets open.',
    'glass-and-optics',
    fracture,
    1400
  ),
  recipe(
    'tidal-silk',
    'Tidal Silk',
    'A soft, broad wave rolls over the page with a gently changing edge.',
    'ink-and-water',
    curtain,
    1600
  ),
  recipe(
    'ink-bloom',
    'Ink Bloom',
    'An organic ink pool spreads with scalloped edges and small imperfections.',
    'ink-and-water',
    ink,
    1500
  ),
  recipe(
    'woven-blinds',
    'Woven Blinds',
    'Horizontal bands open in sequence, like light through a woven shade.',
    'textile-and-thread',
    blinds,
    1250
  ),
]
