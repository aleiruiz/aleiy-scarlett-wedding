# Alei & Scarlett Wedding Invitation

An elegant, mobile-first wedding invitation built as a frontend portfolio project. It combines a cinematic envelope reveal, responsive editorial layouts, personalized guest links, calendar integration, and a validated RSVP flow backed by Google Sheets.

[View the live invitation demo](https://aleiy-scarlett-wedding.vercel.app/invitacion/demo-alei-scarlett-2026)

## Highlights

- Responsive, accessible experience designed for mobile guests first.
- Personalized invitations with private tokens, named guests, and pass limits.
- Interactive envelope reveal with reduced-motion support and ambient music.
- RSVP validation that prevents unauthorized guests and over-capacity responses.
- Google Sheets integration for invitation data and RSVP persistence.
- Calendar downloads, Google Maps, gift registry links, FAQ, and WhatsApp contact.
- Server-side handling for credentials and invitation data.

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Vitest · Google Sheets API

## Run locally

Requirements: Node.js 20.19 or later.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without Google credentials, the project serves a demo invitation at:

```text
http://localhost:3000/invitacion/demo-alei-scarlett-2026
```

The demo RSVP can be submitted for testing, but it is not persisted.

## Project structure

- `src/app/` — App Router pages, metadata, API routes, and calendar downloads.
- `src/components/wedding/` — Reusable invitation UI and interactive components.
- `src/content/wedding.ts` — Event content, schedule, venue, registry, and contact details.
- `src/lib/` — Invitation loading, Google Sheets access, and RSVP validation.
- `data/` — Example invitation records and invitation-generation inputs.
- `public/photos/` — Optimized wedding photography assets.

## Customize the invitation

Edit [`src/content/wedding.ts`](src/content/wedding.ts) to update the names, date, venue, schedule, dress code, registry, FAQ, and contact information. Photo selection and positioning are defined in [`src/app/globals.css`](src/app/globals.css).

To prepare photos from the original ZIP without modifying it:

```bash
python scripts/prepare_wedding_photos.py "path/to/gallery.zip"
```

## Private invitations and Google Sheets

The production flow reads private invitation records from a `Sheet1` worksheet. Each invitation has a unique token, a guest list, and an assigned number of passes. RSVP submissions are validated on the server and saved back to the sheet without exposing credentials to the browser.

Copy `.env.example` to `.env.local` and configure:

```text
GOOGLE_SHEETS_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
INVITATION_BASE_URL
```

For local development without Google Sheets, `INVITATIONS_JSON` can load a private invitation snapshot on the server. In that mode, real RSVPs are disabled and only the demo invitation accepts simulated responses.

To generate invitation rows and secure links:

```bash
cp data/invitations.example.json data/invitations.json
npm run generate:invitations
```

## Quality checks

```bash
npm run lint
npm test
npm run build
```

## Deployment

The app is ready to deploy to Vercel. Configure the same environment variables, set `INVITATION_BASE_URL` to the production domain, and regenerate invitation links before sharing them.

## Language

The invitation experience is written in Spanish for the wedding guests. This project documentation is available in English for portfolio and collaboration purposes.
