# MOMENZA
A static invitation creator: pick an occasion, choose a template, edit details with a live preview, then download a PNG/PDF or save it in your browser.

## Features
8 original templates across 6 occasions · gallery with filters · occasion-specific editor · palettes, fonts and decoration toggle · PNG (html2canvas) and PDF (jsPDF) export at 1080×1350 · LocalStorage saving, favourites and dashboard.

## Tech
HTML5, CSS3, vanilla JavaScript, Google Fonts, html2canvas and jsPDF (loaded from cdnjs). No backend.

## Structure
index.html · css/style.css (site) · css/templates.css (invitation designs) · js/templates.js (template data + renderers, brand name) · js/storage.js · js/download.js · js/app.js (routing, gallery, editor, dashboard)

## Run locally
Open the folder in VS Code, install the "Live Server" extension, right-click index.html → Open with Live Server. (Opening index.html directly also works.) An internet connection is needed for fonts and the two libraries.

## Add a template
Add an object to `TEMPLATES` in js/templates.js, plus CSS for its class in css/templates.css.

## Deploy
Push to a GitHub repository, then on vercel.com choose Add New → Project → import the repo → Deploy (no build settings needed).

## Limits
Saved invitations and favourites live in this browser's LocalStorage only: no sync between devices, and clearing site data deletes them.

## Branding
Name and tagline live in `BRAND` at the top of `js/templates.js`. The logo is inline SVG in `index.html`; the favicon is `assets/favicon.svg`.

## Photographs
Put licensed photos in `assets/images/` using the filenames in `assets/images/README.txt`. Without them, tinted placeholder frames show.

## Rename the GitHub repository
Repository → Settings → General → Repository name → `Momenza` → Rename. Then in Vercel: Project → Settings → General → rename if wanted. Update your local remote with `git remote set-url origin <new-url>`.

## Templates (600)
Each of the six categories has 100 templates. The first 20 per category are the original hand-composed designs and are never modified. The rest are generated in `js/templates.js` (`expandCollection`) from design pools: decoration motif x colour palette x layout x font. No (category, motif, palette) pair repeats. IDs look like `wedding-21` to `wedding-100`. To add more, raise the target in `expandCollection(100)` or add motifs to `DECOR` and `POOLS`.

## Gallery paging
12 templates per page with Previous/Next arrows and page numbers; only the current page is rendered, so 600 templates do not slow the page. Search, category, colour, style and sort all reset to page 1.
