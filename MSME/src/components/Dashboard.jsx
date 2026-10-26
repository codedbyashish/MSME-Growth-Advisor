
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Bot, Calendar, Check, ChevronLeft, ChevronRight, Download,
  FileSpreadsheet, LogOut, Menu, Plus, Receipt, Search, Send, Settings, Sparkles, User, X,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import ProfileView from './ProfileView';
import ImportModal from './modals/ImportModal';

/* Helpers */

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
    <div className={`${ui.card} p-4`}>
      <p className="text-sm text-[#737D8B]">{label}</p>

      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>

      {note && (
        <p
          className={`mt-1.5 text-sm ${
            tone === 'warn' ? 'text-amber-700' : 'text-[#737D8B]'
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
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-y border-[#E7E3DC] bg-[#FAF9F6] text-[#737D8B]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`whitespace-nowrap px-4 py-2.5 font-medium ${
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
                className="px-4 py-8 text-center text-[#737D8B]"
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
                    className={`whitespace-nowrap px-4 py-2.5 ${
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
    'rounded-md p-1.5 transition-colors hover:bg-[#F5F3EE] disabled:opacity-40';

  return (
    <div className="flex items-center justify-between border-t border-[#E7E3DC] px-4 py-3 text-sm text-[#737D8B]">
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

        <span className="px-2 text-[#202B3C]">
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
        className={`${ui.input} pl-9`}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B3C]/40 p-4">
      <form
        onSubmit={onSubmit}
        className={`${ui.card} w-full max-w-md p-5 shadow-xl`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#737D8B] hover:bg-[#F5F3EE]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {fields.map((f) => (
            <label
              key={f.name}
              className={`block text-sm ${f.wide ? 'col-span-2' : ''}`}
            >
              <span className="mb-1.5 block font-medium">{f.label}</span>

              {f.options ? (
                <select
                  value={values[f.name]}
                  onChange={(e) =>
                    onChange({ ...values, [f.name]: e.target.value })
                  }
                  className={ui.input}
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
                  className={ui.input}
                />
              )}
            </label>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={ui.ghost}
          >
            Cancel
          </button>

          <button type="submit" className={ui.primary}>
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

/* Compact revenue chart */


function RevenueChart({ data }) {
  const [hover, setHover] = useState(null);

  if (!data.length) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-[#737D8B]">
        Record a sale to see your revenue trend.
      </div>
    );
  }

  const W = 720;
  const H = 190;
  const LEFT = 60;
  const RIGHT = 12;
  const TOP = 12;
  const BOTTOM = 34;
  const chartHeight = H - TOP - BOTTOM;
  const chartWidth = W - LEFT - RIGHT;
  const maxValue = Math.max(
    ...data.map((d) => Number(d.revenue) || 0),
    1
  );

  const slot = chartWidth / data.length;
  const barWidth = Math.min(34, slot * 0.48);

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
    };
  });

  const active = hover !== null ? bars[hover] : null;

  return (
    <div className="w-full">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-[155px] w-full sm:h-[175px]"
          role="img"
          aria-label="Daily revenue bar chart"
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
              key={`${bar.label}-${i}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <rect
                x={LEFT + i * slot + 2}
                y={TOP}
                width={Math.max(1, slot - 4)}
                height={chartHeight + 8}
                fill="transparent"
              />

              <rect
                x={bar.x}
                y={bar.y}
                width={barWidth}
                height={Math.max(0, bar.height)}
                rx="3"
                fill={hover === i ? '#202B3C' : '#718096'}
                opacity={hover === i ? 1 : 0.8}
              />

              <text
                x={bar.center}
                y={H - 10}
                textAnchor="middle"
                fontSize="11"
                fill="#737D8B"
              >
                {bar.label}
              </text>
            </g>
          ))}
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute z-10 rounded-md bg-[#202B3C] px-3 py-2 text-xs text-white shadow-sm"
            style={{
              left: `${(active.center / W) * 100}%`,
              top: `${Math.max(0, (active.y / H) * 100 - 3)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-medium">{active.label}</p>
            <p className="mt-1">{money(active.value)}</p>
            <p className="mt-1 text-white/70">
              {active.orders} order{active.orders === 1 ? '' : 's'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


/* Advisor chat */

function AdvisorChat({ name, onClose, getReply }) {
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Hi! I can answer questions about ${name}'s sales, profit, customers and stock.`,
    },
  ]);

  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;

    setMessages((m) => [...m, { from: 'user', text: q }]);
    setInput('');

    setTimeout(() => {
      setMessages((m) => [...m, { from: 'ai', text: getReply(q) }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-96 max-w-[92vw] flex-col overflow-hidden rounded-lg border border-[#E7E3DC] bg-white shadow-xl">
      <div className="flex items-center justify-between bg-[#202B3C] px-4 py-3 text-white">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bot className="h-4 w-4" />
          Growth Advisor
        </div>

        <button
          onClick={onClose}
          aria-label="Close chat"
          className="rounded p-1 text-white/70 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="h-72 space-y-2.5 overflow-y-auto bg-[#FAF9F6] p-4 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[88%] rounded-md px-3 py-2 leading-relaxed ${
              m.from === 'user'
                ? 'ml-auto bg-[#202B3C] text-white'
                : 'border border-[#E7E3DC] bg-white'
            }`}
          >
            {m.text}
          </div>
        ))}

        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-[#E7E3DC] px-3 pt-3">
        {['Revenue summary', 'Profit margin', 'Unpaid invoices'].map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="rounded border border-[#E7E3DC] px-2.5 py-1 text-xs text-[#5C5446] hover:bg-[#F5F3EE]"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask a question…"
          className={ui.input}
        />

        <button
          onClick={() => send()}
          aria-label="Send"
          className="rounded-md bg-[#202B3C] p-2 text-white hover:bg-[#151D2A]"
        >
          <Send className="h-4 w-4" />
        </button>
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);

  const [saleForm, setSaleForm] = useState(EMPTY_SALE);
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('All');
  const [orderPage, setOrderPage] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);

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
  const fiscalYear = `FY ${fyStart}-${String(fyStart + 1).slice(2)}`;

  /* Data */

  const sales = liveSales;
  const expenses = liveExpenses;
  const inventory = liveInventory;

  const orders = useMemo(
    () =>
      sales.map((s) => ({
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
    const days = new Map();

    [...sales]
      .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
      .forEach((s) => {
        const label = shortDate(s.date || new Date());
        const day = days.get(label) || { label, revenue: 0, orders: 0 };

        day.revenue += Number(s.amount || 0);
        day.orders += 1;
        days.set(label, day);
      });

    const list = [...days.values()];

    return list.length === 1
      ? [{ label: 'Start', revenue: 0, orders: 0 }, ...list]
      : list;
  }, [sales]);

  /* Metrics */

  const revenue = sum(orders, 'amount');
  const unpaid = orders.filter((o) => o.status !== 'Paid');
  const unpaidTotal = sum(unpaid, 'amount');
  const expenseTotal = sum(expenses, 'amount');
  const profit = revenue - expenseTotal;
  const margin = revenue ? (profit / revenue) * 100 : 0;
  const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;

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

  const statusCol = {
    key: 'status',
    label: 'Status',
    render: (r) => <Badge>{r.status}</Badge>,
  };

  const orderColumns = [
    { key: 'id', label: 'Invoice', muted: true },
    { key: 'customer', label: 'Customer' },
    { key: 'date', label: 'Date', muted: true },
    { key: 'item', label: 'Item', muted: true },
    { key: 'amount', label: 'Amount', right: true, render: (r) => money(r.amount) },
    statusCol,
  ];

  const recentColumns = [
    { key: 'customer', label: 'Customer' },
    { key: 'item', label: 'Item', muted: true },
    { key: 'amount', label: 'Amount', right: true, render: (r) => money(r.amount) },
    statusCol,
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

  const exportPnL = () =>
    downloadCSV('Profit_and_Loss', ['Line', 'Amount'], [
      ['Revenue', revenue],
      ['Collected', revenue - unpaidTotal],
      ['Unpaid', unpaidTotal],
      ['Expenses', expenseTotal],
      ['Net profit', profit],
    ]);

  const advisorReply = (q) => {
    const t = q.toLowerCase();

    if (t.includes('unpaid') || t.includes('receivable') || t.includes('pending')) {
      return `${unpaid.length} invoices are unpaid, totalling ${money(unpaidTotal)}.`;
    }

    if (t.includes('margin') || t.includes('profit')) {
      return `Net profit is ${money(profit)} (${margin.toFixed(1)}% margin) after ${money(expenseTotal)} in expenses.`;
    }

    if (t.includes('customer') || t.includes('order')) {
      return `${businessName} has ${orders.length} orders from ${customers.length} customers. Average order: ${money(avgOrder)}.`;
    }

    if (t.includes('stock') || t.includes('inventory')) {
      return lowStock.length
        ? `${lowStock.length} items need attention: ${lowStock.map((p) => p.name).join(', ')}.`
        : 'All items are well stocked.';
    }

    return `Revenue is ${money(revenue)} from ${orders.length} orders, with a ${margin.toFixed(1)}% net margin.`;
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
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#E7E3DC] bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
              className="rounded-md border border-[#E7E3DC] p-2 text-[#737D8B] hover:bg-[#F5F3EE] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search invoices or customers"
              className="hidden w-72 md:block"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-[#E7E3DC] bg-[#FAF9F6] px-3 py-1.5 text-sm text-[#737D8B] sm:flex">
              <Calendar className="h-4 w-4" />
              {fiscalYear}
            </div>

            <button
              onClick={() => setActiveTab('insights')}
              aria-label="Alerts"
              className="relative rounded-md border border-[#E7E3DC] p-2 text-[#737D8B] hover:bg-[#F5F3EE]"
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
                className="flex h-9 w-9 items-center justify-center rounded-md bg-[#202B3C] text-sm font-semibold text-white hover:bg-[#151D2A]"
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

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 p-4 sm:p-5 lg:px-8 lg:py-6">
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
                  onClick={() => setIsImportOpen(true)}
                >
                  <FileSpreadsheet className="h-4 w-4 text-[#737D8B]" />
                  Import Excel
                </button>
              </PageHeader>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Stat label="Revenue" value={money(revenue)} note={`${orders.length} orders`} />
                <Stat label="Net profit" value={money(profit)} note={`${margin.toFixed(1)}% margin`} />
                <Stat label="Unpaid invoices" value={money(unpaidTotal)} note={`${unpaid.length} to collect`} tone={unpaid.length ? 'warn' : undefined} />
                <Stat label="Customers" value={customers.length} note={`Average order ${money(avgOrder)}`} />
              </div>

              <Section
                title="Revenue"
                subtitle="Daily revenue from recorded sales."
              >
                <RevenueChart data={chartData} />
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

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Stat label="Total sales" value={money(revenue)} />
                <Stat label="Average order" value={money(avgOrder)} />
                <Stat label="Orders" value={orders.length} />
                <Stat label="Still unpaid" value={money(unpaidTotal)} note={`${unpaid.length} invoices`} tone={unpaid.length ? 'warn' : undefined} />
              </div>

              <Section title="Revenue over time">
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

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

              <div className="grid gap-3 md:grid-cols-3">
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

              <div className="grid gap-3 md:grid-cols-3">
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
                subtitle={`${businessName} · ${fiscalYear} · Amounts in ₹`}
              >
                <button className={ui.primary} onClick={exportPnL}>
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </PageHeader>

              <Section title="Summary">
                <dl className="divide-y divide-[#F0EDE6] text-sm">
                  {[
                    ['Revenue', money(revenue), 'font-semibold'],
                    ['Collected', money(revenue - unpaidTotal), 'pl-5 text-[#737D8B]'],
                    ['Still unpaid', money(unpaidTotal), 'pl-5 text-[#737D8B]'],
                    ['Expenses', `−${money(expenseTotal)}`, 'font-semibold'],
                    ['Net profit', `${money(profit)} (${margin.toFixed(1)}%)`, 'font-semibold'],
                  ].map(([label, value, style]) => (
                    <div
                      key={label}
                      className={`flex justify-between gap-4 py-3 ${style}`}
                    >
                      <dt>{label}</dt>
                      <dd className="text-right tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-4 rounded-md bg-[#FAF9F6] p-3.5 text-sm text-[#737D8B]">
                  Reminder: file your monthly GSTR-3B by the 20th. Check figures with your accountant before filing.
                </p>
              </Section>
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

      {isAiChatOpen && (
        <AdvisorChat
          name={businessName}
          onClose={() => setIsAiChatOpen(false)}
          getReply={advisorReply}
        />
      )}

      {isImportOpen && (
        <ImportModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImportSuccess={refreshData}
        />
      )}
    </div>
  );
}
