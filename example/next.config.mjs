import path from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // On Vercel or custom domain, serve directly at root (/); on GitHub Pages, use repository subpath
  basePath: process.env.GITHUB_PAGES ? '/react-theme-switch-animation' : '',
  // The example imports the library from ../src, so the workspace root is the repo root
  turbopack: {
    root: path.join(import.meta.dirname, '..'),
  },
}

export default nextConfig
