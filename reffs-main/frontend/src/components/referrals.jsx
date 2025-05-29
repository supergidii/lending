"use client"

import React, { useState, useEffect } from "react"
import AuthenticatedLayout from "./layout/authenticated-layout"
import { Button } from "./ui/button"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import { ChevronLeft, ChevronRight } from "lucide-react"

const API_BASE_URL = 'http://127.0.0.1:8000';
const ITEMS_PER_PAGE = 10;

export default function Referrals() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total_referrals: 0,
    total_earnings: 0,
    available_bonus: 0
  });

  useEffect(() => {
    const fetchReferrals = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/referrals/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setReferrals(response.data.referral_history || []);
          setReferredUsers(response.data.referred_users || []);
          setStats({
            total_referrals: response.data.total_referrals || 0,
            total_earnings: response.data.total_earnings || 0,
            available_bonus: response.data.available_bonus || 0
          });
        }
      } catch (err) {
        console.error('Error fetching referrals:', err);
        setError('Failed to fetch referral data');
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const referralLink = user ? `${window.location.origin}/register/?ref=${user.referral_code}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const referralsData = referrals?.map((ref) => {
    // Find the referred user's details from referredUsers array using the referred ID
    const referredUser = referredUsers.find(user => user.id === ref.referred);
    
    return {
      key: ref.id,
      date: ref.used_at ? new Date(ref.used_at).toLocaleDateString() : 'N/A',
      username: referredUser.username || 'Unknown',
      amount_invested: parseFloat(ref.amount_invested || 0).toFixed(2),
      bonus_earned: parseFloat(ref.bonus_earned || 0).toFixed(2),
      status: ref.status || 'pending'
    };
  }) || [];

  // Calculate pagination
  const totalPages = Math.ceil(referralsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReferrals = referralsData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto">
        {/* Referral Link Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-600 break-all">{referralLink}</div>
              </div>
              <Button 
                onClick={handleCopy} 
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white"
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Share this link with friends to earn 3% of their loans they fund!
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Total Referrals</h3>
            <p className="text-3xl font-bold">{stats.total_referrals}</p>
            <p className="text-sm text-gray-500">People you've referred</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold">Ksh {parseFloat(stats.total_earnings).toFixed(2)}</p>
            <p className="text-sm text-gray-500">From referral bonuses</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Available Bonus</h3>
            <p className="text-3xl font-bold">Ksh {parseFloat(stats.available_bonus).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Ready to use</p>
          </div>
        </div>

        {/* Referred Users List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Referred Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Username</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Phone Number</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Date Joined</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {referredUsers.length > 0 ? (
                    referredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                          {user.username}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                          {user.phone_number}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                          {new Date(user.date_joined).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.is_active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        No referred users yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Referral History Table with Pagination */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Referral History</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Referred User</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Amount Lent</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Bonus Earned</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentReferrals.map(referral => (
                    <tr key={referral.key} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                        {referral.date}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                        {referral.username}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                        Ksh {referral.amount_invested}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                        Ksh {referral.bonus_earned}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          referral.status === 'pending'
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, referralsData.length)} of {referralsData.length} entries
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
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
