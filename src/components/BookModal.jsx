import { useEffect, useRef, useState, useCallback } from "react"
import "./BookModal.css"

export function BookModal({ book, isOpen, onClose, originPosition }) {
	const [animationPhase, setAnimationPhase] = useState("idle") // idle, lifting, opening, open, closing
	const [imageError, setImageError] = useState(false)
	const modalRef = useRef(null)

	const handleClose = useCallback(() => {
		if (animationPhase === "closing") return
		setAnimationPhase("closing")
		setTimeout(() => {
			setAnimationPhase("idle")
			onClose()
		}, 600)
	}, [onClose, animationPhase])

	useEffect(() => {
		if (isOpen && animationPhase === "idle") {
			setImageError(false) // Reset image error state
			setAnimationPhase("lifting")
			document.body.style.overflow = "hidden"

			const liftTimer = setTimeout(() => {
				setAnimationPhase("opening")
			}, 350)

			const openTimer = setTimeout(() => {
				setAnimationPhase("open")
			}, 900)

			return () => {
				clearTimeout(liftTimer)
				clearTimeout(openTimer)
			}
		}
		return () => {
			document.body.style.overflow = ""
		}
	}, [isOpen])

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape" && isOpen && animationPhase !== "closing") {
				handleClose()
			}
		}
		window.addEventListener("keydown", handleEscape)
		return () => window.removeEventListener("keydown", handleEscape)
	}, [isOpen, animationPhase, handleClose])

	const handleBackdropClick = (e) => {
		if (e.target === modalRef.current && animationPhase === "open") {
			handleClose()
		}
	}

	if (!isOpen && animationPhase === "idle") return null

	// Calculate origin offset for the lift animation
	const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 0
	const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 0
	const originX = originPosition?.x ?? centerX
	const originY = originPosition?.y ?? centerY
	const offsetX = originX - centerX
	const offsetY = originY - centerY
	
	// Use cover dimensions for better scaling
	const targetWidth = Math.min(700, typeof window !== "undefined" ? window.innerWidth - 64 : 700)
	const originScale = originPosition ? Math.min(originPosition.coverWidth / targetWidth, 0.5) : 0.3

	// Check if book has a valid cover
	const hasCover = book.cover && !imageError

	return (
		<div
			ref={modalRef}
			className={`book-modal book-modal--${animationPhase}`}
			onClick={handleBackdropClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			style={{
				"--origin-x": `${offsetX}px`,
				"--origin-y": `${offsetY}px`,
				"--origin-scale": originScale,
			}}
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
						{hasCover ? (
							<img 
								src={book.cover} 
								alt={book.title}
								onError={() => setImageError(true)}
							/>
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
