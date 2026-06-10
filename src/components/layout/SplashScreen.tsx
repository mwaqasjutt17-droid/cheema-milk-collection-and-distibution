import React, { useState, useEffect } from 'react';
import { Milk, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const TOTAL_MS = 500; // Half a second
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= TOTAL_MS) {
        clearInterval(timer);
        setElapsedMs(TOTAL_MS);
        onComplete();
      } else {
        setElapsedMs(elapsed);
      }
    }, 16); // High-fidelity 60fps refresh rate

    return () => clearInterval(timer);
  }, [onComplete]);

  const progressPercent = Math.min(100, (elapsedMs / TOTAL_MS) * 100);

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-950 text-white flex flex-col justify-between items-center p-8 z-55 overflow-hidden font-sans">
      {/* Decorative ambient background blur lights */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top spacing element to balance layout */}
      <div className="h-10"></div>

      {/* Center Logo Showcase */}
      <div className="flex flex-col items-center justify-center space-y-6 z-10 transition-all duration-300">
        {/* Minimalist Logo Circle with rotating ring and glow */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
          {/* Animated Accent Spark */}
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-blue-400 animate-pulse" />

          {/* SVG Progress Ring surrounding the logo container */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              rx="22"
              className="stroke-slate-800 fill-none"
              strokeWidth="3"
            />
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              rx="22"
              className="stroke-blue-500 fill-none transition-all duration-75 ease-out"
              strokeWidth="3"
              strokeDasharray="400"
              strokeDashoffset={400 - (400 * progressPercent) / 100}
            />
          </svg>

          {/* Core Brand Icon */}
          <div className="p-4 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-lg ring-4 ring-slate-950 scale-105">
            <Milk className="w-10 h-10 text-white animate-bounce" style={{ animationDuration: '1s' }} />
          </div>
        </div>

        {/* Corporate Typography */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider uppercase">
            Cheema <span className="text-blue-500">Milk</span>
          </h1>
          <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
            Collection & Distribution
          </p>
        </div>

        {/* Fast inline status loader */}
        <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-850 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-blue-400 uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
          <span>Securing Ledger</span>
        </div>
      </div>

      {/* Bottom Legal Credits Wrapper */}
      <div className="text-center space-y-3 z-10 w-full max-w-xs">
        {/* Fluid linear progress bar */}
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800/40">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-75 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
          &copy; 2026 Cheema Milk Limited • Verified Purity
        </p>
      </div>
    </div>
  );
}
