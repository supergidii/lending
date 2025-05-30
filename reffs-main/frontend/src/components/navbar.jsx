import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronDown, User, LogOut, Menu, X, LayoutDashboard, Scale, Handshake, Wallet, MessageCircle, NetworkIcon, GiftIcon, Link2Icon, TrendingUp, HelpCircle, ClipboardCheck } from "lucide-react"
import { authService } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

export default function Navbar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Debug user data
    console.log('Current user data:', user);
    console.log('Is staff:', user?.is_staff);
    console.log('Is admin:', user?.is_admin);
  }, [user]);

  const onLogout = () => {
    authService.logout()
    navigate("/")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const getUserInitials = () => {
    if (!user?.username) return 'U'
    return user.username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const navLinks = [
    { to: "/dashboard/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { to: "/buy/", label: "Loan Bidding", icon: <Scale className="h-5 w-5" /> },
    { to: "/sell/", label: "Loan Matches", icon: <Handshake className="h-5 w-5" /> },
    { to: "/my-investments/", label: "Loan2Trade", icon: <TrendingUp className="h-5 w-5" /> },
    { to: "/referrals/", label: "Referrals", icon: <NetworkIcon className="h-5 w-5" /> },
    { to: "/donations/", label: "Donations", icon: <GiftIcon className="h-5 w-5" /> },
    { to: "/social/", label: "Social Network", icon: <Link2Icon className="h-5 w-5" /> },
    { to: "/how-it-works/", label: "How It Works", icon: <HelpCircle className="h-5 w-5" /> },
    ...((user?.is_staff || user?.is_superuser) ? [{ to: "/audit/", label: "Audit", icon: <ClipboardCheck className="h-5 w-5" /> }] : []),
  ]

  const renderNavLinks = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex items-center text-gray-800 hover:text-blue-600 transition-colors font-semibold text-[15px]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="mr-2">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </>
  )

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
            {/* Logo - hidden on mobile */}
           
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:space-x-8 items-center">
            <div className="flex items-center space-x-6">
              {renderNavLinks()}
            </div>

            {/* Account dropdown */}
            <div className="relative group flex items-center ml-6">
              <Link to="#" className="flex items-center text-gray-900 font-medium group-hover:text-blue-600">
                Account
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>

              {/* Dropdown menu */}
              <div className="absolute right-0 top-full z-10 mt-1 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                <div className="py-1">
                  {/* User info section */}
                  <div className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">{getUserInitials()}</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user?.username || 'User'}</div>
                        <div className="text-xs text-gray-500">{user?.email || 'No email'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100"></div>

                  {/* Profile link */}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </div>
                  </Link>

                  {/* Logout button */}
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Avatar */}
          <div className="flex items-center lg:hidden">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">{getUserInitials()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
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
                onClick={toggleMobileMenu}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-5">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  )
}
