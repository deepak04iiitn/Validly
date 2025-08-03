import React from 'react';

export default function ProfessionalInfo({ formData, handleChange, handleArrayChange, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Professional Background</h2>
                <p className="text-gray-600">Share your professional experience</p>
            </div>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Current Role *</label>
                        <input 
                            type="text" 
                            name="currentRole" 
                            placeholder="Senior Software Engineer"
                            value={formData.currentRole} 
                            onChange={handleChange} 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Current Organization *</label>
                        <input 
                            type="text" 
                            name="currentOrganization" 
                            placeholder="Google, Microsoft, Startup Inc."
                            value={formData.currentOrganization} 
                            onChange={handleChange} 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                            required 
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">LinkedIn Profile</label>
                        <input 
                            type="url" 
                            name="linkedIn" 
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={formData.linkedIn} 
                            onChange={handleChange} 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Portfolio/Website</label>
                        <input 
                            type="url" 
                            name="portfolioUrl" 
                            placeholder="https://yourportfolio.com"
                            value={formData.portfolioUrl} 
                            onChange={handleChange} 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Past Experience *</label>
                    <textarea 
                        name="pastExperience" 
                        placeholder="Describe your relevant work experience, achievements, and background..."
                        value={formData.pastExperience} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                        rows="4" 
                        required 
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Expertise Domains *</label>
                    <input 
                        type="text" 
                        placeholder="Software Engineering, Product Management, Data Science, Marketing"
                        onChange={(e) => handleArrayChange('expertiseDomains', e.target.value)} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                    />
                    <p className="text-xs text-gray-500">Separate multiple domains with commas</p>
                </div>
            </div>
        </div>
    );
}