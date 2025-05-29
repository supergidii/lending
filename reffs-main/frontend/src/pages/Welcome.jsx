import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  Menu,
  X,
  Heart,
  Rocket,
  Gift,
  RefreshCw
} from 'lucide-react';

const Welcome = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">PeerLend</Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8 lg:ml-auto lg:mr-10">
              <Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">How It Works</Link>
              <Link to="/news-blog" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">News & Blog</Link>
              <Link to="/login/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Login</Link>
              <Link 
                to="/register/" 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        <div
          className={`lg:hidden fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-gray-900">Menu</span>
              </div>
              <div className="ml-3">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="mt-5">
              <nav className="space-y-1">
                <Link
                  to="/how-it-works"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  to="/news-blog"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  News & Blog
                </Link>
                <Link
                  to="/login/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register/"
                  className="block w-full text-center px-3 py-2.5 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-16">
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <div className="flex items-center space-x-2 mb-4">
                    <Rocket className="h-8 w-8 text-blue-600" />
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                      <span className="block">Welcome to the Future</span>
                      <span className="block text-blue-600">of Lending</span>
                    </h1>
                  </div>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Join our innovative Peer-to-Peer Loan Bidding Platform — a smarter, safer, and more rewarding way to lend and borrow money. 
                    No middlemen, no delays, just direct community support.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Get Started
                        <Rocket className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to="/how-it-works"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">What Makes Us Different?</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                A Community-Powered Solution
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                We've built a simple, community-powered solution where everyone wins.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {/* Feature 1 */}
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Peer-to-Peer Matching</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Connect directly with others in the community. No middlemen, no delays — just direct support between peers.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Daily Interest Earnings</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Earn 2% interest daily on your loan bids. Your money works for you every single day.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Safe Repayment System</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Repayments are handled by different verified users, ensuring every lender gets paid back with interest.
                    </p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Gift className="h-6 w-6" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Generous Referral Rewards</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Earn 3% of your friends' loan bids as a bonus. The more people you invite, the more you earn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Heart className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Why We Built This</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                We believe everyone deserves access to fair financial opportunities. Whether you're looking to multiply your savings, 
                access a short-term loan, or support someone else while earning in the process — our system empowers you to do just that.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to Join the Future?</span>
              <span className="block">Get Started in Minutes</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-200">
              Create your free account, place your first loan bid, and start earning interest daily. 
              Don't forget to invite your friends to earn bonuses!
            </p>
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
            >
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 