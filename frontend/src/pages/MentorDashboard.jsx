import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, Calendar, DollarSign, Video, Bell, Settings, LogOut, Shield, Star, TrendingUp } from 'lucide-react';
import MentorProfile from '../components/mentor-dashboard/MentorProfile';
import MentorAvailability from '../components/mentor-dashboard/MentorAvailability';
import MentorPayment from '../components/mentor-dashboard/MentorPayment';
import MentorSessions from '../components/mentor-dashboard/MentorSessions';
import SessionFormModal from '../components/mentor-dashboard/SessionFormModal';
import EditApplicationModal from '../components/mentor-dashboard/EditApplicationModal';

export default function MentorDashboard() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [mentorData, setMentorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [showSessionForm, setShowSessionForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const [sessionForm, setSessionForm] = useState({
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

    const sidebarItems = [
        { id: 'profile', label: 'Profile', icon: User, available: true, description: 'Manage your profile' },
        { id: 'availability', label: 'Availability', icon: Calendar, available: mentorData?.mentorStatus === 'approved', description: 'Set your schedule' },
        { id: 'payment', label: 'Payment', icon: DollarSign, available: mentorData?.mentorStatus === 'approved', description: 'Earnings & payouts' },
        { id: 'sessions', label: 'Sessions', icon: Video, available: mentorData?.mentorStatus === 'approved', description: 'Manage sessions' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const renderContent = () => {
        if (!mentorData) return null;

        const contentClasses = "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 backdrop-blur-sm bg-white/95";

        switch (activeSection) {
            case 'profile':
                return (
                    <div className={contentClasses}>
                        <MentorProfile 
                            mentorData={mentorData} 
                            setShowEditForm={setShowEditForm}
                        />
                    </div>
                );
            case 'availability':
                if (mentorData.mentorStatus === 'approved') {
                    return (
                        <div className={contentClasses}>
                            <MentorAvailability mentorData={mentorData} />
                        </div>
                    );
                }
                break;
            case 'payment':
                if (mentorData.mentorStatus === 'approved') {
                    return (
                        <div className={contentClasses}>
                            <MentorPayment mentorData={mentorData} />
                        </div>
                    );
                }
                break;
            case 'sessions':
                if (mentorData.mentorStatus === 'approved') {
                    return (
                        <div className={contentClasses}>
                            <MentorSessions 
                                sessions={sessions}
                                setShowSessionForm={setShowSessionForm}
                                handleDeleteSession={handleDeleteSession}
                            />
                        </div>
                    );
                }
                break;
            default:
                return null;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
            <div className="text-center max-w-sm w-full">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 mx-auto mb-6"></div>
                    <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-400 animate-ping mx-auto opacity-20"></div>
                </div>
                <div className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard</div>
                <div className="text-gray-500">Please wait while we prepare your data...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 px-4">
            <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-red-600 text-xl font-semibold mb-2">Something went wrong</div>
                <div className="text-gray-600 text-base break-words">{error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    if (!mentorData) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-50 px-4">
            <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-gray-400 text-xl font-semibold">No mentor data found</div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 relative z-10 h-16 lg:h-18 flex-shrink-0 shadow-sm">
                <div className="px-4 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex items-center min-w-0">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 hover:scale-105"
                                aria-label="Open sidebar"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="flex items-center ml-4 lg:ml-0">
                                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Validly
                                </div>
                                <div className="ml-3 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-full">
                                    MENTOR
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 lg:space-x-4">
                            {/* Status Badge */}
                            <div className={`hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(mentorData?.mentorStatus)}`}>
                                <Shield className="w-3 h-3 mr-1.5" />
                                {mentorData?.mentorStatus?.toUpperCase()}
                            </div>
                            
                            <button 
                                className="p-2.5 text-gray-400 hover:text-indigo-600 transition-all duration-200 rounded-xl hover:bg-indigo-50 relative group"
                                aria-label="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse group-hover:scale-110 transition-transform"></span>
                            </button>
                            
                            <div className="flex items-center space-x-3 bg-gray-50/80 rounded-xl p-2 hover:bg-gray-100/80 transition-all duration-200">
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 truncate max-w-32 lg:max-w-40">
                                    {currentUser?.name || 'User'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Premium Sidebar */}
                <aside className={`w-72 xl:w-80 bg-white/95 backdrop-blur-xl shadow-2xl flex-shrink-0 lg:flex lg:flex-col transform transition-all duration-300 ease-out border-r border-gray-200/50 ${
                    sidebarOpen ? 'fixed inset-y-0 left-0 z-40 translate-x-0' : 'fixed inset-y-0 left-0 z-40 -translate-x-full lg:relative lg:translate-x-0'
                }`}>
                    <div className="flex flex-col h-full">
                        <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between px-6 mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                                    <p className="text-sm text-gray-500 mt-1">Mentor Portal</p>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                                    aria-label="Close sidebar"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-4 space-y-2">
                                {sidebarItems.map((item) => {
                                    if (!item.available) return null;
                                    
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.id;
                                    
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveSection(item.id);
                                                setSidebarOpen(false);
                                            }}
                                            className={`w-full group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <Icon className={`mr-4 h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                                                isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'
                                            }`} />
                                            <div className="text-left min-w-0 flex-1">
                                                <div className="truncate font-semibold">{item.label}</div>
                                                <div className={`text-xs truncate mt-0.5 ${
                                                    isActive ? 'text-indigo-100' : 'text-gray-400'
                                                }`}>
                                                    {item.description}
                                                </div>
                                            </div>
                                            {isActive && (
                                                <div className="w-2 h-2 bg-white rounded-full ml-2 animate-pulse"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Sidebar Footer */}
                            <div className="px-4 mt-6">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">Grow Your Impact</div>
                                            <div className="text-xs text-gray-600">Upgrade to Pro</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto min-w-0 bg-transparent">
                    <div className="py-6 lg:py-8">
                        <div className="max-w-7xl mx-auto px-4 lg:px-8">
                            {/* Premium Status Banner */}
                            {mentorData.mentorStatus === 'pending' && (
                                <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                                <Shield className="h-5 w-5 text-amber-600" />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-semibold text-amber-900 mb-2">Application Under Review</h3>
                                            <p className="text-amber-700 leading-relaxed">
                                                We're currently reviewing your mentor application with care. Our team typically completes this process within 2-3 business days. You'll receive an email notification once the review is complete.
                                            </p>
                                            <div className="mt-4 bg-amber-100 rounded-lg p-3">
                                                <div className="text-sm text-amber-800 font-medium">Next Steps:</div>
                                                <ul className="mt-2 text-sm text-amber-700 space-y-1">
                                                    <li>• Complete your profile information</li>
                                                    <li>• Upload required verification documents</li>
                                                    <li>• Set up your availability preferences</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Page Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent capitalize mb-2">
                                            {activeSection}
                                        </h1>
                                        <p className="text-gray-500 text-lg">
                                            Manage your {activeSection} settings and information
                                        </p>
                                    </div>
                                    <div className="hidden lg:flex items-center space-x-4">
                                        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200">
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Status</div>
                                            <div className={`text-sm font-semibold capitalize ${
                                                mentorData?.mentorStatus === 'approved' ? 'text-emerald-600' : 
                                                mentorData?.mentorStatus === 'pending' ? 'text-amber-600' : 'text-red-600'
                                            }`}>
                                                {mentorData?.mentorStatus}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="min-w-0">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <SessionFormModal 
                showSessionForm={showSessionForm}
                setShowSessionForm={setShowSessionForm}
                sessionForm={sessionForm}
                setSessionForm={setSessionForm}
                handleCreateSession={handleCreateSession}
            />
            <EditApplicationModal 
                showEditForm={showEditForm}
                setShowEditForm={setShowEditForm}
                mentorData={mentorData}
                setMentorData={setMentorData}
                handleUpdateApplication={handleUpdateApplication}
            />
        </div>
    );
}
