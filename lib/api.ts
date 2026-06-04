export interface GenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
  pixel_size?: number;
}

export interface GenerateResponse {
  generation_id: string;
  status: string;
  image_url?: string;
  message?: string;
  generation?: GenerationRecord | null;
}

export interface CreditsResponse {
  credits: number;
  token_balance: number;
  subscription_tier: string;
}

export interface GenerationRecord {
  id: string;
  prompt: string;
  image_path: string;
  image_url: string;
  model: string;
  width: number;
  height: number;
  created_at: string;
}

export interface GenerationsResponse {
  generations: GenerationRecord[];
  pagination: {
    limit: number;
    offset: number;
    nextOffset: number | null;
    hasMore: boolean;
  };
  message?: string;
}

export interface GenerationsRequestOptions {
  limit?: number;
  offset?: number;
}

export async function generatePixelArt(request: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Generation failed' }));
    throw new Error(error.detail || 'Failed to generate image');
  }
  
  return response.json();
}

export async function getRecentGenerations({
  limit = 12,
  offset = 0,
}: GenerationsRequestOptions = {}): Promise<GenerationsResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  const response = await fetch(`/api/generations?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch generations' }));
    throw new Error(error.message || 'Failed to fetch generations');
  }

  return response.json();
}

export async function getCredits(): Promise<CreditsResponse> {
  const response = await fetch('/api/credits');
  
  if (!response.ok) {
    throw new Error('Failed to fetch credits');
  }
  
  return response.json();
}
