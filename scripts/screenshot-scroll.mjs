import puppeteer from 'puppeteer'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '..', 'screenshots')
mkdirSync(outDir, { recursive: true })

const url = process.argv[2] || 'http://localhost:3000'
const scrollY = parseInt(process.argv[3] || '800', 10)
const label = process.argv[4] || 'scroll'
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

async function run() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await page.evaluate((y) => window.scrollTo(0, y), scrollY)
  await new Promise(r => setTimeout(r, 500))
  const path = `${outDir}/${timestamp}_${label}.png`
  await page.screenshot({ path })
  console.log(`Screenshot saved: ${path}`)
  await browser.close()
}

run().catch((err) => { console.error(err); process.exit(1) })
