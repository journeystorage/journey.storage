import puppeteer from 'puppeteer';

const sites = [
  { name: 'Consulting', url: 'http://localhost:3001' },
  { name: 'Investors', url: 'http://localhost:3002' },
];

const browser = await puppeteer.launch({ headless: true });

for (const site of sites) {
  const page = await browser.newPage();
  await page.goto(site.url, { waitUntil: 'networkidle0' });
  console.log(`\n=== ${site.name} ===`);
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a'))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })
      .map((el) => ({
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 60),
        href: el.getAttribute('href') || null,
        type: el.getAttribute('type') || null,
      }))
      .filter((b) => b.text.length > 0);
  });
  for (const b of buttons) console.log(`  [${b.tag}${b.type ? ' type='+b.type : ''}${b.href ? ' href='+b.href : ''}] "${b.text}"`);
  await page.close();
}
await browser.close();
