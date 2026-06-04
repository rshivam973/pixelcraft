'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import ResultDisplay from '@/components/ResultDisplay';
import DownloadButton from '@/components/DownloadButton';
import RecentGenerations from '@/components/RecentGenerations';
import { generatePixelArt } from '@/lib/api';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [recentRefreshKey, setRecentRefreshKey] = useState(0);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setError('');
    setGeneratedImage('');

    try {
      const response = await generatePixelArt({ prompt });
      if (response.image_url) {
        setGeneratedImage(response.image_url);
        setRecentRefreshKey((key) => key + 1);
      } else if (response.status === 'complete') {
        setGeneratedImage(response.image_url || '');
        setRecentRefreshKey((key) => key + 1);
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

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {error && (
          <div className="bg-[#ff00ff]/20 border-2 border-[#ff00ff] text-[#ff00ff] px-4 py-3 mb-6 relative" style={{ boxShadow: '4px 4px 0 #0d0d0d' }}>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#ff00ff]"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff00ff]"></div>
            <span className="font-bold">ERROR:</span> {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,1fr)_430px] items-start">
          <section className="min-w-0 space-y-5">
            <PromptInput onSubmit={handleGenerate} disabled={isGenerating} />
            <div className="space-y-4">
              <ResultDisplay
                imageUrl={generatedImage}
                isLoading={isGenerating}
                title={generatedImage ? 'CURRENT OUTPUT' : 'OUTPUT MONITOR'}
              />
              {generatedImage && (
                <div className="flex justify-center sm:justify-end">
                  <DownloadButton imageUrl={generatedImage} />
                </div>
              )}
            </div>
          </section>

          <aside className="min-w-0 xl:sticky xl:top-6">
            <RecentGenerations refreshKey={recentRefreshKey} variant="rail" />
          </aside>
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
