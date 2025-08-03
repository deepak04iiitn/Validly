import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Review({ formData, error, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Application</h2>
                <p className="text-gray-600">Please review all information before submitting</p>
            </div>

            <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Full Name</p>
                            <p className="text-gray-900">{formData.fullName || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Email</p>
                            <p className="text-gray-900">{formData.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Phone Number</p>
                            <p className="text-gray-900">{formData.phoneNumber || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Timezone</p>
                            <p className="text-gray-900">{formData.timezone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Background</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Current Role</p>
                            <p className="text-gray-900">{formData.currentRole || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Current Organization</p>
                            <p className="text-gray-900">{formData.currentOrganization || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">LinkedIn Profile</p>
                            <p className="text-gray-900">{formData.linkedIn || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Portfolio/Website</p>
                            <p className="text-gray-900">{formData.portfolioUrl || 'Not provided'}</p>
                        </div>
                        <div className="col-span-full">
                            <p className="text-sm font-medium text-gray-600">Past Experience</p>
                            <p className="text-gray-900">{formData.pastExperience || 'Not provided'}</p>
                        </div>
                        <div className="col-span-full">
                            <p className="text-sm font-medium text-gray-600">Expertise Domains</p>
                            <p className="text-gray-900">{formData.expertiseDomains.join(', ') || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentorship Offerings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Mentorship Topics</p>
                            <p className="text-gray-900">{formData.mentorshipTopics.join(', ') || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Session Types</p>
                            <p className="text-gray-900">{formData.sessionTypes.join(', ') || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Session Price</p>
                            <p className="text-gray-900">${formData.sessionPrice || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Session Duration</p>
                            <p className="text-gray-900">{formData.sessionDuration ? `${formData.sessionDuration} minutes` : 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Available Time Slots</p>
                            <p className="text-gray-900">{formData.availableSlots[0].times.join(', ') || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Booking Notice</p>
                            <p className="text-gray-900">{formData.bookingNotice || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Payment Method</p>
                            <p className="text-gray-900">{formData.bankDetails.paymentMethod || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Account Information</p>
                            <p className="text-gray-900">{formData.bankDetails.accountNumber || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile & Visibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full">
                            <p className="text-sm font-medium text-gray-600">Short Bio</p>
                            <p className="text-gray-900">{formData.shortBio || 'Not provided'}</p>
                        </div>
                        <div className="col-span-full">
                            <p className="text-sm font-medium text-gray-600">Detailed Bio</p>
                            <p className="text-gray-900">{formData.detailedBio || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Languages</p>
                            <p className="text-gray-900">{formData.languages.join(', ') || 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Profile Visibility</p>
                            <p className="text-gray-900">{formData.visibility || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Involvement</h3>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Activities</p>
                        <p className="text-gray-900">
                            {Object.entries(formData.communityInvolvement)
                                .filter(([_, value]) => value)
                                .map(([key]) => key)
                                .join(', ') || 'None selected'}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreement</h3>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Compliance Agreement</p>
                        <p className="text-gray-900">{formData.complianceAgreed ? 'Agreed' : 'Not agreed'}</p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}