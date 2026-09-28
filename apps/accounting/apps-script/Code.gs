// ─────────────────────────────────────────────────────────────
//  JOURNEY.STORAGE — ACCOUNTING INTAKE — APPS SCRIPT BACKEND
//
//  Paste this file AND Index.html into Extensions → Apps Script on the
//  "Accounting Intake — Submissions" Sheet. See ../GOOGLE-SHEETS-SETUP.md.
//
//  The web app SERVES the intake page itself (doGet → Index.html), so the
//  page runs first-party on Google with the employee's own session. That is
//  what keeps it internal-only ("Anyone within Journey Capital Holdings")
//  without depending on third-party cookies, which is why the old
//  journey.storage-hosted page failed silently in Safari / Incognito.
//
//  Script Properties (Project Settings → Script Properties):
//    ANTHROPIC_API_KEY   required for the AI reader. Without it the page
//                        falls back to the basic PDF-text reader.
//
//  PERMISSIONS. The web app runs "as Me" (the deployer), so the page can
//  never ask an employee for a new permission — if the deployer's grant is
//  missing a scope the call just fails ("You do not have permission to call
//  UrlFetchApp.fetch"). Whenever that happens, or after pasting a version
//  that uses a new service: in the editor pick `authorize` in the function
//  dropdown, click Run, accept the consent screen, then Deploy → Manage
//  deployments → New version. appsscript.json (Project Settings → "Show
//  appsscript.json") lists the scopes explicitly so the prompt is complete.
// ─────────────────────────────────────────────────────────────

var SHEET_NAME = 'Submissions';
var FOLDER_NAME = 'Accounting Intake Files';
var HEADERS = ['Timestamp', 'Vendor', 'Entity', 'Date', 'Amount', 'Kind', 'Status', 'Description', 'Comments', 'Submitted By', 'Invoice File', 'Wire File'];

var CLAUDE_MODEL = 'claude-opus-5';
var CLAUDE_URL = 'https://api.anthropic.com/v1/messages';
var MAX_FILE_BYTES = 20 * 1024 * 1024; // per file, decoded

// ───── AUTHORIZE ─────
// Run this ONCE from the editor (Run ▸ authorize) as the deploying account.
// It touches every service the web app uses so Google shows one consent
// screen covering Sheets, Drive, the Claude call and the session email.
function authorize() {
  getOrCreateSheet().getName();
  getOrCreateFolder(FOLDER_NAME).getName();
  Session.getActiveUser().getEmail();
  var r = UrlFetchApp.fetch(CLAUDE_URL, { method: 'get', muteHttpExceptions: true });
  Logger.log('Authorized. Claude endpoint reachable (HTTP ' + r.getResponseCode() + '). AI key set: ' + (getApiKey_() ? 'yes' : 'NO'));
}

// ───── PAGE ─────
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Journey.storage — Accounting Intake')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

// Called once on page load. The email comes from the Google session, so
// "Submitted By" is filled in without the employee typing anything.
function getSession() {
  var email = '';
  try { email = Session.getActiveUser().getEmail() || ''; } catch (e) {}
  return { email: email, aiEnabled: !!getApiKey_() };
}

// ───── AI READER ─────
// fileObj = { filename, mimeType, base64 }. Returns
//   { ok:true, vendor, doc_date, amount, description, paid_status }
//   { ok:false, error }
function extractDocument(fileObj, kind) {
  try {
    var key = getApiKey_();
    if (!key) return { ok: false, error: 'AI reader is not configured (no ANTHROPIC_API_KEY).' };
    if (!fileObj || !fileObj.base64) return { ok: false, error: 'No file received.' };

    var block = documentBlock_(fileObj);
    if (!block) return { ok: false, error: 'Unsupported file type: ' + (fileObj.mimeType || 'unknown') + '. Use PDF, JPG, PNG, GIF or WebP.' };

    var isReceipt = kind === 'receipt';
    var instructions =
      'Read this ' + (isReceipt ? 'receipt or payment confirmation' : 'invoice or bill') + ' and extract the fields below.\n' +
      '- vendor: the business that issued the document and is being paid. Never "Journey Storage", "Journey Capital Holdings" or one of its entities unless the document is clearly issued BY them. Use the legal or trading name as printed, without addresses.\n' +
      '- doc_date: the invoice/receipt date as YYYY-MM-DD. Empty string if not printed.\n' +
      '- amount: ' + (isReceipt ? 'the amount actually paid' : 'the total due / amount payable') + ' as a plain number with two decimals and no currency symbol, e.g. "1234.56". Empty string if not printed.\n' +
      '- description: one line, at most 90 characters, in plain English, saying what was billed (the service or goods, and the period or property if stated). No amounts, no dates, no invoice numbers.\n' +
      '- paid_status: "paid" if the document itself says it is paid, a receipt, or shows a zero balance; "unpaid" if it shows an amount due; otherwise "unknown".\n' +
      'If the document is unreadable, return empty strings and paid_status "unknown".';

    var schema = {
      type: 'object',
      additionalProperties: false,
      required: ['vendor', 'doc_date', 'amount', 'description', 'paid_status'],
      properties: {
        vendor: { type: 'string' },
        doc_date: { type: 'string' },
        amount: { type: 'string' },
        description: { type: 'string' },
        paid_status: { type: 'string', enum: ['paid', 'unpaid', 'unknown'] }
      }
    };

    var body = {
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      fallbacks: 'default',
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: schema } },
      system: 'You are an accounts-payable assistant for Journey Storage, a self-storage operator in Texas. You extract structured fields from vendor invoices and receipts accurately and conservatively. Never invent values that are not on the document.',
      messages: [{ role: 'user', content: [block, { type: 'text', text: instructions }] }]
    };

    var resp = UrlFetchApp.fetch(CLAUDE_URL, {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'server-side-fallback-2026-07-01'
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });

    var code = resp.getResponseCode();
    var text = resp.getContentText();
    var json;
    try { json = JSON.parse(text); } catch (e) { json = null; }

    if (code !== 200) {
      var msg = (json && json.error && json.error.message) ? json.error.message : ('HTTP ' + code);
      Logger.log('Claude API error: ' + msg);
      return { ok: false, error: 'AI reader failed: ' + msg };
    }
    if (json.stop_reason === 'refusal') {
      return { ok: false, error: 'AI reader declined to read this document.' };
    }
    var out = '';
    (json.content || []).forEach(function (b) { if (b.type === 'text') out += b.text; });
    var data = JSON.parse(out);
    return {
      ok: true,
      vendor: String(data.vendor || '').slice(0, 80),
      doc_date: normalizeDate_(data.doc_date),
      amount: normalizeAmount_(data.amount),
      description: String(data.description || '').replace(/\s+/g, ' ').trim().slice(0, 90),
      paid_status: data.paid_status || 'unknown',
      model: json.model || CLAUDE_MODEL
    };
  } catch (err) {
    Logger.log('extractDocument failed: ' + err);
    return { ok: false, error: 'AI reader failed: ' + String(err) };
  }
}

