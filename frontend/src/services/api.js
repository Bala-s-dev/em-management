import axios from 'axios';

// Create an Axios instance using the current browser hostname + /api.
// If running on localhost (127.0.0.1, ::1), point to port 5123.
// Fallback to http://localhost:5123/api for non-browser environments.
const getBaseURL = () => {
    if (typeof window === 'undefined' || !window.location) {
        return 'http://localhost:5123/api';
    }

    const { protocol, hostname, port } = window.location;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    const targetPort = isLocalhost ? '5123' : port;
    const origin = `${protocol}//${hostname}${targetPort ? `:${targetPort}` : ''}`;

    return new URL('/api', origin).toString();
};

const baseURL = getBaseURL();
const api = axios.create({ baseURL });

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