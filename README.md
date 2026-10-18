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

## Admin, chanda, bookings and membership

- `/admin` — committee dashboard: Durga Puja 2026 and general chanda (separately), puja bookings, members with dues,
  CSV export, offline/cash entry, member CSV import. Not indexed by search engines.
- `/chanda`, `/sadasya` — donor/member creates a receipt, pays by UPI (`9334555817@ibl`), enters UTR.
  Receipt page `/rasid/<id>` shows **भुगतान बाकी → पुष्टि लंबित → पुष्ट / भुगतान नहीं मिला** live; donor can
  WhatsApp a screenshot, committee confirms in `/admin` and can WhatsApp the donor back.
- Public totals and the public member list count only committee-confirmed entries. Dues are visible only in `/admin`.

### Setup on Vercel (one time)

1. **Storage → Create → Upstash for Redis** (free), connect it to this project. It adds
   `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`) automatically.
2. **Settings → Environment Variables → `ADMIN_PASSWORD`** = a strong committee password.
3. Redeploy. Log in at `/admin`, open **सदस्य → सदस्य सूची आयात करें**, upload `data/member-list-2026.csv`
   (generated locally from the committee's Excel sheet; kept out of git).

Locally without Redis, records are written to `data/*.json`.

Earlier single-file HTML draft is kept in `_draft-v1/`.
