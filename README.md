# WASSCE Study

WASSCE Study is a mobile-first, installable study companion for WASSCE preparation. It is independent and is **not affiliated with, endorsed by, or representative of WAEC**. It does not issue official examination results or replace official WAEC Ghana communications.

## Run locally

From the monorepo root:

```bash
pnpm install
PORT=18106 BASE_PATH=/ pnpm --filter @workspace/wassce-study run dev
```

The Replit workflow supplies `PORT` and `BASE_PATH` automatically. For a production build:

```bash
PORT=18106 BASE_PATH=/ pnpm --filter @workspace/wassce-study run build
```

The static output is written to `dist/public`.

## Deploy

This is a static Vite build and can be deployed to GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

1. Build with `pnpm --filter @workspace/wassce-study run build`.
2. Publish `artifacts/wassce-study/dist/public`.
3. Configure your host for SPA fallback to `index.html` so deep links such as `/resources` continue to work.
4. If the site is hosted under a subpath instead of a domain root, set Vite `BASE_PATH` to that path with a trailing slash and update the canonical URL in `index.html`, `robots.txt`, and `sitemap.xml`.

The app has no required database, account, API key, or server-side runtime for V1.

## Add a subject

Update the `subjects` array in `src/data.ts`. Add the subject name exactly once so it appears in the resource filter and progress view. Add study content in the relevant guide route in `src/App.tsx` and add mock questions to the `mocks` array when the subject has practice content.

The UI is intentionally driven by arrays rather than subject-specific components so new subjects can be added without changing the main navigation.

## Add a resource or PDF

1. Put the PDF in `public/resources/` with a safe, descriptive filename.
2. Inspect the PDF cover and internal pages before classifying it. Do not use the uploaded filename as proof of subject, year, paper, or official status.
3. Add a resource object to `src/data.ts` and the matching record to `public/data/resources.json`.
4. Include the required fields:
   - `subject`
   - `year`
   - `paper`
   - `section`
   - `resourceType`
   - `title`
   - `description`
   - `filePath`
   - `fileSize`
   - `dateAdded`
   - `tags`
5. Keep `verifiedStatus` and `rightsNote` honest. Use labels such as “Content inspected; official status not verified” for material whose official status is unknown.
6. Update `public/data/resources.json` if a downstream static data consumer needs the catalog. The current React UI uses `src/data.ts` so the initial page can render without a network request.

Supported resource types include `Past Question`, `Answer / Marking Scheme`, `Chief Examiners’ Report`, `Mock`, `Super Mock`, `Study Guide`, `Examination Guide`, and `Other`.

Duplicate PDFs should not be copied into the library. Compare file hashes and retain the clearest source copy.

## Update the PWA

- `public/manifest.json` contains the app name, short name, start URL, scope, theme colors and icons.
- `public/sw.js` caches the app shell, catalog data and any PDF the student opens. Change `CACHE_NAME` when the offline shell changes.
- `public/icons/icon-192.svg` and `public/icons/icon-512.svg` are the install icons.
- `src/components/app-shell.tsx` registers the service worker and handles the install prompt.

The browser only exposes the Android install prompt when its own installability criteria are met, including HTTPS and a valid manifest.

## AdSense readiness

The app has an independent About page, Contact page, Privacy page, Terms page, Disclaimer page, clear navigation, original study guidance and no fake advertisements. No AdSense publisher ID or ad code is included.

When a real publisher account is approved, add the official AdSense snippet in a dedicated component or layout slot. Keep ad configuration separate from resource and mock data. Do not place ads over answer choices, download controls or navigation, and do not imply ads are active before a real publisher ID is configured.

## Local data and privacy

V1 stores saved resources, theme preference, contact notes and mock results in browser `localStorage`. No account is required. Clearing site data removes this local record. The service worker can make previously opened PDFs available offline; the first open still requires a connection.

## Supplied resource audit

The included catalog contains 11 unique PDFs. Two exact duplicate Government/Practical files were excluded from the library. Scanned papers are labelled as scanned, independent mock booklets are labelled as independent, and the selected science answers sheet is not presented as an official marking scheme.

## Contact

abdulsammedtakiyudeen@gmail.com
## GitHub Pages deployment

This repository is configured for the repository Pages URL:
`https://abdulsammedtakiyudeen-bot.github.io/Wassce-past-questions-/`

The Vite public base is `/Wassce-past-questions-/`. The GitHub Actions workflow builds the app to `dist/` and deploys that folder to the `github-pages` environment.

In GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
After pushing to `main`, open **Actions** and wait for **Deploy WASSCE Study to GitHub Pages** to finish with a green check.
