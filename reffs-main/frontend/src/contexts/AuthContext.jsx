import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (phone, password) => {
        try {
            const response = await authService.login(phone, password);
            if (response.user) {
                setUser(response.user);
                localStorage.setItem('token', response.access);
                localStorage.setItem('user', JSON.stringify(response.user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                
                if (token && storedUser) {
                    // Set the user from localStorage immediately
                    setUser(JSON.parse(storedUser));
                    
                    // Verify the token in the background
                    try {
                        const userData = await authService.getCurrentUser();
                        if (userData) {
                            setUser(userData);
                            localStorage.setItem('user', JSON.stringify(userData));
                        } else {
                            // If token verification fails, clear the stored data
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            setUser(null);
                        }
                    } catch (error) {
                        console.error('Error verifying token:', error);
                        // Only clear storage if it's an authentication error
                        if (error.response?.status === 401) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            setUser(null);
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 