import { useEffect, useRef, useState, useCallback } from "react"
import "./BookModal.css"

export function BookModal({ book, isOpen, onClose, originPosition }) {
	const [animationPhase, setAnimationPhase] = useState("idle") // idle, lifting, opening, open, closing
	const [imageError, setImageError] = useState(false)
	const modalRef = useRef(null)
	const isClosingRef = useRef(false)
	const timersRef = useRef({ lift: null, open: null, close: null })

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
			<div className="book-modal__book" style={{ "--book-color": book.color }}>
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
