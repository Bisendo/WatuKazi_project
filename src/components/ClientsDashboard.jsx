import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendar, 
  FaClock, 
  FaStar, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaComment, 
  FaCreditCard, 
  FaUser, 
  FaCog, 
  FaBell, 
  FaExclamationTriangle, 
  FaSpinner, 
  FaSearch, 
  FaEllipsisV, 
  FaVolumeMute, 
  FaVolumeUp, 
  FaPlus, 
  FaCheck, 
  FaTrash, 
  FaDollarSign, 
  FaBox,
  FaEnvelope,
  FaHome,
  FaBriefcase,
  FaInfoCircle
} from 'react-icons/fa';
import { useLanguage } from '../components/LanguageContext';
import { useAuth } from '../contexts/authContext';
import Navbar from '../components/Navibar';
import CreateService from '../components/CreateService';
import ServicePreferencesModal from '../components/ServicePreferenceModel';
import PreferencesAlert from '../components/PreferenceAlert';
import ServiceRequests from '../components/ServiceRequest';
const ClientDashboard = () => {
  const { t } = useLanguage();
  const { user, accessToken, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get active tab from URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/overview')) return 'overview';
    if (path.includes('/my-applications')) return 'my-applications';
    if (path.includes('/applications-to-me')) return 'applications-to-me';
    if (path.includes('/my-requests')) return 'my-requests';
    if (path.includes('/messages')) return 'messages';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/profile')) return 'profile';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateServiceForm, setShowCreateServiceForm] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [serviceApplications, setServiceApplications] = useState(null);
  const [userServices, setUserServices] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Enhanced user data extraction from localStorage and user object
  const getUserDisplayName = () => {
    // First try to get from localStorage (most reliable after login)
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("📋 User data from localStorage:", parsedUser);
        
        // Try different possible user data structures from localStorage
        return parsedUser.firstName || 
               parsedUser.fullName || 
               parsedUser.name || 
               parsedUser.businessName || 
               parsedUser.username || 
               parsedUser.email?.split('@')[0] || 
               "Client";
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }

    // Fallback to user object from auth context
    if (user) {
      console.log("📋 User data from auth context:", user);
      return user.firstName || 
             user.fullName || 
             user.name || 
             user.businessName || 
             user.username || 
             user.email?.split('@')[0] || 
             "Client";
    }

    // Final fallback
    return "Client";
  };

  const userDisplayName = getUserDisplayName();

  // Function to get complete user data
  const getCompleteUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    return user || {};
  };

  const completeUserData = getCompleteUserData();

  // Function to display user info in inspect/console
  const displayUserInfoToConsole = () => {
    console.log("🔍 === USER INFORMATION FOR INSPECT ===");
    console.log("📍 User Display Name:", userDisplayName);
    console.log("👤 Complete User Data:", completeUserData);
    console.log("🔑 Access Token:", accessToken ? "✅ Present" : "❌ Missing");
    console.log("🏪 LocalStorage User:", localStorage.getItem('user'));
    console.log("📱 Auth Context User:", user);
    console.log("🔐 Is Authenticated:", isAuthenticated);
    console.log("=====================================");

    // Display username specifically
    if (completeUserData.username) {
      console.log("🎯 USERNAME FOUND:", completeUserData.username);
    } else {
      console.warn("⚠️  USERNAME NOT FOUND - Available fields:", Object.keys(completeUserData));
    }
  };

  // Fetch user profile data from API
  const fetchUserProfile = async () => {
    if (!accessToken) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || '{{base_url}}'}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("👤 User profile from API:", userData);
        setUserProfile(userData);
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Display updated user info to console
        displayUserInfoToConsole();
      } else {
        console.error('Failed to fetch user profile:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockStats = [
    { label: 'Total Applications', value: '12', icon: FaCalendar, color: 'bg-blue-500' },
    { label: 'Pending Applications', value: '3', icon: FaClock, color: 'bg-green-500' },
    { label: 'Completed Services', value: '8', icon: FaCreditCard, color: 'bg-purple-500' },
    { label: 'Active Requests', value: '2', icon: FaStar, color: 'bg-orange-500' }
  ];

  const mockApplications = [
    {
      id: '1',
      service: 'Professional House Cleaning',
      provider: 'Maria Mwangi',
      date: '2024-01-15',
      time: '09:00',
      status: 'confirmed',
      price: 2500,
      currency: 'KSh',
      workLocation: 'Nairobi West',
      estimatedDuration: 120,
      message: 'Need deep cleaning for 3-bedroom apartment'
    },
    {
      id: '2',
      service: 'Plumbing Repair',
      provider: 'John Kamau',
      date: '2024-01-18',
      time: '14:00',
      status: 'pending',
      price: 1500,
      currency: 'KSh',
      workLocation: 'Kilimani',
      estimatedDuration: 60,
      message: 'Kitchen sink leakage repair'
    }
  ];

  const mockNotifications = [
    {
      id: '1',
      title: 'New Application',
      body: 'Maria applied for your cleaning service request',
      type: 'new_application',
      read: false,
      createdAt: new Date().toISOString(),
      priority: 'high'
    },
    {
      id: '2',
      title: 'Booking Confirmed',
      body: 'Your plumbing service has been confirmed',
      type: 'booking_confirmed',
      read: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      priority: 'medium'
    }
  ];

  const mockConversations = [
    {
      otherUserId: '1',
      user: { fullName: 'Maria Mwangi' },
      lastMessage: {
        content: 'Hello, I can help with your cleaning needs',
        createdAt: new Date().toISOString(),
        senderId: '1'
      },
      unreadCount: 2,
      isMuted: false
    },
    {
      otherUserId: '2',
      user: { fullName: 'John Kamau' },
      lastMessage: {
        content: 'I will arrive at 2 PM tomorrow',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        senderId: '2'
      },
      unreadCount: 0,
      isMuted: true
    }
  ];

  // Sync active tab with URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Enhanced authentication check and data loading
  useEffect(() => {
    console.log("🔐 ClientDashboard - Auth status:", { 
      isAuthenticated, 
      user, 
      accessToken,
      localStorageUser: localStorage.getItem('user')
    });
    
    if (!isAuthenticated || !user) {
      console.log("⚠️ No authenticated user, redirecting to login");
      navigate('/signin', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    console.log("✅ User authenticated:", userDisplayName);
    
    // Display user info to console/inspect on component mount
    displayUserInfoToConsole();
    
    // Fetch user profile data
    fetchUserProfile();

    // Load other dashboard data
    const loadDashboardData = async () => {
      try {
        // Simulate API calls for other data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setServiceApplications({ data: mockApplications });
        setUserServices({ clientRequests: [] });
        setNotifications(mockNotifications);
        setConversations(mockConversations);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error loading dashboard data:', err);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, user, navigate, location, accessToken]);

  // Add a button to manually refresh user info in console
  const refreshUserInfo = () => {
    console.clear(); // Clear console for better visibility
    displayUserInfoToConsole();
    alert('User information refreshed! Check the browser console (F12 → Console)');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'accepted':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleConversationClick = (otherUserId) => {
    navigate(`/messages/chat/${otherUserId}`);
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading your applications...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Welcome Section with User Info */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {userDisplayName}! 👋</h2>
              <p className="text-blue-100 mt-1">
                {completeUserData.email ? `Logged in as: ${completeUserData.email}` : 'Here\'s what\'s happening with your services today'}
              </p>
              {completeUserData.username && (
                <p className="text-blue-100 text-sm mt-1">
                  Username: {completeUserData.username}
                </p>
              )}
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaUser className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <p className="text-sm text-gray-600 mt-1">Your recent service applications</p>
          </div>
          <div className="divide-y divide-gray-200">
            {mockApplications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaCalendar className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{application.service}</h4>
                    <p className="text-sm text-gray-600">Provider: {application.provider}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-1" />
                        {new Date(application.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="w-4 h-4 mr-1" />
                        {application.time}
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                        {application.workLocation}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {application.currency} {application.price.toLocaleString()}
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMyApplications = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{userDisplayName}'s Applications</h3>
          <p className="text-sm text-gray-600 mt-1">Applications I made to service providers</p>
        </div>
        <div className="divide-y divide-gray-200">
          {mockApplications.map((application) => (
            <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaCalendar className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{application.service}</h4>
                    <p className="text-sm text-gray-600 mb-2">Provider: {application.provider}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendar className="w-4 h-4 mr-1" />
                        {new Date(application.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="w-4 h-4 mr-1" />
                        {application.time}
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                        {application.workLocation}
                      </div>
                    </div>
                    {application.message && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{application.message}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {application.currency} {application.price.toLocaleString()}
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                  <div className="flex space-x-2 mt-3">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                      View Details
                    </button>
                    {application.status === 'completed' && (
                      <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                        Rate Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

const renderMyRequests = () => {
  if (showCreateServiceForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Service Request</h2>
            <p className="text-gray-600 mt-1">Post a new service request</p>
          </div>
          <button
            onClick={() => setShowCreateServiceForm(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm">
          <CreateService onSuccess={() => {
            setShowCreateServiceForm(false);
            // You can add a refresh mechanism here if needed
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{userDisplayName}'s Service Requests</h2>
          <p className="text-gray-600 mt-1">Manage your service requests and applications</p>
        </div>
        <button 
          onClick={() => setShowCreateServiceForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Create Request
        </button>
      </div>

      {/* Use the new ServiceRequests component */}
      <ServiceRequests />
    </div>
  );
};

  const renderMessages = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
            <p className="text-gray-600 mt-1">Connect with your service providers</p>
          </div>
          <button
            onClick={() => setShowCreateServiceForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Create Request
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.otherUserId}
                  onClick={() => handleConversationClick(conversation.otherUserId)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="w-6 h-6 text-blue-600" />
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {conversation.user.fullName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {conversation.isMuted && (
                            <FaVolumeMute className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-500">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-sm truncate ${
                          conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                        }`}>
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        {conversation.isMuted ? (
                          <FaVolumeMute className="w-4 h-4" />
                        ) : (
                          <FaVolumeUp className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        <FaEllipsisV className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateServiceForm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Create Request
                </button>
                <button
                  onClick={() => navigate('/dashboard/client/overview')}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaHome className="w-4 h-4 mr-2" />
                  Dashboard Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-600 mt-1">Stay updated with your latest activities</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          {mockNotifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600">You'll see your notifications here when they arrive</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <FaBell className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <span className="text-sm text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {notification.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const userData = getCompleteUserData();
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <FaUser className="w-10 h-10 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-900">{userDisplayName}</h4>
              <p className="text-gray-600">{userData?.email || 'user@example.com'}</p>
              {userData?.username && (
                <p className="text-gray-600 text-sm">Username: {userData.username}</p>
              )}
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                Verified Client
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={userDisplayName}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue={userData?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                defaultValue={userData?.username || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                placeholder="+254 712 345 678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="Nairobi, Kenya"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowPreferencesModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <FaCog className="w-4 h-4 mr-2" />
              Service Preferences
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Show loading while checking authentication
  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userDisplayName={userDisplayName} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userDisplayName}!
              </h1>
              <p className="text-gray-600 mt-2">Manage your service requests and applications</p>
              {completeUserData.username && (
                <p className="text-gray-500 text-sm mt-1">
                  Logged in as: {completeUserData.username}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Service Preferences Alert */}
        <PreferencesAlert />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FaCalendar },
                { id: 'my-applications', label: 'My Applications', icon: FaClock },
                { id: 'applications-to-me', label: 'Applications to Me', icon: FaStar },
                { id: 'my-requests', label: 'My Requests', icon: FaComment },
                { id: 'messages', label: 'Messages', icon: FaEnvelope },
                { id: 'notifications', label: 'Notifications', icon: FaBell },
                { id: 'profile', label: 'Profile', icon: FaUser }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate(`/client/dashboard/${tab.id}`)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'my-applications' && renderMyApplications()}
          {activeTab === 'applications-to-me' && renderMyApplications()}
          {activeTab === 'my-requests' && renderMyRequests()}
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'profile' && renderProfile()}
        </motion.div>
      </div>

      {/* Service Preferences Modal */}
      <ServicePreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onSuccess={() => {
          console.log('Service preferences updated successfully');
        }}
      />

      {/* Hidden debug info that's always logged to console */}
      <script type="text/javascript">
        {`
          // Auto-display user info when component loads
          setTimeout(() => {
            console.log('🚀 ClientDashboard mounted successfully!');
            console.log('📝 To view user information:');
            console.log('   1. Press F12 to open Developer Tools');
            console.log('   2. Click on the "Console" tab');
            console.log('   3. Look for "USER INFORMATION FOR INSPECT" section');
            console.log('   4. Or click the "Debug User Info" button in the dashboard');
          }, 1000);
        `}
      </script>
    </div>
  );
};

export default ClientDashboard;