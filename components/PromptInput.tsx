'use client';

import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}

export default function PromptInput({ onSubmit, disabled }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !disabled) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#39ff14] animate-blink"></div>
          <label className="text-[#f8f8f8] text-lg tracking-wide">
            ENTER PROMPT
          </label>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#6c5ce7] to-[#00d4ff] opacity-30 group-focus-within:opacity-70 transition-opacity"></div>
          <div className="relative flex flex-col sm:flex-row gap-0">
            <div className="flex-1 bg-[#0d0d0d] border-4 border-b-0 sm:border-b-4 sm:border-r-0 border-[#2d2d44]">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={250}
                placeholder="a cute cat, a castle, a retro game character..."
                disabled={disabled}
                className="w-full bg-transparent px-4 py-4 text-[#f8f8f8] placeholder-[#4a4a4a] focus:outline-none text-base sm:text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || disabled}
              className="bg-[#6c5ce7] hover:bg-[#5541d9] disabled:bg-[#2d2d44] disabled:cursor-not-allowed text-[#f8f8f8] px-6 py-4 font-bold transition-all hover:translate-y-[-2px] active:translate-y-0 border-4 border-[#f8f8f8]"
              style={{ boxShadow: '4px 4px 0 #0d0d0d' }}
            >
              {disabled ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-[#f8f8f8] border-t-transparent rounded-full"></span>
                  GEN
                </span>
              ) : (
                'GENERATE'
              )}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm mt-1">
          <p className="text-[#4a4a4a] text-xs sm:text-sm">
            <span className="text-[#ffe600]">TIP:</span> Add &quot;8-bit&quot;, &quot;retro sprite&quot;, or &quot;16x16&quot;
          </p>
          <div className="flex items-center gap-1">
            <span className={prompt.length >= 250 ? "text-[#ff00ff] font-bold" : "text-[#4a4a4a]"}>
              {prompt.length}
            </span>
            <span className="text-[#4a4a4a]">/</span>
            <span className="text-[#4a4a4a]">250</span>
          </div>
        </div>
      </div>
    </form>
  );
}
