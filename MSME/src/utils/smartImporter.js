import * as XLSX from 'xlsx';

/**
 * Intelligent Data Import Engine for MSME Growth Advisor
 * Supports:
 * 1. "All Fields — Auto Detect" (Multi-sheet, automatic category routing & custom fields)
 * 2. Dedicated modules: Sales, Expenses, Products & Stock
 * 3. Normalization of Indian formats (INR ₹, DD/MM/YYYY dates, commas, trailing /-)
 * 4. Automatic preservation of extra custom columns in metadata
 */

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DEPARTMENT_CONFIG = {
  sales: {
    id: 'sales',
    name: 'Sales & Invoices',
    icon: 'TrendingUp',
    targetModule: 'sales',
    color: 'emerald',
    description: 'Invoices, customer sales, bill dates, order amounts, and payment status',
  },
  expenses: {
    id: 'expenses',
    name: 'Business Expenses',
    icon: 'Receipt',
    targetModule: 'expenses',
    color: 'blue',
    description: 'Operating costs, vendor payouts, utility bills, and business expenses',
  },
  inventory: {
    id: 'inventory',
    name: 'Products & Stock',
    icon: 'Package',
    targetModule: 'inventory',
    color: 'indigo',
    description: 'Catalog products, selling prices, available quantities, and low-stock alerts',
  },
  purchases: {
    id: 'purchases',
    name: 'Ingredient Purchases',
    icon: 'ShoppingBag',
    targetModule: 'purchases',
    color: 'amber',
    description: 'Ingredient purchases, procurement, supplier costs, and raw materials',
  },
  customers: {
    id: 'customers',
    name: 'Customers Directory',
    icon: 'Users',
    targetModule: 'sales',
    color: 'teal',
    description: 'Customer contact information, client accounts, and directories',
  },
  orders: {
    id: 'orders',
    name: 'Sales Orders',
    icon: 'ShoppingCart',
    targetModule: 'sales',
    color: 'cyan',
    description: 'Customer purchase orders, quantities, and order fulfillment status',
  },
  suppliers: {
    id: 'suppliers',
    name: 'Suppliers Directory',
    icon: 'Truck',
    targetModule: 'expenses',
    color: 'orange',
    description: 'Vendor contact information, supplier catalog, and procurement contacts',
  },
  ignored: {
    id: 'ignored',
    name: 'Informational Sheet',
    icon: 'FileText',
    targetModule: 'none',
    color: 'gray',
    description: 'Summary, notes, or documentation (excluded from transactional import)',
  },
};

