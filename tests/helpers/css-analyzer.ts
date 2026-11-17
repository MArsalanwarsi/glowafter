export interface KeyframeStop {
  stop: string // e.g. '0%', '100%', 'from', 'to'
  clipPath?: string
  shapeType?: 'polygon' | 'circle' | 'ellipse' | 'inset' | 'path' | 'none' | 'unknown'
  vertexCount?: number
  declarations: Record<string, string>
}

export interface KeyframeBlock {
  name: string
  stops: KeyframeStop[]
  raw: string
}

export interface CssAnalysisResult {
  hasViewTransitionTarget: boolean
  hasNewPseudo: boolean
  hasOldPseudo: boolean
  hasFillModeBoth: boolean
  hasWillChange: boolean
  keyframes: KeyframeBlock[]
  shapeMismatches: Array<{
    keyframeName: string
    details: string
  }>
  vertexMismatches: Array<{
    keyframeName: string
    details: string
    stops: Array<{ stop: string; count: number }>
  }>
  errors: string[]
}

/**
 * Counts vertices in a CSS polygon() string.
 * Example: "polygon(0 0, 100% 0, 50% 50%)" -> 3
 */
export function countPolygonVertices(polygonValue: string): number {
  const match = polygonValue.match(/polygon\s*\((.*)\)/i)
  if (!match) return 0
  const inner = match[1].trim()
  if (!inner) return 0

  // Optional fill rule: nonzero, evenodd at the start
  let body = inner
  if (/^(nonzero|evenodd)\s*,/i.test(body)) {
    body = body.replace(/^(nonzero|evenodd)\s*,\s*/i, '')
  }

  // Split by comma
  const parts = body.split(',').map((p) => p.trim()).filter(Boolean)
  return parts.length
}

/**
 * Determines basic shape type from a clip-path property value
 */
export function detectShapeType(
  clipPathValue: string
): 'polygon' | 'circle' | 'ellipse' | 'inset' | 'path' | 'none' | 'unknown' {
  const val = clipPathValue.trim().toLowerCase()
  if (val.startsWith('polygon')) return 'polygon'
  if (val.startsWith('circle')) return 'circle'
  if (val.startsWith('ellipse')) return 'ellipse'
  if (val.startsWith('inset')) return 'inset'
  if (val.startsWith('path')) return 'path'
  if (val === 'none') return 'none'
  return 'unknown'
}

/**
 * Extracts balanced blocks { ... } from text starting after startPos
 */
function extractBalancedBlock(text: string, startPos: number): { body: string; endPos: number } | null {
  const openPos = text.indexOf('{', startPos)
  if (openPos === -1) return null

  let depth = 1
  let i = openPos + 1
  while (i < text.length && depth > 0) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') depth--
    i++
  }

  if (depth !== 0) return null
  return {
    body: text.slice(openPos + 1, i - 1),
    endPos: i,
  }
}

/**
 * Parses keyframe stops from a keyframe block body
 */
function parseKeyframeStops(kfBody: string): KeyframeStop[] {
  const stops: KeyframeStop[] = []
  let pos = 0

  while (pos < kfBody.length) {
    const braceIdx = kfBody.indexOf('{', pos)
    if (braceIdx === -1) break

    const stopHeader = kfBody.slice(pos, braceIdx).trim()
    const block = extractBalancedBlock(kfBody, braceIdx)
    if (!block) break

    const stopNames = stopHeader.split(',').map((s) => s.trim()).filter(Boolean)
    const content = block.body

    const declarations: Record<string, string> = {}
    const declPairs = content.split(';')
    for (const pair of declPairs) {
      const colonIdx = pair.indexOf(':')
      if (colonIdx !== -1) {
        const prop = pair.slice(0, colonIdx).trim().toLowerCase()
        const val = pair.slice(colonIdx + 1).trim()
        declarations[prop] = val
      }
    }

    const clipPath = declarations['clip-path']
    let shapeType: KeyframeStop['shapeType']
    let vertexCount: number | undefined

    if (clipPath) {
      shapeType = detectShapeType(clipPath)
      if (shapeType === 'polygon') {
        vertexCount = countPolygonVertices(clipPath)
      }
    }

    for (const name of stopNames) {
      stops.push({
        stop: name,
        clipPath,
        shapeType,
        vertexCount,
        declarations,
      })
    }

    pos = block.endPos
  }

  return stops
}

