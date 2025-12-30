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
								stiffness: 400,
								damping: 40,
								mass: 1,
							},
							opacity: {
								duration: 0.38,
								delay: !hasAnimatedIn ? index * 0.035 : 0,
								ease: [0.16, 1, 0.3, 1],
							},
							y: {
								type: "spring",
								stiffness: 420,
								damping: 34,
								mass: 1,
								bounce: 0,
								delay: !hasAnimatedIn ? index * 0.035 : 0,
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
