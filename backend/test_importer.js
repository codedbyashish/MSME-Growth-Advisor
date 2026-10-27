import assert from 'assert';
import * as XLSX from '../MSME/node_modules/xlsx/xlsx.mjs';

import {
  autoDetectColumns,
  cleanNumber,
  cleanDate,
  processSpreadsheetData,
  detectWorksheetCategory,
  processMultiSheetWorkbook,
  isRowEmpty,
  IMPORT_CATEGORIES,
} from '../MSME/src/utils/smartImporter.js';

console.log('--- RUNNING SMART IMPORTER COMPREHENSIVE TESTS ---');

// 1. Test Number & Currency Cleaning
console.log('1. Testing Currency & Number Cleaning...');
assert.strictEqual(cleanNumber('₹ 45,000.00'), 45000);
assert.strictEqual(cleanNumber('Rs. 1,500/-'), 1500);
assert.strictEqual(cleanNumber('1,25,000 INR'), 125000);
assert.strictEqual(cleanNumber('₹ 18.50'), 18.5);
assert.strictEqual(cleanNumber(500), 500);
assert.strictEqual(cleanNumber(''), null);
assert.strictEqual(cleanNumber(null), null);
assert.strictEqual(cleanNumber('N/A'), null);
console.log('✓ Currency and number cleaning passed.');

// 2. Test Indian & Global Date Normalization
console.log('2. Testing Date Normalization (Indian DD/MM/YYYY, ISO, Excel serial)...');
assert.strictEqual(cleanDate('15/10/2026'), '2026-10-15');
assert.strictEqual(cleanDate('05-04-2026'), '2026-04-05');
assert.strictEqual(cleanDate('2026-10-25'), '2026-10-25');
const excelDate = cleanDate(45220);
assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(excelDate), 'Excel date should format to YYYY-MM-DD');
console.log('✓ Date normalization passed.');

// 3. Test Empty Row Detection
console.log('3. Testing Empty Row Detection...');
assert.strictEqual(isRowEmpty({ a: '', b: null, c: undefined, d: '   ' }), true);
assert.strictEqual(isRowEmpty({ a: 'Sharma', b: '45000' }), false);
console.log('✓ Empty row detection passed.');

// 4. Test "All Fields — Auto Detect" Fourth Category Exists
console.log('4. Testing "All Fields — Auto Detect" Option Definition...');
assert.ok(IMPORT_CATEGORIES.all, '"all" category must exist');
assert.strictEqual(IMPORT_CATEGORIES.all.title, 'All Fields — Auto Detect');
assert.strictEqual(IMPORT_CATEGORIES.all.id, 'all');
console.log('✓ All Fields option definition passed.');

// 5. Test Automatic Worksheet Category Detection
console.log('5. Testing Automatic Worksheet Category Detection...');
const salesDetection = detectWorksheetCategory(
  ['Buyer Name', 'Invoice Date', 'Total Amount', 'Invoice #', 'Salesperson', 'Region'],
  'Q3 Invoices'
);
assert.strictEqual(salesDetection.type, 'sales', 'Should detect Sales sheet');

const expenseDetection = detectWorksheetCategory(
  ['Expense Title', 'Cost', 'Expense Type', 'Paid To', 'Payment Date', 'Payment Mode'],
  'Office Expenses'
);
assert.strictEqual(expenseDetection.type, 'expenses', 'Should detect Expenses sheet');

const inventoryDetection = detectWorksheetCategory(
  ['Product Name', 'Unit Price', 'Available Units', 'Unit', 'Warehouse Location'],
  'Warehouse Inventory'
);
assert.strictEqual(inventoryDetection.type, 'inventory', 'Should detect Inventory sheet');
console.log('✓ Automatic worksheet category detection passed.');

// 6. Test Custom Columns Preservation in Metadata
console.log('6. Testing Custom Columns Preservation in Metadata...');
const sheetWithCustomColumns = [
  {
    'Customer Name': 'Tata Motors Supply Division',
    'Invoice Date': '12/10/2026',
    'Amount': '₹ 1,50,000/-',
    'Product': 'Precision Bushings 20mm',
    'GSTIN': '27AAACT0000A1Z5',          // custom column
    'Delivery Branch': 'Pune Depot',     // custom column
    'Sales Agent': 'Vikram Rathore',      // custom column
  },
];

const processedCustom = processSpreadsheetData(sheetWithCustomColumns, 'sales');
assert.strictEqual(processedCustom.readyCount, 1);
const recordWithMeta = processedCustom.readyRows[0].data;
assert.strictEqual(recordWithMeta.client, 'Tata Motors Supply Division');
assert.strictEqual(recordWithMeta.amount, 150000);
assert.ok(recordWithMeta.metadata, 'Metadata object must exist');
assert.strictEqual(recordWithMeta.metadata['GSTIN'], '27AAACT0000A1Z5');
assert.strictEqual(recordWithMeta.metadata['Delivery Branch'], 'Pune Depot');
assert.strictEqual(recordWithMeta.metadata['Sales Agent'], 'Vikram Rathore');
console.log('✓ Custom columns preservation in metadata passed.');