export const IMPORT_CATEGORIES = {
  all: {
    id: 'all',
    title: 'All Fields — Auto Detect',
    shortDesc: 'Import any business spreadsheet. Automatically detect all available fields and organize your data.',
    icon: 'Sparkles',
    color: 'indigo',
    badge: 'Multi-Sheet & Any Format',
  },

  sales: {
    id: 'sales',
    title: 'Sales',
    shortDesc: 'Add sales, invoices, customer purchases, dates, and payment details.',
    icon: 'TrendingUp',
    color: 'emerald',
    badge: 'Invoices & Revenue',
    fields: [
      {
        key: 'client',
        label: 'Customer Name',
        required: true,
        aliases: [
          'customer name', 'customer', 'buyer name', 'buyer', 'client name', 'client',
          'party name', 'party', 'billed to', 'bill to', 'sold to', 'account',
          'purchaser', 'company', 'customer/client', 'buyer / client', 'recipient',
          'customer / party', 'debtor', 'client/customer', 'client / customer', 'party / customer'
        ],
      },
      {
        key: 'amount',
        label: 'Amount (₹)',
        required: true,
        isNumber: true,
        aliases: [
          'amount (inr)', 'amount inr', 'inr amount', 'amount', 'total (inr)', 'total inr',
          'total', 'sales amount', 'total amount', 'invoice amount', 'net amount',
          'grand total', 'subtotal', 'value', 'price', 'bill amount', 'order amount',
          'order value', 'gross amount', 'charge', 'sales value', 'sale amount',
          'turnover', 'amt', 'bill value', 'final amount', 'amount (₹)'
        ],
      },
      {
        key: 'date',
        label: 'Date',
        required: false,
        isDate: true,
        aliases: [
          'invoice date', 'invoice_date', 'date', 'bill date', 'sales date', 'order date',
          'date of issue', 'txn date', 'transaction date', 'billing date', 'sale date',
          'time', 'created at', 'inv date', 'dated'
        ],
      },
      {
        key: 'item',
        label: 'Product / Item',
        required: false,
        aliases: [
          'item / product', 'item/product', 'product / item', 'product/item',
          'item', 'product', 'description', 'particulars', 'item name', 'goods',
          'product name', 'service', 'details', 'item description', 'product / service',
          'items', 'sku name', 'order item', 'commodity'
        ],
      },
      {
        key: 'invoiceId',
        label: 'Invoice / Bill #',
        required: false,
        aliases: [
          'invoice number', 'invoice no', 'invoice no.', 'invoice #', 'bill number',
          'order id', 'bill no', 'bill no.', 'inv no', 'inv #', 'bill id', 'order #',
          'order number', 'voucher no', 'voucher number', 'ref no', 'reference', 'doc no',
          'invoice id', 'bill ref', 'invoice_no', 'bill_no'
        ],
      },
      {
        key: 'status',
        label: 'Payment Status',
        required: false,
        aliases: [
          'payment status', 'status', 'payment', 'pay status', 'state', 'paid status',
          'payment state', 'settlement', 'collection status', 'mode', 'payment method'
        ],
      },
    ],
  },

  expenses: {
    id: 'expenses',
    title: 'Expenses',
    shortDesc: 'Add business expenses, supplier payments, costs, and dates.',
    icon: 'Receipt',
    color: 'amber',
    badge: 'Costs & Supplier Payments',
    fields: [
      {
        key: 'title',
        label: 'Expense Description',
        required: true,
        aliases: [
          'expense title', 'expense description', 'ingredient / item', 'ingredient',
          'title', 'description', 'expense', 'particulars', 'purpose', 'item',
          'remarks', 'details', 'reason', 'expense name', 'spent on', 'narration',
          'note', 'spend description', 'payment for', 'expense item', 'head of account',
          'item / ingredient', 'raw material'
        ],
      },
      {
        key: 'amount',
        label: 'Amount (₹)',
        required: true,
        isNumber: true,
        aliases: [
          'amount (inr)', 'amount inr', 'total cost (inr)', 'total cost inr', 'total cost',
          'amount', 'cost', 'total', 'expense amount', 'amount paid', 'total amount',
          'paid amount', 'price', 'expense cost', 'value', 'bill amount', 'inr amount',
          'amt', 'net cost', 'spend', 'payment amount', 'cost (inr)', 'outflow', 'debit',
          'amount (₹)'
        ],
      },
      {
        key: 'category',
        label: 'Category',
        required: false,
        aliases: [
          'category', 'expense type', 'expense category', 'type', 'department',
          'head', 'cost center', 'group', 'class', 'classification',
          'nature of expense', 'account head', 'expense head'
        ],
      },
      {
        key: 'vendor',
        label: 'Vendor / Paid To',
        required: false,
        aliases: [
          'vendor', 'supplier', 'supplier name', 'vendor name', 'paid to', 'payee',
          'merchant', 'party', 'seller', 'creditor', 'party name', 'beneficiary',
          'service provider', 'contractor', 'biller', 'vendor / paid to'
        ],
      },
      {
        key: 'date',
        label: 'Date',
        required: false,
        isDate: true,
        aliases: [
          'expense date', 'purchase date', 'date', 'payment date', 'bill date', 'paid on',
          'voucher date', 'txn date', 'transaction date', 'spent date', 'payment_date',
          'purchase_date'
        ],
      },
    ],
  },

  inventory: {
    id: 'inventory',
    title: 'Products & Stock',
    shortDesc: 'Add products, prices, available quantities, and stock thresholds.',
    icon: 'Package',
    color: 'sky',
    badge: 'Stock & Catalog',
    fields: [
      {
        key: 'name',
        label: 'Product / Item Name',
        required: true,
        aliases: [
          'product name', 'item name', 'product', 'item', 'name', 'title',
          'description', 'article', 'goods name', 'product / item',
          'item description', 'material', 'stock item', 'sku name'
        ],
      },
      {
        key: 'unitPrice',
        label: 'Selling Price (₹)',
        required: true,
        isNumber: true,
        aliases: [
          'unit price (inr)', 'unit price inr', 'unit price', 'selling price',
          'selling price (₹)', 'price', 'rate', 'cost', 'unit cost', 'mrp',
          'sale price', 'unit rate', 'price per unit', 'selling rate', 'price (inr)',
          'rate (inr)', 'price inr', 'unitprice'
        ],
      },
      {
        key: 'stock',
        label: 'Available Quantity',
        required: false,
        isNumber: true,
        aliases: [
          'current stock qty', 'current stock', 'available quantity', 'available quantity (qty)',
          'stock', 'quantity', 'available units', 'qty', 'count', 'units in stock',
          'available stock', 'balance', 'on hand', 'inventory', 'inventory qty',
          'units available', 'pieces', 'quantity on hand', 'stock quantity'
        ],
      },
      {
        key: 'category',
        label: 'Category',
        required: false,
        aliases: [
          'category', 'product category', 'type', 'group', 'class',
          'department', 'family', 'item category'
        ],
      },
      {
        key: 'unit',
        label: 'Unit of Measure',
        required: false,
        aliases: [
          'unit of measure', 'unit', 'uom', 'measure', 'unit type',
          'packing', 'measurement', 'uom code'
        ],
      },
      {
        key: 'minStock',
        label: 'Low Stock Alert Level',
        required: false,
        isNumber: true,
        aliases: [
          'minimum stock threshold', 'minimum stock', 'low stock alert level',
          'low stock alert', 'reorder level', 'min stock', 'threshold',
          'safety stock', 'min qty', 'minimum quantity', 'alert level',
          'reorder point', 'minstock'
        ],
      },
    ],
  },

  purchases: {
    id: 'purchases',
    title: 'Purchases & Ingredients',
    shortDesc: 'Add ingredient purchases, raw materials, supplier costs, and purchase dates.',
    icon: 'Receipt',
    color: 'amber',
    badge: 'Raw Materials & Procurement',
    targetModule: 'purchases',
    fields: [
      {
        key: 'title',
        label: 'Ingredient / Item',
        required: true,
        aliases: [
          'ingredient / item', 'ingredient', 'item / ingredient', 'ingredient name',
          'raw material', 'material', 'item', 'item name', 'purchased item',
          'particulars', 'goods', 'description', 'product'
        ],
      },
      {
        key: 'amount',
        label: 'Total Cost (INR)',
        required: true,
        isNumber: true,
        aliases: [
          'total cost (inr)', 'total cost inr', 'total cost', 'total amount', 'total',
          'amount (inr)', 'amount inr', 'amount', 'cost (inr)', 'cost', 'purchase amount',
          'total price', 'amount (₹)'
        ],
      },
      {
        key: 'vendor',
        label: 'Supplier',
        required: false,
        aliases: [
          'supplier', 'supplier name', 'vendor', 'vendor name', 'paid to', 'merchant',
          'party', 'creditor', 'distributor', 'seller', 'vendor / paid to'
        ],
      },
      {
        key: 'date',
        label: 'Purchase Date',
        required: false,
        isDate: true,
        aliases: [
          'purchase date', 'purchase_date', 'date', 'order date', 'bill date',
          'invoice date', 'txn date', 'transaction date'
        ],
      },
      {
        key: 'category',
        label: 'Category',
        required: false,
        defaultValue: 'Raw Materials',
        aliases: [
          'category', 'item category', 'material type', 'type', 'group', 'classification'
        ],
      },
      {
        key: 'quantity',
        label: 'Quantity',
        required: false,
        isNumber: true,
        aliases: [
          'quantity', 'qty', 'units', 'volume', 'weight', 'count', 'pieces'
        ],
      },
      {
        key: 'unitCost',
        label: 'Unit Cost (INR)',
        required: false,
        isNumber: true,
        aliases: [
          'unit cost (inr)', 'unit cost inr', 'unit cost', 'unit price (inr)', 'unit price',
          'unit rate', 'rate', 'cost per unit'
        ],
      },
      {
        key: 'unit',
        label: 'Unit',
        required: false,
        aliases: [
          'unit', 'unit of measure', 'uom', 'measure', 'packaging'
        ],
      },
      {
        key: 'purchaseId',
        label: 'Purchase ID',
        required: false,
        aliases: [
          'purchase id', 'purchase no', 'order id', 'bill no', 'invoice no', 'purchase_id'
        ],
      },
    ],
  },

  customers: {
    id: 'customers',
    title: 'Customers Directory',
    shortDesc: 'Customer contact records, phone numbers, and addresses.',
    icon: 'Users',
    color: 'teal',
    badge: 'Customer Directory',
    targetModule: 'sales',
    fields: [
      {
        key: 'client',
        label: 'Customer Name',
        required: true,
        aliases: [
          'customer name', 'customer', 'client name', 'client', 'contact name',
          'party name', 'party', 'buyer name', 'account name'
        ],
      },
      {
        key: 'phone',
        label: 'Phone Number',
        required: false,
        aliases: ['phone number', 'phone', 'mobile number', 'mobile', 'contact', 'telephone'],
      },
      {
        key: 'email',
        label: 'Email Address',
        required: false,
        aliases: ['email address', 'email', 'e mail', 'mail'],
      },
      {
        key: 'address',
        label: 'Address',
        required: false,
        aliases: ['address', 'billing address', 'city', 'location', 'street'],
      },
      {
        key: 'amount',
        label: 'Balance / Lifetime Value',
        required: false,
        isNumber: true,
        defaultValue: 0,
        aliases: ['balance', 'outstanding', 'lifetime value', 'total purchased', 'amount'],
      },
    ],
  },

  orders: {
    id: 'orders',
    title: 'Orders',
    shortDesc: 'Purchase orders, order totals, quantities, and delivery status.',
    icon: 'ShoppingCart',
    color: 'cyan',
    badge: 'Sales Orders',
    targetModule: 'sales',
    fields: [
      {
        key: 'client',
        label: 'Customer Name',
        required: true,
        aliases: ['customer name', 'customer', 'client', 'buyer', 'buyer name', 'account'],
      },
      {
        key: 'amount',
        label: 'Order Total (₹)',
        required: true,
        isNumber: true,
        aliases: ['order total', 'order total (₹)', 'amount', 'total amount', 'total', 'grand total'],
      },
      {
        key: 'invoiceId',
        label: 'Order Number',
        required: false,
        aliases: ['order number', 'order no', 'order id', 'po number', 'po #'],
      },
      {
        key: 'item',
        label: 'Item / Product',
        required: false,
        aliases: ['item', 'product', 'item description', 'goods', 'sku'],
      },
      {
        key: 'date',
        label: 'Order Date',
        required: false,
        isDate: true,
        aliases: ['order date', 'date', 'placed date'],
      },
    ],
  },

  suppliers: {
    id: 'suppliers',
    title: 'Suppliers Directory',
    shortDesc: 'Vendor contact information and procurement sources.',
    icon: 'Truck',
    color: 'orange',
    badge: 'Vendors & Suppliers',
    targetModule: 'expenses',
    fields: [
      {
        key: 'title',
        label: 'Supplier / Vendor Name',
        required: true,
        aliases: [
          'supplier name', 'supplier', 'vendor name', 'vendor', 'party name',
          'creditor', 'distributor', 'company'
        ],
      },
      {
        key: 'amount',
        label: 'Balance / Cost',
        required: false,
        isNumber: true,
        defaultValue: 0,
        aliases: ['balance', 'outstanding', 'cost', 'total spent', 'amount'],
      },
      {
        key: 'phone',
        label: 'Phone Number',
        required: false,
        aliases: ['phone number', 'phone', 'mobile', 'contact'],
      },
      {
        key: 'email',
        label: 'Email',
        required: false,
        aliases: ['email address', 'email'],
      },
      {
        key: 'category',
        label: 'Category',
        required: false,
        defaultValue: 'Raw Materials',
        aliases: ['category', 'supply type', 'goods supplied'],
      },
    ],
  },
};


