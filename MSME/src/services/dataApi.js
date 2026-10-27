import api from './api';

// Sales API
export const getSales = async () => {
  const response = await api.get('/sales');
  return response.data;
};

export const createSaleApi = async (saleData) => {
  const response = await api.post('/sales', saleData);
  return response.data;
};

export const updateSaleApi = async (id, saleData) => {
  const response = await api.put(`/sales/${id}`, saleData);
  return response.data;
};

export const deleteSaleApi = async (id) => {

  const response = await api.delete(`/sales/${id}`);
  return response.data;
};

// Expenses API
export const getExpenses = async () => {
  const response = await api.get('/expenses');
  return response.data;
};

export const createExpenseApi = async (expenseData) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

export const deleteExpenseApi = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

// Inventory API
export const getInventory = async () => {
  const response = await api.get('/inventory');
  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await api.post('/inventory', productData);
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  const response = await api.put(`/inventory/${id}`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};

// Activities API
export const getActivities = async () => {
  const response = await api.get('/activities');
  return response.data;
};

// Seed API
export const seedUserDataApi = async () => {
  const response = await api.post('/seed');
  return response.data;
};

// Advisor & AI APIs
export const sendAdvisorChatApi = async (message) => {
  const response = await api.post('/advisor/chat', { message });
  return response.data;
};

export const getAdvisorInsightsApi = async () => {
  const response = await api.get('/advisor/insights');
  return response.data;
};

export const getAdvisorForecastApi = async () => {
  const response = await api.get('/advisor/forecast');
  return response.data;
};

export const getAdvisorReportsApi = async (params = {}) => {
  const response = await api.get('/advisor/reports', { params });
  return response.data;
};

// Expense Audit & Safe Cleanup API
export const auditExpensesApi = async (params = {}) => {
  const response = await api.get('/expenses/audit', { params });
  return response.data;
};

export const cleanupAuditExpensesApi = async (payload) => {
  const response = await api.post('/expenses/cleanup-audit', payload);
  return response.data;
};

// Import API
export const validateImportApi = async (importData) => {
  const response = await api.post('/import/validate', importData);
  return response.data;
};

export const executeImportApi = async (payload) => {
  const response = await api.post('/import/execute', payload);
  return response.data;
};
