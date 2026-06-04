import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({
      generations: [],
      message: 'Supabase is not configured yet.',
    });
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get('limit') || 12);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 24)
    : 12;

  const { data, error } = await supabase
    .from('generations')
    .select('id, prompt, image_path, image_url, model, width, height, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json(
      {
        generations: [],
        message: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ generations: data || [] });
}
