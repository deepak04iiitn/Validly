import React from 'react';

export default function Availability({ formData, handleChange, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Availability & Scheduling</h2>
                <p className="text-gray-600">Set your availability preferences</p>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Available Time Slots *</label>
                    <input 
                        type="text" 
                        placeholder="Monday 10:00-12:00, Tuesday 14:00-16:00, Wednesday 09:00-11:00"
                        onChange={(e) => setFormData({ ...formData, availableSlots: [{ day: 'Mixed', times: e.target.value.split(',').map(t => t.trim()).filter(t => t) }] })} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required 
                    />
                    <p className="text-xs text-gray-500">List your preferred time slots for mentoring sessions</p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Advance Booking Notice *</label>
                    <select 
                        name="bookingNotice" 
                        value={formData.bookingNotice} 
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        required
                    >
                        <option value="">Select Notice Period</option>
                        <option value="1 hour">1 hour minimum</option>
                        <option value="2 hours">2 hours minimum</option>
                        <option value="24 hours">24 hours minimum</option>
                        <option value="48 hours">48 hours minimum</option>
                        <option value="1 week">1 week minimum</option>
                    </select>
                </div>
            </div>
        </div>
    );
}