import Sale from '../models/Sale.js';
import Expense from '../models/Expense.js';
import Inventory from '../models/Inventory.js';
import Activity from '../models/Activity.js';

/**
 * Standardize date to YYYY-MM-DD
 * Supports Indian business formats (DD/MM/YYYY, DD-MM-YYYY), ISO (YYYY-MM-DD),
 * Excel serial numbers, and common timestamp variants.
 */
const formatDate = (val) => {
  if (!val) return new Date().toISOString().split('T')[0];

  // Handle Excel serial date numbers (e.g. 45220)
  if (typeof val === 'number' && val > 20000 && val < 80000) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const dateObj = new Date(excelEpoch.getTime() + val * 86400000);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0];
    }
  }

  const str = String(val).trim();

  // If already standard YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Handle Indian format: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${year}-${month}-${day}`;
    }
  }

  // Handle 2-digit year: DD/MM/YY
  const dmyShortMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})$/);
  if (dmyShortMatch) {
    const day = dmyShortMatch[1].padStart(2, '0');
    const month = dmyShortMatch[2].padStart(2, '0');
    const year = parseInt(dmyShortMatch[3], 10) > 50 ? `19${dmyShortMatch[3]}` : `20${dmyShortMatch[3]}`;
    return `${year}-${month}-${day}`;
  }

  // Handle YYYY/MM/DD
  const ymdMatch = str.match(/^(\d{4})[\/\.](\d{1,2})[\/\.](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
};

/**
 * Standardize numeric values (INR, currency symbols, commas, trailing /-)
 */
const cleanNumber = (val) => {
  if (val === null || val === undefined || val === '') return NaN;
  if (typeof val === 'number') return isNaN(val) ? NaN : val;

  let str = String(val).trim();
  str = str.replace(/(rs\.?|inr|usd|eur|gbp)/gi, '');
  str = str.replace(/(\/|\-)+$/, '');
  str = str.replace(/,/g, '');
  str = str.replace(/[^0-9.-]/g, '');

  if (!str || str === '-' || str === '.') return NaN;
  const num = Number(str);
  return isNaN(num) ? NaN : num;
};

/**
 * Safely escape characters that have special meaning in regular expressions
 */
const escapeRegex = (str) => String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Helper to validate a batch of sales rows
 */
const validateSalesBatch = (rows, existingSales, seenBatchKeys) => {
  const validRows = [];
  const invalidRows = [];
  const duplicateRows = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const errors = [];

    const client = String(row.client || row.customer || row['Customer Name'] || row['Customer'] || row['Party Name'] || '').trim();
    const rawAmount = row.amount !== undefined ? row.amount : (row.total !== undefined ? row.total : (row['Amount (INR)'] !== undefined ? row['Amount (INR)'] : row['Amount (₹)']));
    const amount = cleanNumber(rawAmount);
    const item = String(row.item || row.description || row.product || row['Item / Product'] || row['Product / Item'] || 'General Order').trim();
    const invoiceId = String(row.invoiceId || row.billNo || row['Invoice Number'] || row['Invoice No'] || '').trim();

    let status = String(row.status || row['Payment Status'] || 'Paid').trim();
    if (/paid/i.test(status)) status = 'Paid';
    else if (/pending/i.test(status) || /unpaid/i.test(status) || /due/i.test(status)) status = 'Pending';
    else if (/overdue/i.test(status)) status = 'Overdue';
    else status = 'Paid';

    const date = formatDate(row.date || row['Invoice Date'] || row['Date']);

    if (!client) {
      errors.push('Customer or buyer name is required');
    }
    if (isNaN(amount) || amount <= 0) {
      errors.push('Amount must be a positive numeric value');
    }

    const parsed = {
      client,
      amount,
      item,
      status,
      date,
      invoiceId: invoiceId || undefined,
      metadata: row.metadata || {},
    };

    if (errors.length === 0) {
      const batchKey = `sales_${client.toLowerCase()}_${amount}_${date}_${invoiceId.toLowerCase()}`;
      const isBatchDuplicate = seenBatchKeys.has(batchKey);
      seenBatchKeys.add(batchKey);

      const existingMatch = existingSales.find(
        (s) =>
          (invoiceId && s.invoiceId && s.invoiceId.toLowerCase() === invoiceId.toLowerCase()) ||
          (s.client.toLowerCase() === client.toLowerCase() &&
            Math.abs(s.amount - amount) < 0.01 &&
            s.date === date)
      );

      const isDuplicate = !!existingMatch || isBatchDuplicate;

      if (isDuplicate) {
        duplicateRows.push({
          rowNumber: rowNum,
          data: parsed,
          reason: isBatchDuplicate
            ? 'Duplicate entry within this file'
            : 'Matches existing invoice with same customer, date, and amount in database',
        });
      }
      validRows.push({ rowNumber: rowNum, data: parsed, isDuplicate });
    } else {
      invalidRows.push({ rowNumber: rowNum, data: row, errors });
    }
  });

  return { validRows, invalidRows, duplicateRows };
};

