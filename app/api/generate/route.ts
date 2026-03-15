import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width = 512, height = 512 } = body;

    const hfToken = process.env.HF_TOKEN;

    if (!hfToken) {
      return NextResponse.json({
        generation_id: "",
        status: "requires_api_key",
        image_url: "",
        message: "Add HF_TOKEN to frontend/.env. Get free key at https://huggingface.co/settings/tokens"
      });
    }

    const pixelPrompt = `${prompt} in high quality pixel art style, 16-bit, sprite sheet style`;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: pixelPrompt,
          parameters: { width, height }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({
      generation_id: `hf_flux_${Date.now()}`,
      status: "complete",
      image_url: `data:image/png;base64,${base64}`,
      message: "Generation complete"
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