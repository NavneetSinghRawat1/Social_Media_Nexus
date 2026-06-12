import axios from 'axios';

// 1. Create the instance
const api = axios.create({
  baseURL: 'http://localhost:3000/u', // Base URL for all requests
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 2. Add a request interceptor to inject the JWT token automatically
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('userToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 3. Add a response interceptor to handle global errors (like 401)
api.interceptors.response.use(
  (response) => response.data, // Directly return the data array/object
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
