import React from 'react';
import { Calendar, Clock, Globe, ExternalLink, User, Briefcase } from 'lucide-react';

export default function MentorAvailability({ mentorData }) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-2xl shadow-lg">
                    <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Availability & Contact
                    </h2>
                    <p className="text-gray-600 text-lg">Schedule and connect with ease</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Scheduling Information */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-xl">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Timezone</h3>
                        </div>
                        <p className="text-gray-700 text-lg font-medium">
                            {mentorData.mentorProfile.timezone || 'Not specified'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-xl">
                                <Clock className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Booking Notice</h3>
                        </div>
                        <p className="text-gray-700 text-lg font-medium">
                            {mentorData.mentorProfile.bookingNotice || 'Not specified'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-2 rounded-xl">
                                <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Available Slots</h3>
                        </div>
                        {mentorData.mentorProfile.availableSlots && mentorData.mentorProfile.availableSlots.length > 0 ? (
                            <div className="space-y-3">
                                {mentorData.mentorProfile.availableSlots.map((slot, index) => (
                                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span className="font-semibold text-gray-800 bg-purple-100 px-3 py-1 rounded-lg text-sm">
                                                {slot.day}
                                            </span>
                                            <span className="text-gray-600 font-medium">
                                                {slot.times?.join(', ') || 'No times set'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl">No slots configured yet</p>
                        )}
                    </div>
                </div>

                {/* Contact & Profile Information */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-2 rounded-xl">
                                <ExternalLink className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">LinkedIn Profile</h3>
                        </div>
                        {mentorData.mentorProfile.linkedIn ? (
                            <a 
                                href={mentorData.mentorProfile.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                            >
                                View Profile
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        ) : (
                            <p className="text-gray-500 italic">Not provided</p>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-100 p-2 rounded-xl">
                                <User className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Portfolio</h3>
                        </div>
                        {mentorData.mentorProfile.portfolioUrl ? (
                            <a 
                                href={mentorData.mentorProfile.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors"
                            >
                                View Portfolio
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        ) : (
                            <p className="text-gray-500 italic">Not provided</p>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-xl">
                                <Briefcase className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Past Experience</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${mentorData.mentorProfile.pastExperience ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={`font-medium ${mentorData.mentorProfile.pastExperience ? 'text-green-600' : 'text-gray-500'}`}>
                                {mentorData.mentorProfile.pastExperience ? 'Experience provided' : 'Not provided'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
