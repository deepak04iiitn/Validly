import React from 'react';

const CornerDecorations = () => {
  return (
    <>
      {/* Top Left Corner */}
      <div className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
        <div className="w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Top Right Corner */}
      <div className="fixed top-0 right-0 translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
        <div className="w-80 h-80 bg-gradient-to-bl from-emerald-400/25 via-teal-400/25 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-cyan-300/30 to-blue-400/30 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Bottom Left Corner */}
      <div className="fixed bottom-0 left-0 -translate-x-1/3 translate-y-1/3 z-0 pointer-events-none">
        <div className="w-72 h-72 bg-gradient-to-tr from-orange-400/20 via-pink-400/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-16 left-16 w-24 h-24 bg-gradient-to-t from-rose-300/40 to-orange-300/40 rounded-full blur-lg animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      {/* Bottom Right Corner */}
      <div className="fixed bottom-0 right-0 translate-x-1/3 translate-y-1/3 z-0 pointer-events-none">
        <div className="w-88 h-88 bg-gradient-to-tl from-indigo-400/25 via-purple-500/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-12 right-12 w-40 h-40 bg-gradient-to-tl from-violet-300/20 to-indigo-400/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>

      {/* Additional floating elements */}
      <div className="fixed top-1/4 left-1/4 z-0 pointer-events-none">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-300/30 to-orange-400/30 rounded-full blur-sm animate-float"></div>
      </div>

      <div className="fixed top-3/4 right-1/4 z-0 pointer-events-none">
        <div className="w-20 h-20 bg-gradient-to-bl from-green-300/25 to-teal-400/25 rounded-full blur-md animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default CornerDecorations;