/**
 * Helper to validate a batch of expense rows
 */
const validateExpenseBatch = (rows, existingExpenses, seenBatchKeys) => {
  const validRows = [];
  const invalidRows = [];
  const duplicateRows = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const errors = [];

    const title = String(
      row.title ||
      row.description ||
      row.expense ||
      row['Expense Title'] ||
      row['Expense Description'] ||
      ''
    ).trim();
    const rawAmount =
      row.amount !== undefined
        ? row.amount
        : row.cost !== undefined
        ? row.cost
        : row['Amount (INR)'] !== undefined
        ? row['Amount (INR)']
        : row['Amount (₹)'];
    const amount = cleanNumber(rawAmount);
    const category = String(row.category || row['Category'] || 'Operations').trim();
    const vendor = String(row.vendor || row.supplier || row['Supplier'] || row['Vendor / Paid To'] || 'Standard Vendor').trim();
    const date = formatDate(row.date || row['Expense Date'] || row['Date']);
    const expenseId = String(row.expenseId || row['Expense ID'] || row['Expense Id'] || row.id || '').trim();

    if (!title) {
      errors.push('Expense description is required');
    }
    if (isNaN(amount) || amount <= 0) {
      errors.push('Amount must be a positive numeric value');
    }

    const parsed = {
      expenseId: expenseId || undefined,
      title,
      amount,
      category,
      vendor,
      date,
      metadata: row.metadata || {},
    };

    if (errors.length === 0) {
      const batchKey = expenseId ? `exp_id_${expenseId.toLowerCase()}` : `exp_${title.toLowerCase()}_${amount}_${date}`;
      const isBatchDuplicate = seenBatchKeys.has(batchKey);
      seenBatchKeys.add(batchKey);

      const existingMatch = existingExpenses.find(
        (e) =>
          (expenseId && e.expenseId && e.expenseId.toLowerCase() === expenseId.toLowerCase()) ||
          (e.title.toLowerCase() === title.toLowerCase() &&
            Math.abs(e.amount - amount) < 0.01 &&
            e.date === date)
      );

      const isDuplicate = !!existingMatch || isBatchDuplicate;

      if (isDuplicate) {
        duplicateRows.push({
          rowNumber: rowNum,
          data: parsed,
          reason: isBatchDuplicate
            ? 'Duplicate entry within this file'
            : (expenseId && existingMatch?.expenseId?.toLowerCase() === expenseId.toLowerCase())
            ? `Matches existing expense ID '${expenseId}' in database`
            : 'Matches existing expense with same description, date, and amount in database',
        });
      }
      validRows.push({ rowNumber: rowNum, data: parsed, isDuplicate });
    } else {
      invalidRows.push({ rowNumber: rowNum, data: row, errors });
    }
  });

  return { validRows, invalidRows, duplicateRows };
};

/**
 * Helper to validate a batch of ingredient purchase rows and map them into Raw Materials inventory
 */
