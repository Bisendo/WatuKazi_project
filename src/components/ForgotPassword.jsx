  // components/ForgotPassword.jsx
  import { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { sendPasswordResetEmail } from '../services/Authservices';

  const ForgotPassword = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [identifierType, setIdentifierType] = useState('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
      // Remove all non-digit characters except + at the beginning
      const cleanedPhone = phone.replace(/(?!^\+)\D/g, '');
      
      // International phone format: + followed by 10-15 digits
      const phoneRegex = /^\+\d{10,15}$/;
      return phoneRegex.test(cleanedPhone);
    };

    const formatPhoneForAPI = (phone) => {
      // Ensure phone starts with + and has only digits after
      let cleaned = phone.replace(/(?!^\+)\D/g, '');
      
      // If it doesn't start with +, add it (assuming default country code)
      if (!cleaned.startsWith('+')) {
        // You might want to set a default country code here
        // For example, +1 for US, +44 for UK, etc.
        // For now, we'll require users to input with country code
        return '+' + cleaned;
      }
      
      return cleaned;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      // Validate input based on type
      if (!identifier.trim()) {
        setError('Please enter your email or phone number');
        setIsLoading(false);
        return;
      }

      let formattedIdentifier = identifier;

      if (identifierType === 'email') {
        if (!validateEmail(identifier)) {
          setError('Please enter a valid email address (e.g., user@example.com)');
          setIsLoading(false);
          return;
        }
      } else {
        // For phone, format it properly for the API
        formattedIdentifier = formatPhoneForAPI(identifier);
        
        if (!validatePhone(formattedIdentifier)) {
          setError('Please enter a valid international phone number starting with + (e.g., +1234567890)');
          setIsLoading(false);
          return;
        }
      }

      console.log('Submitting identifier:', formattedIdentifier);

      try {
        await sendPasswordResetEmail(formattedIdentifier);
        setSuccess(true);
        // Optionally navigate to reset password page with identifier
        // navigate('/reset-password', { state: { identifier: formattedIdentifier } });
      } catch (err) {
        setError(err.message || 'Failed to send OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleIdentifierTypeChange = (type) => {
      setIdentifierType(type);
      setIdentifier('');
      setError('');
    };

    const getPlaceholder = () => {
      return identifierType === 'email' 
        ? 'Enter your email address' 
        : 'Enter your phone number (e.g., +1234567890)';
    };

    const getInputType = () => {
      return identifierType === 'email' ? 'email' : 'tel';
    };

    const handlePhoneInput = (e) => {
      const value = e.target.value;
      
      // Allow only numbers and + at the beginning
      if (identifierType === 'phone') {
        // Remove any characters that aren't digits or +
        const cleaned = value.replace(/[^\d+]/g, '');
        
        // Ensure only one + at the beginning
        if (cleaned.startsWith('+')) {
          const afterPlus = cleaned.slice(1).replace(/\D/g, '');
          setIdentifier('+' + afterPlus);
        } else {
          setIdentifier(cleaned.replace(/\D/g, ''));
        }
      } else {
        setIdentifier(value);
      }
    };

    if (success) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Check your {identifierType}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We've sent a password reset OTP to <strong>{identifier}</strong>
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Please check your {identifierType} and use the OTP to reset your password.
                </p>
                <div className="mt-6 space-y-3">
                  <Link
                    to="/reset-password"
                    state={{ identifier }}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Enter OTP Now
                  </Link>
                  <Link
                    to="/Signin"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Reset your password
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Enter your email or phone number and we'll send you an OTP to reset your password.
              </p>
            </div>

            {/* Identifier Type Selector */}
            <div className="mt-6">
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => handleIdentifierTypeChange('email')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                    identifierType === 'email'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => handleIdentifierTypeChange('phone')}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border ${
                    identifierType === 'phone'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Phone
                </button>
              </div>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  {identifierType === 'email' ? 'Email address' : 'Phone number'}
                </label>
                <div className="mt-1">
                  <input
                    id="identifier"
                    name="identifier"
                    type={getInputType()}
                    autoComplete={identifierType === 'email' ? 'email' : 'tel'}
                    required
                    value={identifier}
                    onChange={handlePhoneInput}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={getPlaceholder()}
                  />
                </div>
                {identifierType === 'phone' && (
                  <p className="mt-1 text-xs text-gray-500">
                    Must start with + followed by country code and number (e.g., +1234567890)
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </>
                  ) : (
                    `Send OTP via ${identifierType}`
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/Signin"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default ForgotPassword;