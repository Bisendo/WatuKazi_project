import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BarChart3,
  Calendar,
  CreditCard,
  Bell,
  Settings,
  Search,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  FileText,
  LogOut,
  User,
  Phone,
  Mail,
  Cake,
  Info,
  Shield,
  Clock,
  Award,
  AlertCircle,
  RefreshCw,
  DollarSign,
  MessageCircle,
  ThumbsUp,
  Eye
} from 'lucide-react'
import { useAuth } from '../contexts/authContext'
import logo from '../assets/images/watukazi.jpeg'

const ClientDashboard = () => {
  const { logout, user: authUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [userData, setUserData] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // Get authentication token from various sources
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      authUser?.token ||
      authUser?.accessToken

    console.log('🔐 Token search result:', {
      localStorageAuth: localStorage.getItem('authToken') ? 'Found' : 'Not found',
      sessionStorageAuth: sessionStorage.getItem('authToken') ? 'Found' : 'Not found',
      finalToken: token ? 'Found' : 'Not found'
    })

    return token
  }

  // Fetch statistics data from API
  const fetchStatistics = async () => {
    try {
      setStatsLoading(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error('No authentication token found')
      }

      const baseURL = 'https://api.watukazi.com/api/v1'
      const response = await axios.get(`${baseURL}/auth/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      })

      console.log('📊 Statistics API response:', response.data)
      setStatistics(response.data)

    } catch (err) {
      console.error('❌ Error fetching statistics:', err)
      // Don't set error for statistics failure, use default values
    } finally {
      setStatsLoading(false)
    }
  }

  // Fetch complete profile data from API
  const fetchCompleteProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = getAuthToken()

      if (!token) {
        throw new Error('No authentication token found. Please log in again.')
      }

      console.log('🔄 Fetching profile with token:', token.substring(0, 20) + '...')

      const baseURL = 'https://api.watukazi.com/api/v1'

      const response = await axios.get(`${baseURL}/users/profile/complete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      })

      console.log('✅ Profile API response:', response.data)

      if (response.data) {
        setUserData(response.data)
        // Also store in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(response.data))
        localStorage.setItem('lastSuccessfulFetch', new Date().toISOString())

        // Fetch statistics after profile is loaded
        await fetchStatistics()
      }
    } catch (err) {
      console.error('❌ Error fetching complete profile:', err)

      let errorMessage = 'Failed to load profile data'

      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.'
        // Clear invalid token
        localStorage.removeItem('authToken')
        sessionStorage.removeItem('authToken')
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view this data.'
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.'
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (err.message.includes('No authentication token')) {
        errorMessage = err.message
      }

      setError(errorMessage)

      // Fallback to auth context user or stored data
      if (authUser) {
        console.log('🔄 Using user data from auth context')
        setUserData(authUser)
      } else {
        const storedUser = localStorage.getItem('userData')
        if (storedUser) {
          try {
            console.log('🔄 Using cached user data from localStorage')
            const parsedUser = JSON.parse(storedUser)
            setUserData(parsedUser)
            errorMessage += ' (showing cached data)'
            setError(errorMessage)
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError)
          }
        }
      }

      // Try to fetch statistics even if profile fails
      await fetchStatistics()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🚀 ClientDashboard mounted, fetching profile...')
    fetchCompleteProfile()
  }, [retryCount])

  const handleRetry = () => {
    console.log('🔄 Retrying profile fetch...')
    setRetryCount(prev => prev + 1)
  }

  const handleLogout = () => {
    console.log('🔐 Logging out...')
    logout()
    // Optional: redirect to home page
    window.location.href = '/'
  }

  const handleReauthenticate = () => {
    console.log('🔐 Redirecting to login...')
    // Clear all stored tokens and redirect to login
    localStorage.clear()
    sessionStorage.clear()
    logout()
    window.location.href = '/signin'
  }

  // Check if we have any user data (from API, auth context, or localStorage)
  const hasUserData = userData || authUser || localStorage.getItem('userData')

  // Generate user information from available data
  const getUserInfo = () => {
    // Priority: API data > auth context > localStorage data
    const data = userData || authUser || JSON.parse(localStorage.getItem('userData') || '{}')

    console.log('👤 User data for display:', data)

    return {
      userName: `${data?.firstName || ''} ${data?.lastName || ''}`.trim() || 'Guest User',
      userEmail: data?.email || 'No email provided',
      userPhone: data?.phone || 'No phone provided',
      userBio: data?.bio || 'No bio provided',
      userGender: data?.gender || 'Not specified',
      userDob: data?.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'Not specified',
      referralCode: data?.referralCode || 'N/A',
      preferredSubcategories: data?.preferredSubcategories ?
        (typeof data.preferredSubcategories === 'string' ?
          JSON.parse(data.preferredSubcategories) :
          data.preferredSubcategories) :
        [],
      statistics: data?.statistics || {},
      isPhoneVerified: data?.isPhoneVerified || false,
      isEmailVerified: data?.isEmailVerified || false,
      role: data?.role || 'client',
      isActive: data?.isActive !== undefined ? data.isActive : true,
      createdAt: data?.createdAt,
      profilePicture: data?.profilePicture
    }
  }

  const userInfo = getUserInfo()

  // Generate stats from user data and statistics API
  const stats = [
    {
      label: 'Total Bookings',
      value: statistics?.totalBookings?.toString() || userInfo.statistics?.totalBookings?.toString() || '0',
      change: '+0',
      icon: Calendar,
      color: 'blue',
      description: 'All your service bookings'
    },
    {
      label: 'Total Payments',
      value: `$${statistics?.totalPayments?.toString() || userInfo.statistics?.totalPayments?.toString() || '0'}`,
      change: '+0%',
      icon: DollarSign,
      color: 'green',
      description: 'Total amount spent'
    },
    {
      label: 'Messages',
      value: statistics?.totalMessages?.toString() || userInfo.statistics?.totalMessages?.toString() || '0',
      change: '+0',
      icon: MessageCircle,
      color: 'purple',
      description: 'Conversations with providers'
    },
    {
      label: 'Service Providers',
      value: statistics?.totalContacts?.toString() || userInfo.statistics?.totalContacts?.toString() || '0',
      change: '+0',
      icon: Users,
      color: 'orange',
      description: 'Providers you contacted'
    },
    {
      label: 'Reviews',
      value: statistics?.totalReviews?.toString() || userInfo.statistics?.totalReviews?.toString() || '0',
      change: '+0',
      icon: ThumbsUp,
      color: 'red',
      description: 'Your service reviews'
    },
    {
      label: 'Services',
      value: statistics?.totalServices?.toString() || userInfo.statistics?.totalServices?.toString() || '0',
      change: '+0',
      icon: Star,
      color: 'indigo',
      description: 'Services viewed'
    }
  ]

  const projects = [
    { name: 'Website Redesign', provider: 'Creative Agency', progress: 75, status: 'active', budget: '$2,500' },
    { name: 'Mobile App', provider: 'Tech Solutions', progress: 30, status: 'active', budget: '$5,000' },
    { name: 'SEO Optimization', provider: 'Digital Marketing', progress: 100, status: 'completed', budget: '$1,200' }
  ]

  const recentActivities = [
    { action: 'Project completed', project: 'SEO Optimization', time: '2 hours ago' },
    { action: 'New message from', project: 'Creative Agency', time: '5 hours ago' },
    { action: 'Payment received', project: 'Mobile App', time: '1 day ago' }
  ]

  // Show loading state only if we have no data at all
  if (loading && !hasUserData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src={logo}
                alt="ClientPro Logo"
                className="h-8 w-auto sm:h-10 object-contain rounded-full"
              />
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">
WatuKazi              </span>
            </div>


            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - hidden on mobile */}
              <div className="hidden sm:block relative">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40 lg:w-56 text-sm"
                />
              </div>

              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <img
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                  src={
                    userInfo.profilePicture
                      ? userInfo.profilePicture
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
                  }
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
                  }}
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700">{userInfo.userName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2 sm:mr-3 flex-shrink-0" />
                <p className="text-yellow-700 text-xs sm:text-sm">{error}</p>
              </div>
              <div className="flex space-x-2 self-end sm:self-auto">
                {error.includes('Authentication failed') || error.includes('No authentication token') ? (
                  <button
                    onClick={handleReauthenticate}
                    className="bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-yellow-700 whitespace-nowrap"
                  >
                    Log In Again
                  </button>
                ) : (
                  <button
                    onClick={handleRetry}
                    className="bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-yellow-700 flex items-center whitespace-nowrap"
                  >
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {userInfo.userName}!</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Here's what's happening with your projects today.</p>
            </div>
            {(loading || statsLoading) && (
              <div className="flex items-center text-blue-600 text-sm sm:text-base">
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                <span>Updating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.label}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">{stat.description}</p>
                  <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mt-1`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ml-2 flex-shrink-0 ${stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'purple' ? 'bg-purple-100' :
                        stat.color === 'orange' ? 'bg-orange-100' :
                          stat.color === 'red' ? 'bg-red-100' :
                            'bg-indigo-100'
                  }`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                          stat.color === 'orange' ? 'text-orange-600' :
                            stat.color === 'red' ? 'text-red-600' :
                              'text-indigo-600'
                    }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Overview */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Profile Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Personal Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600 flex-shrink-0" />
                    Personal Information
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-xs sm:text-sm">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900 font-medium truncate">{userInfo.userPhone}</span>
                      {userInfo.isPhoneVerified && (
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 ml-2 text-green-500 flex-shrink-0" title="Phone Verified" />
                      )}
                    </div>

                    <div className="flex items-center text-xs sm:text-sm">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900 font-medium truncate">{userInfo.userEmail}</span>
                      {userInfo.isEmailVerified && (
                        <Shield className="h-3 w-3 sm:h-4 sm:w-4 ml-2 text-green-500 flex-shrink-0" title="Email Verified" />
                      )}
                    </div>

                    <div className="flex items-center text-xs sm:text-sm">
                      <Cake className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="ml-2 text-gray-900 font-medium">{userInfo.userDob}</span>
                    </div>

                    <div className="flex items-center text-xs sm:text-sm">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Gender:</span>
                      <span className="ml-2 text-gray-900 font-medium">{userInfo.userGender}</span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600 flex-shrink-0" />
                    Account Information
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-xs sm:text-sm">
                      <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Role:</span>
                      <span className="ml-2 text-gray-900 font-medium capitalize">{userInfo.role}</span>
                    </div>

                    <div className="flex items-center text-xs sm:text-sm">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Member Since:</span>
                      <span className="ml-2 text-gray-900 font-medium">
                        {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center text-xs sm:text-sm">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 font-medium ${userInfo.isActive ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {userInfo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {userInfo.userBio && userInfo.userBio !== 'No bio provided' && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600 flex-shrink-0" />
                    About Me
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{userInfo.userBio}</p>
                </div>
              )}

              {/* Preferred Services */}
              {userInfo.preferredSubcategories.length > 0 && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-600 flex-shrink-0" />
                    Preferred Services
                  </h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {userInfo.preferredSubcategories.map((subcategory, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {subcategory}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Projects</h2>
                <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto">
                  New Project
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2 sm:gap-0">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{project.name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm truncate">{project.provider}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${project.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-gray-600 text-xs sm:text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-2 sm:gap-0">
                      <span className="text-gray-600">Budget: {project.budget}</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-right sm:text-left">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Recent Activity</h2>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 text-xs sm:text-sm truncate">
                        {activity.action} <span className="font-medium">{activity.project}</span>
                      </p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button className="p-2 sm:p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm font-medium">New Project</span>
                </button>
                <button className="p-2 sm:p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm font-medium">Messages</span>
                </button>
                <button className="p-2 sm:p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mx-auto mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm font-medium">Billing</span>
                </button>
                <button className="p-2 sm:p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mx-auto mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm font-medium">Settings</span>
                </button>
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Statistics Summary</h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Total Services:</span>
                  <span className="font-medium">{statistics?.totalServices || userInfo.statistics?.totalServices || 0}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Total Reviews:</span>
                  <span className="font-medium">{statistics?.totalReviews || userInfo.statistics?.totalReviews || 0}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Total Referrals:</span>
                  <span className="font-medium">{statistics?.totalReferrals || userInfo.statistics?.totalReferrals || 0}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Unread Notifications:</span>
                  <span className="font-medium text-red-600">{statistics?.unreadNotifications || userInfo.statistics?.unreadNotifications || 0}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Total Earnings:</span>
                  <span className="font-medium text-green-600">${statistics?.totalEarnings || userInfo.statistics?.totalEarnings || 0}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Average Rating:</span>
                  <span className="font-medium flex items-center">
                    {statistics?.averageRating || userInfo.statistics?.averageRating || 0}
                    <Star className="h-3 w-3 text-yellow-500 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard