// SIMPLE Google Apps Script - Minimal CORS Issues
// Replace ALL your current code with this

const SHEET_ID = '1qGuz9AFOxRTu_aecXZh5hlUEs1XGk4VfB8PXB7DZiX4';
const SHEET_NAME = 'Contact Submissions';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      const headers = ['Date Added', 'Timestamp', 'Type', 'Name', 'Email', 'Subject', 'Message', 'User Agent', 'Page URL', 'Referrer'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4').setFontColor('white').setFontWeight('bold');
    }
    
    const rowData = [
      new Date(),
      data.timestamp || new Date().toISOString(),
      data.type || 'contact',
      data.name || '',
      data.email || '',
      data.subject || '',
      data.message || '',
      data.userAgent || '',
      data.pageUrl || '',
      data.referrer || 'Direct'
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'QuickSideTool Contact Form API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

// Test function
function testSetup() {
  const testData = {
    type: 'test',
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test',
    message: 'Test message'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
} 