/**
 * Clean a string header for fuzzy matching
 */
export const cleanHeader = (str) => {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[₹$€£,_\-\.\(\)\[\]\{\}\/\\#\:\*]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Standardize numeric values (INR, currency symbols, commas, trailing /-)
 */
export const cleanNumber = (val) => {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;

  let str = String(val).trim();
  // Strip currency word prefixes / suffixes first (Rs., Rs, INR, USD, EUR)
  str = str.replace(/(rs\.?|inr|usd|eur|gbp)/gi, '');
  // Strip trailing /- (common Indian handwritten/printed suffix)
  str = str.replace(/(\/|\-)+$/, '');
  // Strip thousands commas
  str = str.replace(/,/g, '');
  // Strip non-digit, non-decimal, non-minus characters
  str = str.replace(/[^0-9.-]/g, '');

  if (!str || str === '-' || str === '.') return null;
  const num = Number(str);
  return isNaN(num) ? null : num;
};

/**
 * Parse Indian (DD/MM/YYYY) and global date formats to YYYY-MM-DD
 */
export const cleanDate = (val) => {
  if (val === null || val === undefined || val === '') {
    return new Date().toISOString().split('T')[0];
  }

  // Handle Excel Serial Date numbers (e.g. 45220)
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

  // Check Indian format: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
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

  // Check 2-digit year: DD/MM/YY
  const dmyShortMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})$/);
  if (dmyShortMatch) {
    const day = dmyShortMatch[1].padStart(2, '0');
    const month = dmyShortMatch[2].padStart(2, '0');
    const year = parseInt(dmyShortMatch[3], 10) > 50 ? `19${dmyShortMatch[3]}` : `20${dmyShortMatch[3]}`;
    return `${year}-${month}-${day}`;
  }

  // Check YYYY/MM/DD
  const ymdMatch = str.match(/^(\d{4})[\/\.](\d{1,2})[\/\.](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Fallback to standard Date parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  // Return fallback today's date if unrecognized
  return new Date().toISOString().split('T')[0];
};

/**
 * Automatically match spreadsheet columns to target fields without asking user
 */
export const autoDetectColumns = (rawHeaders, categoryType) => {
  const category = IMPORT_CATEGORIES[categoryType];
  if (!category || !category.fields) return {};

  const mapping = {};
  const usedHeaders = new Set();

  const cleanedHeaderList = rawHeaders.map((header) => ({
    raw: header,
    cleaned: cleanHeader(header),
  }));

  // Pass 1: Exact alias match
  category.fields.forEach((field) => {
    for (const alias of field.aliases) {
      const cleanedAlias = cleanHeader(alias);
      const match = cleanedHeaderList.find(
        (h) => !usedHeaders.has(h.raw) && h.cleaned === cleanedAlias
      );
      if (match) {
        mapping[field.key] = match.raw;
        usedHeaders.add(match.raw);
        break;
      }
    }
  });

  // Pass 2: Word inclusion match (e.g. "Total Sales (INR)" matches alias "sales amount")
  category.fields.forEach((field) => {
    if (mapping[field.key]) return; // already mapped

    for (const alias of field.aliases) {
      const aliasWords = cleanHeader(alias).split(' ').filter(Boolean);
      const match = cleanedHeaderList.find((h) => {
        if (usedHeaders.has(h.raw)) return false;
        return (
          h.cleaned.includes(cleanHeader(alias)) ||
          aliasWords.every((word) => h.cleaned.includes(word))
        );
      });

      if (match) {
        mapping[field.key] = match.raw;
        usedHeaders.add(match.raw);
        break;
      }
    }
  });

  return mapping;
};

/**
 * Automatically detect worksheet business data category (Sales, Expenses, Inventory, or Purchases)
 */
export const detectWorksheetCategory = (rawHeaders, sheetName = '') => {
  const cleanedHeaders = rawHeaders.map((h) => cleanHeader(h));
  const sName = cleanHeader(sheetName);

  // If sheet is clearly a non-transactional summary, overview, metadata, readme, or notes
  const isSummaryName = /summary|overview|notes|readme|info|instructions|metadata|about/i.test(sName);
  const hasFinancialHeaders = cleanedHeaders.some((h) =>
    /customer|buyer|client|amount|invoice|expense|selling price|unit price|total cost|stock qty|current stock/i.test(h)
  );
  if (isSummaryName && !hasFinancialHeaders) {
    return {
      type: 'ignored',
      isSummary: true,
      confidence: 0,
    };
  }

  let salesScore = 0;
  let expenseScore = 0;
  let inventoryScore = 0;
  let purchaseScore = 0;

  // Sheet name weight
  if (/sale|invoice|bill|order|revenue|client|customer|orders|invoices/i.test(sName)) salesScore += 6;
  if (/expense|payout|spend|cost|vendor|expenses|costs|overhead/i.test(sName)) expenseScore += 6;
  if (/inventory|stock|product|catalog|goods|products/i.test(sName)) inventoryScore += 6;
  if (/purchase|ingredient|procurement|supply|supplies|raw material|purchases|ingredients/i.test(sName)) purchaseScore += 8;

  // Header matching scoring
  const scoreFieldList = (fields) => {
    let score = 0;
    fields.forEach((f) => {
      let matched = false;
      for (const alias of f.aliases) {
        const cAlias = cleanHeader(alias);
        if (cleanedHeaders.some((h) => h === cAlias || (cAlias.length > 3 && h.includes(cAlias)))) {
          matched = true;
          break;
        }
      }
      if (matched) {
        score += f.required ? 4 : 1;
      }
    });
    return score;
  };

  salesScore += scoreFieldList(IMPORT_CATEGORIES.sales.fields);
  expenseScore += scoreFieldList(IMPORT_CATEGORIES.expenses.fields);
  inventoryScore += scoreFieldList(IMPORT_CATEGORIES.inventory.fields);
  if (IMPORT_CATEGORIES.purchases?.fields) {
    purchaseScore += scoreFieldList(IMPORT_CATEGORIES.purchases.fields);
  }

  // Ingredient / purchases adjustments
  if (cleanedHeaders.some((h) => /ingredient|raw material|procurement|total cost/i.test(h))) {
    purchaseScore += 5;
  }

  const scores = [
    { type: 'sales', score: salesScore },
    { type: 'expenses', score: expenseScore },
    { type: 'inventory', score: inventoryScore },
    { type: 'purchases', score: purchaseScore, targetModule: 'purchases' },
  ].sort((a, b) => b.score - a.score);

  // If no category matched at all
  if (scores[0].score === 0) {
    return {
      type: 'ignored',
      isSummary: isSummaryName,
      confidence: 0,
    };
  }

  // Clear top match
  if (scores[0].score > scores[1].score) {
    return {
      type: scores[0].type,
      targetModule: scores[0].targetModule || scores[0].type,
      isAmbiguous: false,
      confidence: scores[0].score,
    };
  }

  // Tie or ambiguous match
  return {
    type: scores[0].type,
    targetModule: scores[0].targetModule || scores[0].type,
    isAmbiguous: true,
    candidates: [scores[0].type, scores[1].type],
    confidence: scores[0].score,
  };
};

/**
 * Check if an entire spreadsheet row is blank
 */
export const isRowEmpty = (row) => {
  if (!row || typeof row !== 'object') return true;
  return Object.values(row).every((val) => {
    if (val === null || val === undefined) return true;
    return String(val).trim() === '';
  });
};

/**
 * Automatically find the best sales worksheet in any workbook
 */
export const findBestSalesWorksheet = (workbook) => {
  const sheetNames = workbook.SheetNames || [];
  if (sheetNames.length === 0) return null;
  if (sheetNames.length === 1) {
    const sheet = workbook.Sheets[sheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '', blankrows: false });
    const nonEmpty = rawRows.filter((r) => !isRowEmpty(r));
    return {
      bestSheetName: sheetNames[0],
      isAmbiguous: false,
      sheets: [{ name: sheetNames[0], rowCount: nonEmpty.length, salesScore: 10, isMatch: true }],
      totalSheets: 1,
    };
  }

  const scoredSheets = sheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    if (!sheet) return { name, score: -1, rowCount: 0, headers: [] };
    const rawRows = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '', blankrows: false });
    const nonEmpty = rawRows.filter((r) => !isRowEmpty(r));
    if (nonEmpty.length === 0) return { name, score: -1, rowCount: 0, headers: [] };

    const headers = Object.keys(nonEmpty[0] || {});
    const cleaned = headers.map((h) => cleanHeader(h));
    const sName = cleanHeader(name);

    let score = 0;
    // Strong sheet name indicators
    if (/sale|invoice|bill|order|revenue/i.test(sName)) score += 15;
    if (/expense|cost|payout|spend|vendor|overhead|p&l/i.test(sName)) score -= 15;
    if (/inventory|stock|product|catalog|goods/i.test(sName)) score -= 10;
    if (/purchase|ingredient|procurement/i.test(sName)) score -= 15;
    if (/summary|overview|notes|readme|info/i.test(sName)) score -= 20;

    // Header matches
    IMPORT_CATEGORIES.sales.fields.forEach((f) => {
      for (const alias of f.aliases) {
        const cAlias = cleanHeader(alias);
        if (cleaned.some((h) => h === cAlias)) {
          score += f.required ? 10 : 3;
          break;
        } else if (cleaned.some((h) => h.includes(cAlias) || (cAlias.length > 3 && cAlias.includes(h)))) {
          score += f.required ? 4 : 1;
          break;
        }
      }
    });

    const hasCustomer = cleaned.some((h) => /customer|buyer|client|party/i.test(h));
    const hasExpenseTitle = cleaned.some((h) => /expense title|expense description|ingredient/i.test(h));
    const hasStock = cleaned.some((h) => /current stock|stock qty|min stock/i.test(h));
    if (!hasCustomer && (hasExpenseTitle || hasStock)) {
      score -= 20;
    }

    return {
      name,
      score,
      rowCount: nonEmpty.length,
      headers,
    };
  });

  const sorted = [...scoredSheets].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const isAmbiguous =
    sorted.length > 1 &&
    sorted[0].score > 0 &&
    sorted[0].score === sorted[1].score;

  return {
    bestSheetName: best && best.score > 0 ? best.name : sheetNames[0],
    isAmbiguous,
    sheets: sorted,
    totalSheets: sheetNames.length,
  };
};