const validatePurchasesBatch = (rows, existingInventory, seenBatchKeys) => {
  const validRows = [];
  const invalidRows = [];
  const duplicateRows = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const errors = [];

    const name = String(
      row.name ||
      row.title ||
      row['Ingredient / Item'] ||
      row['Item / Ingredient'] ||
      row['Ingredient'] ||
      row['Raw Material'] ||
      row['Item'] ||
      ''
    ).trim();

    const rawStock =
      row.stock !== undefined
        ? row.stock
        : row.quantity !== undefined
        ? row.quantity
        : row['Quantity'] !== undefined
        ? row['Quantity']
        : row['Current Stock Qty'];
    const stock = Math.max(0, parseInt(String(cleanNumber(rawStock) || '0'), 10) || 0);

    const rawTotal =
      row.amount !== undefined
        ? row.amount
        : row.cost !== undefined
        ? row.cost
        : row['Total Cost (INR)'] !== undefined
        ? row['Total Cost (INR)']
        : row['Total Cost'] !== undefined
        ? row['Total Cost']
        : row['Amount (INR)'];
    const totalCost = cleanNumber(rawTotal);

    const rawPrice =
      row.unitPrice !== undefined
        ? row.unitPrice
        : row.price !== undefined
        ? row.price
        : row['Unit Cost (INR)'] !== undefined
        ? row['Unit Cost (INR)']
        : row['Unit Cost'];
    let unitPrice = cleanNumber(rawPrice);
    if ((isNaN(unitPrice) || unitPrice <= 0) && !isNaN(totalCost) && totalCost > 0 && stock > 0) {
      unitPrice = Math.round((totalCost / stock) * 100) / 100;
    }
    if (isNaN(unitPrice) || unitPrice < 0) unitPrice = 0;

    const unit = String(row.unit || row['Unit of Measure'] || row['Unit'] || 'kg').trim();
    const vendor = String(row.vendor || row.supplier || row['Supplier'] || 'Standard Supplier').trim();
    const purchaseId = String(row.purchaseId || row['Purchase ID'] || row['Purchase Id'] || '').trim();
    const date = formatDate(row.date || row['Purchase Date'] || row['Date']);

    if (!name) {
      errors.push('Ingredient or raw material item name is required');
    }

    const metadata = {
      ...(row.metadata || {}),
      supplier: vendor,
      purchaseDate: date,
      ...(purchaseId ? { purchaseId } : {}),
      ...(totalCost ? { totalPurchaseCost: totalCost } : {}),
    };

    const parsed = {
      name,
      stock,
      unitPrice,
      unit,
      minStock: 10,
      category: 'Raw Materials',
      metadata,
    };

    if (errors.length === 0) {
      const batchKey = `purchase_inv_${name.toLowerCase()}`;
      const isBatchDuplicate = seenBatchKeys.has(batchKey);
      seenBatchKeys.add(batchKey);

      const existingMatch = existingInventory.find(
        (inv) => inv.name.toLowerCase() === name.toLowerCase()
      );

      const isDuplicate = !!existingMatch || isBatchDuplicate;

      if (isDuplicate) {
        duplicateRows.push({
          rowNumber: rowNum,
          data: parsed,
          existingId: existingMatch?._id,
          reason: isBatchDuplicate
            ? `Ingredient '${name}' appears multiple times in file`
            : `Raw material '${name}' already exists in your inventory`,
        });
      }
      validRows.push({ rowNumber: rowNum, data: parsed, isDuplicate, existingId: existingMatch?._id });
    } else {
      invalidRows.push({ rowNumber: rowNum, data: row, errors });
    }
  });

  return { validRows, invalidRows, duplicateRows };
};

/**
 * Helper to validate a batch of inventory rows
 */
const validateInventoryBatch = (rows, existingInventory, seenBatchKeys) => {
  const validRows = [];
  const invalidRows = [];
  const duplicateRows = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const errors = [];

    const name = String(row.name || row.product || row.item || row['Product Name'] || '').trim();
    const rawPrice =
      row.unitPrice !== undefined
        ? row.unitPrice
        : row.price !== undefined
        ? row.price
        : row['Unit Price (INR)'] !== undefined
        ? row['Unit Price (INR)']
        : row['Selling Price (₹)'];
    const unitPrice = cleanNumber(rawPrice);
    const rawStock =
      row.stock !== undefined
        ? row.stock
        : row.quantity !== undefined
        ? row.quantity
        : row['Current Stock Qty'] !== undefined
        ? row['Current Stock Qty']
        : row['Available Quantity'];
    const stock = Math.max(0, parseInt(String(cleanNumber(rawStock) || '0'), 10) || 0);
    const unit = String(row.unit || row['Unit of Measure'] || 'Units').trim();
    const minStock = Math.max(
      0,
      parseInt(String(cleanNumber(row.minStock || row['Minimum Stock Threshold'] || row['Low Stock Alert Level']) || '10'), 10) || 10
    );
    const category = String(row.category || row['Category'] || 'General').trim();

    if (!name) {
      errors.push('Product name is required');
    }
    if (isNaN(unitPrice) || unitPrice < 0) {
      errors.push('Unit price must be a valid non-negative number');
    }


    const parsed = {
      name,
      stock,
      unitPrice,
      unit,
      minStock,
      category,
      metadata: row.metadata || {},
    };

    if (errors.length === 0) {
      const batchKey = `inv_${name.toLowerCase()}`;
      const isBatchDuplicate = seenBatchKeys.has(batchKey);
      seenBatchKeys.add(batchKey);

      const existingMatch = existingInventory.find(
        (inv) => inv.name.toLowerCase() === name.toLowerCase()
      );

      const isDuplicate = !!existingMatch || isBatchDuplicate;

      if (isDuplicate) {
        duplicateRows.push({
          rowNumber: rowNum,
          data: parsed,
          existingId: existingMatch?._id,
          reason: isBatchDuplicate
            ? `Duplicate product '${name}' appears multiple times in file`
            : `Product '${name}' already exists in your inventory`,
        });
      }
      validRows.push({ rowNumber: rowNum, data: parsed, isDuplicate, existingId: existingMatch?._id });
    } else {
      invalidRows.push({ rowNumber: rowNum, data: row, errors });
    }
  });

  return { validRows, invalidRows, duplicateRows };
};

