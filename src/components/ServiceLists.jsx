// src/components/ServiceList.jsx
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search,
  Filter,
  Star,
  Heart,
  Clock,
  Eye,
  Verified,
  X
} from 'lucide-react';

const ServiceList = () => {
  const { language } = useLanguage();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  // Filters state
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 500000],
    location: 'all',
    rating: 0,
    deliveryTime: 30,
    sellerType: 'all'
  });

  // Translation dictionary
  const translations = {
    en: {
      searchPlaceholder: "Search for services...",
      filterTitle: "Filters",
      sortBy: "Sort by",
      categories: "Categories",
      priceRange: "Price Range",
      location: "Location",
      rating: "Minimum Rating",
      deliveryTime: "Delivery Time",
      sellerType: "Seller Type",
      allCategories: "All Categories",
      allLocations: "All Locations",
      allSellers: "All Sellers",
      featured: "Featured",
      newest: "Newest",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      rating: "Highest Rated",
      popular: "Most Popular",
      clearFilters: "Clear All",
      applyFilters: "Apply Filters",
      servicesFound: "services found",
      viewDetails: "View Details",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      verifiedSeller: "Verified Seller",
      delivery: "Delivery",
      days: "days",
      reviews: "reviews",
      startingFrom: "Starting from",
      negotiable: "Negotiable",
      fixedPrice: "Fixed Price",
      budget: "Budget"
    },
    sw: {
      searchPlaceholder: "Tafuta huduma...",
      filterTitle: "Vichujio",
      sortBy: "Panga kwa",
      categories: "Kategoria",
      priceRange: "Mbalimbali ya Bei",
      location: "Eneo",
      rating: "Ukadiriaji wa Chini",
      deliveryTime: "Muda wa Uwasilishaji",
      sellerType: "Aina ya Muuzaji",
      allCategories: "Kategoria Zote",
      allLocations: "Maeneo Yote",
      allSellers: "Wauzaji Wote",
      featured: "Ilivyopendekezwa",
      newest: "Mpya Zaidi",
      priceLow: "Bei: Chini hadi Juu",
      priceHigh: "Bei: Juu hadi Chini",
      rating: "Iliyopewa kiwango cha juu",
      popular: "Maarufu Zaidi",
      clearFilters: "Futa Yote",
      applyFilters: "Weka Vichujio",
      servicesFound: "huduma zilizopatikana",
      viewDetails: "Angalia Maelezo",
      addToFavorites: "Ongeza kwa Vipendwa",
      removeFromFavorites: "Ondoa kwa Vipendwa",
      verifiedSeller: "Muuzaji Aliyethibitishwa",
      delivery: "Uwasilishaji",
      days: "siku",
      reviews: "maoni",
      startingFrom: "Kuanzia",
      negotiable: "Inaweza kubishaniwa",
      fixedPrice: "Bei Maalum",
      budget: "Bajeti"
    }
  };

  const t = translations[language];

  // Sample categories - you might want to fetch these from API as well
  const categories = [
    { id: 'all', name: t.allCategories, icon: '📋', count: 0 },
    { id: '0b2dfe02-7efe-4bbd-9cb0-b96e260dd7ed', name: 'Electrical Services', icon: '⚡', count: 45 },
    { id: '80262b02-f776-4f61-84cd-81777885afe0', name: 'Vehicle Repair', icon: '🚗', count: 32 },
    { id: '659f6a26-c4d5-40d5-aa2f-618aa6b21705', name: 'Plumbing', icon: '🔧', count: 28 },
    { id: 'web', name: 'Web Development', icon: '💻', count: 51 },
    { id: 'design', name: 'Design', icon: '🎨', count: 39 }
  ];

  // Safe JSON parsing function
  const safeJsonParse = (str, fallback = []) => {
    if (!str) return fallback;
    try {
      // Check if it's already an array
      if (Array.isArray(str)) return str;
      
      // Try to parse as JSON
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.warn('JSON parsing error:', error, 'String:', str);
      return fallback;
    }
  };

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('https://api.watukazi.com/api/v1/services');
        
        if (response.data && response.data.services) {
          const apiServices = response.data.services.map(service => {
            // Safely parse images and tags
            const images = safeJsonParse(service.images);
            const tags = safeJsonParse(service.tags);
            
            // Get seller name safely
            const sellerName = service.creator?.businessName || 
                             (service.creator?.firstName && service.creator?.lastName 
                               ? `${service.creator.firstName} ${service.creator.lastName}`
                               : 'Unknown Seller');
            
            return {
              id: service.id,
              title: service.title || 'Untitled Service',
              description: service.description || 'No description available',
              price: service.budget || 0,
              originalPrice: service.budget ? Math.round(service.budget * 1.2) : 0,
              category: service.categoryId || 'other',
              location: service.location || 'Location not specified',
              rating: service.avgRating || 0,
              reviews: service.ratingCount || 0,
              deliveryTime: service.estimatedDuration || 7,
              seller: {
                name: sellerName,
                verified: service.creator?.role === 'provider'
              },
              images: images,
              tags: tags,
              featured: service.featured || false,
              negotiable: service.budgetType === 'negotiable',
              createdAt: service.createdAt || new Date().toISOString(),
              views: service.views || 0,
              type: service.type || 'provider_service',
              currency: service.currency || 'USD',
              budgetType: service.budgetType || 'fixed'
            };
          });
          
          setServices(apiServices);
          setFilteredServices(apiServices);
        } else {
          throw new Error('No services data found in response');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        // Fallback to empty array
        setServices([]);
        setFilteredServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter and sort services
  useEffect(() => {
    let results = services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || service.category === filters.category;
      
      const matchesPrice = service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1];
      
      const matchesLocation = filters.location === 'all' || 
                            service.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesRating = service.rating >= filters.rating;

      const matchesSellerType = filters.sellerType === 'all' || 
                               (filters.sellerType === 'provider' && service.type === 'provider_service') ||
                               (filters.sellerType === 'client' && service.type === 'client_request');

      return matchesSearch && matchesCategory && matchesPrice && matchesLocation && matchesRating && matchesSellerType;
    });

    // Sort results
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'priceLow':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        results.sort((a, b) => b.views - a.views);
        break;
      default: // featured
        results.sort((a, b) => (b.featured === a.featured) ? 0 : b.featured ? -1 : 1);
        break;
    }

    setFilteredServices(results);
  }, [searchTerm, filters, sortBy, services]);

  // Handlers
  const toggleFavorite = (serviceId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(serviceId)) {
        newFavorites.delete(serviceId);
      } else {
        newFavorites.add(serviceId);
      }
      return newFavorites;
    });
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 500000],
      location: 'all',
      rating: 0,
      deliveryTime: 30,
      sellerType: 'all'
    });
    setSearchTerm('');
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
    // Fallback images based on service type
    return "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=500&h=350&fit=crop";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const ServiceCard = ({ service }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      <Link to={`/service/${service.id}`} className="block">
        <div className="relative">
          <img 
            src={getServiceImage(service.images)} 
            alt={service.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=500&h=350&fit=crop";
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {service.type === 'provider_service' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Provider Service
              </span>
            )}
            {service.type === 'client_request' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                Client Request
              </span>
            )}
            {service.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                🔥 Featured
              </span>
            )}
            {service.negotiable && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                💎 {t.negotiable}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => toggleFavorite(service.id, e)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Heart 
              className={`w-4 h-4 transition-all ${
                favorites.has(service.id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>

          {/* Price */}
          <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-2 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg">
                {formatPrice(service.price, service.currency)}
              </span>
              {service.originalPrice > service.price && (
                <span className="text-sm line-through text-gray-300">
                  {formatPrice(service.originalPrice, service.currency)}
                </span>
              )}
            </div>
            <div className="text-xs">
              {service.negotiable ? t.negotiable : t.fixedPrice}
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
            {service.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
            {service.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {service.views} {t.views}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{service.deliveryTime} {t.days}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-800">{service.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({service.reviews})</span>
            </div>

            <div className="flex items-center gap-1">
              {service.seller.verified && (
                <Verified className="w-4 h-4 text-blue-500" />
              )}
              <span className="text-sm text-gray-600 truncate max-w-[100px]">
                {service.seller.name}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold text-sm transition-colors duration-200">
              {t.viewDetails}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );

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
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Services
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">{t.filterTitle}</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t.clearFilters}
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">{t.categories}</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setFilters(prev => ({...prev, category: category.id}))}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                        filters.category === category.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>{category.icon} {category.name}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">{t.priceRange}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({...prev, priceRange: [0, parseInt(e.target.value)]}))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">{t.rating}</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilters(prev => ({...prev, rating}))}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                        filters.rating === rating
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">{rating}+</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Search and Filters */}
            <div className="lg:hidden mb-6 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories Scroll */}
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setFilters(prev => ({...prev, category: category.id}))}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
                        filters.category === category.id
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort and Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {filteredServices.length} {t.servicesFound}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">{t.sortBy}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="featured">{t.featured}</option>
                  <option value="newest">{t.newest}</option>
                  <option value="priceLow">{t.priceLow}</option>
                  <option value="priceHigh">{t.priceHigh}</option>
                  <option value="rating">{t.rating}</option>
                  <option value="popular">{t.popular}</option>
                </select>
              </div>
            </div>

            {/* Services Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-3xl flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ServiceList;