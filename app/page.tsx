'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import ResultDisplay from '@/components/ResultDisplay';
import DownloadButton from '@/components/DownloadButton';
import { generatePixelArt } from '@/lib/api';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setError('');
    setGeneratedImage('');

    try {
      const response = await generatePixelArt({ prompt });
      if (response.image_url) {
        setGeneratedImage(response.image_url);
      } else if (response.status === 'complete') {
        setGeneratedImage(response.image_url || '');
      } else if (response.status === 'requires_api_key') {
        setError(response.message || 'AI generation requires an API key');
      } else {
        setError(response.message || 'Generation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-[#ff00ff]/20 border-2 border-[#ff00ff] text-[#ff00ff] px-4 py-3 mb-6 relative" style={{ boxShadow: '4px 4px 0 #0d0d0d' }}>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#ff00ff]"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff00ff]"></div>
            <span className="font-bold">ERROR:</span> {error}
          </div>
        )}

        <div className="space-y-8">
          <PromptInput onSubmit={handleGenerate} disabled={isGenerating} />
          <ResultDisplay
            imageUrl={generatedImage}
            isLoading={isGenerating}
            title={generatedImage ? 'GENERATED OUTPUT' : undefined}
          />
          {generatedImage && (
            <div className="flex justify-center pt-4">
              <DownloadButton imageUrl={generatedImage} />
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 mt-8 border-t-2 border-[#2d2d44]">
        <div className="text-[#2d2d44] text-xs pixel-font">
          MADE WITH &lt;3 IN PIXELS
        </div>
      </footer>
    </div>
  );
}
