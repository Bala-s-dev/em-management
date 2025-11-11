import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        // Get auth data from localStorage
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            const auth = JSON.parse(storedAuth);
            if (auth && auth.token) {
                // Set the Authorization header
                config.headers.Authorization = `Bearer ${auth.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;