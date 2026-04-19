#!/usr/bin/env node
/**
 * Generate static PDF files for the Granbury pitch deck.
 *
 * Usage:   node apps/investors/scripts/generate-pdf.mjs
 * Requires: dev server running on port 3002 (npm run dev:investors)
 *
 * Output:
 *   apps/investors/public/deck/Journey.Direct_Granbury_Deck_dark.pdf
 *   apps/investors/public/deck/Journey.Direct_Granbury_Deck_light.pdf
 */

import puppeteer from 'puppeteer'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../public/deck')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002'

async function generatePdf(theme) {
  const label = theme.charAt(0).toUpperCase() + theme.slice(1)
  console.log(`\n  Generating ${label} PDF...`)

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 1 })

  await page.goto(`${BASE_URL}/deck/granbury?mode=print&theme=${theme}&auto=false`, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  })

  // Force all images to load eagerly (override Next.js lazy loading)
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'eager'
      if (img.dataset.src) img.src = img.dataset.src
    })
  })

  // Scroll through all slides to trigger any remaining lazy loads
  const slideCount = await page.evaluate(() =>
    document.querySelectorAll('.deck-print-page').length
  )
  console.log(`  Found ${slideCount} slides`)

  for (let i = 0; i < slideCount; i++) {
    await page.evaluate((idx) => {
      document.querySelectorAll('.deck-print-page')[idx]?.scrollIntoView()
    }, i)
    await new Promise(r => setTimeout(r, 500))
  }

  // Scroll back to top and wait for all images to fully load
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll('img'))
    await Promise.all(imgs.map(img =>
      img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r })
    ))
  })
  await new Promise(r => setTimeout(r, 3000))

  // Generate PDF — A4 landscape, zero margins
  const pdf = await page.pdf({
    width: '297mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  })

  await browser.close()

  const filename = `Journey.Direct_Granbury_Deck_${theme}.pdf`
  const filepath = path.join(outDir, filename)
  fs.writeFileSync(filepath, pdf)

  const sizeMB = (fs.statSync(filepath).size / 1024 / 1024).toFixed(2)
  console.log(`  Saved: ${filename} (${sizeMB} MB)`)
}

// Main
console.log('Deck PDF Generator')
console.log('==================')

fs.mkdirSync(outDir, { recursive: true })

await generatePdf('dark')
await generatePdf('light')

console.log('\nDone.\n')
