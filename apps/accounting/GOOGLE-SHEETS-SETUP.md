# Accounting Intake — how it is wired, and how to deploy a change

The intake page is **served by Google Apps Script**, from the script project
attached to the Sheet **"Accounting Intake — Submissions"**. Employees open
`https://journey.storage/portal/`, which forwards them to the script's Web App
URL. Google's own sign-in gate keeps it internal: only `@journey.storage`
accounts can open it, and each submission records who sent it.

Two files live in the script project, both kept here under `apps-script/`:

| File | Role |
|---|---|
| `Code.gs` | `doGet` serves the page; `getSession` returns the signed-in email; `extractDocument` sends the PDF/image to Claude and returns vendor/date/total/description; `submitIntake` saves the files to Drive and appends the row. |
| `Index.html` | The page itself. Talks to the functions above through `google.script.run`, so every call carries the employee's session and gets a real success or failure back. |

`config.js` (gitignored, written from the `ACCOUNTING_SHEETS_WEBAPP_URL`
repo secret on deploy) holds only the Web App URL the redirect points at.

## Why it moved inside Google (Sept 2026)

The previous version was a page on journey.storage that posted into a hidden
iframe on script.google.com. Because the Web App is scoped to the Workspace
domain, that request only worked if the browser attached the Google session
cookie to a **third-party** request. Safari never does, Chrome Incognito and
"block third-party cookies" don't either, and a signed-out browser can't. In
all those cases Google answered 401 and the page still showed "Submitted".
Serving the page from the script makes it first-party, which removes the
cookie dependency, and lets the page read the response.

## First-time setup (or moving to a new Sheet)

1. Open the Sheet → **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with [`apps-script/Code.gs`](apps-script/Code.gs).
3. **+ → HTML**, name it exactly `Index` (Google adds `.html`), paste
   [`apps-script/Index.html`](apps-script/Index.html) over the placeholder.
4. **Project Settings (gear) → Script Properties → Add property**:
   `ANTHROPIC_API_KEY` = your Anthropic API key. This is what powers the
   reader. Without it the page still works, but falls back to the basic
   PDF-text reader and says so under the file name.
5. **Deploy → New deployment → Web app.**
   - Execute as: **Me**
   - Who has access: **Anyone within Journey Capital Holdings, LLC**

   Authorize when prompted (Sheets, Drive and "connect to an external
   service" for the Claude call). Copy the `/exec` URL.
6. Put that URL in the repo secret `ACCOUNTING_SHEETS_WEBAPP_URL` (and in
   your local `config.js`), then run the **Deploy Accounting Intake** workflow
   from the Actions tab so `journey.storage/portal` forwards to it.

## Updating an existing deployment (the usual case)

1. Paste the new `Code.gs`, `Index.html` and (if it changed) `appsscript.json`
   over the old ones and save.
2. **Deploy → Manage deployments → pencil → Version: New version → Deploy.**
   Saving alone is not enough: the `/exec` URL serves whatever version was
   live when it was deployed. Keeping the same deployment keeps the same URL,
   so `config.js` and the redirect need no change.
3. If a change adds a new permission (for example the first time the Claude
   call ships), the deploying account has to grant it **from the editor**,
   not from the page. The web app runs "as Me", so the page never asks anyone
   for consent: it just fails, and the status line under the file name reads
   *"You do not have permission to call UrlFetchApp.fetch"*. To fix it:
   in the script editor pick **`authorize`** in the function dropdown, click
   **Run**, accept the consent screen (Sheets, Drive, "connect to an external
   service", email), then do step 2 again so a new version goes live.
   `appsscript.json` (Project Settings → **Show "appsscript.json" manifest
   file in editor**) lists the scopes explicitly; paste it too if the editor
   copy differs.

## Checking that it works

Open `journey.storage/portal` in the browser you actually use, drop a real
invoice, and confirm three things: the top-right shows **Signed in as
you@journey.storage**, the status under the file name says **Claude filled
in …**, and after Submit the green screen names a **row number**. Open the
`Submissions` tab and the "Accounting Intake Files" Drive folder to see the
row and the file.

If something fails you now see it: a red "Not saved" message means nothing
was recorded. For details open the script project's **Executions** log in
the left sidebar, which lists every call with its error.

## Notes for maintainers

- **Columns can be reordered.** Rows are written by header name, not by
  position. Recognised headers: Timestamp, Vendor, Entity, Date, Amount,
  Kind, Status, Description, Comments, Submitted By, Invoice File, Wire File.
  Extra columns such as "Notes" are left blank on new rows and never touched.
- **Files are shared to the domain only** (anyone at journey.storage with the
  link can view), not publicly.
- **Reader model:** `claude-opus-5` with structured JSON output, effort
  `medium`, refusal fallbacks enabled. Images are downscaled to 2000px JPEG
  in the browser before they are sent to the reader; the original file is
  what gets archived in Drive. Per-file limit is 20 MB.
- **The old form-POST entry point (`doPost`) still exists** for curl or a
  future server-side caller; the page itself no longer uses it.
- `serve.py` still serves this folder locally, but `Index.html` needs the
  `google.script.run` bridge, so it only runs for real from the Apps Script
  URL. Use the script editor's **Deploy → Test deployments** for a live
  preview of unsaved-version changes.
