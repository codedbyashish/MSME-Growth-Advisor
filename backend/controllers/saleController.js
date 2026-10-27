import Sale from '../models/Sale.js';
import Activity from '../models/Activity.js';

/**
 * @desc    Get all sales for the authenticated user
 * @route   GET /api/sales
 * @access  Private
 */
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(sales);
  } catch (error) {
    console.error(`Get sales error: ${error.message}`);
    return res.status(500).json({ message: 'Error fetching sales' });
  }
};

/**
 * @desc    Create a new sale invoice
 * @route   POST /api/sales
 * @access  Private
 */
export const createSale = async (req, res) => {
  try {
    const { client, amount, item, status, quantity, metadata, date } = req.body;

    if (!client || amount === undefined) {
      return res.status(400).json({ message: 'Client name and amount are required' });
    }

    const count = await Sale.countDocuments({ user: req.user._id });
    const invoiceId = `INV-2026-${String(count + 1).padStart(3, '0')}`;

    const newSale = await Sale.create({
      user: req.user._id,
      invoiceId,
      client,
      amount: Number(amount),
      item: item || 'General Order',
      status: status || 'Paid',
      date: date || new Date().toISOString().split('T')[0],
      quantity: quantity !== undefined && !isNaN(Number(quantity)) ? Number(quantity) : undefined,
      metadata: metadata || undefined,
    });

    // Log Activity
    await Activity.create({
      user: req.user._id,
      type: 'sale',
      title: `Bulk Sale to '${client}'`,
      time: 'Just now',
      detail: `₹${Number(amount).toLocaleString('en-IN')}`,
      icon: 'sale',
    });

    return res.status(201).json(newSale);
  } catch (error) {
    console.error(`Create sale error: ${error.message}`);
    return res.status(500).json({ message: error.message || 'Error creating sale' });
  }
};

/**
 * @desc    Update a sale invoice (e.g. payment status)
 * @route   PUT /api/sales/:id
 * @access  Private
 */
export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, user: req.user._id });
    if (!sale) {
      return res.status(404).json({ message: 'Sale invoice not found' });
    }

    if (req.body.status) sale.status = req.body.status;
    if (req.body.client) sale.client = req.body.client;
    if (req.body.amount !== undefined) sale.amount = Number(req.body.amount);
    if (req.body.item) sale.item = req.body.item;
    if (req.body.date) sale.date = req.body.date;

    const updatedSale = await sale.save();
    return res.status(200).json(updatedSale);
  } catch (error) {
    console.error(`Update sale error: ${error.message}`);
    return res.status(500).json({ message: error.message || 'Error updating sale' });
  }
};

/**
 * @desc    Delete a sale invoice
 * @route   DELETE /api/sales/:id
 * @access  Private
 */
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!sale) {
      return res.status(404).json({ message: 'Sale invoice not found' });
    }
    return res.status(200).json({ message: 'Sale invoice removed', id: req.params.id });
  } catch (error) {
    console.error(`Delete sale error: ${error.message}`);
    return res.status(500).json({ message: 'Error deleting sale' });
  }
};


