import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/mentor-apply-form/ProgressBar';
import PersonalInfo from '../components/mentor-apply-form/PersonalInfo';
import ProfessionalInfo from '../components/mentor-apply-form/ProfessionalInfo';
import MentorshipOfferings from '../components/mentor-apply-form/MentorshipOfferings';
import Availability from '../components/mentor-apply-form/Availability';
import PaymentDetails from '../components/mentor-apply-form/PaymentDetails';
import ProfileVisibility from '../components/mentor-apply-form/ProfileVisibility';
import CommunityInvolvement from '../components/mentor-apply-form/CommunityInvolvement';
import Agreement from '../components/mentor-apply-form/Agreement';
import Review from '../components/mentor-apply-form/Review';
import FormNavigation from '../components/mentor-apply-form/FormNavigation';
import { 
    ArrowRight, 
    User, 
    Briefcase, 
    Calendar, 
    DollarSign, 
    FileText, 
    Globe, 
    MessageSquare, 
    Users,
    Eye
} from 'lucide-react';

export default function MentorApply() {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
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
        bankDetails: {
            accountNumber: '',
            paymentMethod: '',
        },
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

    const formSections = [
        { title: 'Personal Info', icon: User, color: 'from-blue-500 to-cyan-500', component: PersonalInfo },
        { title: 'Professional', icon: Briefcase, color: 'from-purple-500 to-pink-500', component: ProfessionalInfo },
        { title: 'Mentorship', icon: MessageSquare, color: 'from-green-500 to-emerald-500', component: MentorshipOfferings },
        { title: 'Availability', icon: Calendar, color: 'from-orange-500 to-red-500', component: Availability },
        { title: 'Payment', icon: DollarSign, color: 'from-indigo-500 to-purple-500', component: PaymentDetails },
        { title: 'Profile', icon: Globe, color: 'from-pink-500 to-rose-500', component: ProfileVisibility },
        { title: 'Community', icon: Users, color: 'from-teal-500 to-cyan-500', component: CommunityInvolvement },
        { title: 'Agreement', icon: FileText, color: 'from-slate-500 to-gray-500', component: Agreement },
        { title: 'Review', icon: Eye, color: 'from-blue-600 to-indigo-600', component: Review }
    ];

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
        setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()).filter(item => item) });
    };

    const handleSessionTypeChange = (type, checked) => {
        const currentTypes = formData.sessionTypes;
        if (checked) {
            setFormData({ ...formData, sessionTypes: [...currentTypes, type] });
        } else {
            setFormData({ ...formData, sessionTypes: currentTypes.filter(t => t !== type) });
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: // Personal Info
                return formData.fullName && formData.email && formData.phoneNumber && formData.timezone;
            case 1: // Professional
                return formData.currentRole && formData.currentOrganization && formData.pastExperience && formData.expertiseDomains.length > 0;
            case 2: // Mentorship
                return formData.mentorshipTopics.length > 0 && formData.sessionTypes.length > 0 && 
                       formData.sessionPrice > 0 && formData.sessionDuration;
            case 3: // Availability
                return formData.availableSlots[0].times.length > 0 && formData.bookingNotice;
            case 4: // Payment
                return formData.bankDetails.paymentMethod && formData.bankDetails.accountNumber;
            case 5: // Profile
                return formData.shortBio && formData.detailedBio && formData.languages.length > 0 && formData.visibility;
            case 6: // Community
                return true; // Optional step, always valid
            case 7: // Agreement
                return formData.complianceAgreed;
            case 8: // Review
                return true; // Review step is always valid
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (isStepValid() && currentStep < formSections.length - 1) {
            setCurrentStep(currentStep + 1);
            setError(null);
        } else if (!isStepValid()) {
            setError('Please complete all required fields before proceeding');
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!formData.complianceAgreed) {
            setError('You must agree to the terms and conditions');
            return;
        }

        const requiredFields = [
            'fullName', 'email', 'phoneNumber', 'timezone',
            'currentRole', 'currentOrganization', 'pastExperience',
            'expertiseDomains', 'mentorshipTopics', 'sessionTypes',
            'sessionPrice', 'sessionDuration', 'availableSlots',
            'bookingNotice', 'bankDetails', 'shortBio', 'detailedBio',
            'languages', 'visibility'
        ];

        const missingFields = requiredFields.filter(field => {
            if (field === 'expertiseDomains' || field === 'mentorshipTopics' || field === 'sessionTypes' || field === 'languages') {
                return !formData[field] || formData[field].length === 0;
            }
            if (field === 'availableSlots') {
                return !formData[field] || formData[field].length === 0 || !formData[field][0].times || formData[field][0].times.length === 0;
            }
            if (field === 'bankDetails') {
                return !formData[field].paymentMethod || !formData[field].accountNumber;
            }
            if (field === 'sessionPrice') {
                return !formData[field] || formData[field] <= 0;
            }
            return !formData[field];
        });

        if (missingFields.length > 0) {
            setError(`Missing required fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const submissionData = {
                ...formData,
                sessionPrice: Number(formData.sessionPrice)
            };
            
            const res = await fetch('/backend/mentor/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(submissionData)
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || data.error || 'Failed to submit application');
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
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    const CurrentFormComponent = formSections[currentStep].component;

    return (
        <div className="mt-16 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
                                Become a Mentor
                            </h1>
                            <p className="text-blue-100 mt-3 text-lg sm:text-xl">
                                Join our community of expert mentors and make an impact
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ProgressBar 
                currentStep={currentStep} 
                formSections={formSections} 
                setCurrentStep={setCurrentStep} 
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <CurrentFormComponent 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleArrayChange={handleArrayChange} 
                            handleSessionTypeChange={handleSessionTypeChange} 
                            error={error}
                            section={formSections[currentStep]}
                        />
                    </div>

                    <FormNavigation 
                        currentStep={currentStep} 
                        formSections={formSections} 
                        isStepValid={isStepValid} 
                        nextStep={nextStep} 
                        prevStep={prevStep} 
                        handleSubmit={handleSubmit} 
                        loading={loading} 
                    />
                </div>
            </div>
        </div>
    );
}