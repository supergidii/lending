import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, Row, Col, Alert, Breadcrumb } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck } from 'lucide-react';

const Audit = () => {
    const [auditData, setAuditData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                // Check if user is admin
                if (!user?.is_staff && !user?.is_superuser) {
                    setError('You do not have permission to view this page.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/system-overview/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setAuditData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Audit data fetch error:', err);
                if (err.response?.status === 403) {
                    setError('You do not have permission to view this page.');
                } else {
                    setError('Failed to fetch audit data. Please try again later.');
                }
                setLoading(false);
            }
        };

        fetchAuditData();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Loading audit data...</h3>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <Alert variant="danger" className="mt-3 shadow-lg">
                        <Alert.Heading>Error</Alert.Heading>
                        <p>{error}</p>
                    </Alert>
                </div>
            </div>
        );
    }

    if (!auditData) {
        return null;
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb Navigation */}
                <Breadcrumb className="mb-6">
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
                        <LayoutDashboard className="inline-block h-4 w-4 mr-1" />
                        Dashboard
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        <ClipboardCheck className="inline-block h-4 w-4 mr-1" />
                        System Audit
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">System Audit Overview</h2>

                    {/* User Statistics */}
                    <Card className="mb-6 border-0 shadow-sm">
                        <Card.Header className="bg-blue-600 text-white rounded-t-lg">
                            <h5 className="mb-0 font-semibold">User Statistics</h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <h3 className="text-3xl font-bold text-gray-900">
                                {auditData.user_statistics.total_users.toLocaleString()}
                            </h3>
                            <p className="text-gray-600 mt-2">Total Registered Users</p>
                        </Card.Body>
                    </Card>

                    {/* Investment Statistics */}
                    <Card className="mb-6 border-0 shadow-sm">
                        <Card.Header className="bg-blue-600 text-white rounded-t-lg">
                            <h5 className="mb-0 font-semibold">Investment Statistics</h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row>
                                <Col md={6} className="mb-4">
                                    <Card className="h-100 border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <Card.Body>
                                            <h6 className="text-gray-500 uppercase tracking-wider">Matured Investments</h6>
                                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                                {formatCurrency(auditData.investment_statistics.matured_investments.total_amount)}
                                            </h3>
                                            <p className="text-gray-600 mt-2">
                                                Count: {auditData.investment_statistics.matured_investments.count}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-4">
                                    <Card className="h-100 border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <Card.Body>
                                            <h6 className="text-gray-500 uppercase tracking-wider">Waiting Investors</h6>
                                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                                {formatCurrency(auditData.investment_statistics.waiting_investors.total_amount)}
                                            </h3>
                                            <p className="text-gray-600 mt-2">
                                                Count: {auditData.investment_statistics.waiting_investors.count}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-4">
                                    <Card className="h-100 border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <Card.Body>
                                            <h6 className="text-gray-500 uppercase tracking-wider">New Investors Pending</h6>
                                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                                {formatCurrency(auditData.investment_statistics.new_investors_pending.total_amount)}
                                            </h3>
                                            <p className="text-gray-600 mt-2">
                                                Count: {auditData.investment_statistics.new_investors_pending.count}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} className="mb-4">
                                    <Card className="h-100 border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <Card.Body>
                                            <h6 className="text-gray-500 uppercase tracking-wider">Total Investments</h6>
                                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                                {auditData.investment_statistics.total_investments.toLocaleString()}
                                            </h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* User Details */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-blue-600 text-white rounded-t-lg">
                            <h5 className="mb-0 font-semibold">User Investment Details</h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div className="table-responsive">
                                <Table striped bordered hover className="mb-0">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Investments</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matured</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paired</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {auditData.user_details.map((user, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.phone_number}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{user.total_investments}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.investments_by_status.pending?.total || 0)}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.investments_by_status.matured?.total || 0)}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.investments_by_status.paired?.total || 0)}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.investments_by_status.completed?.total || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Audit; 