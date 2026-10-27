import Expense from '../models/Expense.js';
import Activity from '../models/Activity.js';

/**
 * @desc    Get all expenses for authenticated user
 * @route   GET /api/expenses
 * @access  Private
 */
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    console.error(`Get expenses error: ${error.message}`);
    return res.status(500).json({ message: 'Error fetching expenses' });
  }
};

/**
 * @desc    Create a new expense entry
 * @route   POST /api/expenses
 * @access  Private
 */
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, vendor } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({ message: 'Title and amount are required' });
    }

    const count = await Expense.countDocuments({ user: req.user._id });
    const expenseId = `EXP-${101 + count}`;

    const newExpense = await Expense.create({
      user: req.user._id,
      expenseId,
      title,
      amount: Number(amount),
      category: category || 'Operations',
      vendor: vendor || 'Standard Vendor',
      date: new Date().toISOString().split('T')[0],
    });

    // Log Activity
    await Activity.create({
      user: req.user._id,
      type: 'expense',
      title: title,
      time: 'Just now',
      detail: `₹${Number(amount).toLocaleString('en-IN')}`,
      icon: 'expense',
    });

    return res.status(201).json(newExpense);
  } catch (error) {
    console.error(`Create expense error: ${error.message}`);
    return res.status(500).json({ message: error.message || 'Error creating expense' });
  }
};

/**
 * @desc    Delete an expense entry
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense record not found' });
    }
    return res.status(200).json({ message: 'Expense record removed', id: req.params.id });
  } catch (error) {
    console.error(`Delete expense error: ${error.message}`);
    return res.status(500).json({ message: 'Error deleting expense' });
  }
};

/**
 * @desc    Audit expenses for non-expense procurement items and duplicate imports
 * @route   GET /api/expenses/audit
 * @access  Private
 */
export const auditExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const allExpenses = await Expense.find({ user: userId }).sort({ date: -1, createdAt: -1 }).lean();

    const flaggedPurchases = [];
    const seenSignatures = new Map();
    const flaggedDuplicates = [];
    const validOpEx = [];

    allExpenses.forEach((exp) => {
      const isPurchase =
        exp.category === 'Raw Materials' ||
        exp.category === 'Inventory' ||
        !!exp.metadata?.['Purchase ID'] ||
        !!exp.metadata?.unitCost ||
        !!exp.metadata?.Quantity ||
        /milk|besan|cooking oil|cashew|ghee|almonds|sweet boxes|cardamom|sugar|pistachios|raw material/i.test(exp.title) && exp.metadata?.['Total Cost (INR)'];

      if (isPurchase) {
        flaggedPurchases.push({
          ...exp,
          auditReason: exp.category === 'Raw Materials'
            ? 'Ingredient Purchase imported as Raw Materials expense'
            : 'Ingredient Purchase imported with Unit Cost into Operations',
        });
        return;
      }

      // Check duplicate in operating expenses
      const sig = `${exp.title.toLowerCase()}|${exp.amount}|${exp.date}|${(exp.vendor || '').toLowerCase()}`;
      if (seenSignatures.has(sig)) {
        flaggedDuplicates.push({
          ...exp,
          auditReason: `Exact duplicate of another operating expense (${exp.title}, ₹${exp.amount}, ${exp.date})`,
          duplicateOfId: seenSignatures.get(sig)._id,
        });
      } else {
        seenSignatures.set(sig, exp);
        validOpEx.push(exp);
      }
    });

    const totalAmount = allExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const validOpExAmount = validOpEx.reduce((s, e) => s + Number(e.amount || 0), 0);
    const flaggedPurchasesAmount = flaggedPurchases.reduce((s, e) => s + Number(e.amount || 0), 0);
    const flaggedDuplicatesAmount = flaggedDuplicates.reduce((s, e) => s + Number(e.amount || 0), 0);

    return res.status(200).json({
      success: true,
      summary: {
        totalCount: allExpenses.length,
        totalAmount,
        validOpExCount: validOpEx.length,
        validOpExAmount,
        flaggedPurchasesCount: flaggedPurchases.length,
        flaggedPurchasesAmount,
        flaggedDuplicatesCount: flaggedDuplicates.length,
        flaggedDuplicatesAmount,
        hasAuditIssues: flaggedPurchases.length > 0 || flaggedDuplicates.length > 0,
      },
      flaggedPurchases,
      flaggedDuplicates,
    });
  } catch (error) {
    console.error(`Audit expenses error: ${error.message}`);
    return res.status(500).json({ message: 'Error auditing expenses' });
  }
};

