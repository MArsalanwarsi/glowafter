export interface CanvasCall {
  method: string
  args: any[]
}

export interface CanvasMockOptions {
  width: number
  height: number
}

export class MockGradient {
  colorStops: Array<{ offset: number; color: string }> = []
  addColorStop(offset: number, color: string) {
    if (isNaN(offset)) {
      throw new Error(`Invalid gradient stop offset: NaN`)
    }
    this.colorStops.push({ offset, color })
  }
}

export class MockCanvasRenderingContext2D {
  width: number
  height: number
  calls: CanvasCall[] = []
  errors: string[] = []

  // Context state
  fillStyle: string | MockGradient = '#000000'
  strokeStyle: string | MockGradient = '#000000'
  lineWidth: number = 1
  lineCap: CanvasLineCap = 'butt'
  lineJoin: CanvasLineJoin = 'miter'
  miterLimit: number = 10
  shadowBlur: number = 0
  shadowColor: string = 'rgba(0, 0, 0, 0)'
  shadowOffsetX: number = 0
  shadowOffsetY: number = 0
  globalAlpha: number = 1.0
  globalCompositeOperation: GlobalCompositeOperation = 'source-over'
  font: string = '10px sans-serif'
  textAlign: CanvasTextAlign = 'start'
  textBaseline: CanvasTextBaseline = 'alphabetic'
  filter: string = 'none'
  imageSmoothingEnabled: boolean = true

  private stateStack: Array<{
    fillStyle: string | MockGradient
    strokeStyle: string | MockGradient
    lineWidth: number
    globalAlpha: number
    globalCompositeOperation: GlobalCompositeOperation
  }> = []

  private lineDash: number[] = []

  constructor(width: number = 300, height: number = 180) {
    this.width = width
    this.height = height
  }

  private checkNumericArgs(method: string, args: any[]) {
    for (let i = 0; i < args.length; i++) {
      const val = args[i]
      if (typeof val === 'number') {
        if (Number.isNaN(val)) {
          const msg = `NaN passed to ctx.${method} at arg[${i}]`
          this.errors.push(msg)
        }
        if (!Number.isFinite(val)) {
          const msg = `Non-finite number (${val}) passed to ctx.${method} at arg[${i}]`
          this.errors.push(msg)
        }
      } else if (val === undefined || val === null) {
        const msg = `${val} passed to ctx.${method} at arg[${i}]`
        this.errors.push(msg)
      }
    }
  }

  save() {
    this.calls.push({ method: 'save', args: [] })
    this.stateStack.push({
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      globalAlpha: this.globalAlpha,
      globalCompositeOperation: this.globalCompositeOperation,
    })
  }

  restore() {
    this.calls.push({ method: 'restore', args: [] })
    const state = this.stateStack.pop()
    if (state) {
      this.fillStyle = state.fillStyle
      this.strokeStyle = state.strokeStyle
      this.lineWidth = state.lineWidth
      this.globalAlpha = state.globalAlpha
      this.globalCompositeOperation = state.globalCompositeOperation
    } else {
      this.errors.push('restore() called more times than save()')
    }
  }

  get stackDepth(): number {
    return this.stateStack.length
  }

  beginPath() {
    this.calls.push({ method: 'beginPath', args: [] })
  }

  closePath() {
    this.calls.push({ method: 'closePath', args: [] })
  }

  moveTo(x: number, y: number) {
    this.checkNumericArgs('moveTo', [x, y])
    this.calls.push({ method: 'moveTo', args: [x, y] })
  }

