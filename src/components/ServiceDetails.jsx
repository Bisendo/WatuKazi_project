// src/components/ServiceDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { 
  ArrowLeft,
  Star,
  Heart,
  Clock,
  Verified,
  Shield,
  Calendar,
  MessageCircle,
  Phone,
  Share2,
  Flag,
  CheckCircle,
  Users,
  
  Eye,
  Award
} from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [service, setService] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
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
      reportService: "Report Service",
      similarServices: "Similar Services",
      whatIncluded: "What's Included",
      securePayment: "Secure Payment",
      moneyBack: "Money Back Guarantee",
      support: "24/7 Support",
      online: "Online",
      available: "Available",
      limited: "Limited Spots"
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
      reportService: "Ripoti Huduma",
      similarServices: "Huduma Zinazofanana",
      whatIncluded: "Yaliyomo",
      securePayment: "Malipo Salama",
      moneyBack: "Hakikisha ya Rudi Fedha",
      support: "Usaidizi 24/7",
      online: "Mtandaoni",
      available: "Inapatikana",
      limited: "Nafasi Chache"
    }
  };

  const t = translations[language];

  // Sample locations
  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'dar', name: 'Dar es Salaam' },
    { id: 'nairobi', name: 'Nairobi' },
    { id: 'kampala', name: 'Kampala' },
    { id: 'online', name: 'Online' }
  ];

  // Sample services data (in a real app, this would come from an API)
  const sampleServices = [
    {
      id: 1,
      title: "Professional Website Development",
      description: "Custom responsive websites built with modern technologies. Perfect for businesses looking to establish online presence. We provide complete solutions including design, development, and deployment with ongoing support and maintenance.",
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
        online: true,
        completedProjects: 89,
        responseRate: 98,
        description: "Professional web development agency with 5+ years of experience delivering high-quality solutions."
      },
      images: [
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=500&fit=crop"
      ],
      tags: ["🔥 Popular", "⚡ Fast Delivery", "💎 Premium", "Responsive Design", "SEO Friendly"],
      featured: true,
      negotiable: true,
      createdAt: "2024-01-15",
      whatsIncluded: [
        "Custom Website Design",
        "Responsive Development",
        "SEO Optimization",
        "1 Year Hosting",
        "6 Months Support",
        "Mobile App Version"
      ]
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
        online: false,
        completedProjects: 67,
        responseRate: 95,
        description: "Mobile app specialists creating stunning cross-platform applications."
      },
      images: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=500&fit=crop"
      ],
      tags: ["📱 Cross-Platform", "🆕 New"],
      featured: false,
      negotiable: false,
      createdAt: "2024-01-20",
      whatsIncluded: [
        "Cross-platform App",
        "UI/UX Design",
        "App Store Deployment",
        "3 Months Support",
        "Source Code",
        "Documentation"
      ]
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
        online: true,
        completedProjects: 124,
        responseRate: 99,
        description: "Award-winning design studio focused on creating exceptional user experiences."
      },
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=500&fit=crop"
      ],
      tags: ["🎨 Creative", "⭐ Top Rated"],
      featured: true,
      negotiable: true,
      createdAt: "2024-01-10",
      whatsIncluded: [
        "Wireframing",
        "UI Design",
        "UX Research",
        "Interactive Prototype",
        "Design System",
        "Assets Export"
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchService = () => {
      setLoading(true);
      setTimeout(() => {
        const foundService = sampleServices.find(s => s.id === parseInt(id));
        setService(foundService);
        
        // Find similar services (same category, excluding current)
        if (foundService) {
          const similar = sampleServices
            .filter(s => s.category === foundService.category && s.id !== foundService.id)
            .slice(0, 3);
          setSimilarServices(similar);
        }
        
        setLoading(false);
      }, 500);
    };

    fetchService();
  }, [id]);

  const toggleFavorite = () => {
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

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Link 
            to="/services"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            Back to Services
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
                  src={service.images[currentImageIndex]} 
                  alt={service.title}
                  className="w-full h-96 object-cover"
                />
                
                {/* Image Navigation */}
                {service.images.length > 1 && (
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
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          currentImageIndex === index 
                            ? 'border-blue-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${service.title} ${index + 1}`}
                          className="w-full h-full object-cover"
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
                    <Eye className="w-4 h-4" />
                    <span className="text-sm text-gray-600">
                1000+ {t.views}
              </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Listed {new Date(service.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.deliveryTime} {t.days} {t.delivery}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
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

              {/* Price Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-gray-800">${service.price}</span>
                  {service.originalPrice > service.price && (
                    <span className="text-2xl line-through text-gray-500">${service.originalPrice}</span>
                  )}
                  {service.negotiable && (
                    <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                      {t.negotiable}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    {t.securePayment}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {t.moneyBack}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-green-500" />
                    {t.support}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4 text-green-500" />
                    Premium Quality
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
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        service.seller.online 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          service.seller.online ? 'bg-green-500' : 'bg-gray-400'
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

              {/* Similar Services */}
              {similarServices.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">{t.similarServices}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {similarServices.map(similarService => (
                      <Link
                        key={similarService.id}
                        to={`/service/${similarService.id}`}
                        className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                      >
                        <img 
                          src={similarService.images[0]} 
                          alt={similarService.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                          {similarService.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-800">${similarService.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{similarService.rating}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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

                  <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                    <Flag className="w-5 h-5" />
                    {t.reportService}
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 text-gray-800 mb-4">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Safe & Secure</span>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Verified sellers and services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Secure payment protection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>24/7 customer support</span>
                  </div>
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
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-800 capitalize">{service.category}</span>
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