/**
 * @desc    Validate uploaded spreadsheet rows and detect potential duplicates
 * @route   POST /api/import/validate
 * @access  Private
 */
export const validateImportData = async (req, res) => {
  try {
    const { type, rows, modules } = req.body;

    if (!type || !['sales', 'expenses', 'inventory', 'all'].includes(type)) {
      return res.status(400).json({ message: 'Invalid data type. Must be sales, expenses, inventory, or all.' });
    }

    const userId = req.user._id;
    const seenBatchKeys = new Set();

    // 1. ALL FIELDS / MULTI-MODULE VALIDATION
    if (type === 'all') {
      const activeModules = modules || {};
      const salesRows = Array.isArray(activeModules.sales) ? activeModules.sales : [];
      const expenseRows = Array.isArray(activeModules.expenses) ? activeModules.expenses : [];
      const purchaseRows = Array.isArray(activeModules.purchases) ? activeModules.purchases : [];
      const inventoryRows = Array.isArray(activeModules.inventory) ? activeModules.inventory : [];

      const totalRows = salesRows.length + expenseRows.length + inventoryRows.length + purchaseRows.length;
      if (totalRows === 0) {
        return res.status(400).json({ message: 'No rows provided across any module.' });
      }

      if (totalRows > 15000) {
        return res.status(400).json({ message: 'Batch limit exceeded. Maximum 15,000 rows permitted per upload.' });
      }

      // Fetch existing records for duplicate matching
      const [existingSales, existingExpenses, existingInventory] = await Promise.all([
        Sale.find({ user: userId }).select('client amount date invoiceId').lean(),
        Expense.find({ user: userId }).select('title amount date expenseId').lean(),
        Inventory.find({ user: userId }).select('name category productId unitPrice stock').lean(),
      ]);

      const salesRes = validateSalesBatch(salesRows, existingSales, seenBatchKeys);
      const expRes = validateExpenseBatch(expenseRows, existingExpenses, seenBatchKeys);
      const purchaseRes = validatePurchasesBatch(purchaseRows, existingInventory, seenBatchKeys);
      const invRes = validateInventoryBatch(inventoryRows, existingInventory, seenBatchKeys);

      const totalValid = salesRes.validRows.length + expRes.validRows.length + invRes.validRows.length + purchaseRes.validRows.length;
      const totalInvalid = salesRes.invalidRows.length + expRes.invalidRows.length + invRes.invalidRows.length + purchaseRes.invalidRows.length;
      const totalDuplicates = salesRes.duplicateRows.length + expRes.duplicateRows.length + invRes.duplicateRows.length + purchaseRes.duplicateRows.length;

      return res.status(200).json({
        success: true,
        type: 'all',
        totalRows,
        validCount: totalValid,
        invalidCount: totalInvalid,
        duplicateCount: totalDuplicates,
        byModule: {
          sales: {
            total: salesRows.length,
            validCount: salesRes.validRows.length,
            invalidCount: salesRes.invalidRows.length,
            duplicateCount: salesRes.duplicateRows.length,
            validRows: salesRes.validRows,
            invalidRows: salesRes.invalidRows,
            duplicateRows: salesRes.duplicateRows,
          },
          expenses: {
            total: expenseRows.length,
            validCount: expRes.validRows.length,
            invalidCount: expRes.invalidRows.length,
            duplicateCount: expRes.duplicateRows.length,
            validRows: expRes.validRows,
            invalidRows: expRes.invalidRows,
            duplicateRows: expRes.duplicateRows,
          },
          purchases: {
            total: purchaseRows.length,
            validCount: purchaseRes.validRows.length,
            invalidCount: purchaseRes.invalidRows.length,
            duplicateCount: purchaseRes.duplicateRows.length,
            validRows: purchaseRes.validRows,
            invalidRows: purchaseRes.invalidRows,
            duplicateRows: purchaseRes.duplicateRows,
          },
          inventory: {
            total: inventoryRows.length,
            validCount: invRes.validRows.length,
            invalidCount: invRes.invalidRows.length,
            duplicateCount: invRes.duplicateRows.length,
            validRows: invRes.validRows,
            invalidRows: invRes.invalidRows,
            duplicateRows: invRes.duplicateRows,
          },
        },
      });
    }

    // 2. SINGLE MODULE VALIDATION (Backwards compatibility)
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'No rows provided to validate.' });
    }

    if (rows.length > 5000) {
      return res.status(400).json({ message: 'Batch limit exceeded. Maximum 5,000 rows permitted per upload.' });
    }

    let validRows = [];
    let invalidRows = [];
    let duplicateRows = [];

    if (type === 'sales') {
      const existingSales = await Sale.find({ user: userId }).select('client amount date invoiceId').lean();
      const resBatch = validateSalesBatch(rows, existingSales, seenBatchKeys);
      validRows = resBatch.validRows;
      invalidRows = resBatch.invalidRows;
      duplicateRows = resBatch.duplicateRows;
    } else if (type === 'expenses') {
      const existingExpenses = await Expense.find({ user: userId }).select('title amount date expenseId').lean();
      const resBatch = validateExpenseBatch(rows, existingExpenses, seenBatchKeys);
      validRows = resBatch.validRows;
      invalidRows = resBatch.invalidRows;
      duplicateRows = resBatch.duplicateRows;
    } else if (type === 'inventory') {
      const existingInventory = await Inventory.find({ user: userId }).select('name category productId unitPrice stock').lean();
      const resBatch = validateInventoryBatch(rows, existingInventory, seenBatchKeys);
      validRows = resBatch.validRows;
      invalidRows = resBatch.invalidRows;
      duplicateRows = resBatch.duplicateRows;
    }

    return res.status(200).json({
      success: true,
      type,
      totalRows: rows.length,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      duplicateCount: duplicateRows.length,
      validRows,
      invalidRows,
      duplicateRows,
    });
  } catch (error) {
    console.error('Validate import error:', error);
    return res.status(500).json({ message: error.message || 'Error validating import data' });
  }
};

