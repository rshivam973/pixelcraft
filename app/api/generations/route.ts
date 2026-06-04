import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit') || 12);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 24)
    : 12;
  const requestedOffset = Number(request.nextUrl.searchParams.get('offset') || 0);
  const offset = Number.isFinite(requestedOffset)
    ? Math.max(Math.floor(requestedOffset), 0)
    : 0;

  if (!supabase) {
    return NextResponse.json({
      generations: [],
      pagination: {
        limit,
        offset,
        nextOffset: null,
        hasMore: false,
      },
      message: 'Supabase is not configured yet.',
    });
  }

  const { data, error } = await supabase
    .from('generations')
    .select('id, prompt, image_path, image_url, model, width, height, created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit);

  if (error) {
    return NextResponse.json(
      {
        generations: [],
        pagination: {
          limit,
          offset,
          nextOffset: null,
          hasMore: false,
        },
        message: error.message,
      },
      { status: 500 }
    );
  }

  const rows = data || [];
  const generations = rows.slice(0, limit);
  const hasMore = rows.length > limit;

  return NextResponse.json({
    generations,
    pagination: {
      limit,
      offset,
      nextOffset: hasMore ? offset + limit : null,
      hasMore,
    },
  });
}
