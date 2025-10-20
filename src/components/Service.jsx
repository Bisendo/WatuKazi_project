// src/components/ServiceCard.jsx
import { motion } from 'framer-motion';
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
  Heart
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { useState } from 'react';

const Service = () => {
  const { language, toggleLanguage } = useLanguage();
  const [likedCards, setLikedCards] = useState({});

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
      cloudSolutions: "Cloud Solutions"
    },
    sw: {
      ourServices: "Huduma Zetu",
      whatWeOffer: "Tunatoa Nini",
      description: "Suluhisho za kidijitali zilizoboreshwa kuinua biashara yako na kukuza matokeo mazuri.",
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
      cloudSolutions: "Suluhisho za Wingu"
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
      delay: 0.6
    }
  ];

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

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto">
        
      

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
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

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {services.map((service) => (
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