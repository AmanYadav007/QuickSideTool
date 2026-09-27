/**
 * Receives the website's Contact and Support forms (src/constants/links.js,
 * FORM_ENDPOINT), saves each message as a row in this spreadsheet and emails
 * you a copy you can reply to directly.
 *
 * Setup (about 3 minutes):
 *  1. Create a Google Sheet, then Extensions > Apps Script.
 *  2. Replace the code with this file and Save.
 *  3. Deploy > New deployment > type "Web app":
 *       Execute as: Me
 *       Who has access: Anyone        <- required, or every visitor gets "access denied"
 *     Authorize when asked (it needs the sheet and "send email as you").
 *  4. Copy the Web app URL into FORM_ENDPOINT (or set REACT_APP_FORM_ENDPOINT
 *     in Vercel) and redeploy the site.
 * After editing this code later: Deploy > Manage deployments > Edit > Version:
 * New version, so the same URL keeps working.
 */

const SHEET_NAME = "Messages";
const EMAIL_COPY = true; // set to false to only save to the sheet
const MAX_FIELD = 5000;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const field = (key) => String(data[key] || "").slice(0, MAX_FIELD);
    if (field("website")) return reply({ result: "success" }); // spam trap

    const form = field("form") || "contact";
    const row = [new Date(), form, field("topic"), field("tool"), field("name"), field("email"), field("message"), field("details")];
    sheet().appendRow(row);

    if (EMAIL_COPY) {
      const email = field("email");
      MailApp.sendEmail({
        to: Session.getEffectiveUser().getEmail(),
        replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
        subject: `[${form}] ${field("topic") || "New message"}${field("tool") ? " - " + field("tool") : ""}`,
        body: `From: ${field("name") || "(no name)"} <${email}>\n\n${field("message")}`,
      });
    }
    return reply({ result: "success" });
  } catch (error) {
    return reply({ result: "error", error: String(error) });
  }
}

function sheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let tab = book.getSheetByName(SHEET_NAME);
  if (!tab) {
    tab = book.insertSheet(SHEET_NAME);
    tab.appendRow(["Received", "Form", "Topic", "Tool", "Name", "Email", "Message", "Technical details"]);
    tab.setFrozenRows(1);
  }
  return tab;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
