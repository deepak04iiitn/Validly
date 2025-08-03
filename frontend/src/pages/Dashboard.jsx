import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [applications, setApplications] = useState({
        pending: [],
        approved: [],
        rejected: []
    });
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            navigate('/sign-in');
            return;
        }

        // Fetch mentor applications if user is admin
        if (currentUser.isUserAdmin) {
            fetchAllApplications();
        } else {
            setLoading(false);
        }
    }, [currentUser, navigate]);

    const fetchAllApplications = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            // Fetch applications for each status
            const statuses = ['pending', 'approved', 'rejected'];
            const applicationsData = {};

            for (const status of statuses) {
                try {
                    const res = await fetch(`/backend/mentor/applications/${status}`, {
                        headers: {
                            'Authorization': `Bearer ${currentUser.token}`
                        }
                    });
                    const data = await res.json();
                    
                    if (res.ok && data.success) {
                        applicationsData[status] = data.data || [];
                    } else {
                        applicationsData[status] = [];
                        console.error(`Failed to fetch ${status} applications:`, data.message);
                    }
                } catch (err) {
                    applicationsData[status] = [];
                    console.error(`Error fetching ${status} applications:`, err);
                }
            }

            setApplications(applicationsData);
            setLoading(false);
            setRefreshing(false);
        } catch (err) {
            setError('Failed to load applications');
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleApplicationStatus = async (userId, status) => {
        try {
            const res = await fetch(`/backend/mentor/application/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || 'Failed to update application');
                return;
            }
            
            if (data.success) {
                // Refresh all applications after status change
                await fetchAllApplications(true);
                setError(null);
            } else {
                setError(data.message || 'Failed to update application');
            }
        } catch (err) {
            setError('Failed to update application');
        }
    };

    const getTabIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5" />;
            case 'rejected':
                return <XCircle className="w-5 h-5" />;
            default:
                return <Users className="w-5 h-5" />;
        }
    };

    const getTabColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'approved':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'rejected':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold";
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6 mt-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    {currentUser.isUserAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </h1>

                {currentUser.isUserAdmin ? (
                    // Admin view: Mentor applications with tabs
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Mentor Applications</h2>
                                <button
                                    onClick={() => fetchAllApplications(true)}
                                    disabled={refreshing}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    {refreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>
                            
                            {/* Tabs */}
                            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                                {['pending', 'approved', 'rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setActiveTab(status)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                                            activeTab === status
                                                ? getTabColor(status)
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                        {getTabIcon(status)}
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                        <span className="bg-white px-2 py-1 rounded-full text-xs font-bold">
                                            {applications[status]?.length || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Applications List */}
                            <div className="space-y-4">
                                {applications[activeTab]?.length === 0 ? (
                                    <div className="text-center py-12">
                                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No {activeTab} applications found</p>
                                    </div>
                                ) : (
                                    applications[activeTab]?.map((app) => (
                                        <div key={app._id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <Users className="w-8 h-8 text-purple-600" />
                                                    <div>
                                                        <h3 className="text-xl font-semibold">{app.fullName || app.username}</h3>
                                                        <p className="text-gray-600">{app.email}</p>
                                                    </div>
                                                </div>
                                                <span className={getStatusBadge(app.mentorProfile?.mentorStatus)}>
                                                    {app.mentorProfile?.mentorStatus}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p><strong>Role:</strong> {app.mentorProfile?.currentRole || 'N/A'}</p>
                                                    <p><strong>Organization:</strong> {app.mentorProfile?.currentOrganization || 'N/A'}</p>
                                                    <p><strong>Expertise:</strong> {app.mentorProfile?.expertiseDomains?.join(', ') || 'N/A'}</p>
                                                    <p><strong>Topics:</strong> {app.mentorProfile?.mentorshipTopics?.join(', ') || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p><strong>Price:</strong> ${app.mentorProfile?.sessionPrice || 0}/hour</p>
                                                    <p><strong>Duration:</strong> {app.mentorProfile?.sessionDuration || 'N/A'} minutes</p>
                                                    <p><strong>Visibility:</strong> {app.mentorProfile?.visibility || 'N/A'}</p>
                                                    <p><strong>Languages:</strong> {app.mentorProfile?.languages?.join(', ') || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {/* Action buttons for pending applications */}
                                            {app.mentorProfile?.mentorStatus === 'pending' && (
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => handleApplicationStatus(app._id, 'approved')}
                                                        className="py-2 px-4 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                                                    >
                                                        <CheckCircle className="w-5 h-5" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleApplicationStatus(app._id, 'rejected')}
                                                        className="py-2 px-4 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
                                                    >
                                                        <XCircle className="w-5 h-5" /> Reject
                                                    </button>
                                                </div>
                                            )}

                                            {/* Status message for non-pending applications */}
                                            {app.mentorProfile?.mentorStatus !== 'pending' && (
                                                <div className={`p-3 rounded-lg ${
                                                    app.mentorProfile?.mentorStatus === 'approved' 
                                                        ? 'bg-green-50 text-green-800' 
                                                        : 'bg-red-50 text-red-800'
                                                }`}>
                                                    <p className="font-medium">
                                                        {app.mentorProfile?.mentorStatus === 'approved' 
                                                            ? 'Application approved' 
                                                            : 'Application rejected'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Non-admin view: Basic dashboard
                    <div className="bg-white p-8 rounded-2xl shadow-xl">
                        <p className="text-gray-600">Welcome to your dashboard!</p>
                        {currentUser.isMentor ? (
                            <p className="text-gray-600">
                                Track your mentor application status on the{' '}
                                <a href="/mentordashboard" className="text-blue-600 underline">Mentor Dashboard</a>.
                            </p>
                        ) : (
                            <p className="text-gray-600">
                                Apply to become a mentor on the{' '}
                                <a href="/mentorship/mentor-apply" className="text-blue-600 underline">Mentor Application</a> page.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}