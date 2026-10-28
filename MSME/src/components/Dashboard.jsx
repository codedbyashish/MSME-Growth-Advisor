import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Bot, Calendar, Check, ChevronLeft, ChevronRight, Download,
  FileSpreadsheet, LogOut, Menu, Plus, Receipt, Search, Send, Settings, Sparkles, User, X,
  AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, Clock, Eye, Package, TrendingDown, TrendingUp,
  ShieldCheck, RefreshCw, ExternalLink,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import ProfileView from './ProfileView';
import ImportModal from './modals/ImportModal';
import FloatingAdvisorChat from './FloatingAdvisorChat';
import { calculateProductDemandMetrics } from '../utils/demandCalculator';
import { cleanupAuditExpensesApi } from '../services/dataApi';

/* Helpers */

const formatDateToIso = (val) => {
  if (!val) return '';
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const dmyMatch = str.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  return str;
};

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const compact = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
      ? `₹${Math.round(n / 1000)}k`
      : `₹${Math.round(n)}`;

const sum = (list, key) =>
  list.reduce((total, item) => total + Number(item[key] || 0), 0);

const shortDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

const longDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const stockStatus = (stock, min) =>
  stock <= 0 ? 'Out of stock' : stock <= min ? 'Low stock' : 'In stock';

const paginate = (list, page, perPage) => ({
  pages: Math.max(1, Math.ceil(list.length / perPage)),
  items: list.slice((page - 1) * perPage, page * perPage),
});

function downloadCSV(name, headers, rows) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\n');
  const url = URL.createObjectURL(
    new Blob([csv], { type: 'text/csv' })
  );

  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* Forms */

const SALE_FIELDS = [
  { name: 'client', label: 'Customer name', placeholder: 'e.g. Sunita Jain', required: true, wide: true },
  { name: 'item', label: 'What was sold', placeholder: 'e.g. Cotton fabric roll', wide: true },
  { name: 'amount', label: 'Amount (₹)', type: 'number', placeholder: '15000', required: true },
  { name: 'status', label: 'Payment status', options: ['Paid', 'Pending', 'Overdue'] },
];

const EXPENSE_FIELDS = [
  { name: 'title', label: 'What was it for', placeholder: 'e.g. Raw materials', required: true, wide: true },
  { name: 'category', label: 'Category', options: ['Inventory', 'Logistics', 'Utilities', 'Packaging', 'Other'] },
  { name: 'amount', label: 'Amount (₹)', type: 'number', placeholder: '8500', required: true },
  { name: 'vendor', label: 'Supplier (optional)', placeholder: 'e.g. Surat Mills', wide: true },
];

const PRODUCT_FIELDS = [
  { name: 'name', label: 'Product name', placeholder: 'e.g. Office chair', required: true, wide: true },
  { name: 'category', label: 'Category', options: ['Textiles', 'Electronics', 'Furniture', 'Hardware', 'General'] },
  { name: 'stock', label: 'Units in stock', type: 'number', placeholder: '50', required: true },
  { name: 'unitPrice', label: 'Unit price (₹)', type: 'number', placeholder: '4200', required: true },
  { name: 'minStock', label: 'Low-stock alert at', type: 'number', placeholder: '10' },
];

const EMPTY_SALE = { client: '', item: '', amount: '', status: 'Paid' };
const EMPTY_EXPENSE = { title: '', category: 'Inventory', amount: '', vendor: '' };
const EMPTY_PRODUCT = { name: '', category: 'Textiles', stock: '', unitPrice: '', minStock: '10' };

/* Design system */

const ui = {
  card: 'rounded-lg border border-[#E7E3DC] bg-white',

  primary:
    'inline-flex items-center justify-center gap-2 rounded-md bg-[#202B3C] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#151D2A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202B3C]/40',

  ghost:
    'inline-flex items-center justify-center gap-2 rounded-md border border-[#E7E3DC] bg-white px-3.5 py-2 text-sm font-medium text-[#202B3C] transition-colors hover:bg-[#F5F3EE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202B3C]/40',

  input:
    'w-full rounded-md border border-[#E7E3DC] bg-[#FAF9F6] px-3 py-2 text-sm text-[#202B3C] placeholder-[#9AA2AD] focus:border-[#202B3C] focus:bg-white focus:outline-none',
};

const TONES = {
  good: 'bg-emerald-50 text-emerald-700',
  warn: 'bg-amber-50 text-amber-700',
  bad: 'bg-red-50 text-red-700',
  neutral: 'bg-stone-100 text-stone-700',
};

const STATUS_TONE = {
  Paid: 'good',
  Pending: 'warn',
  Overdue: 'bad',
  'In stock': 'good',
  'Low stock': 'warn',
  'Out of stock': 'bad',
  Active: 'good',
  'Follow up': 'warn',
  'High Demand': 'good',
  'Rising Demand': 'good',
  'Stable': 'neutral',
  'Restock Soon': 'warn',
  'Monitor Stock': 'good',
  'Potential Stockout': 'bad',
  'Stock Sufficient': 'good',
  'Collect More Sales Data': 'neutral',
};

const Badge = ({ children }) => (
  <span
    className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
      TONES[STATUS_TONE[children]] || TONES.good
    }`}
  >
    {children}
  </span>
);

/* Shared components */

function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[#737D8B]">{subtitle}</p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap gap-2">{children}</div>
      )}
    </div>
  );
}

function Stat({ label, value, note, tone }) {
  return (
    <div className={`${ui.card} p-3 sm:p-4 min-w-0 overflow-hidden`}>
      <p className="text-xs sm:text-sm text-[#737D8B] truncate">{label}</p>

      <p className="mt-1 sm:mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight tabular-nums break-words">
        {value}
      </p>

      {note && (
        <p
          className={`mt-1 sm:mt-1.5 text-xs sm:text-sm truncate ${
            tone === 'warn' ? 'text-amber-700 font-medium' : 'text-[#737D8B]'
          }`}
        >
          {note}
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  pad = true,
  className = '',
  children,
}) {
  return (
    <section className={`${ui.card} ${className}`}>
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div>
          <h2 className="text-sm font-semibold sm:text-base">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-[#737D8B]">{subtitle}</p>
          )}
        </div>

        {action}
      </div>

      <div className={`mt-3.5 ${pad ? 'px-4 pb-4' : ''}`}>
        {children}
      </div>
    </section>
  );
}

function Table({ columns, rows, empty = 'Nothing to show yet.' }) {
  return (
    <div className="overflow-x-auto -webkit-overflow-scrolling-touch scrollbar-thin">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead>
          <tr className="border-y border-[#E7E3DC] bg-[#FAF9F6] text-[#737D8B]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 font-medium ${
                  c.right ? 'text-right' : ''
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#F0EDE6]">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-xs sm:text-sm text-[#737D8B]"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={`${row.id ?? row.name}-${i}`}
                className="transition-colors hover:bg-[#FAF9F6]"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`whitespace-nowrap px-3 sm:px-4 py-2 sm:py-2.5 ${
                      c.right ? 'text-right tabular-nums' : ''
                    } ${c.muted ? 'text-[#737D8B]' : ''}`}
                  >
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Pager({ page, pages, total, perPage, onChange }) {
  if (total === 0) return null;

  const arrow =
    'rounded-md p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors hover:bg-[#F5F3EE] disabled:opacity-40 cursor-pointer';

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E7E3DC] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#737D8B]">
      <span>
        {(page - 1) * perPage + 1}–
        {Math.min(page * perPage, total)} of {total}
      </span>

      <div className="flex items-center gap-1">
        <button
          className={arrow}
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="px-2 font-medium text-[#202B3C]">
          {page} / {pages}
        </span>

        <button
          className={arrow}
          disabled={page === pages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SearchBox({ value, onChange, placeholder, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA2AD]" />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${ui.input} pl-9 text-xs sm:text-sm min-h-[38px]`}
      />
    </div>
  );
}

