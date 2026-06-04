'use client';

import { useEffect, useState } from 'react';
import { type GenerationRecord, getRecentGenerations } from '@/lib/api';

interface RecentGenerationsProps {
  refreshKey?: number;
  variant?: 'grid' | 'rail';
}

interface PaginationState {
  limit: number;
  offset: number;
  nextOffset: number | null;
  hasMore: boolean;
}

function formatGeneratedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'JUST NOW';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).toUpperCase();
}

export default function RecentGenerations({ refreshKey = 0, variant = 'grid' }: RecentGenerationsProps) {
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [message, setMessage] = useState('');
  const isRail = variant === 'rail';
  const pageSize = isRail ? 8 : 12;
  const [pagination, setPagination] = useState<PaginationState>({
    limit: pageSize,
    offset: 0,
    nextOffset: null,
    hasMore: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadGenerations() {
      setIsLoading(true);
      setIsLoadingMore(false);
      setMessage('');

      try {
        const response = await getRecentGenerations({ limit: pageSize, offset: 0 });

        if (!isMounted) return;

        setGenerations(response.generations);
        setPagination(response.pagination);
        setMessage(response.message || '');
      } catch (error) {
        if (!isMounted) return;

        setGenerations([]);
        setPagination({
          limit: pageSize,
          offset: 0,
          nextOffset: null,
          hasMore: false,
        });
        setMessage(error instanceof Error ? error.message : 'Failed to load recent generations');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGenerations();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, pageSize]);

  const handleLoadMore = async () => {
    if (!pagination.hasMore || pagination.nextOffset === null || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setMessage('');

    try {
      const response = await getRecentGenerations({
        limit: pagination.limit,
        offset: pagination.nextOffset,
      });

      setGenerations((current) => [...current, ...response.generations]);
      setPagination(response.pagination);
      setMessage(response.message || '');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load more generations');
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#39ff14]"></div>
            <h2 className="text-[#39ff14] text-lg tracking-wide">RECENT GENERATIONS</h2>
          </div>
          <p className="text-[#4a4a4a] text-sm">
            Latest saved outputs from the platform
          </p>
        </div>
        <div className="text-[#00d4ff] text-xs pixel-font">
          {generations.length.toString().padStart(2, '0')} LOADED
        </div>
      </div>

      <div className={`relative border-4 border-[#2d2d44] bg-[#0d0d0d] p-3 ${isRail ? 'xl:max-h-[calc(100vh-10rem)] xl:overflow-y-auto' : ''}`}>
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#00d4ff]"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ff00ff]"></div>

        {isLoading ? (
          <div className={isRail ? 'space-y-3' : 'grid grid-cols-2 md:grid-cols-4 gap-3'}>
            {[...Array(isRail ? 5 : 4)].map((_, index) => (
              <div
                key={index}
                className={`${isRail ? 'h-28' : 'h-48'} bg-[#1a1a2e] border-2 border-[#2d2d44] animate-pulse`}
              />
            ))}
          </div>
        ) : generations.length > 0 ? (
          <>
            <div className={isRail ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'}>
              {generations.map((generation) => (
                <a
                  key={generation.id}
                  href={generation.image_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open generation for ${generation.prompt}`}
                  className={`group bg-[#1a1a2e] border-2 border-[#2d2d44] hover:border-[#00d4ff] transition-all hover:translate-y-[-2px] ${isRail ? 'grid grid-cols-[88px_minmax(0,1fr)] min-h-[104px]' : 'block'}`}
                  style={{ boxShadow: '3px 3px 0 #0d0d0d' }}
                >
                  <div className={`${isRail ? 'w-[88px] h-full min-h-[100px]' : 'aspect-square'} bg-[#0d0d0d] overflow-hidden scanlines`}>
                    <img
                      src={generation.image_url}
                      alt={generation.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ imageRendering: 'pixelated' }}
                      loading="lazy"
                    />
                  </div>
                  <div className={`p-3 min-w-0 ${isRail ? 'flex flex-col justify-between' : ''}`}>
                    <p
                      className="text-[#f8f8f8] text-sm leading-tight min-h-[2.5rem]"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {generation.prompt}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-[#4a4a4a]">
                      <span>{generation.width}x{generation.height}</span>
                      <span>{formatGeneratedDate(generation.created_at)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {pagination.hasMore && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="mt-3 w-full bg-[#0d0d0d] border-2 border-[#00d4ff] hover:border-[#39ff14] disabled:border-[#2d2d44] disabled:text-[#4a4a4a] text-[#00d4ff] px-4 py-3 text-sm font-bold tracking-wide transition-colors"
                style={{ boxShadow: '3px 3px 0 #0d0d0d' }}
              >
                {isLoadingMore ? 'LOADING...' : 'LOAD MORE'}
              </button>
            )}

            {message && !pagination.hasMore && (
              <p className="mt-3 text-center text-[#4a4a4a] text-sm">{message}</p>
            )}
          </>
        ) : (
          <div className="min-h-44 flex flex-col items-center justify-center text-center px-4 bg-[#1a1a2e] scanlines">
            <div className="w-16 h-16 border-4 border-dashed border-[#4a4a4a] flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-[#2d2d44]"></div>
            </div>
            <p className="text-[#f8f8f8] text-lg tracking-wide">
              NO SAVED OUTPUTS YET
            </p>
            <p className="text-[#4a4a4a] text-sm mt-2 max-w-md">
              {message || 'Generated images will appear here after Supabase is configured and the first image is saved.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
