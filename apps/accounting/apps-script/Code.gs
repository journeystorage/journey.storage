// Paste this into Extensions → Apps Script on the Google Sheet you want
// submissions to land in. See ../GOOGLE-SHEETS-SETUP.md for the full setup.

var SHEET_NAME = 'Submissions';
var FOLDER_NAME = 'Accounting Intake Files';
var HEADERS = ['Timestamp', 'Vendor', 'Entity', 'Date', 'Amount', 'Kind', 'Status', 'Description', 'Comments', 'Submitted By', 'Invoice File', 'Wire File'];

function doPost(e) {
  try {
    var data = JSON.parse(readPayload(e));
    var sheet = getOrCreateSheet();
    var folder = getOrCreateFolder(FOLDER_NAME);

    var invoiceLink = data.file ? saveFile(folder, data.file) : '';
    var wireLink = data.wireFile ? saveFile(folder, data.wireFile) : '';

    // Values by header NAME, not position — so reordering (or even
    // deleting) columns in the sheet doesn't misalign future rows.
    // Only the header text has to match; case and spacing count.
    var values = {
      'Timestamp': new Date(),
      'Vendor': data.vendor || '',
      'Entity': data.entity || '',
      'Date': data.doc_date || '',
      'Amount': data.amount || '',
      'Kind': data.kind || '',
      'Status': data.status || '',
      'Description': data.descr || '',
      'Comments': data.comments || '',
      'Submitted By': data.submitted_by || '',
      'Invoice File': invoiceLink,
      'Wire File': wireLink
    };

    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = headerRow.map(function (h) {
      return Object.prototype.hasOwnProperty.call(values, h) ? values[h] : '';
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// The page submits as a real form POST (see index.html), because this
// deployment is scoped to the Workspace domain and a fetch() request carries
// no Google session cookies cross-origin. A form POST arrives urlencoded, so
// the JSON shows up in e.parameter.payload rather than as the raw body.
// Raw-JSON bodies are still accepted so curl and any future server-side
// caller keep working unchanged.
function readPayload(e) {
  if (e && e.parameter && e.parameter.payload) return e.parameter.payload;
  if (e && e.postData && e.postData.contents) return e.postData.contents;
  throw new Error('No payload in request');
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

// Files are shared "anyone with the link can view" so a link pasted into the
// sheet actually opens for whoever's reviewing it — same tradeoff as any
// no-login intake form. Tighten this once the page has real auth.
function saveFile(folder, fileObj) {
  var bytes = Utilities.base64Decode(fileObj.base64);
  var blob = Utilities.newBlob(bytes, fileObj.mimeType || 'application/octet-stream', fileObj.filename || 'file');
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}