function documentBlock_(fileObj) {
  var mime = String(fileObj.mimeType || '').toLowerCase();
  var name = String(fileObj.filename || '').toLowerCase();
  if (mime === 'application/pdf' || /\.pdf$/.test(name)) {
    return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: fileObj.base64 } };
  }
  if (mime === 'image/jpg') mime = 'image/jpeg';
  if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].indexOf(mime) !== -1) {
    return { type: 'image', source: { type: 'base64', media_type: mime, data: fileObj.base64 } };
  }
  return null;
}

// ───── SUBMIT ─────
// payload = { vendor, entity, doc_date, amount, kind, status, descr, comments,
//             submitted_by, file:{filename,mimeType,base64}, wireFile? }
// Returns { ok:true, row } or throws (google.script.run failure handler).
function submitIntake(payload) {
  if (!payload) throw new Error('Nothing was submitted.');
  ['vendor', 'entity', 'doc_date', 'amount', 'status', 'descr'].forEach(function (k) {
    if (!payload[k] || !String(payload[k]).trim()) throw new Error('Missing required field: ' + k);
  });
  if (!payload.file || !payload.file.base64) throw new Error('The invoice or receipt file is missing.');

  var email = '';
  try { email = Session.getActiveUser().getEmail() || ''; } catch (e) {}

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getOrCreateSheet();
    var folder = getOrCreateFolder(FOLDER_NAME);

    var invoiceLink = saveFile(folder, payload.file);
    var wireLink = payload.wireFile && payload.wireFile.base64 ? saveFile(folder, payload.wireFile) : '';

    var values = {
      'Timestamp': new Date(),
      'Vendor': payload.vendor || '',
      'Entity': payload.entity || '',
      'Date': payload.doc_date || '',
      'Amount': payload.amount || '',
      'Kind': payload.kind || '',
      'Status': payload.status || '',
      'Description': payload.descr || '',
      'Comments': payload.comments || '',
      'Submitted By': email || payload.submitted_by || '',
      'Invoice File': invoiceLink,
      'Wire File': wireLink
    };

    // Values by header NAME, not position — reordering columns is safe.
    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headerRow.map(function (h) {
      return Object.prototype.hasOwnProperty.call(values, h) ? values[h] : '';
    });
    sheet.appendRow(row);
    return { ok: true, row: sheet.getLastRow(), submitted_by: values['Submitted By'] };
  } finally {
    lock.releaseLock();
  }
}

// Legacy entry point: the old journey.storage-hosted page posted a form
// here. Kept so curl / server-side callers still work. Same row logic.
function doPost(e) {
  try {
    var data = JSON.parse(readPayload(e));
    var res = submitIntake(data);
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
function readPayload(e) {
  if (e && e.parameter && e.parameter.payload) return e.parameter.payload;
  if (e && e.postData && e.postData.contents) return e.postData.contents;
  throw new Error('No payload in request');
}

// ───── HELPERS ─────
function getApiKey_() {
  return PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY') || '';
}
function normalizeDate_(s) {
  s = String(s || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  var d = new Date(s);
  if (isNaN(d)) return '';
  return Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd');
}
function normalizeAmount_(s) {
  var n = parseFloat(String(s == null ? '' : s).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? '' : n.toFixed(2);
}
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}
// Files are shared to the Workspace domain only (anyone at journey.storage
// with the link), not to the public — the intake is internal-only now.
function saveFile(folder, fileObj) {
  var bytes = Utilities.base64Decode(fileObj.base64);
  if (bytes.length > MAX_FILE_BYTES) throw new Error('File is too large (' + Math.round(bytes.length / 1048576) + ' MB). Limit is 20 MB.');
  var blob = Utilities.newBlob(bytes, fileObj.mimeType || 'application/octet-stream', fileObj.filename || 'file');
  var file = folder.createFile(blob);
  try { file.setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW); }
  catch (e) { file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW); }
  return file.getUrl();
}
