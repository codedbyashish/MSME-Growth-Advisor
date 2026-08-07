import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

const initialSales = [
  { id: 'INV-2026-001', client: 'Metro Distributors', amount: 45000, status: 'Paid', date: '2026-08-07', item: 'Cotton Blends' },
  { id: 'INV-2026-002', client: 'Sia Designs', amount: 82000, status: 'Paid', date: '2026-08-06', item: 'Raw Silk Fabric' },
  { id: 'INV-2026-003', client: 'Apex Retailers', amount: 120000, status: 'Pending', date: '2026-08-05', item: 'Synthetic Yarns' },
  { id: 'INV-2026-004', client: 'Kishan Crafts', amount: 35000, status: 'Paid', date: '2026-08-04', item: 'Cotton Blends' },
  { id: 'INV-2026-005', client: 'Vardhman Textiles', amount: 143000, status: 'Paid', date: '2026-08-02', item: 'Raw Silk Fabric' },
];

const initialExpenses = [
  { id: 'EXP-101', title: 'Inventory Restock: Raw Materials', amount: 12800, category: 'Inventory', date: '2026-08-06', vendor: 'Surat Weavers Co.' },
  { id: 'EXP-102', title: 'Factory Electricity Bill', amount: 24500, category: 'Operations', date: '2026-08-04', vendor: 'State Electricity Board' },
  { id: 'EXP-103', title: 'Digital Ad Campaign - August', amount: 18000, category: 'Marketing', date: '2026-08-03', vendor: 'Google Ads' },
  { id: 'EXP-104', title: 'Logistics & Packaging Supplies', amount: 9500, category: 'Others', date: '2026-08-02', vendor: 'Speedy Delivery Services' },
];

const initialInventory = [
  { id: 'PRD-01', name: 'Cotton Blends', stock: 450, unit: 'Meters', minStock: 200, unitPrice: 320, category: 'Textiles' },
  { id: 'PRD-02', name: 'Raw Silk Fabric', stock: 120, unit: 'Meters', minStock: 150, unitPrice: 850, category: 'Premium' },
  { id: 'PRD-03', name: 'Synthetic Yarns', stock: 890, unit: 'Spools', minStock: 300, unitPrice: 180, category: 'Raw Materials' },
  { id: 'PRD-04', name: 'Polyester Thread Rolls', stock: 65, unit: 'Boxes', minStock: 100, unitPrice: 450, category: 'Accessories' }
];

const initialActivities = [
  { id: 1, type: 'sale', title: "Bulk Sale to 'Metro Distributors'", time: 'Today, 10:45 AM', detail: '₹45,000', icon: 'sale' },
  { id: 2, type: 'expense', title: "Inventory Restock: Raw Materials", time: 'Yesterday, 04:20 PM', detail: '₹12,800', icon: 'expense' },
  { id: 3, type: 'customer', title: "New Customer Registered: 'Sia Designs'", time: 'Yesterday, 11:15 AM', detail: 'Mumbai Region', icon: 'customer' }
];

export const DataProvider = ({ children }) => {
  const [sales, setSales] = useState(initialSales);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [inventory, setInventory] = useState(initialInventory);
  const [activities, setActivities] = useState(initialActivities);

  // Modals & Chat states
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // Active view tab in dashboard
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived metrics
  const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const healthScore = Math.min(98, Math.max(60, Math.round(75 + (netProfit / 10000))));

  const addSale = (newSale) => {
    const saleObj = {
      id: `INV-2026-00${sales.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      ...newSale,
      amount: Number(newSale.amount)
    };
    setSales([saleObj, ...sales]);
    setActivities([
      {
        id: Date.now(),
        type: 'sale',
        title: `Bulk Sale to '${newSale.client}'`,
        time: 'Just now',
        detail: `₹${Number(newSale.amount).toLocaleString('en-IN')}`,
        icon: 'sale'
      },
      ...activities
    ]);
  };

  const addExpense = (newExp) => {
    const expObj = {
      id: `EXP-${100 + expenses.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      ...newExp,
      amount: Number(newExp.amount)
    };
    setExpenses([expObj, ...expenses]);
    setActivities([
      {
        id: Date.now(),
        type: 'expense',
        title: newExp.title,
        time: 'Just now',
        detail: `₹${Number(newExp.amount).toLocaleString('en-IN')}`,
        icon: 'expense'
      },
      ...activities
    ]);
  };

  const addProduct = (newProd) => {
    const prodObj = {
      id: `PRD-0${inventory.length + 1}`,
      ...newProd,
      stock: Number(newProd.stock),
      unitPrice: Number(newProd.unitPrice),
      minStock: Number(newProd.minStock || 100)
    };
    setInventory([...inventory, prodObj]);
  };

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
