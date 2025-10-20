// src/components/ServiceCard.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  MapPin,
  Star,
  Heart,
  Eye,
  Clock,
  Verified,
  Shield,
  Calendar,
  MessageCircle,
  Phone,
  Share2,
  Flag,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Zap,
  Users,
  ThumbsUp,
  Award,
  BadgeCheck,
  ShoppingCart,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../components/LanguageContext';

const Service = () => {
  const { language } = useLanguage();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [viewedServices, setViewedServices] = useState(new Set());

  // Filters state
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 5000],
    location: 'all',
    rating: 0,
    deliveryTime: 30,
    sellerType: 'all'
  });

  const modalRef = useRef(null);

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
      contactSeller: "Contact Seller",
      viewDetails: "View Details",
      addToFavorites: "Add to Favorites",
      removeFromFavorites: "Remove from Favorites",
      verifiedSeller: "Verified Seller",
      topRated: "Top Rated",
      fastDelivery: "Fast Delivery",
      online: "Online",
      available: "Available",
      limited: "Limited Spots",
      booked: "Fully Booked",
      delivery: "Delivery",
      days: "days",
      rating: "Rating",
      reviews: "reviews",
      startingFrom: "Starting from",
      negotiable: "Negotiable",
      featuredServices: "Featured Services",
      recentServices: "Recent Services",
      popularServices: "Popular Services",
      similarServices: "Similar Services",
      serviceDetails: "Service Details",
      description: "Description",
      whatIncluded: "What's Included",
      sellerInfo: "Seller Information",
      contactOptions: "Contact Options",
      shareService: "Share Service",
      reportService: "Report Service",
      viewAll: "View All Services"
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
      contactSeller: "Wasiliana na Muuzaji",
      viewDetails: "Angalia Maelezo",
      addToFavorites: "Ongeza kwa Vipendwa",
      removeFromFavorites: "Ondoa kwa Vipendwa",
      verifiedSeller: "Muuzaji Aliyethibitishwa",
      topRated: "Iliyopewa Kiwango cha Juu",
      fastDelivery: "Uwasilishaji wa Haraka",
      online: "Mtandaoni",
      available: "Inapatikana",
      limited: "Nafasi Chache",
      booked: "Imejaa",
      delivery: "Uwasilishaji",
      days: "siku",
      rating: "Ukadiriaji",
      reviews: "maoni",
      startingFrom: "Kuanzia",
      negotiable: "Inaweza kubishaniwa",
      featuredServices: "Huduma Zilizokua Maarufu",
      recentServices: "Huduma za Hivi Karibuni",
      popularServices: "Huduma Maarufu",
      similarServices: "Huduma Zinazofanana",
      serviceDetails: "Maelezo ya Huduma",
      description: "Maelezo",
      whatIncluded: "Yaliyomo",
      sellerInfo: "Maelezo ya Muuzaji",
      contactOptions: "Chaguzi za Mawasiliano",
      shareService: "Sambaza Huduma",
      reportService: "Ripoti Huduma",
      viewAll: "Tazama Huduma Zote"
    }
  };

  const t = translations[language];

  // Sample categories for Jiji-style marketplace
  const categories = [
    { id: 'all', name: t.allCategories, icon: '📋', count: 0 },
    { id: 'web', name: 'Web Development', icon: '💻', count: 45 },
    { id: 'mobile', name: 'Mobile Apps', icon: '📱', count: 32 },
    { id: 'design', name: 'Design', icon: '🎨', count: 28 },
    { id: 'marketing', name: 'Digital Marketing', icon: '📈', count: 51 },
    { id: 'writing', name: 'Content Writing', icon: '✍️', count: 39 },
    { id: 'video', name: 'Video Editing', icon: '🎬', count: 27 },
    { id: 'consulting', name: 'Consulting', icon: '💼', count: 34 }
  ];

  // Sample locations
  const locations = [
    { id: 'all', name: t.allLocations },
    { id: 'dar', name: 'Dar es Salaam' },
    { id: 'nairobi', name: 'Nairobi' },
    { id: 'kampala', name: 'Kampala' },
    { id: 'online', name: t.online }
  ];

  // Initialize services data
  useEffect(() => {
    const sampleServices = [
      {
        id: 1,
        title: "Professional Website Development",
        description: "Custom responsive websites built with modern technologies. Perfect for businesses looking to establish online presence.",
        price: 899,
        originalPrice: 1200,
        category: 'web',
        location: 'dar',
        rating: 4.8,
        reviews: 127,
        deliveryTime: 14,
        seller: {
          name: "Tech Solutions Ltd",
          verified: true,
          rating: 4.9,
          joined: "2022",
          online: true
        },
        images: [
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=350&fit=crop",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=350&fit=crop"
        ],
        tags: ["🔥 Popular", "⚡ Fast Delivery", "💎 Premium"],
        featured: true,
        negotiable: true,
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        title: "Mobile App Development",
        description: "Cross-platform mobile applications for iOS and Android using React Native and Flutter.",
        price: 1500,
        originalPrice: 2000,
        category: 'mobile',
        location: 'nairobi',
        rating: 4.6,
        reviews: 89,
        deliveryTime: 21,
        seller: {
          name: "App Masters",
          verified: true,
          rating: 4.7,
          joined: "2021",
          online: false
        },
        images: [
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=350&fit=crop",
          "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&h=350&fit=crop"
        ],
        tags: ["📱 Cross-Platform", "🆕 New"],
        featured: false,
        negotiable: false,
        createdAt: "2024-01-20"
      },
      {
        id: 3,
        title: "UI/UX Design Service",
        description: "Beautiful and intuitive user interface designs that enhance user experience and engagement.",
        price: 599,
        originalPrice: 799,
        category: 'design',
        location: 'online',
        rating: 4.9,
        reviews: 203,
        deliveryTime: 10,
        seller: {
          name: "Design Studio Pro",
          verified: true,
          rating: 5.0,
          joined: "2020",
          online: true
        },
        images: [
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=350&fit=crop",
          "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=500&h=350&fit=crop"
        ],
        tags: ["🎨 Creative", "⭐ Top Rated"],
        featured: true,
        negotiable: true,
        createdAt: "2024-01-10"
      },
      {
        id: 4,
        title: "Digital Marketing Strategy",
        description: "Comprehensive digital marketing plans including SEO, social media, and content strategy.",
        price: 450,
        originalPrice: 600,
        category: 'marketing',
        location: 'kampala',
        rating: 4.5,
        reviews: 67,
        deliveryTime: 7,
        seller: {
          name: "Marketing Gurus",
          verified: false,
          rating: 4.4,
          joined: "2023",
          online: true
        },
        images: [
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=350&fit=crop",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=350&fit=crop"
        ],
        tags: ["📈 Growth", "💡 Strategy"],
        featured: false,
        negotiable: true,
        createdAt: "2024-01-18"
      },
      {
        id: 5,
        title: "Content Writing & Copywriting",
        description: "High-quality content writing for websites, blogs, and marketing materials.",
        price: 299,
        originalPrice: 399,
        category: 'writing',
        location: 'online',
        rating: 4.7,
        reviews: 154,
        deliveryTime: 5,
        seller: {
          name: "Content Creators Co.",
          verified: true,
          rating: 4.8,
          joined: "2022",
          online: true
        },
        images: [
          "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=350&fit=crop",
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=350&fit=crop"
        ],
        tags: ["✍️ Professional", "🚀 Quick Delivery"],
        featured: false,
        negotiable: false,
        createdAt: "2024-01-22"
      },
      {
        id: 6,
        title: "Video Editing Service",
        description: "Professional video editing for YouTube, commercials, and social media content.",
        price: 399,
        originalPrice: 550,
        category: 'video',
        location: 'dar',
        rating: 4.4,
        reviews: 92,
        deliveryTime: 7,
        seller: {
          name: "Video Pro Editors",
          verified: true,
          rating: 4.5,
          joined: "2021",
          online: false
        },
        images: [
          "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=500&h=350&fit=crop",
          "https://images.unsplash.com/photo-1591267990536-e729d8bb8e0d?w=500&h=350&fit=crop"
        ],
        tags: ["🎬 Creative", "📹 Professional"],
        featured: true,
        negotiable: true,
        createdAt: "2024-01-14"
      }
    ];

    setServices(sampleServices);
    setFilteredServices(sampleServices);
    setLoading(false);
  }, []);

  // Filter and sort services
  useEffect(() => {
    let results = services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || service.category === filters.category;
      
      const matchesPrice = service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1];
      
      const matchesLocation = filters.location === 'all' || service.location === filters.location;
      
      const matchesRating = service.rating >= filters.rating;

      return matchesSearch && matchesCategory && matchesPrice && matchesLocation && matchesRating;
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
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      default: // featured
        results.sort((a, b) => (b.featured === a.featured) ? 0 : b.featured ? -1 : 1);
        break;
    }

    setFilteredServices(results);
  }, [searchTerm, filters, sortBy, services]);

  // Handlers
  const toggleFavorite = (serviceId) => {
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

  const viewServiceDetails = (service) => {
    setSelectedService(service);
    setViewedServices(prev => new Set(prev).add(service.id));
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 5000],
      location: 'all',
      rating: 0,
      deliveryTime: 30,
      sellerType: 'all'
    });
    setSearchTerm('');
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeServiceDetails();
      }
    };

    if (selectedService) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

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
      <div className="relative">
        <img 
          src={service.images[0]} 
          alt={service.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {service.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(service.id)}
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
            <span className="font-bold text-lg">${service.price}</span>
            {service.originalPrice > service.price && (
              <span className="text-sm line-through text-gray-300">${service.originalPrice}</span>
            )}
          </div>
          {service.negotiable && (
            <div className="text-xs text-green-300">{t.negotiable}</div>
          )}
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
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {locations.find(loc => loc.id === service.location)?.name}
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
            <span className="text-sm text-gray-600">{service.seller.name}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => viewServiceDetails(service)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-semibold text-sm transition-colors duration-200"
          >
            {t.viewDetails}
          </button>
          <button className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200">
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const ServiceDetailModal = ({ service, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!service) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="relative">
            <img 
              src={service.images[currentImageIndex]} 
              alt={service.title}
              className="w-full h-64 object-cover"
            />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-4 flex gap-2">
              {service.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {service.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {locations.find(loc => loc.id === service.location)?.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Listed {new Date(service.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(service.id)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.has(service.id) 
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

                {/* Price */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-gray-800">${service.price}</span>
                    {service.originalPrice > service.price && (
                      <span className="text-lg line-through text-gray-500">${service.originalPrice}</span>
                    )}
                    {service.negotiable && (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {t.negotiable}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.deliveryTime} {t.days} {t.delivery}
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Secure payment
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.description}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-gray-50 rounded-2xl p-6 sticky top-4">
                  {/* Seller Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">{t.sellerInfo}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-semibold">
                        {service.seller.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{service.seller.name}</span>
                          {service.seller.verified && (
                            <Verified className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{service.seller.rating} • Joined {service.seller.joined}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      service.seller.online 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        service.seller.online ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      {service.seller.online ? 'Online' : 'Offline'}
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      {t.contactSeller}
                    </button>
                    
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      Call Seller
                    </button>

                    <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                      <Flag className="w-5 h-5" />
                      {t.reportService}
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Shield className="w-4 h-4" />
                      <span className="font-semibold">Safe & Secure</span>
                    </div>
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Verified sellers
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Secure payments
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        24/7 support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({...prev, priceRange: [0, parseInt(e.target.value)]}))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">{t.location}</h3>
                <div className="space-y-2">
                  {locations.map(location => (
                    <button
                      key={location.id}
                      onClick={() => setFilters(prev => ({...prev, location: location.id}))}
                      className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                        filters.location === location.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {location.name}
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

            {/* Load More */}
            {filteredServices.length > 0 && (
              <div className="text-center mt-12">
                <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-3 rounded-xl font-semibold transition-colors duration-200">
                  {t.viewAll}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">{t.filterTitle}</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile filter content would go here */}
                <div className="space-y-6">
                  {/* Add mobile filter sections here */}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 rounded-xl font-semibold transition-colors duration-200 hover:bg-gray-50"
                  >
                    {t.clearFilters}
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold transition-colors duration-200 hover:bg-blue-700"
                  >
                    {t.applyFilters}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal 
            service={selectedService} 
            onClose={closeServiceDetails} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Service;