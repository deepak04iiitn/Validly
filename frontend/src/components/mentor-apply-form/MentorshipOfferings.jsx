import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function MentorshipOfferings({ formData, handleArrayChange, handleSessionTypeChange, handleChange, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Offerings</h2>
                <p className="text-gray-600">Define your mentorship services</p>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Mentorship Topics *</label>
                    <input 
                        type="text" 
                        placeholder="Career Growth, Technical Skills, Leadership, Entrepreneurship"
                        onChange={(e) => handleArrayChange('mentorshipTopics', e.target.value)} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                    />
                    <p className="text-xs text-gray-500">Separate multiple topics with commas</p>
                </div>
                
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-700 block">Session Types *</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { value: 'video', label: '1:1 Video Call', icon: '🎥' },
                            { value: 'chat', label: 'Chat Consultation', icon: '💬' },
                            { value: 'ama', label: 'Group AMA Sessions', icon: '👥' }
                        ].map((session) => (
                            <label key={session.value} className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 transition-all duration-200 bg-gray-50 hover:bg-green-50">
                                <input 
                                    type="checkbox" 
                                    value={session.value}
                                    checked={formData.sessionTypes.includes(session.value)}
                                    onChange={(e) => handleSessionTypeChange(session.value, e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 border-2 rounded-md mr-3 flex items-center justify-center ${formData.sessionTypes.includes(session.value) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                    {formData.sessionTypes.includes(session.value) && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-lg mr-2">{session.icon}</span>
                                <span className="font-medium text-gray-700">{session.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Session Price (per hour) *</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-gray-500 font-medium">$</span>
                            <input 
                                type="number" 
                                name="sessionPrice" 
                                placeholder="50"
                                value={formData.sessionPrice} 
                                onChange={handleChange} 
                                className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Session Duration *</label>
                        <select 
                            name="sessionDuration" 
                            value={formData.sessionDuration} 
                            onChange={handleChange} 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                            required
                        >
                            <option value="">Select Duration</option>
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}