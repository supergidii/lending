"use client"

import { useState, useEffect } from "react"
import AuthenticatedLayout from "./layout/authenticated-layout"
import StatCards from "./stat-cards"
import { ChevronDown, ChevronUp } from "lucide-react"
import api from "../services/api"
import { formatCurrency } from "../utils/formatters"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [isBuyOpen, setIsBuyOpen] = useState(false)
  const [isSellOpen, setIsSellOpen] = useState(false)
  const [isReferralOpen, setIsReferralOpen] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    maturityPeriod: '30'
  })
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sellSharesData, setSellSharesData] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        const response = await api.get('/api/user-dashboard/');
        console.log('Dashboard API Response:', response.data);
        
        if (response.data.error) {
          console.error('API returned error:', response.data.error);
          setError(response.data.error);
          setLoading(false);
          return;
        }

        setDashboardData(response.data);
        // Transform and set sell shares data from API response
        const transformedData = response.data?.payments?.map(payment => ({
          id: payment.id,
          amount: formatCurrency(payment.amount),
          investor: payment.from_user__username || 'Unknown',
          phone: payment.from_user__phone_number || 'N/A',
          date: new Date(payment.created_at).toLocaleDateString(),
          status: payment.status,
          payment_status: payment.payment_status,
          action: payment.status === 'Confirmed' ? 'Completed' : 'Confirm'
        })) || [];
        setSellSharesData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await api.post('/api/investments/create/', {
        amount: parseFloat(formData.amount),
        maturity_period: parseInt(formData.maturityPeriod)
      })

      if (response.data) {
        // Show success message
        alert('Investment placed successfully!')
        // Reset form
        setFormData({ amount: '', maturityPeriod: '30' })
        // Refresh dashboard data
        const dashboardResponse = await api.get('/api/user-dashboard/')
        setDashboardData(dashboardResponse.data)
      }
    } catch (error) {
      console.error('Error creating investment:', error)
      setError(error.response?.data?.error || 'Failed to create investment')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmPayment = async (paymentId) => {
    try {
      const response = await api.post(`/api/confirm-payment/${paymentId}/`)
      if (response.data.success) {
        // Update the local state to reflect the confirmed payment
        setSellSharesData(prevData => 
          prevData.map(item => 
            item.id === paymentId 
              ? { ...item, status: 'Confirmed', action: 'Completed' }
              : item
          )
        )
        // Refresh dashboard data
        const dashboardResponse = await api.get('/api/user-dashboard/')
        setDashboardData(dashboardResponse.data)
        alert('Payment confirmed successfully!')
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      setError(error.response?.data?.error || 'Failed to confirm payment')
    }
  }

  // Calculate estimated return
  const calculateReturn = () => {
    const amount = parseFloat(formData.amount) || 0
    const days = parseInt(formData.maturityPeriod) || 0
    const dailyInterest = 0.02 // 2% daily interest
    const interest = amount * dailyInterest * days
    return amount + interest
  }

  // Transform API data for referrals table with null checks
  const referralsData = dashboardData?.referral?.referral_history
    ?.map(ref => ({
      date: new Date(ref.created_at).toLocaleDateString(),
      username: ref.referred?.username || 'Unknown',
      amount_invested: formatCurrency(ref.amount_invested || 0),
      bonus_earned: formatCurrency(ref.bonus_earned || 0),
      status: ref.amount_invested === 0 ? 'No Investment' : ref.status.charAt(0).toUpperCase() + ref.status.slice(1)
    })) || []

  const referredUsersData = dashboardData?.referral?.referred_users
    ?.map(user => ({
      username: user.username || 'Unknown',
      phone: user.phone_number || 'N/A',
      date_joined: new Date(user.date_joined).toLocaleDateString(),
      status: user.is_active ? 'Active' : 'Inactive'
    })) || []

  const referralStats = {
    total_referrals: dashboardData?.referral?.total_referrals || 0,
    total_earnings: formatCurrency(dashboardData?.referral?.total_earnings || 0),
    available_bonus: formatCurrency(dashboardData?.referral?.available_bonus || 0)
  }

  const totalReferralEarnings = dashboardData?.referral?.total_earnings || 0;
  const totalReturns = dashboardData?.statistics?.total_returns || 0;

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {!loading && !error && dashboardData && (
          <StatCards data={dashboardData} />
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Earnings Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Referral Earnings Pie Chart */}
            <div className="w-full h-[300px]">
              <h3 className="text-md font-medium text-gray-700 mb-3 text-center">Referral Earnings</h3>
              <div className="h-[250px]">
                <Pie
                  data={{
                    labels: ['Total Earnings', 'Available Bonus'],
                    datasets: [
                      {
                        data: [
                          parseFloat(dashboardData?.referral?.total_earnings) || 0,
                          parseFloat(dashboardData?.referral?.available_bonus) || 0
                        ],
                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${formatCurrency(value)}`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Total  Earnings: {formatCurrency(dashboardData?.referral?.total_earnings || 0)}
                </p>
                <p className="text-sm text-gray-600">
                  Available Bonus: {formatCurrency(dashboardData?.referral?.available_bonus || 0)}
                </p>
              </div>
            </div>

            {/* Investment Returns Pie Chart */}
            <div className="w-full">
              <h3 className="text-md font-medium text-gray-700 mb-3 text-center">Loan Overview</h3>
              <Pie
                data={{
                  labels: ['Total Loan lent', 'Total Loan Returns'],
                  datasets: [
                    {
                      data: [
                        dashboardData?.statistics?.total_investment || 0,
                        dashboardData?.statistics?.total_returns || 0
                      ],
                      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(153, 102, 255, 1)'],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          return `${label}: ${formatCurrency(value)}`;
                        }
                      }
                    }
                  },
                }}
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Total Loan lent: {formatCurrency(dashboardData?.statistics?.total_investment || 0)}
                </p>
                <p className="text-sm text-gray-600">
                  Total Loan Returns: {formatCurrency(dashboardData?.statistics?.total_returns || 0)} 
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Loan lent</h3>
          <p className="text-2xl font-bold">Ksh {dashboardData?.statistics?.total_investment || '0.00'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Loan Returns</h3>
          <p className="text-2xl font-bold">Ksh {dashboardData?.statistics?.total_returns || '0.00'}</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
