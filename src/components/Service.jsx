// src/components/ServiceCard.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Palette, 
  Smartphone, 
  Zap, 
  Shield, 
  Cloud,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Clock,
  Users,
  Calendar,
  Tag,
  MessageCircle,
  ThumbsUp,
  Eye,
  ShoppingCart,
  Heart,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { useState, useEffect } from 'react';

const Service = () => {
  const { language, toggleLanguage } = useLanguage();
  const [likedCards, setLikedCards] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 2000],
    status: 'all',
    rating: 0,
    deliveryTime: 30
  });
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
    status: true,
    rating: true,
    delivery: true
  });

  // Translation dictionary
  const translations = {
    en: {
      ourServices: "Our Services",
      whatWeOffer: "What We Offer",
      description: "Comprehensive digital solutions tailored to elevate your business and drive meaningful results.",
      learnMore: "Learn More",
      viewAllServices: "View All Services",
      features: "Features",
      pricing: "Pricing",
      startingFrom: "Starting from",
      perMonth: "/month",
      projects: "projects",
      status: "Status",
      available: "Available",
      limited: "Limited",
      booked: "Booked",
      requests: "Requests",
      viewDetails: "View Details",
      addToCart: "Add to Cart",
      popular: "Popular",
      new: "New",
      discount: "Discount",
      delivery: "Delivery",
      days: "days",
      clients: "clients",
      satisfaction: "Satisfaction",
      viewAll: "View All",
      webDevelopment: "Web Development",
      uiuxDesign: "UI/UX Design",
      mobileApps: "Mobile Apps",
      performanceOptimization: "Performance Optimization",
      securityAudit: "Security Audit",
      cloudSolutions: "Cloud Solutions",
      searchPlaceholder: "Search services...",
      filterTitle: "Filters",
      category: "Category",
      allCategories: "All Categories",
      priceRange: "Price Range",
      statusFilter: "Availability",
      allStatus: "All Status",
      ratingFilter: "Minimum Rating",
      deliveryTimeFilter: "Max Delivery Time",
      clearFilters: "Clear Filters",
      applyFilters: "Apply Filters",
      results: "results",
      showing: "Showing",
      of: "of",
      sortBy: "Sort by",
      sortOptions: {
        featured: "Featured",
        priceLow: "Price: Low to High",
        priceHigh: "Price: High to Low",
        rating: "Highest Rated",
        delivery: "Fastest Delivery"
      }
    },
    sw: {
      ourServices: "Huduma Zetu",
      whatWeOffer: "Tunatoa Nini",
      description: "Suluhisho za kidijitali zilizoboreshwa kuinua biashara yaku na kukuza matokeo mazuri.",
      learnMore: "Jifunze Zaidi",
      viewAllServices: "Tazama Huduma Zote",
      features: "Vipengele",
      pricing: "Bei",
      startingFrom: "Kuanzia",
      perMonth: "/mwezi",
      projects: "miradi",
      status: "Hali",
      available: "Inapatikana",
      limited: "Imeachwa Kidogo",
      booked: "Imechukuliwa",
      requests: "Maombi",
      viewDetails: "Angalia Maelezo",
      addToCart: "Weka kwenye Cart",
      popular: "Maarufu",
      new: "Mpya",
      discount: "Punguzo",
      delivery: "Uwasilishaji",
      days: "siku",
      clients: "wateja",
      satisfaction: "Uridhika",
      viewAll: "Tazama Zote",
      webDevelopment: "Ukuzaji wa Tovuti",
      uiuxDesign: "Ubunifu wa UI/UX",
      mobileApps: "Programu za Rununu",
      performanceOptimization: "Uboreshaji wa Utendaji",
      securityAudit: "Ukaguzi wa Usalama",
      cloudSolutions: "Suluhisho za Wingu",
      searchPlaceholder: "Tafuta huduma...",
      filterTitle: "Vichujio",
      category: "Kategoria",
      allCategories: "Kategoria Zote",
      priceRange: "Mbalimbali ya Bei",
      statusFilter: "Upataji",
      allStatus: "Hali Zote",
      ratingFilter: "Ukadiriaji wa Chini",
      deliveryTimeFilter: "Muda wa Uwasilishaji",
      clearFilters: "Futa Vichujio",
      applyFilters: "Weka Vichujio",
      results: "matokeo",
      showing: "Inaonyesha",
      of: "ya",
      sortBy: "Panga kwa",
      sortOptions: {
        featured: "Ilivyopendekezwa",
        priceLow: "Bei: Chini hadi Juu",
        priceHigh: "Bei: Juu hadi Chini",
        rating: "Iliyopewa kiwango cha juu",
        delivery: "Uwasilishaji wa Haraka"
      }
    }
  };

  const t = translations[language];

  const services = [
    {
      id: 1,
      icon: <Code className="w-8 h-8" />,
      title: t.webDevelopment,
      description: "Modern, responsive websites built with cutting-edge technologies for optimal performance and user experience.",
      features: ["React/Vue.js Development", "Node.js Backend", "MongoDB Database", "API Integration", "SEO Optimization", "Responsive Design"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      price: 999,
      originalPrice: 1299,
      rating: 4.9,
      projects: 150,
      status: "available",
      deliveryTime: 14,
      clients: 89,
      satisfaction: 98,
      tags: ["Popular", "Fast Delivery"],
      requests: 45,
      category: "development",
      delay: 0.1
    },
    {
      id: 2,
      icon: <Palette className="w-8 h-8" />,
      title: t.uiuxDesign,
      description: "Beautiful, intuitive designs that enhance user experience and drive engagement across all platforms.",
      features: ["User Research & Analysis", "Wireframing & Prototyping", "Design Systems", "Interactive Mockups"],
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      price: 799,
      originalPrice: 999,
      rating: 4.8,
      projects: 120,
      status: "limited",
      deliveryTime: 10,
      clients: 67,
      satisfaction: 95,
      tags: ["New", "Trending"],
      requests: 32,
      category: "design",
      delay: 0.2
    },
    {
      id: 3,
      icon: <Smartphone className="w-8 h-8" />,
      title: t.mobileApps,
      description: "Cross-platform mobile applications that deliver seamless experiences on iOS and Android devices.",
      features: ["React Native/Flutter", "iOS & Android Development", "App Store Deployment", "Push Notifications"],
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      price: 1299,
      originalPrice: 1599,
      rating: 4.7,
      projects: 95,
      status: "available",
      deliveryTime: 21,
      clients: 45,
      satisfaction: 92,
      tags: ["Popular", "Cross-Platform"],
      requests: 28,
      category: "development",
      delay: 0.3
    },
    {
      id: 4,
      icon: <Zap className="w-8 h-8" />,
      title: t.performanceOptimization,
      description: "Speed up your applications with comprehensive performance tuning and optimization services.",
      features: ["Lighthouse Optimization", "Core Web Vitals", "CDN Setup", "Caching Strategy"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      price: 599,
      originalPrice: 799,
      rating: 4.9,
      projects: 80,
      status: "booked",
      deliveryTime: 7,
      clients: 78,
      satisfaction: 96,
      tags: ["Fast", "Essential"],
      requests: 51,
      category: "optimization",
      delay: 0.4
    },
    {
      id: 5,
      icon: <Shield className="w-8 h-8" />,
      title: t.securityAudit,
      description: "Protect your applications with thorough security assessments and advanced protection implementations.",
      features: ["Penetration Testing", "Code Security Review", "SSL/TLS Implementation", "Security Headers"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
      price: 899,
      originalPrice: 1199,
      rating: 4.8,
      projects: 65,
      status: "available",
      deliveryTime: 5,
      clients: 34,
      satisfaction: 94,
      tags: ["Security", "Essential"],
      requests: 23,
      category: "security",
      delay: 0.5
    },
    {
      id: 6,
      icon: <Cloud className="w-8 h-8" />,
      title: t.cloudSolutions,
      description: "Scalable cloud infrastructure and deployment solutions for businesses of all sizes.",
      features: ["AWS/Azure/GCP Setup", "Docker & Kubernetes", "CI/CD Pipelines", "Auto Scaling"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20",
      price: 1499,
      originalPrice: 1899,
      rating: 4.7,
      projects: 110,
      status: "limited",
      deliveryTime: 28,
      clients: 56,
      satisfaction: 91,
      tags: ["Scalable", "Enterprise"],
      requests: 37,
      category: "cloud",
      delay: 0.6
    }
  ];

  const [sortOption, setSortOption] = useState('featured');
  const [filteredServices, setFilteredServices] = useState(services);

  // Filter and sort services
  useEffect(() => {
    let results = services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || service.category === filters.category;
      
      const matchesPrice = service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1];
      
      const matchesStatus = filters.status === 'all' || service.status === filters.status;
      
      const matchesRating = service.rating >= filters.rating;
      
      const matchesDelivery = service.deliveryTime <= filters.deliveryTime;

      return matchesSearch && matchesCategory && matchesPrice && matchesStatus && matchesRating && matchesDelivery;
    });

    // Sort results
    switch (sortOption) {
      case 'priceLow':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery':
        results.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredServices(results);
  }, [searchTerm, filters, sortOption, services]);

  const toggleLike = (serviceId) => {
    setLikedCards(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'limited': return 'bg-yellow-500';
      case 'booked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return t.available;
      case 'limited': return t.limited;
      case 'booked': return t.booked;
      default: return status;
    }
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 2000],
      status: 'all',
      rating: 0,
      deliveryTime: 30
    });
    setSearchTerm('');
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    },
    hover: {
      y: -15,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.3
      }
    },
    hover: {
      scale: 1.15,
      transition: {
        type: "spring",
        stiffness: 400,
        duration: 0.5
      }
    }
  };

  const sidebarVariants = {
    hidden: { x: -400, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: -400,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold mb-6 shadow-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            {t.ourServices}
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-cyan-600 dark:from-white dark:via-blue-300 dark:to-cyan-300 bg-clip-text text-transparent mb-6">
            {t.whatWeOffer}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center justify-between"
        >
          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex gap-4 w-full lg:w-auto">
            {/* Sort Dropdown */}
            <div className="relative flex-1 lg:flex-none">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-4 pl-4 pr-12 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="featured">{t.sortOptions.featured}</option>
                <option value="priceLow">{t.sortOptions.priceLow}</option>
                <option value="priceHigh">{t.sortOptions.priceHigh}</option>
                <option value="rating">{t.sortOptions.rating}</option>
                <option value="delivery">{t.sortOptions.delivery}</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Filter Button for Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              {t.filterTitle}
            </motion.button>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar Filters for Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block w-80 flex-shrink-0"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-6 h-6" />
                  {t.filterTitle}
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-200"
                >
                  {t.clearFilters}
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection('category')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                >
                  <span>{t.category}</span>
                  {expandedFilters.category ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedFilters.category && (
                  <div className="space-y-2">
                    {['all', 'development', 'design', 'optimization', 'security', 'cloud'].map((category) => (
                      <label key={category} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filters.category === category}
                          onChange={(e) => setFilters({...filters, category: e.target.value})}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-200 capitalize">
                          {category === 'all' ? t.allCategories : category}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection('price')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                >
                  <span>{t.priceRange}</span>
                  {expandedFilters.price ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedFilters.price && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection('status')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                >
                  <span>{t.statusFilter}</span>
                  {expandedFilters.status ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedFilters.status && (
                  <div className="space-y-2">
                    {['all', 'available', 'limited', 'booked'].map((status) => (
                      <label key={status} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={filters.status === status}
                          onChange={(e) => setFilters({...filters, status: e.target.value})}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-200 capitalize">
                          {status === 'all' ? t.allStatus : getStatusText(status)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection('rating')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                >
                  <span>{t.ratingFilter}</span>
                  {expandedFilters.rating ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedFilters.rating && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-gray-600 dark:text-gray-400">{filters.rating}+</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                    />
                  </div>
                )}
              </div>

              {/* Delivery Time Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection('delivery')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                >
                  <span>{t.deliveryTimeFilter}</span>
                  {expandedFilters.delivery ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedFilters.delivery && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {filters.deliveryTime} {t.days}
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={filters.deliveryTime}
                      onChange={(e) => setFilters({...filters, deliveryTime: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Mobile Filter Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed left-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-50 lg:hidden overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <SlidersHorizontal className="w-6 h-6" />
                        {t.filterTitle}
                      </h3>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors duration-200"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Mobile Filter Content - Same as desktop but with close functionality */}
                    <div className="space-y-6">
                      {/* Category Filter */}
                      <div>
                        <button
                          onClick={() => toggleFilterSection('category')}
                          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                        >
                          <span>{t.category}</span>
                          {expandedFilters.category ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedFilters.category && (
                          <div className="space-y-2">
                            {['all', 'development', 'design', 'optimization', 'security', 'cloud'].map((category) => (
                              <label key={category} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="radio"
                                  name="category"
                                  value={category}
                                  checked={filters.category === category}
                                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-200 capitalize">
                                  {category === 'all' ? t.allCategories : category}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <button
                          onClick={() => toggleFilterSection('price')}
                          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                        >
                          <span>{t.priceRange}</span>
                          {expandedFilters.price ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedFilters.price && (
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span>${filters.priceRange[0]}</span>
                              <span>${filters.priceRange[1]}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="2000"
                              step="100"
                              value={filters.priceRange[1]}
                              onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Status Filter */}
                      <div>
                        <button
                          onClick={() => toggleFilterSection('status')}
                          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                        >
                          <span>{t.statusFilter}</span>
                          {expandedFilters.status ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedFilters.status && (
                          <div className="space-y-2">
                            {['all', 'available', 'limited', 'booked'].map((status) => (
                              <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="radio"
                                  name="status"
                                  value={status}
                                  checked={filters.status === status}
                                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                                  className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors duration-200 capitalize">
                                  {status === 'all' ? t.allStatus : getStatusText(status)}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Rating Filter */}
                      <div>
                        <button
                          onClick={() => toggleFilterSection('rating')}
                          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                        >
                          <span>{t.ratingFilter}</span>
                          {expandedFilters.rating ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedFilters.rating && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="text-gray-600 dark:text-gray-400">{filters.rating}+</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="0.5"
                              value={filters.rating}
                              onChange={(e) => setFilters({...filters, rating: parseFloat(e.target.value)})}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Delivery Time Filter */}
                      <div>
                        <button
                          onClick={() => toggleFilterSection('delivery')}
                          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 dark:text-white mb-3"
                        >
                          <span>{t.deliveryTimeFilter}</span>
                          {expandedFilters.delivery ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedFilters.delivery && (
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {filters.deliveryTime} {t.days}
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="30"
                              step="1"
                              value={filters.deliveryTime}
                              onChange={(e) => setFilters({...filters, deliveryTime: parseInt(e.target.value)})}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={clearFilters}
                        className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                      >
                        {t.clearFilters}
                      </button>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                      >
                        {t.applyFilters}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-gray-600 dark:text-gray-400">
                {t.showing} <span className="font-semibold text-gray-800 dark:text-white">{filteredServices.length}</span> {t.of} <span className="font-semibold text-gray-800 dark:text-white">{services.length}</span> {t.results}
              </p>
            </motion.div>

            {/* Services Grid */}
            {filteredServices.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8"
              >
                {filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group relative"
                  >
                    {/* Background Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
                    
                    {/* Main Card */}
                    <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl h-full border border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden`}>
                      
                      {/* Product Image Section */}
                      <motion.div
                        variants={imageVariants}
                        className="relative h-56 overflow-hidden"
                      >
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`} />
                        
                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {service.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 dark:text-white shadow-lg"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <div className={`flex items-center px-3 py-2 rounded-2xl ${getStatusColor(service.status)} text-white text-xs font-semibold shadow-lg backdrop-blur-sm`}>
                            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                            {getStatusText(service.status)}
                          </div>
                        </div>

                        {/* Like Button */}
                        <motion.button
                          onClick={() => toggleLike(service.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-16 right-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Heart 
                            className={`w-5 h-5 transition-all duration-300 ${
                              likedCards[service.id] 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                            }`}
                          />
                        </motion.button>

                        {/* Rating and Projects */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center bg-black/70 text-white px-3 py-2 rounded-2xl text-sm backdrop-blur-sm">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              {service.rating}
                            </div>
                            <div className="bg-black/70 text-white px-3 py-2 rounded-2xl text-sm backdrop-blur-sm">
                              {service.projects}+ {t.projects}
                            </div>
                          </div>
                          <div className="bg-black/70 text-white px-3 py-2 rounded-2xl text-sm backdrop-blur-sm">
                            <Eye className="w-4 h-4 inline mr-1" />
                            {service.requests} {t.requests}
                          </div>
                        </div>
                      </motion.div>

                      <div className="p-6">
                        {/* Header with Icon and Pricing */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-r ${service.gradient} shadow-lg`}>
                            {service.icon}
                          </div>
                          
                          {/* Pricing with Discount */}
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-3xl font-bold text-gray-800 dark:text-white">
                                ${service.price}
                              </span>
                              {service.originalPrice > service.price && (
                                <span className="text-lg line-through text-gray-500 dark:text-gray-400">
                                  ${service.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {t.startingFrom} {t.perMonth}
                            </div>
                            {service.originalPrice > service.price && (
                              <div className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold mt-1">
                                <Tag className="w-3 h-3 mr-1" />
                                {Math.round((1 - service.price / service.originalPrice) * 100)}% OFF
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title and Description */}
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
                          {service.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-base">
                          {service.description}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                            <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">{service.deliveryTime}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{t.delivery}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                            <Users className="w-5 h-5 text-green-500 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">{service.clients}+</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{t.clients}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                            <ThumbsUp className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">{service.satisfaction}%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{t.satisfaction}</div>
                          </div>
                        </div>

                        {/* Features List */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            {t.features}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {service.features.slice(0, 4).map((feature, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: service.delay + index * 0.1 }}
                                className="flex items-center text-gray-600 dark:text-gray-400 text-sm p-2 rounded-xl bg-gray-50 dark:bg-gray-700/30"
                              >
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} mr-3 flex-shrink-0`} />
                                <span className="truncate">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r ${service.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
                          >
                            <ShoppingCart className="w-5 h-5" />
                            {t.addToCart}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <Eye className="w-5 h-5" />
                            {t.viewDetails}
                          </motion.button>
                        </div>
                      </div>

                      {/* Animated Border */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}>
                        <div className="absolute inset-[3px] rounded-3xl bg-white dark:bg-gray-800" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  No services found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500"
          >
            {t.viewAllServices}
            <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Service;