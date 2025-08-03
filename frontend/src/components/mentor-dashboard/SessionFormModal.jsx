import React from 'react';
import { X, Calendar, Clock, DollarSign, Users, Globe } from 'lucide-react';

export default function SessionFormModal({ showSessionForm, setShowSessionForm, sessionForm, setSessionForm, handleCreateSession }) {
    if (!showSessionForm) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Create New Session</h2>
                            <p className="text-purple-100 mt-1">Set up your mentoring session details</p>
                        </div>
                        <button
                            onClick={() => setShowSessionForm(false)}
                            className="p-2 text-purple-100 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form onSubmit={handleCreateSession} className="space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="lg:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Calendar className="w-4 h-4" />
                                    Session Title
                                </label>
                                <input
                                    type="text"
                                    value={sessionForm.title}
                                    onChange={(e) => setSessionForm({...sessionForm, title: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                    placeholder="Enter session title..."
                                    required
                                />
                            </div>
                            
                            <div className="lg:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    Description
                                </label>
                                <textarea
                                    value={sessionForm.description}
                                    onChange={(e) => setSessionForm({...sessionForm, description: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 resize-none"
                                    rows="4"
                                    placeholder="Describe what this session will cover..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Session Configuration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Users className="w-4 h-4" />
                                    Session Type
                                </label>
                                <select
                                    value={sessionForm.sessionType}
                                    onChange={(e) => setSessionForm({...sessionForm, sessionType: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                >
                                    <option value="1:1">1-on-1</option>
                                    <option value="group">Group</option>
                                    <option value="workshop">Workshop</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <DollarSign className="w-4 h-4" />
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    value={sessionForm.price}
                                    onChange={(e) => setSessionForm({...sessionForm, price: Number(e.target.value)})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Clock className="w-4 h-4" />
                                    Duration (min)
                                </label>
                                <input
                                    type="number"
                                    value={sessionForm.duration}
                                    onChange={(e) => setSessionForm({...sessionForm, duration: Number(e.target.value)})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                    placeholder="60"
                                    min="15"
                                    step="15"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <Users className="w-4 h-4" />
                                    Max Participants
                                </label>
                                <input
                                    type="number"
                                    value={sessionForm.maxParticipants}
                                    onChange={(e) => setSessionForm({...sessionForm, maxParticipants: Number(e.target.value)})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                    placeholder="1"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Scheduling */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Schedule Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Session Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={sessionForm.scheduledDate}
                                        onChange={(e) => setSessionForm({...sessionForm, scheduledDate: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={sessionForm.timeSlot.startTime}
                                        onChange={(e) => setSessionForm({
                                            ...sessionForm, 
                                            timeSlot: {...sessionForm.timeSlot, startTime: e.target.value}
                                        })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={sessionForm.timeSlot.endTime}
                                        onChange={(e) => setSessionForm({
                                            ...sessionForm, 
                                            timeSlot: {...sessionForm.timeSlot, endTime: e.target.value}
                                        })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                        <Globe className="w-4 h-4" />
                                        Timezone
                                    </label>
                                    <input
                                        type="text"
                                        value={sessionForm.timezone}
                                        onChange={(e) => setSessionForm({...sessionForm, timezone: e.target.value})}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 font-medium"
                                        placeholder="UTC+0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg transform hover:-translate-y-0.5"
                            >
                                Create Session
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowSessionForm(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold text-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
