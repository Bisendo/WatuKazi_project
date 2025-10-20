import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Rocket, 
  Target, 
  Heart, 
  Globe, 
  Award,
  TrendingUp,
  Shield,
  Sparkles,
  Star,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Quote
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

// Translation content
const translations = {
  en: {
    title: "Crafting Digital Excellence",
    subtitle: "We transform visionary ideas into extraordinary digital experiences that captivate audiences and drive meaningful results.",
    ourStory: "Our Journey",
    storyTitle: "From Passion to Global Impact",
    storyContent: "Founded in 2015, we started as a small team of passionate developers with a big dream: to create digital solutions that matter. Today, we're a global family of 50+ innovators, designers, and strategists working with Fortune 500 companies and startups alike.",
    mission: "Our Mission",
    missionTitle: "Empowering Dreams Through Technology",
    missionContent: "We believe technology should be an enabler, not a barrier. Our mission is to build intuitive, powerful solutions that help businesses thrive in the digital age while maintaining human connection at the core.",
    vision: "Our Vision",
    visionTitle: "Shaping the Future of Digital Interaction",
    visionContent: "We envision a world where technology seamlessly enhances human experiences, where every digital interaction feels natural, meaningful, and delightful.",
    values: "Our Values",
    team: "Meet Our Team",
    stats: "By The Numbers",
    clients: "Happy Clients",
    projects: "Projects Delivered",
    countries: "Countries Served",
    awards: "Awards Won",
    years: "Years of Excellence",
    satisfaction: "Client Satisfaction",
    innovation: "Culture of Innovation",
    innovationContent: "We constantly push boundaries and explore new technologies to deliver cutting-edge solutions that set industry standards.",
    quality: "Uncompromising Quality",
    qualityContent: "Every line of code, every design element, and every strategy is crafted with meticulous attention to detail and excellence.",
    partnership: "True Partnership",
    partnershipContent: "We build lasting relationships with our clients, becoming an extension of their team and sharing in their success.",
    impact: "Meaningful Impact",
    impactContent: "We choose projects that make a difference, working with organizations that drive positive change in their communities.",
    watchStory: "Watch Our Story",
    ourTeam: "Creative Minds Behind The Magic",
    teamSubtitle: "Meet the brilliant individuals who turn complex challenges into elegant solutions",
    ceo: "Chief Executive Officer",
    cto: "Chief Technology Officer",
    leadDesigner: "Lead Product Designer",
    devLead: "Development Lead",
    marketing: "Marketing Director",
    operations: "Operations Manager",
    seeMore: "See More Team Members",
    testimonials: "What Our Clients Say",
    testimonial1: "Working with this team transformed our digital presence. Their attention to detail and creative approach exceeded all expectations.",
    testimonial2: "The platform they built handles millions of users seamlessly. Their technical expertise is matched only by their professionalism.",
    testimonial3: "A true partnership from day one. They understood our vision and delivered beyond what we thought possible.",
    client1: "Sarah Chen",
    client1Role: "CTO at TechInnovate",
    client2: "Marcus Rodriguez",
    client2Role: "Founder of StartupGrid",
    client3: "Elena Petrova",
    client3Role: "Digital Director at GlobalCorp"
  },
  sw: {
    title: "Tunaboresha Ubora wa Kidijitali",
    subtitle: "Tunabadilisha dhana za kiujanja kuwa uzoefu wa kidijitali wa kipekee unaovutia watazamaji na kuleta matokeo yenye maana.",
    ourStory: "Safari Yetu",
    storyTitle: "Kutoka Kwa Passion Hadi Athari ya Kimataifa",
    storyContent: "Tulianzishwa mwaka 2015, tukaanza kama timu ndogo ya wasanidi programu wenye hamu kubwa: kuunda suluhisho za kidijitali zenye maana. Leo, sisi ni familia ya kimataifa ya wabunifu 50+, wabunifu, na wanaserikali wanaofanya kazi na kampuni za Fortune 500 na startups vilevile.",
    mission: "Dhamira Yetu",
    missionTitle: "Kuwawezesha Ndoto Kupitia Teknolojia",
    missionContent: "Tunaamini teknolojia inapaswa kuwa mwezeshaji, sio kikwazo. Dhamira yetu ni kujenga suluhisho zenye ufahamu, zenye nguvu ambazo husaidia biashara kustawi katika enzi ya kidijitali huku tukidumisha uhusiano wa kibinadamu kwenye msingi.",
    vision: "Maono Yetu",
    visionTitle: "Kuunda Mustakabali wa Mwingiliano wa Kidijitali",
    visionContent: "Tunaona ulimwengu ambapo teknolojia inaboresha uzoefu wa kibinadamu kwa urahisi, ambapo kila mwingiliano wa kidijitali unahisi kuwa asili, wenye maana, na wa kufurahisha.",
    values: "Thamani Zetu",
    team: "Kukutana na Timu Yetu",
    stats: "Kwa Nambari",
    clients: "Wateja Waliofurahi",
    projects: "Miradi Iliyowasilishwa",
    countries: "Nchi Zilizohudumiwa",
    awards: "Tuzo Zilizoshinda",
    years: "Miaka ya Ubora",
    satisfaction: "Uridhiko wa Mteja",
    innovation: "Utamaduni wa Ubunifu",
    innovationContent: "Sisi huendelea kusukuma mipaka na kuchunguza teknolojia mpya ili kutoa suluhisho za kisasa ambazo zinaweka viwango vya tasnia.",
    quality: "Ubora Usiokubaliana",
    qualityContent: "Kila mstari wa code, kila kipengele cha muundo, na kila mkakati huundwa kwa umakini mkubwa wa undani na ubora.",
    partnership: "Ushirika wa Kweli",
    partnershipContent: "Sisi huunda uhusiano wa kudumu na wateja wetu, tukawa nyongeza ya timu yao na kushiriki katika mafanikio yao.",
    impact: "Athari Yenye Maana",
    impactContent: "Tunachagua miradi inayofanya tofauti, kufanya kazi na mashirika yanayoendesha mabadiliko chanya katika jamii zao.",
    watchStory: "Tazama Hadithi Yetu",
    ourTeam: "Akili Ubunifu Nyuma ya Uchawi",
    teamSubtitle: "Kukutana na watu brilliant ambao hugeuka changamoto ngumu kuwa suluhisho za kifahari",
    ceo: "Mkurugenzi Mtendaji",
    cto: "Mkurugenzi wa Teknolojia",
    leadDesigner: "Kiongozi Mbunifu wa Bidhaa",
    devLead: "Kiongozi wa Maendeleo",
    marketing: "Mkurugenzi wa Uuzaji",
    operations: "Meneja wa Uendeshaji",
    seeMore: "Ona Wanachama Zaidi wa Timu",
    testimonials: "Wateja Wetu Wasemaje",
    testimonial1: "Kufanya kazi na timu hii ilibadilisha uwepo wetu wa kidijitali. Umakini wao wa undani na mbinu ya ubunifu ilizidi matarajio yote.",
    testimonial2: "jukwaa walilojenga inashughulikia mamilioni ya watumiaji kwa urahisi. Utaalam wao wa kiufundi unalinganishwa na uhalisi wao.",
    testimonial3: "Ushirika wa kweli tangu siku ya kwanza. Walielewa maono yetu na kutoa zaidi ya tulichofikiria kuwezekana.",
    client1: "Sarah Chen",
    client1Role: "CTO katika TechInnovate",
    client2: "Marcus Rodriguez",
    client2Role: "Mwanzilishi wa StartupGrid",
    client3: "Elena Petrova",
    client3Role: "Mkurugenzi wa Kidijitali katika GlobalCorp"
  }
};

