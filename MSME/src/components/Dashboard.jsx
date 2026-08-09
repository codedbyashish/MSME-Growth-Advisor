import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Sparkles, 
  Bot, 
  Send, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Building2, 
  PieChart, 
  Download, 
  Filter, 
  RefreshCw,
  Home,
  ShieldCheck,
  ChevronRight,
  Zap,
  HelpCircle,
  FileText,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
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
    isAnalysisModalOpen,
    setIsAnalysisModalOpen,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery
  } = useData();

  // Form states for modals
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({ client: '', item: '', amount: '', status: 'Paid' });
  const [expenseForm, setExpenseForm] = useState({ title: '', category: 'Inventory', amount: '', vendor: '' });
  const [productForm, setProductForm] = useState({ name: '', category: 'Textiles', stock: '', unit: 'Meters', unitPrice: '', minStock: '100' });

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your MSME Growth Co-Pilot. I've analyzed your financial health score (${healthScore}/100). How can I assist your business strategy today?`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Handlers
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

    // Simulated AI response generation
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();
      if (lower.includes('cash flow') || lower.includes('profit')) {
        reply = `Your Net Profit stands at ₹${netProfit.toLocaleString('en-IN')}. With a revenue of ₹${totalSales.toLocaleString('en-IN')} against ₹${totalExpenses.toLocaleString('en-IN')} expenses, your profit margin is ~${totalSales ? ((netProfit / totalSales) * 100).toFixed(1) : 0}%. Recommendation: Collect pending invoices to boost liquid cash flow.`;
      } else if (lower.includes('inventory') || lower.includes('stock')) {
        const lowStockItems = inventory.filter(i => i.stock <= i.minStock);
        if (lowStockItems.length > 0) {
          reply = `Alert: You have ${lowStockItems.length} low stock item(s): ${lowStockItems.map(i => i.name).join(', ')}. Restock soon to prevent supply bottlenecks.`;
        } else {
          reply = `Your inventory levels are currently healthy across all ${inventory.length} product lines.`;
        }
      } else if (lower.includes('loan') || lower.includes('scheme') || lower.includes('subsidy')) {
        reply = `Based on your profile, you qualify for the CGTMSE collateral-free credit scheme and Mudra Yojana Scheme (Tarun category up to ₹10 Lakhs). Would you like help generating a bankable financial summary?`;
      } else {
        reply = `I've processed your query regarding "${query}". Based on your current data (₹${totalSales.toLocaleString('en-IN')} revenue), maintaining your operating margin above 25% will keep your financial health score strong.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  // Filtered lists based on search
  const filteredSales = sales.filter(s => 
    s.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExpenses = expenses.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;
  const pendingSalesTotal = sales.filter(s => s.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className={`flex min-h-screen font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#090d14] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Grid Pattern - Dark & Light Mode Adaptive */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        isDark 
          ? 'bg-[linear-gradient(to_right,#1f293730_1px,transparent_1px),linear-gradient(to_bottom,#1f293730_1px,transparent_1px)]' 
          : 'bg-[linear-gradient(to_right,#cbd5e180_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e180_1px,transparent_1px)]'
      } bg-[size:32px_32px]`} />

      {/* Ambient Glow Orbs */}
      <div className={`absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none animate-pulse-slow z-0 blur-[150px] ${
        isDark 
          ? 'bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent' 
          : 'bg-gradient-to-tr from-emerald-500/10 via-teal-400/10 to-transparent'
      }`} />
      <div className={`absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full pointer-events-none animate-pulse-slow z-0 blur-[150px] ${
        isDark 
          ? 'bg-gradient-to-br from-emerald-400/10 to-cyan-500/10' 
          : 'bg-gradient-to-br from-emerald-500/10 to-cyan-400/10'
      }`} />

      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        salesCount={sales.length} 
        expensesCount={expenses.length} 
        inventoryCount={inventory.length} 
        lowStockCount={lowStockCount} 
        onAddSale={() => setIsAddSaleOpen(true)} 
        onOpenAiChat={() => setIsAiChatOpen(true)} 
        onOpenHealthAudit={() => setIsAnalysisModalOpen(true)}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Sticky Header */}
        <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors ${
          isDark ? 'bg-[#0c121b]/95 border-slate-800/80 text-white' : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`md:hidden p-2 rounded-xl border transition-colors ${
                isDark ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white' : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Active Page Title & Subtitle */}
            <div>
              <h1 className={`text-lg font-bold font-poppins tracking-tight flex items-center space-x-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span>
                  {activeTab === 'dashboard' && 'Financial Overview'}
                  {activeTab === 'sales' && 'Sales & Revenue'}
                  {activeTab === 'expenses' && 'Expenses & Costs'}
                  {activeTab === 'inventory' && 'Inventory Stock'}
                  {activeTab === 'insights' && 'AI Risk & Strategy'}
                </span>
              </h1>
              <p className={`text-[11px] font-medium hidden sm:block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Welcome back, Rajesh • Surat Textiles
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input 
                type="text"
                placeholder="Search invoices, clients, expenses, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors ${
                  isDark 
                    ? 'bg-slate-900/90 border-slate-800/90 text-slate-200' 
                    : 'bg-slate-100/90 border-slate-200 text-slate-800'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Dark/Light Mode Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-emerald-600'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <button 
              onClick={() => setIsAiChatOpen(!isAiChatOpen)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-900/50 transition-all shadow-md relative"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
              <span>AI Co-Pilot</span>
            </button>

            <button 
              onClick={() => setIsAddSaleOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Sale</span>
            </button>

            <button 
              onClick={() => navigate('/')}
              className={`p-2 rounded-xl border transition-colors ${
                isDark 
                  ? 'text-slate-400 hover:text-white bg-slate-900 border-slate-800/80' 
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 border-slate-200'
              }`}
              title="Return to Landing Page"
            >
              <Home className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
        </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* VIEW 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Revenue Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-white font-poppins">
                  ₹{totalSales.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center space-x-2 mt-2 text-xs">
                  <span className="text-emerald-400 font-medium inline-flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2%
                  </span>
                  <span className="text-slate-500">vs last month</span>
                </div>
              </div>

              {/* Total Expenses Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Expenses</span>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-white font-poppins">
                  ₹{totalExpenses.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center space-x-2 mt-2 text-xs">
                  <span className="text-slate-400 font-medium">
                    {expenses.length} recorded entries
                  </span>
                </div>
              </div>

              {/* Net Profit Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Net Profit</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 font-poppins">
                  ₹{netProfit.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center space-x-2 mt-2 text-xs">
                  <span className="text-slate-400 font-medium">
                    Margin: {totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>

              {/* Business Health Score Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Health Index</span>
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-white font-poppins">{healthScore}</span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Quick Action Banner & Insights */}
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Left Column: Visual Revenue vs Expense Chart & Quick Links */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Financial Summary Visualizer */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-poppins">Financial Performance Visualizer</h3>
                      <p className="text-xs text-slate-400">Comparing Revenue inflows vs Operating Cost outflows</p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-medium">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-slate-300">Revenue</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-3 rounded-full bg-rose-400" />
                        <span className="text-slate-300">Expenses</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Bar Chart Visualization */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Gross Sales Revenue</span>
                        <span className="text-emerald-400 font-bold">₹{totalSales.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-lg h-4 overflow-hidden p-0.5">
                        <div 
                          className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-md transition-all duration-700" 
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Operating Expenses</span>
                        <span className="text-rose-400 font-bold">₹{totalExpenses.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-lg h-4 overflow-hidden p-0.5">
                        <div 
                          className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-md transition-all duration-700" 
                          style={{ width: `${totalSales ? Math.min(100, (totalExpenses / totalSales) * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-xs font-semibold text-white">Net Cash Retention</div>
                        <div className="text-[11px] text-slate-400">You are retaining {(totalSales ? (netProfit / totalSales * 100).toFixed(0) : 0)}% of earnings after operations.</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('insights')}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center"
                    >
                      View AI Recommendations <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Recent Transactions Table Preview */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white font-poppins">Recent Invoices & Sales</h3>
                    <button 
                      onClick={() => setActiveTab('sales')}
                      className="text-xs text-emerald-400 hover:underline font-medium"
                    >
                      View All Sales ({sales.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-950/40 rounded-lg">
                        <tr>
                          <th className="py-2.5 px-3">Invoice ID</th>
                          <th className="py-2.5 px-3">Client</th>
                          <th className="py-2.5 px-3">Item Details</th>
                          <th className="py-2.5 px-3">Amount</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {sales.slice(0, 4).map((sale) => (
                          <tr key={sale.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-3 font-mono text-slate-400">{sale.id}</td>
                            <td className="py-3 px-3 font-semibold text-white">{sale.client}</td>
                            <td className="py-3 px-3 text-slate-400">{sale.item}</td>
                            <td className="py-3 px-3 font-bold text-emerald-400">₹{sale.amount.toLocaleString('en-IN')}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                sale.status === 'Paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                              }`}>
                                {sale.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column: AI Co-Pilot Widget & Inventory Alert */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* AI Growth Co-Pilot Advisory Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/20 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-poppins">AI Advisor Insights</h4>
                      <p className="text-[11px] text-emerald-400 font-medium">Real-time MSME Copilot</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-400 font-semibold">
                        <span>💡 Cash Flow Tip</span>
                        <span className="text-[10px] text-slate-500">Today</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        You have ₹{pendingSalesTotal.toLocaleString('en-IN')} pending in uncollected sales. Follow up with Apex Retailers to shorten your cash cycle.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-amber-400 font-semibold">
                        <span>📦 Inventory Warning</span>
                        <span className="text-[10px] text-slate-500">Alert</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {lowStockCount > 0 
                          ? `${lowStockCount} product(s) near minimum safety buffer!` 
                          : 'Stock levels look adequate for current demand.'}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsAiChatOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider flex items-center justify-center space-x-2 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>CHAT WITH AI ADVISOR</span>
                  </button>
                </div>

                {/* Quick Stock Status Card */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-poppins">Inventory Stock Highlights</h4>
                    <button onClick={() => setActiveTab('inventory')} className="text-xs text-emerald-400 hover:underline">
                      Manage ({inventory.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inventory.map(item => {
                      const isLow = item.stock <= item.minStock;
                      return (
                        <div key={item.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold text-white">{item.name}</div>
                            <div className="text-[10px] text-slate-400">{item.stock} {item.unit} in stock (Min: {item.minStock})</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLow ? 'bg-rose-950 text-rose-400 border border-rose-800/60' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {isLow ? 'Low Stock' : 'Sufficient'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </>
        )}

        {/* VIEW 2: SALES & REVENUE TAB */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins">Sales & Revenue Register</h2>
                <p className="text-xs text-slate-400">Track invoices, client payments, and sales revenue history</p>
              </div>
              <button 
                onClick={() => setIsAddSaleOpen(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>RECORD NEW SALE</span>
              </button>
            </div>

            {/* Sales Table */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-950/60 rounded-xl">
                    <tr>
                      <th className="py-3 px-4">Invoice ID</th>
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Item Sold</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredSales.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">{s.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{s.client}</td>
                        <td className="py-3.5 px-4 text-slate-300">{s.item}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">{s.date}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400">₹{s.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            s.status === 'Paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: EXPENSES & COSTS TAB */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins">Operating Expense Ledger</h2>
                <p className="text-xs text-slate-400">Monitor business expenses, vendor payouts, and overhead costs</p>
              </div>
              <button 
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>RECORD EXPENSE</span>
              </button>
            </div>

            {/* Expenses Table */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-950/60 rounded-xl">
                    <tr>
                      <th className="py-3 px-4">Expense ID</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Vendor / Payee</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">{exp.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{exp.title}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-xs">{exp.vendor}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">{exp.date}</td>
                        <td className="py-3.5 px-4 font-bold text-rose-400">₹{exp.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins">Inventory Stock Management</h2>
                <p className="text-xs text-slate-400">Real-time stock tracking, unit pricing, and buffer alerts</p>
              </div>
              <button 
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>ADD PRODUCT SKU</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase tracking-wider text-slate-400 bg-slate-950/60 rounded-xl">
                    <tr>
                      <th className="py-3 px-4">SKU Code</th>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Unit Price</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredInventory.map((item) => {
                      const isLow = item.stock <= item.minStock;
                      return (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">{item.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-400">{item.category}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-200">
                            {item.stock} {item.unit}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-emerald-400">₹{item.unitPrice}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              isLow ? 'bg-rose-950 text-rose-400 border border-rose-800/60' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            }`}>
                              {isLow ? 'Low Stock Warning' : 'Optimal Level'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: AI RISK & STRATEGY INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-poppins">AI Predictive Risk & Financial Strategy</h2>
              <p className="text-xs text-slate-400">Automated financial co-pilot recommendations tailored for Indian MSMEs</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white font-poppins">Cash Flow Optimization</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your working capital ratio is healthy. Expedite collection on 1 invoice to increase cash buffers before next month inventory replenishment.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white font-poppins">MSME Government Scheme Eligibility</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Qualified for CGTMSE Collateral-Free credit loan. Access low-interest working capital up to ₹2 Crore without pledging assets.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-white font-poppins">Vendor Cost Reduction</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Factory electricity & raw material purchasing comprise ~68% of total expenses. Bulk purchasing raw materials could yield 6% margin improvement.
                </p>
              </div>

            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white font-poppins">Need a Comprehensive Bankable PDF Financial Audit?</h4>
                <p className="text-xs text-slate-400">Generate an automated financial report formatted for bank loan applications and audit readiness.</p>
              </div>
              <button 
                onClick={() => setIsAnalysisModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 min-w-max transition-all shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>GENERATE HEALTH REPORT</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* --- MODAL 1: ADD SALE MODAL --- */}
      {isAddSaleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-poppins">Record New Sale Invoice</h3>
              <button onClick={() => setIsAddSaleOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Apex Retailers"
                  value={saleForm.client}
                  onChange={(e) => setSaleForm({...saleForm, client: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item / Product Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Raw Silk Fabric"
                  value={saleForm.item}
                  onChange={(e) => setSaleForm({...saleForm, item: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 50000"
                    value={saleForm.amount}
                    onChange={(e) => setSaleForm({...saleForm, amount: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select 
                    value={saleForm.status}
                    onChange={(e) => setSaleForm({...saleForm, status: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddSaleOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                >
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD EXPENSE MODAL --- */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-poppins">Record Operating Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expense Title / Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Electricity Bill"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({...expenseForm, title: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select 
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Inventory">Inventory Restock</option>
                    <option value="Operations">Operations / Power</option>
                    <option value="Marketing">Marketing / Ads</option>
                    <option value="Logistics">Logistics & Freight</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 15000"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vendor / Payee</label>
                <input 
                  type="text" 
                  placeholder="e.g. Surat Weavers Co."
                  value={expenseForm.vendor}
                  onChange={(e) => setExpenseForm({...expenseForm, vendor: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-lg"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD PRODUCT MODAL --- */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-poppins">Add Inventory Product SKU</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Item Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Organic Linen Yarn"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 500"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit of Measure</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Meters / Units"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 450"
                    value={productForm.unitPrice}
                    onChange={(e) => setProductForm({...productForm, unitPrice: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Safety Stock</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 100"
                    value={productForm.minStock}
                    onChange={(e) => setProductForm({...productForm, minStock: e.target.value})}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- AI ADVISOR FLOATING CHAT DRAWER --- */}
      {isAiChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-poppins">MSME Financial Co-Pilot</div>
                <div className="text-[10px] text-emerald-400 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  Active Assistant
                </div>
              </div>
            </div>
            <button onClick={() => setIsAiChatOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-slate-850 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto text-[10px]">
            {['Cash Flow Strategy', 'Low Stock Alert', 'MSME Loans'].map((pill, i) => (
              <button 
                key={i}
                onClick={() => handleSendChat(pill)}
                className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500 transition-colors whitespace-nowrap"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Ask financial advisor..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button 
              onClick={() => handleSendChat()}
              className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-bold transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 4: HEALTH AUDIT SUMMARY MODAL --- */}
      {isAnalysisModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white font-poppins">MSME Financial Health Audit</h3>
                  <p className="text-xs text-slate-400">Generated on {new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <button onClick={() => setIsAnalysisModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Health Index Score</div>
                <div className="text-2xl font-black text-emerald-400 font-poppins mt-1">{healthScore}/100</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Net Profit Margin</div>
                <div className="text-2xl font-black text-white font-poppins mt-1">
                  {totalSales ? ((netProfit / totalSales) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Working Capital Buffer</div>
                <div className="text-2xl font-black text-emerald-400 font-poppins mt-1">Strong</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-400">Key Audit Takeaways</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Revenue generation is stable across {sales.length} active invoices.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Operating expenses are within 65% of revenue, leaving healthy net margins.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Monitor low stock items ({lowStockCount}) to prevent order fulfillment delays.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button 
                onClick={() => setIsAnalysisModalOpen(false)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
