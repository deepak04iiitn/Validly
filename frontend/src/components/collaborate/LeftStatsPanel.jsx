import React from 'react';

const LeftStatsPanel = () => {
  const stats = [
    { label: 'Active Hackathons', value: 47, max: 100, color: 'from-blue-500 to-blue-600' },
    { label: 'Online Users', value: 234, max: 500, color: 'from-green-500 to-green-600' },
    { label: 'Teams Formed', value: 89, max: 150, color: 'from-purple-500 to-purple-600' },
    { label: 'Projects Completed', value: 156, max: 200, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 hidden xl:block">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 w-48">
        <h3 className="text-sm font-bold text-slate-700 mb-4 text-center">Platform Stats</h3>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-600 font-medium">{stat.label}</span>
                <span className="text-xs font-bold text-slate-800">{stat.value}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${(stat.value / stat.max) * 100}%`,
                    animation: `fillBar 2s ease-out ${index * 0.2}s both`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center justify-center mt-4 pt-3 border-t border-slate-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-xs text-slate-600">Live Updates</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fillBar {
          from { width: 0%; }
          to { width: var(--target-width); }
        }
      `}</style>
    </div>
  );
};

export default LeftStatsPanel;