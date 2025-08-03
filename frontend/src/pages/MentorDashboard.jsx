import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, DollarSign, MessageSquare, AlertCircle } from 'lucide-react';

export default function MentorDashboard() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [mentorData, setMentorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, [currentUser, navigate]);

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!mentorData) return <div className="text-center py-12 text-red-500">No mentor data found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Mentor Dashboard</h1>
                
                <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
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

                    {mentorData.mentorStatus === 'approved' && mentorData.mentorProfile && (
                        <>
                            <div className="flex items-center gap-4">
                                <MessageSquare className="w-8 h-8 text-purple-600" />
                                <div>
                                    <h2 className="text-2xl font-semibold">Mentorship Profile</h2>
                                    <p className="text-gray-600">Short Bio: {mentorData.mentorProfile.shortBio || 'N/A'}</p>
                                    <p className="text-gray-600">Topics: {mentorData.mentorProfile.mentorshipTopics?.join(', ') || 'N/A'}</p>
                                    <p className="text-gray-600">Price: ${mentorData.mentorProfile.sessionPrice || 0}/hour</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Calendar className="w-8 h-8 text-purple-600" />
                                <div>
                                    <h2 className="text-2xl font-semibold">Availability</h2>
                                    {mentorData.mentorProfile.availableSlots && mentorData.mentorProfile.availableSlots.length > 0 ? (
                                        mentorData.mentorProfile.availableSlots.map((slot, index) => (
                                            <p key={index} className="text-gray-600">{slot.day}: {slot.times?.join(', ') || 'N/A'}</p>
                                        ))
                                    ) : (
                                        <p className="text-gray-600">No availability slots set</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <DollarSign className="w-8 h-8 text-purple-600" />
                                <div>
                                    <h2 className="text-2xl font-semibold">Payment Details</h2>
                                    <p className="text-gray-600">Method: {mentorData.mentorProfile.bankDetails?.paymentMethod || 'N/A'}</p>
                                    <p className="text-gray-600">Account: {mentorData.mentorProfile.bankDetails?.accountNumber || 'N/A'}</p>
                                </div>
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
        </div>
    );
}