/**
 * @desc    Safely clean up or reclassify audited expense records (with user confirmation)
 * @route   POST /api/expenses/cleanup-audit
 * @access  Private
 */
export const cleanupAuditExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { action, recordIds } = req.body;

    if (!Array.isArray(recordIds) || recordIds.length === 0) {
      return res.status(400).json({ message: 'No record IDs provided for cleanup' });
    }

    if (!['remove', 'reclassify'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be "remove" or "reclassify"' });
    }

    // Find target records strictly scoped to this authenticated user
    const records = await Expense.find({
      user: userId,
      _id: { $in: recordIds },
    });

    if (records.length === 0) {
      return res.status(404).json({ message: 'No matching records found for this account' });
    }

    let reclassifiedCount = 0;
    if (action === 'reclassify') {
      const Inventory = (await import('../models/Inventory.js')).default;
      for (const rec of records) {
        const name = rec.title || 'Raw Material Item';
        const escapedName = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existingInv = await Inventory.findOne({
          user: userId,
          name: new RegExp(`^${escapedName}$`, 'i'),
        });

        const stockQty = Math.max(1, parseInt(String(rec.metadata?.Quantity || '10'), 10) || 10);
        const unitPrice = Number(rec.metadata?.['Unit Cost (INR)'] || rec.metadata?.unitCost || rec.amount || 100);
        const unit = String(rec.metadata?.Unit || 'kg');

        if (existingInv) {
          existingInv.stock = (existingInv.stock || 0) + stockQty;
          if (rec.metadata) {
            existingInv.metadata = { ...(existingInv.metadata || {}), ...rec.metadata };
          }
          await existingInv.save();
        } else {
          await Inventory.create({
            user: userId,
            productId: rec.metadata?.['Purchase ID'] || `RM-${Date.now().toString().slice(-4)}`,
            name,
            stock: stockQty,
            unit,
            minStock: 10,
            unitPrice,
            category: 'Raw Materials',
            metadata: {
              vendor: rec.vendor,
              purchaseDate: rec.date,
              totalCost: rec.amount,
              ...(rec.metadata || {}),
            },
          });
        }
        reclassifiedCount++;
      }
    }

    // Delete records from Expense collection
    const deleteRes = await Expense.deleteMany({
      user: userId,
      _id: { $in: recordIds },
    });

    // Log Activity for audit trail
    await Activity.create({
      user: userId,
      type: 'system',
      title: action === 'reclassify'
        ? `Reclassified ${records.length} Procurement Records to Inventory`
        : `Removed ${records.length} Duplicate / Non-Expense Records`,
      time: 'Just now',
      detail: `P&L audit cleanup: ${records.length} records safely removed from Expenses`,
      icon: 'check',
    });

    return res.status(200).json({
      success: true,
      action,
      removedCount: deleteRes.deletedCount,
      reclassifiedCount,
      message: action === 'reclassify'
        ? `Successfully reclassified ${reclassifiedCount} ingredient purchase records to Inventory and excluded them from Operating Expenses.`
        : `Successfully removed ${deleteRes.deletedCount} duplicate/non-expense records from your Expenses.`,
    });
  } catch (error) {
    console.error(`Cleanup audit expenses error: ${error.message}`);
    return res.status(500).json({ message: error.message || 'Error cleaning up audit expenses' });
  }
};
