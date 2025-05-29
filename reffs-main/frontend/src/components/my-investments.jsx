import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import AuthenticatedLayout from './layout/authenticated-layout';

const API_BASE_URL = 'http://localhost:8000';
const ITEMS_PER_PAGE = 10;

const CountdownTimer = ({ maturedAt, status }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        console.log('CountdownTimer received:', { maturedAt, status });

        const calculateTimeLeft = () => {
            if (!maturedAt) {
                console.log('No maturity date provided');
                setTimeLeft('the system is runing pairing');
                return;
            }

            try {
                const now = new Date();
                // Parse the date string and create a date object in UTC
                const [datePart, timePart] = maturedAt.split(' ');
                const [year, month, day] = datePart.split('-');
                const [maturityHours, maturityMinutes, maturitySeconds] = timePart.split(':');
                
                // Create date in UTC
                const maturity = new Date(Date.UTC(year, month - 1, day, maturityHours, maturityMinutes, maturitySeconds));
                
                console.log('Date comparison:', { 
                    now: now.toISOString(),
                    maturity: maturity.toISOString(),
                    nowTimestamp: now.getTime(),
                    maturityTimestamp: maturity.getTime(),
                    rawMaturityDate: maturedAt
                }); 

                const difference = maturity.getTime() - now.getTime();
                console.log('Time difference in milliseconds:', difference); 

                if (difference <= 0) {
                    setTimeLeft('Matured');
                    return;
                }

                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const remainingHours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const remainingMinutes = Math.floor((difference / 1000 / 60) % 60);
                const remainingSeconds = Math.floor((difference / 1000) % 60);

                const timeString = `${days}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
                console.log('Calculated time:', timeString); 
                setTimeLeft(timeString);
            } catch (error) {
                console.error('Error calculating time left:', error);
                setTimeLeft('Error calculating time');
            }
        };

        // Calculate immediately
        calculateTimeLeft();
        
        // Set up interval for updates
        const timer = setInterval(() => {
            console.log('Timer tick - recalculating...');
            calculateTimeLeft();
        }, 1000);

        // Cleanup interval on unmount
        return () => {
            console.log('Cleaning up timer');
            clearInterval(timer);
        };
    }, [maturedAt]);

    // Display different messages based on investment status
    if (status === 'completed') {
        return <span className="text-sm font-medium text-green-600">Completed</span>;
    }
    if (status === 'matured') {
        return <span className="text-sm font-medium text-blue-600">Matured</span>;
    }

    return (
        <div className="text-sm font-medium">
            {timeLeft}
        </div>
    );
};

const MyInvestments = () => {
    const { user } = useAuth();
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(investments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentInvestments = investments.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        const fetchInvestments = async () => {
            const token = localStorage.getItem('token');
            console.log('Fetching investments with token:', token ? 'Token exists' : 'No token found');
            
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                setLoading(false);
                return;
            }
            
            try {
                const url = `${API_BASE_URL}/api/my_investments/`;
                console.log('Making request to:', url);
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                console.log('Complete API Response:', JSON.stringify(response.data, null, 2));
                
                if (response.data && response.data.status === 'success' && response.data.data) {
                    // Log each investment's complete data
                    response.data.data.forEach((investment, index) => {
                        console.log(`Complete Investment ${index + 1} data:`, JSON.stringify(investment, null, 2));
                    });
                    
                    setInvestments(response.data.data);
                } else {
                    console.error('Invalid response format:', response.data);
                    setError(response.data?.error || 'Invalid data format received');
                }
            } catch (err) {
                console.error('Error details:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    headers: err.response?.headers,
                    config: {
                        url: err.config?.url,
                        method: err.config?.method,
                        headers: err.config?.headers
                    }
                });
                
                if (err.response?.status === 401) {
                    setError('Your session has expired. Please log in again.');
                } else if (err.response?.status === 404) {
                    setError('The investments endpoint could not be found. Please contact support.');
                } else {
                    setError(err.response?.data?.error || 'Failed to fetch investments. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

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

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (error) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-red-500">{error}</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Lending Records</h1>

                {/* Investments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lending Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Return Amount</TableHead>
                                    <TableHead>Maturity Period</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Time to Maturity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentInvestments.length > 0 ? (
                                    currentInvestments.map((investment) => (
                                        <TableRow key={investment.id}>
                                            <TableCell>
                                                {new Date(investment.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>Ksh {parseFloat(investment.amount).toFixed(2)}</TableCell>
                                            <TableCell>Ksh {parseFloat(investment.return_amount).toFixed(2)}</TableCell>
                                            <TableCell>{investment.maturity_period} days</TableCell>
                                            <TableCell>{getStatusBadge(investment.status)}</TableCell>
                                            <TableCell>
                                                <CountdownTimer 
                                                    maturedAt={investment.matured_at} 
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No investments found
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

export default MyInvestments; 