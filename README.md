# Portfolio Blog

A personal portfolio and blog website for Wallace Zhou, showcasing photography work and written content. Built with Astro for optimal performance and SEO.

## Tech Stack

- **Framework:** [Astro](https://astro.build/) v5
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Content:** Markdown & MDX with type-safe frontmatter
- **Integrations:** Sitemap, RSS Feed

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or your preferred package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-blog.git
cd portfolio-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

## Project Structure

```
├── public/
│   ├── fonts/              # Custom web fonts
│   └── *.svg               # Logo and favicon assets
├── src/
│   ├── assets/             # Optimized images (processed by Astro)
│   ├── components/         # Reusable Astro components
│   │   ├── BaseHead.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── HeroSection.astro
│   │   ├── IntroductionSection.astro
│   │   ├── JournalSection.astro
│   │   └── SidebarNav.astro
│   ├── content/
│   │   └── blog/           # Blog posts (Markdown/MDX)
│   ├── layouts/            # Page layouts
│   ├── pages/              # File-based routing
│   │   ├── index.astro     # Homepage
│   │   ├── about.astro     # About page
│   │   ├── blog/           # Blog listing and posts
│   │   └── rss.xml.js      # RSS feed endpoint
│   └── styles/
│       └── global.css      # Global styles and Tailwind imports
├── astro.config.mjs        # Astro configuration
├── content.config.ts       # Content collection schemas
└── tsconfig.json           # TypeScript configuration
```

## Available Scripts

| Command           | Description                                      |
| :---------------- | :----------------------------------------------- |
| `npm run dev`     | Start development server at `localhost:4321`     |
| `npm run build`   | Build production site to `./dist/`               |
| `npm run preview` | Preview production build locally                 |
| `npm run astro`   | Run Astro CLI commands                           |

## Content Management

Blog posts are stored in `src/content/blog/` as Markdown or MDX files. Each post requires the following frontmatter:

```yaml
---
title: "Post Title"
description: "Brief description for SEO and previews"
pubDate: 2026-01-23
updatedDate: 2026-01-23  # optional
heroImage: "./path-to-image.jpg"  # optional
---
```

## Configuration

Update `src/consts.ts` to modify site-wide settings:

```typescript
export const SITE_TITLE = 'Your Name';
export const SITE_DESCRIPTION = 'Your site description';
```

Update the `site` property in `astro.config.mjs` before deploying:

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',
  // ...
});
```

## Deployment

This site can be deployed to any static hosting provider:

```bash
# Build for production
npm run build

# Output will be in ./dist/
```

Compatible with Vercel, Netlify, Cloudflare Pages, GitHub Pages, and other static hosts.

## License

MIT
