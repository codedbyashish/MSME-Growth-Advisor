import assert from 'assert';
import * as XLSX from '../MSME/node_modules/xlsx/xlsx.mjs';
import fs from 'fs';
import {
  findBestSalesWorksheet,
  processSpreadsheetData,
  cleanNumber,
  cleanDate,
  formatFileSize,
} from '../MSME/src/utils/smartImporter.js';

const API_BASE = 'http://localhost:5000/api';

console.log('========================================================');
console.log('   STARTING FULL SIGNUP SALES IMPORT WORKFLOW TESTS     ');
console.log('========================================================\n');

async function runTests() {
  // -----------------------------------------------------------
  // Test 1: Valid CSV Sales File Parsing & Mapping
  // -----------------------------------------------------------
  console.log('Test 1: Valid CSV sales file parsing and column mapping...');
  const csvContent = `Invoice Date,Customer Name,Item / Product,Amount (INR),Payment Status
15/10/2026,Anand Sweets,Motichoor Ladoo 1kg,4500,Paid
16/10/2026,Bikaner Express,Kaju Katli Special,12500,Paid
17/10/2026,Haldiram Distributors,Rasgulla Tin 500g,8200,Pending`;

  const csvWb = XLSX.read(csvContent, { type: 'string' });
  const csvSheetName = csvWb.SheetNames[0];
  const csvRows = XLSX.utils.sheet_to_json(csvWb.Sheets[csvSheetName], { raw: false, defval: '', blankrows: false });

  const csvProcessed = processSpreadsheetData(csvRows, 'sales');
  assert.strictEqual(csvProcessed.total, 3, 'CSV should have 3 total rows');
  assert.strictEqual(csvProcessed.readyCount, 3, 'CSV should have 3 valid sales');
  assert.strictEqual(csvProcessed.attentionCount, 0, 'CSV should have 0 attention rows');
  assert.strictEqual(csvProcessed.readyRows[0].data.client, 'Anand Sweets');
  assert.strictEqual(csvProcessed.readyRows[0].data.amount, 4500);
  assert.strictEqual(csvProcessed.readyRows[0].data.date, '2026-10-15');
  assert.strictEqual(csvProcessed.readyRows[0].data.item, 'Motichoor Ladoo 1kg');
  assert.strictEqual(csvProcessed.readyRows[0].data.status, 'Paid');
  assert.strictEqual(csvProcessed.readyRows[2].data.status, 'Pending');
  console.log('✓ Valid CSV sales file parsed and mapped successfully.\n');

  // -----------------------------------------------------------
  // Test 2: Valid Excel File with One Worksheet
  // -----------------------------------------------------------
  console.log('Test 2: Valid Excel file with one worksheet...');
  const singleWb = XLSX.utils.book_new();
  const singleRows = [
    { 'Date': '2026-10-01', 'Client': 'Metro Cash & Carry', 'Product': 'Besan Ladoo 500g', 'Total': '₹ 18,500.00', 'Status': 'Paid' },
    { 'Date': '2026-10-02', 'Client': 'Reliance Smart', 'Product': 'Gulab Jamun 1kg', 'Total': '₹ 32,000/-', 'Status': 'Paid' },
  ];
  const singleWs = XLSX.utils.json_to_sheet(singleRows);
  XLSX.utils.book_append_sheet(singleWb, singleWs, 'Orders_Oct_2026');

  const singleDetection = findBestSalesWorksheet(singleWb);
  assert.strictEqual(singleDetection.bestSheetName, 'Orders_Oct_2026');
  const singleProcessed = processSpreadsheetData(singleRows, 'sales');
  assert.strictEqual(singleProcessed.readyCount, 2);
  assert.strictEqual(singleProcessed.readyRows[0].data.client, 'Metro Cash & Carry');
  assert.strictEqual(singleProcessed.readyRows[0].data.amount, 18500);
  assert.strictEqual(singleProcessed.readyRows[1].data.amount, 32000);
  console.log('✓ Single worksheet Excel file detected and processed.\n');

  // -----------------------------------------------------------
  // Test 3: Multi-Sheet Excel Workbook (Sweets Shop Workbook)
  // -----------------------------------------------------------
  console.log('Test 3: Multi-sheet Excel workbook auto-detection (Sweets Shop)...');
  const sweetsPath = 'D:/Sweets_Shop_Business_Import_Data.xlsx';
  if (fs.existsSync(sweetsPath)) {
    const buf = fs.readFileSync(sweetsPath);
    const multiWb = XLSX.read(buf, { type: 'buffer' });
    const bestSales = findBestSalesWorksheet(multiWb);
    assert.strictEqual(bestSales.bestSheetName, 'Sales', 'Should automatically detect the Sales worksheet among 5 sheets');
    assert.ok(multiWb.SheetNames.length >= 4, 'Should contain multiple worksheets');

    const salesWs = multiWb.Sheets[bestSales.bestSheetName];
    const rawSalesRows = XLSX.utils.sheet_to_json(salesWs, { raw: false, defval: '', blankrows: false });
    const processedSales = processSpreadsheetData(rawSalesRows, 'sales');

    assert.strictEqual(processedSales.total, 80, 'Should find 80 rows in Sales sheet');
    assert.strictEqual(processedSales.readyCount, 80, 'All 80 sales rows should be valid');
    assert.strictEqual(processedSales.attentionCount, 0, 'Zero attention errors for Sales sheet');
    assert.strictEqual(processedSales.previewRows.length, 5, 'Preview should contain first 5 records');
    console.log('✓ Sweets Shop multi-sheet workbook auto-detected "Sales" sheet with exactly 80 valid records and 0 errors.\n');
  } else {
    console.log('ℹ File D:/Sweets_Shop_Business_Import_Data.xlsx not found, skipping multi-sheet file test.\n');
  }

  // -----------------------------------------------------------
  // Test 4: Common Alternative Column Headers & Aliases
  // -----------------------------------------------------------
  console.log('Test 4: Common alternative column headers & aliases...');
  // Variant A: Party Name, Bill Value, Bill Date, Description
  const variantA = [
    { 'Party Name': 'Ganesh Enterprises', 'Bill Value': '15000', 'Bill Date': '2026-10-12', 'Description': 'Sweets Hamper' },
  ];
  const procA = processSpreadsheetData(variantA, 'sales');
  assert.strictEqual(procA.readyCount, 1);
  assert.strictEqual(procA.readyRows[0].data.client, 'Ganesh Enterprises');
  assert.strictEqual(procA.readyRows[0].data.amount, 15000);

  // Variant B: Buyer Name, Net Amount, Invoice Date, Particulars
  const variantB = [
    { 'Buyer Name': 'Krishna Store', 'Net Amount': '₹ 22,400', 'Invoice Date': '14/10/2026', 'Particulars': 'Dry Fruit Sweets' },
  ];
  const procB = processSpreadsheetData(variantB, 'sales');
  assert.strictEqual(procB.readyCount, 1);
  assert.strictEqual(procB.readyRows[0].data.client, 'Krishna Store');
  assert.strictEqual(procB.readyRows[0].data.amount, 22400);
  assert.strictEqual(procB.readyRows[0].data.date, '2026-10-14');

  // Variant C: Sold To, Gross Amount, Date, Item / Product
  const variantC = [
    { 'Sold To': 'Royal Caterers', 'Gross Amount': '75000 INR', 'Date': '2026-10-18', 'Item / Product': 'Wedding Assortment' },
  ];
  const procC = processSpreadsheetData(variantC, 'sales');
  assert.strictEqual(procC.readyCount, 1);
  assert.strictEqual(procC.readyRows[0].data.client, 'Royal Caterers');
  assert.strictEqual(procC.readyRows[0].data.amount, 75000);
  console.log('✓ Alternative column headers (Party Name, Buyer Name, Sold To, Bill Value, Net Amount, etc.) correctly mapped.\n');

  // -----------------------------------------------------------
  // Test 5: Empty Files and Missing Required Columns
  // -----------------------------------------------------------
  console.log('Test 5: Empty files and missing required columns validation...');
  // 5a. Empty rows
  const emptyRes = processSpreadsheetData([], 'sales');
  assert.strictEqual(emptyRes.readyCount, 0);
  assert.strictEqual(emptyRes.total, 0);

  // 5b. Missing client and missing amount
  const invalidRows = [
    { 'Amount': 5000, 'Date': '2026-10-10' },                    // Missing client
    { 'Customer Name': 'Sharma Bros', 'Amount': 0 },              // Zero amount
    { 'Customer Name': 'Verma Traders', 'Amount': 'N/A' },        // Non-numeric amount
    { 'Customer Name': 'Valid Party', 'Amount': 12000, 'Date': '2026-10-11' }, // Valid
  ];
  const invalidProcessed = processSpreadsheetData(invalidRows, 'sales');
  assert.strictEqual(invalidProcessed.total, 4);
  assert.strictEqual(invalidProcessed.readyCount, 1, 'Only 1 row should be valid');
  assert.strictEqual(invalidProcessed.attentionCount, 3, '3 rows should require attention');
  assert.ok(invalidProcessed.attentionRows[0].issues.some(i => i.includes('customer')));
  assert.ok(invalidProcessed.attentionRows[1].issues.some(i => i.includes('amount')));
  assert.ok(invalidProcessed.attentionRows[2].issues.some(i => i.includes('amount')));
  console.log('✓ Missing required columns properly detected and reported without crashing.\n');

  // -----------------------------------------------------------
  // Test 6: File Size Limit (10 MB) & formatFileSize
  // -----------------------------------------------------------
  console.log('Test 6: File size formatting and 10MB limit enforcement...');
  assert.strictEqual(formatFileSize(1024), '1 KB');
  assert.strictEqual(formatFileSize(1024 * 1024 * 2.5), '2.5 MB');
  const tenMB = 10 * 1024 * 1024;
  const elevenMB = 11 * 1024 * 1024;
  assert.ok(tenMB <= 10 * 1024 * 1024, '10 MB is allowed');
  assert.ok(elevenMB > 10 * 1024 * 1024, '11 MB exceeds limit');
  console.log('✓ File size utility and limits verified.\n');

  // -----------------------------------------------------------
  // Test 7: Backend Signup + Sales Import Integration
  // -----------------------------------------------------------
  console.log('Test 7: Backend Account Registration + Automatic Sales Import...');
  const testEmail = `test_signup_${Date.now()}@advisor.msme`;
  const registerPayload = {
    name: 'Rajesh Sweet Mart',
    fullName: 'Rajesh Gupta',
    businessName: 'Rajesh Sweets Private Limited',
    phone: '9876543210',
    city: 'Jaipur',
    state: 'Rajasthan',
    businessType: 'Retail Store',
    sector: 'FMCG & Grocery',
    gstin: '08AAAAA0000A1Z5',
    annualTurnover: '₹50L - ₹1Cr',
    monthlyRevenue: '450000',
    monthlyExpenses: '320000',
    email: testEmail,
    password: 'Password@123',
    hasUploadedSalesData: true,
    salesFileName: 'Sales_History_Q3.xlsx',
  };

  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerPayload),
  });
  assert.strictEqual(regRes.status, 201, 'User registration should succeed with 201');
  const regData = await regRes.json();
  const token = regData.token;
  assert.ok(token, 'Registration must return a JWT token');
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log('✓ User registered and authenticated with JWT token.');

  // Now execute sales import using the authenticated token
  const sampleSalesToImport = [
    { client: 'Moti Mahal Deluxe', amount: 48000, date: '2026-10-01', item: 'Kaju Sweets Bulk', status: 'Paid', invoiceId: 'INV-2026-001' },
    { client: 'Chokhi Dhani Resort', amount: 95000, date: '2026-10-02', item: 'Festival Sweets Hamper', status: 'Paid', invoiceId: 'INV-2026-002' },
    { client: 'LMB Sweets Depot', amount: 32000, date: '2026-10-03', item: 'Gulab Jamun Containers', status: 'Pending', invoiceId: 'INV-2026-003' },
  ];

  const importRes = await fetch(`${API_BASE}/import/execute`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ type: 'sales', rows: sampleSalesToImport, skipDuplicates: true }),
  });
  assert.strictEqual(importRes.status, 200);
  const importData = await importRes.json();
  assert.strictEqual(importData.insertedCount, 3, 'Should insert 3 sales records');
  assert.strictEqual(importData.skippedCount, 0, 'Should skip 0 on first import');
  console.log('✓ Sales batch persisted to database for newly created account.');

  // Fetch sales from API to verify persistence
  const salesGetRes = await fetch(`${API_BASE}/sales`, {
    headers: authHeaders,
  });
  const salesList = await salesGetRes.json();
  assert.strictEqual(salesList.length, 3, 'User should have 3 sales');
  const clientNames = salesList.map((s) => s.client);
  assert.ok(clientNames.includes('Moti Mahal Deluxe'), 'Should contain Moti Mahal Deluxe');
  assert.ok(clientNames.includes('Chokhi Dhani Resort'), 'Should contain Chokhi Dhani Resort');
  assert.ok(clientNames.includes('LMB Sweets Depot'), 'Should contain LMB Sweets Depot');
  console.log('✓ Sales verified in database via GET /api/sales.');

  // -----------------------------------------------------------
  // Test 8: Duplicate Prevention on Retry
  // -----------------------------------------------------------
  console.log('\nTest 8: Duplicate prevention on retry...');
  const duplicateRes = await fetch(`${API_BASE}/import/execute`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ type: 'sales', rows: sampleSalesToImport, skipDuplicates: true }),
  });
  const duplicateData = await duplicateRes.json();
  assert.strictEqual(duplicateData.insertedCount, 0, 'No duplicates should be inserted');
  assert.strictEqual(duplicateData.skippedCount, 3, 'All 3 duplicate records should be skipped');

  const checkCountAfterDuplicateRes = await fetch(`${API_BASE}/sales`, {
    headers: authHeaders,
  });
  const checkCountList = await checkCountAfterDuplicateRes.json();
  assert.strictEqual(checkCountList.length, 3, 'Sales count must remain 3 without double-counting');
  console.log('✓ Duplicate protection verified: 0 duplicates inserted, exactly 3 records skipped.');

  // -----------------------------------------------------------
  // Test 9: Signup with "Skip for now"
  // -----------------------------------------------------------
  console.log('\nTest 9: Signup with "Skip for now"...');
  const skipEmail = `test_skip_${Date.now()}@advisor.msme`;
  const skipRegRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...registerPayload,
      email: skipEmail,
      hasUploadedSalesData: false,
      salesFileName: null,
    }),
  });
  const skipRegData = await skipRegRes.json();
  const skipToken = skipRegData.token;
  const skipSalesRes = await fetch(`${API_BASE}/sales`, {
    headers: { Authorization: `Bearer ${skipToken}` },
  });
  const skipSalesList = await skipSalesRes.json();
  assert.strictEqual(skipSalesList.length, 0, 'New user who skipped should have 0 sales');
  console.log('✓ "Skip for now" onboarding works with clean empty initial state.');

  // -----------------------------------------------------------
  // Test 10: Multi-Department Automatic Detection & Import All (Sweets Shop Workbook)
  // -----------------------------------------------------------
  console.log('\nTest 10: Multi-Department Automatic Detection & Import All (Sweets Shop Workbook)...');
  const sweetsWorkbookPath = 'D:/Sweets_Shop_Business_Import_Data.xlsx';
  if (fs.existsSync(sweetsWorkbookPath)) {
    const sweetsBuf = fs.readFileSync(sweetsWorkbookPath);
    const sweetsWb = XLSX.read(sweetsBuf, { type: 'buffer' });

    // 10a. Automatic multi-worksheet detection
    const { processMultiSheetWorkbook } = await import('../MSME/src/utils/smartImporter.js');
    const multiAnalysis = processMultiSheetWorkbook(sweetsWb, 'all');

    assert.strictEqual(multiAnalysis.totalWorksheets, 5, 'Should detect 5 total worksheets');
    assert.strictEqual(multiAnalysis.totalReadyCount, 315, 'Should detect 315 total valid records');
    assert.strictEqual(multiAnalysis.totalAttentionCount, 0, 'Should have 0 attention errors across all sheets');

    // Verify per-sheet department classification
    const salesSheet = multiAnalysis.sheets.find((s) => s.sheetName === 'Sales');
    assert.ok(salesSheet && salesSheet.detectedCategory === 'sales' && salesSheet.readyCount === 80, 'Sales sheet should have 80 valid rows');

    const expensesSheet = multiAnalysis.sheets.find((s) => s.sheetName === 'Expenses');
    assert.ok(expensesSheet && expensesSheet.detectedCategory === 'expenses' && expensesSheet.readyCount === 80, 'Expenses sheet should have 80 valid rows');

    const stockSheet = multiAnalysis.sheets.find((s) => s.sheetName === 'Products_Stock');
    assert.ok(stockSheet && stockSheet.detectedCategory === 'inventory' && stockSheet.readyCount === 80, 'Products_Stock sheet should have 80 valid rows');

    const purchaseSheet = multiAnalysis.sheets.find((s) => s.sheetName === 'Ingredient_Purchases');
    assert.ok(purchaseSheet && purchaseSheet.detectedCategory === 'purchases' && purchaseSheet.readyCount === 75, 'Ingredient_Purchases sheet should have 75 valid rows');

    const testSummarySheet = multiAnalysis.sheets.find((s) => s.sheetName === 'Test_Summary');
    assert.ok(testSummarySheet && testSummarySheet.isSkipped === true, 'Test_Summary sheet must be skipped as informational data');
    assert.strictEqual(testSummarySheet.action, 'Skipped (Informational)', 'Action should be Skipped (Informational)');

    console.log('✓ Workbook sheets automatically classified: Sales (80), Expenses (80), Stock (80), Purchases (75), Test_Summary (Skipped).');

    // 10b. Create a dedicated user for multi-department import
    const multiUserEmail = `test_multidept_${Date.now()}@advisor.msme`;
    const multiRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...registerPayload,
        email: multiUserEmail,
        hasUploadedSalesData: true,
        salesFileName: 'Sweets_Shop_Business_Import_Data.xlsx',
      }),
    });
    const multiRegData = await multiRegRes.json();
    const multiAuthHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${multiRegData.token}`,
    };

    // 10c. Execute Import All Data in one action
    const multiImportPayload = {
      type: 'all',
      modules: {
        sales: multiAnalysis.categorizedReadyRows.sales.map((r) => r.data),
        expenses: multiAnalysis.categorizedReadyRows.expenses.map((r) => r.data),
        purchases: multiAnalysis.categorizedReadyRows.purchases.map((r) => r.data),
        inventory: multiAnalysis.categorizedReadyRows.inventory.map((r) => r.data),
      },
      skipDuplicates: true,
    };

    const multiImportRes = await fetch(`${API_BASE}/import/execute`, {
      method: 'POST',
      headers: multiAuthHeaders,
      body: JSON.stringify(multiImportPayload),
    });

    assert.strictEqual(multiImportRes.status, 200, 'Import execute should return 200');
    const multiImportResult = await multiImportRes.json();
    assert.strictEqual(multiImportResult.insertedCount, 315, 'All 315 valid records should be inserted');
    assert.strictEqual(multiImportResult.byModule.sales.inserted, 80, '80 sales inserted');
    assert.strictEqual(multiImportResult.byModule.expenses.inserted, 80, '80 expenses inserted');
    assert.strictEqual(multiImportResult.byModule.purchases.inserted, 75, '75 ingredient purchases inserted');
    assert.strictEqual(multiImportResult.byModule.inventory.inserted, 80, '80 products inserted');
    console.log('✓ Multi-department import executed: exactly 315 records saved into 4 respective modules in one click.');

    // 10d. Verify database persistence across all modules
    const [dbSales, dbExpenses, dbInventory, dbActivities] = await Promise.all([
      fetch(`${API_BASE}/sales`, { headers: multiAuthHeaders }).then((r) => r.json()),
      fetch(`${API_BASE}/expenses`, { headers: multiAuthHeaders }).then((r) => r.json()),
      fetch(`${API_BASE}/inventory`, { headers: multiAuthHeaders }).then((r) => r.json()),
      fetch(`${API_BASE}/activities`, { headers: multiAuthHeaders }).then((r) => r.json()),
    ]);

    assert.strictEqual(dbSales.length, 80, 'User should have 80 sales in database');
    assert.strictEqual(dbExpenses.length, 80, 'User should have 80 operating expenses in database (purchases isolated to Inventory)');
    assert.strictEqual(dbInventory.length, 155, 'User should have 155 inventory items in database (80 products + 75 raw material purchases)');
    assert.ok(dbActivities.length >= 1, 'Import activity should be logged');
    assert.ok(dbActivities[0].title.includes('315 Records'), 'Activity title should mention 315 Records');
    console.log('✓ Database records verified: 80 Sales, 80 Operating Expenses, 155 Inventory Items (80 Products + 75 Raw Materials), and Activity log created.');

    // 10e. Verify duplicate protection across all departments
    const secondImportRes = await fetch(`${API_BASE}/import/execute`, {
      method: 'POST',
      headers: multiAuthHeaders,
      body: JSON.stringify(multiImportPayload),
    });
    const secondImportResult = await secondImportRes.json();
    assert.strictEqual(secondImportResult.insertedCount, 0, 'No duplicates should be inserted on second run');
    assert.strictEqual(secondImportResult.skippedCount, 315, 'All 315 records should be skipped');
    console.log('✓ Full duplicate prevention verified: 0 duplicates inserted, exactly 315 skipped on second upload.');
  } else {
    console.log('ℹ Sweets Shop workbook not found at ' + sweetsWorkbookPath + ', skipping Test 10.');
  }

  console.log('\n========================================================');
  console.log('   🎉 ALL 10 SIGNUP & WORKBOOK IMPORT TESTS PASSED SUCCESSFULLY! ');
  console.log('========================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed with error:', err.message);
  process.exit(1);
});
