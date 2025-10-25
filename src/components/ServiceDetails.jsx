// src/components/ServiceDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
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

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [service, setService] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [similarServices, setSimilarServices] = useState([]);

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
      budget: "Budget"
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
      budget: "Bajeti"
    }
  };

  const t = translations[language];

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

  // Fetch service details from API
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get all services to find the specific one and similar ones
        const response = await axios.get('https://api.watukazi.com/api/v1/services');

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
          setService(foundService);

          // Find similar services (same category, excluding current)
          if (foundService) {
            const similar = allServices
              .filter(s => s.category === foundService.category && s.id !== foundService.id)
              .slice(0, 3);
            setSimilarServices(similar);
          } else {
            setError(t.serviceNotFound);
          }
        } else {
          throw new Error('No services data found in response');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, language]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-3xl flex items-center justify-center">
            <Flag className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.errorLoading}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.serviceNotFound}</h2>
          <p className="text-gray-600 mb-6">{t.serviceNotFoundDesc}</p>
          <Link
            to="/services"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            {t.backToServices}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.backToServices}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFavorite}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
              >
                <Heart
                  className={`w-5 h-5 ${favorites.has(service.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600'
                    }`}
                />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
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
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto">
                    {service.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {service.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                      Provider Service
                    </span>
                  )}
                  {service.type === 'client_request' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      Client Request
                    </span>
                  )}
                  {service.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold">
                      🔥 Featured
                    </span>
                  )}
                  {service.negotiable && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                      💎 {t.negotiable}
                    </span>
                  )}
                  {service.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-gray-800">
                        {formatPrice(service.price, service.currency)}
                      </span>
                      {service.originalPrice > service.price && (
                        <span className="text-lg line-through text-gray-500">
                          {formatPrice(service.originalPrice, service.currency)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {service.negotiable ? t.negotiable : t.fixedPrice}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-800">{service.rating}</span>
                    </div>
                    <span className="text-gray-500">({service.reviews} {t.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.description}</h2>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>



              {/* Seller Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.sellerInfo}</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {service.seller.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{service.seller.name}</h3>
                      {service.seller.verified && (
                        <Verified className="w-5 h-5 text-blue-500" />
                      )}
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${service.seller.online
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${service.seller.online ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        {service.seller.online ? t.online : 'Offline'}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{service.seller.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-800">{service.seller.rating}</span>
                        </div>
                        <div className="text-gray-600">Seller Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800 mb-1">{service.seller.completedProjects}+</div>
                        <div className="text-gray-600">Projects Done</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800 mb-1">{service.seller.responseRate}%</div>
                        <div className="text-gray-600">Response Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800 mb-1">{service.seller.joined}</div>
                        <div className="text-gray-600">Joined</div>
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
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">{t.contactOptions}</h3>

                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {t.contactSeller}
                  </button>

                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Seller
                  </button>
                </div>
              </div>

              {/* Service Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Service Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-800">{service.rating}</span>
                      <span className="text-gray-500">({service.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery Time</span>
                    <span className="font-semibold text-gray-800">{service.deliveryTime} days</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Service Type</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {service.type === 'provider_service' ? 'Provider Service' : 'Client Request'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;