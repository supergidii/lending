import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Newspaper, 
  BookOpen, 
  Megaphone, 
  Calendar, 
  Clock, 
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

const NewsBlog = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const newsItems = [
    {
      id: 1,
      title: "Welcome to a New Era of Peer-to-Peer Lending!",
      content: "We're excited to officially launch our Peer-to-Peer Loan Bidding Platform! Designed to help users lend, borrow, and earn daily interest, our system is built with security, transparency, and community at its core. Whether you're looking to grow your savings or access a loan without the red tape — you're in the right place.",
      date: "March 15, 2024",
      category: "Platform Launch"
    },
    {
      id: 2,
      title: "You Can Now Track Your Referral Bonuses in Real-Time",
      content: "Great news! We've introduced a new referral dashboard that lets you see who you've invited, how much you've earned from their bids, and when you can redeem your bonuses. Start sharing your referral link today and earn 3% of each friend's loan bid.",
      date: "March 10, 2024",
      category: "New Feature"
    },
    {
      id: 3,
      title: "Account Verification and Default Prevention Measures Enhanced",
      content: "To improve the safety of our community, we've implemented stronger account verification and automated ban protocols for users who default. Our goal is to make sure no one ever loses their money on our platform.",
      date: "March 5, 2024",
      category: "Security Update"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "How to Place a Loan Bid and Start Earning Daily Interest",
      content: "New to the platform? Here's a step-by-step guide on how to place your first loan bid, get matched with a borrower, and start earning 2% daily interest. Whether you're starting with KES 500 or KES 10,000, your money can grow every day.",
      date: "March 12, 2024",
      category: "How-To Guide"
    },
    {
      id: 2,
      title: "What is Peer-to-Peer Lending and Why Should You Care?",
      content: "Peer-to-peer lending allows everyday people to lend and borrow money directly — without banks. It's faster, fairer, and more profitable. Learn how our system makes lending safe by using a different peer to repay your loan, so you're never exposed to risk.",
      date: "March 8, 2024",
      category: "Educational"
    },
    {
      id: 3,
      title: "How a University Student Turned KES 1,000 into KES 3,000 in 15 Days",
      content: "Meet Brian, a university student who used our platform to grow his loan bid from KES 1,000 to over KES 3,000 in just two weeks. He also invited four friends and earned extra bonuses. Here's his story and tips for beginners.",
      date: "March 3, 2024",
      category: "Success Story"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "Support Our Platform – We Need You!",
      content: "We're building a people-first financial ecosystem. To keep this platform growing and secure, we rely on your support. Donations help us pay for servers, improve features, and support our team. Every coin counts. Donate today and keep the mission alive.",
      date: "March 14, 2024",
      category: "Call for Donations"
    },
    {
      id: 2,
      title: "Congrats to This Week's Top Earners!",
      content: "🎉 Shoutout to this week's top 5 lenders who earned the most from interest and referrals! Keep bidding, keep earning. Want to see your name here next week? Invite your friends and keep your bids active!",
      date: "March 13, 2024",
      category: "Weekly Update"
    },
    {
      id: 3,
      title: "Mobile App Launching Soon!",
      content: "We're working on a mobile app to make lending and borrowing even easier. Get ready for real-time notifications, faster bidding, and on-the-go account management. Stay tuned!",
      date: "March 11, 2024",
      category: "Coming Soon"
    }
  ];

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
              <Link to="/news-blog" className="text-blue-600 font-medium">News & Blog</Link>
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
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50"
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

      {/* Add padding to account for fixed navigation */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Blog</h1>
            <p className="text-xl text-gray-600">Stay updated with the latest news, insights, and announcements</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
              <button
                onClick={() => setActiveTab('news')}
                className={`px-6 py-2 rounded-md text-sm font-medium flex items-center ${
                  activeTab === 'news'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Newspaper className="h-4 w-4 mr-2" />
                News
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`px-6 py-2 rounded-md text-sm font-medium flex items-center ${
                  activeTab === 'blog'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Blog
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`px-6 py-2 rounded-md text-sm font-medium flex items-center ${
                  activeTab === 'announcements'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Megaphone className="h-4 w-4 mr-2" />
                Announcements
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'news' && newsItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{item.date}</span>
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.content}</p>
                  <Link
                    to="#"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}

            {activeTab === 'blog' && blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{post.date}</span>
                  </div>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.content}</p>
                  <Link
                    to="#"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}

            {activeTab === 'announcements' && announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{announcement.date}</span>
                  </div>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mb-3">
                    {announcement.category}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{announcement.title}</h3>
                  <p className="text-gray-600 mb-4">{announcement.content}</p>
                  <Link
                    to="#"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsBlog; 