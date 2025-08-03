import React from 'react';
import { User, Edit, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function MentorProfile({ mentorData, setShowEditForm }) {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bgColor: 'bg-gradient-to-r from-green-600 to-green-700',
                    message: 'Your application has been approved! You can now start mentoring.',
                    messageColor: 'text-green-700',
                    bgMessage: 'bg-green-50',
                    borderColor: 'border-green-200'
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-yellow-600',
                    bgColor: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
                    message: "Your application is under review. You'll be notified once approved.",
                    messageColor: 'text-yellow-700',
                    bgMessage: 'bg-yellow-50',
                    borderColor: 'border-yellow-200'
                };
            case 'rejected':
                return {
                    icon: AlertCircle,
                    color: 'text-red-600',
                    bgColor: 'bg-gradient-to-r from-red-600 to-red-700',
                    message: 'Your application was not approved. Please contact support for more information.',
                    messageColor: 'text-red-700',
                    bgMessage: 'bg-red-50',
                    borderColor: 'border-red-200'
                };
            default:
                return {
                    icon: User,
                    color: 'text-gray-600',
                    bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
                    message: 'Status information not available.',
                    messageColor: 'text-gray-700',
                    bgMessage: 'bg-gray-50',
                    borderColor: 'border-gray-200'
                };
        }
    };

    const statusConfig = getStatusConfig(mentorData.mentorStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-6">
                    <div className={`${statusConfig.bgColor} p-4 rounded-2xl shadow-lg`}>
                        <StatusIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Application Status
                            </h2>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${statusConfig.color} ${statusConfig.bgMessage} ${statusConfig.borderColor} border`}>
                                {mentorData.mentorStatus}
                            </span>
                        </div>
                        <div className={`${statusConfig.bgMessage} ${statusConfig.borderColor} border rounded-2xl p-6`}>
                            <p className={`${statusConfig.messageColor} text-lg leading-relaxed font-medium`}>
                                {statusConfig.message}
                            </p>
                        </div>
                    </div>
                </div>
                
                {mentorData.mentorStatus !== 'rejected' && (
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setShowEditForm(true)}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
                        >
                            <Edit className="w-5 h-5 group-hover:rotate-3 transition-transform" />
                            Edit Application
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
