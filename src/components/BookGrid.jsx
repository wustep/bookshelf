import { BookCard } from './BookCard';
import './BookGrid.css';

export function BookGrid({ books }) {
  if (books.length === 0) {
    return (
      <div className="book-grid__empty">
        <div className="book-grid__empty-icon">📚</div>
        <p>No books found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book, index) => (
        <BookCard key={book.id} book={book} index={index} />
      ))}
    </div>
  );
}

