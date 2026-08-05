// Client-side text extraction for the context libraries. Excel, PDF, and
// Word parsing load on demand from CDNs (nothing added to the bundle);
// plain-text formats read directly. Scanned/image-only PDFs have no text
// layer and will come back empty — that's expected, not a bug.

const SHEETJS_URL = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs'
const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs'
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs'
const MAMMOTH_URL = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js'

export const EXTRACTABLE_ACCEPT = '.txt,.md,.csv,.json,.html,.xlsx,.xls,.pdf,.docx'
export const EXTRACTABLE_LABEL = '.xlsx, .pdf, .docx, .csv, .txt, .md'

const TEXT_EXTENSIONS = ['txt', 'md', 'csv', 'json', 'html']

// webpackIgnore keeps the bundler from trying to resolve the CDN URL at
// build time — this must stay a genuine runtime dynamic import.
async function importRemote(url: string): Promise<Record<string, unknown>> {
  return (await import(/* webpackIgnore: true */ url)) as Record<string, unknown>
}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = url
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`failed to load ${url}`))
    document.head.appendChild(s)
  })
}

async function extractXlsx(file: File): Promise<string> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const XLSX = (await importRemote(SHEETJS_URL)) as any
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' })
  return wb.SheetNames.map(
    (name: string) => `## Sheet: ${name}\n${XLSX.utils.sheet_to_csv(wb.Sheets[name])}`,
  ).join('\n\n')
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = (await importRemote(PDFJS_URL)) as any
  pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
  const pages: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((item: { str?: string }) => item.str ?? '').join(' '))
  }
  return pages.join('\n\n')
}

async function extractDocx(file: File): Promise<string> {
  await loadScript(MAMMOTH_URL)
  const mammoth = (window as any).mammoth
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return String(result.value ?? '')
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

// Returns extracted text, or null when the file is unreadable/empty.
export async function extractFileText(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  try {
    let text: string
    if (TEXT_EXTENSIONS.includes(ext)) text = await file.text()
    else if (ext === 'xlsx' || ext === 'xls') text = await extractXlsx(file)
    else if (ext === 'pdf') text = await extractPdf(file)
    else if (ext === 'docx') text = await extractDocx(file)
    else text = await file.text()
    return text.trim() ? text : null
  } catch {
    return null
  }
}
