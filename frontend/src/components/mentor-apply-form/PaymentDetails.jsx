import React from 'react';
import { Shield } from 'lucide-react';

export default function PaymentDetails({ formData, handleChange, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h2>
                <p className="text-gray-600">Setup your payment information</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Secure Payment Processing</span>
                </div>
                <p className="text-blue-700 text-sm">Your payment information is encrypted and secure. We support multiple payment methods for your convenience.</p>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Payment Method *</label>
                    <select 
                        name="bankDetails.paymentMethod" 
                        value={formData.bankDetails.paymentMethod} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required
                    >
                        <option value="">Select Payment Method</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                        <option value="stripe">Stripe</option>
                        <option value="wise">Wise (formerly TransferWise)</option>
                    </select>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Account Information *</label>
                    <input 
                        type="text" 
                        name="bankDetails.accountNumber" 
                        placeholder="Account number, PayPal email, or payment ID"
                        value={formData.bankDetails.accountNumber} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                    />
                    <p className="text-xs text-gray-500">Enter the relevant account details for your selected payment method</p>
                </div>
            </div>
        </div>
    );
}