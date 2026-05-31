# Shira V'Zimra

A book of Jewish liturgical music for the synagogue and the home, arranged for male voice choir by Stuart Izon. The site presents a compiled PDF of sheet music, navigable by piece or section, with links to recordings on YouTube, Spotify, Apple Music, and Amazon Music.

**Live site:** [shiravzimra.com](https://www.shiravzimra.com)

## Tech stack

- [Next.js 14](https://nextjs.org/) (TypeScript)
- [Tailwind CSS](https://tailwindcss.com/) + CSS Modules
- [react-pdf](https://github.com/wojtekmaj/react-pdf) for PDF rendering
- [Swiper](https://swiperjs.com/) for swipe navigation
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Available commands

```bash
yarn dev               # start dev server
yarn build             # production build (runs next-sitemap and PDF merge)
yarn test              # run Jest test suite
yarn test:watch        # run Jest in watch mode
yarn lint              # run ESLint
yarn build:scores-pdf  # regenerate the compiled PDF only
```

## Project structure

```
data/               # piece and section definitions
  types.ts          # Piece, Section, Group TypeScript interfaces
  index.ts          # exports allGroups, allSections, allPieces, allPiecesMap
  shabbat/          # one directory per liturgical group
  festivals/
  roshHashana/
  yomKippur/
  misc/
  songs/
pages/
  index.tsx         # main PDF viewer
  [chapter].tsx     # handles all piece and section routes
  404.tsx
components/         # one directory per component
scripts/            # Node scripts for building the compiled PDF
  merge-scores.js   # merges individual PDFs and generates the table of contents
public/
  dist/             # compiled shiravzimra.pdf (generated at build time)
  scores/           # individual piece PDFs, named by piece ID
```

## How pieces are organised

Pieces are grouped into **Groups** (e.g. Shabbat, Rosh Hashana) → **Sections** (e.g. Kabbalat Shabbat, Shacharit) → **Pieces** (individual arrangements). Each piece has:

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique slug, used as the URL and PDF filename |
| `name` | ✅ | Name of the prayer or song |
| `author` | ✅ | Composer or arranger |
| `description` | — | Background notes on the piece |
| `youtubeUrl` | — | Link to a YouTube recording |
| `spotifyUrl` | — | Link to a Spotify recording |
| `appleUrl` | — | Link to an Apple Music recording |
| `amazonUrl` | — | Link to an Amazon Music recording |

## Adding a new piece

1. **Add the PDF** — place the score at `public/scores/<id>.pdf`
2. **Add the data entry** — add a `Piece` object to the relevant section file in `data/`, using the same `id`
3. **Rebuild the compiled PDF** — run `yarn build:scores-pdf`
4. The piece is now live at `/<id>`

## Running tests

```bash
yarn test
```

Tests use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/). CI runs tests and linting automatically on every pull request via GitHub Actions.
