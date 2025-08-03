import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowRight, 
    User, 
    Briefcase, 
    Calendar, 
    DollarSign, 
    FileText, 
    Globe, 
    MessageSquare, 
    Users 
} from 'lucide-react';

export default function MentorApply() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: '',
        timezone: '',
        currentRole: '',
        currentOrganization: '',
        linkedIn: '',
        portfolioUrl: '',
        pastExperience: '',
        expertiseDomains: [],
        mentorshipTopics: [],
        sessionTypes: [],
        sessionPrice: 0,
        sessionDuration: '',
        availableSlots: [{ day: '', times: [] }],
        bookingNotice: '',
        governmentId: '',
        credentials: [],
        introVideo: '',
        bankDetails: {
            accountNumber: '',
            paymentMethod: '',
            taxInfo: ''
        },
        ndaConsent: false,
        shortBio: '',
        detailedBio: '',
        languages: [],
        visibility: 'public',
        communityInvolvement: {
            groupAMA: false,
            contentWriting: false,
            competitionJudge: false
        },
        complianceAgreed: false
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/sign-in');
        }
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name.includes('communityInvolvement')) {
                const field = name.split('.')[1];
                setFormData({
                    ...formData,
                    communityInvolvement: {
                        ...formData.communityInvolvement,
                        [field]: checked
                    }
                });
            } else {
                setFormData({ ...formData, [name]: checked });
            }
        } else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleArrayChange = (name, value) => {
        setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.complianceAgreed) {
            setError('You must agree to the terms and conditions');
            return;
        }

        if (!formData.currentRole || !formData.currentOrganization || !formData.sessionPrice) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const res = await fetch('/backend/mentor/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || 'Failed to submit application');
                setLoading(false);
                return;
            }
            
            if (data.success) {
                navigate('/mentordashboard');
            } else {
                setError(data.message || 'Failed to submit application');
                setLoading(false);
            }
        } catch (err) {
            console.error('Application submission error:', err);
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Become a Mentor</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <User className="w-6 h-6" /> Basic Information
                        </h2>
                        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                        <input type="text" name="timezone" placeholder="Location/Timezone" value={formData.timezone} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Briefcase className="w-6 h-6" /> Professional Information
                        </h2>
                        <input type="text" name="currentRole" placeholder="Current Role" value={formData.currentRole} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                        <input type="text" name="currentOrganization" placeholder="Current Organization" value={formData.currentOrganization} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                        <input type="url" name="linkedIn" placeholder="LinkedIn Profile URL" value={formData.linkedIn} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <input type="url" name="portfolioUrl" placeholder="Portfolio/Personal Website" value={formData.portfolioUrl} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <textarea name="pastExperience" placeholder="Past Experience" value={formData.pastExperience} onChange={handleChange} className="w-full p-3 border rounded-lg" rows="4" required />
                        <input type="text" placeholder="Expertise Domains (comma-separated)" onChange={(e) => handleArrayChange('expertiseDomains', e.target.value)} className="w-full p-3 border rounded-lg" required />
                    </div>

                    {/* Mentorship Offerings */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <MessageSquare className="w-6 h-6" /> Mentorship Offerings
                        </h2>
                        <input type="text" placeholder="Mentorship Topics (comma-separated)" onChange={(e) => handleArrayChange('mentorshipTopics', e.target.value)} className="w-full p-3 border rounded-lg" required />
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="sessionTypes" value="video" onChange={(e) => handleArrayChange('sessionTypes', e.target.value)} /> 1:1 Video Call
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="sessionTypes" value="chat" onChange={(e) => handleArrayChange('sessionTypes', e.target.value)} /> Chat Consultation
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="sessionTypes" value="ama" onChange={(e) => handleArrayChange('sessionTypes', e.target.value)} /> Group AMA Sessions
                            </label>
                        </div>
                        <input type="number" name="sessionPrice" placeholder="Session Price per Hour" value={formData.sessionPrice} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                        <select name="sessionDuration" value={formData.sessionDuration} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                            <option value="">Select Session Duration</option>
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                        </select>
                    </div>

                    {/* Availability & Scheduling */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Calendar className="w-6 h-6" /> Availability & Scheduling
                        </h2>
                        {/* Simplified for demo; in practice, use a proper scheduler component */}
                        <input type="text" placeholder="Available Slots (e.g., Monday 10AM-12PM)" onChange={(e) => setFormData({ ...formData, availableSlots: [{ day: 'Monday', times: e.target.value.split(',') }] })} className="w-full p-3 border rounded-lg" required />
                        <input type="text" name="bookingNotice" placeholder="Advance Booking Notice" value={formData.bookingNotice} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                    </div>

                    {/* Verification & Trust */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <FileText className="w-6 h-6" /> Verification & Trust
                        </h2>
                        <input type="text" name="governmentId" placeholder="Government ID URL" value={formData.governmentId} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <input type="text" placeholder="Credentials (comma-separated URLs)" onChange={(e) => handleArrayChange('credentials', e.target.value)} className="w-full p-3 border rounded-lg" />
                        <input type="url" name="introVideo" placeholder="Intro Video URL" value={formData.introVideo} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                    </div>

                    {/* Payment & Legal */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <DollarSign className="w-6 h-6" /> Payment & Legal
                        </h2>
                        <input type="text" name="bankDetails.accountNumber" placeholder="Bank Account Number" value={formData.bankDetails.accountNumber} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                        <select name="bankDetails.paymentMethod" value={formData.bankDetails.paymentMethod} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                            <option value="">Select Payment Method</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="paypal">PayPal</option>
                            <option value="stripe">Stripe</option>
                        </select>
                        <input type="text" name="bankDetails.taxInfo" placeholder="Tax Information" value={formData.bankDetails.taxInfo} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="ndaConsent" checked={formData.ndaConsent} onChange={handleChange} /> Require NDA
                        </label>
                    </div>

                    {/* Mentor Bio & Visibility */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Globe className="w-6 h-6" /> Mentor Bio & Visibility
                        </h2>
                        <input type="text" name="shortBio" placeholder="Short Bio (150-200 characters)" value={formData.shortBio} onChange={handleChange} className="w-full p-3 border rounded-lg" required maxLength="200" />
                        <textarea name="detailedBio" placeholder="Detailed Bio (500-1000 characters)" value={formData.detailedBio} onChange={handleChange} className="w-full p-3 border rounded-lg" rows="6" required maxLength="1000" />
                        <input type="text" placeholder="Languages (comma-separated)" onChange={(e) => handleArrayChange('languages', e.target.value)} className="w-full p-3 border rounded-lg" required />
                        <select name="visibility" value={formData.visibility} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
                            <option value="public">Public Listing</option>
                            <option value="invite-only">Invite-Only</option>
                        </select>
                    </div>

                    {/* Community Involvement */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Users className="w-6 h-6" /> Community Involvement
                        </h2>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="communityInvolvement.groupAMA" checked={formData.communityInvolvement.groupAMA} onChange={handleChange} /> Host Group AMA Sessions
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="communityInvolvement.contentWriting" checked={formData.communityInvolvement.contentWriting} onChange={handleChange} /> Write Startup Content
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="communityInvolvement.competitionJudge" checked={formData.communityInvolvement.competitionJudge} onChange={handleChange} /> Judge Startup Competitions
                        </label>
                    </div>

                    {/* Compliance Agreement */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <FileText className="w-6 h-6" /> Compliance Agreement
                        </h2>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="complianceAgreed" checked={formData.complianceAgreed} onChange={handleChange} required /> Accept Mentorship Guidelines & Terms
                        </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                        {loading ? 'Submitting...' : 'Submit Application'}
                        <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}