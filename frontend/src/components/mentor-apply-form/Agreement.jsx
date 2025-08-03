import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Agreement({ formData, handleChange, error, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Terms & Agreement</h2>
                <p className="text-gray-600">Review and accept our mentorship guidelines</p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Mentorship Guidelines</h3>
                <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <p>Maintain professional conduct in all interactions</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <p>Provide timely responses and honor scheduled sessions</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <p>Respect confidentiality and privacy of mentees</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <p>Follow platform payment and cancellation policies</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <p>Maintain accurate profile information and availability</p>
                    </div>
                </div>
            </div>
            
            <label className="flex items-start p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all duration-200 bg-gray-50">
                <input 
                    type="checkbox" 
                    name="complianceAgreed" 
                    checked={formData.complianceAgreed} 
                    onChange={handleChange} 
                    required
                    className="sr-only"
                />
                <div className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center mt-0.5 ${formData.complianceAgreed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {formData.complianceAgreed && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                    <span className="font-semibold text-gray-900 block mb-1">
                        I agree to the Mentorship Guidelines & Terms of Service *
                    </span>
                    <p className="text-gray-600 text-sm">
                        By checking this box, you confirm that you have read and agree to our mentorship guidelines, terms of service, and privacy policy.
                    </p>
                </div>
            </label>
            
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}
        </div>
    );
}