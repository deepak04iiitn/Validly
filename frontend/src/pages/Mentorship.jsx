import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Award, ChevronRight, Video, MessageSquare, Calendar, ArrowRight } from 'lucide-react';

export default function Mentorship() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

    const mentorshipFeatures = [
        {
            icon: <Video className="w-6 h-6" />,
            title: "1:1 Video Sessions",
            description: "Personal guidance from experienced founders and industry experts"
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Ongoing Support",
            description: "Continuous mentorship through chat and regular check-ins"
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: "Flexible Scheduling",
            description: "Book sessions that fit your schedule, available 24/7"
        }
    ];

    const stats = [
        { number: "500+", label: "Expert Mentors" },
        { number: "10K+", label: "Sessions Completed" },
        { number: "95%", label: "Success Rate" },
        { number: "24/7", label: "Availability" }
    ];

    const handleBecomeMentor = () => {
        if (!currentUser) {
            navigate('/sign-in');
        } else {
            navigate('/mentorship/mentor-apply');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-purple-700 font-semibold text-sm mb-8 border border-purple-200 shadow-lg">
                            <Star className="w-4 h-4 fill-current" />
                            Premium Mentorship Platform
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent mb-6 leading-tight">
                            Accelerate Your
                            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Startup Journey
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Connect with world-class mentors, get personalized guidance, and transform your ideas into successful ventures
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button 
                                onClick={handleBecomeMentor}
                                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-w-[200px]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Become a Mentor
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-w-[200px]">
                                <span className="flex items-center gap-2">
                                    Find a Mentor
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Choose Our
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Mentorship</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience personalized guidance designed to accelerate your startup success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {mentorshipFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative"
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className={`relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 transition-all duration-500 transform ${
                                    hoveredCard === index ? 'scale-105 shadow-2xl' : ''
                                }`}>
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-0 transition-opacity duration-500 ${
                                        hoveredCard === index ? 'opacity-100' : ''
                                    }`}></div>
                                    
                                    <div className="relative bg-white rounded-3xl p-8">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <div className="text-purple-600">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                        
                        <div className="relative z-10">
                            <Award className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Share Your Expertise?
                            </h2>
                            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                                Join our elite network of mentors and help shape the next generation of successful entrepreneurs
                            </p>
                            <button 
                                onClick={handleBecomeMentor}
                                className="group px-10 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                            >
                                <span className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Become a Mentor Today
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}