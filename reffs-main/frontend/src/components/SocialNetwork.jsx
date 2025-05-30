import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MessageCircle, LayoutDashboard, Scale, Handshake, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './navbar';

const SocialNetwork = () => {
  const navigationItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Loan Bidding', icon: <Scale className="h-5 w-5" />, path: '/loan-bidding' },
    { name: 'Loan Matches', icon: <Handshake className="h-5 w-5" />, path: '/loan-matches' },
    { name: 'My Wallet', icon: <Wallet className="h-5 w-5" />, path: '/wallet' },
    { name: 'Support', icon: <MessageCircle className="h-5 w-5" />, path: '/support' },
  ];

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="h-6 w-6" />,
      url: 'https://chat.whatsapp.com/Lcwkabr5VI3C1syYJxqrEC',
      username: 'Join our WhatsApp Group'
    },
    {
      name: 'Telegram',
      icon: <MessageCircle className="h-6 w-6" />,
      url: 'https://t.me/+7Dm4wOE-VVc5N2Nk',
      username: 'Join our Telegram Channel'
    },
  
  ];

  const supportContacts = [
    {
      type: 'WhatsApp',
      icon: <MessageCircle className="h-6 w-6" />,
      number: '+254 103028802',
      username: 'Reffs Support'
    },
   
    {
      type: 'Email',
      icon: <Mail className="h-6 w-6" />,
      number: 'lendhive@gmail.com',
      username: 'Support Email'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect With Us</h1>
            <p className="text-xl text-gray-600">
              Follow us on social media and reach out to our support team
            </p>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-blue-600 mr-4">{social.icon}</div>
                  <div>
                    <h3 className="font-semibold">{social.name}</h3>
                    <p className="text-gray-600">{social.username}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Support Contacts */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Support Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportContacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-blue-600 flex justify-center mb-4">
                    {contact.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{contact.type}</h3>
                  <p className="text-gray-600 mb-1">{contact.number}</p>
                  <p className="text-sm text-gray-500">{contact.username}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Our support team is available 24/7 to assist you with any questions or concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialNetwork; 