import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8080'; // Updated to match the correct backend URL

// Add default headers if needed
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add a request interceptor for handling errors
axios.interceptors.request.use(
  config => {
    // You can add auth tokens here if needed
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling errors
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axios; 