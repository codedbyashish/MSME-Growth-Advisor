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