/**
 * Analyze a single worksheet rows and classify records, preserving custom columns
 */
export const processSpreadsheetData = (rawRows, categoryType, columnMapping = null) => {
  const category = IMPORT_CATEGORIES[categoryType];
  if (!category || !category.fields) return null;

  // Filter out blank rows
  const nonEmptyRows = rawRows.filter((r) => !isRowEmpty(r));
  if (nonEmptyRows.length === 0) {
    return {
      total: 0,
      readyCount: 0,
      attentionCount: 0,
      autoCorrectedCount: 0,
      readyRows: [],
      attentionRows: [],
      previewRows: [],
      detectedFields: {},
      allHeaders: [],
      customColumns: [],
    };
  }

  const rawHeaders = Object.keys(nonEmptyRows[0] || {});
  const mapping = columnMapping || autoDetectColumns(rawHeaders, categoryType);

  // Identify custom columns (columns in sheet that are not mapped to standard fields)
  const mappedSourceHeaders = new Set(Object.values(mapping));
  const customColumns = rawHeaders.filter((h) => !mappedSourceHeaders.has(h));

  const readyRows = [];
  const attentionRows = [];
  let autoCorrectedCount = 0;

  nonEmptyRows.forEach((row, idx) => {
    const rowNum = idx + 1;
    let hadCorrection = false;
    const item = {};
    const issues = [];

    // Extract all custom / unmapped columns to preserve in metadata
    const metadata = {};
    customColumns.forEach((col) => {
      if (row[col] !== undefined && row[col] !== null && String(row[col]).trim() !== '') {
        metadata[col] = row[col];
      }
    });

    if (categoryType === 'sales') {
      const rawClient = mapping.client ? row[mapping.client] : row['Customer Name'] || row.client || row.customer;
      const client = String(rawClient || '').trim();

      const rawAmount = mapping.amount ? row[mapping.amount] : row['Amount (INR)'] || row['Amount (₹)'] || row.amount || row.total;
      const amount = cleanNumber(rawAmount);

      const rawDate = mapping.date ? row[mapping.date] : row['Invoice Date'] || row.date;
      const date = cleanDate(rawDate);

      const rawItem = mapping.item ? row[mapping.item] : row['Item / Product'] || row['Product / Item'] || row.item || row.product;
      const product = String(rawItem || 'General Order').trim();

      const rawInvoiceId = mapping.invoiceId ? row[mapping.invoiceId] : row['Invoice Number'] || row['Invoice No'] || row.invoiceId || row.billNo;
      const invoiceId = rawInvoiceId ? String(rawInvoiceId).trim() : null;

      const rawStatus = mapping.status ? row[mapping.status] : row['Payment Status'] || row.status;
      let status = 'Paid';
      if (rawStatus) {
        const s = String(rawStatus).toLowerCase();
        if (s.includes('pend') || s.includes('unpaid') || s.includes('due')) status = 'Pending';
        else if (s.includes('overdue')) status = 'Overdue';
        else status = 'Paid';
      }

      if (!client) {
        issues.push('Missing customer or buyer name');
      }
      if (amount === null || amount <= 0) {
        issues.push('Invalid or missing sale amount');
      }

      if (rawAmount && typeof rawAmount === 'string' && /[^0-9.]/.test(rawAmount)) {
        hadCorrection = true;
      }
      if (rawDate && typeof rawDate === 'string' && rawDate.includes('/')) {
        hadCorrection = true;
      }

      item.client = client;
      item.amount = amount || 0;
      item.date = date;
      item.item = product || 'General Order';
      item.status = status;
      if (invoiceId) item.invoiceId = invoiceId;
      item.metadata = metadata;

    } else if (categoryType === 'expenses') {
      const rawTitle = mapping.title ? row[mapping.title] : row['Expense Title'] || row['Ingredient / Item'] || row.title || row.expense;
      const title = String(rawTitle || '').trim();

      const rawAmount = mapping.amount ? row[mapping.amount] : row['Amount (INR)'] || row['Total Cost (INR)'] || row['Amount (₹)'] || row.amount || row.cost;
      const amount = cleanNumber(rawAmount);

      const rawCategory = mapping.category ? row[mapping.category] : row.category;
      const expCategory = String(rawCategory || 'Operations').trim();

      const rawVendor = mapping.vendor ? row[mapping.vendor] : row['Vendor'] || row['Supplier'] || row['Vendor / Paid To'] || row.vendor || row.supplier;
      const vendor = String(rawVendor || 'Standard Vendor').trim();

      const rawDate = mapping.date ? row[mapping.date] : row['Expense Date'] || row['Purchase Date'] || row.date;
      const date = cleanDate(rawDate);

      if (!title) {
        issues.push('Missing expense title or description');
      }
      if (amount === null || amount <= 0) {
        issues.push('Invalid or missing expense amount');
      }

      if (rawAmount && typeof rawAmount === 'string' && /[^0-9.]/.test(rawAmount)) {
        hadCorrection = true;
      }
      if (rawDate && typeof rawDate === 'string' && rawDate.includes('/')) {
        hadCorrection = true;
      }

      item.title = title;
      item.amount = amount || 0;
      item.category = expCategory || 'Operations';
      item.vendor = vendor || 'Standard Vendor';
      item.date = date;
      item.metadata = metadata;

    } else if (categoryType === 'purchases') {
      const rawTitle = mapping.title ? row[mapping.title] : row['Ingredient / Item'] || row['Item'] || row.title;
      const title = String(rawTitle || '').trim();

      const rawAmount = mapping.amount ? row[mapping.amount] : row['Total Cost (INR)'] || row['Total Cost'] || row['Amount (INR)'] || row.amount || row.cost;
      const amount = cleanNumber(rawAmount);

      const rawVendor = mapping.vendor ? row[mapping.vendor] : row['Supplier'] || row.supplier || row.vendor;
      const vendor = String(rawVendor || 'Standard Supplier').trim();

      const rawDate = mapping.date ? row[mapping.date] : row['Purchase Date'] || row.date;
      const date = cleanDate(rawDate);

      const rawCategory = mapping.category ? row[mapping.category] : row.category;
      const expCategory = String(rawCategory || 'Raw Materials').trim();

      if (!title) {
        issues.push('Missing ingredient or item name');
      }
      if (amount === null || amount <= 0) {
        issues.push('Invalid or missing purchase total cost');
      }

      if (rawAmount && typeof rawAmount === 'string' && /[^0-9.]/.test(rawAmount)) {
        hadCorrection = true;
      }
      if (rawDate && typeof rawDate === 'string' && rawDate.includes('/')) {
        hadCorrection = true;
      }

      item.title = title;
      item.amount = amount || 0;
      item.category = expCategory || 'Raw Materials';
      item.vendor = vendor || 'Standard Supplier';
      item.date = date;
      item.metadata = metadata;

    } else if (categoryType === 'inventory') {
      const rawName = mapping.name ? row[mapping.name] : row['Product Name'] || row.name || row.product;
      const name = String(rawName || '').trim();

      const rawPrice = mapping.unitPrice ? row[mapping.unitPrice] : row['Unit Price (INR)'] || row['Selling Price (₹)'] || row.unitPrice || row.price;
      const unitPrice = cleanNumber(rawPrice);

      const rawStock = mapping.stock ? row[mapping.stock] : row['Current Stock Qty'] || row['Available Quantity'] || row.stock || row.quantity;
      const stock = Math.max(0, parseInt(cleanNumber(rawStock) || 0, 10));

      const rawCategory = mapping.category ? row[mapping.category] : row.category;
      const invCategory = String(rawCategory || 'General').trim();

      const rawUnit = mapping.unit ? row[mapping.unit] : row['Unit of Measure'] || row.unit;
      const unit = String(rawUnit || 'Units').trim();

      const rawMinStock = mapping.minStock ? row[mapping.minStock] : row['Minimum Stock Threshold'] || row['Low Stock Alert Level'] || row.minStock;
      const minStock = Math.max(0, parseInt(cleanNumber(rawMinStock) || 10, 10));

      if (!name) {
        issues.push('Missing product or item name');
      }
      if (unitPrice === null || unitPrice < 0) {
        issues.push('Invalid or missing unit price');
      }

      if (rawPrice && typeof rawPrice === 'string' && /[^0-9.]/.test(rawPrice)) {
        hadCorrection = true;
      }

      item.name = name;
      item.unitPrice = unitPrice || 0;
      item.stock = stock;
      item.category = invCategory || 'General';
      item.unit = unit || 'Units';
      item.minStock = minStock || 10;
      item.metadata = metadata;
    }

    if (hadCorrection) autoCorrectedCount++;

    if (issues.length === 0) {
      readyRows.push({
        rowNumber: rowNum,
        data: item,
      });
    } else {
      attentionRows.push({
        rowNumber: rowNum,
        data: row,
        issues,
      });
    }
  });

  return {
    total: nonEmptyRows.length,
    readyCount: readyRows.length,
    attentionCount: attentionRows.length,
    autoCorrectedCount,
    readyRows,
    attentionRows,
    previewRows: readyRows.slice(0, 5).map((r) => r.data),
    detectedFields: mapping,
    allHeaders: rawHeaders,
    customColumns,
  };
};

