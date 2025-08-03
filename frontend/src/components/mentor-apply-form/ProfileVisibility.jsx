import React from 'react';

export default function ProfileVisibility({ formData, handleChange, handleArrayChange, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile & Visibility</h2>
                <p className="text-gray-600">Create your mentor profile</p>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Short Bio *</label>
                    <input 
                        type="text" 
                        name="shortBio" 
                        placeholder="Senior engineer with 8+ years in tech, helping developers grow their careers"
                        value={formData.shortBio} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                        maxLength="200" 
                    />
                    <p className="text-xs text-gray-500">{formData.shortBio.length}/200 characters</p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Detailed Bio *</label>
                    <textarea 
                        name="detailedBio" 
                        placeholder="Tell your story, share your expertise, and explain how you can help mentees achieve their goals..."
                        value={formData.detailedBio} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-gray-50 focus:bg-white resize-none" 
                        rows="6" 
                        required 
                        maxLength="1000" 
                    />
                    <p className="text-xs text-gray-500">{formData.detailedBio.length}/1000 characters</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Languages *</label>
                        <input 
                            type="text" 
                            placeholder="English, Spanish, French, Mandarin"
                            onChange={(e) => handleArrayChange('languages', e.target.value)} 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                            required 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Profile Visibility *</label>
                        <select 
                            name="visibility" 
                            value={formData.visibility} 
                            onChange={handleChange} 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                            required
                        >
                            <option value="public">🌍 Public Listing</option>
                            <option value="invite-only">🔒 Invite-Only</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}