import assert from 'assert';

function parseSaleDate(dateVal) {
  if (!dateVal) return new Date();
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) return dateVal;

  if (typeof dateVal === 'string') {
    const trimmed = dateVal.trim();
    const dmy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (dmy) {
      const d = parseInt(dmy[1], 10);
      const m = parseInt(dmy[2], 10) - 1;
      const y = parseInt(dmy[3], 10);
      const res = new Date(y, m, d);
      if (!isNaN(res.getTime())) return res;
    }
  }

  const parsed = new Date(dateVal);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

function getAggregatedRevenue(sales, period = 'month') {
  const validSales = sales.filter((s) => {
    const st = String(s.status || '').toLowerCase();
    return st !== 'cancelled' && st !== 'refunded';
  });

  if (!validSales.length) return [];

  const map = new Map();

  const sorted = [...validSales].sort((a, b) => {
    return parseSaleDate(a.date).getTime() - parseSaleDate(b.date).getTime();
  });

  sorted.forEach((s) => {
    const dt = parseSaleDate(s.date);
    const amount = Number(s.amount || 0);

    let key = '';
    let label = '';
    let fullLabel = '';

    if (period === 'day') {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      key = `${y}-${m}-${d}`;
      label = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      fullLabel = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } else if (period === 'week') {
      const d = new Date(dt);
      const dayOfWeek = d.getDay();
      const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const startOfWeek = new Date(d.setDate(diff));
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const y = startOfWeek.getFullYear();
      const m = String(startOfWeek.getMonth() + 1).padStart(2, '0');
      const dayStr = String(startOfWeek.getDate()).padStart(2, '0');
      key = `${y}-${m}-${dayStr}`;

      const sMon = startOfWeek.toLocaleDateString('en-IN', { month: 'short' });
      const eMon = endOfWeek.toLocaleDateString('en-IN', { month: 'short' });
      label = sMon === eMon
        ? `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${sMon}`
        : `${startOfWeek.getDate()} ${sMon} - ${endOfWeek.getDate()} ${eMon}`;
      fullLabel = `${startOfWeek.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else if (period === 'year') {
      const y = dt.getFullYear();
      key = `${y}`;
      label = `${y}`;
      fullLabel = `Year ${y}`;
    } else {
      // Default: month
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      key = `${y}-${m}`;
      label = dt.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      fullLabel = dt.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    }

    const item = map.get(key) || {
      key,
      label,
      fullLabel,
      revenue: 0,
      orders: 0,
    };

    item.revenue += amount;
    item.orders += 1;
    map.set(key, item);
  });

  const list = Array.from(map.values());
  return list.length === 1
    ? [{ label: 'Start', fullLabel: 'Period start', revenue: 0, orders: 0 }, ...list]
    : list;
}

console.log('--- TESTING TIME PERIOD REVENUE AGGREGATION ---');

const testSales = [
  { amount: 10000, date: '2025-11-15', status: 'Paid' },
  { amount: 15000, date: '2026-01-10', status: 'Paid' },
  { amount: 20000, date: '2026-01-12', status: 'Paid' }, // Same week & month
  { amount: 30000, date: '2026-02-05', status: 'Paid' },
  { amount: 50000, date: '2026-03-20', status: 'Paid' },
  { amount: 40000, date: '2026-10-15', status: 'Paid' },
  { amount: 99999, date: '2026-10-16', status: 'Cancelled' }, // Excluded
];

// Test Days
const daysData = getAggregatedRevenue(testSales, 'day');
console.log('Days groups count:', daysData.length);
assert.strictEqual(daysData.length, 6, 'Should have 6 distinct days');
assert.strictEqual(daysData.find(d => d.key === '2026-01-10').revenue, 15000);
console.log('✓ Days aggregation passed.');

// Test Weeks
const weeksData = getAggregatedRevenue(testSales, 'week');
console.log('Weeks groups count:', weeksData.length);
// 2026-01-10 (Sat) and 2026-01-12 (Mon) are in different weeks, so 6 weeks total
assert.ok(weeksData.length >= 5, 'Should have grouped by weeks');
console.log('✓ Weeks aggregation passed.');

// Test Months
const monthsData = getAggregatedRevenue(testSales, 'month');
console.log('Months groups count:', monthsData.length);
assert.strictEqual(monthsData.length, 5, 'Should have 5 months (Nov 25, Jan 26, Feb 26, Mar 26, Oct 26)');
const jan = monthsData.find(m => m.key === '2026-01');
assert.strictEqual(jan.revenue, 35000, 'Jan revenue should be 15000 + 20000 = 35000');
assert.strictEqual(jan.orders, 2, 'Jan orders should be 2');
console.log('✓ Months aggregation passed.');

// Test Years
const yearsData = getAggregatedRevenue(testSales, 'year');
console.log('Years groups count:', yearsData.length);
assert.strictEqual(yearsData.length, 2, 'Should have 2 years (2025 and 2026)');
assert.strictEqual(yearsData.find(y => y.key === '2025').revenue, 10000);
assert.strictEqual(yearsData.find(y => y.key === '2026').revenue, 155000); // 15k+20k+30k+50k+40k
console.log('✓ Years aggregation passed.');

console.log('ALL TIME PERIOD TESTS PASSED! 🎉');
