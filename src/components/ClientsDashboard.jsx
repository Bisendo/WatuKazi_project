
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
  Zap,
  Camera
} from 'lucide-react';
import { useAuth } from '../contexts/authContext';
import logo from '../assets/images/watukazi.jpeg';

const ClientDashboard = () => {
  const { logout, user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const modalRef = useRef(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target) && !fileInputRef.current?.contains(event.target)) {
        setShowAvatarModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      authUser?.token ||
      authUser?.accessToken;
  };

  // Enhanced avatar URL fix - handle multiple scenarios
  const fixAvatarUrl = (avatarUrl, avatarPath) => {
    if (!avatarUrl && !avatarPath) return null;
    
    // If we have a full URL but it's localhost, try to construct proper URL
    if (avatarUrl && avatarUrl.includes('localhost')) {
      const pathMatch = avatarUrl.match(/\/api\/v1\/uploads\/avatars\/(.+)/);
      if (pathMatch) {
        return `https://api.watukazi.com/api/v1/uploads/avatars/${pathMatch[1]}`;
      }
    }
    
    // If we have just a path (avatars/filename.jpg)
    if (avatarPath && !avatarPath.includes('http')) {
      // Remove 'avatars/' prefix if it exists and add proper path
      const filename = avatarPath.replace('avatars/', '');
      return `https://api.watukazi.com/api/v1/uploads/avatars/${filename}`;
    }
    
    // If it's already a proper URL, return as is
    if (avatarUrl && avatarUrl.includes('api.watukazi.com')) {
      return avatarUrl;
    }
    
    // Fallback - return the original URL
    return avatarUrl;
  };

  // Enhanced compress image function
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.6) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }
              
              const compressedFile = new File([blob], `avatar_${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)}MB, Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
              
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  // Upload avatar function with better URL handling
  const uploadAvatar = async (file) => {
    try {
      setAvatarLoading(true);
      setAvatarError(null);
      setAvatarUploadProgress(0);

      const token = getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');

      // Compress image to ensure it's under 1MB
      let fileToUpload = file;
      if (file.size > 1 * 1024 * 1024) {
        try {
          fileToUpload = await compressImage(file, 600, 600, 0.6);
          console.log('Compressed file size:', (fileToUpload.size / 1024 / 1024).toFixed(2), 'MB');
        } catch (compressError) {
          console.warn('Compression failed:', compressError);
          throw new Error('Failed to compress image. Please select a smaller image.');
        }
      }

      // Final size check - ensure under 1MB
      if (fileToUpload.size > 1 * 1024 * 1024) {
        throw new Error('Image is too large. Please select an image smaller than 1MB.');
      }

      // Create FormData with proper field name
      const formData = new FormData();
      formData.append('avatar', fileToUpload);
      formData.append('userId', authUser?.id || '');
      formData.append('uploadType', 'profile_avatar');

      const baseURL = 'https://api.watukazi.com/api/v1';
      
      console.log('Uploading avatar...', {
        size: fileToUpload.size,
        type: fileToUpload.type,
        name: fileToUpload.name
      });

      const response = await axios.post(`${baseURL}/users/avatar`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 45000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setAvatarUploadProgress(percentCompleted);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      });

      console.log('Upload response:', response.data);
      setAvatarUploadProgress(100);

      // Update user data with new avatar - FIX URL HERE
      if (response.data) {
        const avatarUrl = response.data.avatarUrl;
        const avatarPath = response.data.avatar;
        
        // Use the enhanced URL fix function
        const fixedAvatarUrl = fixAvatarUrl(avatarUrl, avatarPath);

        if (fixedAvatarUrl) {
          const updatedUserData = {
            ...userData,
            profilePicture: fixedAvatarUrl
          };
          setUserData(updatedUserData);
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
          
          // Test if the image loads successfully
          await testImageLoad(fixedAvatarUrl);
          
          // Show success message
          setTimeout(() => {
            setAvatarUploadProgress(0);
            setAvatarLoading(false);
            setShowAvatarModal(false);
            setAvatarError(null);
          }, 1500);

          return response.data;
        } else {
          throw new Error('No valid avatar URL returned from server');
        }
      }

    } catch (err) {
      console.error('Error uploading avatar:', err);
      
      let errorMessage = 'Failed to upload avatar';

      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Invalid file format or missing file. Please use JPEG or PNG.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 413) {
        errorMessage = 'File too large. Server rejected the upload. Please select an image smaller than 1MB.';
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error') || err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Upload took too long. Please try again with a smaller image.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'Server configuration issue. Please contact support.';
      } else if (err.message.includes('too large') || err.message.includes('compress')) {
        errorMessage = err.message;
      } else if (err.message.includes('image load')) {
        errorMessage = 'Avatar uploaded but cannot be displayed. The file may not be accessible.';
      }

      setAvatarError(errorMessage);
      setAvatarUploadProgress(0);
      setAvatarLoading(false);
      throw err;
    }
  };

  // Test if image loads successfully
  const testImageLoad = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = url;
      
      // Timeout after 5 seconds
      setTimeout(() => reject(new Error('Image load timeout')), 5000);
    });
  };

  // File validation
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
      setAvatarError('No file selected');
      return false;
    }

    if (!validTypes.includes(file.type)) {
      setAvatarError('Please select a JPEG or PNG image file');
      return false;
    }

    if (file.size > maxSize) {
      setAvatarError('Image size should be less than 5MB. It will be compressed automatically.');
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setAvatarError(null);
    setAvatarUploadProgress(0);

    try {
      const isValid = validateFile(file);
      if (!isValid) return;

      await uploadAvatar(file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      event.target.value = '';
    }
  };

  // Open avatar upload modal
  const handleChangeAvatar = () => {
    setShowAvatarModal(true);
    setShowProfileMenu(false);
  };

  // Trigger file input from modal
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const token = getAuthToken();

      if (!token) {
        console.warn('No authentication token found for statistics');
        return;
      }

      const baseURL = 'https://api.watukazi.com/api/v1';
      
      const endpoints = [
        '/users/stats',
        '/client/stats',
        '/dashboard/stats'
      ];

      let statsResponse = null;
      
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 8000
          });
          
          if (response.data) {
            statsResponse = response.data;
            break;
          }
        } catch (endpointError) {
          continue;
        }
      }

      if (statsResponse) {
        setStatistics(statsResponse);
      } else {
        setStatistics({
          activeServices: 4,
          totalSpent: 4100,
          totalMessages: 24,
          completedProjects: 8,
          pendingRequests: 2
        });
      }
    } catch (err) {
      setStatistics({
        activeServices: 4,
        totalSpent: 4100,
        totalMessages: 24,
        completedProjects: 8,
        pendingRequests: 2
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch complete profile with enhanced avatar URL handling
  const fetchCompleteProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const baseURL = 'https://api.watukazi.com/api/v1';
      
      const endpoints = [
        '/users/profile/complete',
        '/users/profile',
        '/auth/profile',
        '/client/profile'
      ];

      let profileResponse = null;
      
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000
          });
          
          if (response.data) {
            profileResponse = response.data;
            break;
          }
        } catch (endpointError) {
          continue;
        }
      }

      if (profileResponse) {
        // Enhanced avatar URL fixing
        if (profileResponse.profilePicture) {
          profileResponse.profilePicture = fixAvatarUrl(profileResponse.profilePicture, profileResponse.avatar);
        } else if (profileResponse.avatar) {
          profileResponse.profilePicture = fixAvatarUrl(null, profileResponse.avatar);
        }
        
        setUserData(profileResponse);
        localStorage.setItem('userData', JSON.stringify(profileResponse));
        localStorage.setItem('lastSuccessfulFetch', new Date().toISOString());
      } else {
        throw new Error('No profile endpoints available');
      }

      await fetchStatistics();
    } catch (err) {
      console.error('Error fetching complete profile:', err);
      let errorMessage = 'Failed to load profile data';

      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view this data.';
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message.includes('No authentication token')) {
        errorMessage = err.message;
      } else if (err.message.includes('No profile endpoints')) {
        errorMessage = 'Profile service temporarily unavailable. Using cached data.';
      }

      setError(errorMessage);

      if (authUser) {
        setUserData(authUser);
      } else {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Fix avatar URLs in cached data too
            if (parsedUser.profilePicture) {
              parsedUser.profilePicture = fixAvatarUrl(parsedUser.profilePicture, parsedUser.avatar);
            }
            setUserData(parsedUser);
            errorMessage += ' (showing cached data)';
            setError(errorMessage);
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
      }

      await fetchStatistics();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleteProfile();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleReauthenticate = () => {
    localStorage.clear();
    sessionStorage.clear();
    logout();
    window.location.href = '/signin';
  };

  // Mock data
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
    }
  ];

  const notifications = [
    { id: 1, title: 'New Message', description: 'You have a new message from Tech Solutions', time: '2 min ago', unread: true },
    { id: 2, title: 'Payment Received', description: 'Your payment of $800 has been processed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Service Update', description: 'Your website development is 50% complete', time: '3 hours ago', unread: false }
  ];

  const hasUserData = userData || authUser || localStorage.getItem('userData');

  const getUserInfo = () => {
    const data = userData || authUser || JSON.parse(localStorage.getItem('userData') || '{}');
    
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
    };
  };

  const userInfo = getUserInfo();

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
      value: `$${(statistics?.totalSpent || 4100).toLocaleString()}`,
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
  ];

  if (loading && !hasUserData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
      />

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Change Profile Picture</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={avatarLoading}
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {avatarError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{avatarError}</p>
              </div>
            )}

            <div className="text-center mb-6">
              <div className="mx-auto mb-4 relative">
                <img
                  className="h-24 w-24 rounded-full border-4 border-blue-100 mx-auto"
                  src={
                    userInfo.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
                  }
                  alt="Current avatar"
                  onError={(e) => {
                    // If image fails to load, fallback to default avatar
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`;
                  }}
                />
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {avatarLoading && avatarUploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{avatarUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${avatarUploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <p className="text-gray-600 text-sm mb-4">
                Upload a new profile picture. Images will be automatically compressed.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSelectFile}
                disabled={avatarLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Camera className="h-5 w-5 mr-2" />
                {avatarLoading ? 'Uploading...' : 'Choose Image'}
              </button>
              
              <button
                onClick={() => setShowAvatarModal(false)}
                disabled={avatarLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> If avatar doesn't display immediately, it may take a moment to process.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
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
              
              <nav className="hidden md:flex space-x-6">
                {['Overview', 'Services', 'Messages', 'Request', 'Subscription'].map((item) => (
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

              <button className="relative p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="hidden sm:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Add Service</span>
              </button>

              {/* User Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 cursor-pointer focus:outline-none"
                >
                  <div className="relative">
                    <img
                      className="h-8 w-8 rounded-full border-2 border-gray-200"
                      src={
                        userInfo.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
                      }
                      alt="Profile"
                      onError={(e) => {
                        // Fallback to default avatar if image fails to load
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`;
                      }}
                    />
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{userInfo.userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userInfo.role}</p>
                  </div>
                </button>
                
                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleChangeAvatar}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
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
        {/* Welcome Section */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} from last week</p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <stat.icon className={`h-6 w-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
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
            {/* Services Section */}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img
                    className="h-16 w-16 rounded-full border-4 border-blue-100"
                    src={
                      userInfo.profilePicture ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
                    }
                    alt="Profile"
                    onError={(e) => {
                      // Fallback to default avatar if image fails to load
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`;
                    }}
                  />
                  {avatarLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={handleChangeAvatar}
                    disabled={avatarLoading}
                    className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title="Change avatar"
                  >
                    <Camera className="h-3 w-3 text-white" />
                  </button>
                </div>
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
              
              {avatarLoading && avatarUploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading...</span>
                    <span>{avatarUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${avatarUploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

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

              <button 
                className="w-full mt-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleChangeAvatar}
                disabled={avatarLoading}
              >
                {avatarLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    {avatarUploadProgress > 0 ? `Uploading... ${avatarUploadProgress}%` : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Change Avatar
                  </>
                )}
              </button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> Avatar upload is working, but display may take a moment due to server processing.
                </p>
              </div>
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
  );
};

export default ClientDashboard;