/**
 * Process entire workbook across all worksheets with support for "All Fields — Auto Detect"
 */
export const processMultiSheetWorkbook = (
  workbook,
  selectedCategory = 'all',
  sheetTypeOverrides = {}
) => {
  const sheetNames = workbook.SheetNames || [];
  const sheets = [];
  const allHeadersSet = new Set();
  const ambiguousSheets = [];

  const categorizedReadyRows = {
    sales: [],
    expenses: [],
    purchases: [],
    inventory: [],
  };

  const categorizedAttentionRows = {
    sales: [],
    expenses: [],
    purchases: [],
    inventory: [],
  };

  let totalRawRows = 0;
  let totalReadyCount = 0;
  let totalAttentionCount = 0;
  let totalAutoCorrectedCount = 0;

  for (const sheetName of sheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rawRows = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
      defval: '',
      blankrows: false,
    });

    const nonEmptyRows = rawRows.filter((r) => !isRowEmpty(r));
    if (nonEmptyRows.length === 0) continue;

    const sheetHeaders = Object.keys(nonEmptyRows[0] || {});
    sheetHeaders.forEach((h) => allHeadersSet.add(h));

    // Determine category through intelligent detection
    const detection = detectWorksheetCategory(sheetHeaders, sheetName);

    // If sheet is a non-data / summary sheet (e.g. Test_Summary), skip cleanly
    if (detection.type === 'ignored') {
      sheets.push({
        sheetName,
        detectedCategory: 'ignored',
        departmentName: 'Informational Sheet',
        targetModule: 'none',
        isSkipped: true,
        skipReason: 'Informational summary, excluded from import',
        action: 'Skipped (Informational)',
        isAmbiguous: false,
        totalRows: nonEmptyRows.length,
        readyCount: 0,
        attentionCount: 0,
        headers: sheetHeaders,
        previewRows: [],
        readyRows: [],
        attentionRows: [],
        detectedFields: {},
        customColumns: [],
      });
      continue;
    }

    let detectedCategory = detection.type;
    let isAmbiguous = detection.isAmbiguous;

    if (sheetTypeOverrides[sheetName]) {
      detectedCategory = sheetTypeOverrides[sheetName];
      isAmbiguous = false;
    }

    // Module-specific filtering:
    // If user specifically picked a single module (e.g. 'sales'), only process sheets matching that module!
    // Do NOT run sales validator on Expenses or Products sheets, avoiding false errors!
    if (selectedCategory !== 'all') {
      const isSalesMatch = selectedCategory === 'sales' && detectedCategory === 'sales';
      const isExpMatch = selectedCategory === 'expenses' && (detectedCategory === 'expenses' || detectedCategory === 'purchases');
      const isInvMatch = selectedCategory === 'inventory' && detectedCategory === 'inventory';

      // If workbook has only 1 sheet, allow processing as the selected category
      const isSingleSheetWorkbook = sheetNames.length === 1;

      if (!isSalesMatch && !isExpMatch && !isInvMatch && !isSingleSheetWorkbook && !sheetTypeOverrides[sheetName]) {
        sheets.push({
          sheetName,
          detectedCategory,
          departmentName: DEPARTMENT_CONFIG[detectedCategory]?.name || detectedCategory,
          targetModule: DEPARTMENT_CONFIG[detectedCategory]?.targetModule || detectedCategory,
          isSkippedModule: true,
          isSkipped: true,
          skipReason: `Skipped in ${selectedCategory} mode`,
          action: 'Skipped (Different Module)',
          isAmbiguous: false,
          totalRows: nonEmptyRows.length,
          readyCount: 0,
          attentionCount: 0,
          headers: sheetHeaders,
          previewRows: [],
          readyRows: [],
          attentionRows: [],
          detectedFields: {},
          customColumns: [],
        });
        continue;
      }

      if (isSingleSheetWorkbook && !sheetTypeOverrides[sheetName]) {
        detectedCategory = selectedCategory;
      }
    } else {
      // In 'all' mode: flag ambiguous sheets for user clarification if needed
      if (isAmbiguous) {
        ambiguousSheets.push({
          sheetName,
          suggestedType: detectedCategory,
          candidates: detection.candidates || ['sales', 'expenses', 'inventory', 'purchases'],
          headers: sheetHeaders,
        });
      }
    }

    // Process sheet data using its mapped category
    const sheetResult = processSpreadsheetData(nonEmptyRows, detectedCategory);
    if (!sheetResult) continue;

    totalRawRows += nonEmptyRows.length;
    totalReadyCount += sheetResult.readyCount;
    totalAttentionCount += sheetResult.attentionCount;
    totalAutoCorrectedCount += sheetResult.autoCorrectedCount;

    // Route each detected category cleanly into its respective department
    const targetModule = detectedCategory;
    const departmentName = DEPARTMENT_CONFIG[detectedCategory]?.name || detectedCategory;

    sheetResult.readyRows.forEach((r) => {
      categorizedReadyRows[targetModule]?.push({
        ...r,
        sheetName,
        module: targetModule,
        subModule: detectedCategory,
        departmentName,
      });
    });

    sheetResult.attentionRows.forEach((r) => {
      categorizedAttentionRows[targetModule]?.push({
        ...r,
        sheetName,
        module: targetModule,
        subModule: detectedCategory,
        departmentName,
      });
    });

    sheets.push({
      sheetName,
      detectedCategory,
      departmentName,
      targetModule,
      isSkipped: false,
      isAmbiguous,
      totalRows: nonEmptyRows.length,
      readyCount: sheetResult.readyCount,
      attentionCount: sheetResult.attentionCount,
      headers: sheetHeaders,
      previewRows: sheetResult.previewRows,
      readyRows: sheetResult.readyRows,
      attentionRows: sheetResult.attentionRows,
      detectedFields: sheetResult.detectedFields,
      customColumns: sheetResult.customColumns,
      action: 'Import',
    });
  }

  // Extract preview for UI
  let previewRows = [];
  if (selectedCategory === 'sales') {
    previewRows = categorizedReadyRows.sales.slice(0, 5).map((r) => ({ ...r.data, _module: 'sales', _department: 'Sales & Invoices', _sheet: r.sheetName }));
  } else if (selectedCategory === 'expenses') {
    previewRows = categorizedReadyRows.expenses.slice(0, 5).map((r) => ({ ...r.data, _module: 'expenses', _department: 'Business Expenses', _sheet: r.sheetName }));
  } else if (selectedCategory === 'inventory') {
    previewRows = categorizedReadyRows.inventory.slice(0, 5).map((r) => ({ ...r.data, _module: 'inventory', _department: 'Products & Stock', _sheet: r.sheetName }));
  } else {
    // 'all' mode: mixed preview from each department
    previewRows = [
      ...categorizedReadyRows.sales.slice(0, 2).map((r) => ({ ...r.data, _module: 'sales', _department: 'Sales & Invoices', _sheet: r.sheetName })),
      ...categorizedReadyRows.expenses.filter((r) => r.subModule !== 'purchases').slice(0, 2).map((r) => ({ ...r.data, _module: 'expenses', _department: 'Business Expenses', _sheet: r.sheetName })),
      ...categorizedReadyRows.purchases.slice(0, 2).map((r) => ({ ...r.data, _module: 'purchases', _department: 'Ingredient Purchases', _sheet: r.sheetName })),
      ...categorizedReadyRows.inventory.slice(0, 2).map((r) => ({ ...r.data, _module: 'inventory', _department: 'Products & Stock', _sheet: r.sheetName })),
    ];
  }

  return {
    totalWorksheets: sheets.length,
    sheets,
    ambiguousSheets,
    allHeaders: Array.from(allHeadersSet),
    totalFieldsCount: allHeadersSet.size,
    totalRawRows,
    totalReadyCount,
    totalAttentionCount,
    totalAutoCorrectedCount,
    categorizedReadyRows,
    categorizedAttentionRows,
    previewRows,
  };
};

