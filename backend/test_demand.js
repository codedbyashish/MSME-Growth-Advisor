import assert from 'assert';
import { calculateProductDemandMetrics } from '../MSME/src/utils/demandCalculator.js';

console.log('--- RUNNING HIGH-DEMAND PRODUCT & FORECASTING ENGINE TESTS ---');

const anchorDate = new Date('2026-10-27T12:00:00Z');
const DAY_MS = 24 * 60 * 60 * 1000;
const d = (daysAgo) => new Date(anchorDate.getTime() - daysAgo * DAY_MS).toISOString().split('T')[0];

// Test Catalog
const inventory = [
  { id: 'p1', name: 'Cotton Fabric Roll', category: 'Textiles', stock: 5, minStock: 10, unitPrice: 2000, unit: 'Rolls' },
  { id: 'p2', name: 'Silk Sarees', category: 'Textiles', stock: 50, minStock: 10, unitPrice: 5000, unit: 'Pieces' },
  { id: 'p3', name: 'Linen Shirts', category: 'Apparel', stock: 8, minStock: 15, unitPrice: 1200, unit: 'Pieces' },
  { id: 'p4', name: 'Denim Jeans', category: 'Apparel', stock: 100, minStock: 20, unitPrice: 1800, unit: 'Pairs' },
  { id: 'p5', name: 'Jute Bags', category: 'Packaging', stock: 2, minStock: 20, unitPrice: 150, unit: 'Bags' },
  { id: 'p6', name: 'Leather Belts', category: 'Accessories', stock: 30, minStock: 10, unitPrice: 600, unit: 'Pieces' },
];

// Test Sales Data
const sales = [
  // Cotton Fabric Roll: 20 units in current 30d, 10 units in previous 30d => +100% growth, High Demand, stock=5 (min=10) => Potential Stockout / Restock Soon
  { id: 's1', client: 'Customer A', item: 'Cotton Fabric Roll', date: d(5), quantity: 12, amount: 24000, status: 'Paid' },
  { id: 's2', client: 'Customer B', item: 'Cotton Fabric Roll', date: d(15), quantity: 8, amount: 16000, status: 'Paid' },
  { id: 's3', client: 'Customer C', item: 'Cotton Fabric Roll', date: d(35), quantity: 10, amount: 20000, status: 'Paid' },

  // Silk Sarees: 15 units in current 30d, 0 units in prev 30d => New Demand, stock=50 (min=10) => Monitor Stock
  { id: 's4', client: 'Customer D', item: 'Silk Sarees', date: d(10), quantity: 15, amount: 75000, status: 'Paid' },

  // Linen Shirts: 8 units in current 30d, 12 units in prev 30d => -33.3% negative growth, stock=8 (min=15)
  { id: 's5', client: 'Customer E', item: 'Linen Shirts', date: d(8), quantity: 8, amount: 9600, status: 'Paid' },
  { id: 's6', client: 'Customer F', item: 'Linen Shirts', date: d(40), quantity: 12, amount: 14400, status: 'Paid' },

  // Jute Bags: 50 units in current 30d, 20 units in prev 30d => +150% growth, stock=2 => Potential Stockout
  { id: 's7', client: 'Customer G', item: 'Jute Bags', date: d(2), quantity: 50, amount: 7500, status: 'Paid' },
  { id: 's8', client: 'Customer H', item: 'Jute Bags', date: d(45), quantity: 20, amount: 3000, status: 'Paid' },

  // Cancelled order for Denim Jeans - should be excluded
  { id: 's9', client: 'Customer X', item: 'Denim Jeans', date: d(12), quantity: 100, amount: 180000, status: 'Cancelled' },
  // Refunded order - should be excluded
  { id: 's10', client: 'Customer Y', item: 'Denim Jeans', date: d(14), quantity: 50, amount: 90000, status: 'Refunded' },

  // Denim Jeans: genuine sale in current 30d = 5 units, prev = 5 units => 0% growth, stock=100 => Stock Sufficient
  { id: 's11', client: 'Customer Z', item: 'Denim Jeans', date: d(20), quantity: 5, amount: 9000, status: 'Paid' },
  { id: 's12', client: 'Customer Z', item: 'Denim Jeans', date: d(50), quantity: 5, amount: 9000, status: 'Paid' },
];

