import React from 'react';
import { Video, Plus, X, DollarSign, Clock, Users, Calendar } from 'lucide-react';

export default function MentorSessions({ sessions, setShowSessionForm, handleDeleteSession }) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-2xl shadow-lg">
                        <Video className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            My Sessions
                        </h2>
                        <p className="text-gray-600 text-lg">Manage your mentoring sessions</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowSessionForm(true)}
                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold text-lg"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Create Session
                </button>
            </div>

            {sessions.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-3xl inline-block mb-6">
                        <Video className="w-16 h-16 text-purple-600 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No sessions created yet</h3>
                    <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                        Create your first session to start mentoring and connecting with mentees
                    </p>
                    <button
                        onClick={() => setShowSessionForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Create Your First Session
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sessions.map((session, index) => (
                        <div 
                            key={session._id} 
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                                        {session.title}
                                    </h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                        session.sessionType === '1:1' 
                                            ? 'bg-blue-100 text-blue-700' 
                                            : session.sessionType === 'group'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-purple-100 text-purple-700'
                                    }`}>
                                        {session.sessionType}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDeleteSession(session._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                                {session.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-gray-600">Price</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">${session.price}</span>
                                </div>
                                
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-600">Duration</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">{session.duration}min</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <Users className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-gray-600">
                                        Max: <span className="font-semibold text-gray-800">{session.maxParticipants || 'N/A'}</span>
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <Calendar className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <span className="text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                            {new Date(session.scheduledDate).toLocaleDateString()}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
