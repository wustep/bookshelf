import { useState, useRef } from "react"
import "./BookCard.css"

function getYear(dateStr) {
	if (!dateStr) return ""
	return new Date(dateStr).getFullYear()
}

export function BookCard({ book, index, onClick, isLifted, compact }) {
	const [imageError, setImageError] = useState(false)
	const cardRef = useRef(null)

	const handleClick = () => {
		if (isLifted) return // Don't allow clicking lifted card
		if (cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect()
			const coverWrapper = cardRef.current.querySelector(
				".book-card__cover-wrapper"
			)
			const coverRect = coverWrapper?.getBoundingClientRect() || rect
			onClick(book, {
				x: rect.left + rect.width / 2,
				y: coverRect.top + coverRect.height / 2, // Use cover's center Y, not card's
				width: rect.width,
				height: rect.height,
				coverWidth: coverRect.width,
				coverHeight: coverRect.height,
				hasCover: !!(book.cover && !imageError),
			})
		} else {
			onClick(book, null)
		}
	}

	return (
		<article
			ref={cardRef}
			className={`book-card ${isLifted ? "book-card--lifted" : ""} ${compact ? "book-card--compact" : ""}`}
			data-book-id={book.id}
			style={{
				"--book-color": book.color,
				"--animation-delay": `${index * 0.05}s`,
			}}
			onClick={handleClick}
			tabIndex={isLifted ? -1 : 0}
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

			{!compact && (
				<>
					<div className="book-card__content">
						<span className="book-card__category">{book.category}</span>
						<h3 className="book-card__title">{book.title}</h3>
						<p className="book-card__author">{book.author}</p>
					</div>

					<div className="book-card__year">
						{book.date ? getYear(book.date) : book.year}
					</div>
				</>
			)}

			{/* Placeholder overlay when book is lifted */}
			{isLifted && <div className="book-card__placeholder" />}
		</article>
	)
}
