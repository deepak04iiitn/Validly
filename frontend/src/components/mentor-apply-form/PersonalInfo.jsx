import React from 'react';

export default function PersonalInfo({ formData, handleChange, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Full Name *</label>
                    <input 
                        type="text" 
                        name="fullName" 
                        placeholder="Enter your full name"
                        value={formData.fullName} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Email Address *</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="your.email@domain.com"
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Phone Number *</label>
                    <input 
                        type="tel" 
                        name="phoneNumber" 
                        placeholder="+1 (555) 123-4567"
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Location/Timezone *</label>
                    <input 
                        type="text" 
                        name="timezone" 
                        placeholder="New York, EST"
                        value={formData.timezone} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                    />
                </div>
            </div>
        </div>
    );
}