import Sale from '../models/Sale.js';
import Expense from '../models/Expense.js';
import Inventory from '../models/Inventory.js';
import Activity from '../models/Activity.js';

/**
 * Standardize date to YYYY-MM-DD
 */
const formatDate = (val) => {
  if (!val) return new Date().toISOString().split('T')[0];

  // If already YYYY-MM-DD
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
    return val.trim();
  }

  // Handle Excel serial date numbers (e.g. 45220)
  if (typeof val === 'number') {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const dateObj = new Date(excelEpoch.getTime() + val * 86400000);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0];
    }
  }

  const parsed = new Date(val);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
};

/**
 * @desc    Validate uploaded spreadsheet rows and detect potential duplicates
 * @route   POST /api/import/validate
 * @access  Private
 */
export const validateImportData = async (req, res) => {
  try {
    const { type, rows } = req.body;

    if (!type || !['sales', 'expenses', 'inventory'].includes(type)) {
      return res.status(400).json({ message: 'Invalid data type. Must be sales, expenses, or inventory.' });
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'No rows provided to validate.' });
    }

    if (rows.length > 2000) {
      return res.status(400).json({ message: 'Batch limit exceeded. Maximum 2,000 rows permitted per upload.' });
    }

    const userId = req.user._id;

    // Fetch existing records for duplicate matching
    let existingSales = [];
    let existingExpenses = [];
    let existingInventory = [];

    if (type === 'sales') {
      existingSales = await Sale.find({ user: userId }).select('client amount date invoiceId').lean();
    } else if (type === 'expenses') {
      existingExpenses = await Expense.find({ user: userId }).select('title amount date expenseId').lean();
    } else if (type === 'inventory') {
      existingInventory = await Inventory.find({ user: userId }).select('name category productId').lean();
    }

    const validRows = [];
    const invalidRows = [];
    const duplicateRows = [];

    rows.forEach((row, idx) => {
      const rowNum = idx + 1;
      const errors = [];
      let parsed = {};

      if (type === 'sales') {
        const client = String(row.client || row.customer || '').trim();
        const rawAmount = row.amount !== undefined ? row.amount : row.total;
        const amount = Number(String(rawAmount || '').replace(/[^0-9.-]+/g, ''));
        const item = String(row.item || row.description || row.product || 'General Order').trim();
        let status = String(row.status || 'Paid').trim();
        
        // Capitalize status properly
        if (/paid/i.test(status)) status = 'Paid';
        else if (/pending/i.test(status) || /unpaid/i.test(status)) status = 'Pending';
        else if (/overdue/i.test(status) || /due/i.test(status)) status = 'Overdue';
        else status = 'Paid';

        const date = formatDate(row.date);

        if (!client) {
          errors.push('Customer / Client name is required');
        }
        if (isNaN(amount) || amount <= 0) {
          errors.push('Amount must be a positive numeric value');
        }

        parsed = { client, amount, item, status, date };

        if (errors.length === 0) {
          // Check for duplicate in existing database records
          const isDuplicate = existingSales.some(
            (s) =>
              s.client.toLowerCase() === client.toLowerCase() &&
              Math.abs(s.amount - amount) < 0.01 &&
              s.date === date
          );

          if (isDuplicate) {
            duplicateRows.push({ rowNumber: rowNum, data: parsed, reason: 'Matches existing invoice with same customer, date, and amount' });
          }
          validRows.push({ rowNumber: rowNum, data: parsed, isDuplicate });
        } else {
          invalidRows.push({ rowNumber: rowNum, data: row, errors });
        }
      } else if (type === 'expenses') {
        const title = String(row.title || row.description || row.expense || '').trim();
        const rawAmount = row.amount !== undefined ? row.amount : row.cost;
        const amount = Number(String(rawAmount || '').replace(/[^0-9.-]+/g, ''));
        const category = String(row.category || 'Operations').trim();
        const vendor = String(row.vendor || row.supplier || 'Standard Vendor').trim();
        const date = formatDate(row.date);

        if (!title) {
          errors.push('Expense title / description is required');
        }
        if (isNaN(amount) || amount <= 0) {
          errors.push('Amount must be a positive numeric value');
        }

        parsed = { title, amount, category, vendor, date };

        if (errors.length === 0) {
          const isDuplicate = existingExpenses.some(
            (e) =>
              e.title.toLowerCase() === title.toLowerCase() &&
              Math.abs(e.amount - amount) < 0.01 &&
              e.date === date
          );

          if (isDuplicate) {
            duplicateRows.push({ rowNumber: rowNum, data: parsed, reason: 'Matches existing expense with same title, date, and amount' });
          }
          validRows.push({ rowNumber: rowNum, data: parsed, isDuplicate });
        } else {
          invalidRows.push({ rowNumber: rowNum, data: row, errors });
        }
      } else if (type === 'inventory') {
        const name = String(row.name || row.product || row.item || '').trim();
        const rawStock = row.stock !== undefined ? row.stock : row.quantity;
        const stock = Math.max(0, parseInt(String(rawStock || '0').replace(/[^0-9]+/g, ''), 10) || 0);
        const rawPrice = row.unitPrice !== undefined ? row.unitPrice : row.price;
        const unitPrice = Number(String(rawPrice || '').replace(/[^0-9.-]+/g, ''));
        const unit = String(row.unit || 'Units').trim();
        const minStock = Math.max(0, parseInt(String(row.minStock || '10').replace(/[^0-9]+/g, ''), 10) || 10);
        const category = String(row.category || 'General').trim();

        if (!name) {
          errors.push('Product / Item name is required');
        }
        if (isNaN(unitPrice) || unitPrice < 0) {
          errors.push('Unit price must be a valid non-negative number');
        }

        parsed = { name, stock, unitPrice, unit, minStock, category };

        if (errors.length === 0) {
          const existingMatch = existingInventory.find(
            (inv) => inv.name.toLowerCase() === name.toLowerCase()
          );

          const isDuplicate = !!existingMatch;
          if (isDuplicate) {
            duplicateRows.push({
              rowNumber: rowNum,
              data: parsed,
              existingId: existingMatch._id,
              reason: `Product with name '${name}' already exists in inventory`,
            });
          }
          validRows.push({ rowNumber: rowNum, data: parsed, isDuplicate, existingId: existingMatch?._id });
        } else {
          invalidRows.push({ rowNumber: rowNum, data: row, errors });
        }
      }
    });

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
 * @desc    Execute batch import to MongoDB for authenticated user
 * @route   POST /api/import/execute
 * @access  Private
 */
