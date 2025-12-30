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
	// The card center should map to where the COVER center is when scaled
	const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 0
	const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 0
	
	// Modal dimensions
	const modalWidth = Math.min(700, typeof window !== "undefined" ? window.innerWidth - 64 : 700)
	const coverWidthAtScale1 = modalWidth * 0.5 // Cover is 50% of modal
	
	// Card dimensions
	const cardWidth = originPosition?.width ?? 200
	const cardCenterX = originPosition?.x ?? centerX
	const cardCenterY = originPosition?.y ?? centerY
	
	// Scale so the cover matches the card width
	const originScale = originPosition ? Math.min(cardWidth / coverWidthAtScale1, 0.85) : 0.4
	
	// At the origin scale, calculate where the cover center will be
	// Cover is at left:0 to left:50% of modal, so its center is at 25% of modal
	// Modal center is at centerX, so cover center at scale=1 is at: centerX - modalWidth*0.25
	// At origin scale, cover center is at: centerX - (modalWidth * originScale * 0.25)
	// We want this to equal cardCenterX
	// So offset = cardCenterX - (centerX - modalWidth * 0.25) for scale=1
	// But we're scaling, so: offset = cardCenterX - centerX + (modalWidth * 0.25 * (1 - originScale))
	
	// Simpler approach: just offset from center to center, accept slight misalignment
	const offsetX = cardCenterX - centerX
	const offsetY = cardCenterY - centerY

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
