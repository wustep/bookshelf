# 📚 Bookshelf

An interactive collection of books.

See: https://wustep-bookshelf.vercel.app/ for a live demo.

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

## Adding Books

Edit `public/data/books.json` to add your books:

```json
{
  "books": [
    {
      "id": "1",
      "title": "Design as Art",
      "author": "Bruno Munari",
      "year": 2024,
      "category": "Design",
      "color": "#E85D4C",
      "cover": "https://...",
      "notes": "My notes about this book...",
      "summary": "A brief summary of the book...",
      "quotes": ["Quote 1", "Quote 2"],
      "link": "https://goodreads.com/..."
    }
  ]
}
```

## Book Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier |
| `title` | string | Book title |
| `author` | string | Author name |
| `year` | number | Year you read it |
| `category` | string | Category (e.g., "Design", "Technology") |
| `color` | string | Accent color hex code |
| `cover` | string | Cover image URL (optional) |
| `notes` | string | Your personal notes |
| `summary` | string | Book summary (optional) |
| `quotes` | array | Favorite quotes (optional) |
| `link` | string | External link (e.g., Goodreads) |

## Tech Stack

- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI framework
- CSS custom properties for theming

## Inspiration
- Elizabeth Lin's [designisaparty.com/design-books](https://www.designisaparty.com/design-books) 
- Christoph Locher's [christophlocher.com/notes.bookshelf](https://www.christophlocher.com/notes/bookshelf)
- Flo Guo's [floguo.com/books](https://www.floguo.com/books)

## License

MIT
