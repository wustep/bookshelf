import { useState } from "react"
import "./BookCard.css"

export function BookCard({ book, index, onClick }) {
	const [imageError, setImageError] = useState(false)

	const handleClick = () => {
		onClick(book)
	}

	return (
		<article
			className="book-card"
			style={{
				"--book-color": book.color,
				"--animation-delay": `${index * 0.05}s`,
			}}
			onClick={handleClick}
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && handleClick()}
			role="button"
			aria-label={`Open ${book.title} by ${book.author}`}
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
			</div>

			<div className="book-card__year">{book.year}</div>
		</article>
	)
}
