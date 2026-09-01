import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Bell,
  Menu,
  Banknote,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Warehouse,
  Sparkles,
  LineChart,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  Plus,
  Search,
  CheckCircle2,
  X,
  Bot,
  Send,
  Download,
  Building2,
  ShoppingBag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserPlus,
  RefreshCw,
  Tag,
  AlertTriangle,
  MoreVertical,
  Receipt,
  Box,
  TrendingDown
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    sales,
    expenses,
    inventory,
    activities,
    totalSales,
    totalExpenses,
    netProfit,
    healthScore,
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
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery
  } = useData();

  // Sidebar & Layout state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const [salesTrendTimeframe, setSalesTrendTimeframe] = useState('30D');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Orders Management Specific State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All Statuses');
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Form states for modals
  const [saleForm, setSaleForm] = useState({ client: '', item: '', amount: '', status: 'Paid' });
  const [expenseForm, setExpenseForm] = useState({ title: '', category: 'Inventory', amount: '', vendor: '' });
  const [productForm, setProductForm] = useState({ name: '', category: 'Textiles', stock: '', unit: 'Meters', unitPrice: '', minStock: '100' });

  // Dynamic user & metrics calculations
  const businessName = user?.businessName || user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'My Business');

  const totalRevenueAmount = sales.reduce((acc, s) => acc + Number(s.amount || 0), 0);
  const totalOrdersCount = sales.length;

  const uniqueClients = Array.from(new Set(sales.map((s) => s.client).filter(Boolean)));
  const totalCustomersCount = uniqueClients.length;

  const totalExpensesAmount = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const netProfitAmount = totalRevenueAmount - totalExpensesAmount;
  const profitMargin = totalRevenueAmount > 0 
    ? ((netProfitAmount / totalRevenueAmount) * 100).toFixed(1) 
    : '0.0';

  // Orders Dataset
  const defaultOrders = [
    { id: '#ORD-2023-0891', customer: 'Sunita Jain', initials: 'SJ', date: 'Oct 24, 2023', product: 'Industrial Thread XL', amount: 12450, status: 'Delivered' },
    { id: '#ORD-2023-0892', customer: 'Rajesh Kumar', initials: 'RK', date: 'Oct 24, 2023', product: 'Packaging Cartons (100)', amount: 4200, status: 'Processing' },
    { id: '#ORD-2023-0893', customer: 'Meera Patel', initials: 'MP', date: 'Oct 23, 2023', product: 'Cotton Fabric Roll A', amount: 28900, status: 'Pending' },
    { id: '#ORD-2023-0894', customer: 'Vikram Singh', initials: 'VS', date: 'Oct 22, 2023', product: 'Dye Resins Pack', amount: 8150, status: 'Cancelled' },
    { id: '#ORD-2023-0895', customer: 'Anita Desai', initials: 'AD', date: 'Oct 21, 2023', product: 'Silk Thread Bundle', amount: 15600, status: 'Delivered' },
  ];

  const mergedUserOrders = sales.map((s) => ({
    id: s.id.startsWith('#') ? s.id : `#${s.id}`,
    customer: s.client,
    initials: s.client ? s.client.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'CU',
    date: s.date ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 24, 2023',
    product: s.item || 'General Supplies',
    amount: Number(s.amount || 0),
    status: s.status === 'Paid' ? 'Delivered' : s.status || 'Pending'
  }));

  const allOrdersList = [...mergedUserOrders, ...defaultOrders];

  const filteredOrdersList = allOrdersList.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(orderSearchQuery.toLowerCase());
    
    const matchesStatus =
      orderStatusFilter === 'All Statuses' || order.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrdersList.length / ordersPerPage) || 1;
  const startIndex = (orderCurrentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrdersList.slice(startIndex, startIndex + ordersPerPage);

  const handleExportOrdersCSV = () => {
    const headers = 'Order ID,Customer,Date,Product,Amount,Status\n';
    const rows = filteredOrdersList
      .map((o) => `"${o.id}","${o.customer}","${o.date}","${o.product}","${o.amount}","${o.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Orders_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Dynamic Chart Dataset
  const getDynamicChartPoints = () => {
    if (!sales || sales.length === 0) {
      return [
        { label: 'Day 1', revenue: 0, orders: 0 },
        { label: 'Day 2', revenue: 0, orders: 0 },
        { label: 'Day 3', revenue: 0, orders: 0 },
        { label: 'Day 4', revenue: 0, orders: 0 },
      ];
    }

    const mapByDate = {};
    sales.forEach((s, idx) => {
      const label = s.date 
        ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
        : `Sale #${idx + 1}`;
      if (!mapByDate[label]) {
        mapByDate[label] = { label, revenue: 0, orders: 0 };
      }
      mapByDate[label].revenue += Number(s.amount || 0);
      mapByDate[label].orders += 1;
    });

    const points = Object.values(mapByDate);
    if (points.length === 1) {
      return [{ label: 'Start', revenue: 0, orders: 0 }, ...points];
    }
    return points;
  };

  const currentChartData = getDynamicChartPoints();

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your AI Business Advisor. I've analyzed ${businessName}'s real-time financial metrics: Total Revenue is ₹${totalRevenueAmount.toLocaleString('en-IN')}, Total Orders: ${totalOrdersCount}, Net Profit Margin: ${profitMargin}%. How can I assist your strategy today?`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Handlers for Modals
  const handleSaleSubmit = (e) => {
    e.preventDefault();
    if (!saleForm.client || !saleForm.amount) return;
    addSale(saleForm);
    setSaleForm({ client: '', item: '', amount: '', status: 'Paid' });
    setIsAddSaleOpen(false);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    addExpense(expenseForm);
    setExpenseForm({ title: '', category: 'Inventory', amount: '', vendor: '' });
    setIsAddExpenseOpen(false);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.stock || !productForm.unitPrice) return;
    addProduct(productForm);
    setProductForm({ name: '', category: 'Textiles', stock: '', unit: 'Meters', unitPrice: '', minStock: '100' });
    setIsAddProductOpen(false);
  };

  const handleSendChat = (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user', text: query }];
    setChatMessages(newMsgs);
    if (!textToSend) setInputMsg('');

    setTimeout(() => {
      let reply = `Based on live data for ${businessName}: Total Revenue is ₹${totalRevenueAmount.toLocaleString('en-IN')} from ${totalOrdersCount} orders across ${totalCustomersCount} active clients. Net profit margin is ${profitMargin}%.`;
      const lower = query.toLowerCase();
      if (lower.includes('revenue') || lower.includes('sales')) {
        reply = `Live Revenue analysis for ${businessName}: Recorded revenue is ₹${totalRevenueAmount.toLocaleString('en-IN')} with ${totalOrdersCount} transactions. Net profit: ₹${netProfitAmount.toLocaleString('en-IN')}.`;
      } else if (lower.includes('order') || lower.includes('customer')) {
        reply = `${businessName} currently has ${totalOrdersCount} orders across ${totalCustomersCount} registered unique clients (${uniqueClients.slice(0, 3).join(', ')}).`;
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 500);
  };

  // SVG Chart Dimensions & Calculation
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const rawMaxRevenue = Math.max(...currentChartData.map((d) => d.revenue));
  const maxRevenue = rawMaxRevenue > 0 ? rawMaxRevenue * 1.15 : 10000;

  const rawMaxOrders = Math.max(...currentChartData.map((d) => d.orders));
  const maxOrders = rawMaxOrders > 0 ? rawMaxOrders * 1.15 : 10;

  const points = currentChartData.map((d, index) => {
    const x = paddingX + (index / (currentChartData.length - 1)) * (chartWidth - paddingX * 2);
    const revenueY = chartHeight - paddingY - (d.revenue / maxRevenue) * (chartHeight - paddingY * 2);
    const ordersY = chartHeight - paddingY - (d.orders / maxOrders) * (chartHeight - paddingY * 2);
    return { ...d, x, revenueY, ordersY };
  });

  const revenuePathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.revenueY}`, '');
  const ordersPathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.ordersY}`, '');
  const revenueAreaD = `${revenuePathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Search filter for overview sales table
  const filteredSales = sales.filter((s) =>
    s.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C2A39] flex font-sans antialiased selection:bg-[#274258] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#E8E3D9] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[#E2DDD3] text-[#4A453E] hover:bg-[#F5F3EE] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="hidden md:flex items-center relative w-72">
              <Search className="w-3.5 h-3.5 text-[#786E60] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search invoices, clients, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F5F3EE] border border-[#E5E0D6] rounded-lg text-xs text-[#1C2A39] placeholder-[#8C8275] focus:outline-none focus:border-[#274258]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786E60]">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-[#E2DDD3] bg-white text-xs font-medium text-[#4A453E] shadow-2xs hover:bg-[#F8F6F0] transition-colors cursor-pointer">
              <Calendar className="w-3.5 h-3.5 text-[#786E60]" />
              <span>Date Range</span>
            </button>

            <div className="relative p-2 rounded-full hover:bg-[#EAE5DB] transition-colors cursor-pointer text-[#4A453E]">
              <Bell className="w-4 h-4" />
              {sales.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />}
            </div>

            <div 
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 rounded-full border border-[#E2DDD3] bg-[#274258] text-white flex items-center justify-center font-serif text-sm font-bold cursor-pointer shadow-2xs hover:bg-[#1C3142] transition-all"
            >
              {businessName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* VIEW 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Dynamic Greeting Header */}
              <div className="space-y-1">
                <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#1C2A39] tracking-tight">
                  Good morning, {businessName}
                </h1>
                <p className="text-sm text-[#786E60] font-sans">
                  Here is your live business overview for today.
                </p>
              </div>

              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                
                {/* CARD 1: REVENUE */}
                <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold text-[#8C8275] tracking-wider uppercase font-sans">
                      REVENUE
                    </span>
                    <div className="p-1.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F6] text-[#4A453E]">
                      <Banknote className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39] tracking-tight">
                      ₹{totalRevenueAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                      <span>Total Revenue Recorded</span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: ORDERS */}
                <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold text-[#8C8275] tracking-wider uppercase font-sans">
                      ORDERS
                    </span>
                    <div className="p-1.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F6] text-[#4A453E]">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39] tracking-tight">
                      {totalOrdersCount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                      <span>Total Sales Transactions</span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: CUSTOMERS */}
                <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold text-[#8C8275] tracking-wider uppercase font-sans">
                      CUSTOMERS
                    </span>
                    <div className="p-1.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F6] text-[#4A453E]">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39] tracking-tight">
                      {totalCustomersCount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                      <span>Unique Active Clients</span>
                    </div>
                  </div>
                </div>

                {/* CARD 4: GROWTH */}
                <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] font-bold text-[#8C8275] tracking-wider uppercase font-sans">
                      PROFIT MARGIN
                    </span>
                    <div className="p-1.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F6] text-[#4A453E]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39] tracking-tight">
                      {profitMargin}%
                    </div>
                    <div className="text-xs text-[#8C8275] font-sans">
                      Net Profit / Revenue
                    </div>
                  </div>
                </div>

              </div>

              {/* Dynamic Sales Performance Chart Card */}
              <div className="bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-6">
                
                {/* Header with Title & Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-serif-heading text-xl font-bold text-[#1C2A39]">
                    Sales Performance
                  </h2>

                  <div className="flex items-center gap-1 bg-[#F5F3EE] p-1 rounded-lg border border-[#E5E0D6] text-xs font-medium">
                    {['7D', '30D', '3M', '6M', '1Y'].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                          selectedTimeframe === tf
                            ? 'bg-white text-[#1C2A39] font-bold shadow-2xs'
                            : 'text-[#786E60] hover:text-[#1C2A39]'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Line Chart */}
                <div className="w-full bg-[#FAF8F5]/60 border border-[#EAE5DB] rounded-xl p-4 sm:p-6 relative overflow-hidden flex flex-col items-center">
                  
                  <div className="w-full h-64 relative">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1C2A39" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#1C2A39" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Gridlines */}
                      {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
                        const y = paddingY + ratio * (chartHeight - paddingY * 2);
                        return (
                          <line
                            key={idx}
                            x1={paddingX}
                            y1={y}
                            x2={chartWidth - paddingX}
                            y2={y}
                            stroke="#E8E3D9"
                            strokeDasharray="4 4"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Area & Lines */}
                      <path d={revenueAreaD} fill="url(#revenueGrad)" />
                      <path d={ordersPathD} fill="none" stroke="#A0988A" strokeWidth="2" strokeDasharray="3 3" />
                      <path d={revenuePathD} fill="none" stroke="#1C2A39" strokeWidth="2.5" />

                      {/* Dynamic Interactive Circles */}
                      {points.map((pt, idx) => (
                        <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                          <circle cx={pt.x} cy={pt.ordersY} r={hoveredIndex === idx ? 6 : 3.5} fill="#A0988A" />
                          <circle cx={pt.x} cy={pt.revenueY} r={hoveredIndex === idx ? 7 : 4.5} fill="#1C2A39" stroke="#ffffff" strokeWidth="2" />
                          <text x={pt.x} y={chartHeight - 8} textAnchor="middle" fontSize="11" fill="#786E60" fontWeight="500">
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </svg>

                    {/* Tooltip Overlay */}
                    {hoveredIndex !== null && points[hoveredIndex] && (
                      <div
                        className="absolute bg-[#1C2A39] text-white text-xs p-2.5 rounded-lg shadow-xl pointer-events-none transition-all z-20"
                        style={{
                          left: `${(points[hoveredIndex].x / chartWidth) * 100}%`,
                          top: `${(points[hoveredIndex].revenueY / chartHeight) * 100 - 45}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="font-bold text-amber-300">{points[hoveredIndex].label}</div>
                        <div className="text-[11px] text-white">Revenue: ₹{points[hoveredIndex].revenue.toLocaleString('en-IN')}</div>
                        <div className="text-[11px] text-slate-300">Orders: {points[hoveredIndex].orders}</div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E8E3D9] w-full text-center text-xs text-[#786E60] font-sans">
                    <span className="font-semibold text-[#1C2A39]">Revenue (Solid Brand Line)</span> vs{' '}
                    <span className="font-semibold text-[#8C8275]">Orders (Gray Line)</span>
                  </div>

                </div>

              </div>

              {/* Sales Table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Sales Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                      Recent Sales & Invoices
                    </h3>
                    <button
                      onClick={() => setIsAddSaleOpen(true)}
                      className="text-xs font-bold text-[#274258] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Sale
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1C2A39]">
                      <thead className="bg-[#F5F3EE] text-[#786E60] font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3 rounded-l-lg">Invoice ID</th>
                          <th className="p-3">Client</th>
                          <th className="p-3">Item</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3 rounded-r-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E3D9]">
                        {filteredSales.length > 0 ? (
                          filteredSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-[#FAF8F5] transition-colors">
                              <td className="p-3 font-mono text-[#786E60]">{sale.id}</td>
                              <td className="p-3 font-semibold text-[#1C2A39]">{sale.client}</td>
                              <td className="p-3 text-[#5C5446]">{sale.item}</td>
                              <td className="p-3 font-bold text-[#1C2A39]">₹{Number(sale.amount).toLocaleString('en-IN')}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  sale.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {sale.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-[#786E60]">
                              No sales recorded yet. Click "Add New Sale" above to record transactions.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Assistant Quick Widget */}
                <div className="bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-[#274258] mb-2">
                      <Sparkles className="w-5 h-5 text-[#274258]" />
                      <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                        AI Growth Advisor
                      </h3>
                    </div>
                    <p className="text-xs text-[#786E60] leading-relaxed">
                      Real-time analysis for <span className="font-semibold text-[#1C2A39]">{businessName}</span>: Total Revenue is ₹{totalRevenueAmount.toLocaleString('en-IN')} across {totalOrdersCount} order(s) with net profit margin of {profitMargin}%.
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-[#E8E3D9]">
                    <button
                      onClick={() => setIsAiChatOpen(true)}
                      className="w-full py-2.5 px-4 bg-[#274258] hover:bg-[#1C3142] text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Chat with AI Advisor</span>
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* VIEW: SALES PERFORMANCE TAB (Matches Provided Mockup Image Exactly) */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              {/* Title & Subtitle Header */}
              <div className="space-y-1">
                <h1 className="font-serif-heading text-3xl font-bold text-[#1C2A39] tracking-tight">
                  Sales Performance
                </h1>
                <p className="text-xs text-[#786E60] font-sans">
                  Monitor your key revenue metrics and transactional trends.
                </p>
              </div>

              {/* 4 Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                
                {/* Card 1: Total Revenue */}
                <div className="bg-white rounded-xl p-5 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#786E60]">Total Revenue</span>
                    <div className="p-1.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F6] text-[#4A453E]">
                      <Banknote className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39] tracking-tight">
                      ₹{totalRevenueAmount > 0 ? totalRevenueAmount.toLocaleString('en-IN') : '12,45,000'}
                    </div>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ↑ 14.5% vs last period
                    </span>
                  </div>
                </div>

                {/* Card 2: Avg Order Value */}
                <div className="bg-white rounded-xl p-5 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#786E60]">Avg Order Value</span>
                    <div className="p-1.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F6] text-[#4A453E]">
                      <Receipt className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39] tracking-tight">
                      ₹4,250
                    </div>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ─ 2.1% vs last period
                    </span>
                  </div>
                </div>

                {/* Card 3: Total Orders */}
                <div className="bg-white rounded-xl p-5 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#786E60]">Total Orders</span>
                    <div className="p-1.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F6] text-[#4A453E]">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39] tracking-tight">
                      {totalOrdersCount > 0 ? totalOrdersCount : '293'}
                    </div>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ↑ 8.4% vs last period
                    </span>
                  </div>
                </div>

                {/* Card 4: New Customers */}
                <div className="bg-white rounded-xl p-5 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#786E60]">New Customers</span>
                    <div className="p-1.5 rounded-md border border-[#E8E3D9] bg-[#FBF9F6] text-[#4A453E]">
                      <UserPlus className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39] tracking-tight">
                      48
                    </div>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      ↓ 3.2% vs last period
                    </span>
                  </div>
                </div>

              </div>

              {/* Revenue & Orders Trend Dual Line Chart Card */}
              <div className="bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                    Revenue & Orders Trend
                  </h3>
                  
                  {/* Timeframe selector pills */}
                  <div className="flex items-center gap-1 bg-[#F5F3EE] p-1 rounded-lg border border-[#E5E0D6] text-xs font-medium">
                    {['7D', '30D', '90D', '12M'].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setSalesTrendTimeframe(tf)}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                          salesTrendTimeframe === tf
                            ? 'bg-white text-[#1C2A39] font-bold shadow-2xs'
                            : 'text-[#786E60] hover:text-[#1C2A39]'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Dual Curves Container */}
                <div className="w-full h-64 bg-[#FAF8F5]/60 border border-[#EAE5DB] rounded-xl p-4 flex flex-col justify-end relative">
                  <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                    {/* Horizontal gridlines */}
                    <line x1="0" y1="50" x2="600" y2="50" stroke="#E8E3D9" strokeDasharray="4 4" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#E8E3D9" strokeDasharray="4 4" />
                    <line x1="0" y1="150" x2="600" y2="150" stroke="#E8E3D9" strokeDasharray="4 4" />

                    {/* Revenue Line (Upper Navy Curve) */}
                    <path
                      d="M 10 160 Q 150 140 280 80 T 480 100 T 590 30"
                      fill="none"
                      stroke="#1C2A39"
                      strokeWidth="2.5"
                    />

                    {/* Orders Line (Lower Amber Curve) */}
                    <path
                      d="M 10 175 Q 160 165 290 120 T 490 140 T 590 95"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom Row: Top Performing Products (Left) & Sales Pattern Analysis (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Top Performing Products Card */}
                <div className="bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-4">
                  <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                    Top Performing Products
                  </h3>

                  <div className="space-y-3 divide-y divide-[#E8E3D9]">
                    {[
                      { rank: 1, name: 'Industrial Filter Cartridge', sku: 'IND-FC-092', revenue: '₹3,45,000', units: '124 units' },
                      { rank: 2, name: 'Premium Packaging Tape', sku: 'PKG-T-01', revenue: '₹2,10,500', units: '890 units' },
                      { rank: 3, name: 'Heavy Duty Bearings', sku: 'HDB-50MM', revenue: '₹1,85,200', units: '45 units' },
                      { rank: 4, name: 'Safety Goggles Pro', sku: 'SFT-G-V2', revenue: '₹95,000', units: '210 units' },
                      { rank: 5, name: 'Calibration Weights Kit', sku: 'CAL-W-05', revenue: '₹72,400', units: '12 units' },
                    ].map((item) => (
                      <div key={item.rank} className="pt-3 flex items-center justify-between first:pt-0 text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="font-serif-heading font-bold text-sm text-[#786E60] w-4">
                            {item.rank}
                          </span>
                          <div className="p-2 rounded-lg bg-[#F5F3EE] border border-[#E5E0D6] text-[#274258]">
                            <Box className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-[#1C2A39]">{item.name}</h4>
                            <p className="text-[10px] text-[#786E60]">SKU: {item.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xs text-[#1C2A39]">{item.revenue}</div>
                          <div className="text-[10px] text-emerald-700 font-medium">{item.units}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales Pattern Analysis Card */}
                <div className="bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-5">
                  <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                    Sales Pattern Analysis
                  </h3>

                  {/* Peak Performance Days */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" /> Peak Performance Days
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E3D9]">
                        <span className="text-[#1C2A39]">October 12, 2023 (Diwali Prep)</span>
                        <span className="font-bold text-[#1C2A39]">₹85,000</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E3D9]">
                        <span className="text-[#1C2A39]">September 30, 2023 (Month End)</span>
                        <span className="font-bold text-[#1C2A39]">₹72,500</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#1C2A39]">October 05, 2023 (Bulk Order)</span>
                        <span className="font-bold text-[#1C2A39]">₹68,200</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#E8E3D9] pt-4 space-y-3">
                    {/* Low Activity Days */}
                    <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4" /> Low Activity Days
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E3D9]">
                        <span className="text-[#1C2A39]">September 24, 2023 (Sunday)</span>
                        <span className="font-bold text-[#1C2A39]">₹4,200</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E3D9]">
                        <span className="text-[#1C2A39]">October 01, 2023 (Sunday)</span>
                        <span className="font-bold text-[#1C2A39]">₹5,100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#1C2A39]">September 19, 2023 (Holiday)</span>
                        <span className="font-bold text-[#1C2A39]">₹8,400</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* VIEW: CUSTOMERS INSIGHTS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Title Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-serif-heading text-3xl font-bold text-[#1C2A39] tracking-tight">
                  Customers
                </h1>
              </div>

              {/* 4 Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                
                {/* Card 1: Total Customers */}
                <div className="bg-white rounded-xl p-5 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#786E60]">Total Customers</span>
                    <Users className="w-4 h-4 text-[#4A453E]" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39]">
                      12,450
                    </span>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ↗ +5.2%
                    </span>
                  </div>
                </div>

                {/* Card 2: New Customers */}
                <div className="bg-white rounded-xl p-5 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#786E60]">New Customers</span>
                    <UserPlus className="w-4 h-4 text-[#4A453E]" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39]">
                      842
                    </span>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ↗ +12%
                    </span>
                  </div>
                </div>

                {/* Card 3: Returning Customers */}
                <div className="bg-white rounded-xl p-5 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#786E60]">Returning Customers</span>
                    <RefreshCw className="w-4 h-4 text-[#4A453E]" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39]">
                      11,608
                    </span>
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ↘ -1.5%
                    </span>
                  </div>
                </div>

                {/* Card 4: Retention Rate */}
                <div className="bg-white rounded-xl p-5 border border-[#E8E3D9] shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#786E60]">Retention Rate</span>
                    <Tag className="w-4 h-4 text-[#4A453E]" />
                  </div>
                  <div className="mt-3 flex items-baseline space-x-2">
                    <span className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#1C2A39]">
                      78.4%
                    </span>
                    <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Stable
                    </span>
                  </div>
                </div>

              </div>

              {/* Middle Row: Customer Growth Line Chart & New vs Returning Stacked Bar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Customer Growth Line Chart Card */}
                <div className="bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                      Customer Growth
                    </h3>
                    <button className="text-[#786E60] hover:text-[#1C2A39] p-1 rounded-md">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-full h-56 bg-[#FAF8F5]/60 border border-[#EAE5DB] rounded-xl p-4 flex flex-col justify-end relative">
                    <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                      <line x1="0" y1="45" x2="500" y2="45" stroke="#E8E3D9" strokeDasharray="4 4" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#E8E3D9" strokeDasharray="4 4" />
                      <line x1="0" y1="135" x2="500" y2="135" stroke="#E8E3D9" strokeDasharray="4 4" />

                      <path
                        d="M 10 150 Q 80 110 140 120 T 270 70 T 380 90 T 490 25"
                        fill="none"
                        stroke="#1C2A39"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M 10 150 Q 80 110 140 120 T 270 70 T 380 90 T 490 25 L 490 170 L 10 170 Z"
                        fill="#1C2A39"
                        fillOpacity="0.06"
                      />
                    </svg>
                  </div>
                </div>

                {/* New vs Returning Stacked Bar Chart Card */}
                <div className="bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                      New vs Returning
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-[#786E60]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1C2A39]" /> New
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D1CDC4]" /> Returning
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-56 bg-[#FAF8F5]/60 border border-[#EAE5DB] rounded-xl p-4 flex items-end justify-around">
                    {[
                      { newH: '15%', retH: '50%' },
                      { newH: '20%', retH: '55%' },
                      { newH: '18%', retH: '60%' },
                      { newH: '25%', retH: '45%' },
                      { newH: '12%', retH: '65%' },
                      { newH: '28%', retH: '62%' },
                    ].map((bar, idx) => (
                      <div key={idx} className="w-9 h-44 flex flex-col justify-end space-y-1">
                        <div className="w-full bg-[#D1CDC4] rounded-t-sm" style={{ height: bar.retH }} />
                        <div className="w-full bg-[#1C2A39] rounded-b-sm" style={{ height: bar.newH }} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Row: Top Customers Table (8 cols) & Customers at Risk Widget (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Top Customers Table Card (8 Columns) */}
                <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                      Top Customers
                    </h3>
                    <button className="text-xs font-semibold text-[#786E60] hover:text-[#1C2A39] cursor-pointer">
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1C2A39]">
                      <thead className="bg-[#FAF8F5] border-b border-[#E8E3D9] text-[#786E60] font-semibold tracking-wider text-[11px]">
                        <tr>
                          <th className="p-3">Customer Name</th>
                          <th className="p-3">Total Orders</th>
                          <th className="p-3">Total Spent</th>
                          <th className="p-3">Last Order Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E3D9]">
                        {[
                          { name: 'Acme Corp', orders: 142, spent: '₹1,24,500', date: 'Oct 12, 2023' },
                          { name: 'Global Industries', orders: 98, spent: '₹89,200', date: 'Oct 10, 2023' },
                          { name: 'Tech Solutions Ltd', orders: 75, spent: '₹65,800', date: 'Oct 05, 2023' },
                          { name: 'Sharma Enterprises', orders: 64, spent: '₹52,100', date: 'Sep 28, 2023' },
                        ].map((cust, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="p-3 font-bold text-[#1C2A39]">{cust.name}</td>
                            <td className="p-3 font-medium text-[#475569]">{cust.orders}</td>
                            <td className="p-3 font-bold text-[#1C2A39]">{cust.spent}</td>
                            <td className="p-3 text-[#64748B]">{cust.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Customers at Risk Widget Card (4 Columns) */}
                <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-[#E8E3D9] shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">
                        Customers at Risk
                      </h3>
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </div>

                    <div className="space-y-3">
                      <div className="bg-[#FDF2F2] border border-rose-200/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-[#1C2A39]">Apex Logistics</h4>
                          <p className="text-[11px] text-rose-700 font-medium">No orders in 90 days</p>
                        </div>
                        <span className="bg-white text-rose-600 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          High Risk
                        </span>
                      </div>

                      <div className="bg-[#FEFCE8] border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-[#1C2A39]">Sunrise Retail</h4>
                          <p className="text-[11px] text-amber-800 font-medium">Order volume down 40%</p>
                        </div>
                        <span className="bg-white text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          Medium Risk
                        </span>
                      </div>

                      <div className="bg-[#FEFCE8] border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-[#1C2A39]">Metro Traders</h4>
                          <p className="text-[11px] text-amber-800 font-medium">Delayed payments (2x)</p>
                        </div>
                        <span className="bg-white text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          Medium Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="w-full py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#1C2A39] hover:bg-[#F5F3EE] cursor-pointer transition-colors shadow-2xs">
                      Review Retention Strategy
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Page Title */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-serif-heading text-3xl font-bold text-[#1C2A39] tracking-tight">
                  Orders Management
                </h1>
              </div>

              {/* Controls Row (Search Box + Status Filter + Export Button) */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#786E60] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearchQuery}
                    onChange={(e) => {
                      setOrderSearchQuery(e.target.value);
                      setOrderCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#1C2A39] placeholder-[#8C8275] focus:outline-none focus:border-[#274258] transition-colors shadow-2xs"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#786E60] hover:text-[#1C2A39]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Right Controls: Filter Dropdown & Export Button */}
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => {
                        setOrderStatusFilter(e.target.value);
                        setOrderCurrentPage(1);
                      }}
                      className="bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-xs font-medium text-[#1C2A39] focus:outline-none focus:border-[#274258] appearance-none pr-8 cursor-pointer shadow-2xs"
                    >
                      <option value="All Statuses">All Statuses</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Processing">Processing</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#786E60] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={handleExportOrdersCSV}
                    className="bg-[#1C2A39] hover:bg-[#274258] text-white rounded-lg px-4 py-2 text-xs font-semibold flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Orders Table Container */}
              <div className="bg-white rounded-xl border border-[#E8E3D9] shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#1C2A39]">
                    <thead className="bg-[#FAF8F5] border-b border-[#E8E3D9] text-[#786E60] font-semibold tracking-wider text-[11px] uppercase">
                      <tr>
                        <th className="p-3.5">ORDER ID</th>
                        <th className="p-3.5">CUSTOMER</th>
                        <th className="p-3.5">DATE</th>
                        <th className="p-3.5">PRODUCT</th>
                        <th className="p-3.5">AMOUNT</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E3D9]">
                      {paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                            {/* ORDER ID */}
                            <td className="p-3.5 font-bold text-[#274258] hover:underline cursor-pointer">
                              {order.id}
                            </td>

                            {/* CUSTOMER (Initials badge + Name) */}
                            <td className="p-3.5 font-semibold text-[#1C2A39]">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#475569] font-bold text-[11px] flex items-center justify-center shrink-0">
                                  {order.initials}
                                </div>
                                <span>{order.customer}</span>
                              </div>
                            </td>

                            {/* DATE */}
                            <td className="p-3.5 text-[#64748B] font-medium">{order.date}</td>

                            {/* PRODUCT */}
                            <td className="p-3.5 text-[#334155] font-medium">{order.product}</td>

                            {/* AMOUNT */}
                            <td className="p-3.5 font-bold text-[#1C2A39]">
                              ₹{Number(order.amount).toLocaleString('en-IN')}
                            </td>

                            {/* STATUS PILL BADGE */}
                            <td className="p-3.5">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'Delivered'
                                    ? 'bg-[#E6F4EA] text-[#137333] border border-emerald-200/60'
                                    : order.status === 'Processing'
                                    ? 'bg-[#FEF7E0] text-[#B06000] border border-amber-200/60'
                                    : order.status === 'Pending'
                                    ? 'bg-[#E8F0FE] text-[#1A73E8] border border-blue-200/60'
                                    : 'bg-[#FCE8E6] text-[#C5221F] border border-rose-200/60'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>

                            {/* ACTIONS */}
                            <td className="p-3.5 text-right">
                              <button className="text-[#64748B] hover:text-[#1C2A39] p-1 rounded-md transition-colors cursor-pointer">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[#786E60]">
                            No orders match your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="bg-[#FAF8F5] border-t border-[#E8E3D9] px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
                  <div>
                    Showing <span className="font-bold text-[#1C2A39]">{startIndex + 1}</span> to{' '}
                    <span className="font-bold text-[#1C2A39]">{Math.min(startIndex + ordersPerPage, filteredOrdersList.length)}</span> of{' '}
                    <span className="font-bold text-[#1C2A39]">{filteredOrdersList.length}</span> results
                  </div>

                  {/* Page Buttons */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setOrderCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={orderCurrentPage === 1}
                      className="w-7 h-7 rounded-md border border-[#CBD5E1] bg-white flex items-center justify-center text-[#1C2A39] hover:bg-[#F5F3EE] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setOrderCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            orderCurrentPage === pageNum
                              ? 'bg-[#1C2A39] text-white shadow-2xs'
                              : 'bg-white border border-[#CBD5E1] text-[#1C2A39] hover:bg-[#F5F3EE]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setOrderCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={orderCurrentPage === totalPages}
                      className="w-7 h-7 rounded-md border border-[#CBD5E1] bg-white flex items-center justify-center text-[#1C2A39] hover:bg-[#F5F3EE] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PRODUCTS / INVENTORY */}
          {(activeTab === 'products' || activeTab === 'inventory') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-serif-heading text-3xl font-bold text-[#1C2A39]">
                  {activeTab === 'products' ? 'Product Inventory' : 'Stock Management'}
                </h1>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 bg-[#274258] text-white rounded-lg text-xs font-semibold hover:bg-[#1C3142] flex items-center space-x-2 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventory.map((prod) => (
                  <div key={prod.id} className="bg-white rounded-xl border border-[#E8E3D9] p-5 shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-[#786E60]">{prod.id}</span>
                      <span className="bg-[#F5F3EE] text-[#274258] px-2 py-0.5 rounded-md text-[10px] font-bold">{prod.category}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1C2A39]">{prod.name}</h4>
                    <div className="flex justify-between text-xs pt-2 border-t border-[#E8E3D9]">
                      <span className="text-[#786E60]">Stock Level:</span>
                      <span className={`font-bold ${prod.stock <= prod.minStock ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {prod.stock} {prod.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: INSIGHTS, FORECASTS, REPORTS, SETTINGS, HELP, PROFILE */}
          {['insights', 'forecasts', 'reports', 'settings', 'help', 'profile'].includes(activeTab) && (
            <div className="space-y-6">
              <h1 className="font-serif-heading text-3xl font-bold text-[#1C2A39] capitalize">
                {activeTab}
              </h1>
              <div className="bg-white rounded-xl border border-[#E8E3D9] p-6 shadow-2xs space-y-3">
                <p className="text-xs text-[#786E60]">
                  Live business analytics and strategy setup for <span className="font-bold text-[#1C2A39]">{businessName}</span>. Total calculated revenue is ₹{totalRevenueAmount.toLocaleString('en-IN')}.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ADD SALE MODAL */}
      {isAddSaleOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full border border-[#E8E3D9] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-heading text-lg font-bold text-[#1C2A39]">Record New Sale</h3>
              <button onClick={() => setIsAddSaleOpen(false)} className="text-[#786E60] hover:text-[#1C2A39]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#1C2A39]">Client / Buyer Name</label>
                <input
                  type="text"
                  required
                  placeholder="Client / Buyer name"
                  value={saleForm.client}
                  onChange={(e) => setSaleForm({ ...saleForm, client: e.target.value })}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#274258]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#1C2A39]">Item Description</label>
                <input
                  type="text"
                  placeholder="Item details"
                  value={saleForm.item}
                  onChange={(e) => setSaleForm({ ...saleForm, item: e.target.value })}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#274258]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-[#1C2A39]">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="Amount"
                  value={saleForm.amount}
                  onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-md focus:outline-none focus:border-[#274258]"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddSaleOpen(false)}
                  className="px-4 py-2 border border-[#CBD5E1] rounded-md text-[#4A453E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#274258] text-white font-bold rounded-md hover:bg-[#1C3142]"
                >
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI CHAT FLOATING DRAWER */}
      {isAiChatOpen && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[90vw] bg-white border border-[#E8E3D9] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="bg-[#274258] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <Bot className="w-5 h-5 text-amber-300" />
              <span>{businessName} AI Assistant</span>
            </div>
            <button onClick={() => setIsAiChatOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 h-72 overflow-y-auto space-y-3 text-xs bg-[#FAF8F5]">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-[#274258] text-white ml-auto'
                    : 'bg-white border border-[#E8E3D9] text-[#1C2A39] mr-auto shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#E8E3D9] bg-white flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask AI about live revenue..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-1 px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs focus:outline-none focus:border-[#274258]"
            />
            <button
              onClick={() => handleSendChat()}
              className="p-2 bg-[#274258] text-white rounded-lg hover:bg-[#1C3142]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
