import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getSales,
  createSaleApi,
  deleteSaleApi,
  getExpenses,
  createExpenseApi,
  deleteExpenseApi,
  getInventory,
  createProductApi,
  deleteProductApi,
  getActivities,
  seedUserDataApi,
} from '../services/dataApi';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals & Chat states
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // Active view tab in dashboard
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all user data from MongoDB backend
  const refreshData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setSales([]);
      setExpenses([]);
      setInventory([]);
      setActivities([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let [salesData, expensesData, inventoryData, activitiesData] = await Promise.all([
        getSales(),
        getExpenses(),
        getInventory(),
        getActivities(),
      ]);

      // If user has 0 records across all entities, auto-seed starter database entries for rich initial dashboard experience
      if (
        salesData.length === 0 &&
        expensesData.length === 0 &&
        inventoryData.length === 0
      ) {
        try {
          await seedUserDataApi();
          [salesData, expensesData, inventoryData, activitiesData] = await Promise.all([
            getSales(),
            getExpenses(),
            getInventory(),
            getActivities(),
          ]);
        } catch (seedErr) {
          console.warn('Auto-seed error:', seedErr.message);
        }
      }

      // Format items to match expected component properties
      setSales(
        salesData.map((s) => ({
          id: s._id || s.invoiceId,
          invoiceId: s.invoiceId,
          client: s.client,
          amount: Number(s.amount),
          status: s.status,
          date: s.date,
          item: s.item,
        }))
      );

      setExpenses(
        expensesData.map((e) => ({
          id: e._id || e.expenseId,
          expenseId: e.expenseId,
          title: e.title,
          amount: Number(e.amount),
          category: e.category,
          date: e.date,
          vendor: e.vendor,
        }))
      );

      setInventory(
        inventoryData.map((i) => ({
          id: i._id || i.productId,
          productId: i.productId,
          name: i.name,
          stock: Number(i.stock),
          unit: i.unit,
          minStock: Number(i.minStock),
          unitPrice: Number(i.unitPrice),
          category: i.category,
        }))
      );

      setActivities(
        activitiesData.map((a) => ({
          id: a._id,
          type: a.type,
          title: a.title,
          time: a.time,
          detail: a.detail,
          icon: a.icon,
        }))
      );
    } catch (err) {
      console.error('Error loading data from MongoDB API:', err.message);
      setError(err.message || 'Failed to load business data');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Derived metrics
  const totalSales = sales.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const netProfit = totalSales - totalExpenses;
  const healthScore = Math.min(98, Math.max(60, Math.round(75 + netProfit / 10000)));

  // Add Sale connected to MongoDB API
  const addSale = async (newSale) => {
    try {
      const created = await createSaleApi(newSale);
      await refreshData();
      return created;
    } catch (err) {
      console.error('Failed to add sale to DB:', err);
      throw err;
    }
  };

  // Add Expense connected to MongoDB API
  const addExpense = async (newExp) => {
    try {
      const created = await createExpenseApi(newExp);
      await refreshData();
      return created;
    } catch (err) {
      console.error('Failed to add expense to DB:', err);
      throw err;
    }
  };

  // Add Product connected to MongoDB API
  const addProduct = async (newProd) => {
    try {
      const created = await createProductApi(newProd);
      await refreshData();
      return created;
    } catch (err) {
      console.error('Failed to add product to DB:', err);
      throw err;
    }
  };

  // Delete handlers
  const deleteSale = async (id) => {
    try {
      await deleteSaleApi(id);
      await refreshData();
    } catch (err) {
      console.error('Failed to delete sale:', err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteExpenseApi(id);
      await refreshData();
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteProductApi(id);
      await refreshData();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
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
        loading,
        error,
        refreshData,
        addSale,
        addExpense,
        addProduct,
        deleteSale,
        deleteExpense,
        deleteProduct,
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
        setSearchQuery,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
