# Upthrust

Responsive Next.js website using Tailwind CSS, Sanity content, and Three.js service artwork.

## Run locally

Use Node.js 24, then:

```sh
npm ci
cp .env.example .env
npm run dev
```

Open http://127.0.0.1:4321. `SANITY_ENABLED=true` loads published content from Sanity; `false` uses the local defaults. Keep private tokens out of public environment variables.

To run Sanity Studio in another terminal:

```sh
npm --prefix studio ci
npm run studio
```

Open http://127.0.0.1:3333. See [the editor guide](studio/EDITOR-GUIDE.md) for publishing content. The homepage reads published content on each request.

## File structure

```text
src/
  app/                   Routes, metadata, API endpoints, global theme
  components/
    artwork/             Shared decorative wireframe
    hero/                Hero layout and its artwork
    layout/              Navigation, footer, brand artwork
    services/            Panels, horizontal scrolling, ribbon renderer
    home/                Testimonials
    newsletter/          Form UI
    demo/                Development-only submission dashboard
  content/               Local content defaults
  lib/
    sanity/              Server-side content loading and validation
    analytics/           Browser conversion tracking
  server/newsletter/     Submission validation, request handling, storage
public/
  images/ribbons/        Transparent mobile ribbon renders
  models/                Web-ready GLB assets
scripts/                 Reproducible ribbon generation
studio/                  Separate Sanity Studio package and content schemas
tests/
  unit/                  Submission handler tests
  e2e/                   Responsive layout, horizontal services, form flow
```

Homepage components use Tailwind utilities. `src/app/globals.css` contains the theme and shared base rules. The additional CMS service fallback owns its stylesheet in `components/services/additional-services.css`.

## Services and ribbons

On desktops at least 1024 px wide, downward page scrolling moves through four aligned service panels. One WebGL scene follows the row with a shared camera, so the ribbon continues between panels. Keyboard focus and service heading links move to the relevant panel. Mobile, tablet and reduced-motion layouts stay stacked. A shared warped wireframe sits behind the desktop ribbon, with stacked versions on smaller screens.

`public/models/services-ribbon.glb` has four loops following the wide design reference. The original supplied `curve.glb` is preserved. Mobile backgrounds are lightweight transparent WebP renders of the new model, with no mobile WebGL renderer.

Edit the path and cross-section in `scripts/lib/ribbon-geometry.mjs`; shared lighting and framing live in `src/components/services/ribbon-config.ts`. Regenerate the GLB and mobile images with:

```sh
npx playwright install chromium
node scripts/render-service-ribbons.mjs
```

## Form submissions

The browser submits to `POST /api/newsletter`. Server validation requires consent, checks a honeypot, limits request size to 8 KB, and saves the record before reporting success. Consent wording and its hash are stored with the submission.

- `NEWSLETTER_STORAGE=sanity` saves each entry to the private `submissions` dataset. The adapter verifies dataset privacy before saving, and refuses the public content dataset. A dedicated server-only robot token stays in the ignored `.env` file.
- In Studio, switch to **Form submissions → Newsletter sign-ups**. Original submission and consent fields are read-only; review status is editable. Sign-in and project access are required.
- `/demo` shows recent saved entries during development only, using the configured storage provider. It is unavailable in production.
- Optional alternatives: `NEWSLETTER_STORAGE=webhook` posts to the configured HTTPS webhook; `NEWSLETTER_STORAGE=local` writes `.data/newsletter.ndjson` during development only. Production never writes a local file or falls back after storage failure.
- Successful saves emit `form_submit` into `window.dataLayer`, with a submission ID and form ID. Personal data is excluded from analytics. Failed saves do not emit the conversion event.

Confirmation emails and an email marketing integration are not configured.

## Deploy to Vercel

Import the repository into Vercel, select **Next.js**, keep the root directory as this folder, and use the default build settings (`npm run build`). The nested `studio` package is deployed separately. No custom Vercel configuration is required.

Set these project environment variables for Production (and Preview if testing forms there):

| Variable                     | Value                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `SANITY_ENABLED`             | `true`                                                                                               |
| `SANITY_PROJECT_ID`          | `lrx8bnhn`                                                                                           |
| `SANITY_DATASET`             | `production`                                                                                         |
| `NEWSLETTER_STORAGE`         | `sanity`                                                                                             |
| `SANITY_SUBMISSIONS_DATASET` | `submissions`                                                                                        |
| `SANITY_WRITE_TOKEN`         | Copy the private value from the local ignored `.env` into Vercel's sensitive environment setting.    |
| `NEXT_PUBLIC_GTM_ID`         | Your GTM container ID.                                                                               |
| `SITE_URL`                   | Final HTTPS website origin, once known. Omit until then to use Vercel's generated production domain. |

Never give the write token a `NEXT_PUBLIC_` or `SANITY_STUDIO_` prefix. Server-side Sanity writes do not require adding the website origin to Sanity CORS. Exact Vercel production, deployment and branch origins are accepted by the form handler using Vercel's system variables.

Redeploy after setting environment variables. Submit a synthetic email, confirm success, then check **Form submissions** in Studio. Confirmation emails and an email marketing platform are separate integrations.

To provision this setup again while logged into the Sanity CLI:

```sh
cd studio
npx sanity exec scripts/setup-submissions.ts --with-user-token
```

The script preserves an existing private dataset and local token. It never logs token values. The website has not been deployed by this task.

## Validation

```sh
npm run check
npm test
npm run test:e2e
npm run build
npm --prefix studio run typecheck
npm --prefix studio run lint
npm --prefix studio run build
```

Browser tests cover responsive layouts, desktop scroll progression and alignment, mobile ribbon loading, reduced motion, form persistence and conversion events, and storage errors.

## AI assistance

Codex assisted with the frontend, content schemas, ribbon geometry and rendering, form handling, tests and documentation. The statue uses reconstructed materials because its Blender procedural shader was not included in the supplied GLB.
