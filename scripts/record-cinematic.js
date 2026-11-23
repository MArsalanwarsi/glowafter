const path = require('node:path')
const fs = require('node:fs')
const { chromium } = require('@playwright/test')
const { execSync } = require('node:child_process')

async function smoothClick(page, selector) {
  const el = typeof selector === 'string' ? page.locator(selector).first() : selector
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  const box = await el.boundingBox()
  if (!box) return
  const targetX = box.x + box.width / 2
  const targetY = box.y + box.height / 2

  // Move smoothly with 20 interpolation steps
  await page.mouse.move(targetX, targetY, { steps: 25 })
  await page.waitForTimeout(150)
  await page.mouse.down()
  await page.waitForTimeout(100)
  await page.mouse.up()
  await page.waitForTimeout(200)
}

async function main() {
  const videoDir = path.resolve('videos/cinematic')
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true })
  }

  // Clear previous videos in this dir
  fs.readdirSync(videoDir).forEach((f) => fs.unlinkSync(path.join(videoDir, f)))

  const browser = await chromium.launch({
    headless: true,
  })

  const context = await browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 },
    },
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5, // Crisp retina rendering
  })

  const page = await context.newPage()

  // Serve static export files via routing
  await page.route('http://127.0.0.1:4176/**', async (route) => {
    const relative = decodeURIComponent(
      new URL(route.request().url()).pathname.replace(/^\/(glowafter|react-theme-switch-animation)/, '')
    )
    const filePath = path.resolve('example/out', relative === '/' ? 'index.html' : relative.slice(1))
    await route.fulfill({ path: filePath })
  })

  console.log('Navigating to demo...')
  await page.goto('http://127.0.0.1:4176/glowafter/')
  await page.waitForSelector('button[aria-label="Play selected transition"]')

  // Inject sleek modern cursor
  await page.evaluate(() => {
    const cursor = document.createElement('div')
    cursor.id = 'demo-mouse-cursor'
    cursor.style.cssText = `
      position: fixed;
      top: -100px;
      left: -100px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.4);
      border: 2.5px solid #10b981;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.6), 0 2px 6px rgba(0,0,0,0.3);
      pointer-events: none;
      z-index: 9999999;
      transform: translate(-50%, -50%);
      transition: width 0.12s ease, height 0.12s ease, background 0.12s ease;
    `
    const dot = document.createElement('div')
    dot.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    `
    cursor.appendChild(dot)
    document.body.appendChild(cursor)

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    })
    window.addEventListener('mousedown', () => {
      cursor.style.width = '18px'
      cursor.style.height = '18px'
      cursor.style.background = 'rgba(16, 185, 129, 0.8)'
    })
    window.addEventListener('mouseup', () => {
      cursor.style.width = '24px'
      cursor.style.height = '24px'
      cursor.style.background = 'rgba(16, 185, 129, 0.4)'
    })
  })

  // Start cursor at center
  await page.mouse.move(720, 300, { steps: 10 })
  await page.waitForTimeout(800)

  // Initial Scene: Viral Sweep (Light -> Dark)
  console.log('Action: Play Viral Sweep')
  const playBtn = page.getByRole('button', { name: 'Play selected transition' })
  await smoothClick(page, playBtn)
  await page.waitForTimeout(2200)

  // Showcase 2: Glass Shatter (Dark -> Light)
  console.log('Action: Select Glass Shatter')
  const glassCard = page.locator('button[aria-label="Select Glass Shatter"]')
  await smoothClick(page, glassCard)
  await page.waitForTimeout(600)

  console.log('Action: Play Glass Shatter')
  await smoothClick(page, playBtn)
  await page.waitForTimeout(2200)

  // Showcase 3: Seaside Waves (Light -> Dark)
  console.log('Action: Select Seaside Waves')
  const waveCard = page.locator('button[aria-label="Select Seaside Waves"]')
  await smoothClick(page, waveCard)
  await page.waitForTimeout(600)

  console.log('Action: Play Seaside Waves')
  await smoothClick(page, playBtn)
  await page.waitForTimeout(2200)

  // Showcase 4: Bomb Drop (Dark -> Light)
  console.log('Action: Select Bomb Drop')
  const bombCard = page.locator('button[aria-label="Select Bomb Drop"]')
  await smoothClick(page, bombCard)
  await page.waitForTimeout(600)

  console.log('Action: Play Bomb Drop')
  await smoothClick(page, playBtn)
  await page.waitForTimeout(2200)

  // Showcase 5: Balloon Pop (Light -> Dark)
  console.log('Action: Select Balloon Pop')
  const balloonCard = page.locator('button[aria-label="Select Balloon Pop"]')
  await smoothClick(page, balloonCard)
  await page.waitForTimeout(600)

  console.log('Action: Play Balloon Pop')
  await smoothClick(page, playBtn)
  await page.waitForTimeout(2200)

  // Showcase 6: Party Confetti (Dark -> Light)
  console.log('Action: Select Party')
  const partyCard = page.locator('button[aria-label="Select Party"]')
  await smoothClick(page, partyCard)
  await page.waitForTimeout(600)

  console.log('Action: Play Party')
  await smoothClick(page, playBtn)
  await page.waitForTimeout(2200)

  // Showcase 7: Open Code Modal
  console.log('Action: Open Get the Code Dialog')
  const codeTrigger = page.locator('button:has-text("Get the code")')
  await smoothClick(page, codeTrigger)
  await page.waitForTimeout(1000)

  // Click TypeScript toggle in modal
  const tsBtn = page.locator('.code-dialog button:has-text("TypeScript")')
  if ((await tsBtn.count()) > 0) {
    await smoothClick(page, tsBtn)
    await page.waitForTimeout(800)
  }

  // Close modal
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1200)

  const video = page.video()
  const videoPath = await video.path()
  console.log('Video recording finished:', videoPath)

  await context.close()
  await browser.close()

  // Convert with ffmpeg
  const ffmpegExe = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe')
  const outputMp4 = path.resolve('assets/glowafter-demo.mp4')
  const outputGif = path.resolve('assets/glowafter-demo.gif')

  console.log('Encoding high-bitrate MP4 (1080p / 60fps)...')
  execSync(
    `"${ffmpegExe}" -y -i "${videoPath}" -c:v libx264 -pix_fmt yuv420p -preset slow -crf 18 -movflags +faststart "${outputMp4}"`,
    { stdio: 'inherit' }
  )
  console.log('MP4 ready:', outputMp4)

  console.log('Generating optimized GIF demo...')
  const palette = path.resolve('videos/cinematic-palette.png')
  execSync(
    `"${ffmpegExe}" -y -ss 0 -t 16 -i "${outputMp4}" -vf "fps=20,scale=840:-1:flags=lanczos,palettegen=stats_mode=diff" "${palette}"`,
    { stdio: 'inherit' }
  )
  execSync(
    `"${ffmpegExe}" -y -ss 0 -t 16 -i "${outputMp4}" -i "${palette}" -lavfi "fps=20,scale=840:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=4" "${outputGif}"`,
    { stdio: 'inherit' }
  )
  console.log('GIF ready:', outputGif)

  // Copy to example/public for web embedding
  fs.copyFileSync(outputMp4, path.resolve('example/public/glowafter-demo.mp4'))
  fs.copyFileSync(outputGif, path.resolve('example/public/glowafter-demo.gif'))
  console.log('Assets mirrored to example/public')
}

main().catch((err) => {
  console.error('Error in cinematic demo recorder:', err)
  process.exit(1)
})
