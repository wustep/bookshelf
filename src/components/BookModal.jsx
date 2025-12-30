import { useEffect, useRef, useState, useCallback } from "react"
import "./BookModal.css"

export function BookModal({ book, isOpen, onClose }) {
	const [isAnimating, setIsAnimating] = useState(false)
	const [isClosing, setIsClosing] = useState(false)
	const modalRef = useRef(null)

	const handleClose = useCallback(() => {
		if (isClosing) return
		setIsClosing(true)
		setTimeout(() => {
			setIsClosing(false)
			setIsAnimating(false)
			onClose()
		}, 500)
	}, [onClose, isClosing])

	useEffect(() => {
		if (isOpen) {
			setIsAnimating(true)
			setIsClosing(false)
			document.body.style.overflow = "hidden"
		}
		return () => {
			document.body.style.overflow = ""
		}
	}, [isOpen])

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape" && isOpen && !isClosing) {
				handleClose()
			}
		}
		window.addEventListener("keydown", handleEscape)
		return () => window.removeEventListener("keydown", handleEscape)
	}, [isOpen, isClosing, handleClose])

	const handleBackdropClick = (e) => {
		if (e.target === modalRef.current) {
			handleClose()
		}
	}

	if (!isOpen && !isAnimating) return null

	return (
		<div
			ref={modalRef}
			className={`book-modal ${isClosing ? "closing" : ""}`}
			onClick={handleBackdropClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div
				className="book-modal__book"
				style={{ "--book-color": book.color }}
			>
				{/* Book spine */}
				<div className="book-modal__spine">
					<span className="book-modal__spine-title">{book.title}</span>
				</div>

				{/* Front cover (flips open) */}
				<div className="book-modal__cover">
					<div className="book-modal__cover-front">
						{book.cover ? (
							<img src={book.cover} alt={book.title} />
						) : (
							<div className="book-modal__cover-placeholder">
								<span className="book-modal__cover-title">{book.title}</span>
								<span className="book-modal__cover-author">{book.author}</span>
							</div>
						)}
					</div>
					<div className="book-modal__cover-back" />
				</div>

				{/* Book pages / content */}
				<div className="book-modal__pages">
					<button
						className="book-modal__close"
						onClick={handleClose}
						aria-label="Close"
					>
						×
					</button>

					<div className="book-modal__content">
						<header className="book-modal__header">
							<span className="book-modal__category">{book.category}</span>
							<h2 id="modal-title" className="book-modal__title">
								{book.title}
							</h2>
							<p className="book-modal__author">by {book.author}</p>
							<span className="book-modal__year">{book.year}</span>
						</header>

						{book.notes && (
							<section className="book-modal__section">
								<h3>Notes</h3>
								<p>{book.notes}</p>
							</section>
						)}

						{book.summary && (
							<section className="book-modal__section">
								<h3>Summary</h3>
								<p>{book.summary}</p>
							</section>
						)}

						{book.quotes && book.quotes.length > 0 && (
							<section className="book-modal__section">
								<h3>Quotes</h3>
								<ul className="book-modal__quotes">
									{book.quotes.map((quote, index) => (
										<li key={index} className="book-modal__quote">
											<blockquote>"{quote}"</blockquote>
										</li>
									))}
								</ul>
							</section>
						)}

						{book.link && (
							<a
								href={book.link}
								target="_blank"
								rel="noopener noreferrer"
								className="book-modal__link"
							>
								View on Goodreads →
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
