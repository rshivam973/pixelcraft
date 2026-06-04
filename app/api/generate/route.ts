import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { GENERATIONS_BUCKET, getSupabaseAdmin } from '@/lib/supabaseAdmin';

const HF_MODEL = 'black-forest-labs/FLUX.1-schnell';
const HF_MODEL_URL =
  'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell';

function extensionForContentType(contentType: string) {
  if (contentType.includes('image/jpeg')) return 'jpg';
  if (contentType.includes('image/webp')) return 'webp';
  if (contentType.includes('image/gif')) return 'gif';
  return 'png';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width = 512, height = 512 } = body;
    const normalizedPrompt = typeof prompt === 'string' ? prompt.trim() : '';

    if (!normalizedPrompt) {
      return NextResponse.json(
        {
          generation_id: "",
          status: "error",
          image_url: "",
          message: "Prompt is required"
        },
        { status: 400 }
      );
    }

    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return NextResponse.json({
        generation_id: "",
        status: "requires_api_key",
        image_url: "",
        message: "Add HF_TOKEN to .env.local. Get a free key at https://huggingface.co/settings/tokens"
      });
    }

    const pixelPrompt = `${normalizedPrompt} in high quality pixel art style, 16-bit, sprite sheet style`;

    const response = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: pixelPrompt,
        parameters: { width, height }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type')?.split(';')[0] || 'image/png';
    const imageBuffer = Buffer.from(arrayBuffer);
    const supabase = getSupabaseAdmin();
    const generationId = randomUUID();
    let imageUrl = `data:${contentType};base64,${imageBuffer.toString('base64')}`;
    let savedGeneration = null;
    let message = "Generation complete";

    if (supabase) {
      const extension = extensionForContentType(contentType);
      const today = new Date().toISOString().slice(0, 10);
      const imagePath = `generations/${today}/${generationId}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(GENERATIONS_BUCKET)
        .upload(imagePath, imageBuffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Supabase storage upload failed: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(GENERATIONS_BUCKET)
        .getPublicUrl(imagePath);

      imageUrl = publicUrlData.publicUrl;

      const { data: generation, error: insertError } = await supabase
        .from('generations')
        .insert({
          id: generationId,
          prompt: normalizedPrompt,
          image_path: imagePath,
          image_url: imageUrl,
          model: HF_MODEL,
          width,
          height,
        })
        .select('id, prompt, image_path, image_url, model, width, height, created_at')
        .single();

      if (insertError) {
        throw new Error(`Supabase database insert failed: ${insertError.message}`);
      }

      savedGeneration = generation;
    } else {
      message = "Generation complete. Supabase is not configured, so this image was not saved.";
    }

    return NextResponse.json({
      generation_id: generationId,
      status: "complete",
      image_url: imageUrl,
      generation: savedGeneration,
      message
    });

  } catch (error: unknown) {
    console.error("Error generating image:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({
      generation_id: "",
      status: "error",
      image_url: "",
      message
    });
  }
}
