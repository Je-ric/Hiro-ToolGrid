# ToolGrid

A collection of interactive mini-tools built with Vue 3 and Tailwind CSS. Each tool is self-contained, fast, and runs entirely in the browser with no backend required.

---

## Tools

| # | Tool | Description |
|---|------|-------------|
| 01 | Compass | Degree calculator, rotation mode, and directional arrow display |
| 02 | Password Generator | Generate secure passwords and PINs with custom options |
| 03 | Text Analyzer | Count words, characters, letters, numbers, and spaces |
| 04 | Roman Numerals | Convert between Roman numerals and decimal numbers |
| 05 | Case Converter | Uppercase, lowercase, title case, camelCase, slug & more |
| 06 | Currency Converter | Live exchange rates between world currencies |
| 07 | Measure Converter | Convert length, weight, temp, area, volume, speed & more |
| 08 | LED Binary Clock | A live clock that displays time in binary using LED dots |
| 09 | Binary / Decimal / Hex | Convert between base 2, base 10, and base 16 |
| 10 | Logic Gate Simulator | Toggle A & B inputs and see AND, OR, NOT, XOR and more |
| 11 | Dummy Data Generator | Generate Lorem Ipsum, names, emails, phones, dates & colors |
| 12 | QR Code Generator | Generate and download QR codes for any text or URL |
| 13 | Age Calculator | Calculate exact age in years, months, weeks, days & hours |
| 14 | JSON ↔ Table / CSV | Convert JSON arrays to tables or CSV, and CSV back to JSON |
| 15 | BMI Calculator | Calculate BMI with metric or imperial units |
| 16 | Pomodoro Timer | Focus/break cycles, task tracking, and session history |

---

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **Vite** — build tool and dev server
- **Tailwind CSS** — via CDN
- **Vue Router** — hash-based client-side routing
- **Boxicons** — icon set via CDN

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

**Requirements:** Node.js 18+

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