const AboutUs = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [visibleTeamMembers, setVisibleTeamMembers] = useState(6);
  const { language, toggleLanguage } = useLanguage();

  const t = (key) => translations[language]?.[key] || key;

  // Floating background elements
  const floatingElements = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 12,
    size: 15 + Math.random() * 35
  }));

  // Statistics data
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "250+", label: t('clients') },
    { icon: <Rocket className="w-8 h-8" />, value: "500+", label: t('projects') },
    { icon: <Globe className="w-8 h-8" />, value: "40+", label: t('countries') },
    { icon: <Award className="w-8 h-8" />, value: "25+", label: t('awards') },
    { icon: <Clock className="w-8 h-8" />, value: "8+", label: t('years') },
    { icon: <Heart className="w-8 h-8" />, value: "99%", label: t('satisfaction') }
  ];

  // Values data
  const values = [
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: t('innovation'),
      description: t('innovationContent'),
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: t('quality'),
      description: t('qualityContent'),
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: t('partnership'),
      description: t('partnershipContent'),
      color: "from-green-400 to-emerald-400"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: t('impact'),
      description: t('impactContent'),
      color: "from-orange-400 to-red-400"
    }
  ];

  // Team members
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: t('ceo'),
      image: "👨‍💼",
      bio: "Visionary leader with 15+ years in tech innovation",
      color: "from-blue-400 to-cyan-400"
    },
    {
      name: "Maria Garcia",
      role: t('cto'),
      image: "👩‍💻",
      bio: "Tech evangelist passionate about scalable architecture",
      color: "from-purple-400 to-pink-400"
    },
    {
      name: "David Kim",
      role: t('leadDesigner'),
      image: "👨‍🎨",
      bio: "Award-winning designer focused on user-centric experiences",
      color: "from-green-400 to-emerald-400"
    },
    {
      name: "Sarah Williams",
      role: t('devLead'),
      image: "👩‍🔧",
      bio: "Full-stack wizard with expertise in modern frameworks",
      color: "from-orange-400 to-red-400"
    },
    {
      name: "James Brown",
      role: t('marketing'),
      image: "👨‍💼",
      bio: "Growth strategist with proven track record in digital marketing",
      color: "from-indigo-400 to-purple-400"
    },
    {
      name: "Lisa Chen",
      role: t('operations'),
      image: "👩‍💼",
      bio: "Operations expert ensuring seamless project delivery",
      color: "from-teal-400 to-blue-400"
    },
    {
      name: "Mike Taylor",
      role: "Senior Developer",
      image: "👨‍💻",
      bio: "Backend specialist with cloud infrastructure expertise",
      color: "from-yellow-400 to-orange-400"
    },
    {
      name: "Emma Davis",
      role: "UX Researcher",
      image: "👩‍🔬",
      bio: "User advocate with deep understanding of human behavior",
      color: "from-pink-400 to-rose-400"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: t('testimonial1'),
      author: t('client1'),
      role: t('client1Role'),
      rating: 5
    },
    {
      quote: t('testimonial2'),
      author: t('client2'),
      role: t('client2Role'),
      rating: 5
    },
    {
      quote: t('testimonial3'),
      author: t('client3'),
      role: t('client3Role'),
      rating: 5
    }
  ];

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900';

  const cardTheme = darkMode 
    ? 'bg-gray-800/80 backdrop-blur-lg text-white border-gray-700/50'
    : 'bg-white/80 backdrop-blur-lg text-gray-900 border-white/50';

  return (
    <div className={`min-h-screen py-12 px-4 transition-all duration-500 overflow-hidden relative ${themeClasses}`}>
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
              y: [0, -40, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
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
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-6"
          >
            <div className={`p-4 rounded-3xl ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            } backdrop-blur-lg border ${
              darkMode ? 'border-gray-700' : 'border-white/20'
            }`}>
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6"
            key={language}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('title')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl opacity-80 max-w-4xl mx-auto leading-relaxed"
            key={`subtitle-${language}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`text-center p-6 rounded-3xl backdrop-blur-lg border ${cardTheme} transition-all duration-300`}
            >
              <div className="flex justify-center mb-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 text-white`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story/Mission/Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-3xl p-8 md:p-12 mb-20 backdrop-blur-lg border ${cardTheme}`}
        >
          <div className="flex flex-wrap gap-4 mb-8">
            {['story', 'mission', 'vision'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white'
                    : darkMode 
                      ? 'bg-gray-700/50 text-gray-300' 
                      : 'bg-white/50 text-gray-600'
                }`}
              >
                {t(tab === 'story' ? 'ourStory' : tab === 'mission' ? 'mission' : 'vision')}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-8 items-center"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {t(activeTab === 'story' ? 'storyTitle' : activeTab === 'mission' ? 'missionTitle' : 'visionTitle')}
                </h2>
                <p className="text-lg md:text-xl opacity-80 leading-relaxed">
                  {t(activeTab === 'story' ? 'storyContent' : activeTab === 'mission' ? 'missionContent' : 'visionContent')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-2xl font-semibold flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>{t('watchStory')}</span>
                </motion.button>
              </div>
              
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className={`w-full h-80 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-purple-400/20 backdrop-blur-lg border ${
                  darkMode ? 'border-gray-700' : 'border-white/20'
                } flex items-center justify-center`}>
                  <div className="text-6xl">🚀</div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t('values')}
          </h2>
          <p className="text-xl text-center opacity-80 mb-12 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-6 rounded-3xl backdrop-blur-lg border ${cardTheme} transition-all duration-300`}
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${value.color} text-white w-fit mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="opacity-80 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t('ourTeam')}
            </h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto">
              {t('teamSubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {teamMembers.slice(0, visibleTeamMembers).map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-6 rounded-3xl backdrop-blur-lg border ${cardTheme} transition-all duration-300 text-center`}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${member.color} text-white text-3xl flex items-center justify-center mx-auto mb-4`}>
                  {member.image}
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-cyan-400 font-semibold mb-3">{member.role}</p>
                <p className="text-sm opacity-80">{member.bio}</p>
              </motion.div>
            ))}
          </div>

          {visibleTeamMembers < teamMembers.length && (
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setVisibleTeamMembers(teamMembers.length)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-400 text-white rounded-2xl font-semibold flex items-center space-x-2 mx-auto"
              >
                <Users className="w-5 h-5" />
                <span>{t('seeMore')}</span>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={`rounded-3xl p-8 md:p-12 backdrop-blur-lg border ${cardTheme}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t('testimonials')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`p-6 rounded-3xl backdrop-blur-lg border ${cardTheme} transition-all duration-300`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-cyan-400 mb-4" />
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm opacity-80">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;