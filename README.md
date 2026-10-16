# WC Knots & Crafts Decor — 2026 Collection site

Vite + React + TypeScript + Tailwind v4, animated with GSAP/ScrollTrigger, Lenis and Framer Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Languages (PT / EN)
- The site opens in Portuguese when the browser is set to Portuguese, otherwise in English; the PT | EN switch in the header (and in the mobile menu) remembers the choice.
- Interface copy: `src/i18n/strings.ts` (`en` and `pt` objects with the same shape — TypeScript flags any missing key).
- Catalog copy: `name`, `description`, category titles, manifesto and pillars in `src/data/catalog.ts` are `{ en, pt }` pairs.
- Material names stay in English in the catalog and are translated in `src/i18n/materials.ts`.

## Content
- `src/data/catalog.ts` — brand copy, categories, all 41 products (page, size, price, materials, images).
  Set `BRAND.whatsapp` (digits with country code) to show the WhatsApp button in the inquiry form.
- `public/images/catalog/` — every photo extracted from `2026 Catalog WC.pdf` (`p{page}-{n}.jpg`, top-to-bottom order).
- `public/images/pages/` — full-page renders of the PDF, for reference.
- `public/images/cutouts/` — background-removed pieces (rembg); the pieces themselves are untouched.
- `public/images/generated/` — new montages: hero group shot, category covers, colour stories, macro details, OG card.

## Regenerating images
```bash
pip install pymupdf "rembg[cpu]" pillow
python tools/extract_pdf.py "2026 Catalog WC.pdf" public/images
python tools/cutouts.py public/images/catalog public/images/cutouts p01-1 p04-1 p05-1 p07-1 p10-1 p11-1 p15-1
python tools/compose.py
```
