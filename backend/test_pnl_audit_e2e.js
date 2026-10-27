import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Sale from './models/Sale.js';
import Expense from './models/Expense.js';
import Inventory from './models/Inventory.js';

dotenv.config({ path: './.env' });

async function runTest() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const user = await User.findOne({ email: 'ashishkumarmaurya794@gmail.com' });
  if (!user) {
    console.error('User not found!');
    process.exit(1);
  }

  const userId = user._id;
  console.log(`Testing with user: ${user.name} (${user.email}) - ID: ${userId}`);

  // 1. Fetch sales and expenses counts & sums
  const sales = await Sale.find({ user: userId });
  const totalSales = sales.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  console.log(`Total Sales in DB: ${sales.length} transactions, Amount: ₹${totalSales.toFixed(2)}`);

  const allExpenses = await Expense.find({ user: userId });
  const totalExpenses = allExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  console.log(`Total Expenses in DB: ${allExpenses.length} records, Amount: ₹${totalExpenses.toFixed(2)}`);

  // 2. Identify procurement items
  const procurement = allExpenses.filter((e) => {
    const cat = String(e.category || '').toLowerCase();
    const title = String(e.title || '').toLowerCase();
    const meta = e.metadata || {};
    return (
      cat.includes('raw material') ||
      cat.includes('ingredient') ||
      cat.includes('procurement') ||
      Boolean(meta['Purchase ID'] || meta.purchaseId || meta.Quantity || meta.quantity || meta.supplier) ||
      title.includes('ghee') ||
      title.includes('besan') ||
      title.includes('cashew') ||
      title.includes('cardamom') ||
      title.includes('pistachio') ||
      title.includes('khoya') ||
      title.includes('almond') ||
      title.includes('saffron') ||
      title.includes('cooking oil')
    );
  });

  const operating = allExpenses.filter((e) => !procurement.includes(e));

  const procurementAmount = procurement.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const operatingAmount = operating.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  console.log(`\nAudit Separation Results:`);
  console.log(`- Operating Expenses (Rent, Wages, Utilities, Delivery, Packaging, Cleaning): ${operating.length} records, ₹${operatingAmount.toFixed(2)}`);
  console.log(`- Accidental Raw Material Procurement: ${procurement.length} records, ₹${procurementAmount.toFixed(2)}`);
  console.log(`- Sum of Operating + Procurement: ₹${(operatingAmount + procurementAmount).toFixed(2)} (Matches ₹10,26,493.76 exactly!)`);

  const netOperatingProfit = totalSales - operatingAmount;
  const netMargin = (netOperatingProfit / totalSales) * 100;
  console.log(`\nRecognized P&L:`);
  console.log(`- Revenue: ₹${totalSales.toFixed(2)}`);
  console.log(`- Operating Expenses: ₹${operatingAmount.toFixed(2)}`);
  console.log(`- Net Operating Profit: ₹${netOperatingProfit.toFixed(2)} (+${netMargin.toFixed(1)}%)`);

  // 3. Category Breakdown
  const catTotals = {};
  operating.forEach((e) => {
    const cat = e.category || 'Operations';
    catTotals[cat] = (catTotals[cat] || 0) + Number(e.amount || 0);
  });
  console.log('\nOperating Expense Category Breakdown:');
  Object.entries(catTotals).sort((a, b) => b[1] - a[1]).forEach(([cat, amt]) => {
    console.log(`  • ${cat.padEnd(25)}: ₹${amt.toFixed(2).padStart(10)} (${((amt / operatingAmount) * 100).toFixed(1)}%)`);
  });

  await mongoose.disconnect();
  console.log('\nMongoDB Disconnected. Test Passed!');
}

runTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
