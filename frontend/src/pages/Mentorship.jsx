import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Award, ChevronRight, Video, MessageSquare, Calendar, ArrowRight, Eye, DollarSign, User, X } from 'lucide-react';

export default function Mentorship() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);


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

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/backend/sessions/all');
            const data = await res.json();
            
            if (res.ok && data.success) {
                setSessions(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMentorProfile = (mentorId) => {
        navigate(`/mentor-profile/${mentorId}`);
    };

    const handleJoinSession = async (sessionId) => {
        if (!currentUser) {
            navigate('/sign-in');
            return;
        }

        try {
            const res = await fetch(`/backend/sessions/${sessionId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                alert('Successfully registered for session!');
                fetchSessions(); // Refresh sessions
            } else {
                alert(data.message || 'Failed to join session');
            }
        } catch (err) {
            alert('Failed to join session');
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

            {/* Available Sessions Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Available
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Sessions</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Join expert-led sessions and accelerate your learning journey
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading sessions...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">No sessions available at the moment</p>
                            <p className="text-gray-500">Check back later for new mentoring sessions</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sessions.map((session) => (
                                <div
                                    key={session._id}
                                    className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="relative bg-white rounded-3xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Video className="w-5 h-5 text-purple-600" />
                                                <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                                    {session.sessionType}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-bold text-green-600">${session.price}</span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">{session.description}</p>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                <span>{session.duration} minutes</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(session.scheduledDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4" />
                                                <span>{session.participants.length}/{session.maxParticipants} participants</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewMentorProfile(session.mentorId._id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                            >
                                                <User className="w-4 h-4" />
                                                View Mentor
                                            </button>
                                            <button
                                                onClick={() => handleJoinSession(session._id)}
                                                disabled={session.participants.length >= session.maxParticipants}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Eye className="w-4 h-4" />
                                                {session.participants.length >= session.maxParticipants ? 'Full' : 'Join'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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