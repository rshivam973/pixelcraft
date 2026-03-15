'use client';

import { useState, useEffect } from 'react';
import { getCredits } from '@/lib/api';

export default function Header() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    getCredits()
      .then(data => setCredits(data.credits))
      .catch(() => setCredits(null));
  }, []);

  return (
    <header className="relative bg-[#1a1a2e] border-b-4 border-[#2d2d44]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6c5ce7]/20 via-transparent to-[#ff00ff]/20"></div>
      
      <div className="max-w-4xl mx-auto px-4 py-5 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-[#6c5ce7] border-4 border-[#f8f8f8] flex items-center justify-center animate-pulse-glow">
                <div className="w-6 h-6 bg-[#f8f8f8]" style={{ 
                  boxShadow: '4px 4px 0 #0d0d0d',
                  transform: 'translate(-2px, -2px)'
                }}></div>
              </div>
            </div>
            
            <div>
              <h1 className="pixel-font text-lg md:text-xl text-[#f8f8f8] tracking-wider">
                PIXEL<span className="text-[#00d4ff]">CRAFT</span>
              </h1>
              <p className="text-[#4a4a4a] text-xs mt-1 tracking-widest">AI PIXEL ART GENERATOR</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {credits !== null && (
              <div className="bg-[#0d0d0d] border-2 border-[#39ff14] px-4 py-2 relative">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#39ff14]"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#39ff14]"></div>
                <span className="text-[#39ff14] font-bold text-sm">
                  {credits} CR
                </span>
              </div>
            )}
            <div className="hidden md:block w-8 h-8 border-2 border-[#4a4a4a] flex items-center justify-center">
              <div className="w-2 h-2 bg-[#ff00ff]"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6c5ce7] via-[#00d4ff] to-[#ff00ff]"></div>
    </header>
  );
}
