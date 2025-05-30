import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import { countries } from '../../utils/countries';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    country: '',
    referral_code: new URLSearchParams(location.search).get('ref') || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [referrerName, setReferrerName] = useState('');

  useEffect(() => {
    // Get referral code from URL parameters
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    
    if (refCode) {
      // Verify the referral code
      authService.verifyReferralCode(refCode)
        .then(response => {
          setFormData(prev => ({
            ...prev,
            referral_code: refCode
          }));
          setReferrerName(response.referrer_name);
        })
        .catch(error => {
          console.error('Invalid referral code:', error);
          setErrors({
            referral_code: 'Invalid referral code'
          });
        });
    }
  }, [location]);

  const handleChange = (e) => {
    // If the field is referral_code and it's pre-filled from URL, don't allow changes
    if (e.target.name === 'referral_code' && new URLSearchParams(location.search).get('ref')) {
      return;
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^07\d{8}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be in format 07XXXXXXXX';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Remove confirmPassword before sending to API
      const { confirm_password, ...userData } = formData;
      
      console.log('Sending registration data:', userData);
      const response = await authService.register(userData);
      console.log('Registration response:', response);
      
      if (response.access) {
        // Store the token
        localStorage.setItem('token', response.access);
        // Redirect to dashboard
        navigate('/');
      } else {
        setErrors({
          submit: 'Registration successful but no access token received'
        });
      }
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.data) {
        // Handle field-specific errors from the API
        const apiErrors = error.response.data;
        const formattedErrors = {};
        
        // Handle general error message
        if (apiErrors.error) {
          setErrors({
            submit: apiErrors.error
          });
          return;
        }
        
        Object.keys(apiErrors).forEach(key => {
          // Map backend field names to frontend field names
          const fieldMap = {
            'phone_number': 'phone_number',
            'password1': 'password',
            'password2': 'confirm_password'
          };
          const frontendField = fieldMap[key] || key;
          
          if (Array.isArray(apiErrors[key])) {
            formattedErrors[frontendField] = apiErrors[key][0];
          } else {
            formattedErrors[frontendField] = apiErrors[key];
          }
        });
        
        if (Object.keys(formattedErrors).length > 0) {
          setErrors(formattedErrors);
        } else {
          setErrors({
            submit: 'Registration failed. Please check your input and try again.'
          });
        }
      } else if (error.message) {
        setErrors({
          submit: error.message
        });
      } else {
        setErrors({
          submit: 'Registration failed. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join LendHive and start your lending journey
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                    errors.phone_number ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="07XXXXXXXX"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                    errors.country ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                    errors.confirm_password ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Confirm your password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
                {errors.confirm_password && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
                )}
              </div>

              <div>
                <label htmlFor="referral_code" className="block text-sm font-medium text-gray-700">
                  Referral Code (Optional)
                </label>
                <input
                  id="referral_code"
                  name="referral_code"
                  type="text"
                  className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                    errors.referral_code ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    new URLSearchParams(location.search).get('ref') ? 'bg-gray-100' : ''
                  }`}
                  placeholder="Enter referral code if you have one"
                  value={formData.referral_code}
                  onChange={handleChange}
                  readOnly={!!new URLSearchParams(location.search).get('ref')}
                />
                {errors.referral_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.referral_code}</p>
                )}
                {referrerName && (
                  <p className="mt-1 text-sm text-green-600">
                    Referred by: {referrerName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 