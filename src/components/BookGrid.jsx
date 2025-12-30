import { useState, useEffect } from "react"
import { motion, LayoutGroup, AnimatePresence } from "framer-motion"
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

	const handleBookClick = (book, position) => {
		onBookClick(book, position)
	}

	return (
		<LayoutGroup>
			<div className={`book-grid ${compactView ? "book-grid--compact" : ""}`}>
				<AnimatePresence mode="popLayout">
					{books.length === 0 ? (
						<motion.div
							key="empty"
							className="book-grid__empty"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							<div className="book-grid__empty-icon">📚</div>
							<p>No books found matching your filters.</p>
						</motion.div>
					) : (
						books.map((book, index) => (
							<motion.div
								key={book.id}
								layout
								initial={
									!hasAnimatedIn
										? { opacity: 0, y: 30 }
										: { opacity: 0, scale: 0.9 }
								}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{
									opacity: 0,
									scale: 0.9,
									transition: { duration: 0.2 },
								}}
								transition={{
									layout: {
										type: "spring",
										stiffness: 400,
										damping: 40,
										mass: 1,
									},
									opacity: {
										duration: 0.5,
										delay: !hasAnimatedIn ? index * 0.05 : 0,
										ease: [0.16, 1, 0.3, 1],
									},
									y: {
										type: "spring",
										stiffness: 300,
										damping: 30,
										mass: 1,
										bounce: 0,
										delay: !hasAnimatedIn ? index * 0.05 : 0,
									},
									scale: {
										duration: 0.3,
										ease: [0.16, 1, 0.3, 1],
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
						))
					)}
				</AnimatePresence>
			</div>
		</LayoutGroup>
	)
}
