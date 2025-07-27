// Google Apps Script for QuickSideTool Contact Form - COMPLETE UPDATED VERSION
// Deploy this script and use the web app URL in your googleSheets.js file

// Replace this with your Google Sheet ID
const SHEET_ID = '1qGuz9AFOxRTu_aecXZh5hlUEs1XGk4VfB8PXB7DZiX4';

// Sheet name where data will be stored
const SHEET_NAME = 'Contact Submissions';

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      createSheet(spreadsheet);
      sheet = spreadsheet.getSheetByName(SHEET_NAME);
    }
    
    // Prepare the row data
    const rowData = [
      new Date(), // Timestamp
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
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Send success response with CORS headers - FIXED SYNTAX
    const response = ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data submitted successfully'
    }));
    response.setMimeType(ContentService.MimeType.JSON);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Send error response with CORS headers - FIXED SYNTAX
    const response = ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }));
    response.setMimeType(ContentService.MimeType.JSON);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
  }
}

// Handle CORS preflight requests - FIXED SYNTAX
function doOptions(e) {
  const response = ContentService.createTextOutput('');
  response.setMimeType(ContentService.MimeType.TEXT);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Max-Age', '86400');
  
  return response;
}

// Handle GET requests (for testing) - FIXED SYNTAX
function doGet(e) {
  const response = ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'QuickSideTool Contact Form API is running'
  }));
  response.setMimeType(ContentService.MimeType.JSON);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}

function createSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(SHEET_NAME);
  
  // Set up headers
  const headers = [
    'Date Added',
    'Timestamp',
    'Type',
    'Name',
    'Email',
    'Subject',
    'Message',
    'User Agent',
    'Page URL',
    'Referrer'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#4285f4')
    .setFontColor('white')
    .setFontWeight('bold');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Add some basic formatting
  sheet.getRange(1, 1, sheet.getMaxRows(), headers.length)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left');
  
  // Format date columns
  sheet.getRange(1, 1, sheet.getMaxRows(), 1).setNumberFormat('MM/dd/yyyy HH:mm:ss');
  sheet.getRange(1, 2, sheet.getMaxRows(), 1).setNumberFormat('MM/dd/yyyy HH:mm:ss');
}

// Optional: Function to test the setup
function testSetup() {
  const testData = {
    type: 'test',
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Submission',
    message: 'This is a test submission',
    timestamp: new Date().toISOString(),
    userAgent: 'Test User Agent',
    pageUrl: 'https://quicksidetool.com/contact',
    referrer: 'Direct'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}

// Instructions for setup:
/*
1. Go to https://script.google.com/
2. Find your project with URL: AKfycbyhoAfPnmPdUeKl-h0gXsfuzO7KMwv2Y1yWP-pZTUk5gzDQ7k4o_sGGEVxrTeF8tX9JKg
3. Replace ALL the code with this COMPLETE UPDATED version
4. Save the project (Ctrl+S)
5. Deploy > Manage deployments > New version
6. Set "Execute as" to "Me" and "Who has access" to "Anyone"
7. Deploy and test

The main fixes in this version:
- Fixed CORS header syntax (no more chaining)
- Proper error handling
- Automatic sheet creation with correct headers
- All required functions (doGet, doPost, doOptions)

Your Google Sheet will automatically get a "Contact Submissions" sheet with these columns:
- Date Added: When the entry was added to the sheet
- Timestamp: When the form was submitted
- Type: Type of submission (contact, feature-request, bug-report, feedback)
- Name: User's name
- Email: User's email
- Subject: Message subject
- Message: Full message content
- User Agent: Browser information
- Page URL: Page where form was submitted
- Referrer: How user got to the page
*/ 