function FormModal({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onClose,
  submitLabel,
  error,
}) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B3C]/40 p-3 sm:p-4 overflow-y-auto">
      <form
        onSubmit={onSubmit}
        className={`${ui.card} w-full max-w-md p-4 sm:p-5 shadow-xl my-auto max-h-[92vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-semibold text-[#202B3C]">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#737D8B] hover:bg-[#F5F3EE] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {fields.map((f) => (
            <label
              key={f.name}
              className={`block text-xs sm:text-sm ${f.wide ? 'sm:col-span-2' : ''}`}
            >
              <span className="mb-1 block font-medium">{f.label}</span>

              {f.options ? (
                <select
                  value={values[f.name]}
                  onChange={(e) =>
                    onChange({ ...values, [f.name]: e.target.value })
                  }
                  className={`${ui.input} text-xs sm:text-sm min-h-[40px]`}
                >
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  required={f.required}
                  min={f.type === 'number' ? 0 : undefined}
                  placeholder={f.placeholder}
                  value={values[f.name]}
                  onChange={(e) =>
                    onChange({ ...values, [f.name]: e.target.value })
                  }
                  className={`${ui.input} text-xs sm:text-sm min-h-[40px]`}
                />
              )}
            </label>
          ))}
        </div>

        {error && <p className="mt-3 text-xs sm:text-sm text-red-700">{error}</p>}

        <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`${ui.ghost} w-full sm:w-auto min-h-[40px]`}
          >
            Cancel
          </button>

          <button type="submit" className={`${ui.primary} w-full sm:w-auto min-h-[40px]`}>
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

/* Compact revenue chart & period aggregation */

const REVENUE_PERIODS = [
  { id: 'day', label: 'Days' },
  { id: 'week', label: 'Weeks' },
  { id: 'month', label: 'Months' },
  { id: 'year', label: 'Years' },
];

const PERIOD_SUBTITLES = {
  day: 'Daily revenue from recorded sales.',
  week: 'Weekly revenue from recorded sales.',
  month: 'Monthly revenue trends from recorded sales.',
  year: 'Annual revenue comparison from recorded sales.',
};

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

function RevenueChart({ data }) {
  const [hover, setHover] = useState(null);

  if (!data || !data.length) {
    return (
      <div className="flex h-36 items-center justify-center text-sm text-[#737D8B]">
        Record a sale to see your revenue trend.
      </div>
    );
  }

  const W = 720;
  const H = 195;
  const LEFT = 60;
  const RIGHT = 16;
  const TOP = 16;
  const BOTTOM = 36;
  const chartHeight = H - TOP - BOTTOM;
  const chartWidth = W - LEFT - RIGHT;
  const maxValue = Math.max(
    ...data.map((d) => Number(d.revenue) || 0),
    1
  );

  const slot = chartWidth / data.length;
  const barWidth = Math.max(3, Math.min(34, slot * 0.62));

  // Smart label spacing to prevent collision / overlap
  const maxLabels = 10;
  const step = data.length > maxLabels ? Math.ceil(data.length / maxLabels) : 1;

  const bars = data.map((d, i) => {
    const value = Number(d.revenue) || 0;
    const height = (value / maxValue) * chartHeight * 0.9;

    return {
      ...d,
      value,
      x: LEFT + i * slot + (slot - barWidth) / 2,
      y: TOP + chartHeight - height,
      height,
      center: LEFT + i * slot + slot / 2,
      showLabel: i % step === 0 || i === data.length - 1,
    };
  });

  const active = hover !== null ? bars[hover] : null;

  return (
    <div className="w-full">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-[160px] w-full sm:h-[180px]"
          role="img"
          aria-label="Revenue bar chart"
        >
          {[0, 0.5, 1].map((fraction) => {
            const y = TOP + chartHeight * (1 - fraction);

            return (
              <g key={fraction}>
                <line
                  x1={LEFT}
                  x2={W - RIGHT}
                  y1={y}
                  y2={y}
                  stroke="#E7E3DC"
                  strokeDasharray="3 4"
                />

                <text
                  x={LEFT - 9}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#87909D"
                >
                  {compact(maxValue * fraction)}
                </text>
              </g>
            );
          })}

          {bars.map((bar, i) => (
            <g
              key={`${bar.key || bar.label}-${i}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onTouchStart={() => setHover(i)}
              className="cursor-pointer"
            >
              {/* Invisible wider target for easier hover */}
              <rect
                x={LEFT + i * slot}
                y={TOP}
                width={Math.max(1, slot)}
                height={chartHeight + 16}
                fill="transparent"
              />

              <rect
                x={bar.x}
                y={bar.y}
                width={barWidth}
                height={Math.max(0, bar.height)}
                rx={barWidth > 6 ? 3 : 1}
                fill={hover === i ? '#202B3C' : '#718096'}
                opacity={hover === i ? 1 : 0.8}
                className="transition-colors duration-150"
              />

              {bar.showLabel ? (
                <text
                  x={bar.center}
                  y={H - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill={hover === i ? '#202B3C' : '#737D8B'}
                  fontWeight={hover === i ? '600' : '400'}
                >
                  {bar.label}
                </text>
              ) : (
                <circle
                  cx={bar.center}
                  cy={H - 16}
                  r="1.5"
                  fill={hover === i ? '#202B3C' : '#CBD5E1'}
                />
              )}
            </g>
          ))}
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute z-10 rounded-md bg-[#202B3C] px-3 py-2 text-xs text-white shadow-lg transition-all"
            style={{
              left: `${(active.center / W) * 100}%`,
              top: `${Math.max(0, (active.y / H) * 100 - 4)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-semibold">{active.fullLabel || active.label}</p>
            <p className="mt-1 text-sm font-bold">{money(active.value)}</p>
            <p className="mt-0.5 text-white/70">
              {active.orders} order{active.orders === 1 ? '' : 's'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


/* Dashboard */

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    sales: liveSales,
    expenses: liveExpenses,
    inventory: liveInventory,
    refreshData,
    addSale,
    updateSale, // NEW
    addExpense,
    addProduct,
    isAddSaleOpen,
    setIsAddSaleOpen,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    isAddProductOpen,
    setIsAddProductOpen,
    isAiChatOpen,
    setIsAiChatOpen,
    activeTab: tab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
  } = useData();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importCategory, setImportCategory] = useState('sales');
  const [payingId, setPayingId] = useState(null); // NEW

  const openImport = (cat = 'sales') => {
    setImportCategory(cat);
    setIsImportOpen(true);
  };

  const [saleForm, setSaleForm] = useState(EMPTY_SALE);
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('All');
  const [orderPage, setOrderPage] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [forecastFilter, setForecastFilter] = useState('all');
  const [forecastPage, setForecastPage] = useState(1);
  const [revenuePeriod, setRevenuePeriod] = useState('month');

  // Profit & Loss, Audit & Date Range State
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2026-27');
  const [includeProcurementInPnL, setIncludeProcurementInPnL] = useState(false);
  const [pnlAuditSearch, setPnlAuditSearch] = useState('');
  const [pnlCategoryFilter, setPnlCategoryFilter] = useState('All');
  const [pnlAuditPage, setPnlAuditPage] = useState(1);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isCleaningUpAudit, setIsCleaningUpAudit] = useState(false);
  const [cleanupSuccessMsg, setCleanupSuccessMsg] = useState('');

  /* Identity */

  const businessName =
    user?.businessName ||
    user?.name ||
    user?.fullName ||
    user?.email?.split('@')[0] ||
    'My Business';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const now = new Date();
  const fyStart =
    now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;

  const fyDateRange = useMemo(() => {
    if (selectedFiscalYear === 'all') return null;
    const parts = selectedFiscalYear.split('-');
    const startYear = parseInt(parts[0], 10);
    const endYear = parts[1].length === 2 ? parseInt(`20${parts[1]}`, 10) : parseInt(parts[1], 10);
    return {
      start: `${startYear}-04-01`,
      end: `${endYear}-03-31`,
      label: `FY ${startYear}-${String(endYear).slice(2)}`,
    };
  }, [selectedFiscalYear]);

  const fiscalYear = fyDateRange ? fyDateRange.label : 'All Time';

  /* Data */

  const sales = liveSales;
  const expenses = liveExpenses;
  const inventory = liveInventory;

  // Consistently filter both revenue and expenses by selected fiscal-year date range
  const filteredSalesByFY = useMemo(() => {
    if (!fyDateRange) return sales;
    return sales.filter((s) => {
      const d = formatDateToIso(s.date);
      return d >= fyDateRange.start && d <= fyDateRange.end;
    });
  }, [sales, fyDateRange]);

  const filteredExpensesByFY = useMemo(() => {
    if (!fyDateRange) return expenses;
    return expenses.filter((e) => {
      const d = formatDateToIso(e.date);
      return d >= fyDateRange.start && d <= fyDateRange.end;
    });
  }, [expenses, fyDateRange]);

  // Separate legitimate recurring operating expenses from raw material procurement items
  const { operatingExpenses, procurementExpenses } = useMemo(() => {
    const operating = [];
    const procurement = [];

    filteredExpensesByFY.forEach((e) => {
      const cat = String(e.category || '').toLowerCase();
      const title = String(e.title || '').toLowerCase();
      const meta = e.metadata || {};

      const isProcurement =
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
        title.includes('cooking oil');

      if (isProcurement) {
        procurement.push(e);
      } else {
        operating.push(e);
      }
    });

    return { operatingExpenses: operating, procurementExpenses: procurement };
  }, [filteredExpensesByFY]);

  // Recognized active expenses according to accounting rules (or comparison mode)
  const activeExpensesForMetrics = useMemo(() => {
    return includeProcurementInPnL ? filteredExpensesByFY : operatingExpenses;
  }, [includeProcurementInPnL, filteredExpensesByFY, operatingExpenses]);

  // Live demand analysis computed from actual sales transactions and catalog inventory
  const demandMetrics = useMemo(
    () => calculateProductDemandMetrics(sales, inventory),
    [sales, inventory]
  );

  const filteredDemandProducts = useMemo(() => {
    const list = [...demandMetrics.products];
    switch (forecastFilter) {
      case 'growth':
        return list.sort((a, b) => {
          const aVal = a.growthType === 'new_demand' ? 9999 : (a.demandGrowth ?? -999);
          const bVal = b.growthType === 'new_demand' ? 9999 : (b.demandGrowth ?? -999);
          return bVal - aVal;
        });
      case 'volume':
        return list.sort((a, b) => (b.currentUnits || 0) - (a.currentUnits || 0));
      case 'rising_low_stock':
        return list
          .filter(
            (p) =>
              (p.demandStatus === 'High Demand' ||
                p.demandStatus === 'Rising Demand' ||
                (p.demandGrowth || 0) > 0 ||
                p.growthType === 'new_demand') &&
              (p.currentStock <= p.minStock || p.willStockout)
          )
          .sort((a, b) => {
            if (a.willStockout && !b.willStockout) return -1;
            if (!a.willStockout && b.willStockout) return 1;
            return (b.currentUnits || 0) - (a.currentUnits || 0);
          });
      case 'all':
      default:
        return list.sort((a, b) => {
          if (b.currentUnits !== a.currentUnits) return b.currentUnits - a.currentUnits;
          return (b.demandGrowth || 0) - (a.demandGrowth || 0);
        });
    }
  }, [demandMetrics.products, forecastFilter]);

  const demandPaged = paginate(filteredDemandProducts, forecastPage, 8);

  const orders = useMemo(
    () =>
      sales.map((s) => ({
        rawId: s.id, // NEW: real database id, used when saving changes
        id: String(s.id || '').startsWith('#') ? s.id : `#${s.id}`,
        customer: s.client || 'Customer',
        date: s.date ? longDate(s.date) : 'Today',
        item: s.item || 'Business supplies',
        amount: Number(s.amount || 0),
        status:
          s.status === 'Paid' || s.status === 'Pending'
            ? s.status
            : 'Overdue',
      })),
    [sales]
  );

  const products = useMemo(
    () =>
      inventory.map((p) => {
        const stock = Number(p.stock || 0);

        return {
          id: p.id,
          name: p.name,
          category: p.category || 'General',
          stock,
          unitPrice: Number(p.unitPrice || 0),
          status: stockStatus(stock, Number(p.minStock || 10)),
        };
      }),
    [inventory]
  );

  const customers = useMemo(() => {
    const map = {};

    orders.forEach((o) => {
      const c = (map[o.customer] = map[o.customer] || {
        name: o.customer,
        orders: 0,
        total: 0,
        overdue: false,
        pending: false,
      });

      c.orders += 1;
      c.total += o.amount;

      if (o.status === 'Overdue') c.overdue = true;
      if (o.status === 'Pending') c.pending = true;
    });

    return Object.values(map)
      .map((c) => ({
        ...c,
        status: c.overdue ? 'Overdue' : c.pending ? 'Follow up' : 'Active',
      }))
      .sort((a, b) => b.total - a.total);
  }, [orders]);

  const chartData = useMemo(() => {
    return getAggregatedRevenue(sales, revenuePeriod);
  }, [sales, revenuePeriod]);

  const chartSummary = useMemo(() => {
    const list = chartData.filter((d) => d.label !== 'Start');
    const total = sum(list, 'revenue');
    const count = list.length || 1;
    const avg = Math.round(total / count);
    const peak = list.length
      ? [...list].sort((a, b) => b.revenue - a.revenue)[0]
      : null;
    return { total, avg, peak };
  }, [chartData]);

  /* Metrics */

  const revenue = sum(filteredSalesByFY, 'amount');
  const unpaid = filteredSalesByFY.filter((o) => o.status !== 'Paid');
  const unpaidTotal = sum(unpaid, 'amount');
  const collectedTotal = revenue - unpaidTotal;
  // Calculate expenses only from valid operational expense transactions according to accounting rules
  const expenseTotal = sum(activeExpensesForMetrics, 'amount');
  // Net profit is recognized revenue minus recognized expenses
  const profit = revenue - expenseTotal;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const avgOrder = filteredSalesByFY.length ? Math.round(revenue / filteredSalesByFY.length) : 0;

  // Expense breakdown by category
  const expenseBreakdown = useMemo(() => {
    const list = activeExpensesForMetrics;
    const totals = {};
    const counts = {};

    list.forEach((e) => {
      const cat = e.category || 'Operations';
      totals[cat] = (totals[cat] || 0) + Number(e.amount || 0);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const activeTotal = sum(list, 'amount');

    return Object.entries(totals)
      .map(([cat, amount]) => ({
        category: cat,
        count: counts[cat],
        amount,
        percentage: activeTotal > 0 ? (amount / activeTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [activeExpensesForMetrics]);

  // Transaction-level audit list showing exact records that make up the total
  const auditTransactions = useMemo(() => {
    const list = activeExpensesForMetrics;
    return list
      .filter((e) => {
        if (pnlCategoryFilter !== 'All' && e.category !== pnlCategoryFilter) return false;
        if (!pnlAuditSearch) return true;
        const q = pnlAuditSearch.toLowerCase();
        return (
          (e.expenseId || '').toLowerCase().includes(q) ||
          (e.title || '').toLowerCase().includes(q) ||
          (e.vendor || '').toLowerCase().includes(q) ||
          (e.category || '').toLowerCase().includes(q)
        );
      })
      .map((e) => ({
        id: e.expenseId || e._id,
        _id: e._id,
        date: e.date,
        title: e.title,
        category: e.category || 'Operations',
        vendor: e.vendor || 'Standard Vendor',
        amount: Number(e.amount || 0),
        isProcurement: procurementExpenses.some((p) => p._id === e._id),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeExpensesForMetrics, procurementExpenses, pnlCategoryFilter, pnlAuditSearch]);

  const pnlAuditPaged = paginate(auditTransactions, pnlAuditPage, 10);

  // Safe cleanup handler for suspected procurement records in Expenses
  const handleSafeCleanup = async (action) => {
    setIsCleaningUpAudit(true);
    setCleanupSuccessMsg('');
    try {
      const ids = procurementExpenses.map((p) => p._id);
      const res = await cleanupAuditExpensesApi({
        action,
        expenseIds: ids,
      });

      setCleanupSuccessMsg(res.message || 'Audit cleanup completed successfully.');
      await refreshData();
      setTimeout(() => {
        setIsAuditModalOpen(false);
        setCleanupSuccessMsg('');
      }, 1500);
    } catch (err) {
      alert(err?.response?.data?.message || 'Error executing cleanup');
    } finally {
      setIsCleaningUpAudit(false);
    }
  };

  const repeatRate = customers.length
    ? Math.round(
        (customers.filter((c) => c.orders > 1).length / customers.length) * 100
      )
    : 0;

  const lowStock = products.filter((p) => p.status !== 'In stock');

  const actions = [
    unpaid.length > 0 &&
      `Collect ${money(unpaidTotal)} from ${unpaid.length} unpaid invoice${unpaid.length > 1 ? 's' : ''}.`,

    lowStock.length > 0 &&
      `Restock ${lowStock.slice(0, 2).map((p) => p.name).join(' and ')}${lowStock.length > 2 ? ' and more' : ''}.`,

    revenue > 0 &&
      margin < 20 &&
      'Your margin is under 20%. Review your biggest expenses.',
  ].filter(Boolean);

  if (actions.length === 0) {
    actions.push('Everything looks on track. Keep recording sales and expenses.');
  }

  /* Tables */

  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();

    const matchesText = [o.id, o.customer, o.item].some((v) =>
      v.toLowerCase().includes(q)
    );

    return matchesText && (orderStatus === 'All' || o.status === orderStatus);
  });

  const ordersPaged = paginate(filteredOrders, orderPage, 6);

  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(productSearch.toLowerCase())
  );

  const productsPaged = paginate(filteredProducts, productPage, 6);

  const recentOrders = orders
    .filter((o) =>
      `${o.id} ${o.customer} ${o.item}`
        .toLowerCase()
        .includes((searchQuery || '').toLowerCase())
    )
    .slice(0, 5);

  /* Mark as paid */ // NEW

  const markAsPaid = async (order) => {
    if (
      !window.confirm(
        `Mark ${money(order.amount)} from ${order.customer} as received?`
      )
    )
      return;

    try {
      setPayingId(order.rawId);
      await updateSale(order.rawId, { status: 'Paid' });
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          'Could not update payment. Please try again.'
      );
    } finally {
      setPayingId(null);
    }
  };

  const statusCol = {
    key: 'status',
    label: 'Status',
    render: (r) => <Badge>{r.status}</Badge>,
  };

  // NEW
  const actionCol = {
    key: 'action',
    label: 'Action',
    render: (r) =>
      r.status === 'Paid' ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
          <Check className="h-3.5 w-3.5" /> Received
        </span>
      ) : (
        <button
          onClick={() => markAsPaid(r)}
          disabled={payingId === r.rawId}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#E7E3DC] bg-white px-2.5 py-1 text-xs font-medium text-[#202B3C] transition-colors hover:bg-[#202B3C] hover:text-white disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {payingId === r.rawId ? 'Saving…' : 'Mark as paid'}
        </button>
      ),
  };

  const orderColumns = [
    { key: 'id', label: 'Invoice', muted: true },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date', muted: true },
    { key: 'item', label: 'Item', muted: true },
    { key: 'amount', label: 'Amount', right: true, render: (r) => money(r.amount) },
    statusCol,
    actionCol, // NEW
  ];

  const recentColumns = [
    { key: 'customer', label: 'Customer' },
    { key: 'item', label: 'Item', muted: true },
    { key: 'amount', label: 'Amount', right: true, render: (r) => money(r.amount) },
    statusCol,
    actionCol, // NEW
  ];

  const customerColumns = [
    { key: 'name', label: 'Customer' },
    { key: 'orders', label: 'Orders', right: true },
    { key: 'total', label: 'Total spent', right: true, render: (r) => money(r.total) },
    statusCol,
  ];

  const productColumns = [
    { key: 'name', label: 'Item' },
    { key: 'category', label: 'Category', muted: true },
    { key: 'stock', label: 'In stock', right: true },
    { key: 'unitPrice', label: 'Unit price', right: true, render: (r) => money(r.unitPrice) },
    statusCol,
  ];

  const demandColumns = [
    {
      key: 'name',
      label: 'Product',
      render: (r) => (
        <div>
          <div className="font-medium text-[#202B3C]">{r.name}</div>
          <div className="text-xs text-[#737D8B]">{r.category || 'General'}</div>
        </div>
      ),
    },
    {
      key: 'currentUnits',
      label: 'Units Sold',
      right: true,
      render: (r) => (
        <span className="font-semibold text-[#202B3C]">
          {r.currentUnits} <span className="text-xs font-normal text-[#737D8B]">{r.unit || 'units'}</span>
        </span>
      ),
    },
    {
      key: 'prevUnits',
      label: 'Previous Period',
      right: true,
      render: (r) => (
        <span className="text-[#737D8B]">
          {r.prevUnits} <span className="text-xs">{r.unit || 'units'}</span>
        </span>
      ),
    },
    {
      key: 'demandGrowth',
      label: 'Demand Growth',
      render: (r) => {
        if (r.growthType === 'insufficient') {
          return (
            <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
              <Clock className="h-3 w-3" />
              Insufficient History
            </span>
          );
        }
        if (r.growthType === 'new_demand') {
          return (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              New Demand
            </span>
          );
        }
        if (r.demandGrowth > 0) {
          return (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <TrendingUp className="h-3 w-3" />
              +{r.demandGrowth}%
            </span>
          );
        }
        if (r.demandGrowth < 0) {
          return (
            <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
              <TrendingDown className="h-3 w-3" />
              {r.demandGrowth}%
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
            0.0% (Stable)
          </span>
        );
      },
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
      right: true,
      render: (r) => {
        const isLow = r.currentStock <= r.minStock;
        return (
          <div className="flex items-center justify-end gap-1.5">
            {isLow && <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
            <span className={isLow ? 'font-medium text-amber-700' : 'text-[#202B3C]'}>
              {r.currentStock} {r.unit || 'units'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'forecastDemand',
      label: 'Forecast Demand',
      right: true,
      render: (r) => (
        <span className="font-semibold text-[#202B3C]">
          ~{r.forecastDemand} <span className="text-xs font-normal text-[#737D8B]">{r.unit || 'units'}</span>
        </span>
      ),
    },
    {
      key: 'recommendation',
      label: 'Recommendation',
      render: (r) => {
        const toneMap = {
          'Potential Stockout': 'bg-red-50 text-red-700 border border-red-200',
          'Restock Soon': 'bg-amber-50 text-amber-700 border border-amber-200',
          'Monitor Stock': 'bg-blue-50 text-blue-700 border border-blue-200',
          'Stock Sufficient': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          'Collect More Sales Data': 'bg-stone-100 text-stone-600 border border-stone-200',
        };
        const iconMap = {
          'Potential Stockout': <AlertCircle className="h-3 w-3" />,
          'Restock Soon': <AlertTriangle className="h-3 w-3" />,
          'Monitor Stock': <Eye className="h-3 w-3" />,
          'Stock Sufficient': <Check className="h-3 w-3" />,
          'Collect More Sales Data': <Clock className="h-3 w-3" />,
        };
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              toneMap[r.recommendation] || 'bg-stone-100 text-stone-700'
            }`}
          >
            {iconMap[r.recommendation]}
            {r.recommendation}
          </span>
        );
      },
    },
  ];

  /* Actions */

  const closeModal = (setter, reset) => () => {
    setter(false);
    reset();
    setFormError('');
  };

  const submit = (action, values, close) => async (e) => {
    e.preventDefault();

    try {
      await action(values);
      close();
    } catch (err) {
      setFormError(
        err?.response?.data?.message || 'Could not save. Please try again.'
      );
    }
  };

  const closeSale = closeModal(setIsAddSaleOpen, () => setSaleForm(EMPTY_SALE));
  const closeExpense = closeModal(setIsAddExpenseOpen, () => setExpenseForm(EMPTY_EXPENSE));
  const closeProduct = closeModal(setIsAddProductOpen, () => setProductForm(EMPTY_PRODUCT));

  const exportOrders = () =>
    downloadCSV(
      'Invoices',
      ['Invoice', 'Customer', 'Date', 'Item', 'Amount', 'Status'],
      filteredOrders.map((o) => [
        o.id, o.customer, o.date, o.item, o.amount, o.status,
      ])
    );

  const exportProducts = () =>
    downloadCSV(
      'Products',
      ['Item', 'Category', 'In stock', 'Unit price', 'Status'],
      filteredProducts.map((p) => [
        p.name, p.category, p.stock, p.unitPrice, p.status,
      ])
    );

  const exportPnL = () => {
    const fyLabel = fyDateRange ? fyDateRange.label : 'All Time';
    const activeExpenseTotal = sum(activeExpensesForMetrics, 'amount');
    const activeCollected = revenue - unpaidTotal;

    const rows = [
      ['PROFIT & LOSS STATEMENT', ''],
      ['Business Name', businessName],
      ['Financial Year Scope', fyLabel],
      ['Accounting Framework', includeProcurementInPnL ? 'Full Cash Outflows (including Raw Material Procurement)' : 'Recognized Operating Expenses (Standard MSME Accounting)'],
      ['Report Generation Date', new Date().toISOString().slice(0, 10)],
      ['Operational Health Status', profit >= 0 ? 'Profitable Operations' : 'Operating Deficit'],
      ['', ''],
      ['I. RECOGNIZED FINANCIAL SUMMARY', 'AMOUNT (INR)'],
      ['Total Recognized Revenue', revenue.toFixed(2)],
      ['Revenue Collected (Paid Invoices)', activeCollected.toFixed(2)],
      ['Receivables Pending (Unpaid Invoices)', unpaidTotal.toFixed(2)],
      ['Recognized Operating Expenses', activeExpenseTotal.toFixed(2)],
      ['Net Operating Profit / (Loss)', profit.toFixed(2)],
      ['Net Operating Margin (%)', `${margin.toFixed(1)}%`],
      ['Total Sales Orders (Count)', filteredSalesByFY.length],
      ['Total Operating Expense Transactions (Count)', activeExpensesForMetrics.length],
      ...(procurementExpenses.length > 0
        ? [
            ['Excluded Raw Material Procurement Records (Count)', procurementExpenses.length],
            ['Excluded Raw Material Procurement Total (INR)', sum(procurementExpenses, 'amount').toFixed(2)],
          ]
        : []),
      ['', ''],
      ['II. EXPENSE BREAKDOWN BY CATEGORY', 'TRANSACTION COUNT', 'TOTAL AMOUNT (INR)', 'PERCENTAGE (%)'],
      ...expenseBreakdown.map((b) => [
        b.category,
        b.count,
        b.amount.toFixed(2),
        `${b.percentage.toFixed(1)}%`,
      ]),
      ['', ''],
      ['III. TRANSACTION-LEVEL EXPENSE AUDIT', 'DATE', 'DESCRIPTION', 'CATEGORY', 'VENDOR', 'AMOUNT (INR)'],
      ...auditTransactions.map((t) => [
        t.id,
        t.date,
        t.title,
        t.category,
        t.vendor,
        t.amount.toFixed(2),
      ]),
    ];

    downloadCSV(
      `Profit_and_Loss_${businessName.replace(/\s+/g, '_')}_${fyLabel.replace(/\s+/g, '_')}`,
      ['Section / Identifier', 'Detail / Date', 'Item / Particulars', 'Category', 'Vendor', 'Amount (INR)'],
      rows
    );
  };

  /* Render */

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-sans text-[#202B3C] antialiased">
      <Sidebar
        activeTab={tab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-3 border-b border-[#E7E3DC] bg-white px-3 py-2.5 sm:px-6 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
              className="rounded-md border border-[#E7E3DC] p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#737D8B] hover:bg-[#F5F3EE] lg:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search invoices or customers"
              className="hidden w-64 md:block lg:w-72"
            />

            {/* Mobile Search Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((o) => !o)}
              aria-label="Toggle search"
              className="rounded-md border border-[#E7E3DC] p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#737D8B] hover:bg-[#F5F3EE] md:hidden cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2 rounded-md border border-[#E7E3DC] bg-[#FAF9F6] px-2 py-1 text-xs text-[#737D8B] sm:px-3 sm:py-1.5 sm:text-sm">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#737D8B] shrink-0" />
              <span className="font-medium truncate max-w-[72px] sm:max-w-none">{fiscalYear}</span>
            </div>

            <button
              onClick={() => setActiveTab('insights')}
              aria-label="Alerts"
              className="relative rounded-md border border-[#E7E3DC] p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#737D8B] hover:bg-[#F5F3EE] cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {(unpaid.length > 0 || lowStock.length > 0) && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-label="Account menu"
                className="flex h-9 w-9 sm:h-10 sm:w-10 min-w-[36px] min-h-[36px] items-center justify-center rounded-md bg-[#202B3C] text-sm font-semibold text-white hover:bg-[#151D2A] cursor-pointer"
              >
                {businessName.charAt(0).toUpperCase()}
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />

                  <div className="absolute right-0 z-50 mt-2 w-60 rounded-lg border border-[#E7E3DC] bg-white py-1 text-sm shadow-lg">
                    <div className="border-b border-[#E7E3DC] px-4 py-3">
                      <p className="truncate font-semibold">
                        {user?.name || businessName}
                      </p>
                      <p className="truncate text-xs text-[#737D8B]">
                        {user?.email || 'MSME account'}
                      </p>
                    </div>

                    {[
                      ['profile', 'Business profile', User],
                      ['settings', 'Settings', Settings],
                    ].map(([id, label, Icon]) => (
                      <button
                        key={id}
                        onClick={() => {
                          setActiveTab(id);
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-left hover:bg-[#FAF9F6]"
                      >
                        <Icon className="h-4 w-4 text-[#737D8B]" />
                        {label}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex w-full items-center gap-2.5 border-t border-[#E7E3DC] px-4 py-2 text-left text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {mobileSearchOpen && (
          <div className="border-b border-[#E7E3DC] bg-[#FAF9F6] px-4 py-2.5 md:hidden">
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search invoices or customers..."
              className="w-full"
            />
          </div>
        )}

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 p-3.5 sm:p-5 lg:px-8 lg:py-6">
          {/* Overview */}

          {tab === 'dashboard' && (
            <div className="animate-fade-in space-y-5">
              <PageHeader
                title={`${greeting}, ${businessName}`}
                subtitle="Here's how your business is doing."
              >
                <button
                  className={ui.primary}
                  onClick={() => setIsAddSaleOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Record sale
                </button>

                <button
                  className={ui.ghost}
                  onClick={() => setIsAddExpenseOpen(true)}
                >
                  <Receipt className="h-4 w-4" />
                  Record expense
                </button>

                <button
                  className={ui.ghost}
                  onClick={() => openImport('sales')}
                >
                  <FileSpreadsheet className="h-4 w-4 text-[#737D8B]" />
                  Import Excel
                </button>
              </PageHeader>

              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3">
                <Stat label="Revenue" value={money(revenue)} note={`${orders.length} orders`} />
                <Stat label="Net profit" value={money(profit)} note={`${margin.toFixed(1)}% margin`} />
                <Stat label="Unpaid invoices" value={money(unpaidTotal)} note={`${unpaid.length} to collect`} tone={unpaid.length ? 'warn' : undefined} />
                <Stat label="Customers" value={customers.length} note={`Average order ${money(avgOrder)}`} />
              </div>

              <Section
                title="Revenue"
                subtitle={PERIOD_SUBTITLES[revenuePeriod]}
                action={
                  <div className="flex items-center rounded-lg border border-[#E7E3DC] bg-[#FAF9F6] p-0.5 text-xs">
                    {REVENUE_PERIODS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setRevenuePeriod(p.id)}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                          revenuePeriod === p.id
                            ? 'bg-[#202B3C] text-white shadow-xs'
                            : 'text-[#737D8B] hover:text-[#202B3C]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                }
              >
                <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-[#737D8B]">
                  <div>
                    Total: <span className="font-semibold text-[#202B3C]">{money(chartSummary.total)}</span>
                  </div>
                  <div className="h-3 w-px bg-[#E7E3DC]" />
                  <div>
                    {revenuePeriod === 'day'
                      ? 'Daily avg'
                      : revenuePeriod === 'week'
                      ? 'Weekly avg'
                      : revenuePeriod === 'month'
                      ? 'Monthly avg'
                      : 'Yearly avg'}
                    :{' '}
                    <span className="font-semibold text-[#202B3C]">
                      {money(chartSummary.avg)}
                    </span>
                  </div>
                  {chartSummary.peak && chartSummary.peak.revenue > 0 && (
                    <>
                      <div className="h-3 w-px bg-[#E7E3DC]" />
                      <div>
                        Peak:{' '}
                        <span className="font-semibold text-[#202B3C]">
                          {money(chartSummary.peak.revenue)}
                        </span>{' '}
                        ({chartSummary.peak.label})
                      </div>
                    </>
                  )}
                </div>

                <RevenueChart data={chartData} />
              </Section>

              {/* High-Demand Products */}
              <Section
                title="High-Demand Products"
                subtitle="Top products with strongest recent demand based on actual units sold and 30-day quantity growth."
                action={
                  <button
                    onClick={() => setActiveTab('forecasts')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#202B3C] hover:underline"
                  >
                    View All Forecasts
                    <ArrowRight className="h-4 w-4" />
                  </button>
                }
              >
                {demandMetrics.topHighDemand.length === 0 || !demandMetrics.summary.hasSalesData ? (
                  <div className="py-6 text-center text-sm text-[#737D8B]">
                    No product sales recorded in the last 30 days. Record sales or import orders to see demand trends.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {demandMetrics.topHighDemand.map((prod) => {
                      const isLow = prod.currentStock <= prod.minStock;
                      return (
                        <div
                          key={prod.id || prod.name}
                          className="flex flex-col justify-between rounded-lg border border-[#E7E3DC] bg-[#FAF9F6] p-3.5 transition-all hover:border-[#202B3C]/30 hover:bg-white hover:shadow-sm"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1.5">
                              <h3
                                className="truncate text-sm font-semibold text-[#202B3C]"
                                title={prod.name}
                              >
                                {prod.name}
                              </h3>
                              <span
                                className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${
                                  prod.demandStatus === 'High Demand'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : prod.demandStatus === 'Rising Demand'
                                    ? 'bg-teal-100 text-teal-800'
                                    : 'bg-stone-200 text-stone-700'
                                }`}
                              >
                                {prod.demandStatus}
                              </span>
                            </div>

                            <p className="mt-0.5 text-xs text-[#737D8B]">
                              {prod.category || 'General'}
                            </p>

                            <div className="mt-3 flex items-baseline justify-between">
                              <div>
                                <span className="text-xl font-bold tracking-tight text-[#202B3C]">
                                  {prod.currentUnits}
                                </span>
                                <span className="ml-1 text-xs text-[#737D8B]">
                                  units (30d)
                                </span>
                              </div>

                              <div className="flex items-center text-xs font-semibold">
                                {prod.growthType === 'new_demand' ? (
                                  <span className="inline-flex items-center gap-0.5 text-emerald-700">
                                    <TrendingUp className="h-3.5 w-3.5" /> New Demand
                                  </span>
                                ) : prod.growthType === 'insufficient' ? (
                                  <span className="inline-flex items-center gap-0.5 text-stone-600">
                                    <Clock className="h-3.5 w-3.5" /> Insufficient
                                  </span>
                                ) : prod.demandGrowth > 0 ? (
                                  <span className="inline-flex items-center gap-0.5 text-emerald-700">
                                    <TrendingUp className="h-3.5 w-3.5" /> +{prod.demandGrowth}%
                                  </span>
                                ) : prod.demandGrowth < 0 ? (
                                  <span className="inline-flex items-center gap-0.5 text-[#737D8B]">
                                    <TrendingDown className="h-3.5 w-3.5" /> {prod.demandGrowth}%
                                  </span>
                                ) : (
                                  <span className="text-[#737D8B]">0.0%</span>
                                )}
                              </div>
                            </div>

                            <div className="mt-1 text-xs text-[#737D8B]">
                              Previous 30d:{' '}
                              <span className="font-medium text-[#5C5446]">
                                {prod.prevUnits} units
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 border-t border-[#E7E3DC] pt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#737D8B]">Available stock:</span>
                              <span
                                className={`font-semibold ${
                                  isLow ? 'text-amber-700' : 'text-[#202B3C]'
                                }`}
                              >
                                {prod.currentStock} {prod.unit || 'units'}
                              </span>
                            </div>

                            {prod.stockAlert && (
                              <div className="mt-1.5 flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800">
                                <AlertTriangle className="h-3 w-3 shrink-0 text-amber-600" />
                                <span className="truncate">
                                  {prod.willStockout
                                    ? 'Potential Stockout risk'
                                    : 'Low stock warning'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>

              <div className="grid gap-4 xl:grid-cols-3">
                <Section
                  className="xl:col-span-2"
                  pad={false}
                  title="Recent invoices"
                  action={
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm font-medium hover:underline"
                    >
                      View all
                    </button>
                  }
                >
                  <Table columns={recentColumns} rows={recentOrders} empty="No invoices match your search." />
                </Section>

                <Section title="Growth advisor" subtitle="What to do next">
                  <ul className="space-y-3 text-sm leading-relaxed">
                    {actions.map((a) => (
                      <li key={a} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setIsAiChatOpen(true)}
                    className={`${ui.primary} mt-5 w-full`}
                  >
                    <Bot className="h-4 w-4" />
                    Ask the advisor
                  </button>
                </Section>
              </div>
            </div>
          )}

          {/* Sales */}

          {tab === 'sales' && (
            <div className="animate-fade-in space-y-5">
              <PageHeader
                title="Sales"
                subtitle="Revenue, order value and your best customers."
              />

              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3">
                <Stat label="Total sales" value={money(revenue)} />
                <Stat label="Average order" value={money(avgOrder)} />
                <Stat label="Orders" value={orders.length} />
                <Stat label="Still unpaid" value={money(unpaidTotal)} note={`${unpaid.length} invoices`} tone={unpaid.length ? 'warn' : undefined} />
              </div>

              <Section
                title="Revenue over time"
                subtitle={PERIOD_SUBTITLES[revenuePeriod]}
                action={
                  <div className="flex items-center rounded-lg border border-[#E7E3DC] bg-[#FAF9F6] p-0.5 text-xs">
                    {REVENUE_PERIODS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setRevenuePeriod(p.id)}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                          revenuePeriod === p.id
                            ? 'bg-[#202B3C] text-white shadow-xs'
                            : 'text-[#737D8B] hover:text-[#202B3C]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                }
              >
                <RevenueChart data={chartData} />
              </Section>

              <Section title="Top customers" pad={false}>
                <Table columns={customerColumns} rows={customers.slice(0, 5)} />
              </Section>
            </div>
          )}

          {/* Customers */}

          {tab === 'customers' && (
            <div className="animate-fade-in space-y-5">
              <PageHeader
                title="Customers"
                subtitle="Who buys from you and who owes you."
              />

              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3">
                <Stat label="Customers" value={customers.length} />
                <Stat label="Repeat buyers" value={`${repeatRate}%`} note="Ordered more than once" />
                <Stat label="Average spend" value={money(customers.length ? Math.round(revenue / customers.length) : 0)} note="Per customer" />
                <Stat label="Need follow-up" value={customers.filter((c) => c.status !== 'Active').length} note="Pending or overdue payments" />
              </div>

              <Section title="All customers" subtitle="Ranked by total spent" pad={false}>
                <Table columns={customerColumns} rows={customers} />
              </Section>
            </div>
          )}

          {/* Invoices */}

          {tab === 'orders' && (
            <div className="animate-fade-in space-y-5">
              <PageHeader
                title="Invoices"
                subtitle="Search, filter and export your sales records."
              >
                <button
                  className={ui.primary}
                  onClick={() => setIsAddSaleOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  New invoice
                </button>

                <button
                  className={ui.ghost}
                  onClick={() => openImport('sales')}
                >
                  <FileSpreadsheet className="h-4 w-4 text-[#737D8B]" />
                  Import Excel
                </button>

                <button className={ui.ghost} onClick={exportOrders}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </PageHeader>

              <div className={`${ui.card} overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <SearchBox
                    value={orderSearch}
                    onChange={(v) => {
                      setOrderSearch(v);
                      setOrderPage(1);
                    }}
                    placeholder="Search by invoice, customer or item"
                    className="w-full sm:w-80"
                  />

                  <select
                    value={orderStatus}
                    onChange={(e) => {
                      setOrderStatus(e.target.value);
                      setOrderPage(1);
                    }}
                    className={`${ui.input} w-auto`}
                  >
                    {['All', 'Paid', 'Pending', 'Overdue'].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <Table
                  columns={orderColumns}
                  rows={ordersPaged.items}
                  empty="No invoices match your filters."
                />

                <Pager
                  page={orderPage}
                  pages={ordersPaged.pages}
                  total={filteredOrders.length}
                  perPage={6}
                  onChange={setOrderPage}
                />
              </div>
            </div>
          )}

          {/* Products and inventory */}

          {(tab === 'products' || tab === 'inventory') && (
            <div className="animate-fade-in space-y-5">
              <PageHeader
                title="Products & stock"
                subtitle="Know what's in stock and what's running low."
              >
                <button
                  className={ui.primary}
                  onClick={() => setIsAddProductOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add item
                </button>

                <button
                  className={ui.ghost}
                  onClick={() => openImport('inventory')}
                >
                  <FileSpreadsheet className="h-4 w-4 text-[#737D8B]" />
                  Import Excel
                </button>

                <button className={ui.ghost} onClick={exportProducts}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </PageHeader>

              <div className={`${ui.card} overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <SearchBox
                    value={productSearch}
                    onChange={(v) => {
                      setProductSearch(v);
                      setProductPage(1);
                    }}
                    placeholder="Search items"
                    className="w-full sm:w-80"
                  />

                  <span className="text-sm text-[#737D8B]">
                    {filteredProducts.length} items
                  </span>
                </div>

                <Table
                  columns={productColumns}
                  rows={productsPaged.items}
                  empty="No items yet. Add your first item."
                />

                <Pager
                  page={productPage}
                  pages={productsPaged.pages}
                  total={filteredProducts.length}
                  perPage={6}
                  onChange={setProductPage}
                />
              </div>
            </div>
          )}

          {/* Insights */}

          {tab === 'insights' && (
            <div className="animate-fade-in space-y-5">
              <PageHeader
                title="Growth advisor"
                subtitle="Simple findings from your own records."
              />

              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-3">
                <Stat label="Profit margin" value={`${margin.toFixed(1)}%`} note={`${money(profit)} profit on ${money(revenue)} revenue`} />
                <Stat label="Unpaid invoices" value={money(unpaidTotal)} note={`${unpaid.length} waiting for payment`} tone={unpaid.length ? 'warn' : undefined} />
                <Stat label="Stock alerts" value={lowStock.length} note={lowStock.length ? 'Items low or out of stock' : 'All items well stocked'} tone={lowStock.length ? 'warn' : undefined} />
              </div>

              <Section
                title="Recommended next steps"
                action={
                  <button
                    className={ui.ghost}
                    onClick={() => setIsAiChatOpen(true)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Ask a question
                  </button>
                }
              >
                <ul className="space-y-3 text-sm">
                  {actions.map((a, i) => (
                    <li
                      key={a}
                      className="flex items-start gap-3 border-b border-[#F0EDE6] pb-3 last:border-0 last:pb-0"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#202B3C] text-xs font-semibold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{a}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          )}

          {/* Forecasts */}

          {tab === 'forecasts' && (
            <div className="animate-fade-in space-y-5">
              <PageHeader
                title="Demand forecast"
                subtitle="Estimates based on your recorded revenue. Accuracy improves as you add more history."
              />

              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  ['Cautious', 0.95],
                  ['Likely', 1.1],
                  ['Best case', 1.2],
                ].map(([label, factor]) => (
                  <div
                    key={label}
                    className={`${ui.card} p-4 ${
                      label === 'Likely' ? 'border-[#202B3C]' : ''
                    }`}
                  >
                    <p className="text-sm text-[#737D8B]">{label}</p>

                    <p className="mt-1.5 text-2xl font-semibold tabular-nums">
                      {money(Math.round(revenue * factor))}
                    </p>

                    <p className="mt-1.5 text-sm text-[#737D8B]">
                      {factor > 1 ? '+' : ''}
                      {Math.round((factor - 1) * 100)}% vs current
                    </p>
                  </div>
                ))}
              </div>

              {/* High-Demand Products Detailed Table */}
              <div className={`${ui.card} overflow-hidden`}>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E7E3DC]">
                  <div>
                    <h2 className="text-base font-semibold text-[#202B3C]">
                      High-Demand Products
                    </h2>
                    <p className="mt-0.5 text-sm text-[#737D8B]">
                      Detailed product demand growth, future estimates, and smart inventory recommendations.
                    </p>
                  </div>
                  <span className="text-xs text-[#737D8B]">
                    {filteredDemandProducts.length} product{filteredDemandProducts.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-[#E7E3DC] bg-[#FAF9F6] p-3">
                  {[
                    { id: 'all', label: 'All Products' },
                    { id: 'growth', label: 'Highest Demand Growth' },
                    { id: 'volume', label: 'Highest Sales Volume' },
                    { id: 'rising_low_stock', label: 'Rising Demand + Low Stock' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setForecastFilter(f.id);
                        setForecastPage(1);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                        forecastFilter === f.id
                          ? 'bg-[#202B3C] text-white shadow-sm'
                          : 'border border-[#E7E3DC] bg-white text-[#5C5446] hover:bg-[#F0EDE6]'
                      }`}
                    >
                      <span>{f.label}</span>
                      {f.id === 'rising_low_stock' && demandMetrics.summary.restockNeededCount > 0 && (
                        <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[11px] font-semibold text-amber-800">
                          {demandMetrics.summary.restockNeededCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <Table
                  columns={demandColumns}
                  rows={demandPaged.items}
                  empty={
                    forecastFilter === 'rising_low_stock'
                      ? 'No products currently have rising demand with low stock.'
                      : demandMetrics.summary.hasSalesData
                      ? 'No products match the selected filter.'
                      : 'No product sales recorded in the last 30 days. Add more sales history to generate reliable product forecasts.'
                  }
                />

                <Pager
                  page={forecastPage}
                  pages={demandPaged.pages}
                  total={filteredDemandProducts.length}
                  perPage={8}
                  onChange={setForecastPage}
                />
              </div>

              <Section
                title="Restock watchlist"
                subtitle="Items to reorder before demand picks up"
                pad={false}
              >
                <Table
                  columns={productColumns}
                  rows={lowStock}
                  empty="Nothing to restock right now."
                />
              </Section>
            </div>
          )}

          {/* Reports */}

          {tab === 'reports' && (
            <div className="animate-fade-in space-y-5">
              <PageHeader
                title="Profit & loss"
                subtitle={`${businessName} · Recognized Ledger (${fiscalYear}) · Amounts in ₹`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {/* Financial Year Selector */}
                  <div className="flex items-center rounded-lg border border-[#E7E3DC] bg-[#FAF9F6] p-0.5 text-xs">
                    {[
                      { id: '2026-27', label: 'FY 2026-27' },
                      { id: '2025-26', label: 'FY 2025-26' },
                      { id: 'all', label: 'All Time' },
                    ].map((fy) => (
                      <button
                        key={fy.id}
                        onClick={() => {
                          setSelectedFiscalYear(fy.id);
                          setPnlAuditPage(1);
                        }}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                          selectedFiscalYear === fy.id
                            ? 'bg-[#202B3C] text-white shadow-xs'
                            : 'text-[#737D8B] hover:text-[#202B3C]'
                        }`}
                      >
                        {fy.label}
                      </button>
                    ))}
                  </div>

                  <button className={ui.primary} onClick={exportPnL}>
                    <Download className="h-4 w-4" />
                    Download CSV
                  </button>
                </div>
              </PageHeader>


              {/* Performance Metrics Cards */}
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3">
                <Stat
                  label="Recognized revenue"
                  value={money(revenue)}
                  note={`${filteredSalesByFY.length} sales orders`}
                />
                <Stat
                  label="Invoices collected"
                  value={money(collectedTotal)}
                  note={`${money(unpaidTotal)} unpaid (${filteredSalesByFY.filter((s) => s.status !== 'Paid').length} invoices)`}
                  tone={unpaidTotal > 0 ? 'warn' : undefined}
                />
                <Stat
                  label="Recognized expenses"
                  value={money(expenseTotal)}
                  note={`${activeExpensesForMetrics.length} operational transactions`}
                />
                <Stat
                  label="Net operating profit"
                  value={money(profit)}
                  note={`${margin.toFixed(1)}% net margin · ${profit >= 0 ? 'Profitable' : 'Deficit'}`}
                  tone={profit >= 0 ? 'good' : 'bad'}
                />
              </div>

              {/* Summary and Expense Breakdown Grid */}
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Financial Summary */}
                <Section title="Financial summary" subtitle={`Statement for ${fiscalYear}`}>
                  <dl className="divide-y divide-[#F0EDE6] text-sm">
                    {[
                      ['Total recognized revenue', money(revenue), 'font-semibold text-[#202B3C]'],
                      ['Invoices collected (Paid)', money(collectedTotal), 'pl-4 text-[#737D8B]'],
                      ['Receivables pending (Unpaid)', money(unpaidTotal), 'pl-4 text-[#737D8B]'],
                      ['Recognized operating expenses', `−${money(expenseTotal)}`, 'font-semibold text-red-700'],
                      ['Net operating profit / (loss)', `${money(profit)} (${margin.toFixed(1)}%)`, `font-semibold ${profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`],
                    ].map(([label, value, style]) => (
                      <div
                        key={label}
                        className={`flex justify-between gap-4 py-2.5 ${style}`}
                      >
                        <dt>{label}</dt>
                        <dd className="text-right tabular-nums">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  {procurementExpenses.length > 0 && !includeProcurementInPnL && (
                    <div className="mt-3.5 rounded-md bg-[#FAF9F6] border border-[#E7E3DC] p-3 text-xs text-[#737D8B] flex items-center justify-between">
                      <span>Excluded Raw Material Procurement ({procurementExpenses.length} entries):</span>
                      <span className="font-semibold text-[#202B3C]">{money(sum(procurementExpenses, 'amount'))}</span>
                    </div>
                  )}

                  <p className="mt-3 text-xs text-[#737D8B]">
                    Calculated in accordance with standard Indian MSME operating principles (Recognized Revenue minus Operating Expenses).
                  </p>
                </Section>

                {/* Operating Expense Breakdown by Category */}
                <Section
                  title="Expense breakdown by category"
                  subtitle={`${expenseBreakdown.length} active spending categories`}
                >
                  <div className="space-y-3">
                    {expenseBreakdown.map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="font-medium text-[#202B3C]">
                            {item.category}
                            <span className="ml-1.5 text-xs text-[#737D8B] font-normal">
                              ({item.count} record{item.count > 1 ? 's' : ''})
                            </span>
                          </span>
                          <span className="font-semibold tabular-nums text-[#202B3C]">
                            {money(item.amount)}
                            <span className="ml-1.5 text-xs text-[#737D8B] font-normal">
                              ({item.percentage.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF9F6] border border-[#E7E3DC]">
                          <div
                            className="h-full rounded-full bg-[#202B3C]"
                            style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>

              {/* Transaction-Level Audit View */}
              <div className={`${ui.card} overflow-hidden`}>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E7E3DC]">
                  <div>
                    <h2 className="text-base font-semibold text-[#202B3C]">
                      Transaction-Level Expense Audit
                    </h2>
                    <p className="mt-0.5 text-sm text-[#737D8B]">
                      Exact database records contributing to the total {money(expenseTotal)} expense figure.
                    </p>
                  </div>
                  <span className="text-xs text-[#737D8B]">
                    {auditTransactions.length} transaction{auditTransactions.length === 1 ? '' : 's'} found
                  </span>
                </div>

                {/* Audit Filters */}
                <div className="flex flex-wrap items-center gap-3 border-b border-[#E7E3DC] bg-[#FAF9F6] p-3">
                  <SearchBox
                    value={pnlAuditSearch}
                    onChange={(val) => {
                      setPnlAuditSearch(val);
                      setPnlAuditPage(1);
                    }}
                    placeholder="Search by ID, title, or vendor…"
                    className="w-full sm:w-64"
                  />

                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="text-[#737D8B]">Category:</span>
                    <select
                      value={pnlCategoryFilter}
                      onChange={(e) => {
                        setPnlCategoryFilter(e.target.value);
                        setPnlAuditPage(1);
                      }}
                      className="rounded-md border border-[#E7E3DC] bg-white px-2.5 py-1.5 text-xs font-medium text-[#202B3C] focus:outline-none"
                    >
                      <option value="All">All Categories ({activeExpensesForMetrics.length})</option>
                      {expenseBreakdown.map((b) => (
                        <option key={b.category} value={b.category}>
                          {b.category} ({b.count})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Audit Table */}
                <Table
                  columns={[
                    {
                      key: 'id',
                      label: 'Expense ID',
                      muted: true,
                      render: (r) => (
                        <span className="font-mono text-xs font-medium text-[#5C5446]">
                          {r.id}
                        </span>
                      ),
                    },
                    {
                      key: 'date',
                      label: 'Date',
                      render: (r) => (
                        <span className="text-xs text-[#737D8B]">
                          {r.date ? longDate(r.date) : '—'}
                        </span>
                      ),
                    },
                    {
                      key: 'title',
                      label: 'Expense Title / Description',
                      render: (r) => (
                        <div className="max-w-xs truncate font-medium text-[#202B3C]" title={r.title}>
                          {r.title}
                          {r.isProcurement && (
                            <span className="ml-1.5 inline-block rounded bg-amber-100 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800">
                              Procurement
                            </span>
                          )}
                        </div>
                      ),
                    },
                    {
                      key: 'category',
                      label: 'Category',
                      render: (r) => (
                        <span className="inline-block rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
                          {r.category}
                        </span>
                      ),
                    },
                    {
                      key: 'vendor',
                      label: 'Vendor / Paid To',
                      muted: true,
                    },
                    {
                      key: 'amount',
                      label: 'Amount (₹)',
                      right: true,
                      render: (r) => (
                        <span className="font-semibold text-[#202B3C]">
                          {money(r.amount)}
                        </span>
                      ),
                    },
                  ]}
                  rows={pnlAuditPaged.items}
                  empty={
                    pnlAuditSearch || pnlCategoryFilter !== 'All'
                      ? 'No transactions match the selected filter.'
                      : 'No expense transactions recorded in this fiscal year.'
                  }
                />

                <Pager
                  page={pnlAuditPage}
                  pages={pnlAuditPaged.pages}
                  total={auditTransactions.length}
                  perPage={10}
                  onChange={setPnlAuditPage}
                />
              </div>
            </div>
          )}

          {/* Settings */}

          {tab === 'settings' && (
            <div className="animate-fade-in max-w-3xl space-y-5">
              <PageHeader
                title="Settings"
                subtitle="Your business details."
              />

              <Section
                title="Business details"
                action={
                  <button
                    className={ui.ghost}
                    onClick={() => setActiveTab('profile')}
                  >
                    Edit profile
                  </button>
                }
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['Business name', businessName],
                    ['GSTIN', user?.gstin || 'Not added'],
                    ['Currency', 'Indian Rupee (₹)'],
                    ['Financial year', 'April 1 – March 31'],
                  ].map(([label, value]) => (
                    <label key={label} className="block text-sm">
                      <span className="mb-1.5 block font-medium">{label}</span>
                      <input readOnly value={value} className={ui.input} />
                    </label>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* Help */}

          {tab === 'help' && (
            <div className="animate-fade-in max-w-3xl space-y-5">
              <PageHeader
                title="Help"
                subtitle="Quick answers to common questions."
              />

              <div className="grid gap-3 md:grid-cols-2">
                {[
                  [
                    'How do I add a sale?',
                    'Click "Record sale" on the overview, enter the customer and amount, then save.',
                  ],
                  [
                    'How is profit calculated?',
                    'Profit is your total revenue minus all the expenses you have recorded.',
                  ],
                ].map(([q, a]) => (
                  <div key={q} className={`${ui.card} p-4`}>
                    <h3 className="text-sm font-semibold">{q}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#737D8B]">
                      {a}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`${ui.card} flex flex-wrap items-center justify-between gap-3 p-4`}>
                <div>
                  <h3 className="text-sm font-semibold">Need more help?</h3>
                  <p className="mt-1 text-sm text-[#737D8B]">
                    Our advisory team is available Monday to Saturday, 9 AM – 7 PM IST.
                  </p>
                </div>

                <button
                  className={ui.primary}
                  onClick={() => setIsAiChatOpen(true)}
                >
                  <Bot className="h-4 w-4" />
                  Ask the advisor
                </button>
              </div>
            </div>
          )}

          {tab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Modals */}

      {isAddSaleOpen && (
        <FormModal
          title="Record a sale"
          fields={SALE_FIELDS}
          values={saleForm}
          onChange={setSaleForm}
          onSubmit={submit(addSale, saleForm, closeSale)}
          onClose={closeSale}
          submitLabel="Save sale"
          error={formError}
        />
      )}

      {isAddExpenseOpen && (
        <FormModal
          title="Record an expense"
          fields={EXPENSE_FIELDS}
          values={expenseForm}
          onChange={setExpenseForm}
          onSubmit={submit(addExpense, expenseForm, closeExpense)}
          onClose={closeExpense}
          submitLabel="Save expense"
          error={formError}
        />
      )}

      {isAddProductOpen && (
        <FormModal
          title="Add an item"
          fields={PRODUCT_FIELDS}
          values={productForm}
          onChange={setProductForm}
          onSubmit={submit(addProduct, productForm, closeProduct)}
          onClose={closeProduct}
          submitLabel="Add item"
          error={formError}
        />
      )}

      <FloatingAdvisorChat
        businessName={businessName}
        onNavigate={({ tab: targetTab, search }) => {
          if (targetTab) setActiveTab(targetTab);
          if (search) {
            setOrderSearch(search);
            setSearchQuery(search);
          }
        }}
      />

      {isImportOpen && (
        <ImportModal
          isOpen={isImportOpen}
          initialCategory={importCategory}
          onClose={() => setIsImportOpen(false)}
          onImportSuccess={refreshData}
        />
      )}

      {/* Safe Audit Cleanup Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B3C]/50 p-4">
          <div className={`${ui.card} w-full max-w-2xl max-h-[90vh] flex flex-col p-6 shadow-2xl overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-[#E7E3DC] pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                <h3 className="text-base font-semibold text-[#202B3C]">
                  Safe Review & Cleanup of Suspected Procurement Records
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-[#737D8B] hover:bg-[#F5F3EE]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm">
              <div className="rounded-md bg-amber-50 p-3.5 border border-amber-200 text-amber-900 leading-relaxed text-xs sm:text-sm">
                <p className="font-semibold">Why are these records flagged?</p>
                <p className="mt-1">
                  We identified <strong>{procurementExpenses.length} records</strong> totalling <strong>{money(sum(procurementExpenses, 'amount'))}</strong> that were imported from ingredient worksheets (e.g. Pure Desi Ghee, Besan, Cashew Nuts, etc.). In MSME accounting, ingredient purchases represent raw materials inventory rather than recurring operating overhead.
                </p>
              </div>

              {cleanupSuccessMsg && (
                <div className="rounded-md bg-emerald-50 p-3 text-xs sm:text-sm font-medium text-emerald-800 border border-emerald-200">
                  {cleanupSuccessMsg}
                </div>
              )}

              <div>
                <h4 className="font-semibold text-xs text-[#737D8B] uppercase tracking-wider mb-2">
                  Sample of Suspected Procurement Records ({procurementExpenses.length} total)
                </h4>
                <div className="max-h-48 overflow-y-auto border border-[#E7E3DC] rounded-md divide-y divide-[#F0EDE6] bg-[#FAF9F6]">
                  {procurementExpenses.slice(0, 8).map((p, idx) => (
                    <div key={p._id || idx} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-[#202B3C]">{p.title}</span>
                        <span className="ml-2 text-[#737D8B]">({p.vendor || 'Supplier'} · {p.date})</span>
                      </div>
                      <span className="font-semibold text-[#202B3C]">{money(p.amount)}</span>
                    </div>
                  ))}
                  {procurementExpenses.length > 8 && (
                    <div className="p-2 text-center text-xs text-[#737D8B] bg-white">
                      + {procurementExpenses.length - 8} more similar ingredient records
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <p className="font-semibold text-xs text-[#737D8B] uppercase tracking-wider">
                  Select Safe Action
                </p>

                <div
                  onClick={() => !isCleaningUpAudit && handleSafeCleanup('reclassify')}
                  className="p-3.5 border border-[#E7E3DC] rounded-lg cursor-pointer transition-all hover:border-[#202B3C] hover:bg-[#FAF9F6] flex items-start gap-3"
                >
                  <Package className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-[#202B3C] flex items-center gap-1.5">
                      <span>Reclassify to Raw Materials Inventory</span>
                      <span className="rounded bg-indigo-100 text-indigo-800 px-1.5 py-0.2 text-[10px] font-semibold">Recommended</span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#737D8B]">
                      Transfers these items into your Products & Stock catalog under "Raw Materials". Keeps your purchase costs, quantities, and supplier contacts intact while safely removing them from operating expenses.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => !isCleaningUpAudit && handleSafeCleanup('remove')}
                  className="p-3.5 border border-red-200 rounded-lg cursor-pointer transition-all hover:border-red-500 hover:bg-red-50/50 flex items-start gap-3"
                >
                  <Receipt className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-red-900">
                      Remove from Operating Expenses Ledger
                    </div>
                    <p className="mt-0.5 text-xs text-red-700">
                      Safely deletes the {procurementExpenses.length} accidental ingredient purchase entries from the Expenses collection only.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E7E3DC] pt-4 flex items-center justify-between">
              <span className="text-xs text-[#737D8B]">
                Account-isolated: Only affects {user?.businessName || 'your business'} records.
              </span>
              <button
                type="button"
                disabled={isCleaningUpAudit}
                onClick={() => setIsAuditModalOpen(false)}
                className={ui.ghost}
              >
                Cancel / Keep As Is
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}