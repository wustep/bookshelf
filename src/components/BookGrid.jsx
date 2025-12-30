import { useState, useEffect } from "react"
import { motion, LayoutGroup } from "framer-motion"
import { BookCard } from "./BookCard"
import "./BookGrid.css"

export function BookGrid({ books, onBookClick, liftedBookId, compactView }) {
	const [hasAnimatedIn, setHasAnimatedIn] = useState(false)

	// Mark entrance animation as complete after first render
	useEffect(() => {
		if (books.length > 0 && !hasAnimatedIn) {
			const timer = setTimeout(() => setHasAnimatedIn(true), 600)
			return () => clearTimeout(timer)
		}
	}, [books.length, hasAnimatedIn])

	if (books.length === 0) {
		return (
			<div className="book-grid__empty">
				<div className="book-grid__empty-icon">📚</div>
				<p>No books found matching your filters.</p>
			</div>
		)
	}

	const handleBookClick = (book, position) => {
		onBookClick(book, position)
	}

	return (
		<LayoutGroup>
			<div className={`book-grid ${compactView ? "book-grid--compact" : ""}`}>
				{books.map((book, index) => (
					<motion.div
						key={book.id}
						layout
						initial={!hasAnimatedIn ? { opacity: 0, y: 30 } : false}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							layout: {
								type: "spring",
								stiffness: 180,
								damping: 22,
								mass: 1,
							},
							opacity: {
								duration: 0.5,
								delay: !hasAnimatedIn ? index * 0.04 : 0,
								ease: "easeOut",
							},
							y: {
								type: "spring",
								stiffness: 200,
								damping: 20,
								delay: !hasAnimatedIn ? index * 0.04 : 0,
							},
						}}
					>
						<BookCard
							book={book}
							index={index}
							onClick={handleBookClick}
							isLifted={book.id === liftedBookId}
							compact={compactView}
						/>
					</motion.div>
				))}
			</div>
		</LayoutGroup>
	)
}