/**
 * Execute sales insertions
 */
const executeSalesBatch = async (userId, rows, skipDuplicates, overwriteDuplicates) => {
  const currentCount = await Sale.countDocuments({ user: userId });
  let nextIndex = currentCount + 1;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    try {
      const client = String(item.client || '').trim();
      const amount = cleanNumber(item.amount);

      if (!client || isNaN(amount) || amount <= 0) {
        errors.push({ index: i, message: 'Invalid customer name or amount' });
        continue;
      }

      const date = formatDate(item.date);

      const existing = await Sale.findOne({
        user: userId,
        $or: [
          ...(item.invoiceId ? [{ invoiceId: new RegExp(`^${escapeRegex(item.invoiceId.trim())}$`, 'i') }] : []),
          {
            client: new RegExp(`^${escapeRegex(client)}$`, 'i'),
            amount: amount,
            date: date,
          },
        ],
      });

      if (existing) {
        if (skipDuplicates && !overwriteDuplicates) {
          skipped++;
          continue;
        } else if (overwriteDuplicates) {
          existing.item = item.item || existing.item;
          existing.status = item.status || existing.status;
          existing.amount = amount;
          existing.date = date;
          if (item.metadata) existing.metadata = { ...(existing.metadata || {}), ...item.metadata };
          await existing.save();
          updated++;
          continue;
        }
      }

      const invoiceId = item.invoiceId || `INV-2026-${String(nextIndex).padStart(3, '0')}`;
      nextIndex++;

      await Sale.create({
        user: userId,
        invoiceId,
        client,
        amount,
        item: item.item || 'General Order',
        status: item.status || 'Paid',
        date,
        metadata: item.metadata || {},
      });
      inserted++;
    } catch (err) {
      errors.push({ index: i, message: err.message });
    }
  }

  return { inserted, updated, skipped, errors };
};

/**
 * Execute expense insertions
 */
