import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  User, 
  MapPin,
  Clock,
  ChevronRight,
  Smartphone,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Star,
  Zap,
  Video,
  Users,
  Calendar,
  Shield,
  Rocket
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

// Translation content
const translations = {
  en: {
    title: "Connect with Watukazi",
    subtitle: "Your trusted partner for digital solutions. Let's build something amazing together!",
    sendMessage: "Start Your Project",
    formSubtitle: "Share your vision and we'll bring it to life",
    yourName: "Your Name",
    emailAddress: "Email Address",
    subject: "Project Type",
    yourMessage: "Your Project Details",
    send: "Launch Project",
    sending: "Processing...",
    messageSent: "Success!",
    successMessage: "Our team will contact you within 2 hours to discuss your project.",
    howToContact: "How Watukazi Works",
    responseTime: "Quick Response",
    officeHours: "Available Hours",
    withinHours: "Within 2 hours",
    monFri: "Monday-Sunday, 8AM-10PM EAT",
    chooseMethod: "Choose Contact Method",
    fillDetails: "Share Your Details",
    describeRequest: "Describe Your Project",
    submitWait: "We'll Get Started",
    available247: "Always Available",
    response2Hours: "Fast Response",
    instantResponse: "Instant Connect",
    bookAppointment: "Schedule Meeting",
    contactForm: "Project Inquiry",
    watchTutorial: "See How It Works",
    replayTutorial: "Watch Again",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "your.email@company.com",
    subjectPlaceholder: "Web Development / Mobile App / Design",
    messagePlaceholder: "Tell us about your project requirements, timeline, and goals...",
    stop: "Stop Demo",
    step: "Step",
    of: "of",
    howItWorks: "How Watukazi Works",
    step1: "Contact Us",
    step2: "Discuss Project",
    step3: "Get Proposal",
    step4: "Start Development",
    trusted: "Trusted by 100+ Clients",
    projects: "Projects Completed",
    support: "24/7 Support",
    getStarted: "Get Started Today",
    communication: "Communication Channels",
    videoCall: "Video Consultation",
    liveChat: "Instant Messaging",
    emailCom: "Email Support",
    phoneCall: "Phone Support"
  },
  sw: {
    title: "Wasiliana na Watukazi",
    subtitle: "Mshika mikako wako wa suluhisho za kidijitali. Tuunde kitu kizuri pamoja!",
    sendMessage: "Anzisha Mradi Wako",
    formSubtitle: "Shiriki maono yako na tutayawezesha",
    yourName: "Jina Lako",
    emailAddress: "Barua Pepe",
    subject: "Aina ya Mradi",
    yourMessage: "Maelezo ya Mradi",
    send: "Zindua Mradi",
    sending: "Inachakata...",
    messageSent: "Imefanikiwa!",
    successMessage: "Timu yetu itawasiliana nawe ndani ya masaa 2 kujadili mradi wako.",
    howToContact: "Jinsi Watukazi Inavyofanya Kazi",
    responseTime: "Jibu la Haraka",
    officeHours: "Masaa ya Upatikanaji",
    withinHours: "Ndani ya masaa 2",
    monFri: "Jumatatu-Jumapili, 8AM-10PM EAT",
    chooseMethod: "Chagua Njia ya Mawasiliano",
    fillDetails: "Shiriki Maelezo Yako",
    describeRequest: "Eleza Mradi Wako",
    submitWait: "Tutaanza",
    available247: "Inapatikana Daima",
    response2Hours: "Jibu la Haraka",
    instantResponse: "Unganisho wa Haraka",
    bookAppointment: "Panga Mkutano",
    contactForm: "Utafiti wa Mradi",
    watchTutorial: "Angalia Jinsi Inavyofanya Kazi",
    replayTutorial: "Tazama Tena",
    namePlaceholder: "Weka jina lako kamili",
    emailPlaceholder: "barua.pepe@kampuni.com",
    subjectPlaceholder: "Ukuzaji wa Tovuti / Programu ya Rununu / Ubunifu",
    messagePlaceholder: "Tuambie kuhusu mahitaji ya mradi wako, mwendo wa muda, na malengo...",
    stop: "Simamisha Onyesho",
    step: "Hatua",
    of: "ya",
    howItWorks: "Jinsi Watukazi Inavyofanya Kazi",
    step1: "Wasiliana Nasi",
    step2: "Jadili Mradi",
    step3: "Pata Pendekezo",
    step4: "Anza Ukuzaji",
    trusted: "Imeaminika na Wateja 100+",
    projects: "Miradi Imekamilika",
    support: "Usaidizi 24/7",
    getStarted: "Anza Leo",
    communication: "Njia za Mawasiliano",
    videoCall: "Ushauri wa Video",
    liveChat: "Ujumbe wa Haraka",
    emailCom: "Usaidizi wa Barua Pepe",
    phoneCall: "Usaidizi wa Simu"
  }
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVideoStep, setCurrentVideoStep] = useState(0);
  const videoIntervalRef = useRef(null);

  const { language } = useLanguage();

  const t = (key) => translations[language]?.[key] || key;

  // Floating background elements
  const floatingElements = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
    size: 20 + Math.random() * 40
  }));

  // Enhanced video tutorial for Watukazi workflow
  const videoSteps = [
    { 
      duration: 4000, 
      step: 1, 
      title: t('step1'),
      description: language === 'en' 
        ? "Choose your preferred contact method to reach our team"
        : "Chagua njia unayopenda ya kuwasiliana na timu yetu",
      animation: "👋",
      icon: <Users className="w-8 h-8" />
    },
    { 
      duration: 4000, 
      step: 2, 
      title: t('step2'),
      description: language === 'en'
        ? "Share your project details and requirements with us"
        : "Shiriki maelezo ya mradi wako na mahitaji na sisi",
      animation: "💬",
      icon: <MessageCircle className="w-8 h-8" />
    },
    { 
      duration: 4000, 
      step: 3, 
      title: t('step3'),
      description: language === 'en'
        ? "We analyze your needs and prepare a customized proposal"
        : "Tunachambua mahitaji yako na kuandaa pendekezo maalum",
      animation: "📋",
      icon: <Calendar className="w-8 h-8" />
    },
    { 
      duration: 4000, 
      step: 4, 
      title: t('step4'),
      description: language === 'en'
        ? "Start development with regular updates and 24/7 support"
        : "Anza ukuzaji na sasisho za kawaida na usaidizi 24/7",
      animation: "🚀",
      icon: <Rocket className="w-8 h-8" />
    }
  ];

  const startTutorial = () => {
    setIsPlaying(true);
    setCurrentVideoStep(0);
    
    videoIntervalRef.current = setInterval(() => {
      setCurrentVideoStep(prev => {
        if (prev >= videoSteps.length - 1) {
          clearInterval(videoIntervalRef.current);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 4000);
  };

  const stopTutorial = () => {
    setIsPlaying(false);
    clearInterval(videoIntervalRef.current);
  };

  const replayTutorial = () => {
    stopTutorial();
    setTimeout(startTutorial, 500);
  };

  useEffect(() => {
    startTutorial();
    return () => {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactMethods = [
    {
      icon: <Video className="w-6 h-6" />,
      title: t('videoCall'),
      description: language === 'en' ? "Video consultation" : "Ushauri wa video",
      action: t('bookAppointment'),
      color: "from-purple-500 to-pink-500",
      type: "video"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: t('liveChat'),
      description: "+255 (755) 123-456",
      action: t('instantResponse'),
      color: "from-green-500 to-teal-500",
      type: "chat"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('emailCom'),
      description: "hello@watukazi.co.tz",
      action: t('response2Hours'),
      color: "from-blue-500 to-cyan-500",
      type: "email"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('phoneCall'),
      description: language === 'en' ? "Direct call" : "Simu ya moja kwa moja",
      action: t('available247'),
      color: "from-orange-500 to-red-500",
      type: "phone"
    }
  ];

  const stats = [
    { number: "100+", label: t('trusted'), icon: <Users className="w-5 h-5" /> },
    { number: "250+", label: t('projects'), icon: <CheckCircle className="w-5 h-5" /> },
    { number: "24/7", label: t('support'), icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full opacity-10 bg-blue-300"
            style={{
              width: element.size,
              height: element.size,
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-6"
          >
            <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6"
            key={language}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            key={`subtitle-${language}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-8 mt-8 flex-wrap"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="text-center bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20 min-w-[120px]"
              >
                <div className="flex justify-center items-center gap-2 mb-2">
                  <div className="text-blue-500">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Google Pixel 7 Template */}
          <div className="space-y-8">
            {/* Google Pixel 7 Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative mx-auto max-w-sm"
            >
              {/* Pixel 7 Frame */}
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-[40px] p-4 shadow-2xl border-[8px] border-gray-300 relative overflow-hidden">
                {/* Camera Bar */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-full z-20 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
                
                {/* Screen Content */}
                <div className="bg-white rounded-[32px] h-[600px] overflow-hidden relative transition-all duration-500">
                  {/* Status Bar */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 pt-8 text-center">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white rounded-full"></div>
                        <div className="w-1 h-4 bg-white rounded-full"></div>
                        <div className="w-1 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-medium">Watukazi Connect</span>
                    </div>
                  </div>

                  {/* Tutorial Controls */}
                  <div className="absolute top-20 right-4 z-30 flex flex-col space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={isPlaying ? stopTutorial : startTutorial}
                      className={`p-2 rounded-full backdrop-blur-lg ${
                        isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      } shadow-lg`}
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={replayTutorial}
                      className="p-2 rounded-full bg-blue-500 text-white backdrop-blur-lg shadow-lg"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </motion.button>
                  </div>

                  {/* App Content */}
                  <div className="p-4 h-[calc(100%-80px)] overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {isSubmitted ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center justify-center h-full text-center"
                        >
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <CheckCircle className="w-20 h-20 text-green-400 mb-4" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {t('messageSent')}
                          </h3>
                          <p className="text-gray-600">
                            {t('successMessage')}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {t('communication')}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t('watchTutorial')}
                            </p>
                          </div>
                          
                          {contactMethods.map((method, index) => (
                            <motion.div
                              key={method.title}
                              whileHover={{ scale: isPlaying ? 1 : 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              animate={{
                                scale: isPlaying && currentVideoStep === 0 && index === 0 ? [1, 1.05, 1] : 1,
                                borderColor: isPlaying && currentVideoStep === 0 && index === 0 ? 
                                  'rgba(59, 130, 246, 0.5)' : 'transparent',
                                boxShadow: isPlaying && currentVideoStep === 0 && index === 0 ? 
                                  '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
                              }}
                              transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 0 && index === 0 ? Infinity : 0 }}
                              className="flex items-center p-4 rounded-2xl cursor-pointer border-2 bg-white border-transparent hover:border-blue-300 transition-all duration-300 relative overflow-hidden shadow-sm"
                            >
                              <div className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-5`} />
                              
                              <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white mr-4 relative z-10`}>
                                {method.icon}
                              </div>
                              <div className="flex-1 relative z-10">
                                <h4 className="font-semibold text-gray-800">{method.title}</h4>
                                <p className="text-sm text-gray-600">{method.description}</p>
                              </div>
                              <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full relative z-10">
                                {method.action}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Integrated Tutorial Overlay */}
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20"
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0, y: 20 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          className="bg-white rounded-3xl p-6 mx-4 text-center border border-gray-200 shadow-2xl max-w-sm"
                        >
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-4xl mb-4"
                          >
                            {videoSteps[currentVideoStep]?.animation}
                          </motion.div>
                          
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="text-blue-500">
                              {videoSteps[currentVideoStep]?.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">
                              {videoSteps[currentVideoStep]?.title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {videoSteps[currentVideoStep]?.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>{t('step')} {currentVideoStep + 1} {t('of')} {videoSteps.length}</span>
                            <span>{t('howItWorks')}</span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 4, ease: "linear" }}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Enhanced Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20"
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mb-3"
              >
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t('sendMessage')}
              </h2>
              <p className="text-gray-600">
                {t('formSubtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                  animate={{
                    scale: isPlaying && currentVideoStep === 1 ? [1, 1.02, 1] : 1,
                    borderColor: isPlaying && currentVideoStep === 1 ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                  }}
                  transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 1 ? Infinity : 0 }}
                >
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 mr-2" />
                    {t('yourName')}
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    whileFocus={{ scale: 1.01 }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder={t('namePlaceholder')}
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                  animate={{
                    scale: isPlaying && currentVideoStep === 1 ? [1, 1.02, 1] : 1,
                    borderColor: isPlaying && currentVideoStep === 1 ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                  }}
                  transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 1 ? Infinity : 0 }}
                >
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 mr-2" />
                    {t('emailAddress')}
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    whileFocus={{ scale: 1.01 }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder={t('emailPlaceholder')}
                  />
                </motion.div>
              </div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="space-y-2"
                animate={{
                  scale: isPlaying && currentVideoStep === 2 ? [1, 1.02, 1] : 1,
                  borderColor: isPlaying && currentVideoStep === 2 ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                }}
                transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 2 ? Infinity : 0 }}
              >
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('subject')}
                </label>
                <motion.input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  whileFocus={{ scale: 1.01 }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  placeholder={t('subjectPlaceholder')}
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="space-y-2"
                animate={{
                  scale: isPlaying && currentVideoStep === 2 ? [1, 1.02, 1] : 1,
                  borderColor: isPlaying && currentVideoStep === 2 ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                }}
                transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 2 ? Infinity : 0 }}
              >
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('yourMessage')}
                </label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  whileFocus={{ scale: 1.01 }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder={t('messagePlaceholder')}
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  scale: isPlaying && currentVideoStep === 3 ? [1, 1.05, 1] : 1,
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: isPlaying && currentVideoStep === 3 ? Infinity : 0,
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="relative z-10 flex items-center">
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      {t('sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t('send')}
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Enhanced Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white mr-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('responseTime')}</h4>
                    <p className="text-sm text-gray-600">{t('withinHours')}</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-400 text-white mr-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t('officeHours')}</h4>
                    <p className="text-sm text-gray-600">{t('monFri')}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;