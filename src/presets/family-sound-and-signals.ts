import { PresetRecipe } from './types'

export const soundAndSignalsPresets: PresetRecipe[] = [
  {
    id: 'oscilloscope-trace',
    numId: '073',
    name: 'Oscilloscope Trace',
    family: 'sound-and-signals',
    description: 'A traveling point writes a continuous waveform. The lobes expose the destination alternately above and below the baseline before the rest fills.',
    motionKeywords: ['oscilloscope', 'waveform', 'sine wave', 'signal', 'lobes', 'baseline'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const waveX = w * t
      ctx.fillRect(0, 0, waveX, h)
      // Wave trace line
      ctx.strokeStyle = isDark ? '#38bdf8' : '#6366f1'
      ctx.lineWidth = 3
      ctx.beginPath()
      for (let x = 0; x <= waveX; x += 10) {
        const y = h / 2 + Math.sin((x / 30)) * 25
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: oscilloscope ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes oscilloscope {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'packet-switch',
    numId: '074',
    name: 'Packet Switch',
    family: 'sound-and-signals',
    description: 'Short packets travel to junctions and split onto branches. Each region changes on packet arrival, making route length visible in the timing.',
    motionKeywords: ['packet switch', 'network', 'routing', 'junctions', 'nodes', 'data'],
    defaultDuration: 850,
    defaultEasing: 'steps(4)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const quarters = Math.floor(t * 4) + 1
      if (quarters >= 1) ctx.fillRect(0, 0, w / 2, h / 2)
      if (quarters >= 2) ctx.fillRect(w / 2, 0, w / 2, h / 2)
      if (quarters >= 3) ctx.fillRect(0, h / 2, w / 2, h / 2)
      if (quarters >= 4) ctx.fillRect(w / 2, h / 2, w / 2, h / 2)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: packetSwitch ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes packetSwitch {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'interlaced-fields',
    numId: '075',
    name: 'Interlaced Fields',
    family: 'sound-and-signals',
    description: 'One pass replaces alternate scanlines. A second pass fills the gaps while the comb-like edges of the two fields come into register.',
    motionKeywords: ['interlaced', 'scanlines', 'crt', 'fields', 'comb', 'broadcast'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const lineH = 4
      const lines = Math.ceil(h / lineH)
      for (let i = 0; i < lines; i++) {
        if (i % 2 === 0) {
          ctx.fillRect(0, i * lineH, w * Math.min(1, t * 1.5), lineH)
        } else if (t > 0.4) {
          ctx.fillRect(0, i * lineH, w * ((t - 0.4) / 0.6), lineH)
        }
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: interlaced ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes interlaced {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'seven-segment-display',
    numId: '076',
    name: 'Seven-Segment Display',
    family: 'sound-and-signals',
    description: 'Seven thick bars assemble a recognizable digit. The lit bars extend past their joints to turn the spaces inside and outside the digit into the new page.',
    motionKeywords: ['seven segment', 'display', 'digital clock', 'led', 'lcd', 'digit'],
    defaultDuration: 900,
    defaultEasing: 'steps(7)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const segW = w * t
      ctx.fillRect((w - segW) / 2, (h - segW) / 2, segW, segW)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: sevenSegment ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes sevenSegment {
        0% { clip-path: inset(45% 45% 45% 45%); }
        100% { clip-path: inset(0% 0% 0% 0%); }
      }
    `
  },
  {
    id: 'tape-tracking',
    numId: '077',
    name: 'Tape Tracking',
    family: 'sound-and-signals',
    description: 'A narrow tracking band bends a local patch of scanlines sideways. Lines behind the band straighten into the new theme as it passes.',
    motionKeywords: ['tape tracking', 'vhs', 'glitch', 'analog', 'scanlines', 'cassette'],
    defaultDuration: 850,
    defaultEasing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const trackY = h * t
      ctx.fillRect(0, 0, w, trackY)
      // Glitch bar
      ctx.fillStyle = isDark ? '#38bdf8' : '#818cf8'
      ctx.fillRect(0, trackY, w, 8)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: tapeTracking ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes tapeTracking {
        0% { clip-path: inset(0 0 100% 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'phase-cancellation',
    numId: '078',
    name: 'Phase Cancellation',
    family: 'sound-and-signals',
    description: 'Two wavefronts travel toward one another. Where their peaks and troughs cancel, stable windows appear and expand from the stationary nodes.',
    motionKeywords: ['phase cancellation', 'wavefronts', 'nodes', 'interference', 'acoustics'],
    defaultDuration: 900,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const r = t * Math.hypot(w, h) * 0.7
      ctx.beginPath()
      ctx.arc(w * 0.2, h / 2, r, 0, Math.PI * 2)
      ctx.arc(w * 0.8, h / 2, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: phaseNodes ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes phaseNodes {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  },
  {
    id: 'barcode-decode',
    numId: '079',
    name: 'Barcode Decode',
    family: 'sound-and-signals',
    description: 'Narrow and wide bars unlock in groups as a reader crosses them. Decoded bars then open sideways into the blank spaces between groups.',
    motionKeywords: ['barcode', 'scanner', 'laser', 'reader', 'upc', 'decode'],
    defaultDuration: 850,
    defaultEasing: 'ease-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const barX = w * t
      ctx.fillRect(0, 0, barX, h)
      // Red laser line
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(barX, 0)
      ctx.lineTo(barX, h)
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: barcodeScan ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes barcodeScan {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'spectrogram',
    numId: '080',
    name: 'Spectrogram',
    family: 'sound-and-signals',
    description: 'Small time-frequency cells fill along separated harmonic ridges. The ridges thicken and connect across frequency bands, resolving into a solid page.',
    motionKeywords: ['spectrogram', 'harmonics', 'audio spectrum', 'frequencies', 'sound'],
    defaultDuration: 900,
    defaultEasing: 'ease-in-out',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const bands = 8
      const bh = h / bands
      for (let i = 0; i < bands; i++) {
        const factor = Math.min(1, Math.max(0, (t * 1.5 - (i % 3) * 0.15)))
        ctx.fillRect(0, i * bh, w * factor, bh)
      }
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: spectrogram ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes spectrogram {
        0% { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
    `
  },
  {
    id: 'tuning-fork',
    numId: '081',
    name: 'Tuning Fork',
    family: 'sound-and-signals',
    description: 'Two tines bend apart and vibrate toward one another above a fixed stem. The space between them reveals the page, widens, and settles as the oscillation dies away.',
    motionKeywords: ['tuning fork', 'vibrate', 'tines', 'oscillation', 'resonance', 'pitch'],
    defaultDuration: 900,
    defaultEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const spread = (w / 2) * t
      ctx.fillRect(w / 2 - spread, 0, spread * 2, h)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: tuningFork ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes tuningFork {
        0% { clip-path: inset(0 50% 0 50%); }
        100% { clip-path: inset(0 0% 0 0%); }
      }
    `
  }
]