const executeExpenseBatch = async (userId, rows, skipDuplicates, overwriteDuplicates) => {
  const currentCount = await Expense.countDocuments({ user: userId });
  let nextIndex = currentCount + 1;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    try {
      const title = String(item.title || '').trim();
      const amount = cleanNumber(item.amount);

      if (!title || isNaN(amount) || amount <= 0) {
        errors.push({ index: i, message: 'Invalid expense description or amount' });
        continue;
      }

      const date = formatDate(item.date);
      const incomingId = String(item.expenseId || item['Expense ID'] || item['Expense Id'] || '').trim();

      const existing = await Expense.findOne({
        user: userId,
        $or: [
          ...(incomingId ? [{ expenseId: new RegExp(`^${escapeRegex(incomingId)}$`, 'i') }] : []),
          {
            title: new RegExp(`^${escapeRegex(title)}$`, 'i'),
            amount: amount,
            date: date,
          },
        ],
      });

      if (existing) {
        if (skipDuplicates && !overwriteDuplicates) {
          skipped++;
          continue;
        } else if (overwriteDuplicates) {
          existing.category = item.category || existing.category;
          existing.vendor = item.vendor || existing.vendor;
          if (item.metadata) existing.metadata = { ...(existing.metadata || {}), ...item.metadata };
          await existing.save();
          updated++;
          continue;
        }
      }

      const expenseId = incomingId || `EXP-${100 + nextIndex}`;
      nextIndex++;

      await Expense.create({
        user: userId,
        expenseId,
        title,
        amount,
        category: item.category || 'Operations',
        vendor: item.vendor || 'Standard Vendor',
        date,
        metadata: item.metadata || {},
      });
      inserted++;
    } catch (err) {
      errors.push({ index: i, message: err.message });
    }
  }

  return { inserted, updated, skipped, errors };
};

/**
 * Execute inventory insertions
 */
const executeInventoryBatch = async (userId, rows, skipDuplicates, overwriteDuplicates) => {
  const currentCount = await Inventory.countDocuments({ user: userId });
  let nextIndex = currentCount + 1;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    try {
      const name = String(item.name || '').trim();
      const unitPrice = cleanNumber(item.unitPrice);

      if (!name || isNaN(unitPrice) || unitPrice < 0) {
        errors.push({ index: i, message: 'Invalid product name or unit price' });
        continue;
      }

      const incomingProdId = String(item.productId || item['Product ID'] || item['Product Id'] || '').trim();
      const existing = await Inventory.findOne({
        user: userId,
        $or: [
          ...(incomingProdId ? [{ productId: new RegExp(`^${escapeRegex(incomingProdId)}$`, 'i') }] : []),
          { name: new RegExp(`^${escapeRegex(name)}$`, 'i') },
        ],
      });

      if (existing) {
        if (skipDuplicates && !overwriteDuplicates) {
          skipped++;
          continue;
        } else if (overwriteDuplicates) {
          existing.stock = Number(item.stock ?? existing.stock);
          existing.unitPrice = unitPrice;
          existing.category = item.category || existing.category;
          existing.minStock = Number(item.minStock ?? existing.minStock);
          existing.unit = item.unit || existing.unit;
          if (item.metadata) existing.metadata = { ...(existing.metadata || {}), ...item.metadata };
          await existing.save();
          updated++;
          continue;
        }
      }

      const productId = `PRD-${String(nextIndex).padStart(2, '0')}`;
      nextIndex++;

      await Inventory.create({
        user: userId,
        productId,
        name,
        stock: Number(item.stock || 0),
        unitPrice,
        unit: item.unit || 'Units',
        minStock: Number(item.minStock || 10),
        category: item.category || 'General',
        metadata: item.metadata || {},
      });
      inserted++;
    } catch (err) {
      errors.push({ index: i, message: err.message });
    }
  }

  return { inserted, updated, skipped, errors };
};

/**
 * Execute ingredient purchase insertions safely as Raw Materials Inventory (NOT operational expenses)
 */
