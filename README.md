# AHAAR — Kitchen System

Open the fridge. Know what's for dinner.

A 2D, multi-page site for AHAAR, a household food assistant for Indian kitchens. Each feature has its own page.

| Page | Route | What it does |
| --- | --- | --- |
| Home | `/` | Overview and links to every feature |
| Fridge scan | `/scan` | Live camera with on-device light and sharpness checks, capture, upload or drag-and-drop, retake flags |
| Detection | `/detect` | Bounding boxes with confidence; switch off wrong items |
| Pantry | `/pantry` | Editable quantities plus an ingredient → dish → nutrient graph |
| Recipes | `/recipes` | Filters, match rings, and "Why this?" reason bars |
| Family | `/family` | Per-person portions by age and activity, with totals to cook |
| Cook-along | `/cook` | One step at a time with a working timer (arrow keys and space) |
| Health | `/health` | Planned CGM-aware portioning (coming soon) |
| About | `/about` | Pipeline, stack, privacy and team |

Detection results are a demo preview. The boxes are not live inference on your photo.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

The camera needs `https://` or `localhost`.

## Deploy (Vercel)

`vercel.json` sets the Vite build, the `dist` output and SPA rewrites, so deep links like `/scan` work. Import the repo and deploy.

## Edit

- Copy, recipes and demo items: `src/lib/data.ts`
- Colours and fonts: `tailwind.config.ts`
- Photo quality thresholds: `src/lib/quality.ts`

Group 19: Rajiv Agarwal, Alan Joseph, Aryan Raina. Guide: Ms. Sharlene Rebeiro. AY 2026-27.
