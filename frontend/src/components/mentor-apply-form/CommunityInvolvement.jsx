import React from 'react';
import { CheckCircle, Star } from 'lucide-react';

export default function CommunityInvolvement({ formData, handleChange, section }) {
    const IconComponent = section.icon;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${section.color} mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Involvement</h2>
                <p className="text-gray-600">Optional ways to contribute to our community</p>
            </div>
            
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-200 mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-teal-900">Build Your Reputation</span>
                </div>
                <p className="text-teal-700 text-sm">Community involvement helps you build credibility and reach more mentees. All activities are optional but highly recommended.</p>
            </div>
            
            <div className="space-y-4">
                {[
                    { 
                        key: 'groupAMA', 
                        label: 'Host Group AMA Sessions', 
                        description: 'Lead group Q&A sessions with multiple participants',
                        icon: '🎯'
                    },
                    { 
                        key: 'contentWriting', 
                        label: 'Write Startup Content', 
                        description: 'Share insights through articles and guides',
                        icon: '✍️'
                    },
                    { 
                        key: 'competitionJudge', 
                        label: 'Judge Startup Competitions', 
                        description: 'Evaluate and provide feedback on startup pitches',
                        icon: '👨‍⚖️'
                    }
                ].map((activity) => (
                    <label key={activity.key} className="flex items-start p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-teal-300 transition-all duration-200 bg-gray-50 hover:bg-teal-50">
                        <input 
                            type="checkbox" 
                            name={`communityInvolvement.${activity.key}`} 
                            checked={formData.communityInvolvement[activity.key]} 
                            onChange={handleChange}
                            className="sr-only"
                        />
                        <div className={`w-6 h-6 border-2 rounded-lg mr-4 flex items-center justify-center mt-0.5 ${formData.communityInvolvement[activity.key] ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                            {formData.communityInvolvement[activity.key] && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-xl">{activity.icon}</span>
                                <span className="font-semibold text-gray-900">{activity.label}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{activity.description}</p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}