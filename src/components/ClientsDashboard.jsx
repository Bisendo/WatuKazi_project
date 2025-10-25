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
  Eye,
  MapPin,
  Heart,
  Share2,
  Filter,
  Grid,
  List,
  ChevronRight,
  Plus,
  Download,
  Upload,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Zap
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
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Get authentication token from various sources
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      authUser?.token ||
      authUser?.accessToken

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

      setStatistics(response.data)
    } catch (err) {
      console.error('Error fetching statistics:', err)
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

      const baseURL = 'https://api.watukazi.com/api/v1'
      const response = await axios.get(`${baseURL}/users/profile/complete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      })

      if (response.data) {
        setUserData(response.data)
        localStorage.setItem('userData', JSON.stringify(response.data))
        localStorage.setItem('lastSuccessfulFetch', new Date().toISOString())
        await fetchStatistics()
      }
    } catch (err) {
      console.error('Error fetching complete profile:', err)
      let errorMessage = 'Failed to load profile data'

      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.'
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

      if (authUser) {
        setUserData(authUser)
      } else {
        const storedUser = localStorage.getItem('userData')
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUserData(parsedUser)
            errorMessage += ' (showing cached data)'
            setError(errorMessage)
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError)
          }
        }
      }

      await fetchStatistics()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompleteProfile()
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const handleReauthenticate = () => {
    localStorage.clear()
    sessionStorage.clear()
    logout()
    window.location.href = '/signin'
  }

  // Mock data for services (replace with actual API data)
  const services = [
    {
      id: 1,
      title: 'Professional Web Development',
      provider: 'Tech Solutions Ltd',
      price: 1200,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
      category: 'Technology',
      location: 'Nairobi',
      featured: true,
      status: 'active'
    },
    {
      id: 2,
      title: 'Mobile App Design',
      provider: 'Creative Studio',
      price: 800,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
      category: 'Design',
      location: 'Mombasa',
      featured: false,
      status: 'active'
    },
    {
      id: 3,
      title: 'Digital Marketing Strategy',
      provider: 'Growth Agency',
      price: 1500,
      rating: 4.7,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      category: 'Marketing',
      location: 'Nairobi',
      featured: true,
      status: 'pending'
    },
    {
      id: 4,
      title: 'SEO Optimization Package',
      provider: 'Search Masters',
      price: 600,
      rating: 4.5,
      reviews: 45,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
      category: 'Marketing',
      location: 'Kisumu',
      featured: false,
      status: 'active'
    }
  ]

  const recentTransactions = [
    { id: 1, service: 'Web Development', amount: 1200, date: '2024-01-15', status: 'completed', type: 'payment' },
    { id: 2, service: 'App Design', amount: 800, date: '2024-01-12', status: 'completed', type: 'payment' },
    { id: 3, service: 'Marketing Package', amount: 1500, date: '2024-01-10', status: 'pending', type: 'payment' },
    { id: 4, service: 'SEO Service', amount: 600, date: '2024-01-08', status: 'completed', type: 'payment' }
  ]

  const notifications = [
    { id: 1, title: 'New Message', description: 'You have a new message from Tech Solutions', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment Received', description: 'Your payment of $800 has been processed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Service Update', description: 'Your website development is 50% complete', time: '3 hours ago', unread: false }
  ]

  const hasUserData = userData || authUser || localStorage.getItem('userData')

  const getUserInfo = () => {
    const data = userData || authUser || JSON.parse(localStorage.getItem('userData') || '{}')
    
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
      profilePicture: data?.profilePicture,
      location: data?.location || 'Nairobi, Kenya'
    }
  }

  const userInfo = getUserInfo()

  const stats = [
    {
      label: 'Active Services',
      value: statistics?.activeServices?.toString() || '4',
      change: '+2',
      icon: Zap,
      color: 'green',
      description: 'Currently active services'
    },
    {
      label: 'Total Spent',
      value: `$${statistics?.totalSpent?.toString() || '4,100'}`,
      change: '+12%',
      icon: DollarSign,
      color: 'blue',
      description: 'Total amount spent'
    },
    {
      label: 'Messages',
      value: statistics?.totalMessages?.toString() || '24',
      change: '+5',
      icon: MessageCircle,
      color: 'purple',
      description: 'Unread messages'
    },
    {
      label: 'Service Providers',
      value: statistics?.totalProviders?.toString() || '8',
      change: '+2',
      icon: Users,
      color: 'orange',
      description: 'Active providers'
    }
  ]

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
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="WatuKazi Logo"
                  className="h-8 w-auto sm:h-10 object-contain rounded-full"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">WatuKazi</span>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="hidden md:flex space-x-6">
                {['Overview', 'Services', 'Messages', 'Transactions', 'Reviews'].map((item) => (
                  <button
                    key={item}
                    className={`font-medium text-sm transition-colors ${
                      activeTab === item.toLowerCase() 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab(item.toLowerCase())}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden lg:block relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search services, providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-sm"
                />
              </div>

              {/* Action Buttons */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="hidden sm:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Add Service</span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full border-2 border-gray-200"
                  src={
                    userInfo.profilePicture
                      ? userInfo.profilePicture
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
                  }
                  alt="Profile"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userInfo.userName}</p>
                  <p className="text-xs text-gray-500">{userInfo.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
                <p className="text-yellow-700 text-sm">{error}</p>
              </div>
              <div className="flex space-x-2">
                {error.includes('Authentication failed') || error.includes('No authentication token') ? (
                  <button
                    onClick={handleReauthenticate}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                  >
                    Log In Again
                  </button>
                ) : (
                  <button
                    onClick={handleRetry}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section with Quick Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {userInfo.userName}!</h1>
              <p className="text-gray-600 mt-2">Here's your activity summary and recent updates.</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {userInfo.location}
              </div>
              {(loading || statsLoading) && (
                <div className="flex items-center text-blue-600 text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  <span>Updating...</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} from last week</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                        stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                    <stat.icon className={`h-6 w-6 ${stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                      }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Services Section - Jiji Style */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Your Services</h2>
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Services Grid */}
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
                {services.map((service) => (
                  <div key={service.id} className={`bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}>
                    <div className={`${viewMode === 'list' ? 'flex-shrink-0 w-32' : 'w-full h-48'}`}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className={`${viewMode === 'list' ? 'w-32 h-32 object-cover rounded-l-lg' : 'w-full h-48 object-cover rounded-t-lg'}`}
                      />
                    </div>
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">{service.title}</h3>
                        {service.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Featured</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs mb-2">{service.provider}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{service.rating}</span>
                          <span className="text-gray-500 text-xs">({service.reviews})</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">${service.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3" />
                          <span>{service.location}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full ${
                          service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 border border-gray-300 rounded-lg">
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'payment' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <CreditCard className={`h-5 w-5 ${
                          transaction.type === 'payment' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{transaction.service}</p>
                        <p className="text-gray-500 text-xs">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900">${transaction.amount}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  className="h-16 w-16 rounded-full border-4 border-blue-100"
                  src={
                    userInfo.profilePicture
                      ? userInfo.profilePicture
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
                  }
                  alt="Profile"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{userInfo.userName}</h3>
                  <p className="text-gray-600 text-sm">{userInfo.userEmail}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {userInfo.isEmailVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500" title="Email Verified" />
                    )}
                    {userInfo.isPhoneVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500" title="Phone Verified" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${userInfo.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {userInfo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Referral Code</span>
                  <span className="font-medium text-blue-600">{userInfo.referralCode}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Edit Profile
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {notifications.filter(n => n.unread).length} New
                </span>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${
                    notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs mb-2">{notification.description}</p>
                    <p className="text-gray-400 text-xs">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors group">
                  <MessageSquare className="h-5 w-5 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Messages</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors group">
                  <CreditCard className="h-5 w-5 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Payments</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors group">
                  <Settings className="h-5 w-5 text-gray-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Settings</span>
                </button>
                <button className="p-3 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors group">
                  <Download className="h-5 w-5 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard