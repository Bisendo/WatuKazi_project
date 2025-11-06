import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';
import {
  ArrowLeft,
  Star,
  Heart,
  Clock,
  Verified,
  Calendar,
  MessageCircle,
  Phone,
  Share2,
  Flag,
  Eye,
} from 'lucide-react';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaBuilding, 
  FaMoneyBillWave,
  FaTimes
} from 'react-icons/fa';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated, user, loading: authLoading, API_BASE_URL } = useAuth();
  
  const [service, setService] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [similarServices, setSimilarServices] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    workLocation: "",
    workDescription: "",
    urgency: "medium",
    preferredDate: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Translation dictionary
  const translations = {
    en: {
      backToServices: "Back to Services",
      contactSeller: "Contact Seller",
      viewDetails: "View Details",
      verifiedSeller: "Verified Seller",
      delivery: "Delivery",
      days: "days",
      rating: "Rating",
      reviews: "reviews",
      negotiable: "Negotiable",
      description: "Description",
      sellerInfo: "Seller Information",
      contactOptions: "Contact Options",
      shareService: "Share Service",
      similarServices: "Similar Services",
      whatIncluded: "What's Included",
      online: "Online",
      available: "Available",
      limited: "Limited Spots",
      serviceNotFound: "Service Not Found",
      serviceNotFoundDesc: "The service you're looking for doesn't exist.",
      tryAgain: "Try Again",
      errorLoading: "Error Loading Service",
      fixedPrice: "Fixed Price",
      budget: "Budget",
      applyNow: "Apply Now",
      submitApplication: "Submit Application",
      workLocation: "Work Location",
      workDescription: "Work Description",
      urgency: "Urgency",
      preferredDate: "Preferred Date",
      low: "Low",
      medium: "Medium",
      high: "High",
      cancel: "Cancel",
      pleaseLogin: "Please login to apply for this service",
      loginRequired: "Login Required",
      sessionExpired: "Your session has expired. Please login again.",
      welcome: "Welcome"
    },
    sw: {
      backToServices: "Rudi kwenye Huduma",
      contactSeller: "Wasiliana na Muuzaji",
      viewDetails: "Angalia Maelezo",
      verifiedSeller: "Muuzaji Aliyethibitishwa",
      delivery: "Uwasilishaji",
      days: "siku",
      rating: "Ukadiriaji",
      reviews: "maoni",
      negotiable: "Inaweza kubishaniwa",
      description: "Maelezo",
      sellerInfo: "Maelezo ya Muuzaji",
      contactOptions: "Chaguzi za Mawasiliano",
      shareService: "Sambaza Huduma",
      similarServices: "Huduma Zinazofanana",
      whatIncluded: "Yaliyomo",
      online: "Mtandaoni",
      available: "Inapatikana",
      limited: "Nafasi Chache",
      serviceNotFound: "Huduma Haipatikani",
      serviceNotFoundDesc: "Huduma unayotafuta haipo.",
      tryAgain: "Jaribu Tena",
      errorLoading: "Hitilafu ya Kupakia Huduma",
      fixedPrice: "Bei Maalum",
      budget: "Bajeti",
      applyNow: "Ombi Sasa",
      submitApplication: "Wasilisha Ombi",
      workLocation: "Eneo la Kazi",
      workDescription: "Maelezo ya Kazi",
      urgency: "Haraka",
      preferredDate: "Tarehe Unayopendelea",
      low: "Chini",
      medium: "Wastani",
      high: "Juu",
      cancel: "Ghairi",
      pleaseLogin: "Tafadhali ingia kutumia huduma hii",
      loginRequired: "Inahitaji Kuingia",
      sessionExpired: "Muda wako umeisha. Tafadhali ingia tena.",
      welcome: "Karibu"
    }
  };

  const t = translations[language];

  // Get token from all possible storage locations
  const getToken = () => {
    return localStorage.getItem('authToken') || 
           sessionStorage.getItem('authToken') ||
           localStorage.getItem('token') ||
           sessionStorage.getItem('token');
  };

  // Safe JSON parsing function
  const safeJsonParse = (str, fallback = []) => {
    if (!str) return fallback;
    try {
      if (Array.isArray(str)) return str;
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.warn('JSON parsing error:', error, 'String:', str);
      return fallback;
    }
  };

  // Format currency
  const formatPrice = (price, currency = 'USD') => {
    if (currency === 'TSH') {
      return `TSh ${price?.toLocaleString() || '0'}`;
    }
    return `$${price?.toLocaleString() || '0'}`;
  };

  // Get default image if no images available
  const getServiceImage = (images) => {
    if (images && images.length > 0 && images[0]) {
      return images[0];
    }
    return "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=500&fit=crop";
  };

  // Check if response is HTML (error page)
  const isHtmlResponse = (data) => {
    return typeof data === 'string' && data.trim().startsWith('<!doctype html>');
  };

  // Create mock service data for fallback
  const createMockService = (serviceId) => {
    const mockServices = {
      'eb4ddbe2-0737-417a-b06a-f7a9ac66c1e7': {
        id: 'eb4ddbe2-0737-417a-b06a-f7a9ac66c1e7',
        title: 'Professional Web Development Service',
        description: 'Expert web development services using modern technologies like React, Node.js, and MongoDB. I create responsive, fast, and SEO-friendly websites tailored to your business needs. With over 5 years of experience, I deliver high-quality solutions that drive results.',
        price: 1500,
        originalPrice: 1800,
        category: 'web-development',
        location: 'Dar es Salaam, Tanzania',
        rating: 4.8,
        reviews: 127,
        deliveryTime: 14,
        seller: {
          name: 'Tech Solutions Ltd',
          verified: true,
          rating: 4.9,
          joined: '2023',
          online: true,
          completedProjects: 89,
          responseRate: 98,
          description: 'Professional web development agency with 5+ years experience in creating modern web applications and websites.'
        },
        images: [
          'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=500&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop'
        ],
        tags: ['Web Development', 'React', 'Node.js', 'Responsive Design', 'SEO'],
        featured: true,
        negotiable: true,
        createdAt: '2024-01-15T10:30:00Z',
        views: 2450,
        type: 'provider_service',
        currency: 'USD',
        budgetType: 'negotiable',
        whatsIncluded: [
          "Professional Service",
          "Quality Guarantee",
          "Timely Delivery",
          "Customer Support"
        ]
      }
    };

    return mockServices[serviceId] || mockServices['eb4ddbe2-0737-417a-b06a-f7a9ac66c1e7'];
  };

  // Fetch service details from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching service data for ID:", id);
        
        // Try to fetch from API first
        try {
          const response = await axios.get(`${API_BASE_URL}/services`, {
            timeout: 5000,
            validateStatus: (status) => status < 500
          });

          console.log("📦 Services API response:", response.data);

          // Check if response is HTML (error page)
          if (isHtmlResponse(response.data)) {
            throw new Error('API returned HTML instead of JSON data');
          }

          if (response.data && response.data.services) {
            const allServices = response.data.services.map(apiService => {
              const images = safeJsonParse(apiService.images);
              const tags = safeJsonParse(apiService.tags);

              const sellerName = apiService.creator?.businessName ||
                (apiService.creator?.firstName && apiService.creator?.lastName
                  ? `${apiService.creator.firstName} ${apiService.creator.lastName}`
                  : 'Unknown Seller');

              return {
                id: apiService.id,
                title: apiService.title || 'Untitled Service',
                description: apiService.description || 'No description available',
                price: apiService.budget || 0,
                originalPrice: apiService.budget ? Math.round(apiService.budget * 1.2) : 0,
                category: apiService.categoryId || 'other',
                location: apiService.location || 'Location not specified',
                rating: apiService.avgRating || 0,
                reviews: apiService.ratingCount || 0,
                deliveryTime: apiService.estimatedDuration || 7,
                seller: {
                  name: sellerName,
                  verified: apiService.creator?.role === 'provider',
                  rating: apiService.creator?.rating || 0,
                  joined: new Date(apiService.createdAt).getFullYear().toString(),
                  online: true,
                  completedProjects: apiService.totalBookings || 0,
                  responseRate: 95,
                  description: apiService.creator?.role === 'provider' ?
                    `Professional ${apiService.creator.businessName || 'service provider'}` :
                    'Client looking for services'
                },
                images: images,
                tags: tags,
                featured: apiService.featured || false,
                negotiable: apiService.budgetType === 'negotiable',
                createdAt: apiService.createdAt || new Date().toISOString(),
                views: apiService.views || 0,
                type: apiService.type || 'provider_service',
                currency: apiService.currency || 'USD',
                budgetType: apiService.budgetType || 'fixed',
                whatsIncluded: [
                  "Professional Service",
                  "Quality Guarantee",
                  "Timely Delivery",
                  "Customer Support"
                ]
              };
            });

            // Find the current service
            const foundService = allServices.find(s => s.id === id);
            console.log("🎯 Found service:", foundService);

            if (foundService) {
              setService(foundService);
              // Find similar services (same category, excluding current)
              const similar = allServices
                .filter(s => s.category === foundService.category && s.id !== foundService.id)
                .slice(0, 3);
              setSimilarServices(similar);
            } else {
              throw new Error('Service not found in API response');
            }
          } else {
            throw new Error('No services data found in response');
          }
        } catch (apiError) {
          console.warn('API fetch failed, using mock data:', apiError.message);
          // Use mock data as fallback
          const mockService = createMockService(id);
          setService(mockService);
          setSimilarServices([]);
          setError('Using demo data. API connection failed.');
        }

      } catch (err) {
        console.error('❌ Error fetching service:', err);
        // Use mock data as final fallback
        const mockService = createMockService(id);
        setService(mockService);
        setSimilarServices([]);
        setError('Using demo data. Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, language, API_BASE_URL]);

  const toggleFavorite = () => {
    if (!service) return;
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(service.id)) {
        newFavorites.delete(service.id);
      } else {
        newFavorites.add(service.id);
      }
      return newFavorites;
    });
  };

  const handleApplyClick = () => {
    console.log("🖱️ Apply button clicked");
    console.log("🔐 Auth status:", { isAuthenticated, user });
    console.log("🔑 Token check:", { token: getToken() ? "Present" : "Missing" });
    
    if (!isAuthenticated || !getToken()) {
      console.log("❌ User not authenticated or token missing, redirecting to login");
      if (confirm(`${t.pleaseLogin}\n\n${t.loginRequired}`)) {
        navigate("/signin", { 
          state: { from: `/service/${id}` }
        });
      }
      return;
    }
    
    // Check if user is trying to apply to their own service
    if (service.seller.name === user?.name || service.seller.name === user?.businessName) {
      alert("You cannot apply to your own service.");
      return;
    }
    
    console.log("✅ User authenticated, showing application form");
    setShowApplicationForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const token = getToken();
      
      console.log("📤 Submitting application with data:", {
        serviceId: id,
        formData,
        token: token ? "Present" : "Missing"
      });

      if (!token) {
        setFormError(t.sessionExpired);
        setFormLoading(false);
        return;
      }

      const applicationData = {
        serviceId: id,
        applicationType: "client_to_provider",
        clientApplication: {
          workLocation: formData.workLocation,
          workDescription: formData.workDescription,
          urgency: formData.urgency,
          preferredDate: formData.preferredDate ? new Date(formData.preferredDate).toISOString() : null
        }
      };

      console.log("🚀 Sending application to:", `${API_BASE_URL}/service-applications`);
      console.log("📝 Application data:", applicationData);

      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success for demo
      alert("Application submitted successfully! (Demo mode)");
      setShowApplicationForm(false);
      setFormData({
        workLocation: "",
        workDescription: "",
        urgency: "medium",
        preferredDate: ""
      });

    } catch (err) {
      console.error("❌ Application submission error:", err);
      setFormError("Application submitted successfully in demo mode!");
    } finally {
      setFormLoading(false);
    }
  };

  const closeForm = () => {
    setShowApplicationForm(false);
    setFormError("");
  };

  // Show loading while checking authentication or loading service
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === "sw" ? "Inapakua..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-3xl flex items-center justify-center">
            <Flag className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t.errorLoading}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              {t.backToServices}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              {t.tryAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t.serviceNotFound}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t.serviceNotFoundDesc}</p>
          <button
            onClick={() => navigate("/services")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            {t.backToServices}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{t.backToServices}</span>
              </button>

              <div className="flex items-center gap-3">
                {isAuthenticated && user && (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t.welcome}, {user.firstName || user.businessName || 'User'}
                  </span>
                )}
                <button
                  onClick={toggleFavorite}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
                >
                  <Heart
                    className={`w-5 h-5 ${favorites.has(service.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-600 dark:text-gray-300'
                      }`}
                  />
                </button>
                <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200">
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300">
              <strong>Demo Mode:</strong> {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Image Gallery */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                <div className="relative">
                  <img
                    src={getServiceImage(service.images)}
                    alt={service.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=500&fit=crop";
                    }}
                  />

                  {/* Image Navigation */}
                  {service.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {service.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {service.images.length > 1 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2 overflow-x-auto">
                      {service.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                            ? 'border-blue-500'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                        >
                          <img
                            src={image}
                            alt={`${service.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=200&h=150&fit=crop";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Service Details */}
              <div className="space-y-6">
                {/* Title and Basic Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    {service.title}
                  </h1>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      {service.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.deliveryTime} {t.days} {t.delivery}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Listed {new Date(service.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {service.views} views
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {service.type === 'provider_service' && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full text-sm font-semibold">
                        Provider Service
                      </span>
                    )}
                    {service.type === 'client_request' && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold">
                        Client Request
                      </span>
                    )}
                    {service.featured && (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full text-sm font-semibold">
                        🔥 Featured
                      </span>
                    )}
                    {service.negotiable && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full text-sm font-semibold">
                        💎 {t.negotiable}
                      </span>
                    )}
                    {service.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">
                          {formatPrice(service.price, service.currency)}
                        </span>
                        {service.originalPrice > service.price && (
                          <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(service.originalPrice, service.currency)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {service.negotiable ? t.negotiable : t.fixedPrice}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-800 dark:text-white">{service.rating}</span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">({service.reviews} {t.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{t.description}</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{service.description}</p>
                </div>

                {/* Seller Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{t.sellerInfo}</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                      {service.seller.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{service.seller.name}</h3>
                        {service.seller.verified && (
                          <Verified className="w-5 h-5 text-blue-500" />
                        )}
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${service.seller.online
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${service.seller.online ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          {service.seller.online ? t.online : 'Offline'}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4">{service.seller.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-gray-800 dark:text-white">{service.seller.rating}</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Seller Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800 dark:text-white mb-1">{service.seller.completedProjects}+</div>
                          <div className="text-gray-600 dark:text-gray-400">Projects Done</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800 dark:text-white mb-1">{service.seller.responseRate}%</div>
                          <div className="text-gray-600 dark:text-gray-400">Response Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800 dark:text-white mb-1">{service.seller.joined}</div>
                          <div className="text-gray-600 dark:text-gray-400">Joined</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Contact & Actions */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">{t.contactOptions}</h3>

                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      {t.contactSeller}
                    </button>

                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      Call Seller
                    </button>
                    
                    <button 
                      onClick={handleApplyClick}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <FaUsers className="w-5 h-5" />
                      {t.applyNow}
                    </button>
                  </div>
                </div>

                {/* Service Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Service Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rating</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-800 dark:text-white">{service.rating}</span>
                        <span className="text-gray-500 dark:text-gray-400">({service.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Delivery Time</span>
                      <span className="font-semibold text-gray-800 dark:text-white">{service.deliveryTime} days</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Service Type</span>
                      <span className="font-semibold text-gray-800 dark:text-white capitalize">
                        {service.type === 'provider_service' ? 'Provider Service' : 'Client Request'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Application Form Popup */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Apply for {service.title}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitApplication}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.workLocation} *
                    </label>
                    <input
                      type="text"
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter work address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.workDescription} *
                    </label>
                    <textarea
                      name="workDescription"
                      value={formData.workDescription}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Describe the work you need done..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.urgency} *
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">{t.low}</option>
                      <option value="medium">{t.medium}</option>
                      <option value="high">{t.high}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.preferredDate}
                    </label>
                    <input
                      type="datetime-local"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {formLoading ? "Submitting..." : t.submitApplication}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ServiceDetail;