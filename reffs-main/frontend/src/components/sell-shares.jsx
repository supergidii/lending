import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from "./layout/authenticated-layout"
import { Button } from "./ui/button"
import api from "../services/api"
import { formatCurrency } from "../utils/formatters"
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';
const ITEMS_PER_PAGE = 10;

const getStatusBadge = (status) => {
    const statusConfig = {
        pending: { color: 'bg-yellow-500', text: 'Pending' },
        matured: { color: 'bg-green-500', text: 'Matured' },
        paired: { color: 'bg-blue-500', text: 'Paired' },
        completed: { color: 'bg-purple-500', text: 'Completed' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', text: status };
    return (
        <Badge className={`${config.color} text-white`}>
            {config.text}
        </Badge>
    );
};

const SellShares = () => {
    const { user } = useAuth();
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/sell-shares/');
            
            if (response.data.error) {
                setError(response.data.error);
                toast.error(response.data.error);
                return;
            }

            setInvestments(response.data.data || []);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch investments';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async (investmentId) => {
        try {
            setLoading(true);
            const response = await api.post(`/api/confirm-payment/${investmentId}/`);
            
            if (response.data.success) {
                toast.success('Payment confirmed successfully');
                await fetchInvestments();
            } else {
                const errorMessage = response.data.error || 'Failed to confirm payment';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            const errorMessage = error.response?.data?.error || 'Failed to confirm payment. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Calculate pagination
    const totalPages = Math.ceil(investments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentInvestments = investments.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (error) {
        return (
            <AuthenticatedLayout>
                <div className="text-center p-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4"
                    >
                        Retry
                    </Button>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Funds Center</h1>

                {/* Investments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Available Packages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Paired To User</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentInvestments.length > 0 ? (
                                    currentInvestments.map((investment) => (
                                        <TableRow key={investment.id}>
                                            <TableCell>{investment.user_name}</TableCell>
                                            <TableCell>{investment.user_phone}</TableCell>
                                            <TableCell>Ksh {parseFloat(investment.amount || 0).toFixed(2)}</TableCell>
                                            <TableCell>{getStatusBadge(investment.status)}</TableCell>
                                            <TableCell>{getStatusBadge(investment.payment_status)}</TableCell>
                                            <TableCell>
                                                {investment.payment_status === 'paid' ? (
                                                    <span className="text-green-600 font-medium">Payment Confirmed</span>
                                                ) : investment.is_matured_investor ? (
                                                    <Button
                                                        onClick={() => handleConfirmPayment(investment.id)}
                                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                                    >
                                                        Confirm Payment
                                                    </Button>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        Waiting for payment confirmation
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No investments available for selling
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-700">
                                    Showing {startIndex + 1} to {Math.min(endIndex, investments.length)} of {investments.length} entries
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default SellShares;
