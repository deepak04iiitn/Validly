import React from 'react';
import { DollarSign, CreditCard, Shield, Lock } from 'lucide-react';

export default function MentorPayment({ mentorData }) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-2xl shadow-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Payment & Legal
                    </h2>
                    <p className="text-gray-600 text-lg">Secure payment information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-gray-700 font-medium text-lg">
                            {mentorData.mentorProfile.bankDetails?.paymentMethod || 'Not specified'}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-2 rounded-xl">
                            <Lock className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Account Number</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-gray-700 font-medium text-lg font-mono tracking-wider">
                            {mentorData.mentorProfile.bankDetails?.accountNumber ? 
                                `****${mentorData.mentorProfile.bankDetails.accountNumber.slice(-4)}` : 
                                'Not provided'
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Security Notice</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Your payment information is encrypted and securely stored. We never share your financial details with third parties.
                </p>
            </div>
        </div>
    );
}
