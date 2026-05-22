import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

export function prerenderPlugin(): Plugin {
  return {
    name: 'vite-plugin-prerender',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      const distDir = path.resolve('dist')
      const indexPath = path.join(distDir, 'index.html')

      if (!fs.existsSync(indexPath)) {
        console.warn('[prerender] dist/index.html not found, skipping prerender')
        return
      }

      let html = fs.readFileSync(indexPath, 'utf-8')

      const appContent = `
        <div id="app">
          <div class="min-h-screen bg-zinc-950 text-zinc-200">
            <div class="fixed inset-0 pointer-events-none overflow-hidden">
              <div style="position:absolute;top:-10rem;right:-10rem;width:24rem;height:24rem;background:rgba(16,185,129,0.1);border-radius:50%;filter:blur(64px)"></div>
              <div style="position:absolute;bottom:-10rem;left:-10rem;width:24rem;height:24rem;background:rgba(20,184,166,0.1);border-radius:50%;filter:blur(64px)"></div>
            </div>
            <div style="position:relative;max-width:64rem;margin:0 auto;padding:3rem 1.5rem">
              <header style="text-align:center;margin-bottom:3rem">
                <div style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.375rem 0.75rem;border-radius:9999px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);color:#34d399;font-size:0.75rem;font-weight:500;margin-bottom:1.5rem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  Free &amp; Secure
                </div>
                <h1 style="font-size:2.25rem;font-weight:700;letter-spacing:-0.025em;margin-bottom:1rem;line-height:1.2">
                  Compress Images <span style="color:#34d399">Without Losing Quality</span>
                </h1>
                <p style="color:#a1a1aa;font-size:1.125rem;max-width:36rem;margin:0 auto">
                  Compress JPEG, PNG, and WebP images right in your browser.
                  No uploads, no servers, 100% private.
                </p>
              </header>
              <main>
                <div style="width:100%;border-radius:1rem;border:2px dashed #3f3f46;padding:4rem 2rem;text-align:center;background:rgba(24,24,27,0.5)">
                  <div style="width:4rem;height:4rem;border-radius:1rem;background:#27272a;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </div>
                  <p style="font-size:1.125rem;font-weight:600;color:#e4e4e7">Drop your images here</p>
                </div>
              </main>
            </div>
          </div>
        </div>`

      html = html.replace('<div id="app"></div>', appContent)
      fs.writeFileSync(indexPath, html)
      console.log('[prerender] ✓ index.html prerendered successfully')
    },
  }
}