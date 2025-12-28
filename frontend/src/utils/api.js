import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (userData) => api.post('/auth/login', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Complaint API calls
export const complaintAPI = {
  getComplaints: () => api.get('/complaints'),
  getComplaint: (id) => api.get(`/complaints/${id}`),
  createComplaint: (complaintData) => api.post('/complaints', complaintData),
  updateComplaint: (id, complaintData) => api.put(`/complaints/${id}`, complaintData),
  updateComplaintStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
  deleteComplaint: (id) => api.delete(`/complaints/${id}`),
};

export default api;