// 7. Test Multi-Sheet Workbook Auto-Detection and Processing
console.log('7. Testing Multi-Sheet Workbook Processing...');
const wb = XLSX.utils.book_new();

// Sheet 1: Sales
const salesRows = [
  { 'Customer': 'Bajaj Auto Dealers', 'Amount': 85000, 'Date': '2026-10-10', 'Item': 'Auto Components' },
  { 'Customer': 'Hero Moto Hub', 'Amount': 42000, 'Date': '2026-10-11', 'Item': 'Bearings Set' },
];
const ws1 = XLSX.utils.json_to_sheet(salesRows);
XLSX.utils.book_append_sheet(wb, ws1, 'Sales Data');

// Sheet 2: Expenses
const expRows = [
  { 'Expense Title': 'Factory Electricity', 'Cost': 32000, 'Vendor': 'MSEB Power', 'Category': 'Utilities' },
];
const ws2 = XLSX.utils.json_to_sheet(expRows);
XLSX.utils.book_append_sheet(wb, ws2, 'Operating Expenses');

// Sheet 3: Products
const stockRows = [
  { 'Item Name': 'Steel Alloy Bar 5m', 'Selling Price': 750, 'Current Stock': 120, 'Category': 'Raw Material' },
  { 'Item Name': 'Aluminum Sheet 2mm', 'Selling Price': 420, 'Current Stock': 65, 'Category': 'Raw Material' },
];
const ws3 = XLSX.utils.json_to_sheet(stockRows);
XLSX.utils.book_append_sheet(wb, ws3, 'Stock Catalog');

const multiSheetResult = processMultiSheetWorkbook(wb, 'all');

assert.strictEqual(multiSheetResult.totalWorksheets, 3, 'Should detect 3 worksheets');
assert.strictEqual(multiSheetResult.totalReadyCount, 5, 'Should process 5 total records');
assert.strictEqual(multiSheetResult.categorizedReadyRows.sales.length, 2, 'Should route 2 to sales');
assert.strictEqual(multiSheetResult.categorizedReadyRows.expenses.length, 1, 'Should route 1 to expenses');
assert.strictEqual(multiSheetResult.categorizedReadyRows.inventory.length, 2, 'Should route 2 to inventory');
assert.ok(multiSheetResult.totalFieldsCount >= 10, 'Should recognize multiple distinct fields');

console.log('✓ Multi-sheet workbook processing and routing passed.');

// 8. Test findBestSalesWorksheet and Sweets Shop Workbook
console.log('8. Testing Sweets Shop Workbook and findBestSalesWorksheet...');
import('fs').then(async ({ default: fs }) => {
  const sweetsPath = 'D:/Sweets_Shop_Business_Import_Data.xlsx';
  if (fs.existsSync(sweetsPath)) {
    const buf = fs.readFileSync(sweetsPath);
    const sweetsWb = XLSX.read(buf, { type: 'buffer' });
    const { findBestSalesWorksheet } = await import('../MSME/src/utils/smartImporter.js');

    const bestSales = findBestSalesWorksheet(sweetsWb);
    assert.strictEqual(bestSales.bestSheetName, 'Sales', 'Should automatically detect Sales sheet');

    // Test sales mode
    const salesOnlyRes = processMultiSheetWorkbook(sweetsWb, 'sales');
    assert.strictEqual(salesOnlyRes.totalReadyCount, 80, 'Should have exactly 80 valid sales');
    assert.strictEqual(salesOnlyRes.totalAttentionCount, 0, 'Should have 0 attention errors in sales mode');

    // Test all mode
    const allRes = processMultiSheetWorkbook(sweetsWb, 'all');
    assert.strictEqual(allRes.totalReadyCount, 315, 'Should import all 315 valid records across modules');
    assert.strictEqual(allRes.totalAttentionCount, 0, 'Should have 0 attention errors across all modules');
    assert.strictEqual(allRes.categorizedReadyRows.sales.length, 80);
    assert.strictEqual(allRes.categorizedReadyRows.expenses.length, 80); // 80 Pure Expenses
    assert.strictEqual(allRes.categorizedReadyRows.purchases.length, 75); // 75 Purchases
    assert.strictEqual(allRes.categorizedReadyRows.inventory.length, 80);
    console.log('✓ Sweets Shop workbook tests passed with 0 errors (80 sales in sales mode, 315 records across 4 departments in all mode).');
  } else {
    console.log('ℹ Sweets Shop workbook not found at ' + sweetsPath + ', skipping file-based test.');
  }

  console.log('\nALL TESTS PASSED SUCCESSFULLY! 🎉');
});

