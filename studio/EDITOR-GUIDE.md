# Upthrust content editor

This Studio connects to the existing **upthrust** Sanity project (`lrx8bnhn`), using its `production` dataset. Content is stored in Sanity's cloud. Running the editor locally does not make the content local.

## Run locally

From this folder:

```sh
npm install
npm run dev
```

Open http://localhost:3333 and sign in with the account that owns the project.

## What to edit

- **Homepage:** the three headline lines, supporting statements, trust statistic, client logos, service order and SEO.
- **Services:** each service's introduction, bullet points, supplied project collage and contact link.
- **Footer & site settings:** footer artwork, contact columns, footer note, social names/links, privacy text/link, copyright and newsletter copy. The Site brand tab holds the header logo, site name and live website address.

Image descriptions are required for accessibility. The editorial hints explain how longer headlines affect the supplied design.

Homepage and Footer & site settings each have one fixed document; editors cannot accidentally duplicate or delete them. Services are separate documents referenced in the order set on Homepage.

## Drafts and publishing

Changes are drafts until you press **Publish**. Drafts require authentication even though the dataset is public.

Homepage, four services and Site settings are published from the supplied screenshot copy. Product & digital experience includes the supplied copy and project collage. Remaining original artwork and final URLs still need to be supplied. Missing images produce warnings; descriptions are required for supplied images.

Import the starter drafts only after checking the project. The `--missing` option preserves records with existing IDs:

```sh
npx sanity dataset import seed.ndjson --dataset production --missing
```

The Next.js frontend is connected. Publish and refresh the page to see changes; the homepage reads published Sanity content on each request.

## Security and submissions

Project ID and dataset name are public identifiers. Do not put private API tokens in `sanity.config.ts` or in `SANITY_STUDIO_*` environment variables: those values are bundled into the editor.

The Studio has two workspaces. **Website content** uses the public `production` dataset. **Form submissions** uses the private `submissions` dataset. Switch workspaces using the menu beside the Studio title, or open http://127.0.0.1:3333/submissions.

Open **Form submissions → Newsletter sign-ups** to see permanent form entries, newest first. Original email, timestamps and consent evidence are read-only; review status can be changed to New, Reviewed or Archived. Submission records can be deleted through the document action menu.

The website writes through its server API using a dedicated robot token in the ignored root `.env`. Studio uses your own Sanity login and contains no write token. Never put visitor emails or consent evidence in the public website dataset. The development `/demo` page also reads the configured private storage; it is disabled in production.

Studio validates editorial inputs. Its rules do not validate direct API writes; the frontend integration must validate fetched data as well.

## Remaining design assets

- Header logo, footer wordmark and client logo exports.
- Original service collages and technical drawing artwork.
- Font files or confirmed font families.
- Final contact descriptions, social URLs and privacy policy URL.

## Dependency review — 8 October 2026

The local setup passes TypeScript, ESLint and the production build. The Studio runtime is pinned to the installed version; automatic runtime updates are disabled so the deployed code matches what was tested.

The npm audit currently reports **22 transitive advisories: 11 moderate and 11 high**. The reported dependency paths include Sanity's CLI/code-generation tooling and module-federation tooling. A non-breaking `npm audit fix` did not resolve them under the laptop's dependency-age policy. No forced major downgrade or policy bypass was applied. This is not a clean dependency audit; review upstream fixes and the affected dependency paths before a production rollout.

The starter content is prepared in `seed.ndjson` and was imported successfully: six published documents, including the completed Product service.

## Product service setup

To add the Product service and its supplied collage to an existing dataset, run from the Studio folder:

```sh
npx sanity exec scripts/seed-product-service.ts --with-user-token
```

The script preserves existing content, fills missing Product fields and places the service after Brand on the homepage. Revision checks protect concurrent homepage edits. `scripts/seed-service-collages.ts` includes the Strategy, Brand, Product and Creative artwork for future imports. It fills missing images and preserves existing CMS artwork.

## Footer setup

Open **Website content → Footer & site settings**. Use the **Footer**, **Newsletter** and **Site brand** tabs, then **Publish** and refresh the website. Both sets of website links use the same contact columns, so the two locations stay in sync.

The footer keeps the supplied layout and wireframe. A complete uploaded wordmark replaces the built-in wordmark; its image description is used as the accessible label. The emblem can also be replaced independently. Empty contact descriptions and footer notes stay empty. Social links take precedence over the editable social names; clear both to hide the social line. The privacy text remains plain text until a real destination is supplied.

For existing datasets, run from the Studio folder:

```sh
npx sanity exec scripts/seed-footer.ts --with-user-token
```

This fills only missing fields in the existing published settings and any existing draft, uploads the supplied emblem if needed, and preserves editor changes. Initial description/note placeholders match the current design; replace or clear them in Studio. Newsletter content remains public website copy; visitor submissions continue to use the private dataset.
