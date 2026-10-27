/**
 * Product Demand & Forecasting Engine for MSME Growth Advisor
 * Computes actual 30-day demand, previous 30-day demand, demand growth percentage,
 * 30-day future demand forecast, and smart inventory restocking recommendations.
 */

export function calculateProductDemandMetrics(sales = [], inventory = [], options = {}) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const now = new Date();

  // Find effective anchor time (latest transaction time or current time)
  let anchorTime = now.getTime();
  sales.forEach((s) => {
    if (s.date) {
      const t = new Date(s.date).getTime();
      if (!isNaN(t) && t > anchorTime) {
        anchorTime = t;
      }
    }
  });

  const currentPeriodEnd = anchorTime;
  const currentPeriodStart = anchorTime - 30 * DAY_MS;
  const prevPeriodEnd = currentPeriodStart;
  const prevPeriodStart = anchorTime - 60 * DAY_MS;

  // Filter valid completed sales (exclude cancelled / refunded)
  const validSales = sales.filter((s) => {
    const st = String(s.status || '').toLowerCase();
    return st !== 'cancelled' && st !== 'refunded';
  });

  // Check sales history depth
  let earliestSaleTime = anchorTime;
  validSales.forEach((s) => {
    if (s.date) {
      const t = new Date(s.date).getTime();
      if (!isNaN(t) && t < earliestSaleTime) earliestSaleTime = t;
    }
  });

  const historyDays = Math.max(1, Math.round((anchorTime - earliestSaleTime) / DAY_MS));
  const isGlobalInsufficientHistory = validSales.length < 2 || historyDays < 14;

  // Build master product dictionary
  const productMap = new Map();

  inventory.forEach((p) => {
    const key = p.name ? p.name.trim().toLowerCase() : String(p.id);
    productMap.set(key, {
      id: p.id || p.productId,
      productId: p.productId || p.id,
      name: p.name,
      category: p.category || 'General',
      currentStock: Number(p.stock || 0),
      minStock: Number(p.minStock || 10),
      unitPrice: Number(p.unitPrice || 0),
      unit: p.unit || 'Units',
      currentUnits: 0,
      prevUnits: 0,
      totalUnits: 0,
      currentRevenue: 0,
      prevRevenue: 0,
      firstSaleTime: null,
      lastSaleTime: null,
      salesCount: 0,
    });
  });

  // Track sales into products
  validSales.forEach((s) => {
    const itemName = String(s.item || 'General Order').trim();
    const key = itemName.toLowerCase();

    let prod = productMap.get(key);
    if (!prod) {
      // Find fuzzy match in inventory
      for (const [k, p] of productMap.entries()) {
        if (k.includes(key) || key.includes(k)) {
          prod = p;
          break;
        }
      }
    }

    if (!prod) {
      // Product sold but not in inventory catalog
      prod = {
        id: `unlisted-${key.replace(/\s+/g, '-')}`,
        productId: `PRD-${key.slice(0, 3).toUpperCase()}`,
        name: itemName,
        category: 'Uncataloged',
        currentStock: 0,
        minStock: 10,
        unitPrice: Number(s.amount || 0),
        unit: 'Units',
        currentUnits: 0,
        prevUnits: 0,
        totalUnits: 0,
        currentRevenue: 0,
        prevRevenue: 0,
        firstSaleTime: null,
        lastSaleTime: null,
        salesCount: 0,
      };
      productMap.set(key, prod);
    }

    // Determine quantity sold
    let qty = 1;
    if (s.quantity !== undefined && !isNaN(Number(s.quantity)) && Number(s.quantity) > 0) {
      qty = Number(s.quantity);
    } else if (s.metadata?.quantity && !isNaN(Number(s.metadata.quantity)) && Number(s.metadata.quantity) > 0) {
      qty = Number(s.metadata.quantity);
    } else if (s.metadata?.qty && !isNaN(Number(s.metadata.qty)) && Number(s.metadata.qty) > 0) {
      qty = Number(s.metadata.qty);
    } else if (prod.unitPrice > 0 && Number(s.amount || 0) > 0) {
      qty = Math.max(1, Math.round(Number(s.amount) / prod.unitPrice));
    }

    const saleTime = s.date ? new Date(s.date).getTime() : anchorTime;
    prod.totalUnits += qty;
    prod.salesCount += 1;

    if (!prod.firstSaleTime || saleTime < prod.firstSaleTime) prod.firstSaleTime = saleTime;
    if (!prod.lastSaleTime || saleTime > prod.lastSaleTime) prod.lastSaleTime = saleTime;

    if (saleTime >= currentPeriodStart && saleTime <= currentPeriodEnd) {
      prod.currentUnits += qty;
      prod.currentRevenue += Number(s.amount || 0);
    } else if (saleTime >= prevPeriodStart && saleTime < currentPeriodStart) {
      prod.prevUnits += qty;
      prod.prevRevenue += Number(s.amount || 0);
    }
  });

  // Calculate demand growth, status, forecast, and recommendations for each product
  const analyzedProducts = Array.from(productMap.values()).map((p) => {
    const { currentUnits, prevUnits, currentStock, minStock } = p;
    const hasInsufficientHistory =
      isGlobalInsufficientHistory || (p.salesCount <= 1 && p.totalUnits < 5);

    let demandGrowth = 0;
    let growthDisplay = 'No Recent Demand';
    let growthType = 'stable';
    let demandStatus = 'Stable';

    if (hasInsufficientHistory && currentUnits === 0 && prevUnits === 0) {
      demandGrowth = null;
      growthDisplay = 'Insufficient History';
      growthType = 'insufficient';
      demandStatus = 'Stable';
    } else if (prevUnits > 0) {
      demandGrowth = Number((((currentUnits - prevUnits) / prevUnits) * 100).toFixed(1));
      if (demandGrowth > 0) {
        growthDisplay = `+${demandGrowth}%`;
        growthType = 'positive';
        demandStatus = demandGrowth >= 15 ? 'High Demand' : 'Rising Demand';
      } else if (demandGrowth < 0) {
        growthDisplay = `${demandGrowth}%`;
        growthType = 'negative';
        demandStatus = 'Stable';
      } else {
        growthDisplay = '0.0%';
        growthType = 'stable';
        demandStatus = 'Stable';
      }
    } else if (prevUnits === 0 && currentUnits > 0) {
      demandGrowth = 100;
      growthDisplay = 'New Demand';
      growthType = 'new_demand';
      demandStatus = currentUnits >= 10 ? 'High Demand' : 'Rising Demand';
    } else {
      demandGrowth = 0;
      growthDisplay = '0 Units (Stable)';
      growthType = 'stable';
      demandStatus = 'Stable';
    }

    // Forecast demand next 30 days
    let forecastDemand = 0;
    if (hasInsufficientHistory) {
      forecastDemand = currentUnits > 0 ? Math.round(currentUnits * 1.05) : 0;
    } else if (currentUnits === 0 && prevUnits === 0) {
      forecastDemand = 0;
    } else if (prevUnits === 0) {
      forecastDemand = Math.round(currentUnits * 1.15);
    } else {
      const weightedBase = 0.7 * currentUnits + 0.3 * prevUnits;
      const momentumFactor = 1 + Math.max(-0.25, Math.min(0.35, demandGrowth / 200));
      forecastDemand = Math.max(0, Math.round(weightedBase * momentumFactor));
    }

    if (currentUnits > 0 && forecastDemand === 0) forecastDemand = currentUnits;

    // Inventory status & recommendations
    const isLowStock = currentStock <= minStock;
    const willStockout = forecastDemand > currentStock;

    let recommendation = 'Stock Sufficient';
    let recommendationTone = 'good';
    let stockAlert = false;
    let stockAlertMessage = '';

    if (willStockout && forecastDemand > 0) {
      recommendation = 'Potential Stockout';
      recommendationTone = 'bad';
      stockAlert = true;
      stockAlertMessage = `Forecast (${forecastDemand} ${p.unit}) exceeds available stock (${currentStock})`;
    } else if ((demandStatus === 'High Demand' || demandStatus === 'Rising Demand') && isLowStock) {
      recommendation = 'Restock Soon';
      recommendationTone = 'warn';
      stockAlert = true;
      stockAlertMessage = `Low stock (${currentStock} ${p.unit}) with rising demand`;
    } else if ((demandStatus === 'High Demand' || demandStatus === 'Rising Demand') && !isLowStock) {
      recommendation = 'Monitor Stock';
      recommendationTone = 'info';
      stockAlert = false;
      stockAlertMessage = `Strong demand, inventory currently adequate`;
    } else if (hasInsufficientHistory) {
      recommendation = 'Collect More Sales Data';
      recommendationTone = 'neutral';
      stockAlert = false;
      stockAlertMessage = `Add more sales records for higher forecast confidence`;
    } else {
      recommendation = 'Stock Sufficient';
      recommendationTone = 'good';
      stockAlert = false;
      stockAlertMessage = `Stock buffer meets anticipated demand`;
    }

    return {
      ...p,
      demandGrowth,
      growthDisplay,
      growthType,
      demandStatus,
      forecastDemand,
      recommendation,
      recommendationTone,
      stockAlert,
      stockAlertMessage,
      isLowStock,
      willStockout,
      hasInsufficientHistory,
    };
  });

  // Top 5 High-Demand Products for main dashboard
  // Ranked by: 1) currentUnits sold in last 30 days, 2) demandGrowth percentage
  const rankedForDashboard = [...analyzedProducts]
    .filter((p) => p.currentUnits > 0 || p.prevUnits > 0)
    .sort((a, b) => {
      if (b.currentUnits !== a.currentUnits) {
        return b.currentUnits - a.currentUnits;
      }
      return (b.demandGrowth || 0) - (a.demandGrowth || 0);
    });

  // If fewer than 5 sold, pad with remaining catalog items
  const topHighDemand = rankedForDashboard.slice(0, 5);
  if (topHighDemand.length < 5) {
    const existingIds = new Set(topHighDemand.map((p) => p.id));
    const remaining = analyzedProducts
      .filter((p) => !existingIds.has(p.id))
      .sort((a, b) => (b.currentStock || 0) - (a.currentStock || 0));

    topHighDemand.push(...remaining.slice(0, 5 - topHighDemand.length));
  }

  // Summary counts
  const highDemandCount = analyzedProducts.filter((p) => p.demandStatus === 'High Demand').length;
  const risingDemandCount = analyzedProducts.filter((p) => p.demandStatus === 'Rising Demand').length;
  const stockoutAlertCount = analyzedProducts.filter((p) => p.willStockout).length;
  const restockNeededCount = analyzedProducts.filter((p) => p.stockAlert).length;

  return {
    products: analyzedProducts,
    topHighDemand,
    summary: {
      totalProductsAnalyzed: analyzedProducts.length,
      highDemandCount,
      risingDemandCount,
      stockoutAlertCount,
      restockNeededCount,
      hasSalesData: validSales.length > 0,
    },
  };
}
