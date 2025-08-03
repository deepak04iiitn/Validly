import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, DollarSign, MessageSquare, Clock, Users, Award, Star, ArrowLeft, Video, Globe, Briefcase, Building, Languages, BookOpen, Target } from 'lucide-react';

export default function MentorProfile() {
    const { mentorId } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMentorProfile();
    }, [mentorId]);

    const fetchMentorProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/backend/sessions/mentor/${mentorId}`);
            const data = await res.json();
            
            if (res.ok && data.success) {
                setMentor(data.data);
            } else {
                setError(data.message || 'Failed to load mentor profile');
            }
        } catch (err) {
            setError('Failed to load mentor profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading mentor profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">Mentor not found</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Sessions
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900">Mentor Profile</h1>
                </div>

                {/* Main Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="w-12 h-12" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold mb-2">{mentor.username}</h2>
                                {mentor.currentRole && mentor.currentOrganization && (
                                    <p className="text-purple-100 text-lg">
                                        {mentor.currentRole} at {mentor.currentOrganization}
                                    </p>
                                )}
                                {mentor.sessionPrice && (
                                    <div className="flex items-center gap-2 mt-3">
                                        <DollarSign className="w-5 h-5" />
                                        <span className="text-xl font-bold">${mentor.sessionPrice}/hour</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Main Information */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Bio */}
                                {mentor.shortBio && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <User className="w-5 h-5 text-purple-600" />
                                            About
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">{mentor.shortBio}</p>
                                    </div>
                                )}

                                {/* Detailed Bio */}
                                {mentor.detailedBio && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-purple-600" />
                                            Detailed Experience
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">{mentor.detailedBio}</p>
                                    </div>
                                )}

                                {/* Past Experience */}
                                {mentor.pastExperience && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-purple-600" />
                                            Past Experience
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">{mentor.pastExperience}</p>
                                    </div>
                                )}

                                {/* Expertise */}
                                {mentor.expertiseDomains && mentor.expertiseDomains.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-purple-600" />
                                            Expertise
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.expertiseDomains.map((domain, index) => (
                                                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                    {domain}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Mentorship Topics */}
                                {mentor.mentorshipTopics && mentor.mentorshipTopics.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-purple-600" />
                                            Mentorship Topics
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.mentorshipTopics.map((topic, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Languages */}
                                {mentor.languages && mentor.languages.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Languages className="w-5 h-5 text-purple-600" />
                                            Languages
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.languages.map((language, index) => (
                                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                    {language}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Session Types */}
                                {mentor.sessionTypes && mentor.sessionTypes.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Video className="w-5 h-5 text-purple-600" />
                                            Session Types
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.sessionTypes.map((type, index) => (
                                                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {(mentor.linkedIn || mentor.portfolioUrl) && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-purple-600" />
                                            Links
                                        </h3>
                                        <div className="space-y-2">
                                            {mentor.linkedIn && (
                                                <a 
                                                    href={mentor.linkedIn} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    LinkedIn Profile
                                                </a>
                                            )}
                                            {mentor.portfolioUrl && (
                                                <a 
                                                    href={mentor.portfolioUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    Portfolio
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Session Details */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
                                    <div className="space-y-3">
                                        {mentor.sessionPrice && (
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Price per hour</p>
                                                    <p className="font-semibold text-green-600">${mentor.sessionPrice}</p>
                                                </div>
                                            </div>
                                        )}
                                        {mentor.sessionDuration && (
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Session duration</p>
                                                    <p className="font-semibold text-gray-900">{mentor.sessionDuration} minutes</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Professional Info */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Info</h3>
                                    <div className="space-y-3">
                                        {mentor.currentRole && (
                                            <div className="flex items-center gap-3">
                                                <Briefcase className="w-5 h-5 text-purple-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Current Role</p>
                                                    <p className="font-semibold text-gray-900">{mentor.currentRole}</p>
                                                </div>
                                            </div>
                                        )}
                                        {mentor.currentOrganization && (
                                            <div className="flex items-center gap-3">
                                                <Building className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Organization</p>
                                                    <p className="font-semibold text-gray-900">{mentor.currentOrganization}</p>
                                                </div>
                                            </div>
                                        )}
                                        {mentor.bookingNotice && (
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-orange-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Booking Notice</p>
                                                    <p className="font-semibold text-gray-900">{mentor.bookingNotice}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Community Involvement */}
                                {mentor.communityInvolvement && (
                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Involvement</h3>
                                        <div className="space-y-2">
                                            {mentor.communityInvolvement.groupAMA && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-green-600" />
                                                    <span>Group AMA Sessions</span>
                                                </div>
                                            )}
                                            {mentor.communityInvolvement.contentWriting && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                                    <span>Content Writing</span>
                                                </div>
                                            )}
                                            {mentor.communityInvolvement.competitionJudge && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Award className="w-4 h-4 text-purple-600" />
                                                    <span>Competition Judge</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Action */}
                                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                                    <h3 className="text-lg font-semibold mb-4">Ready to Connect?</h3>
                                    <p className="text-purple-100 mb-4">Book a session with this mentor to accelerate your startup journey</p>
                                    <button
                                        onClick={() => navigate('/mentorship')}
                                        className="w-full bg-white text-purple-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        View Available Sessions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 