import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    credits: 500,
    token_balance: 0,
    subscription_tier: "free",
    note: "Hugging Face FLUX.1-schnell: Free inference API"
  });
}
