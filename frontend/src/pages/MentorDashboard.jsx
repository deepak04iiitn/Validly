import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, DollarSign, MessageSquare, AlertCircle, Plus, Edit, Video, Users, Clock, X } from 'lucide-react';

export default function MentorDashboard() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [mentorData, setMentorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [showSessionForm, setShowSessionForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [sessionForm, setSessionForm] = useState({
        title: '',
        description: '',
        sessionType: '1:1',
        topics: [],
        price: 0,
        duration: 60,
        maxParticipants: 1,
        scheduledDate: '',
        timeSlot: {
            startTime: '',
            endTime: ''
        },
        timezone: '',
        requirements: [],
        materials: []
    });

    useEffect(() => {
        if (!currentUser) {
            navigate('/sign-in');
            return;
        }

        const fetchMentorData = async () => {
            try {
                const res = await fetch('/backend/mentor/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                });
                const data = await res.json();
                
                if (!res.ok) {
                    setError(data.message || 'Failed to load dashboard');
                    setLoading(false);
                    return;
                }
                
                if (data.success) {
                    setMentorData(data);
                } else {
                    setError(data.message || 'Failed to load dashboard');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load dashboard');
                setLoading(false);
            }
        };

        fetchMentorData();
        
        // Fetch sessions if mentor is approved
        if (currentUser && currentUser.isMentor) {
            fetchSessions();
        }
    }, [currentUser, navigate]);

    const fetchSessions = async () => {
        try {
            const res = await fetch('/backend/sessions/my-sessions', {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setSessions(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching sessions:', err);
        }
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/backend/sessions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(sessionForm)
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setShowSessionForm(false);
                setSessionForm({
                    title: '',
                    description: '',
                    sessionType: '1:1',
                    topics: [],
                    price: 0,
                    duration: 60,
                    maxParticipants: 1,
                    scheduledDate: '',
                    timeSlot: { startTime: '', endTime: '' },
                    timezone: '',
                    requirements: [],
                    materials: []
                });
                fetchSessions();
            } else {
                setError(data.message || 'Failed to create session');
            }
        } catch (err) {
            setError('Failed to create session');
        }
    };

    const handleUpdateApplication = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/backend/mentor/update-application', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(mentorData.mentorProfile)
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setShowEditForm(false);
                setMentorData(prev => ({
                    ...prev,
                    mentorProfile: data.mentorProfile
                }));
            } else {
                setError(data.message || 'Failed to update application');
            }
        } catch (err) {
            setError('Failed to update application');
        }
    };

    const handleDeleteSession = async (sessionId) => {
        if (!window.confirm('Are you sure you want to delete this session?')) return;
        
        try {
            const res = await fetch(`/backend/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                fetchSessions();
            } else {
                setError(data.message || 'Failed to delete session');
            }
        } catch (err) {
            setError('Failed to delete session');
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!mentorData) return <div className="text-center py-12 text-red-500">No mentor data found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Mentor Dashboard</h1>
                
                <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <User className="w-8 h-8 text-purple-600" />
                            <div>
                                <h2 className="text-2xl font-semibold">Status: {mentorData.mentorStatus}</h2>
                                {mentorData.mentorStatus === 'pending' && (
                                    <p className="text-gray-600">Your application is under review. You'll be notified once approved.</p>
                                )}
                                {mentorData.mentorStatus === 'rejected' && (
                                    <p className="text-red-500">Your application was not approved. Please contact support for more information.</p>
                                )}
                                {mentorData.mentorStatus === 'approved' && (
                                    <p className="text-green-600">Your application has been approved! You can now start mentoring.</p>
                                )}
                            </div>
                        </div>
                        {mentorData.mentorStatus !== 'rejected' && (
                            <button
                                onClick={() => setShowEditForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Application
                            </button>
                        )}
                    </div>

                    {mentorData.mentorStatus === 'approved' && mentorData.mentorProfile && (
                        <>
                            <div className="flex items-center gap-4">
                                <MessageSquare className="w-8 h-8 text-purple-600" />
                                <div>
                                    <h2 className="text-2xl font-semibold">Mentorship Profile</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <p className="text-gray-600"><strong>Short Bio:</strong> {mentorData.mentorProfile.shortBio || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Topics:</strong> {mentorData.mentorProfile.mentorshipTopics?.join(', ') || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Expertise:</strong> {mentorData.mentorProfile.expertiseDomains?.join(', ') || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Languages:</strong> {mentorData.mentorProfile.languages?.join(', ') || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600"><strong>Price:</strong> ${mentorData.mentorProfile.sessionPrice || 0}/hour</p>
                                            <p className="text-gray-600"><strong>Duration:</strong> {mentorData.mentorProfile.sessionDuration || 'N/A'} minutes</p>
                                            <p className="text-gray-600"><strong>Session Types:</strong> {mentorData.mentorProfile.sessionTypes?.join(', ') || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Visibility:</strong> {mentorData.mentorProfile.visibility || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Calendar className="w-8 h-8 text-purple-600" />
                                <div>
                                    <h2 className="text-2xl font-semibold">Availability & Contact</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <p className="text-gray-600"><strong>Timezone:</strong> {mentorData.mentorProfile.timezone || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Booking Notice:</strong> {mentorData.mentorProfile.bookingNotice || 'N/A'}</p>
                                            {mentorData.mentorProfile.availableSlots && mentorData.mentorProfile.availableSlots.length > 0 ? (
                                                <div>
                                                    <p className="text-gray-600"><strong>Available Slots:</strong></p>
                                                    {mentorData.mentorProfile.availableSlots.map((slot, index) => (
                                                        <p key={index} className="text-gray-600 ml-4">{slot.day}: {slot.times?.join(', ') || 'N/A'}</p>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-600"><strong>Available Slots:</strong> Not set</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-gray-600"><strong>LinkedIn:</strong> {mentorData.mentorProfile.linkedIn || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Portfolio:</strong> {mentorData.mentorProfile.portfolioUrl || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Past Experience:</strong> {mentorData.mentorProfile.pastExperience ? 'Provided' : 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <DollarSign className="w-8 h-8 text-purple-600" />
                                <div>
                                    <h2 className="text-2xl font-semibold">Payment & Legal</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <p className="text-gray-600"><strong>Payment Method:</strong> {mentorData.mentorProfile.bankDetails?.paymentMethod || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Account Number:</strong> {mentorData.mentorProfile.bankDetails?.accountNumber || 'N/A'}</p>
                                            <p className="text-gray-600"><strong>Tax Info:</strong> {mentorData.mentorProfile.bankDetails?.taxInfo || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600"><strong>NDA Consent:</strong> {mentorData.mentorProfile.ndaConsent ? 'Agreed' : 'Not agreed'}</p>
                                            <p className="text-gray-600"><strong>Compliance Agreed:</strong> {mentorData.mentorProfile.complianceAgreed ? 'Yes' : 'No'}</p>
                                            <p className="text-gray-600"><strong>Government ID:</strong> {mentorData.mentorProfile.governmentId ? 'Provided' : 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Session Management */}
                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <Video className="w-8 h-8 text-purple-600" />
                                        <div>
                                            <h2 className="text-2xl font-semibold">My Sessions</h2>
                                            <p className="text-gray-600">Manage your mentoring sessions</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowSessionForm(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Session
                                    </button>
                                </div>

                                {sessions.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No sessions created yet</p>
                                        <p className="text-gray-500 text-sm">Create your first session to start mentoring</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {sessions.map((session) => (
                                            <div key={session._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-lg font-semibold">{session.title}</h3>
                                                    <button
                                                        onClick={() => handleDeleteSession(session._id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-gray-600 mb-2">{session.description}</p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                    <div>
                                                        <strong>Type:</strong> {session.sessionType}
                                                    </div>
                                                    <div>
                                                        <strong>Price:</strong> ${session.price}
                                                    </div>
                                                    <div>
                                                        <strong>Duration:</strong> {session.duration}min
                                                    </div>
                                                    <div>
                                                        <strong>Date:</strong> {new Date(session.scheduledDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {mentorData.mentorStatus === 'pending' && (
                        <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                            <div>
                                <h3 className="font-semibold text-yellow-800">Application Under Review</h3>
                                <p className="text-yellow-700">We're currently reviewing your application. This process typically takes 2-3 business days.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Session Creation Modal */}
            {showSessionForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Create New Session</h2>
                            <button
                                onClick={() => setShowSessionForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateSession} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={sessionForm.title}
                                    onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={sessionForm.description}
                                    onChange={(e) => setSessionForm({...sessionForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                                    <select
                                        value={sessionForm.sessionType}
                                        onChange={(e) => setSessionForm({...sessionForm, sessionType: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="1:1">1:1</option>
                                        <option value="group">Group</option>
                                        <option value="workshop">Workshop</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        value={sessionForm.price}
                                        onChange={(e) => setSessionForm({...sessionForm, price: Number(e.target.value)})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={sessionForm.duration}
                                        onChange={(e) => setSessionForm({...sessionForm, duration: Number(e.target.value)})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                                    <input
                                        type="number"
                                        value={sessionForm.maxParticipants}
                                        onChange={(e) => setSessionForm({...sessionForm, maxParticipants: Number(e.target.value)})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                                <input
                                    type="datetime-local"
                                    value={sessionForm.scheduledDate}
                                    onChange={(e) => setSessionForm({...sessionForm, scheduledDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        value={sessionForm.timeSlot.startTime}
                                        onChange={(e) => setSessionForm({
                                            ...sessionForm, 
                                            timeSlot: {...sessionForm.timeSlot, startTime: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                    <input
                                        type="time"
                                        value={sessionForm.timeSlot.endTime}
                                        onChange={(e) => setSessionForm({
                                            ...sessionForm, 
                                            timeSlot: {...sessionForm.timeSlot, endTime: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                <input
                                    type="text"
                                    value={sessionForm.timezone}
                                    onChange={(e) => setSessionForm({...sessionForm, timezone: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., UTC-5"
                                    required
                                />
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Create Session
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSessionForm(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Application Modal */}
            {showEditForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Edit Application</h2>
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateApplication} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={mentorData.mentorProfile.phoneNumber || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, phoneNumber: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                    <input
                                        type="text"
                                        value={mentorData.mentorProfile.timezone || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, timezone: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., UTC-5"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
                                    <input
                                        type="text"
                                        value={mentorData.mentorProfile.currentRole || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, currentRole: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Organization</label>
                                    <input
                                        type="text"
                                        value={mentorData.mentorProfile.currentOrganization || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, currentOrganization: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        value={mentorData.mentorProfile.linkedIn || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, linkedIn: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
                                    <input
                                        type="url"
                                        value={mentorData.mentorProfile.portfolioUrl || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, portfolioUrl: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Past Experience</label>
                                <textarea
                                    value={mentorData.mentorProfile.pastExperience || ''}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, pastExperience: e.target.value}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Describe your past experience and achievements..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Domains (comma-separated)</label>
                                <input
                                    type="text"
                                    value={mentorData.mentorProfile.expertiseDomains?.join(', ') || ''}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, expertiseDomains: e.target.value.split(',').map(item => item.trim()).filter(item => item)}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Web Development, AI/ML, Product Management"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mentorship Topics (comma-separated)</label>
                                <input
                                    type="text"
                                    value={mentorData.mentorProfile.mentorshipTopics?.join(', ') || ''}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, mentorshipTopics: e.target.value.split(',').map(item => item.trim()).filter(item => item)}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Startup Strategy, Fundraising, Technical Architecture"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Session Types (comma-separated)</label>
                                <input
                                    type="text"
                                    value={mentorData.mentorProfile.sessionTypes?.join(', ') || ''}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, sessionTypes: e.target.value.split(',').map(item => item.trim()).filter(item => item)}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 1:1, Group, Workshop"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Price ($/hour)</label>
                                    <input
                                        type="number"
                                        value={mentorData.mentorProfile.sessionPrice || 0}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, sessionPrice: Number(e.target.value)}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={mentorData.mentorProfile.sessionDuration || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, sessionDuration: e.target.value}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Notice</label>
                                <input
                                    type="text"
                                    value={mentorData.mentorProfile.bookingNotice || ''}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, bookingNotice: e.target.value}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 24 hours in advance"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Languages (comma-separated)</label>
                                <input
                                    type="text"
                                    value={mentorData.mentorProfile.languages?.join(', ') || ''}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, languages: e.target.value.split(',').map(item => item.trim()).filter(item => item)}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., English, Spanish, French"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                                <select
                                    value={mentorData.mentorProfile.visibility || 'public'}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, visibility: e.target.value}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="public">Public</option>
                                    <option value="invite-only">Invite Only</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio</label>
                                <textarea
                                    value={mentorData.mentorProfile.shortBio || ''}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, shortBio: e.target.value}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="A brief introduction about yourself..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Bio</label>
                                <textarea
                                    value={mentorData.mentorProfile.detailedBio || ''}
                                    onChange={(e) => setMentorData({
                                        ...mentorData,
                                        mentorProfile: {...mentorData.mentorProfile, detailedBio: e.target.value}
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="4"
                                    placeholder="A detailed description of your experience, achievements, and mentoring approach..."
                                />
                            </div>

                            {/* Community Involvement */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Community Involvement</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={mentorData.mentorProfile.communityInvolvement?.groupAMA || false}
                                            onChange={(e) => setMentorData({
                                                ...mentorData,
                                                mentorProfile: {
                                                    ...mentorData.mentorProfile,
                                                    communityInvolvement: {
                                                        ...mentorData.mentorProfile.communityInvolvement,
                                                        groupAMA: e.target.checked
                                                    }
                                                }
                                            })}
                                            className="mr-2"
                                        />
                                        Group AMA Sessions
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={mentorData.mentorProfile.communityInvolvement?.contentWriting || false}
                                            onChange={(e) => setMentorData({
                                                ...mentorData,
                                                mentorProfile: {
                                                    ...mentorData.mentorProfile,
                                                    communityInvolvement: {
                                                        ...mentorData.mentorProfile.communityInvolvement,
                                                        contentWriting: e.target.checked
                                                    }
                                                }
                                            })}
                                            className="mr-2"
                                        />
                                        Content Writing
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={mentorData.mentorProfile.communityInvolvement?.competitionJudge || false}
                                            onChange={(e) => setMentorData({
                                                ...mentorData,
                                                mentorProfile: {
                                                    ...mentorData.mentorProfile,
                                                    communityInvolvement: {
                                                        ...mentorData.mentorProfile.communityInvolvement,
                                                        competitionJudge: e.target.checked
                                                    }
                                                }
                                            })}
                                            className="mr-2"
                                        />
                                        Competition Judge
                                    </label>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Session Price (USD)
                                        </label>
                                        <input
                                            type="number"
                                            value={mentorData.mentorProfile.sessionPrice || ''}
                                            onChange={(e) => setMentorData({
                                                ...mentorData,
                                                mentorProfile: {...mentorData.mentorProfile, sessionPrice: Number(e.target.value)}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter session price"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Session Duration
                                        </label>
                                        <select
                                            value={mentorData.mentorProfile.sessionDuration || ''}
                                            onChange={(e) => setMentorData({
                                                ...mentorData,
                                                mentorProfile: {...mentorData.mentorProfile, sessionDuration: e.target.value}
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select duration</option>
                                            <option value="30 minutes">30 minutes</option>
                                            <option value="45 minutes">45 minutes</option>
                                            <option value="1 hour">1 hour</option>
                                            <option value="1.5 hours">1.5 hours</option>
                                            <option value="2 hours">2 hours</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={mentorData.mentorProfile.bankDetails?.accountNumber || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {
                                                ...mentorData.mentorProfile,
                                                bankDetails: {
                                                    ...mentorData.mentorProfile.bankDetails,
                                                    accountNumber: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter account number"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        value={mentorData.mentorProfile.bankDetails?.paymentMethod || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {
                                                ...mentorData.mentorProfile,
                                                bankDetails: {
                                                    ...mentorData.mentorProfile.bankDetails,
                                                    paymentMethod: e.target.value
                                                }
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select payment method</option>
                                        <option value="bank transfer">Bank Transfer</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="stripe">Stripe</option>
                                        <option value="crypto">Cryptocurrency</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tax Information
                                    </label>
                                    <textarea
                                        value={mentorData.mentorProfile.bankDetails?.taxInfo || ''}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {
                                                ...mentorData.mentorProfile,
                                                bankDetails: {
                                                    ...mentorData.mentorProfile.bankDetails,
                                                    taxInfo: e.target.value
                                                }
                                            }
                                        })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter tax information"
                                    />
                                </div>
                            </div>

                            {/* Legal Agreements */}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={mentorData.mentorProfile.ndaConsent || false}
                                        onChange={(e) => setMentorData({
                                            ...mentorData,
                                            mentorProfile: {...mentorData.mentorProfile, ndaConsent: e.target.checked}
                                        })}
                                        className="mr-2"
                                    />
                                    I agree to sign NDAs when required
                                </label>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Update Application
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditForm(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}