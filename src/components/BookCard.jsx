import { useState } from 'react';
import './BookCard.css';

export function BookCard({ book, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (book.link) {
      window.open(book.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      className="book-card"
      style={{
        '--book-color': book.color,
        '--animation-delay': `${index * 0.05}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role={book.link ? 'link' : undefined}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="book-card__cover-wrapper">
        {book.cover && !imageError ? (
          <img
            src={book.cover}
            alt={`Cover of ${book.title}`}
            className="book-card__cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="book-card__cover-placeholder">
            <span className="book-card__cover-title">{book.title}</span>
            <span className="book-card__cover-author">{book.author}</span>
          </div>
        )}
        <div className="book-card__color-accent" />
      </div>

      <div className="book-card__content">
        <span className="book-card__category">{book.category}</span>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        
        {book.notes && (
          <p className={`book-card__notes ${isHovered ? 'visible' : ''}`}>
            {book.notes}
          </p>
        )}
      </div>

      <div className="book-card__year">{book.year}</div>
    </article>
  );
}

