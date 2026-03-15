'use client';

import { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageLoad: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageLoad }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageLoad(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-400">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports PNG, JPG, GIF, and more
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-gray-700">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain bg-gray-900"
            />
          </div>
          <button
            onClick={() => { setPreview(null); inputRef.current?.value && (inputRef.current.value = ''); }}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Choose different image
          </button>
        </div>
      )}
    </div>
  );
}
