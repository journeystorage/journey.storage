import puppeteer from 'puppeteer'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '..', 'screenshots')
mkdirSync(outDir, { recursive: true })

const url = process.argv[2] || 'http://localhost:3000'
const selector = process.argv[3] || 'section'
const label = process.argv[4] || 'section'
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

async function run() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

  const element = await page.$(selector)
  if (!element) {
    console.error(`Selector "${selector}" not found`)
    await browser.close()
    process.exit(1)
  }

  const path = `${outDir}/${timestamp}_${label}.png`
  await element.screenshot({ path })
  console.log(`Screenshot saved: ${path}`)

  await browser.close()
}

run().catch((err) => { console.error(err); process.exit(1) })
