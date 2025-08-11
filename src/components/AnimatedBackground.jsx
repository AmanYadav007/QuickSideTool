import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-teal-500/20 to-sky-500/20 rounded-full blur-3xl animate-float-slowest" />
      
      {/* Floating Particles */}
      <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-white/30 rounded-full animate-pulse" />
      <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-purple-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/2 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-pink-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(-40px, -20px) rotate(180deg); }
        }
        @keyframes float-slowest {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(20px, -40px) rotate(90deg); }
          50% { transform: translate(-30px, -10px) rotate(180deg); }
          75% { transform: translate(10px, 30px) rotate(270deg); }
        }
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }
        .animate-float-slowest {
          animation: float-slowest 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground; 