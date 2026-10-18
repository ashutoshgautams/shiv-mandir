# श्री श्री शान्तेश्वर शिवलोक मंदिर — वेबसाइट

Next.js 16 + Tailwind CSS 4. Hindi, light theme, large text for elderly visitors.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Pages

| Path | What it is |
| --- | --- |
| `/` | Home: temple photo, live open/closed + next aarti, Durga Puja appeal, deities, pujas, timings, gallery, festivals |
| `/darshan`, `/darshan/[slug]` | Six deities; detail page with mantra, flower offering and bell |
| `/puja` | All 24 pujas by category with search; booking form prepares a WhatsApp message |
| `/chanda` | Online chanda: amount → UPI QR / UPI app button → receipt; running total and recent donors |
| `/sampark` | Address, map, phone/WhatsApp, timings, rules |

## Before going live (committee to provide)

All in [`src/lib/mandir.ts`](src/lib/mandir.ts) and [`src/lib/samay.ts`](src/lib/samay.ts):

- **UPI ID** and payee name (`upiId`, `upiPayee`). Until set, the chanda page shows no QR.
- **Phone and WhatsApp** numbers (`phone`, `phoneDisplay`, `whatsapp`) — digits with country code, e.g. `919876543210`.
- **Aarti timings** for summer and winter (currently example times).
- **Durga Puja goal** (`ABHIYAN.goal`). Set `ABHIYAN.active = false` after the festival.
- **Real photos** of the murtis to replace the representative images in `public/images/deities/`.

## SEO and sharing

- Live at https://shiv-mandir.vercel.app (default in `src/lib/site.ts`). If a custom domain is added, set `NEXT_PUBLIC_SITE_URL` in Vercel.
  Optional: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` for Google Search Console.
- Share images (1200×630, WhatsApp/Facebook) live in `public/og/`, one per page and per deity.
- Structured data: `HinduTemple` (address, geo from plus code J3JR+H6H), `WebSite`, breadcrumbs, puja `Service` list, `FAQPage`.
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` are generated from `src/app/`.

## Chanda records

`/api/chanda` stores entries in `data/chanda.json` (git-ignored). This is fine on a single server running `npm start`,
but on Vercel or other serverless hosting the file is not persistent — move to a database (Supabase, Postgres, or a Google Sheet)
before launch. Each entry is saved as `pending`; the treasurer should match UTR numbers against the bank statement.

Earlier single-file HTML draft is kept in `_draft-v1/`.
