import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// import Navbar from './components/navbar';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Dashboard from './components/dashboard';
import MyInvestments from './components/my-investments';
import BuyShares from './components/buy-shares';
import SellShares from './components/sell-shares';
import Referrals from './components/referrals';
import Account from './components/account';
import Profile from './components/profile';
import Welcome from './pages/Welcome';
import Donations from './components/Donations';
import SocialNetwork from './components/SocialNetwork';
import HowItWorks from './pages/HowItWorks';
import NewsBlog from './pages/NewsBlog';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

// Public Route component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    {/* <Navbar /> Removed global navbar */}
                    <main className="container mx-auto px-4 py-8">
                        <Routes>
                            {/* Public Routes */}
                            <Route 
                                path="/" 
                                element={
                                    <PublicRoute>
                                        <Welcome />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/news-blog" 
                                element={
                                    <PublicRoute>
                                        <NewsBlog />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/login" 
                                element={
                                    <PublicRoute>
                                        <Login />
                                    </PublicRoute>
                                } 
                            />
                            <Route 
                                path="/register" 
                                element={
                                    <PublicRoute>
                                        <Register />
                                    </PublicRoute>
                                } 
                            />

                            {/* Protected Routes */}
                            <Route 
                                path="/how-it-works" 
                                element={
                                    <ProtectedRoute>
                                        <HowItWorks />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/my-investments" 
                                element={
                                    <ProtectedRoute>
                                        <MyInvestments />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/buy" 
                                element={
                                    <ProtectedRoute>
                                        <BuyShares />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/sell" 
                                element={
                                    <ProtectedRoute>
                                        <SellShares />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/referrals" 
                                element={
                                    <ProtectedRoute>
                                        <Referrals />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/account" 
                                element={
                                    <ProtectedRoute>
                                        <Account />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/profile" 
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/donations" 
                                element={
                                    <ProtectedRoute>
                                        <Donations />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/social" 
                                element={
                                    <ProtectedRoute>
                                        <SocialNetwork />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App; 