  lineTo(x: number, y: number) {
    this.checkNumericArgs('lineTo', [x, y])
    this.calls.push({ method: 'lineTo', args: [x, y] })
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ) {
    this.checkNumericArgs('arc', [x, y, radius, startAngle, endAngle])
    if (radius < 0) {
      this.errors.push(`Negative radius (${radius}) passed to ctx.arc`)
    }
    this.calls.push({
      method: 'arc',
      args: [x, y, radius, startAngle, endAngle, counterclockwise],
    })
  }

  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ) {
    this.checkNumericArgs('ellipse', [x, y, radiusX, radiusY, rotation, startAngle, endAngle])
    if (radiusX < 0 || radiusY < 0) {
      this.errors.push(`Negative radius (${radiusX}, ${radiusY}) passed to ctx.ellipse`)
    }
    this.calls.push({
      method: 'ellipse',
      args: [x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise],
    })
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this.checkNumericArgs('arcTo', [x1, y1, x2, y2, radius])
    this.calls.push({ method: 'arcTo', args: [x1, y1, x2, y2, radius] })
  }

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ) {
    this.checkNumericArgs('bezierCurveTo', [cp1x, cp1y, cp2x, cp2y, x, y])
    this.calls.push({
      method: 'bezierCurveTo',
      args: [cp1x, cp1y, cp2x, cp2y, x, y],
    })
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.checkNumericArgs('quadraticCurveTo', [cpx, cpy, x, y])
    this.calls.push({ method: 'quadraticCurveTo', args: [cpx, cpy, x, y] })
  }

  rect(x: number, y: number, w: number, h: number) {
    this.checkNumericArgs('rect', [x, y, w, h])
    this.calls.push({ method: 'rect', args: [x, y, w, h] })
  }

  fillRect(x: number, y: number, w: number, h: number) {
    this.checkNumericArgs('fillRect', [x, y, w, h])
    this.calls.push({ method: 'fillRect', args: [x, y, w, h] })
  }

  strokeRect(x: number, y: number, w: number, h: number) {
    this.checkNumericArgs('strokeRect', [x, y, w, h])
    this.calls.push({ method: 'strokeRect', args: [x, y, w, h] })
  }

  clearRect(x: number, y: number, w: number, h: number) {
    this.checkNumericArgs('clearRect', [x, y, w, h])
    this.calls.push({ method: 'clearRect', args: [x, y, w, h] })
  }

  fill(fillRule?: CanvasFillRule) {
    this.calls.push({ method: 'fill', args: fillRule ? [fillRule] : [] })
  }

  stroke() {
    this.calls.push({ method: 'stroke', args: [] })
  }

  clip(fillRule?: CanvasFillRule) {
    this.calls.push({ method: 'clip', args: fillRule ? [fillRule] : [] })
  }

  translate(x: number, y: number) {
    this.checkNumericArgs('translate', [x, y])
    this.calls.push({ method: 'translate', args: [x, y] })
  }

  rotate(angle: number) {
    this.checkNumericArgs('rotate', [angle])
    this.calls.push({ method: 'rotate', args: [angle] })
  }

  scale(x: number, y: number) {
    this.checkNumericArgs('scale', [x, y])
    this.calls.push({ method: 'scale', args: [x, y] })
  }

  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) {
    this.checkNumericArgs('transform', [a, b, c, d, e, f])
    this.calls.push({ method: 'transform', args: [a, b, c, d, e, f] })
  }

  setTransform(
    a?: number | DOMMatrix2DInit,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number
  ) {
    if (typeof a === 'number') {
      this.checkNumericArgs('setTransform', [a, b, c, d, e, f])
    }
    this.calls.push({ method: 'setTransform', args: [a, b, c, d, e, f] })
  }

  resetTransform() {
    this.calls.push({ method: 'resetTransform', args: [] })
  }

  createLinearGradient(x0: number, y0: number, x1: number, y1: number): any {
    this.checkNumericArgs('createLinearGradient', [x0, y0, x1, y1])
    this.calls.push({
      method: 'createLinearGradient',
      args: [x0, y0, x1, y1],
    })
    return new MockGradient()
  }

  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ): any {
    this.checkNumericArgs('createRadialGradient', [x0, y0, r0, x1, y1, r1])
    this.calls.push({
      method: 'createRadialGradient',
      args: [x0, y0, r0, x1, y1, r1],
    })
    return new MockGradient()
  }

  createPattern(): any {
    return {}
  }

  setLineDash(segments: number[]) {
    for (let i = 0; i < segments.length; i++) {
      if (isNaN(segments[i])) {
        this.errors.push(`NaN passed to setLineDash at [${i}]`)
      }
    }
    this.lineDash = [...segments]
    this.calls.push({ method: 'setLineDash', args: [segments] })
  }

  getLineDash(): number[] {
    return [...this.lineDash]
  }

  fillText(text: string, x: number, y: number, maxWidth?: number) {
    this.checkNumericArgs('fillText', maxWidth !== undefined ? [x, y, maxWidth] : [x, y])
    this.calls.push({ method: 'fillText', args: [text, x, y, maxWidth] })
  }

  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    this.checkNumericArgs('strokeText', maxWidth !== undefined ? [x, y, maxWidth] : [x, y])
    this.calls.push({ method: 'strokeText', args: [text, x, y, maxWidth] })
  }

  measureText(text: string) {
    return {
      width: text.length * 8,
      actualBoundingBoxAscent: 8,
      actualBoundingBoxDescent: 2,
    } as TextMetrics
  }

  drawImage(...args: any[]) {
    this.calls.push({ method: 'drawImage', args })
  }

  /**
   * Check if a full-screen solid rect was drawn at progress t = 0 that covers
   * the entire canvas in opaque fill without being inside a clip path or cleared.
   */
  hasPermanentSolidFillAtT0(w: number, h: number): boolean {
    const fullFills = this.calls.filter(
      (c) =>
        c.method === 'fillRect' &&
        c.args[0] <= 0 &&
        c.args[1] <= 0 &&
        c.args[2] >= w &&
        c.args[3] >= h
    )
    if (fullFills.length > 0 && this.globalAlpha >= 0.99) {
      const hasClear = this.calls.some((c) => c.method === 'clearRect')
      return !hasClear
    }
    return false
  }
}
