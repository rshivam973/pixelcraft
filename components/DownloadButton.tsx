'use client';

interface DownloadButtonProps {
  imageUrl: string;
  disabled?: boolean;
}

export default function DownloadButton({ imageUrl, disabled }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pixel-art-${Date.now()}.png`;
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!imageUrl || disabled}
      className="group relative bg-[#39ff14] hover:bg-[#32d912] disabled:bg-[#2d2d44] disabled:cursor-not-allowed text-[#0d0d0d] px-8 py-3 font-bold text-lg transition-all hover:translate-y-[-3px] active:translate-y-0"
      style={{ 
        boxShadow: '4px 4px 0 #0d0d0d',
        border: '3px solid #0d0d0d'
      }}
    >
      <span className="flex items-center gap-2">
        <svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
        </svg>
        SAVE TO DISK
      </span>
      
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff00ff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </button>
  );
}
