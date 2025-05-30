import React from 'react';

const NewsAndBlocks = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to LendHive Kenya
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Empowering Financial Growth Since 2005
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Our Story Block */}
          <div className="bg-indigo-50 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">Our Story</h3>
            <p className="text-gray-700">
              Founded in 2005, LendHive has been at the forefront of revolutionizing peer-to-peer lending. 
              With over 18 years of experience in financial technology, we've helped thousands of individuals 
              achieve their financial goals through our innovative investment platform.
            </p>
          </div>

          {/* Our Impact Block */}
          <div className="bg-green-50 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-green-900 mb-4">Our Impact</h3>
            <p className="text-gray-700">
              To date, LendHive has facilitated over $500 million in successful investments, 
              creating opportunities for both investors and borrowers. Our platform has helped 
              more than 50,000 people build wealth and achieve financial independence through 
              our unique investment model.
            </p>
          </div>

          {/* Kenya Expansion Block */}
          <div className="bg-blue-50 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Kenya Expansion</h3>
            <p className="text-gray-700">
              We're excited to bring our proven investment platform to Kenya, offering the same 
              reliable service that has made us successful globally. Our entry into the Kenyan 
              market represents our commitment to financial inclusion and economic empowerment 
              in East Africa.
            </p>
          </div>

          {/* Why Choose Us Block */}
          <div className="bg-purple-50 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">Why Choose Us</h3>
            <p className="text-gray-700">
              With our 18-year track record, we offer unmatched expertise in peer-to-peer lending. 
              Our platform features advanced security measures, transparent operations, and a 
              user-friendly interface designed to make investing accessible to everyone.
            </p>
          </div>

          {/* Our Mission Block */}
          <div className="bg-yellow-50 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-900 mb-4">Our Mission</h3>
            <p className="text-gray-700">
              We're dedicated to creating a more inclusive financial ecosystem where everyone 
              can participate in wealth creation. Our platform bridges the gap between investors 
              and borrowers, fostering economic growth and financial stability.
            </p>
          </div>

          {/* Future Vision Block */}
          <div className="bg-red-50 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-red-900 mb-4">Future Vision</h3>
            <p className="text-gray-700">
              As we expand into Kenya, we're committed to leveraging our global experience to 
              create opportunities for Kenyan investors and borrowers. Our goal is to become 
              the leading peer-to-peer lending platform in East Africa.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-indigo-600">18+</p>
              <p className="mt-2 text-gray-600">Years of Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">50K+</p>
              <p className="mt-2 text-gray-600">Happy Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">$500M+</p>
              <p className="mt-2 text-gray-600">Total Investments</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-indigo-600">98%</p>
              <p className="mt-2 text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsAndBlocks; 