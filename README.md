# digitl-fe

Next.js front end for the Digitl marketing site: journal articles, project showcases, contact and subscribe flows, and Strapi-backed content.

## Requirements

- **Node.js** `>= 20.9.0` (required by Next.js 16)
- **npm** (or another compatible package manager)

## Install

```bash
npm install
```

## Run locally

Start the development server (with hot reload):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

The production server also listens on port **3000** by default unless you set `PORT`.

## Environment variables

Create a **`.env.local`** file in the project root (this file is gitignored). Strapi calls need a base URL; a read-only API token is recommended when your Strapi instance is not fully public.

| Variable | Required | Description |
|----------|----------|-------------|
| `STRAPI_URL` | Yes* | Strapi origin, e.g. `http://localhost:1337` (no trailing slash) |
| `STRAPI_API_TOKEN` | No | Bearer token for authenticated REST requests |

\*Without `STRAPI_URL`, server code that builds Strapi URLs will throw when those routes run.

Optional overrides if your Strapi collection API IDs differ from the defaults:

| Variable | Default |
|----------|---------|
| `STRAPI_ARTICLE_PLURAL` | `articles` |
| `STRAPI_CLIENT_SHOWCASE_PLURAL` | `client-showcases` |

Example `.env.local`:

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run [Biome](https://biomejs.dev/) checks |
| `npm run format` | Format with Biome |

## Stack

- **Next.js** 16 (App Router)
- **React** 19
- **Motion** (animations)
- **Biome** (lint/format)
- **Strapi** (headless CMS via REST)

## Project layout (high level)

- `app/` — Routes, layouts, pages, and API route handlers
- `app/components/` — UI components
- `lib/` — Strapi helpers, article/showcase normalization, outline utilities
 