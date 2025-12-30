import { useEffect, useRef, useState, useCallback } from "react"
import "./BookModal.css"

export function BookModal({ book, isOpen, onClose, originPosition, onNavigate, hasPrev, hasNext }) {
	const [animationPhase, setAnimationPhase] = useState("idle") // idle, lifting, opening, open, closing
	const [imageError, setImageError] = useState(false)
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [displayedBook, setDisplayedBook] = useState(book)
	const modalRef = useRef(null)
	const isClosingRef = useRef(false)
	const timersRef = useRef({ lift: null, open: null, close: null, transition: null })

	// Handle book change transition - fade out, swap, fade in
	useEffect(() => {
		if (book?.id !== displayedBook?.id && animationPhase === "open") {
			// Start fade out
			setIsTransitioning(true)
			
			// After fade out, swap the book and fade in
			timersRef.current.transition = setTimeout(() => {
				setDisplayedBook(book)
				setImageError(false)
				// Small delay before fade in
				setTimeout(() => {
					setIsTransitioning(false)
				}, 50)
			}, 150) // Fade out duration
			
			return () => clearTimeout(timersRef.current.transition)
		} else if (!displayedBook && book) {
			// Initial book set
			setDisplayedBook(book)
		}
	}, [book, displayedBook, animationPhase])

	const handleClose = useCallback(() => {
		if (isClosingRef.current) return
		isClosingRef.current = true

		// Clear any pending open timers
		clearTimeout(timersRef.current.lift)
		clearTimeout(timersRef.current.open)

		// Faster close if interrupting mid-animation
		const isInterrupting =
			animationPhase === "lifting" || animationPhase === "opening"
		const closeTime = isInterrupting ? 350 : 750

		setAnimationPhase(isInterrupting ? "closing-fast" : "closing")
		timersRef.current.close = setTimeout(() => {
			setAnimationPhase("idle")
			isClosingRef.current = false
			document.body.style.overflow = "" // Restore scrolling
			onClose()
		}, closeTime)
	}, [onClose, animationPhase])

	useEffect(() => {
		if (isOpen && animationPhase === "idle" && !isClosingRef.current) {
			setImageError(false) // Reset image error state
			setAnimationPhase("lifting")
			document.body.style.overflow = "hidden"

			timersRef.current.lift = setTimeout(() => {
				if (!isClosingRef.current) {
					setAnimationPhase("opening")
				}
			}, 350)

			timersRef.current.open = setTimeout(() => {
				if (!isClosingRef.current) {
					setAnimationPhase("open")
				}
			}, 900)

			return () => {
				clearTimeout(timersRef.current.lift)
				clearTimeout(timersRef.current.open)
			}
		}
		return () => {
			document.body.style.overflow = ""
		}
	}, [isOpen])

	useEffect(() => {
		const handleKeydown = (e) => {
			if (!isOpen || animationPhase === "closing" || animationPhase === "closing-fast") return
			
			if (e.key === "Escape") {
				handleClose()
			} else if (e.key === "ArrowLeft" && hasPrev && animationPhase === "open") {
				onNavigate(-1)
			} else if (e.key === "ArrowRight" && hasNext && animationPhase === "open") {
				onNavigate(1)
			}
		}
		window.addEventListener("keydown", handleKeydown)
		return () => window.removeEventListener("keydown", handleKeydown)
	}, [isOpen, animationPhase, handleClose, hasPrev, hasNext, onNavigate])

	const handleBackdropClick = (e) => {
		if (e.target === modalRef.current && animationPhase === "open") {
			handleClose()
		}
	}

	if (!isOpen && animationPhase === "idle") return null

	// Calculate origin offset for the lift animation
	const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 0
	const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 0

	// Modal dimensions (80vh max 600px height)
	const modalWidth = Math.min(
		700,
		typeof window !== "undefined" ? window.innerWidth - 64 : 700
	)
	const modalHeight = Math.min(
		600,
		typeof window !== "undefined" ? window.innerHeight * 0.8 : 600
	)
	const coverWidthAtScale1 = modalWidth * 0.5 // Cover is 50% of modal

	// Card dimensions
	const cardWidth = originPosition?.width ?? 200
	const cardCoverHeight = originPosition?.coverHeight ?? 300
	const cardCenterX = originPosition?.x ?? centerX
	const cardCenterY = originPosition?.y ?? centerY

	// Scale so the cover matches the card width
	const originScale = originPosition
		? Math.min(cardWidth / coverWidthAtScale1, 0.85)
		: 0.4

	// The cover's center is at 25% of modal width from the left edge
	const coverCenterOffset = modalWidth * 0.25 * originScale
	const offsetX = cardCenterX - centerX + coverCenterOffset

	// The modal's cover is taller than the card's cover when scaled to match width
	// Adjust Y to account for this height difference
	const modalCoverHeightAtScale = modalHeight * originScale
	const heightDiff = modalCoverHeightAtScale - cardCoverHeight
	const offsetY = cardCenterY - centerY + heightDiff / 2

	// Use displayedBook for content (delayed during transition)
	const currentBook = displayedBook || book
	const hasCover = currentBook?.cover && !imageError

	return (
		<div
			ref={modalRef}
			className={`book-modal book-modal--${animationPhase}${isTransitioning ? " book-modal--transitioning" : ""}`}
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
			<div className="book-modal__book" style={{ "--book-color": book.color }}>
				{/* Front cover (flips open) */}
				<div className="book-modal__cover">
					<div className="book-modal__cover-front">
						{hasCover ? (
							<img
								src={currentBook.cover}
								alt={currentBook.title}
								onError={() => setImageError(true)}
							/>
						) : (
							<div className="book-modal__cover-placeholder">
								<span className="book-modal__cover-title">{currentBook.title}</span>
								<span className="book-modal__cover-author">{currentBook.author}</span>
							</div>
						)}
					</div>
					<div className="book-modal__cover-back" />
				</div>

				{/* Book pages / content */}
				<div className="book-modal__pages">
					<div className="book-modal__nav">
						{hasPrev && (
							<button
								className="book-modal__nav-btn book-modal__nav-btn--prev"
								onClick={() => onNavigate(-1)}
								aria-label="Previous book"
							>
								←
							</button>
						)}
						{hasNext && (
							<button
								className="book-modal__nav-btn book-modal__nav-btn--next"
								onClick={() => onNavigate(1)}
								aria-label="Next book"
							>
								→
							</button>
						)}
						<button
							className="book-modal__close"
							onClick={handleClose}
							aria-label="Close"
						>
							×
						</button>
					</div>

					<div className="book-modal__content">
						<header className="book-modal__header">
							<span className="book-modal__category">{currentBook.category}</span>
							<h2 id="modal-title" className="book-modal__title">
								{currentBook.title}
							</h2>
							<p className="book-modal__author">by {currentBook.author}</p>
							<span className="book-modal__year">{currentBook.year}</span>
						</header>

						{currentBook.notes && (
							<section className="book-modal__section">
								<h3>Notes</h3>
								<p>{currentBook.notes}</p>
							</section>
						)}

						{currentBook.summary && (
							<section className="book-modal__section">
								<h3>Summary</h3>
								<p>{currentBook.summary}</p>
							</section>
						)}

						{currentBook.quotes && currentBook.quotes.length > 0 && (
							<section className="book-modal__section">
								<h3>Quotes</h3>
								<ul className="book-modal__quotes">
									{currentBook.quotes.map((quote, index) => (
										<li key={index} className="book-modal__quote">
											<blockquote>"{quote}"</blockquote>
										</li>
									))}
								</ul>
							</section>
						)}

						{(currentBook.goodreadsLink || currentBook.amazonLink) && (
							<div className="book-modal__links">
								{currentBook.goodreadsLink && (
									<a
										href={currentBook.goodreadsLink}
										target="_blank"
										rel="noopener noreferrer"
										className="book-modal__link"
									>
										View on Goodreads →
									</a>
								)}
								{currentBook.amazonLink && (
									<a
										href={currentBook.amazonLink}
										target="_blank"
										rel="noopener noreferrer"
										className="book-modal__link"
									>
										View on Amazon →
									</a>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