/**
 * Generate formatted starter template Excel / CSV file
 */

export const downloadTemplate = (categoryType, format = 'xlsx') => {
  let fileName = '';
  const workbook = XLSX.utils.book_new();

  if (categoryType === 'all') {
    fileName = 'MSME_Business_Data_Complete_Template';

    // Multi-sheet comprehensive template
    const salesData = [
      {
        'Customer Name': 'Sharma Enterprises Pvt Ltd',
        'Invoice Date': '15/10/2026',
        'Product / Item': 'Industrial Fasteners Pack',
        'Amount (₹)': 45000,
        'Payment Status': 'Paid',
        'Invoice Number': 'INV-2026-001',
        'GSTIN Number': '07AAAAA0000A1Z5',
        'Salesperson': 'Rahul Kumar',
      },
      {
        'Customer Name': 'Apex Electronics',
        'Invoice Date': '20/10/2026',
        'Product / Item': 'PCB Assembly Batch #4',
        'Amount (₹)': 28500,
        'Payment Status': 'Pending',
        'Invoice Number': 'INV-2026-002',
        'GSTIN Number': '27BBBBB1111B1Z2',
        'Salesperson': 'Sneha Patel',
      },
    ];

    const expenseData = [
      {
        'Expense Description': 'Office Electricity Bill',
        'Expense Date': '12/10/2026',
        'Amount (₹)': 14200,
        Category: 'Utilities',
        'Vendor / Paid To': 'State Electricity Board',
        'Payment Mode': 'NEFT / NetBanking',
      },
      {
        'Expense Description': 'Raw Materials Freight',
        'Expense Date': '18/10/2026',
        'Amount (₹)': 8500,
        Category: 'Logistics',
        'Vendor / Paid To': 'Blue Express Cargo',
        'Payment Mode': 'UPI',
      },
    ];

    const stockData = [
      {
        'Product Name': 'High-Tensile Hex Bolt M8',
        'Selling Price (₹)': 18.5,
        'Available Quantity': 450,
        Category: 'Hardware',
        'Unit of Measure': 'Pieces',
        'Low Stock Alert Level': 50,
        'Warehouse Location': 'Rack A-12',
      },
      {
        'Product Name': 'Copper Wire Spool 10m',
        'Selling Price (₹)': 240,
        'Available Quantity': 85,
        Category: 'Electrical',
        'Unit of Measure': 'Spools',
        'Low Stock Alert Level': 20,
        'Warehouse Location': 'Bay B-04',
      },
    ];

    const salesSheet = XLSX.utils.json_to_sheet(salesData);
    const expSheet = XLSX.utils.json_to_sheet(expenseData);
    const stockSheet = XLSX.utils.json_to_sheet(stockData);

    XLSX.utils.book_append_sheet(workbook, salesSheet, 'Sales Invoices');
    XLSX.utils.book_append_sheet(workbook, expSheet, 'Business Expenses');
    XLSX.utils.book_append_sheet(workbook, stockSheet, 'Stock & Catalog');

    XLSX.writeFile(workbook, `${fileName}.xlsx`, { bookType: 'xlsx' });
    return;
  }

  // Single category templates
  if (categoryType === 'sales') {
    fileName = 'Sales_Import_Template';
    const sampleData = [
      {
        'Customer Name': 'Sharma Enterprises Pvt Ltd',
        'Invoice Date': '15/10/2026',
        'Product / Item': 'Industrial Fasteners Pack',
        'Amount (₹)': 45000,
        'Payment Status': 'Paid',
        'Invoice Number': 'INV-2026-001',
      },
      {
        'Customer Name': 'Apex Electronics',
        'Invoice Date': '20/10/2026',
        'Product / Item': 'PCB Assembly Batch #4',
        'Amount (₹)': 28500,
        'Payment Status': 'Pending',
        'Invoice Number': 'INV-2026-002',
      },
      {
        'Customer Name': 'Vikas Logistics',
        'Invoice Date': '24/10/2026',
        'Product / Item': 'Fleet Spares Consignment',
        'Amount (₹)': 62000,
        'Payment Status': 'Paid',
        'Invoice Number': 'INV-2026-003',
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(workbook, ws, 'Sales');
  } else if (categoryType === 'expenses') {
    fileName = 'Expenses_Import_Template';
    const sampleData = [
      {
        'Expense Description': 'Office Electricity Bill',
        'Expense Date': '12/10/2026',
        'Amount (₹)': 14200,
        Category: 'Utilities',
        'Vendor / Paid To': 'State Electricity Board',
      },
      {
        'Expense Description': 'Raw Materials Freight',
        'Expense Date': '18/10/2026',
        'Amount (₹)': 8500,
        Category: 'Logistics',
        'Vendor / Paid To': 'Blue Express Cargo',
      },
      {
        'Expense Description': 'Workshop Maintenance & Tools',
        'Expense Date': '22/10/2026',
        'Amount (₹)': 6200,
        Category: 'Operations',
        'Vendor / Paid To': 'National Tool Works',
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(workbook, ws, 'Expenses');
  } else if (categoryType === 'inventory') {
    fileName = 'Products_Import_Template';
    const sampleData = [
      {
        'Product Name': 'High-Tensile Hex Bolt M8',
        'Selling Price (₹)': 18.5,
        'Available Quantity': 450,
        Category: 'Hardware',
        'Unit of Measure': 'Pieces',
        'Low Stock Alert Level': 50,
      },
      {
        'Product Name': 'Copper Wire Spool 10m',
        'Selling Price (₹)': 240,
        'Available Quantity': 85,
        Category: 'Electrical',
        'Unit of Measure': 'Spools',
        'Low Stock Alert Level': 20,
      },
      {
        'Product Name': 'Industrial Sealant Cartridge',
        'Selling Price (₹)': 380,
        'Available Quantity': 30,
        Category: 'Chemicals',
        'Unit of Measure': 'Tubes',
        'Low Stock Alert Level': 10,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(workbook, ws, 'Products');
  }

  if (format === 'csv') {
    XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
  } else {
    XLSX.writeFile(workbook, `${fileName}.xlsx`, { bookType: 'xlsx' });
  }
};
