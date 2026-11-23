const path = require('node:path')
const fs = require('node:fs')
const { execSync } = require('node:child_process')

const ffmpegExe = path.resolve('node_modules/ffmpeg-static/ffmpeg.exe')
const inputWebm = path.resolve('videos/page@7395dc3c7a0a6bafe158fb1e266a5456.webm')
const outputMp4 = path.resolve('assets/glowafter-demo.mp4')
const outputGif = path.resolve('assets/glowafter-demo.gif')
const previewJpg = path.resolve('assets/glowafter-demo-preview.png')

console.log('Converting WebM to MP4...')
execSync(`"${ffmpegExe}" -y -i "${inputWebm}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 20 "${outputMp4}"`, {
  stdio: 'inherit',
})
console.log('MP4 created:', outputMp4)

console.log('Extracting highlight preview...')
execSync(`"${ffmpegExe}" -y -ss 00:00:04.500 -i "${outputMp4}" -frames:v 1 "${previewJpg}"`, { stdio: 'inherit' })

console.log('Generating high-quality GIF highlight (first 14s)...')
const palette = path.resolve('videos/palette.png')
execSync(
  `"${ffmpegExe}" -y -ss 0 -t 14 -i "${outputMp4}" -vf "fps=18,scale=800:-1:flags=lanczos,palettegen=stats_mode=diff" "${palette}"`,
  { stdio: 'inherit' }
)
execSync(
  `"${ffmpegExe}" -y -ss 0 -t 14 -i "${outputMp4}" -i "${palette}" -lavfi "fps=18,scale=800:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5" "${outputGif}"`,
  { stdio: 'inherit' }
)
console.log('GIF created:', outputGif)

// Copy to example/public
fs.copyFileSync(outputMp4, path.resolve('example/public/glowafter-demo.mp4'))
fs.copyFileSync(outputGif, path.resolve('example/public/glowafter-demo.gif'))
console.log('Assets copied to example/public')
