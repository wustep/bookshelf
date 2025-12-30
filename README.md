# 📚 Bookshelf

A beautiful, curated collection of books inspired by [designisaparty.com](https://www.designisaparty.com/design-books) and [christophlocher.com](https://www.christophlocher.com/notes/bookshelf).

![Bookshelf Preview](preview.png)

## Features

- ✨ Beautiful, responsive grid layout with animated cards
- 🎨 Color-coded book cards with hover effects
- 🔍 Filter by category and year
- ↕️ Sort by recent, oldest, title, or author
- 🌙 Automatic dark/light theme support
- 📱 Mobile-friendly design
- 🔄 Flexible backend: JSON file or Notion database

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see your bookshelf.

## Configuration

### Using JSON Backend (Default)

Edit `public/data/books.json` to add your books:

```json
{
  "books": [
    {
      "id": "1",
      "title": "Design as Art",
      "author": "Bruno Munari",
      "year": 2024,
      "category": "Design Theory",
      "color": "#E85D4C",
      "cover": "https://...",
      "notes": "My notes about this book...",
      "link": "https://goodreads.com/..."
    }
  ]
}
```

### Using Notion Backend

1. Create a Notion integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)

2. Create a Notion database with these properties:
   - **Title** (title) - Book title
   - **Author** (text) - Author name
   - **Year** (number) - Year read
   - **Category** (select) - Book category
   - **Color** (text) - Hex color code (e.g., `#6C5CE7`)
   - **Cover** (url or files) - Cover image URL
   - **Notes** (text) - Your notes
   - **Link** (url) - Link to book

3. Share the database with your integration

4. Copy `.env.example` to `.env` and add your credentials:
   ```
   VITE_NOTION_API_KEY=your_integration_token
   VITE_NOTION_DATABASE_ID=your_database_id
   ```

5. Update `src/config.js` to use Notion:
   ```js
   export const config = {
     backend: 'notion',
     // ...
   };
   ```

6. **Important**: Notion API requires a backend proxy due to CORS. You'll need to set up a serverless function (e.g., Vercel, Netlify, or Cloudflare Workers) to proxy API requests.

## Book Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Book title |
| `author` | string | Author name |
| `year` | number | Year you read it |
| `category` | string | Category (e.g., "Design Theory", "Typography") |
| `color` | string | Accent color hex code |
| `cover` | string | Cover image URL |
| `notes` | string | Your personal notes |
| `link` | string | External link (e.g., Goodreads) |

## Tech Stack

- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI framework
- CSS custom properties for theming

## License

MIT