/**
 * Analyzes CSS output from a preset's generateStyle(ctx)
 */
export function analyzePresetCss(css: string): CssAnalysisResult {
  const hasNewPseudo = /::view-transition-new\s*\(\s*root\s*\)/i.test(css)
  const hasOldPseudo = /::view-transition-old\s*\(\s*root\s*\)/i.test(css)
  const hasViewTransitionTarget = hasNewPseudo || hasOldPseudo

  // Check animation-fill-mode: both, or animation shorthand containing 'both'
  const explicitFillMode = /animation-fill-mode\s*:\s*both/i.test(css)
  const shorthandFillMode = /animation\s*:[^;]*\bboth\b/i.test(css)
  const hasFillModeBoth = explicitFillMode || shorthandFillMode

  // Check will-change
  const hasWillChange = /will-change\s*:[^;]*(clip-path|transform|opacity)/i.test(css)

  const keyframes: KeyframeBlock[] = []
  const shapeMismatches: Array<{ keyframeName: string; details: string }> = []
  const vertexMismatches: Array<{
    keyframeName: string
    details: string
    stops: Array<{ stop: string; count: number }>
  }> = []
  const errors: string[] = []

  // Extract keyframes with balanced braces
  const kfKeyword = '@keyframes'
  let searchIdx = 0

  while (searchIdx < css.length) {
    const kfIdx = css.indexOf(kfKeyword, searchIdx)
    if (kfIdx === -1) break

    const afterKeyword = kfIdx + kfKeyword.length
    const openBrace = css.indexOf('{', afterKeyword)
    if (openBrace === -1) break

    const name = css.slice(afterKeyword, openBrace).trim()
    const block = extractBalancedBlock(css, openBrace)
    if (!block) {
      errors.push(`Unterminated @keyframes block for ${name}`)
      break
    }

    const stops = parseKeyframeStops(block.body)
    keyframes.push({
      name,
      stops,
      raw: css.slice(kfIdx, block.endPos),
    })

    // Validate shape types across stops that declare clip-path
    const stopsWithClip = stops.filter((s) => s.shapeType && s.shapeType !== 'none')
    if (stopsWithClip.length > 1) {
      const firstShape = stopsWithClip[0].shapeType
      const differentShapes = stopsWithClip.filter((s) => s.shapeType !== firstShape)
      if (differentShapes.length > 0) {
        const shapesList = stopsWithClip.map((s) => `${s.stop}:${s.shapeType}`).join(' -> ')
        shapeMismatches.push({
          keyframeName: name,
          details: `Incompatible basic shape types in @keyframes ${name}: ${shapesList}`,
        })
      }

      // If shape is polygon, check vertex count matching
      if (firstShape === 'polygon' && differentShapes.length === 0) {
        const counts = stopsWithClip.map((s) => ({
          stop: s.stop,
          count: s.vertexCount ?? 0,
        }))
        const firstCount = counts[0].count
        const differing = counts.filter((c) => c.count !== firstCount)
        if (differing.length > 0) {
          const countDesc = counts.map((c) => `${c.stop}(${c.count} vertices)`).join(' vs ')
          vertexMismatches.push({
            keyframeName: name,
            details: `Polygon vertex count mismatch in @keyframes ${name}: ${countDesc}`,
            stops: counts,
          })
        }
      }
    }

    searchIdx = block.endPos
  }

  return {
    hasViewTransitionTarget,
    hasNewPseudo,
    hasOldPseudo,
    hasFillModeBoth,
    hasWillChange,
    keyframes,
    shapeMismatches,
    vertexMismatches,
    errors,
  }
}
