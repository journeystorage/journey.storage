import puppeteer from 'puppeteer'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '..', 'screenshots')
mkdirSync(outDir, { recursive: true })

const url = process.argv[2] || 'http://localhost:3000'
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })
  const page = await browser.newPage()

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 })
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    await page.waitForSelector('main', { timeout: 10000 })

    // Full page screenshot
    const fullPath = `${outDir}/${timestamp}_${vp.name}_full.png`
    await page.screenshot({ path: fullPath, fullPage: true })
    console.log(`  ${vp.name} (full): ${fullPath}`)

    // Above-the-fold screenshot
    const foldPath = `${outDir}/${timestamp}_${vp.name}_fold.png`
    await page.screenshot({ path: foldPath })
    console.log(`  ${vp.name} (fold): ${foldPath}`)
  }

  await browser.close()
  console.log('\nDone.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
