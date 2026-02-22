# Bookshelf

Interactive bookshelf web app built with React + Vite, deployed on Vercel.

Live: https://wustep-bookshelf.vercel.app/

## Commands

- `npm run dev` — Start dev server (http://localhost:5173)
- `npm run build` — Generate llms.md then build for production
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build
- `npm run generate:llms` — Generate the LLM-readable markdown file

## Architecture

- **Frontend**: React 19 (JSX, no TypeScript) with Vite 7, Framer Motion for animations, Lucide React for icons
- **Styling**: Plain CSS with CSS custom properties for theming, co-located component CSS files (e.g., `BookCard.css` alongside `BookCard.jsx`)
- **Data**: Book data lives in `public/data/books.json`; cover images in `public/data/covers/`
- **Content negotiation**: Vercel Edge Middleware (`middleware.ts`, TypeScript) serves `llms.md` when clients request `text/markdown`
- **API**: Vercel serverless function in `api/index.js`
- **LLM output**: `scripts/generate-llms-md.js` generates a markdown summary of the bookshelf, run as part of the build

## Project Structure

```
src/
  App.jsx          — Main app component
  config.js        — App configuration
  main.jsx         — Entry point
  components/      — UI components (BookCard, BookGrid, BookModal, CategoryBadges, Header, Loader)
  hooks/           — Custom hooks (useBooks)
api/               — Vercel serverless functions
scripts/           — Build scripts (generate-llms-md.js)
middleware.ts      — Vercel Edge Middleware for content negotiation
public/data/       — Book data (books.json) and cover images
```

## Code Style

- JSX for React components (not TypeScript)
- Tabs for indentation
- No semicolons in JS/JSX (see existing code)
- ESLint configured with react-hooks and react-refresh plugins
- Unused variable names may start with uppercase or underscore (`varsIgnorePattern: "^[A-Z_]"`)
