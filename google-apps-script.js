// ============================================================
// Google Apps Script — paste this into your Google Sheet's
// Extensions > Apps Script editor, then Deploy > Web App
// ============================================================
//
// SETUP STEPS:
// 1. Create a new Google Sheet
// 2. Rename the first sheet tab to "RSVPs" (or update SHEET_NAME below)
// 3. Add these headers in Row 1:
//    A: Timestamp | B: Guest Name | C: Age | D: Food Preference | E: Dietary Requirements
// 4. Go to Extensions > Apps Script
// 5. Paste this entire file, save it
// 6. Click Deploy > New Deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Copy the Web App URL and paste it into index.html (replace YOUR_GOOGLE_APPS_SCRIPT_URL)
//

const SHEET_NAME = 'AUS RSVPs';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' });

    data.guests.forEach(function(guest) {
      sheet.appendRow([
        timestamp,
        guest.name,
        guest.age,
        guest.food,
        guest.dietary || ''
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Required for CORS preflight (optional, but good to have)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'RSVP endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
