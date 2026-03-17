import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  getAllUsers: () => API.get('/auth/users'),
  deleteUser: (id) => API.delete(`/auth/users/${id}`),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  remove: (id) => API.delete(`/products/${id}`),
  addReview: (id, data) => API.post(`/products/${id}/reviews`, data),
  getFeatured: () => API.get('/products/featured'),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  remove: (id) => API.delete(`/categories/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart', data),
  update: (itemId, data) => API.put(`/cart/${itemId}`, data),
  remove: (itemId) => API.delete(`/cart/${itemId}`),
  clear: () => API.delete('/cart'),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/myorders'),
  getById: (id) => API.get(`/orders/${id}`),
  pay: (id, data) => API.put(`/orders/${id}/pay`, data),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  getAll: (params) => API.get('/orders', { params }),
};

// ─── Payment ──────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createIntent: (data) => API.post('/payment/create-intent', data),
  getConfig: () => API.get('/payment/config'),
};

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadAPI = {
  upload: (formData) =>
    API.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (publicId) => API.delete(`/upload/${publicId}`),
};

// ─── Dashboard ──────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
};
