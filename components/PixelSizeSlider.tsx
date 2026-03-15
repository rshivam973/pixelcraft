'use client';

interface PixelSizeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function PixelSizeSlider({ value, onChange }: PixelSizeSliderProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-400">Pixel Size</label>
        <span className="text-sm text-purple-400 font-mono">{value}px</span>
      </div>
      <input
        type="range"
        min="4"
        max="64"
        step="2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>4px (detailed)</span>
        <span>64px (blocky)</span>
      </div>
    </div>
  );
}