const executePurchasesBatch = async (userId, rows, skipDuplicates, overwriteDuplicates) => {
  const currentCount = await Inventory.countDocuments({ user: userId });
  let nextIndex = currentCount + 1;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows[i];
    try {
      const name = String(
        item.name ||
        item.title ||
        item['Ingredient / Item'] ||
        item['Item'] ||
        ''
      ).trim();

      if (!name) {
        errors.push({ index: i, message: 'Invalid ingredient or raw material name' });
        continue;
      }

      const rawStock =
        item.stock !== undefined
          ? item.stock
          : item.quantity !== undefined
          ? item.quantity
          : item['Quantity'];
      const stock = Math.max(0, parseInt(String(cleanNumber(rawStock) || '0'), 10) || 0);

      const rawTotal =
        item.amount !== undefined
          ? item.amount
          : item.cost !== undefined
          ? item.cost
          : item['Total Cost (INR)'] !== undefined
          ? item['Total Cost (INR)']
          : item['Total Cost'];
      const totalCost = cleanNumber(rawTotal);

      const rawPrice =
        item.unitPrice !== undefined
          ? item.unitPrice
          : item['Unit Cost (INR)'] !== undefined
          ? item['Unit Cost (INR)']
          : item['Unit Cost'];
      let unitPrice = cleanNumber(rawPrice);
      if ((isNaN(unitPrice) || unitPrice <= 0) && !isNaN(totalCost) && totalCost > 0 && stock > 0) {
        unitPrice = Math.round((totalCost / stock) * 100) / 100;
      }
      if (isNaN(unitPrice) || unitPrice < 0) unitPrice = 0;

      const unit = String(item.unit || item['Unit of Measure'] || item['Unit'] || 'kg').trim();
      const vendor = String(item.vendor || item.supplier || item['Supplier'] || 'Standard Supplier').trim();
      const date = formatDate(item.date || item['Purchase Date'] || item['Date']);
      const purchaseId = String(item.purchaseId || item['Purchase ID'] || item['Purchase Id'] || '').trim();

      // A purchase transaction is uniquely identified by purchaseId, or (name + date + vendor)
      const existing = purchaseId
        ? await Inventory.findOne({
            user: userId,
            'metadata.purchaseId': purchaseId,
          })
        : await Inventory.findOne({
            user: userId,
            name: new RegExp(`^${escapeRegex(name)}$`, 'i'),
            'metadata.purchaseDate': date,
            'metadata.supplier': vendor,
          });

      if (existing) {
        if (skipDuplicates && !overwriteDuplicates) {
          skipped++;
          continue;
        } else if (overwriteDuplicates) {
          existing.stock = stock;
          if (unitPrice > 0) existing.unitPrice = unitPrice;
          existing.category = 'Raw Materials';
          existing.unit = unit || existing.unit;
          existing.metadata = {
            ...(existing.metadata || {}),
            supplier: vendor,
            lastPurchaseDate: date,
            ...(purchaseId ? { lastPurchaseId: purchaseId } : {}),
            ...(totalCost ? { lastPurchaseCost: totalCost } : {}),
          };
          await existing.save();
          updated++;
          continue;
        }
      }

      const productId = `RM-${String(nextIndex).padStart(3, '0')}`;
      nextIndex++;

      await Inventory.create({
        user: userId,
        productId,
        name,
        stock,
        unitPrice,
        unit,
        minStock: 10,
        category: 'Raw Materials',
        metadata: {
          supplier: vendor,
          purchaseDate: date,
          ...(purchaseId ? { purchaseId } : {}),
          ...(totalCost ? { totalCost } : {}),
          ...(item.metadata || {}),
        },
      });
      inserted++;
    } catch (err) {
      errors.push({ index: i, message: err.message });
    }
  }

  return { inserted, updated, skipped, errors };
};

/**
 * @desc    Execute batch import to MongoDB for authenticated user
 * @route   POST /api/import/execute
 * @access  Private
 */
