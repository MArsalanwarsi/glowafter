import path from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { naturePresets } from '../../src/presets/nature'

test.describe.configure({ mode: 'parallel' })

const url = 'http://127.0.0.1:4176/glowafter/'
async function open(page: Page) {
  await page.route('http://127.0.0.1:4176/**', async (route) => {
    const relative = decodeURIComponent(
      new URL(route.request().url()).pathname.replace(/^\/(glowafter|react-theme-switch-animation)/, '')
    )
    await route.fulfill({ path: path.resolve('example/out', relative === '/' ? 'index.html' : relative.slice(1)) })
  })
  await page.goto(url)
  await expect(page.getByRole('button', { name: 'Play selected transition' })).toBeEnabled()
}

for (const [width, height] of [
  [1440, 900],
  [768, 1024],
  [390, 844],
]) {
  test.describe(width + 'px viewport', () => {
    test.use({ viewport: { width, height } })
    for (const recipe of naturePresets) {
      test(recipe.name + ' reveals both ways and cleans up', async ({ page }) => {
        const errors: string[] = []
        page.on('pageerror', (error) => errors.push(error.message))
        await open(page)
        await page.getByRole('button', { name: 'Select ' + recipe.name, exact: true }).click()
        const play = page.getByRole('button', { name: 'Play selected transition' })
        for (const dark of [true, false]) {
          await play.click()
          await expect(page.locator('#theme-switch-style')).toHaveCount(1)
          const style = await page.locator('#theme-switch-style').textContent()
          expect(style).not.toContain('NaN')
          await page.waitForFunction(() =>
            document
              .getAnimations()
              .some(
                (animation) => (animation.effect as KeyframeEffect)?.pseudoElement === '::view-transition-new(root)'
              )
          )
          await expect(play).toBeEnabled({ timeout: 10000 })
          await expect(page.locator('html')).toHaveClass(dark ? /dark/ : /^(?!.*\bdark\b).*$/)
          expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(dark ? 'dark' : 'light')
          await expect(page.locator('#theme-switch-style')).toHaveCount(0)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
        expect(errors).toEqual([])
      })
    }
  })
}

test('all geometry starts empty, ends covered and parses at intermediate frames', async ({ page }) => {
  await open(page)
  for (const [w, h] of [
    [390, 844],
    [1440, 900],
    [3840, 2160],
  ]) {
    for (const recipe of naturePresets) {
      const frames = Array.from({ length: 51 }, (_, i) => recipe.revealPath!(w, h, i / 50))
      const coverage = await page.evaluate(
        ({ frames, w, h }) => {
          const canvas = document.createElement('canvas')
          canvas.width = 96
          canvas.height = 96
          const ctx = canvas.getContext('2d')!
          ctx.scale(96 / w, 96 / h)
          return frames.map((shape) => {
            if (!CSS.supports('clip-path', 'path("' + shape + '")')) throw new Error('Invalid CSS path')
            ctx.clearRect(0, 0, w, h)
            ctx.fill(new Path2D(shape))
            const pixels = ctx.getImageData(0, 0, 96, 96).data
            let opacity = 0
            for (let i = 3; i < pixels.length; i += 4) opacity += pixels[i] / 255
            return opacity / (96 * 96)
          })
        },
        { frames, w, h }
      )
      expect(coverage[0], recipe.id + ' initial coverage').toBeLessThan(0.02)
      expect(coverage[50], recipe.id + ' final coverage').toBeGreaterThan(0.99)
      expect(
        coverage.some((value) => value > 0.15 && value < 0.85),
        recipe.id + ' intermediate coverage'
      ).toBe(true)
    }
  }
})

test('animated GIF uploads, restarts and releases its mask', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: 'Select Custom GIF', exact: true }).click()
  await page.locator('input[type=file]').setInputFiles('tests/browser/reveal.gif')
  for (let i = 0; i < 2; i++) {
    const play = page.getByRole('button', { name: 'Play selected transition' })
    await play.click()
    await page.waitForFunction(() =>
      document.getElementById('theme-switch-style')?.textContent?.includes('mask-mode: alpha')
    )
    expect(await page.locator('#theme-switch-style').textContent()).toContain('blob:')
    await expect(play).toBeEnabled({ timeout: 10000 })
    await expect(page.locator('#theme-switch-style')).toHaveCount(0)
  }
})

test('failed GIF is recoverable and leaves the theme intact', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: 'Select Custom GIF', exact: true }).click()
  await page.getByRole('textbox', { name: 'GIF URL' }).fill('data:image/gif;base64,AAAA')
  await page.getByRole('button', { name: 'Play selected transition' }).click()
  await expect(page.locator('.error-message')).toBeVisible()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Select Seaside Waves', exact: true }).click()
  await page.getByRole('button', { name: 'Play selected transition' }).click()
  await expect(page.getByRole('button', { name: 'Play selected transition' })).toBeEnabled({ timeout: 10000 })
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('reduced motion and unavailable storage still switch immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Blocked')
    }
    Storage.prototype.setItem = () => {
      throw new Error('Blocked')
    }
  })
  await open(page)
  const play = page.getByRole('button', { name: 'Play selected transition' })
  for (let i = 0; i < 40; i++) {
    await play.click()
    await expect(page.locator('html')).toHaveClass(i % 2 === 0 ? /dark/ : /^(?!.*\bdark\b).*$/)
    await expect(page.locator('#theme-switch-style')).toHaveCount(0)
  }
})

test('rapid clicks run a single transition', async ({ page }) => {
  await open(page)
  await page.getByRole('button', { name: 'Play selected transition' }).evaluate((button) => {
    for (let i = 0; i < 30; i++) (button as HTMLButtonElement).click()
  })
  await expect(page.getByRole('button', { name: 'Play selected transition' })).toBeEnabled({ timeout: 10000 })
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.locator('#theme-switch-style')).toHaveCount(0)
})

test('unsupported native transition uses the fallback and clears its canvas', async ({ page }) => {
  await page.setViewportSize({ width: 3840, height: 2160 })
  await page.addInitScript(() => {
    Object.defineProperty(document, 'startViewTransition', { value: undefined })
  })
  await open(page)
  await page.getByRole('button', { name: 'Play selected transition' }).click()
  await expect(page.locator('#theme-switch-gsap-overlay')).toHaveCount(1)
  expect(
    await page
      .locator('#theme-switch-gsap-overlay')
      .evaluate((canvas) => (canvas as HTMLCanvasElement).width * (canvas as HTMLCanvasElement).height)
  ).toBeLessThan(2003000)
  await expect(page.getByRole('button', { name: 'Play selected transition' })).toBeEnabled({ timeout: 10000 })
  await expect(page.locator('#theme-switch-gsap-overlay')).toHaveCount(0)
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('filters, duration slider and keyboard dialog work', async ({ page }) => {
  await open(page)
  await page.getByRole('tab', { name: 'Material', exact: true }).click()
  await expect(page.getByRole('button', { name: /^Select / })).toHaveCount(5)
  await page.getByRole('tab', { name: 'Cinematic', exact: true }).click()
  await expect(page.getByRole('button', { name: /^Select / })).toHaveCount(5)
  await page.getByRole('tab', { name: 'Custom', exact: true }).click()
  await expect(page.getByRole('button', { name: /^Select / })).toHaveCount(1)
  const slider = page.getByRole('slider')
  await slider.focus()
  await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveAttribute('aria-valuenow', '1300')
  const trigger = page.getByRole('button', { name: 'Get the code' })
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText('duration: 1300')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})
