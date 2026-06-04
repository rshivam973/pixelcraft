'use client';

interface ResultDisplayProps {
  imageUrl: string;
  isLoading?: boolean;
  title?: string;
}

export default function ResultDisplay({ imageUrl, isLoading, title }: ResultDisplayProps) {
  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[#00d4ff]"></div>
          <h3 className="text-[#00d4ff] text-lg tracking-wide">{title}</h3>
        </div>
      )}
      
      <div className="relative bg-[#0d0d0d] border-4 border-[#2d2d44] p-2">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#6c5ce7]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff00ff]"></div>
        
        <div className="relative min-h-[340px] sm:min-h-[400px] lg:min-h-[460px] xl:min-h-[480px] flex items-center justify-center bg-[#1a1a2e] overflow-hidden scanlines">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-[#6c5ce7] flex items-center justify-center animate-pulse-glow">
                  <div className="w-10 h-10 bg-[#6c5ce7]" style={{ 
                    boxShadow: '4px 4px 0 #0d0d0d',
                    transform: 'translate(-2px, -2px)'
                  }}></div>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#39ff14] animate-blink"></div>
              </div>
              <p className="text-[#f8f8f8] text-lg tracking-wide">
                GENERATING<span className="animate-blink">...</span>
              </p>
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 h-8 bg-[#6c5ce7]"
                    style={{
                      animation: `blink 0.5s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ) : imageUrl ? (
            <div className="animate-pixel-appear">
              <img
                src={imageUrl}
                alt="Generated pixel art"
                className="max-w-full max-h-[460px] object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-4 border-4 border-dashed border-[#4a4a4a] flex items-center justify-center">
                <div className="w-12 h-12 bg-[#2d2d44]" style={{ 
                  boxShadow: '3px 3px 0 #4a4a4a',
                  transform: 'translate(-1px, -1px)'
                }}></div>
              </div>
              <p className="text-[#4a4a4a] text-lg tracking-wide">
                AWAITING INPUT<span className="animate-blink">_</span>
              </p>
              <p className="text-[#4a4a4a] text-sm mt-2">
                Your pixel art will appear here
              </p>
            </div>
          )}
        </div>
        
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-16 bg-[#2d2d44] flex items-center justify-center">
          <div className="w-2 h-2 bg-[#39ff14] rounded-full"></div>
        </div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-16 bg-[#2d2d44] flex items-center justify-center">
          <div className="w-2 h-2 bg-[#ff00ff] rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
