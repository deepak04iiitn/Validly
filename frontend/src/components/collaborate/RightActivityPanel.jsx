import React, { useState, useEffect } from 'react';

const RightActivityPanel = () => {
  const [activities] = useState([
    { id: 1, user: 'Alex', action: 'joined hackathon', target: 'AI Challenge 2024', time: '2m ago', type: 'join' },
    { id: 2, user: 'Sarah', action: 'created team', target: 'Web3 Warriors', time: '5m ago', type: 'create' },
    { id: 3, user: 'Mike', action: 'completed project', target: 'EcoTrack App', time: '12m ago', type: 'complete' },
    { id: 4, user: 'Emma', action: 'posted hackathon', target: 'Blockchain Summit', time: '18m ago', type: 'post' },
    { id: 5, user: 'David', action: 'won prize', target: 'Best Innovation', time: '25m ago', type: 'win' },
  ]);

  const [trendingTopics] = useState([
    { tag: 'React', count: 45, trend: 'up' },
    { tag: 'AI/ML', count: 38, trend: 'up' },
    { tag: 'Web3', count: 29, trend: 'stable' },
    { tag: 'Mobile', count: 22, trend: 'down' },
    { tag: 'IoT', count: 18, trend: 'up' },
  ]);

  const getActionIcon = (type) => {
    switch (type) {
      case 'join': return '👥';
      case 'create': return '🚀';
      case 'complete': return '✅';
      case 'post': return '📝';
      case 'win': return '🏆';
      default: return '📌';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 hidden xl:block">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 w-64 max-h-96 overflow-hidden">
        
        {/* Activity Feed Section */}
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            Live Activity
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto hide-scrollbar">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-2 group hover:bg-slate-50 rounded-lg p-2 transition-colors">
                <span className="text-sm flex-shrink-0">{getActionIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium text-blue-600">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics Section */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-slate-700 mb-3">🔥 Trending</h3>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between group hover:bg-slate-50 rounded-lg p-2 transition-colors">
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{getTrendIcon(topic.trend)}</span>
                  <span className="text-sm font-medium text-slate-700">#{topic.tag}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">{topic.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightActivityPanel;