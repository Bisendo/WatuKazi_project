// src/components/ServiceRequests.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  FaCalendar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaSpinner,
  FaExclamationTriangle,
  FaEye,
  FaComments,
  FaUser,
  FaRedo,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // API base URL
  const API_BASE_URL = 'https://api.watukazi.com/api/v1';

  // Get authentication token
  const getAuthToken = () => {
    const token = localStorage.getItem('token') || 
           localStorage.getItem('authToken') ||
           sessionStorage.getItem('token') ||
           sessionStorage.getItem('authToken');
    
    console.log('🔑 Auth Token:', token ? 'Present' : 'Missing');
    return token;
  };

  // Enhanced function to get current user ID - more robust
  const getCurrentUserId = () => {
    try {
      // First, check if we're in a mobile app environment (Cordova/Capacitor)
      if (window.cordova || window.Capacitor) {
        console.log('📱 Mobile environment detected');
      }

      // Check all possible storage locations and formats
      const storageChecks = [
        // localStorage keys
        { key: 'user', source: 'localStorage' },
        { key: 'userData', source: 'localStorage' },
        { key: 'currentUser', source: 'localStorage' },
        { key: 'authUser', source: 'localStorage' },
        { key: 'userProfile', source: 'localStorage' },
        
        // sessionStorage keys
        { key: 'user', source: 'sessionStorage' },
        { key: 'userData', source: 'sessionStorage' },
        { key: 'currentUser', source: 'sessionStorage' },
      ];

      for (const check of storageChecks) {
        let storedData;
        if (check.source === 'localStorage') {
          storedData = localStorage.getItem(check.key);
        } else {
          storedData = sessionStorage.getItem(check.key);
        }

        if (storedData) {
          try {
            const userData = JSON.parse(storedData);
            console.log(`📁 Found user data in ${check.source}.${check.key}:`, userData);
            
            // Try all possible ID field names
            const userId = userData.id || 
                          userData.userId || 
                          userData._id || 
                          userData.userID || 
                          userData.uid ||
                          userData.sub ||
                          userData.clientId;

            if (userId) {
              console.log('✅ User ID found:', userId, 'from', check.source, check.key);
              return userId;
            }
          } catch (parseError) {
            console.warn(`⚠️ Could not parse ${check.source}.${check.key}:`, parseError);
          }
        }
      }

      // Check if there's a JWT token that might contain user info
      const token = getAuthToken();
      if (token && token.includes('.')) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('🔓 Token payload:', payload);
          const userIdFromToken = payload.id || payload.userId || payload.sub || payload.clientId;
          if (userIdFromToken) {
            console.log('✅ User ID from token:', userIdFromToken);
            return userIdFromToken;
          }
        } catch (tokenError) {
          console.log('🔓 Token is not JWT format or cannot be decoded');
        }
      }

      console.warn('❌ No user ID found in any storage location');
      return null;

    } catch (error) {
      console.error('🚨 Error getting user ID:', error);
      return null;
    }
  };

  // Enhanced debug function
  const debugUserInfo = () => {
    const userId = getCurrentUserId();
    const token = getAuthToken();
    
    const debugData = {
      timestamp: new Date().toISOString(),
      userId: userId,
      hasToken: !!token,
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
      userDataFromStorage: {}
    };

    // Check all storage for user data
    const storageKeys = ['user', 'userData', 'currentUser', 'authUser', 'userProfile'];
    
    storageKeys.forEach(key => {
      const localData = localStorage.getItem(key);
      const sessionData = sessionStorage.getItem(key);
      
      if (localData) {
        try {
          debugData.userDataFromStorage[`localStorage.${key}`] = JSON.parse(localData);
        } catch (e) {
          debugData.userDataFromStorage[`localStorage.${key}`] = localData;
        }
      }
      
      if (sessionData) {
        try {
          debugData.userDataFromStorage[`sessionStorage.${key}`] = JSON.parse(sessionData);
        } catch (e) {
          debugData.userDataFromStorage[`sessionStorage.${key}`] = sessionData;
        }
      }
    });

    setDebugInfo(debugData);
    console.log('🔍 Debug User Info:', debugData);
    
    return debugData;
  };

  // Fetch service requests with better user identification
  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authToken = getAuthToken();
      
      if (!authToken) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      console.log('🚀 Fetching service requests...');
      console.log('📡 API URL:', API_BASE_URL);
      
      const response = await axios.get(
        `${API_BASE_URL}/services`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          params: {
            type: 'client_request',
            limit: 50,
            page: 1
          },
          timeout: 10000
        }
      );

      console.log('✅ Service requests response:', response.data);
      
      let servicesToDisplay = [];
      
      if (response.data && response.data.services && Array.isArray(response.data.services)) {
        // Get user ID after API call to ensure we have the latest
        const userId = getCurrentUserId();
        setCurrentUserId(userId);
        
        if (userId) {
          // Filter services by current user ID - check multiple fields
          const userServices = response.data.services.filter(service => {
            const isUserService = 
              service.userId === userId || 
              service.clientId === userId ||
              service.createdBy === userId ||
              service.ownerId === userId ||
              (service.user && service.user.id === userId) ||
              (service.client && service.client.id === userId);

            console.log(`🔍 Service ${service.id}:`, {
              title: service.title,
              serviceUserId: service.userId,
              serviceClientId: service.clientId,
              serviceCreatedBy: service.createdBy,
              currentUserId: userId,
              belongsToUser: isUserService
            });
            
            return isUserService;
          });
          
          servicesToDisplay = userServices;
          console.log('✅ Filtered user service requests:', userServices.length);
        } else {
          // If no user ID, we can't filter - show message instead of all requests
          console.warn('⚠️ No user ID found, cannot filter services');
          servicesToDisplay = [];
        }
        
        setServiceRequests(servicesToDisplay);
      } else {
        setServiceRequests([]);
        console.log('ℹ️ No services found or invalid response structure');
      }

    } catch (err) {
      console.error('❌ Error fetching service requests:', err);
      
      let errorMessage = 'Failed to load service requests. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to view service requests.';
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check if the API is running.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single service request details
  const fetchServiceDetails = async (serviceId) => {
    try {
      const authToken = getAuthToken();
      
      const response = await axios.get(
        `${API_BASE_URL}/services/${serviceId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      setSelectedRequest(response.data);
      setShowDetailsModal(true);
      
    } catch (err) {
      console.error('Error fetching service details:', err);
      setError('Failed to load service details.');
    }
  };

  // Contact provider function (replaces delete)
  const contactProvider = (service) => {
    // You can implement contact logic here
    // For now, we'll just show an alert
    alert(`Contact functionality for: ${service.title}\n\nThis would open a chat or call interface.`);
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  // Format currency
  const formatCurrency = (amount, currency = 'TSh') => {
    if (!amount || amount === 0) return 'Negotiable';
    return `${currency} ${amount?.toLocaleString() || '0'}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your service requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 mt-1">
            {serviceRequests.length > 0 
              ? `Showing ${serviceRequests.length} service request${serviceRequests.length !== 1 ? 's' : ''}`
              : 'No service requests found'
            }
          </p>
          {!currentUserId && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ User identification issue - please check debug information
            </p>
          )}
        </div>
        <div className="flex space-x-3">
         
        
        </div>
      </div>

      {/* Debug Info Panel */}
      {debugInfo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Debug Information</h4>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>User ID:</strong> {debugInfo.userId || 'Not found'}</p>
            <p><strong>Device:</strong> {debugInfo.isMobile ? 'Mobile' : 'Desktop'}</p>
            <p><strong>Has Token:</strong> {debugInfo.hasToken ? 'Yes' : 'No'}</p>
            <p><strong>Local Storage Keys:</strong> {debugInfo.localStorageKeys.join(', ') || 'Empty'}</p>
            <button
              onClick={() => setDebugInfo(null)}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
            >
              Close Debug
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Service Requests</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <div className="flex space-x-3 mt-3">
                <button
                  onClick={fetchServiceRequests}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={debugUserInfo}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Debug Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Requests Grid */}
      {!error && serviceRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaComments className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {currentUserId ? "No Service Requests Found" : "Unable to Load Your Requests"}
          </h3>
          <p className="text-gray-600 mb-4">
            {currentUserId 
              ? "You haven't created any service requests yet."
              : "We couldn't identify your account. Please check the debug information."
            }
          </p>
          {!currentUserId && (
            <button
              onClick={debugUserInfo}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Check Debug Information
            </button>
          )}
        </div>
      ) : (
        !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {serviceRequests.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Service Image */}
                <div className="h-48 bg-gray-200 relative">
                  {service.images && service.images.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <FaComments className="w-12 h-12 text-blue-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status || 'Active'}
                    </span>
                  </div>

                  {/* Urgency Badge */}
                  {service.clientRequest?.urgency && (
                    <div className="absolute top-4 right-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(service.clientRequest.urgency)}`}>
                        {service.clientRequest.urgency}
                      </span>
                    </div>
                  )}
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Service Details */}
                  <div className="space-y-3 mb-4">
                    {/* Budget */}
                    <div className="flex items-center text-sm text-gray-600">
                      <FaDollarSign className="w-4 h-4 mr-2 text-green-600" />
                      <span className="font-medium">
                        {formatCurrency(service.clientRequest?.budget)}
                      </span>
                      <span className="ml-2 text-gray-500 capitalize">
                        ({service.clientRequest?.budgetType || 'fixed'})
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2 text-red-600" />
                      <span className="line-clamp-1">{service.location || 'Location not specified'}</span>
                    </div>

                    {/* Preferred Date */}
                    {service.clientRequest?.preferredDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendar className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{formatDate(service.clientRequest.preferredDate)}</span>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Created: {formatDate(service.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Removed Delete, Added Contact */}
                  <div className="flex space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => fetchServiceDetails(service.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <FaEye className="w-3 h-3 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => contactProvider(service)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <FaPhone className="w-3 h-3 mr-1" />
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Service Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedRequest.title}</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedRequest.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Budget</h4>
                    <p className="text-gray-600">
                      {formatCurrency(selectedRequest.clientRequest?.budget)}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => contactProvider(selectedRequest)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <FaEnvelope className="w-4 h-4 mr-2" />
                    Contact Provider
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;