export const executeImport = async (req, res) => {
  try {
    const { type, rows, modules, skipDuplicates = true, overwriteDuplicates = false } = req.body;

    if (!type || !['sales', 'expenses', 'inventory', 'all'].includes(type)) {
      return res.status(400).json({ message: 'Invalid data type.' });
    }

    const userId = req.user._id;

    // 1. ALL FIELDS / MULTI-MODULE EXECUTION
    if (type === 'all') {
      const activeModules = modules || {};
      const salesRows = Array.isArray(activeModules.sales) ? activeModules.sales : [];
      const expenseRows = Array.isArray(activeModules.expenses) ? activeModules.expenses : [];
      const purchaseRows = Array.isArray(activeModules.purchases) ? activeModules.purchases : [];
      const inventoryRows = Array.isArray(activeModules.inventory) ? activeModules.inventory : [];

      const totalRows = salesRows.length + expenseRows.length + inventoryRows.length + purchaseRows.length;
      if (totalRows === 0) {
        return res.status(400).json({ message: 'No records provided to import across any module.' });
      }

      // Safe routing: purchaseRows is routed to executePurchasesBatch (Raw Materials Inventory), NEVER executeExpenseBatch!
      const [salesRes, expRes, invRes, purchaseRes] = await Promise.all([
        salesRows.length > 0 ? executeSalesBatch(userId, salesRows, skipDuplicates, overwriteDuplicates) : { inserted: 0, updated: 0, skipped: 0, errors: [] },
        expenseRows.length > 0 ? executeExpenseBatch(userId, expenseRows, skipDuplicates, overwriteDuplicates) : { inserted: 0, updated: 0, skipped: 0, errors: [] },
        inventoryRows.length > 0 ? executeInventoryBatch(userId, inventoryRows, skipDuplicates, overwriteDuplicates) : { inserted: 0, updated: 0, skipped: 0, errors: [] },
        purchaseRows.length > 0 ? executePurchasesBatch(userId, purchaseRows, skipDuplicates, overwriteDuplicates) : { inserted: 0, updated: 0, skipped: 0, errors: [] },
      ]);

      const totalInserted = salesRes.inserted + expRes.inserted + invRes.inserted + purchaseRes.inserted;
      const totalUpdated = salesRes.updated + expRes.updated + invRes.updated + purchaseRes.updated;
      const totalSkipped = salesRes.skipped + expRes.skipped + invRes.skipped + purchaseRes.skipped;
      const totalErrors = salesRes.errors.length + expRes.errors.length + invRes.errors.length + purchaseRes.errors.length;

      if (totalInserted > 0 || totalUpdated > 0) {
        const parts = [];
        if (salesRes.inserted > 0) parts.push(`${salesRes.inserted} sales`);
        if (expRes.inserted > 0) parts.push(`${expRes.inserted} expenses`);
        if (purchaseRes.inserted > 0) parts.push(`${purchaseRes.inserted} ingredient purchases`);
        if (invRes.inserted > 0) parts.push(`${invRes.inserted} products`);

        await Activity.create({
          user: userId,
          type: 'system',
          title: `Imported ${totalInserted} Records Across Modules`,
          time: 'Just now',
          detail: `Bulk import completed: ${parts.join(', ')} added to business workspace`,
          icon: 'import',
        });
      }

      return res.status(200).json({
        success: true,
        type: 'all',
        insertedCount: totalInserted,
        updatedCount: totalUpdated,
        skippedCount: totalSkipped,
        errorsCount: totalErrors,
        byModule: {
          sales: salesRes,
          expenses: expRes,
          purchases: purchaseRes,
          inventory: invRes,
        },
        message: `Successfully imported ${totalInserted + totalUpdated} records across all departments (${totalInserted} new added${totalUpdated > 0 ? `, ${totalUpdated} updated` : ''}${totalSkipped > 0 ? `, ${totalSkipped} skipped` : ''}).`,
      });
    }

    // 2. SINGLE MODULE EXECUTION
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'No records provided to import.' });
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errors = [];

    if (type === 'sales') {
      const sRes = await executeSalesBatch(userId, rows, skipDuplicates, overwriteDuplicates);
      insertedCount = sRes.inserted;
      updatedCount = sRes.updated;
      skippedCount = sRes.skipped;
      errors = sRes.errors;

      if (insertedCount > 0 || updatedCount > 0) {
        await Activity.create({
          user: userId,
          type: 'sale',
          title: `Imported ${insertedCount} Sales Invoices`,
          time: 'Just now',
          detail: `${insertedCount} new invoices recorded from spreadsheet upload`,
          icon: 'sale',
        });
      }
    } else if (type === 'expenses') {
      const eRes = await executeExpenseBatch(userId, rows, skipDuplicates, overwriteDuplicates);
      insertedCount = eRes.inserted;
      updatedCount = eRes.updated;
      skippedCount = eRes.skipped;
      errors = eRes.errors;

      if (insertedCount > 0 || updatedCount > 0) {
        await Activity.create({
          user: userId,
          type: 'expense',
          title: `Imported ${insertedCount} Expenses`,
          time: 'Just now',
          detail: `${insertedCount} expense entries added from spreadsheet upload`,
          icon: 'expense',
        });
      }
    } else if (type === 'inventory') {
      const iRes = await executeInventoryBatch(userId, rows, skipDuplicates, overwriteDuplicates);
      insertedCount = iRes.inserted;
      updatedCount = iRes.updated;
      skippedCount = iRes.skipped;
      errors = iRes.errors;

      if (insertedCount > 0 || updatedCount > 0) {
        await Activity.create({
          user: userId,
          type: 'system',
          title: `Imported ${insertedCount} Products`,
          time: 'Just now',
          detail: `${insertedCount} catalog items added to stock database from spreadsheet upload`,
          icon: 'inventory',
        });
      }
    }

    return res.status(200).json({
      success: true,
      type,
      insertedCount,
      updatedCount,
      skippedCount,
      errorsCount: errors.length,
      errors,
      message: `Successfully imported ${insertedCount + updatedCount} records (${insertedCount} new added${updatedCount > 0 ? `, ${updatedCount} updated` : ''}${skippedCount > 0 ? `, ${skippedCount} duplicate skipped` : ''}).`,
    });
  } catch (error) {
    console.error('Execute import error:', error);
    return res.status(500).json({ message: error.message || 'Error executing batch import' });
  }
};
