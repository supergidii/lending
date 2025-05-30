import React from 'react';
import { LayoutDashboard, Scale, Handshake, Wallet, MessageCircle, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = localStorage.getItem('is_staff') === 'true';

  const navigationItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Loan Bidding', icon: <Scale className="h-5 w-5" />, path: '/loan-bidding' },
    { name: 'Loan Matches', icon: <Handshake className="h-5 w-5" />, path: '/loan-matches' },
    { name: 'My Wallet', icon: <Wallet className="h-5 w-5" />, path: '/wallet' },
    { name: 'Support', icon: <MessageCircle className="h-5 w-5" />, path: '/support' },
  ];

  // Add Audit link for admin users
  if (isAdmin) {
    navigationItems.push({
      name: 'Audit',
      icon: <ClipboardList className="h-5 w-5" />,
      path: '/audit'
    });
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">REFFS</span>
            </div>
          </div>
          <div className="flex space-x-4">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span className="ml-2">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 