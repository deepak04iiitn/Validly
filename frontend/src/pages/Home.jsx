import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Shield, TrendingUp, Zap, Star, CheckCircle, ArrowRight, Play, MessageCircle, Target } from 'lucide-react';

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
      description: "Connect with developers, designers, and co-founders who share your vision and passion."
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
    }
  ];

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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="inline-block animate-[slideInLeft_1s_ease-out_0.5s_both]">Stop guessing.</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent inline-block animate-[slideInRight_1s_ease-out_0.7s_both]">
                Start validating.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_1s_ease-out_0.9s_forwards]">
              Test your startup ideas before you build. Connect with validators, collaborators, and mentors in a safe, structured environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 opacity-0 animate-[fadeInUp_1s_ease-out_1.1s_forwards]">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 flex items-center group relative overflow-hidden cursor-pointer">
                <span className="relative z-10">Start Validating Free</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-300 font-semibold group cursor-pointer">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </button>
            </div>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 opacity-0 animate-[fadeInUp_1s_ease-out_1.3s_forwards]">
              {[
                { text: "Free to start", delay: "0s" },
                { text: "No credit card required", delay: "0.1s" },
                { text: "Safe & secure", delay: "0.2s" }
              ].map((item, index) => (
                <div key={index} className={`flex items-center animate-[bounceIn_0.8s_ease-out_${1.5 + index * 0.1}s_both]`}>
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div id="animate-features-title" className={`text-center mb-16 transition-all duration-1000 ${isVisible['animate-features-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to validate your startup idea
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From structured feedback to collaboration tools, we've got you covered at every step of your startup journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                id={`animate-feature-${index}`}
                className={`bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 group cursor-pointer ${
                  isVisible[`animate-feature-${index}`] 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
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

      {/* CTA Section */}
      <section className="py-20 mb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-ping delay-2000"></div>
        </div>
        
        <div id="animate-cta" className={`max-w-4xl mx-auto text-center text-white relative transition-all duration-1000 ${isVisible['animate-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to validate your next big idea?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of entrepreneurs who've turned their ideas into successful startups with Validly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group">
              <span className="relative z-10">Start Validating Free</span>
              <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1">
              Book a Demo
            </button>
          </div>
        </div>
      </section>

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