import React from 'react';
import Navbar from './navbar';
import { 
  Users, 
  DollarSign, 
  Link as LinkIcon, 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle, 
  Gift, 
  BarChart2, 
  Settings, 
  Lightbulb,
  Heart,
  CreditCard
} from 'lucide-react';

const Donations = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Our Community</h1>
          
          <div className="space-y-8">
            {/* Mission Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  We're building a community where everyone can access fair and transparent financial services. 
                  Your support helps us maintain and improve our platform, ensuring it remains accessible to all.
                </p>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-800 font-medium">Your Impact:</p>
                  <ul className="list-disc list-inside text-blue-800 mt-2">
                    <li>Helping more people access affordable loans</li>
                    <li>Supporting platform development and security</li>
                    <li>Enabling community growth and education</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h2>
                <p className="text-gray-600 mb-4">
                  When you support our platform, you're helping to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Maintain our secure peer-to-peer lending system</li>
                  <li>Provide educational resources for our community</li>
                  <li>Develop new features to improve user experience</li>
                  <li>Ensure platform stability and reliability</li>
                </ul>
              </div>
            </div>

            {/* Impact Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Support Makes a Difference</h2>
                <p className="text-gray-600 mb-4">
                  Every contribution helps us:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Keep our platform secure and reliable</li>
                    <li>Provide better matching algorithms</li>
                    <li>Improve user experience</li>
                  </ul>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Expand our community reach</li>
                    <li>Develop new features</li>
                    <li>Support educational initiatives</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Make a Payment</h2>
                <p className="text-gray-600 mb-4">
                  Support our platform through M-PESA:
                </p>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 mb-2">Paybill Number</p>
                    <p className="text-3xl font-bold text-blue-600">123456</p>
                    <p className="text-gray-600 mt-2">Account Number: PEERLEND</p>
                  </div>
                  <div className="border-t border-blue-200 pt-4">
                    <p className="text-sm text-gray-600 text-center">
                      Follow these steps:
                    </p>
                    <ol className="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-1">
                      <li>Go to M-PESA menu</li>
                      <li>Select "Pay Bill"</li>
                      <li>Enter Business Number: 123456</li>
                      <li>Enter Account Number: PEERLEND</li>
                      <li>Enter amount and PIN</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Transparency in Action</h2>
                <p className="text-gray-600 mb-4">
                  We believe in complete transparency about how your support is used:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Regular updates on platform improvements</li>
                  <li>Quarterly reports on community impact</li>
                  <li>Clear communication about fund allocation</li>
                  <li>Open feedback channels for suggestions</li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Support Our Mission</h2>
              <p className="text-gray-600 mb-6 text-center">
                Help us build a stronger, more accessible financial community. Your support enables us to continue 
                providing innovative peer-to-peer lending solutions to our growing community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Support Now
                </button>
                <button
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations; 