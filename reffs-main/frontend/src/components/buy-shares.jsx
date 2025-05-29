"use client"

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, User, LogOut, DollarSign, TrendingUp, AlertCircle, Calendar } from 'lucide-react'
import { authService } from '../services/api'
import AuthenticatedLayout from "./layout/authenticated-layout"
import { Button } from "./ui/button"
import api from "../services/api"
import { formatCurrency } from "../utils/formatters"
import Navbar from './navbar'

export default function BuyShares() {
  const [formData, setFormData] = useState({
    amount: '',
    maturityPeriod: '5' // Default to 30 days
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setError(null)
    } else {
      setError('Please enter a valid number')
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validate minimum amount
    if (parseFloat(formData.amount) < 100) {
      setError('Minimum loan bid amount is Ksh 100')
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/api/investments/create/', {
        amount: parseFloat(formData.amount),
        maturity_period: parseInt(formData.maturityPeriod)
      })

      if (response.data) {
        setSuccess(true)
        setFormData({ amount: '', maturityPeriod: '30' })
        // Show success message
        alert('Loan bid placed successfully!')
      }
    } catch (error) {
      console.error('Error creating loan bid:', error)
      setError(error.response?.data?.error || 'Failed to create loan bid')
    } finally {
      setLoading(false)
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

  useEffect(() => {
    const checkAvailability = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours * 60 + minutes; // Convert to minutes for easier comparison

      const morningStart = 9 * 60 + 30; // 9:30 AM
      const morningEnd = 11 * 60 + 30; // 11:30 AM
      const eveningStart = 16 * 60; // 4:00 PM
      const eveningEnd = 18 * 60; // 6:00 PM

      const isMorningSlot = currentTime >= morningStart && currentTime <= morningEnd;
      const isEveningSlot = currentTime >= eveningStart && currentTime <= eveningEnd;

      setIsAvailable(isMorningSlot || isEveningSlot);
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAvailable ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Trading Hours</h1>
              <p className="text-gray-600 mb-4">
                The loan bidding page is only available during the following hours:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>Morning Session: 9:30 AM - 11:30 AM</p>
                <p>Evening Session: 4:00 PM - 6:00 PM</p>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Please come back during these hours to place your bids.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Place Your Bid</h1>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Your lending amount has been successfully placed!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bid Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Bid Amount
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          error ? 'border-red-300' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Enter amount (min. 100)"
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {error}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="maturityPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                      Maturity Period
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="maturityPeriod"
                        name="maturityPeriod"
                        value={formData.maturityPeriod}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="5">5 Days</option>
                        <option value="10">10 Days</option>
                        <option value="20">20 Days</option>
                        <option value="30">30 Days</option>
                        <option value="40">40 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Bid Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bid Amount:</span>
                        <span className="font-medium text-gray-900">
                          {formData.amount ? `KES ${parseInt(formData.amount).toLocaleString()}` : 'KES 0'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Daily Interest (2%):</span>
                        <span className="font-medium text-gray-900">
                          {formData.amount ? `KES ${(parseInt(formData.amount) * 0.02).toLocaleString()}` : 'KES 0'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Return ({formData.maturityPeriod} Days):</span>
                        <span className="font-medium text-gray-900">
                          {formData.amount ? `KES ${calculateReturn().toLocaleString()}` : 'KES 0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!formData.amount || parseInt(formData.amount) < 100}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      !formData.amount || parseInt(formData.amount) < 100
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Place Bid
                  </button>
                </form>
              </div>

              {/* Information Panel */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">How Bidding Works</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">
                          Place your bid for any amount from KES 100 and above. Your bid will be matched with a borrower, and you'll start earning 2% daily interest.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">
                          Interest is calculated daily on your bid amount. For example, a KES 1,000 bid earns KES 20 per day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-blue-600">•</span>
                      <span className="ml-2">Minimum bid amount is KES 100</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-blue-600">•</span>
                      <span className="ml-2">Interest is paid daily at 2% of your bid amount</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-blue-600">•</span>
                      <span className="ml-2">Bids are matched with borrowers automatically</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-blue-600">•</span>
                      <span className="ml-2">You can place multiple bids to diversify your portfolio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 text-red-600">•</span>
                      <span className="ml-2 text-red-600 font-medium">Warning: Failure to pay a matched user will result in account suspension and potential legal action. Please ensure you have sufficient funds before placing a bid.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

BuyShares.propTypes = {
  amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  onBid: PropTypes.func.isRequired,
}
