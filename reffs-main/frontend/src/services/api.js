import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add a request interceptor to add the auth token
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

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only clear auth data if it's an authentication error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    login: async (phone, password) => {
        try {
            const response = await api.post('/api/login/', { phone_number: phone, password });
            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/api/register/', userData);
            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    verifyReferralCode: async (code) => {
        try {
            const response = await api.get(`/api/register/?ref=${code}`);
            return response.data;
        } catch (error) {
            console.error('Referral code verification error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/api/user/me/');
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            throw error;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    }
};

export default api; 