export const executeImport = async (req, res) => {
  try {
    const { type, rows, skipDuplicates = true, overwriteDuplicates = false } = req.body;

    if (!type || !['sales', 'expenses', 'inventory'].includes(type)) {
      return res.status(400).json({ message: 'Invalid data type.' });
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'No records provided to import.' });
    }

    const userId = req.user._id;
    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    if (type === 'sales') {
      const currentCount = await Sale.countDocuments({ user: userId });
      let nextIndex = currentCount + 1;

      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        try {
          if (!item.client || item.amount === undefined || isNaN(Number(item.amount))) {
            errors.push({ index: i, message: 'Invalid client or amount' });
            continue;
          }

          // Check duplicate
          const existing = await Sale.findOne({
            user: userId,
            client: new RegExp(`^${item.client.trim()}$`, 'i'),
            amount: Number(item.amount),
            date: item.date || formatDate(null),
          });

          if (existing) {
            if (skipDuplicates && !overwriteDuplicates) {
              skippedCount++;
              continue;
            } else if (overwriteDuplicates) {
              existing.item = item.item || existing.item;
              existing.status = item.status || existing.status;
              await existing.save();
              updatedCount++;
              continue;
            }
          }

          const invoiceId = `INV-2026-${String(nextIndex).padStart(3, '0')}`;
          nextIndex++;

          await Sale.create({
            user: userId,
            invoiceId,
            client: String(item.client).trim(),
            amount: Number(item.amount),
            item: item.item || 'General Order',
            status: item.status || 'Paid',
            date: item.date || formatDate(null),
          });
          insertedCount++;
        } catch (err) {
          errors.push({ index: i, message: err.message });
        }
      }

      if (insertedCount > 0 || updatedCount > 0) {
        await Activity.create({
          user: userId,
          type: 'sale',
          title: `Bulk Imported ${insertedCount + updatedCount} Sales Invoices`,
          time: 'Just now',
          detail: `${insertedCount} new invoices recorded from spreadsheet`,
          icon: 'sale',
        });
      }
    } else if (type === 'expenses') {
      const currentCount = await Expense.countDocuments({ user: userId });
      let nextIndex = currentCount + 1;

      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        try {
          if (!item.title || item.amount === undefined || isNaN(Number(item.amount))) {
            errors.push({ index: i, message: 'Invalid title or amount' });
            continue;
          }

          const existing = await Expense.findOne({
            user: userId,
            title: new RegExp(`^${item.title.trim()}$`, 'i'),
            amount: Number(item.amount),
            date: item.date || formatDate(null),
          });

          if (existing) {
            if (skipDuplicates && !overwriteDuplicates) {
              skippedCount++;
              continue;
            } else if (overwriteDuplicates) {
              existing.category = item.category || existing.category;
              existing.vendor = item.vendor || existing.vendor;
              await existing.save();
              updatedCount++;
              continue;
            }
          }

          const expenseId = `EXP-${101 + nextIndex}`;
          nextIndex++;

          await Expense.create({
            user: userId,
            expenseId,
            title: String(item.title).trim(),
            amount: Number(item.amount),
            category: item.category || 'Operations',
            vendor: item.vendor || 'Standard Vendor',
            date: item.date || formatDate(null),
          });
          insertedCount++;
        } catch (err) {
          errors.push({ index: i, message: err.message });
        }
      }

      if (insertedCount > 0 || updatedCount > 0) {
        await Activity.create({
          user: userId,
          type: 'expense',
          title: `Bulk Imported ${insertedCount + updatedCount} Expenses`,
          time: 'Just now',
          detail: `${insertedCount} expenses recorded from spreadsheet`,
          icon: 'expense',
        });
      }
    } else if (type === 'inventory') {
      const currentCount = await Inventory.countDocuments({ user: userId });
      let nextIndex = currentCount + 1;

      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        try {
          if (!item.name || item.unitPrice === undefined || isNaN(Number(item.unitPrice))) {
            errors.push({ index: i, message: 'Invalid product name or unit price' });
            continue;
          }

          const existing = await Inventory.findOne({
            user: userId,
            name: new RegExp(`^${item.name.trim()}$`, 'i'),
          });

          if (existing) {
            if (skipDuplicates && !overwriteDuplicates) {
              skippedCount++;
              continue;
            } else if (overwriteDuplicates) {
              existing.stock = Number(item.stock ?? existing.stock);
              existing.unitPrice = Number(item.unitPrice ?? existing.unitPrice);
              existing.category = item.category || existing.category;
              existing.minStock = Number(item.minStock ?? existing.minStock);
              existing.unit = item.unit || existing.unit;
              await existing.save();
              updatedCount++;
              continue;
            }
          }

          const productId = `PRD-${String(nextIndex).padStart(2, '0')}`;
          nextIndex++;

          await Inventory.create({
            user: userId,
            productId,
            name: String(item.name).trim(),
            stock: Number(item.stock || 0),
            unitPrice: Number(item.unitPrice || 0),
            unit: item.unit || 'Units',
            minStock: Number(item.minStock || 10),
            category: item.category || 'General',
          });
          insertedCount++;
        } catch (err) {
          errors.push({ index: i, message: err.message });
        }
      }

      if (insertedCount > 0 || updatedCount > 0) {
        await Activity.create({
          user: userId,
          type: 'system',
          title: `Bulk Imported ${insertedCount + updatedCount} Inventory Products`,
          time: 'Just now',
          detail: `${insertedCount} catalog items added to stock database`,
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
      message: `Successfully processed ${insertedCount + updatedCount} records (${insertedCount} added, ${updatedCount} updated, ${skippedCount} skipped).`,
    });
  } catch (error) {
    console.error('Execute import error:', error);
    return res.status(500).json({ message: error.message || 'Error executing batch import' });
  }
};
