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
  Camera,
  Edit,
  Trash2,
  Image as ImageIcon,
  Tag,
  Clock4,
  DollarSign as DollarSignIcon,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/authContext';
import logo from '../assets/images/watukazi.jpeg';

const ClientDashboard = () => {
  const { logout, user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Common subcategories as fallback
  const commonSubcategories = [
    { id: 'web-development', name: 'Web Development' },
    { id: 'mobile-apps', name: 'Mobile App Development' },
    { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'digital-marketing', name: 'Digital Marketing' },
    { id: 'content-writing', name: 'Content Writing' },
    { id: 'seo', name: 'SEO Services' },
    { id: 'social-media', name: 'Social Media Management' },
    { id: 'video-editing', name: 'Video Editing' },
    { id: 'photography', name: 'Photography' },
    { id: 'consulting', name: 'Business Consulting' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    type: "client_request",
    title: "",
    description: "",
    subcategoryId: "",
    location: "",
    latitude: "",
    longitude: "",
    images: [],
    tags: [],
    status: "active",
    featured: false,
    clientRequest: {
      budget: "",
      budgetType: "fixed",
      urgency: "medium",
      preferredDate: "",
      deadline: "",
      maxApplications: 10,
      expiresAt: ""
    }
  });

  const [formErrors, setFormErrors] = useState({});
  const [tagInput, setTagInput] = useState("");

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      authUser?.token ||
      authUser?.accessToken;
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseURL = 'https://api.watukazi.com/api/v1';
      
      // Try multiple endpoints
      const endpoints = [
        '/users/profile/complete',
        '/users/profile',
        '/auth/profile'
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
          console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
          continue;
        }
      }

      if (profileResponse) {
        setUserData(profileResponse);
        localStorage.setItem('userData', JSON.stringify(profileResponse));
      } else {
        throw new Error('No profile data available');
      }

    } catch (err) {
      console.error('Error fetching profile:', err);
      
      let errorMessage = 'Failed to load profile data';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);

      // Fallback to auth user or stored data
      if (authUser) {
        setUserData(authUser);
      } else {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          try {
            setUserData(JSON.parse(storedUser));
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories with multiple endpoint attempts and fallback
  const fetchSubcategories = async () => {
    try {
      setSubcategoriesLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for subcategories');
        setSubcategories(commonSubcategories);
        return;
      }

      const baseURL = 'https://api.watukazi.com/api/v1';
      
      // Try multiple possible endpoints for subcategories
      const endpoints = [
        '/subcategories',
        '/categories/subcategories',
        '/services/subcategories',
        '/categories'
      ];

      let subcategoriesData = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying subcategories endpoint: ${endpoint}`);
          const response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            timeout: 8000
          });
          
          if (response.data && (Array.isArray(response.data) || response.data.data)) {
            subcategoriesData = Array.isArray(response.data) ? response.data : response.data.data;
            console.log(`Success with endpoint: ${endpoint}`, subcategoriesData);
            break;
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
          continue;
        }
      }

      if (subcategoriesData && Array.isArray(subcategoriesData) && subcategoriesData.length > 0) {
        // Transform the data to ensure we have id and name properties
        const transformedSubcategories = subcategoriesData.map(item => ({
          id: item.id || item._id || item.subcategoryId,
          name: item.name || item.title || item.subcategoryName || 'Unnamed Category'
        })).filter(item => item.id && item.name);
        
        setSubcategories(transformedSubcategories);
      } else {
        // Use fallback common subcategories
        console.warn('No subcategories found from API, using fallback');
        setSubcategories(commonSubcategories);
      }

    } catch (error) {
      console.error('Error fetching subcategories:', error);
      console.warn('Using fallback subcategories due to error');
      setSubcategories(commonSubcategories);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  // Fetch ALL services and filter client requests
  const fetchServiceRequests = async () => {
    try {
      setRequestsLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for fetching service requests');
        return;
      }

      const baseURL = 'https://api.watukazi.com/api/v1';
      
      // Try multiple endpoints to get ALL services
      const endpoints = [
        '/services/my-services',
        '/services/user-services'
      ];

      let servicesData = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying services endpoint: ${endpoint}`);
          const response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            timeout: 8000
          });
          
          if (response.data) {
            // Handle different response structures
            servicesData = Array.isArray(response.data) 
              ? response.data 
              : response.data.data || response.data.services || [];
            console.log(`Success with endpoint: ${endpoint}`, servicesData);
            break;
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
          continue;
        }
      }

      if (servicesData && Array.isArray(servicesData)) {
        // Filter to show only client requests (type === 'client_request')
        const clientRequests = servicesData.filter(service => 
          service.type === 'client_request' || service.clientRequest
        );
        
        // Normalize the data to ensure consistent structure
        const normalizedRequests = clientRequests.map(request => ({
          ...request,
          // Ensure tags is always an array
          tags: Array.isArray(request.tags) 
            ? request.tags 
            : (request.tags ? [request.tags] : []),
          // Ensure we have proper title and description
          title: request.title || request.clientRequest?.title || 'Untitled Request',
          description: request.description || request.clientRequest?.description || 'No description provided',
          // Ensure clientRequest object exists
          clientRequest: request.clientRequest || {}
        }));
        
        console.log('Filtered and normalized client requests:', normalizedRequests);
        setServiceRequests(normalizedRequests);
      } else {
        console.log('No services data found or empty array');
        setServiceRequests([]);
      }

    } catch (error) {
      console.error('Error fetching service requests:', error);
      setServiceRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch individual service by ID
  const fetchServiceById = async (serviceId) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`https://api.watukazi.com/api/v1/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 8000
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching service ${serviceId}:`, error);
      throw error;
    }
  };

  // Delete service request
  const deleteServiceRequest = async (serviceId) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(`https://api.watukazi.com/api/v1/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.data) {
        // Remove from local state
        setServiceRequests(prev => prev.filter(request => request.id !== serviceId));
        setError('Service request deleted successfully!');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error(`Error deleting service request ${serviceId}:`, error);
      setError('Failed to delete service request. Please try again.');
    }
  };

  // Validation functions
  const validateLatitude = (lat) => {
    if (!lat) return true; // Optional field
    const num = parseFloat(lat);
    return !isNaN(num) && num >= -90 && num <= 90;
  };

  const validateLongitude = (lng) => {
    if (!lng) return true; // Optional field
    const num = parseFloat(lng);
    return !isNaN(num) && num >= -180 && num <= 180;
  };

  const validateImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.subcategoryId) {
      errors.subcategoryId = 'Please select a subcategory';
    }

    if (!formData.clientRequest.budget || parseFloat(formData.clientRequest.budget) <= 0) {
      errors.budget = 'Valid budget amount is required';
    }

    // Validate latitude
    if (formData.latitude && !validateLatitude(formData.latitude)) {
      errors.latitude = 'Latitude must be between -90 and 90';
    }

    // Validate longitude
    if (formData.longitude && !validateLongitude(formData.longitude)) {
      errors.longitude = 'Longitude must be between -180 and 180';
    }

    // Validate images (must be valid URLs)
    const invalidImages = formData.images.filter(url => !validateImageUrl(url));
    if (invalidImages.length > 0) {
      errors.images = 'All images must be valid URLs';
    }

    // Validate budgetType
    const validBudgetTypes = ['fixed', 'flexible', 'negotiable'];
    if (!validBudgetTypes.includes(formData.clientRequest.budgetType)) {
      errors.budgetType = 'Budget type must be fixed, flexible, or negotiable';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (showCreateRequest) {
      fetchSubcategories();
    }
  }, [showCreateRequest]);

  useEffect(() => {
    if (activeTab === 'my-requests') {
      fetchServiceRequests();
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getUserInfo = () => {
    const data = userData || authUser || JSON.parse(localStorage.getItem('userData') || '{}');
    
    return {
      userName: `${data?.firstName || ''} ${data?.lastName || ''}`.trim() || 'Guest User',
      userEmail: data?.email || 'No email provided',
      profilePicture: data?.profilePicture,
      role: data?.role || 'client'
    };
  };

  const userInfo = getUserInfo();

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'my-applications', label: 'My Applications', icon: FileText },
    { id: 'applications-to-me', label: 'Applications to Me', icon: Users },
    { id: 'my-requests', label: 'My Requests', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name.startsWith('clientRequest.')) {
      const clientRequestField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        clientRequest: {
          ...prev.clientRequest,
          [clientRequestField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  // Handle image upload - use placeholder URLs for demo
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create valid placeholder URLs for demo
    const placeholderUrls = files.map((file, index) => {
      const timestamp = Date.now();
      return `https://example.com/uploaded-images/service-request-${timestamp}-${index}.jpg`;
    });
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...placeholderUrls]
    }));

    // Show info message
    setError('Note: In production, images would be uploaded to cloud storage. Currently using demo URLs.');
    setTimeout(() => setError(null), 5000);
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Allow empty values or valid numbers
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    setFormLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      
      // Prepare the payload according to your API specification
      const payload = {
        type: "client_request",
        title: formData.title,
        description: formData.description,
        subcategoryId: formData.subcategoryId,
        location: formData.location,
        images: formData.images, // Now contains valid URLs
        tags: formData.tags,
        status: "active",
        featured: false,
        clientRequest: {
          budget: parseFloat(formData.clientRequest.budget),
          budgetType: formData.clientRequest.budgetType,
          urgency: formData.clientRequest.urgency,
          maxApplications: parseInt(formData.clientRequest.maxApplications) || 10,
        }
      };

      // Only include coordinates if they are provided and valid
      if (formData.latitude && validateLatitude(formData.latitude)) {
        payload.latitude = parseFloat(formData.latitude);
      }
      if (formData.longitude && validateLongitude(formData.longitude)) {
        payload.longitude = parseFloat(formData.longitude);
      }

      // Only include dates if they are provided
      if (formData.clientRequest.preferredDate) {
        payload.clientRequest.preferredDate = formData.clientRequest.preferredDate;
      }
      if (formData.clientRequest.deadline) {
        payload.clientRequest.deadline = formData.clientRequest.deadline;
      }
      if (formData.clientRequest.expiresAt) {
        payload.clientRequest.expiresAt = formData.clientRequest.expiresAt;
      }

      console.log('Submitting service request:', payload);

      const response = await axios.post('https://api.watukazi.com/api/v1/services', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        console.log('Service request created successfully:', response.data);
        setShowCreateRequest(false);
        // Reset form
        setFormData({
          type: "client_request",
          title: "",
          description: "",
          subcategoryId: "",
          location: "",
          latitude: "",
          longitude: "",
          images: [],
          tags: [],
          status: "active",
          featured: false,
          clientRequest: {
            budget: "",
            budgetType: "fixed",
            urgency: "medium",
            preferredDate: "",
            deadline: "",
            maxApplications: 10,
            expiresAt: ""
          }
        });
        setFormErrors({});
        setError(null);
        
        // Refresh the requests list
        fetchServiceRequests();
        
        // Show success message
        setError('Service request created successfully!');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error creating service request:', error);
      let errorMessage = 'Failed to create service request. ';
      
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = error.response.data.errors;
        if (Array.isArray(serverErrors)) {
          errorMessage += serverErrors.map(err => err.msg || err.message).join(', ');
        } else {
          errorMessage += JSON.stringify(serverErrors);
        }
      } else if (error.response?.status === 401) {
        errorMessage += 'Authentication failed. Please log in again.';
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get status badge color
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle view service details
  const handleViewDetails = async (serviceId) => {
    try {
      const service = await fetchServiceById(serviceId);
      console.log('Service details:', service);
      // You can implement a modal or redirect to show detailed view
      setError(`Viewing details for: ${service.title || service.clientRequest?.title}`);
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      setError('Failed to load service details');
    }
  };

  // Safe tags rendering function
  const renderTags = (tags) => {
    if (!tags) return null;
    
    // Ensure tags is always an array
    const tagsArray = Array.isArray(tags) ? tags : [tags];
    
    // Filter out any null, undefined, or empty values
    const validTags = tagsArray.filter(tag => tag != null && tag !== '');
    
    if (validTags.length === 0) return null;
    
    return (
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {validTags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {typeof tag === 'string' ? tag : JSON.stringify(tag)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (loading && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="WatuKazi Logo"
              className="h-8 w-8 object-contain rounded-full"
            />
            <span className="text-xl font-bold text-gray-900">WatuKazi</span>
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="WatuKazi Logo"
              className="h-8 w-8 object-contain rounded-full"
            />
            <span className="text-xl font-bold text-gray-900">WatuKazi</span>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              className="h-10 w-10 rounded-full border-2 border-gray-200"
              src={
                userInfo.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
              }
              alt="Profile"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`;
              }}
            />
            <div>
              <p className="font-medium text-gray-900 text-sm">{userInfo.userName}</p>
              <p className="text-xs text-gray-500">Manage your bookings and profile</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 lg:px-8 py-4">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                {activeTab === 'overview' && 'Your dashboard overview and statistics'}
                {activeTab === 'my-applications' && 'Applications I made to others\' services'}
                {activeTab === 'applications-to-me' && 'Applications from providers to my services'}
                {activeTab === 'my-requests' && 'Manage your service requests'}
                {activeTab === 'messages' && 'Your conversations and messages'}
                {activeTab === 'billing' && 'Billing history and payment methods'}
                {activeTab === 'notifications' && 'Your notifications and alerts'}
                {activeTab === 'profile' && 'Manage your profile settings'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 lg:flex-none">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64 text-sm"
                />
              </div>

              <button className="hidden lg:block relative p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className={`border-l-4 p-4 mx-4 lg:mx-8 mt-4 ${
            error.includes('successfully') 
              ? 'bg-green-50 border-green-400' 
              : 'bg-yellow-50 border-yellow-400'
          }`}>
            <div className="flex items-center">
              {error.includes('successfully') ? (
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
              )}
              <p className={`text-sm ${
                error.includes('successfully') ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {error}
              </p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto hover:opacity-70"
              >
                <X className={`h-4 w-4 ${
                  error.includes('successfully') ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Active Requests</p>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {serviceRequests.filter(req => req.status === 'active').length}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Applications Sent</p>
                      <p className="text-2xl font-bold text-green-900 mt-1">0</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Messages</p>
                      <p className="text-2xl font-bold text-purple-900 mt-1">0</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Pending</p>
                      <p className="text-2xl font-bold text-orange-900 mt-1">
                        {serviceRequests.filter(req => req.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {serviceRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          request.status === 'active' ? 'bg-blue-600' : 
                          request.status === 'pending' ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}></div>
                        <span className="text-gray-700 text-sm sm:text-base">
                          {request.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                  ))}
                  {serviceRequests.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-requests' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">My Service Requests</h2>
                <button
                  onClick={() => setShowCreateRequest(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Request</span>
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                {requestsLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Loading your service requests...</p>
                  </div>
                ) : serviceRequests.length > 0 ? (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <div key={request.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {request.title}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status || 'Active'}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {request.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Budget:</span>
                                <p className="text-gray-600">
                                  {formatCurrency(request.clientRequest?.budget || request.budget)}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Budget Type:</span>
                                <p className="text-gray-600 capitalize">
                                  {request.clientRequest?.budgetType || request.budgetType || 'Not specified'}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Location:</span>
                                <p className="text-gray-600">{request.location || 'Not specified'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Created:</span>
                                <p className="text-gray-600">{formatDate(request.createdAt)}</p>
                              </div>
                            </div>
                            
                            {/* Safe tags rendering */}
                            {renderTags(request.tags)}
                          </div>
                          
                          <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                            <button 
                              onClick={() => handleViewDetails(request.id)}
                              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this service request?')) {
                                  deleteServiceRequest(request.id);
                                }
                              }}
                              className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests</h3>
                    <p className="text-gray-600 mb-4">Create your first service request to get started.</p>
                    <button 
                      onClick={() => setShowCreateRequest(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs remain the same */}
          {activeTab === 'my-applications' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Applications</h2>
              <p className="text-gray-600 mb-4">Applications I made to others' services</p>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600">When you apply to services, they will appear here.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications-to-me' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Applications to Me</h2>
              <p className="text-gray-600 mb-4">Applications from providers to my services</p>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600">When providers apply to your services, they will appear here.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Messages</h2>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Your conversations will appear here.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Billing</h2>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
                  <p className="text-gray-600">Your payment history will appear here.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="max-w-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <img
                      className="h-20 w-20 rounded-full border-2 border-gray-200"
                      src={
                        userInfo.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.userName)}&background=3b82f6&color=fff`
                      }
                      alt="Profile"
                    />
                    <div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue={userInfo.userName.split(' ')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue={userInfo.userName.split(' ')[1] || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={userInfo.userEmail}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Request Modal */}
      {showCreateRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Service Request</h2>
              <button
                onClick={() => setShowCreateRequest(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Need a professional plumber for bathroom installation"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your service requirements in detail..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Category *
                  </label>
                  <select
                    name="subcategoryId"
                    value={formData.subcategoryId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.subcategoryId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.subcategoryId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.subcategoryId}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Nairobi, Kenya"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (KES) *
                  </label>
                  <input
                    type="number"
                    name="clientRequest.budget"
                    value={formData.clientRequest.budget}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.budget ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="5000"
                    min="0"
                    step="100"
                  />
                  {formErrors.budget && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.budget}</p>
                  )}
                </div>

                {/* Budget Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Type *
                  </label>
                  <select
                    name="clientRequest.budgetType"
                    value={formData.clientRequest.budgetType}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.budgetType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="flexible">Flexible</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                  {formErrors.budgetType && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.budgetType}</p>
                  )}
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency
                  </label>
                  <select
                    name="clientRequest.urgency"
                    value={formData.clientRequest.urgency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Max Applications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Applications
                  </label>
                  <input
                    type="number"
                    name="clientRequest.maxApplications"
                    value={formData.clientRequest.maxApplications}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="50"
                  />
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    name="clientRequest.preferredDate"
                    value={formData.clientRequest.preferredDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="clientRequest.deadline"
                    value={formData.clientRequest.deadline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Coordinates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude (Optional)
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleCoordinateChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.latitude ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., -1.2921"
                  />
                  {formErrors.latitude && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.latitude}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude (Optional)
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleCoordinateChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.longitude ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 36.8219"
                  />
                  {formErrors.longitude && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.longitude}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-2 hover:text-blue-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (Demo - URLs will be generated)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Camera className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Click to upload images</span>
                  </button>
                  {formErrors.images && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.images}</p>
                  )}
                  {formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateRequest(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {formLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                  <span>{formLoading ? 'Creating...' : 'Create Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;