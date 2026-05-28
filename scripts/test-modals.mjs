import puppeteer from 'puppeteer';

const TIMESTAMP = Date.now();

const tests = [
  {
    name: 'Consulting',
    url: 'http://localhost:3001',
    triggerText: /^schedule a call/i,
    fields: {
      name: `UI Test Consulting ${TIMESTAMP}`,
      email: `ui+consulting+${TIMESTAMP}@journey.storage`,
      phone: '5551110000',
      company: 'UI Test Co',
    },
  },
  {
    name: 'Investors',
    url: 'http://localhost:3002',
    triggerText: /^book a call/i,
    fields: {
      name: `UI Test Investors ${TIMESTAMP}`,
      email: `ui+investors+${TIMESTAMP}@journey.storage`,
      phone: '5552220000',
      company: 'UI Test Fund',
    },
  },
];

async function findFirstVisibleByText(page, regex) {
  const handles = await page.$$('button, a');
  for (const h of handles) {
    const txt = await page.evaluate((el) => el.textContent || '', h);
    if (regex.test(txt.trim())) {
      const visible = await page.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }, h);
      if (visible) return h;
    }
  }
  return null;
}

async function runTest(browser, t) {
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);

  const apiResponses = [];
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/leads') || url.includes('/api/waitlist')) {
      let body = null;
      try { body = await res.json(); } catch {}
      apiResponses.push({ url, status: res.status(), body });
    }
  });

  console.log(`\n=== ${t.name} (${t.url}) ===`);
  await page.goto(t.url, { waitUntil: 'networkidle0' });

  // Open modal — try to find a button that opens it
  const trigger = await findFirstVisibleByText(page, t.triggerText);
  if (!trigger) {
    console.log(`❌ Could not find a trigger button matching ${t.triggerText}`);
    await page.close();
    return { name: t.name, ok: false, reason: 'no_trigger' };
  }
  await trigger.click();
  console.log('   modal trigger clicked');

  // Wait for the modal — name input should appear
  try {
    await page.waitForSelector('input[name="name"], input[placeholder*="full name" i]', { visible: true, timeout: 5000 });
  } catch {
    console.log('❌ Modal name input not visible after click');
    await page.close();
    return { name: t.name, ok: false, reason: 'modal_not_open' };
  }

  // Fill fields
  const fillIfPresent = async (selector, value) => {
    const el = await page.$(selector);
    if (el) await el.type(value, { delay: 10 });
  };
  await fillIfPresent('input[name="name"]', t.fields.name);
  await fillIfPresent('input[name="email"]', t.fields.email);
  await fillIfPresent('input[name="phone"]', t.fields.phone);
  await fillIfPresent('input[name="company"]', t.fields.company);

  // Investors-only: accredited dropdown + sms_opt_in
  const accreditedSel = await page.$('select[name="accredited_investor"]');
  if (accreditedSel) {
    await page.select('select[name="accredited_investor"]', 'yes');
    const smsCheckbox = await page.$('input[name="sms_opt_in"]');
    if (smsCheckbox) await smsCheckbox.click();
  }

  // Submit — find the submit button INSIDE the modal form
  const submit = await page.$('form button[type="submit"]');
  if (!submit) {
    console.log('❌ Submit button not found');
    await page.close();
    return { name: t.name, ok: false, reason: 'no_submit' };
  }
  await submit.click();
  console.log('   submit clicked, waiting for /api response...');

  // Wait briefly for the API call
  await new Promise((r) => setTimeout(r, 3000));

  await page.close();

  const apiCall = apiResponses.find((r) => r.url.includes('/api/leads') || r.url.includes('/api/waitlist'));
  if (!apiCall) {
    return { name: t.name, ok: false, reason: 'no_api_call', email: t.fields.email };
  }
  return {
    name: t.name,
    ok: apiCall.status === 200 && apiCall.body?.success === true,
    status: apiCall.status,
    body: apiCall.body,
    email: t.fields.email,
  };
}

const browser = await puppeteer.launch({ headless: true });
const results = [];
for (const t of tests) {
  results.push(await runTest(browser, t));
}
await browser.close();

console.log('\n\n=== SUMMARY ===');
for (const r of results) {
  if (r.ok) {
    console.log(`✅ ${r.name}: ${r.status} ${JSON.stringify(r.body)} (email: ${r.email})`);
  } else {
    console.log(`❌ ${r.name}: ${r.reason || 'failed'} ${r.status ?? ''} ${JSON.stringify(r.body || {})}`);
  }
}

const allOk = results.every((r) => r.ok);
process.exit(allOk ? 0 : 1);
