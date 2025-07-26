import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Shield, TrendingUp, Zap, Star, CheckCircle, ArrowRight, Play, MessageCircle, Target, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Tech Entrepreneur",
      content: "Validly helped me validate my SaaS idea in just 2 weeks. The structured feedback saved me months of development time.",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Indie Hacker",
      content: "Found my co-founder through Validly's collaboration features. We're now building our second startup together!",
      avatar: "MR"
    },
    {
      name: "Emily Johnson",
      role: "Student Founder",
      content: "The mentorship sessions were game-changing. Got advice from seasoned entrepreneurs who've been where I am.",
      avatar: "EJ"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id^="animate-"]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Safe Idea Sharing",
      description: "Share your ideas with confidence using our privacy controls, proof-of-posting, and community guidelines."
    },
    {
      icon: Target,
      title: "Real Validation",
      description: "Get actionable feedback with structured polls and measurable interest signals from your target audience."
    },
    {
      icon: Users,
      title: "Find Collaborators",
      description: "Connect with developers, designers, founders, co-founders and hackathon participants who share your vision and passion."
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor reactions, upvotes, and collaboration interest with your personal validation dashboard."
    },
    {
      icon: MessageCircle,
      title: "Expert Mentorship",
      description: "Book 1:1 sessions with experienced entrepreneurs and get guidance from those who've built successful startups."
    },
    {
      icon: Users,
      title: "Join and Create Communities",
      description: "Engage with like-minded founders, join interest-based groups, or start your own community to grow your network and support system."
    },
    // New Features
    {
      icon: Star,
      title: "Weekly Startup Idea Competitions",
      description: "Compete in weekly contests for the best startup idea, win badges, premium features, and boost your visibility. Community voting encourages high-quality submissions."
    },
    {
      icon: MessageCircle,
      title: "Startup-Related Posts",
      description: "Share tips, experiences, and resources. Create posts with text, images, and links to spark discussions in a social feed for startup enthusiasts."
    },
    {
      icon: Lightbulb,
      title: "Promote Your Business, Startup, Website, or App",
      description: "Spotlight your startup, landing page, website, or app to the Validly community. Create promotion posts with visuals, CTAs, and links, target your audience, collect feedback, and track real engagement—all within Validly. Earn or buy promotion credits for extra reach."
    },
  ];

  // State for showing all features
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const timelineSteps = [
    {
      step: "01",
      title: "Share Your Idea",
      description: "Share the gist of your idea, your aim, or the problem you are solving. Be concise and authentic—your story could inspire your next collaborator!",
      icon: "💡",
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "02",
      title: "Get Feedback",
      description: "Receive structured feedback through polls, comments, and validation signals from the community. Our smart matching algorithm connects you with relevant validators.",
      icon: "📊",
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "03",
      title: "Find Partners",
      description: "Connect with potential co-founders, developers, and collaborators who want to join your journey. Build your dream team with compatibility scoring.",
      icon: "🤝",
      color: "from-green-500 to-teal-500"
    },
    {
      step: "04",
      title: "Build & Launch",
      description: "Use insights and connections to build your MVP and launch with confidence and support. Access our network of mentors and investors.",
      icon: "🚀",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center">
        {/* Background Video - Hidden on mobile */}
        {/* Removed video background for all devices */}
        
        {/* Mobile Background - Subtle gradient with elegant bubbles for smaller devices */}
        <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
          {/* Subtle animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
          </div>
        </div>
        
        {/* Floating Elements for Visual Interest */}
        <div className="absolute inset-0 pointer-events-none z-5">
          <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-32 right-20 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-75" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-10 w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce opacity-60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="mt-26 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-32">
          <div className="text-center">
            
            {/* Enhanced Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight">
              <span className="inline-block animate-[slideInLeft_1s_ease-out_0.5s_both]">
                Stop guessing.
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent inline-block animate-[slideInRight_1s_ease-out_0.7s_both]">
                Start validating.
              </span>
            </h1>
            
            {/* Enhanced Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-10 leading-relaxed opacity-0 animate-[fadeInUp_1s_ease-out_0.9s_forwards] max-w-5xl mx-auto font-semibold">
              Test your startup ideas before you build. Connect with validators, collaborators, mentors in a safe, structured environment and much more...
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16 opacity-0 animate-[fadeInUp_1s_ease-out_1.1s_forwards] justify-center">
              <button className="group relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-[0_20px_40px_rgba(147,51,234,0.4)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 flex items-center justify-center overflow-hidden cursor-pointer">
                <span className="relative z-10 flex items-center">
                  Start Validating Free
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="group flex items-center justify-center text-gray-700 hover:text-purple-600 transition-all duration-300 font-bold text-lg cursor-pointer bg-gray-100 backdrop-blur-md border border-gray-300 px-8 py-5 rounded-2xl hover:bg-gray-200 hover:border-gray-400 shadow-xl hover:shadow-2xl transform hover:scale-105">
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </button>
            </div>
            
            {/* Enhanced Features List (with emoji icons and glassmorphism) */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-lg text-gray-700 justify-center items-center mt-6 mb-6 opacity-0 animate-[fadeInUp_1s_ease-out_1.3s_forwards]">
              {[ 
                { text: "Free to start", icon: "🚀" },
                { text: "No credit card required", icon: "💳" },
                { text: "Safe & secure", icon: "🔒" }
              ].map((item, index) => (
                <div key={index} className="flex items-center font-bold gap-2 px-2 py-1">
                  <span className="text-2xl mr-2">{item.icon}</span>
                  <span className="font-semibold text-lg">{item.text}</span>
                </div>
              ))}
            </div>
            
          </div>
        </div>
        
      {/* Enhanced Scroll Indicator - always at the bottom of the hero section */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none opacity-0 animate-[fadeInUp_1s_ease-out_1.5s_forwards]">
        <div className="w-8 h-12 border-2 border-gray-400 md:border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-gray-100/80 md:bg-white/10 animate-bounce">
          <div className="w-1 h-4 bg-gray-600 md:bg-white/80 rounded-full mt-2 animate-pulse"></div>
        </div>
        <p className="text-gray-600 md:text-white/80 text-xs mt-2 font-semibold md:drop-shadow">Scroll to explore</p>
      </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div id="animate-features-title" className={`text-center mb-20 transition-all duration-1000 ${isVisible['animate-features-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}> 
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight drop-shadow-sm">
              Everything you need to validate your startup idea
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
              From structured feedback to collaboration tools, we've got you covered at every step of your startup journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(showAllFeatures ? features : features.slice(0, 6)).map((feature, index) => (
              <div
                key={index}
                id={`animate-feature-${index}`}
                className={`relative bg-white/80 backdrop-blur-lg border border-purple-100 shadow-2xl p-10 rounded-3xl transition-all duration-700 group cursor-pointer hover:scale-[1.035] hover:border-purple-300 hover:shadow-[0_8px_32px_0_rgba(80,0,200,0.10)] ${
                  isVisible[`animate-feature-${index}`]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                } ${showAllFeatures && index >= 6 ? 'animate-fadeInFeature' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/60 group-hover:ring-purple-300 transition-all duration-300 backdrop-blur-md">
                    <feature.icon className="w-9 h-9 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="pt-16 pb-2 px-2 flex flex-col items-center text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300 drop-shadow-sm">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg font-medium">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          {!showAllFeatures ? (
            <div className="flex justify-center mt-14">
              <button
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer animate-bounce"
                onClick={() => setShowAllFeatures(true)}
                aria-label="Show all features"
              >
                <ChevronDown className="w-10 h-10" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-14">
              <button
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer animate-bounce"
                onClick={() => setShowAllFeatures(false)}
                aria-label="Collapse features"
              >
                <ChevronUp className="w-10 h-10" />
              </button>
            </div>
          )}
          <style jsx>{`
            @keyframes fadeInFeature {
              from { opacity: 0; transform: translateY(30px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-fadeInFeature {
              animation: fadeInFeature 0.7s cubic-bezier(0.4,0,0.2,1) both;
            }
          `}</style>
        </div>
      </section>

      {/* Enhanced Timeline Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-10">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-purple-300"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div id="animate-timeline-title" className={`text-center mb-20 transition-all duration-1000 ${isVisible['animate-timeline-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Journey to Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow our proven 4-step process to turn your startup idea into reality
            </p>
          </div>
          
          {/* Desktop Timeline */}
          <div className="hidden lg:block relative">
            {/* Main Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-300 via-blue-300 to-green-300 rounded-full">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 rounded-full animate-pulse"></div>
            </div>
            
            {timelineSteps.map((step, index) => (
              <div 
                key={index} 
                id={`animate-timeline-${index}`}
                className={`relative flex items-center mb-24 transition-all duration-1000 ${
                  isVisible[`animate-timeline-${index}`] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                {/* Left Side Content (for even indices) */}
                {index % 2 === 0 && (
                  <div className="w-5/12 text-right pr-8">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-3xl group relative overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="text-4xl mb-4 animate-bounce">{step.icon}</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Center Circle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-2xl transition-all duration-500 hover:scale-125 hover:rotate-12 animate-pulse cursor-pointer`}>
                    <span className="text-xl">{step.step}</span>
                  </div>
                </div>
                
                {/* Right Side Content (for odd indices) */}
                {index % 2 === 1 && (
                  <div className="w-5/12 ml-auto pl-8">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-3xl group relative overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="text-4xl mb-4 animate-bounce">{step.icon}</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Mobile Timeline */}
          <div className="lg:hidden relative">
            {/* Mobile Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-blue-300 to-green-300 rounded-full">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 rounded-full animate-pulse"></div>
            </div>
            
            {timelineSteps.map((step, index) => (
              <div 
                key={index} 
                id={`animate-mobile-timeline-${index}`}
                className={`relative flex items-start mb-16 transition-all duration-1000 ${
                  isVisible[`animate-mobile-timeline-${index}`] 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Circle */}
                <div className="absolute left-8 transform -translate-x-1/2 z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-500 hover:scale-110 animate-pulse cursor-pointer`}>
                    <span className="text-lg">{step.step}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="ml-20 w-full">
                  <div className="bg-white p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 group relative overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="text-3xl mb-3 animate-bounce">{step.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div id="animate-testimonials-title" className={`mb-16 transition-all duration-1000 ${isVisible['animate-testimonials-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Trusted by startup builders
            </h2>
          </div>
          
          <div id="animate-testimonials-card" className={`bg-gradient-to-br from-purple-50 to-blue-50 p-8 md:p-12 rounded-2xl transition-all duration-1000 hover:shadow-2xl hover:scale-105 ${isVisible['animate-testimonials-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-6 h-6 text-yellow-400 fill-current transition-all duration-300 hover:scale-125`}
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            
            <blockquote className="text-xl md:text-2xl text-gray-800 mb-8 leading-relaxed transition-all duration-500 opacity-100">
              "{testimonials[currentTestimonial].content}"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4 transition-all duration-500">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                {testimonials[currentTestimonial].avatar}
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-500 hover:scale-125 cursor-pointer ${
                    index === currentTestimonial 
                      ? 'bg-purple-600 w-8 shadow-lg' 
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - now blended with the page, no explicit title, subtle intro */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-sm">Frequently Asked Questions <span className="text-purple-600">(FAQs)</span></h2>
            <p className="text-base md:text-lg text-gray-500">Have questions about Validly, collaboration, privacy, or getting started? Find answers below.</p>
          </div>
          <FAQAccordion />
        </div>
      </div>

      {/* CTA Section removed */}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const faqs = [
    {
      category: 'About Validly',
      icon: '📌',
      items: [
        {
          q: 'What is Validly?',
          a: 'Validly is a community-driven platform that helps you safely share, test, and validate your startup ideas before you build. It connects you with real feedback, collaborators, mentors, and early adopters.'
        },
        {
          q: 'Who is Validly for?',
          a: 'Students, aspiring founders, solo entrepreneurs, niche hackers, or anyone with an idea they want to test before investing time and money.'
        },
        {
          q: 'How is Validly different from Reddit, Indie Hackers, or co-founder platforms?',
          a: 'Unlike generic forums, Validly gives you structured idea templates, real validation signals (polls, feedback), proof-of-posting, privacy controls, and tools for building real communities or teams.'
        },
      ]
    },
    {
      category: 'Using the Platform',
      icon: '🖥️',
      items: [
        {
          q: 'What details do I need to sign up?',
          a: 'Just your name, email, and a short bio. You can add your skills, profile photo, and location to help others find you for collaborations, hackathons, or mentorship.'
        },
        {
          q: 'How do I share my idea safely?',
          a: 'Use Validly’s guided templates. You can choose to post publicly, privately, or anonymously, add polls for feedback, and even set your post to auto-delete after 7, 30, or 90 days. You’ll get a timestamp and unique link as proof-of-posting.'
        },
        {
          q: 'Can my ideas get stolen?',
          a: 'Validly promotes a trust-based community with clear norms and reporting tools. You can use built-in NDAs, control visibility, and download proof-of-posting for extra safety.'
        },
        {
          q: 'How do I get feedback on my idea?',
          a: 'Add polls like “Would you pay for this?” or “How would you improve this?”. Community members earn points for giving high-quality feedback, so you get real insights.'
        },
      ]
    },
    {
      category: 'Collaboration & Community',
      icon: '🤝',
      items: [
        {
          q: 'How can I find a co-founder or team?',
          a: 'Use Validly’s collaboration matching and direct messaging. You can also create or join communities, post jobs, or build hackathon squads.'
        },
        {
          q: 'What’s the Hackathon Squad feature?',
          a: 'It helps you find teammates for hackathons. Post your idea, roles you need, and commitment level. Others can apply, message you, and sync schedules.'
        },
        {
          q: 'Can I hire developers or freelancers?',
          a: 'Yes! Post job listings with your budget, timeline, and required skills. Developers can apply directly with portfolios.'
        },
      ]
    },
    {
      category: 'Validation Dashboard & Tools',
      icon: '📊',
      items: [
        {
          q: 'What is the Personal Validation Dashboard?',
          a: 'It’s your command center. You can track reactions, comments, collaboration requests, compare multiple ideas, and see which has the most potential.'
        },
        {
          q: 'How does the Milestone Roadmap work?',
          a: 'It’s an interactive tool to plan your next steps: define tasks, attach validation actions (polls, surveys, signups), and track real progress toward building your MVP.'
        },
      ]
    },
    {
      category: 'Mentorship & Earnings',
      icon: '🎓',
      items: [
        {
          q: 'Can I get a mentor?',
          a: 'Yes! You can book 1:1 mentorship sessions with experts on startup topics — or even offer your own sessions and earn money. Validly handles booking and payments.'
        },
      ]
    },
    {
      category: 'Safety & Privacy',
      icon: '🔒',
      items: [
        {
          q: 'Can I delete my idea?',
          a: 'Absolutely. You can delete your idea at any time or let it auto-delete after your chosen timeframe.'
        },
        {
          q: 'Is my data safe?',
          a: 'Validly uses standard security practices to protect your data. You control what you share publicly, privately, or anonymously.'
        },
      ]
    },
    {
      category: 'Plans & Pricing',
      icon: '💸',
      items: [
        {
          q: 'Is Validly free?',
          a: 'Yes! You can post ideas, get basic feedback, and join communities for free. Paid plans unlock advanced reports, AI insights, priority matches, and extra privacy tools.'
        },
      ]
    },
    {
      category: 'Promote Feature',
      icon: '🚀',
      items: [
        {
          q: 'What is the Promote feature?',
          a: 'The Promote feature lets you spotlight your business, startup, website, or app to Validly’s community. Share your landing page, beta, or new launch — get early adopters, waitlist sign-ups, or genuine feedback.'
        },
        {
          q: 'How does promotion work?',
          a: 'You create a dedicated promotion post with your pitch, visuals, and link. You can choose who sees it — everyone, niche groups, or relevant communities. Track engagement, clicks, and sign-ups right in your dashboard.'
        },
        {
          q: 'Is promotion free?',
          a: 'Every user gets free promotion credits for quality community activity. You can also buy extra credits to boost your post’s reach.'
        },
        {
          q: 'Why promote on Validly instead of ads elsewhere?',
          a: 'Validly’s audience is made up of startup enthusiasts, early adopters, and niche makers who genuinely care about new ideas. So you get feedback and traction from people who understand and can spread the word!'
        },
      ]
    },
  ];

  return (
    <div className="divide-y divide-purple-100 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md">
      {/* Tab/Category Selector */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-4 pt-6 pb-2">
        {faqs.map((section, idx) => (
          <button
            key={section.category}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 cursor-pointer
              ${activeSection === idx ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md scale-105' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
            onClick={() => {
              setActiveSection(idx);
              setOpenIndex(null);
            }}
            aria-selected={activeSection === idx}
          >
            <span className="text-lg md:text-xl">{section.icon}</span>
            <span>{section.category}</span>
          </button>
        ))}
      </div>
      {/* Only show the active section */}
      <div className="py-8 px-4 md:px-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl md:text-3xl">{faqs[activeSection].icon}</span>
          <span className="text-lg md:text-xl font-semibold text-purple-700 tracking-wide">{faqs[activeSection].category}</span>
        </div>
        <div className="space-y-4">
          {faqs[activeSection].items.map((item, idx) => {
            const isOpen = openIndex && openIndex.idx === idx;
            return (
              <div key={item.q} className="border border-purple-100 rounded-xl overflow-hidden transition-shadow duration-300 bg-white/90">
                <button
                  className={`w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none transition-colors duration-300 cursor-pointer ${isOpen ? 'bg-gradient-to-r from-purple-50 to-blue-50' : 'hover:bg-purple-50'}`}
                  onClick={() => setOpenIndex(isOpen ? null : { idx })}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-gray-900 text-base md:text-lg flex-1">{item.q}</span>
                  <span className={`ml-4 transform transition-transform duration-300 ${isOpen ? 'rotate-90 text-purple-600' : 'rotate-0 text-gray-400'}`}>▶</span>
                </button>
                <div
                  className={`px-6 pb-5 text-gray-700 text-base md:text-lg transition-all duration-500 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                  style={{
                    transitionProperty: 'max-height, opacity',
                  }}
                >
                  {isOpen && <p>{item.a}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-8 px-4 md:px-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="text-base font-medium text-purple-700">Still curious?</span>
          <p className="text-gray-500">Contact us through our help center or drop us a message in our community space!</p>
        </div>
      </div>
    </div>
  );
}