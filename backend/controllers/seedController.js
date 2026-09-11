import Sale from '../models/Sale.js';
import Expense from '../models/Expense.js';
import Inventory from '../models/Inventory.js';
import Activity from '../models/Activity.js';

const defaultSales = [
  { invoiceId: 'INV-2026-001', client: 'Metro Distributors', amount: 45000, status: 'Paid', date: '2026-08-07', item: 'Cotton Blends' },
  { invoiceId: 'INV-2026-002', client: 'Sia Designs', amount: 82000, status: 'Paid', date: '2026-08-06', item: 'Raw Silk Fabric' },
  { invoiceId: 'INV-2026-003', client: 'Apex Retailers', amount: 120000, status: 'Pending', date: '2026-08-05', item: 'Synthetic Yarns' },
  { invoiceId: 'INV-2026-004', client: 'Kishan Crafts', amount: 35000, status: 'Paid', date: '2026-08-04', item: 'Cotton Blends' },
  { invoiceId: 'INV-2026-005', client: 'Vardhman Textiles', amount: 143000, status: 'Paid', date: '2026-08-02', item: 'Raw Silk Fabric' },
];

const defaultExpenses = [
  { expenseId: 'EXP-101', title: 'Inventory Restock: Raw Materials', amount: 12800, category: 'Inventory', date: '2026-08-06', vendor: 'Surat Weavers Co.' },
  { expenseId: 'EXP-102', title: 'Factory Electricity Bill', amount: 24500, category: 'Operations', date: '2026-08-04', vendor: 'State Electricity Board' },
  { expenseId: 'EXP-103', title: 'Digital Ad Campaign - August', amount: 18000, category: 'Marketing', date: '2026-08-03', vendor: 'Google Ads' },
  { expenseId: 'EXP-104', title: 'Logistics & Packaging Supplies', amount: 9500, category: 'Others', date: '2026-08-02', vendor: 'Speedy Delivery Services' },
];

const defaultInventory = [
  { productId: 'PRD-01', name: 'Cotton Blends', stock: 450, unit: 'Meters', minStock: 200, unitPrice: 320, category: 'Textiles' },
  { productId: 'PRD-02', name: 'Raw Silk Fabric', stock: 120, unit: 'Meters', minStock: 150, unitPrice: 850, category: 'Premium' },
  { productId: 'PRD-03', name: 'Synthetic Yarns', stock: 890, unit: 'Spools', minStock: 300, unitPrice: 180, category: 'Raw Materials' },
  { productId: 'PRD-04', name: 'Polyester Thread Rolls', stock: 65, unit: 'Boxes', minStock: 100, unitPrice: 450, category: 'Accessories' },
];

const defaultActivities = [
  { type: 'sale', title: "Bulk Sale to 'Metro Distributors'", time: 'Today, 10:45 AM', detail: '₹45,000', icon: 'sale' },
  { type: 'expense', title: "Inventory Restock: Raw Materials", time: 'Yesterday, 04:20 PM', detail: '₹12,800', icon: 'expense' },
  { type: 'customer', title: "New Customer Registered: 'Sia Designs'", time: 'Yesterday, 11:15 AM', detail: 'Mumbai Region', icon: 'customer' },
];

/**
 * @desc    Seed initial default data for user in MongoDB
 * @route   POST /api/seed
 * @access  Private
 */
export const seedUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if sales exist, if not insert default sales
    const salesCount = await Sale.countDocuments({ user: userId });
    if (salesCount === 0) {
      await Sale.insertMany(defaultSales.map(s => ({ ...s, user: userId })));
    }

    // Check expenses
    const expCount = await Expense.countDocuments({ user: userId });
    if (expCount === 0) {
      await Expense.insertMany(defaultExpenses.map(e => ({ ...e, user: userId })));
    }

    // Check inventory
    const invCount = await Inventory.countDocuments({ user: userId });
    if (invCount === 0) {
      await Inventory.insertMany(defaultInventory.map(i => ({ ...i, user: userId })));
    }

    // Check activities
    const actCount = await Activity.countDocuments({ user: userId });
    if (actCount === 0) {
      await Activity.insertMany(defaultActivities.map(a => ({ ...a, user: userId })));
    }

    return res.status(200).json({ message: 'User database successfully seeded with initial starter data' });
  } catch (error) {
    console.error(`Seed user data error: ${error.message}`);
    return res.status(500).json({ message: 'Error seeding user data' });
  }
};
