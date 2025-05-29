import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, DollarSign, Calendar, Users, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import AuthenticatedLayout from "./layout/authenticated-layout"
import api from "../services/api"
import { formatCurrency } from "../utils/formatters"

export default function Profile() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dashboardData, setDashboardData] = useState(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/api/user-dashboard/')
                if (response.data.error) {
                    setError(response.data.error)
                    return
                }
                setDashboardData(response.data)
            } catch (err) {
                setError('Failed to load dashboard data')
                console.error('Error fetching dashboard data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </AuthenticatedLayout>
        )
    }

    if (error) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-red-600">{error}</div>
                </div>
            </AuthenticatedLayout>
        )
    }

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                <h1 className="text-3xl font-bold mb-8">Profile</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Personal Information</h2>
                            <p className="text-sm text-gray-500">Your account details</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">Username</label>
                                <p className="text-lg font-medium">{user?.username || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Email</label>
                                <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Phone Number</label>
                                <p className="text-lg font-medium">{user?.phone_number || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Account Number</label>
                                <p className="text-lg font-medium">{user?.account_number || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Referral Code</label>
                                <p className="text-lg font-medium">{user?.referral_code || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Investment Summary Card */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Loan Summary</h2>
                            <p className="text-sm text-gray-500">Overview of your Loan activities</p>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="text-sm text-gray-500">Total Loan records</span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(dashboardData?.statistics?.total_investment || 0)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="text-sm text-gray-500">Total Returns</span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(dashboardData?.statistics?.total_returns || 0)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="text-sm text-gray-500">Active Loans</span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {dashboardData?.statistics?.active_investments || 0}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="text-sm text-gray-500">Total Referrals History</span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {dashboardData?.referral?.total_referrals || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