console.log('1. Calculating demand metrics...');
const result = calculateProductDemandMetrics(sales, inventory);

console.log('2. Verifying exclusion of cancelled/refunded sales...');
const denim = result.products.find((p) => p.name === 'Denim Jeans');
assert.strictEqual(denim.currentUnits, 5, 'Cancelled/refunded orders must be excluded from Denim Jeans');
assert.strictEqual(denim.prevUnits, 5, 'Denim prev units should be 5');
assert.strictEqual(denim.demandGrowth, 0, 'Denim demand growth should be 0%');
console.log('✓ Cancelled/refunded orders correctly excluded.');

console.log('3. Verifying actual percentage growth calculation (Prev > 0)...');
const cotton = result.products.find((p) => p.name === 'Cotton Fabric Roll');
assert.strictEqual(cotton.currentUnits, 20, 'Cotton current units should be 20');
assert.strictEqual(cotton.prevUnits, 10, 'Cotton prev units should be 10');
assert.strictEqual(cotton.demandGrowth, 100, 'Cotton demand growth should be +100%');
assert.strictEqual(cotton.demandStatus, 'High Demand');
console.log('✓ Growth calculation passed:', cotton.growthDisplay);

console.log('4. Verifying New Demand handling (Prev == 0, Current > 0)...');
const silk = result.products.find((p) => p.name === 'Silk Sarees');
assert.strictEqual(silk.currentUnits, 15);
assert.strictEqual(silk.prevUnits, 0);
assert.strictEqual(silk.growthDisplay, 'New Demand');
assert.strictEqual(silk.growthType, 'new_demand');
console.log('✓ New Demand correctly classified:', silk.growthDisplay);

console.log('5. Verifying Stockout & Restock Recommendations...');
// Jute bags: current=50, prev=20, stock=2 => forecast ~44 => Potential Stockout
const jute = result.products.find((p) => p.name === 'Jute Bags');
assert.strictEqual(jute.recommendation, 'Potential Stockout');
assert.strictEqual(jute.stockAlert, true);

// Cotton: current=20, prev=10, stock=5 => forecast ~23 => Potential Stockout
assert.strictEqual(cotton.recommendation, 'Potential Stockout');

// Silk: current=15, prev=0, stock=50 (min=10) => Monitor Stock
assert.strictEqual(silk.recommendation, 'Monitor Stock');

// Denim: current=5, prev=5, stock=100 (min=20) => Stock Sufficient
assert.strictEqual(denim.recommendation, 'Stock Sufficient');
console.log('✓ Restock recommendations verified for all categories.');

console.log('6. Verifying Top 5 High-Demand ranking for Dashboard...');
assert.strictEqual(result.topHighDemand.length, 5, 'Should return top 5 items for dashboard');
assert.strictEqual(result.topHighDemand[0].name, 'Jute Bags', 'Highest volume (50) should be #1');
assert.strictEqual(result.topHighDemand[1].name, 'Cotton Fabric Roll', 'Second highest volume (20) should be #2');
assert.strictEqual(result.topHighDemand[2].name, 'Silk Sarees', 'Third highest volume (15) should be #3');
console.log('✓ Top 5 ranked correctly for dashboard.');

console.log('7. Verifying Insufficient History handling...');
const emptyResult = calculateProductDemandMetrics([], inventory);
assert.strictEqual(emptyResult.summary.hasSalesData, false);
emptyResult.products.forEach((p) => {
  assert.strictEqual(p.currentUnits, 0);
  assert.strictEqual(p.prevUnits, 0);
  assert.strictEqual(p.growthDisplay, 'Insufficient History');
});
console.log('✓ Insufficient history correctly detected and formatted.');

console.log('ALL DEMAND ENGINE TESTS PASSED SUCCESSFULLY! 🎉');
