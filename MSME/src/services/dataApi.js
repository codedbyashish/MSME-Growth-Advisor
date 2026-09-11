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
