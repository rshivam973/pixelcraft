# PixelCraft

PixelCraft is a Next.js app that generates pixel-art images from text prompts with Hugging Face and stores completed generations in Supabase.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
HF_TOKEN=your_hugging_face_token
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key
SUPABASE_STORAGE_BUCKET=pixel-generations
```

`SUPABASE_SECRET_KEY` is server-only. Do not expose it in client code or commit it. `SUPABASE_SERVICE_ROLE_KEY` is also supported as a legacy fallback.

## Supabase

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor. It creates:

- A public `pixel-generations` Storage bucket.
- A `generations` table for saved prompt/image metadata.
- Public read policies for recent generations and Storage images.

The app uploads generated images to Supabase Storage and stores the public image URL in the `generations` table. The home page reads the latest rows for the Recent Generations section.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
