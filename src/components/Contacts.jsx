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
  Sun,
  Moon,
  Globe,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Star,
  Zap
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

// Translation content
const translations = {
  en: {
    title: "Let's Connect",
    subtitle: "Ready to bring your ideas to life? We're just a message away from creating something amazing together.",
    sendMessage: "Start Your Project",
    formSubtitle: "Share your vision with us and let's make it reality",
    yourName: "Your Name",
    emailAddress: "Email Address",
    subject: "Project Type",
    yourMessage: "Your Vision",
    send: "Launch Project",
    sending: "Creating Magic...",
    messageSent: "Success!",
    successMessage: "We'll contact you within 2 hours to discuss your project.",
    howToContact: "Our Process",
    responseTime: "Response Time",
    officeHours: "Working Hours",
    withinHours: "Within 2 hours",
    monFri: "Mon-Sun, 8AM-10PM",
    chooseMethod: "Choose Method",
    fillDetails: "Share Details",
    describeRequest: "Describe Vision",
    submitWait: "We'll Handle It",
    available247: "Always Available",
    response2Hours: "Quick Response",
    instantResponse: "Instant Start",
    bookAppointment: "Meet Team",
    contactForm: "Project Starter",
    watchTutorial: "See How It Works",
    replayTutorial: "Watch Again",
    namePlaceholder: "Enter your name",
    emailPlaceholder: "your.email@creative.com",
    subjectPlaceholder: "Web App / Mobile App / Design",
    messagePlaceholder: "Tell us about your dream project...",
    stop: "Stop Demo",
    step: "Step",
    of: "of"
  },
  sw: {
    title: "Tuungane Pamoja",
    subtitle: "Tayari kutekeleza maono yako? Tupo karibu na ujumbe mmoja tu kutengeneza kitu kizuri pamoja.",
    sendMessage: "Anzisha Mradi Wako",
    formSubtitle: "Shiriki maono yako na sisi na tufanye ukweli",
    yourName: "Jina Lako",
    emailAddress: "Barua Pepe",
    subject: "Aina ya Mradi",
    yourMessage: "Maono Yako",
    send: "Zindua Mradi",
    sending: "Inatengeneza...",
    messageSent: "Imefanikiwa!",
    successMessage: "Tutawasiliana nawe ndani ya masaa 2 kujadili mradi wako.",
    howToContact: "Mchakato Wetu",
    responseTime: "Muda wa Kujibu",
    officeHours: "Masaa ya Kazi",
    withinHours: "Ndani ya masaa 2",
    monFri: "Jumatatu-Jumapili, 8AM-10PM",
    chooseMethod: "Chagua Njia",
    fillDetails: "Shiriki Maelezo",
    describeRequest: "Eleza Maono",
    submitWait: "Tutashughulikia",
    available247: "Inapatikana Daima",
    response2Hours: "Jibu la Haraka",
    instantResponse: "Anza Mara Moja",
    bookAppointment: "Kutana na Timu",
    contactForm: "Kianzishi cha Mradi",
    watchTutorial: "Angalia Jinsi Inavyofanya Kazi",
    replayTutorial: "Tazama Tena",
    namePlaceholder: "Weka jina lako",
    emailPlaceholder: "barua.pepe@creative.com",
    subjectPlaceholder: "Programu ya Wavuti / Rununu / Ubunifu",
    messagePlaceholder: "Tuambie kuhusu mradi wako wa ndoto...",
    stop: "Simamisha Onyesho",
    step: "Hatua",
    of: "ya"
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
  const [currentStep, setCurrentStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play tutorial
  const [currentVideoStep, setCurrentVideoStep] = useState(0);
  const videoIntervalRef = useRef(null);

  const { language, toggleLanguage } = useLanguage();

  const t = (key) => translations[language]?.[key] || key;

  // Floating background elements
  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
    size: 20 + Math.random() * 40
  }));

  // Video tutorial simulation
  const videoSteps = [
    { 
      duration: 3000, 
      step: 1, 
      description: t('chooseMethod'),
      animation: "👆"
    },
    { 
      duration: 3000, 
      step: 2, 
      description: t('fillDetails'),
      animation: "✍️"
    },
    { 
      duration: 3000, 
      step: 3, 
      description: t('describeRequest'),
      animation: "💭"
    },
    { 
      duration: 3000, 
      step: 4, 
      description: t('submitWait'),
      animation: "🚀"
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
    }, 3000);
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
    // Auto-start tutorial
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
      icon: <Phone className="w-5 h-5" />,
      title: language === 'en' ? "Quick Call" : "Simu ya Haraka",
      description: "+255 (755) 123-456",
      action: t('available247'),
      color: "from-green-400 to-green-600"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: language === 'en' ? "Email Project" : "Tuma Mradi",
      description: "hello@creative.co",
      action: t('response2Hours'),
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: language === 'en' ? "Live Chat" : "Soga Moja kwa Moja",
      description: language === 'en' ? "Instant connect" : "Unganisha mara moja",
      action: t('instantResponse'),
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: language === 'en' ? "Meet Team" : "Kutana na Timu",
      description: "Dar es Salaam, TZ",
      action: t('bookAppointment'),
      color: "from-red-400 to-red-600"
    }
  ];

  // Theme classes
  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900';

  const cardTheme = darkMode 
    ? 'bg-gray-800/80 backdrop-blur-lg text-white border-gray-700/50'
    : 'bg-white/80 backdrop-blur-lg text-gray-900 border-white/50';

  const inputTheme = darkMode
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
    : 'bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent';

  return (
    <div className={`min-h-screen py-8 px-4 transition-all duration-500 overflow-hidden relative ${themeClasses}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className={`absolute rounded-full opacity-10 ${
              darkMode ? 'bg-cyan-400' : 'bg-purple-400'
            }`}
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
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Controls */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-2xl backdrop-blur-lg border ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700 text-yellow-400' 
                  : 'bg-white/50 border-white/20 text-gray-700'
              } transition-all duration-300`}
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </motion.button>

           
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4"
          >
            <div className={`p-3 rounded-2xl ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } backdrop-blur-lg border ${
              darkMode ? 'border-gray-700' : 'border-white/20'
            }`}>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6"
            key={language}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed"
            key={`subtitle-${language}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - iPhone Template with Integrated Tutorial */}
          <div className="space-y-8">
            {/* iPhone 17 Pro Mockup with Integrated Controls */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative mx-auto max-w-sm"
            >
              {/* iPhone Frame */}
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-[60px] p-6 shadow-2xl border-[14px] border-gray-900 relative overflow-hidden">
                {/* Dynamic Border Glow */}
                <div className="absolute inset-0 rounded-[46px] bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 blur-xl opacity-50" />
                
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl z-20"></div>
                
                {/* Screen Content */}
                <div className={`rounded-[50px] h-[600px] overflow-hidden relative transition-all duration-500 ${
                  darkMode ? 'bg-gray-900' : 'bg-white'
                }`}>
                  {/* Status Bar */}
                  <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white p-4 text-center relative">
                    <div className="flex justify-between items-center text-sm">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white rounded-full"></div>
                        <div className="w-1 h-4 bg-white rounded-full"></div>
                        <div className="w-1 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center space-x-2 mt-1">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-medium">Project Connect</span>
                    </div>
                  </div>

                  {/* Integrated Tutorial Controls */}
                  <div className="absolute top-20 right-4 z-30 flex flex-col space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={isPlaying ? stopTutorial : startTutorial}
                      className={`p-2 rounded-full backdrop-blur-lg ${
                        isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={replayTutorial}
                      className="p-2 rounded-full bg-blue-500 text-white backdrop-blur-lg"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </motion.button>
                  </div>

                  {/* App Content */}
                  <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
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
                          <h3 className="text-2xl font-bold mb-2">
                            {t('messageSent')}
                          </h3>
                          <p className="opacity-80">
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
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-bold mb-2">
                              {t('contactForm')}
                            </h3>
                            <p className="text-sm opacity-70">
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
                                  'rgba(34, 211, 238, 0.5)' : 'transparent',
                                boxShadow: isPlaying && currentVideoStep === 0 && index === 0 ? 
                                  '0 0 20px rgba(34, 211, 238, 0.3)' : 'none'
                              }}
                              transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 0 && index === 0 ? Infinity : 0 }}
                              className={`flex items-center p-4 rounded-2xl cursor-pointer border-2 backdrop-blur-lg ${
                                darkMode ? 'bg-gray-800/50' : 'bg-white/50'
                              } border-transparent hover:border-cyan-300 transition-all duration-300 relative overflow-hidden`}
                            >
                              {/* Animated background */}
                              <div className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-10`} />
                              
                              <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white mr-4 relative z-10`}>
                                {method.icon}
                              </div>
                              <div className="flex-1 relative z-10">
                                <h4 className="font-semibold">{method.title}</h4>
                                <p className="text-sm opacity-80">{method.description}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 opacity-60 relative z-10" />
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-20"
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0, y: 20 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl p-8 mx-6 text-center border border-gray-700/50 backdrop-blur-lg"
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
                          <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            {videoSteps[currentVideoStep]?.description}
                          </h3>
                          <p className="text-sm opacity-80 mb-4">
                            {t('step')} {currentVideoStep + 1} {t('of')} {videoSteps.length}
                          </p>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 3, ease: "linear" }}
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
            className={`rounded-3xl p-8 shadow-2xl border backdrop-blur-lg transition-all duration-500 ${cardTheme}`}
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block mb-4"
              >
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {t('sendMessage')}
              </h2>
              <p className="opacity-80 text-lg">
                {t('formSubtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                  animate={{
                    scale: isPlaying && currentVideoStep === 1 ? [1, 1.02, 1] : 1,
                    borderColor: isPlaying && currentVideoStep === 1 ? 'rgba(34, 211, 238, 0.5)' : 'transparent',
                  }}
                  transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 1 ? Infinity : 0 }}
                >
                  <label className="flex items-center text-sm font-medium">
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
                    className={`w-full px-4 py-4 border-2 rounded-2xl transition-all duration-300 ${inputTheme}`}
                    placeholder={t('namePlaceholder')}
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                  animate={{
                    scale: isPlaying && currentVideoStep === 1 ? [1, 1.02, 1] : 1,
                    borderColor: isPlaying && currentVideoStep === 1 ? 'rgba(34, 211, 238, 0.5)' : 'transparent',
                  }}
                  transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 1 ? Infinity : 0 }}
                >
                  <label className="flex items-center text-sm font-medium">
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
                    className={`w-full px-4 py-4 border-2 rounded-2xl transition-all duration-300 ${inputTheme}`}
                    placeholder={t('emailPlaceholder')}
                  />
                </motion.div>
              </div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="space-y-2"
                animate={{
                  scale: isPlaying && currentVideoStep === 2 ? [1, 1.02, 1] : 1,
                  borderColor: isPlaying && currentVideoStep === 2 ? 'rgba(34, 211, 238, 0.5)' : 'transparent',
                }}
                transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 2 ? Infinity : 0 }}
              >
                <label className="flex items-center text-sm font-medium">
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
                  className={`w-full px-4 py-4 border-2 rounded-2xl transition-all duration-300 ${inputTheme}`}
                  placeholder={t('subjectPlaceholder')}
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="space-y-2"
                animate={{
                  scale: isPlaying && currentVideoStep === 2 ? [1, 1.02, 1] : 1,
                  borderColor: isPlaying && currentVideoStep === 2 ? 'rgba(34, 211, 238, 0.5)' : 'transparent',
                }}
                transition={{ duration: 0.5, repeat: isPlaying && currentVideoStep === 2 ? Infinity : 0 }}
              >
                <label className="flex items-center text-sm font-medium">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('yourMessage')}
                </label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  whileFocus={{ scale: 1.01 }}
                  className={`w-full px-4 py-4 border-2 rounded-2xl transition-all duration-300 resize-none ${inputTheme}`}
                  placeholder={t('messagePlaceholder')}
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  scale: isPlaying && currentVideoStep === 3 ? [1, 1.05, 1] : 1,
                  background: isPlaying && currentVideoStep === 3 ? [
                    'linear-gradient(135deg, #22d3ee, #3b82f6, #8b5cf6)',
                    'linear-gradient(135deg, #8b5cf6, #22d3ee, #3b82f6)',
                    'linear-gradient(135deg, #3b82f6, #8b5cf6, #22d3ee)',
                  ] : 'linear-gradient(135deg, #22d3ee, #3b82f6, #8b5cf6)'
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: isPlaying && currentVideoStep === 3 ? Infinity : 0,
                  background: { duration: 2 }
                }}
                className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white py-5 px-6 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
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
              className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 text-white mr-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('responseTime')}</h4>
                    <p className="text-sm opacity-80">{t('withinHours')}</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-white mr-4">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t('officeHours')}</h4>
                    <p className="text-sm opacity-80">{t('monFri')}</p>
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