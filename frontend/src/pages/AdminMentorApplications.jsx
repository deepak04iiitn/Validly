import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function AdminMentorApplications() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser || !currentUser.isUserAdmin) {
            navigate('/sign-in');
            return;
        }

        const fetchApplications = async () => {
            try {
                const res = await fetch('/backend/mentor/applications', {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                });
                const data = await res.json();
                if (!data.success) {
                    setError(data.message);
                    setLoading(false);
                    return;
                }
                setApplications(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load applications');
                setLoading(false);
            }
        };

        fetchApplications();
    }, [currentUser, navigate]);

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
            if (!data.success) {
                setError(data.message);
                return;
            }
            setApplications(applications.filter(app => app._id !== userId));
        } catch (err) {
            setError('Failed to update application');
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Mentor Applications</h1>
                
                <div className="space-y-6">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white p-6 rounded-2xl shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <Users className="w-8 h-8 text-purple-600" />
                                <div>
                                    <h2 className="text-2xl font-semibold">{app.fullName}</h2>
                                    <p className="text-gray-600">{app.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p><strong>Role:</strong> {app.mentorProfile.currentRole}</p>
                                    <p><strong>Organization:</strong> {app.mentorProfile.currentOrganization}</p>
                                    <p><strong>Expertise:</strong> {app.mentorProfile.expertiseDomains.join(', ')}</p>
                                    <p><strong>Topics:</strong> {app.mentorProfile.mentorshipTopics.join(', ')}</p>
                                </div>
                                <div>
                                    <p><strong>Price:</strong> ${app.mentorProfile.sessionPrice}/hour</p>
                                    <p><strong>Duration:</strong> {app.mentorProfile.sessionDuration} minutes</p>
                                    <p><strong>Visibility:</strong> {app.mentorProfile.visibility}</p>
                                    <p><strong>Languages:</strong> {app.mentorProfile.languages.join(', ')}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-4">
                                <button 
                                    onClick={() => handleApplicationStatus(app._id, 'approved')}
                                    className="py-2 px-4 bg-green-600 text-white rounded-lg flex items-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" /> Approve
                                </button>
                                <button 
                                    onClick={() => handleApplicationStatus(app._id, 'rejected')}
                                    className="py-2 px-4 bg-red-600 text-white rounded-lg flex items-center gap-2"
                                >
                                    <XCircle className="w-5 h-5" /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}