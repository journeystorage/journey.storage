# Wiring the intake form to a Google Sheet

The page can't create the Sheet or deploy the script for you — that has to
happen under your own Google account so the Sheet and its files end up in
your (Journey's) Drive, not anywhere Claude can reach. This takes about
five minutes.

1. **Create the Sheet.** In your Journey Google Drive, create a new blank
   Google Sheet. Name it whatever you want — e.g. "Accounting Intake —
   Submissions". The script below creates its own `Submissions` tab and
   header row automatically the first time it runs, so you don't need to
   set anything up inside the sheet itself.

2. **Add the script.** In the Sheet, go to **Extensions → Apps Script**.
   Delete the placeholder `myFunction` code and paste in the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs). Save (⌘S).

3. **Deploy it as a Web App.** Click **Deploy → New deployment**. For
   "Select type" choose **Web app**. Set:
   - Execute as: **Me**
   - Who has access: **Anyone within Journey Capital Holdings, LLC**

   Click **Deploy**. The first time, Google will ask you to authorize the
   script's access to Sheets and Drive — approve it under your own account;
   that's what makes it run as you and create files inside your Drive.

   > **Why not "Anyone"?** Our Workspace blocks public Apps Script web apps.
   > The access dropdown only offers *Only myself*, *Anyone within Journey
   > Capital Holdings, LLC*, and *Anyone with Google account*. There is no
   > plain "Anyone" option to pick.
   >
   > **This means the page is not actually open to the public**, despite the
   > "no login yet" framing in the header. A submitter must already be signed
   > into a journey.storage Google account in the same browser. An outside
   > vendor cannot submit. To change that, an admin has to enable public web
   > app publishing in the Workspace Admin console, or the intake has to move
   > to a real backend.

4. **Copy the Web App URL** it gives you (ends in `/exec`). If you don't have
   a `config.js` yet (it's gitignored, so a fresh clone won't have one), copy
   the template first: `cp config.example.js config.js`. Then paste the URL
   into [`config.js`](config.js) as `SHEETS_WEBAPP_URL`.

   `config.js` stays out of git on purpose: that `/exec` URL is a write
   endpoint, and anyone holding it can append rows to the Sheet and put files
   in the Drive folder.

5. **Test it.** Open the intake page, submit a test invoice, and check the
   Sheet — a new row (and a file link in the "Invoice File" column) should
   appear within a couple seconds.

## If you change the script later

Every edit to `Code.gs` needs a **new deployment version** to go live —
Deploy → Manage deployments → edit (pencil icon) → New version. Just saving
the script isn't enough; the existing `/exec` URL keeps serving whatever
version was live when it was deployed.

## Reordering columns in the sheet

Safe to do — the script writes each value by matching the column's header
text (`doPost` reads row 1 and looks up each field by name), not by fixed
position. Drag columns around freely; new submissions will keep landing
under the right header.

What's **not** safe: renaming a header to something the script doesn't
recognize, or adding a new column with no matching field — those columns
just stay blank on new rows. The recognized headers are exactly: Timestamp,
Vendor, Entity, Date, Amount, Kind, Status, Description, Comments, Submitted
By, Invoice File, Wire File (case- and spacing-sensitive).

If you already reordered columns under the *old* version of the script,
rows submitted in between will still be misaligned — this fix only
prevents new rows from breaking, it doesn't repair ones already written.
You'll need to fix those rows by hand.

## How the page submits, and why it isn't `fetch`

The page posts a hidden HTML form into a hidden iframe (`postViaForm` in
`index.html`) rather than calling `fetch`. This is not a style choice.

Because the deployment is scoped to the Workspace domain, the request has to
carry the submitter's Google session or Google rejects it. `fetch` defaults to
`credentials: 'same-origin'`, which sends no cookies on a cross-origin request,
so every `fetch` attempt was silently redirected to `accounts.google.com`
ServiceLogin and dropped. Adding `credentials: 'include'` does not fix it
either. A form POST is a real navigation and does carry the session.

Two consequences worth remembering:

- **The submitter must be signed into journey.storage in that browser.** A
  signed-out browser fails, and because the response is unreadable it fails
  silently.
- **Submission is still fire-and-forget.** The response lands cross-origin on
  `script.googleusercontent.com`, so the page cannot read it. The "Submitted"
  screen appears once the request leaves the browser, not once the row is
  written.

So when something looks wrong, check the Sheet directly, or the Apps Script
project's **Executions** log (left sidebar). A missing execution entry means
the request never reached the script, which is almost always an auth problem.
An entry marked Failed means it arrived and the script itself broke.

`Code.gs` accepts both shapes: `readPayload` reads `e.parameter.payload` for
form posts and falls back to the raw `e.postData.contents` body, so curl and
any future server-side caller still work.
