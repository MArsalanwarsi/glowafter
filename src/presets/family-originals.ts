import { PresetRecipe, ThemeAnimationType, ThemeAnimationDirection } from './types'

export const originalsPresets: PresetRecipe[] = [
  {
    id: 'circle',
    numId: 'orig-01',
    name: 'Circle',
    family: 'originals',
    description: 'Smooth expanding circle transition originating from the trigger point.',
    motionKeywords: ['circle', 'expand', 'radial', 'classic', 'clean'],
    defaultDuration: 750,
    defaultEasing: 'ease-in-out',
    supportsOrigin: true,
    originalType: ThemeAnimationType.CIRCLE,
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      const r = t * Math.hypot(w, h) * 0.7
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: circleReveal ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes circleReveal {
        0% { clip-path: circle(0% at ${ctx.x}px ${ctx.y}px); }
        100% { clip-path: circle(150% at ${ctx.x}px ${ctx.y}px); }
      }
    `
  },
  {
    id: 'blur-circle',
    numId: 'orig-02',
    name: 'Blur Circle',
    family: 'originals',
    description: 'Expanding circle with an elegant soft Gaussian blur on its perimeter.',
    motionKeywords: ['blur', 'circle', 'gaussian', 'soft', 'glow', 'feathered'],
    defaultDuration: 750,
    defaultEasing: 'ease-in-out',
    supportsOrigin: true,
    supportsBlur: true,
    originalType: ThemeAnimationType.BLUR_CIRCLE,
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      const r = t * Math.hypot(w, h) * 0.7
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.4)' : 'rgba(99,102,241,0.4)'
      ctx.lineWidth = 12
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: blurCircle ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes blurCircle {
        0% { clip-path: circle(0% at ${ctx.x}px ${ctx.y}px); filter: blur(4px); }
        100% { clip-path: circle(150% at ${ctx.x}px ${ctx.y}px); filter: blur(0px); }
      }
    `
  },
  {
    id: 'qr-scan',
    numId: 'orig-03',
    name: 'QR Scan',
    family: 'originals',
    description: 'Scanning line sweeps across the screen like a modern laser or camera barcode reader.',
    motionKeywords: ['qr scan', 'sweep', 'scanline', 'laser', 'directional', 'linear'],
    defaultDuration: 750,
    defaultEasing: 'ease-in-out',
    supportsDirection: true,
    originalType: ThemeAnimationType.QR_SCAN,
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const sweepX = w * t
      ctx.fillRect(0, 0, sweepX, h)
      ctx.strokeStyle = isDark ? '#38bdf8' : '#6366f1'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(sweepX, 0)
      ctx.lineTo(sweepX, h)
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => {
      const dir = ctx.direction || ThemeAnimationDirection.LTR
      let fromInset = 'inset(0 100% 0 0)'
      if (dir === ThemeAnimationDirection.RTL) {
        fromInset = 'inset(0 0 0 100%)'
      } else if (dir === ThemeAnimationDirection.TTB) {
        fromInset = 'inset(0 0 100% 0)'
      } else if (dir === ThemeAnimationDirection.BTT) {
        fromInset = 'inset(100% 0 0 0)'
      }
      return `
        ::view-transition-new(root) {
          animation: qrScan ${ctx.duration}ms ${ctx.easing};
          animation-fill-mode: both;
          will-change: clip-path;
        }
        @keyframes qrScan {
          0% { clip-path: ${fromInset}; }
          100% { clip-path: inset(0 0 0 0); }
        }
      `
    }
  },
  {
    id: 'polygon',
    numId: 'orig-04',
    name: 'Polygon',
    family: 'originals',
    description: 'Sharp diagonal wipe sweeping diagonally across the viewport.',
    motionKeywords: ['polygon', 'diagonal', 'triangle', 'sharp', 'wipe', 'geometric'],
    defaultDuration: 750,
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    originalType: ThemeAnimationType.POLYGON,
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const d = (w + h) * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(d, 0)
      ctx.lineTo(0, d)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: polyWipe ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes polyWipe {
        0% { clip-path: polygon(0 0, 0 0, 0 0); }
        100% { clip-path: polygon(0 0, 250% 0, 0 250%); }
      }
    `
  },
  {
    id: 'polygon-gradient',
    numId: 'orig-05',
    name: 'Polygon Gradient',
    family: 'originals',
    description: 'Diagonal wipe with a soft gradient edge expanding across from corner to corner.',
    motionKeywords: ['polygon gradient', 'soft wipe', 'diagonal', 'gradient edge', 'feathered'],
    defaultDuration: 1500,
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    originalType: ThemeAnimationType.POLYGON_GRADIENT,
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      const d = (w + h) * t
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(d, 0)
      ctx.lineTo(0, d)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.5)' : 'rgba(99,102,241,0.5)'
      ctx.lineWidth = 10
      ctx.stroke()
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: polyGradient ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes polyGradient {
        0% { clip-path: polygon(0 0, 0 0, 0 0); }
        100% { clip-path: polygon(0 0, 250% 0, 0 250%); }
      }
    `
  },
  {
    id: 'gif',
    numId: 'orig-06',
    name: 'Custom GIF',
    family: 'originals',
    description: 'Reveals the new theme through an animated mask defined by any custom GIF.',
    motionKeywords: ['gif', 'custom mask', 'video', 'animation', 'masking', 'stencil'],
    defaultDuration: 2000,
    defaultEasing: 'ease-in-out',
    supportsGif: true,
    originalType: ThemeAnimationType.GIF,
    renderPreview: (ctx, w, h, t, isDark) => {
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      const r = t * Math.hypot(w, h) * 0.6
      ctx.fillStyle = isDark ? '#111317' : '#f8f9fa'
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      // Mask dancer symbol
      ctx.fillStyle = isDark ? '#f43f5e' : '#ec4899'
      ctx.font = '24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('✨ GIF', cx, cy)
      ctx.restore()
    },
    generateStyle: (ctx) => `
      ::view-transition-new(root) {
        animation: gifScale ${ctx.duration}ms ${ctx.easing};
        animation-fill-mode: both;
        will-change: clip-path;
      }
      @keyframes gifScale {
        0% { clip-path: circle(0% at 50% 50%); }
        100% { clip-path: circle(150% at 50% 50%); }
      }
    `
  }
]
