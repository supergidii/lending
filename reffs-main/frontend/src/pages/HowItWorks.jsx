import React from 'react';
import Navbar from '../components/navbar';
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
  Lightbulb
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h1>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign Up & Invite Friends</h2>
                <p className="text-gray-600 mb-4">
                  Create your account and start inviting friends using your referral link. You'll earn a 3% bonus on their first loan bid.
                </p>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-800 font-medium">Example:</p>
                  <p className="text-blue-800">If your friend bids KES 1,000, you instantly earn KES 30 as a referral bonus.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Bid a Loan (Become a Lender)</h2>
                <p className="text-gray-600">
                  Place your loan bid in our marketplace. Your bid enters a matching queue where it waits to be paired with a borrower who needs that amount.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Get Matched with a Borrower</h2>
                <p className="text-gray-600 mb-4">
                  Our smart system pairs your bid with a borrower based on available bids and needs. The borrower must confirm receipt to ensure transparency.
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-800 font-medium">Once the borrower confirms:</p>
                  <ul className="list-disc list-inside text-gray-600 mt-2">
                    <li>Your loan becomes active</li>
                    <li>You begin to earn daily interest</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Earn 2% Daily Interest</h2>
                <p className="text-gray-600 mb-4">
                  As a lender, your money works for you. Every day, your loan earns a 2% return, calculated on the original bid amount.
                </p>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-800 font-medium">Example:</p>
                  <p className="text-blue-800">Bid KES 1,000 → Earn KES 20/day</p>
                  <p className="text-blue-800">In 10 days, that's KES 1,200 back (principal + interest)</p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Get Repaid by a Different Peer</h2>
                <p className="text-gray-600">
                  Here's what makes our system unique: You're not repaid by the same borrower you lent to. Instead, another user from the system repays your matured loan. This design prevents loan defaults and ensures that everyone gets their money back — with interest.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">What Happens If Someone Doesn't Pay?</h2>
                <p className="text-gray-600 mb-4">We take defaults seriously.</p>
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-800 font-medium">If a user fails to repay a matured loan:</p>
                  <ul className="list-disc list-inside text-red-800 mt-2">
                    <li>Their account is banned permanently</li>
                    <li>They are removed from the platform</li>
                    <li>You are never asked to lend to them again</li>
                  </ul>
                  <p className="text-red-800 mt-2">This keeps the community safe, reliable, and sustainable.</p>
                </div>
              </div>
            </div>

            {/* Step 7 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Referral Bonuses That Work</h2>
                <p className="text-gray-600 mb-4">
                  Each time someone you invite makes a loan bid:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>You earn a 3% bonus</li>
                  <li>Your bonus accumulates in your wallet</li>
                  <li>You can redeem it when you make your own bids</li>
                </ul>
                <p className="text-gray-600 mt-4">It's our way of rewarding you for helping us grow.</p>
              </div>
            </div>

            {/* Dashboard Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Track Everything in Your Dashboard</h2>
                <p className="text-gray-600 mb-4">Your user dashboard gives you full visibility into:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Active loans</li>
                    <li>Daily interest earnings</li>
                    <li>Referral bonuses</li>
                  </ul>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Pending repayments</li>
                    <li>Account status and history</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* System Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">How We Keep It Running Smoothly</h2>
                <p className="text-gray-600 mb-4">Behind the scenes, our system uses:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Automated pairing logic to match lenders with borrowers</li>
                  <li>Daily interest calculations</li>
                  <li>Secure confirmation workflows</li>
                  <li>Ban mechanisms for non-compliant users</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  All of this is powered by smart algorithms and automated processing, ensuring your experience is seamless.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Join a Smarter Lending Community</h2>
            <p className="text-gray-600 mb-6 text-center">
              Whether you want to grow your money through daily interest or simply help someone in need while earning rewards, 
              our platform gives you the tools to do both — safely and profitably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/buy"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Start Bidding
              </a>
              <a
                href="/referrals"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Learn About Referrals
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 