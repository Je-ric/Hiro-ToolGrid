# ToolGrid

A collection of interactive mini-tools built with Vue 3 and Tailwind CSS. Each tool is self-contained, fast, and runs entirely in the browser with no backend required.

---

## Tools

| # | Tool | Description |
|---|------|-------------|
| 01 | Text Analyzer | Count words, characters, letters, numbers, and spaces. |
| 02 | Case Converter | Uppercase, lowercase, title case, camelCase, slug & more. |
| 03 | Markdown Previewer | Write Markdown and see a live preview. Export to HTML or .md. |
| 04 | Diff Checker | Compare two texts and highlight added, removed, and unchanged lines. |
| 05 | Smart Notes | Offline notepad with categories, search, and export. Auto-saved locally. |
| 06 | Currency Converter | Live exchange rates between world currencies. |
| 07 | Measure Converter | Convert length, weight, temp, area, volume, speed & more. |
| 08 | Roman Numerals | Convert between Roman numerals and decimal numbers. |
| 09 | Binary / Decimal / Hex | Convert between base 2, base 10, and base 16. |
| 10 | Base64 Encoder / Decoder | Encode/decode text and images to/from Base64 data URIs. |
| 11 | JWT Decoder | Decode JWT tokens — view header, payload, and expiration status. |
| 12 | JSON ↔ Table / CSV | Convert JSON arrays to tables or CSV, and CSV back to JSON. |
| 13 | JSON Schema Generator | Paste JSON to auto-generate its JSON Schema with type inference. |
| 14 | SQL Formatter | Paste messy SQL and get clean, formatted output with syntax highlighting. |
| 15 | Cron Parser | Convert cron expressions to human-readable descriptions with next run times. |
| 16 | .env Parser | Convert .env files to JSON and JSON back to .env format. |
| 17 | Password Generator | Generate secure passwords and PINs with custom options. |
| 18 | Dummy Data Generator | Generate Lorem Ipsum, names, emails, phones, dates & colors. |
| 19 | QR Code Generator | Generate and download QR codes for any text or URL. |
| 20 | BMI Calculator | Calculate BMI with metric or imperial units and see your category. |
| 21 | Age Calculator | Calculate exact age in years, months, weeks, days & hours. |
| 22 | Logic Gate Simulator | Toggle A & B inputs and see AND, OR, NOT, XOR and more. |
| 23 | Compass | Degree calculator, rotation mode, and directional arrow display. |
| 24 | Wheel Randomizer | Add names with weights and spin the wheel to pick a random winner. |
| 25 | LED Binary Clock | A live clock that displays time in binary using LED dots. |
| 26 | Pomodoro Timer | Focus/break cycles, task tracking, and session history. |
| 27 | JSON Formatter & Validator | Validate, pretty-print, and minify JSON with clear errors. |
| 28 | URL Encoder / Decoder | Encode URL components or decode percent-encoded text. |
| 29 | UUID Generator | Generate up to 100 cryptographically random version 4 UUIDs. |
| 30 | Unix Timestamp Converter | Convert seconds, milliseconds, and timezone-aware ISO dates. |

---

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **Vite** — build tool and dev server
- **Tailwind CSS** — compiled locally with PostCSS
- **Vue Router** — hash-based client-side routing
- **Boxicons** — bundled icon set

---

## Project Structure

```
src/
├── components/
│   ├── layouts/        # ToolLayout — back button + title wrapper
│   ├── tools/          # ToolCard — home grid card
│   └── ui/             # AppBtn, BentoCard, CardHeader, CopyBtn, ErrorBox, ResultBox, StatTile, TabBar
├── composables/        # useClipboard, usePomodoro, useTabBar
├── data/               # tools.js — tool registry and route definitions
├── router/             # index.js — vue-router setup
├── utils/              # per-tool logic (ageCalc, bmiCalc, passwordGen, etc.)
└── views/              # one .vue file per tool
```

---

## Getting Started

**Requirements:** Node.js 20.19+ or 22.12+ (Vite 8)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Directory features

Search by name, description, or category. Category changes preserve the search query.
Star tools to save favorites in this browser, filter favorites, and sort alphabetically.
Tool inputs are not saved by these new utilities; favorites store only tool paths.

## Validation

Run `npm test` for JSON, URL, UUID, and timestamp edge cases, and `npm run build` for the production build.
Styles, fonts, icons, and QR generation are bundled locally. Currency conversion requires external rates and an internet connection.

## Suggested next additions

- Text cleanup: remove duplicate lines, sort lines, and trim whitespace.
- Color converter and contrast checker for interface design.
- File checksum calculator using browser cryptography.
- Image resize and compression with local downloads.
- Timezone meeting planner with daylight-saving-aware comparisons.
- Saved tool settings and recent tools (store preferences, not pasted input).
- Add optional export/import backups for locally saved notes.

## Progressive Web App (PWA)

Install ToolGrid from the browser installation menu or the **Install app** button when supported. On iPhone/iPad, use Safari’s Share menu and **Add to Home Screen**. Production hosting requires HTTPS; localhost works for testing.

After the first successful online visit, wait for **This app is ready to use offline**. The production service worker caches all built routes, styles, fonts, icons, and local data assets, including routes you have not opened yet. A first visit still requires a connection.

Currency conversion and country flags need internet access. Exchange-rate API responses are not cached. Notes and favorites remain in browser storage; installation does not add account sync or backups.

Updates display **Reload to update** and **Later**. Finish any work or game before reloading; no update forces a reload. Ordinary reloads or closing the app can still discard unsaved in-memory state.

### Files used (source of truth)

- `vite.config.js`: manifest, precache, and cache policy.
- `src/components/PwaStatus.vue` and `src/App.vue`: installation, offline status, and update prompt.
- `src/main.js`, `src/style.css`, `tailwind.config.js`, and `postcss.config.js`: bundled interface assets and compiled CSS.
- `public/pwa-*.png` and `public/apple-touch-icon.png`: installation icons.

### Build and verify

1. Run `npm install`, then `npm run build` and `npm run preview`. The development server intentionally does not register a service worker.
2. Open the preview URL online and wait for offline readiness.
3. Switch browser networking offline, reload, and open routes you have not visited.
4. Reconnect, publish a changed build, and reopen the app to verify the update prompt. Choose **Later** to keep working or **Reload to update** when ready.

Deploy the complete `dist/` directory, including `sw.js`, its Workbox file, the manifest, and all assets. Serve `sw.js` and `index.html` with revalidation (for example, `Cache-Control: no-cache`); hashed assets may use immutable caching. Each app needs its own origin or a nonoverlapping deployment path and service-worker scope. The current configuration targets an origin root; configure Vite’s `base` and root-relative asset URLs before deploying under a subdirectory.
