import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET() {
  try {
    const puppeteer = await import('puppeteer')
    const browser = await puppeteer.default.launch({ headless: true })
    const page = await browser.newPage()

    // Lower deviceScaleFactor reduces image weight significantly
    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 1 })

    // Use the print mode layout
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'
    await page.goto(`${baseUrl}/deck/granbury?mode=print`, {
      waitUntil: 'networkidle2',
      timeout: 20000,
    })

    // Scroll through all slides to load lazy images
    const slideCount = await page.evaluate(() =>
      document.querySelectorAll('.deck-print-page').length
    )

    for (let i = 0; i < slideCount; i++) {
      await page.evaluate((idx: number) => {
        document.querySelectorAll('.deck-print-page')[idx]?.scrollIntoView()
      }, i)
      await new Promise(r => setTimeout(r, 300))
    }

    await page.evaluate(() => window.scrollTo(0, 0))
    await new Promise(r => setTimeout(r, 2000))

    // Generate PDF
    const pdf = await page.pdf({
      width: '297mm',
      height: '210mm',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    await browser.close()

    const today = new Date().toISOString().slice(0, 10)
    const filename = `Journey.Direct_Granbury_Deck_${today}.pdf`

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json(
      { error: 'PDF generation failed. Make sure Puppeteer is available.' },
      { status: 500 }
    )
  }
}
