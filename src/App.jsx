import { useState, useMemo, useCallback, useRef } from "react"
import { useBooks, useCategories } from "./hooks/useBooks"
import { Header } from "./components/Header"
import { CategoryBadges } from "./components/CategoryBadges"
import { BookGrid } from "./components/BookGrid"
import { BookModal } from "./components/BookModal"
import { Loader } from "./components/Loader"
import "./App.css"

function App() {
	const { books, loading, error } = useBooks()
	const categories = useCategories(books)

	const [selectedCategory, setSelectedCategory] = useState("")
	const [selectedBook, setSelectedBook] = useState(null)
	const [originPosition, setOriginPosition] = useState(null)
	const [compactView, setCompactView] = useState(false)
	const recentRandomIds = useRef([])

	const filteredBooks = useMemo(() => {
		let result = [...books]

		// Filter by category
		if (selectedCategory) {
			result = result.filter((book) => book.category === selectedCategory)
		}

		// Sort by most recent
		result.sort((a, b) => b.year - a.year)

		return result
	}, [books, selectedCategory])

	const currentBookIndex = useMemo(() => {
		if (!selectedBook) return -1
		return filteredBooks.findIndex((b) => b.id === selectedBook.id)
	}, [selectedBook, filteredBooks])

	const handleBookClick = (book, position) => {
		setOriginPosition(position)
		setSelectedBook(book)
	}

	const handleCloseModal = () => {
		setSelectedBook(null)
		setOriginPosition(null)
	}

	const handleNavigate = useCallback(
		(direction) => {
			const newIndex = currentBookIndex + direction
			if (newIndex >= 0 && newIndex < filteredBooks.length) {
				setSelectedBook(filteredBooks[newIndex])
				// Clear origin position for smooth transition (no lift animation)
				setOriginPosition(null)
			}
		},
		[currentBookIndex, filteredBooks]
	)

	const handleRandomBook = useCallback(() => {
		if (books.length === 0) return

		// Filter out recently selected books (unless we have no other choice)
		let availableBooks = books.filter(
			(book) => !recentRandomIds.current.includes(book.id)
		)

		// If all books were recently selected, reset and use all books
		if (availableBooks.length === 0) {
			availableBooks = books
			recentRandomIds.current = []
		}

		const randomIndex = Math.floor(Math.random() * availableBooks.length)
		const randomBook = availableBooks[randomIndex]

		// Track this selection (keep last 3)
		recentRandomIds.current = [
			randomBook.id,
			...recentRandomIds.current.slice(0, 2),
		]

		// Find the book card and scroll to it
		const bookCard = document.querySelector(`[data-book-id="${randomBook.id}"]`)
		if (bookCard) {
			bookCard.scrollIntoView({ behavior: "instant", block: "center" })

			// Get position after scroll
			const rect = bookCard.getBoundingClientRect()
			const coverWrapper = bookCard.querySelector(".book-card__cover-wrapper")
			const coverRect = coverWrapper?.getBoundingClientRect() || rect

			setOriginPosition({
				x: rect.left + rect.width / 2,
				y: coverRect.top + coverRect.height / 2,
				width: rect.width,
				height: rect.height,
				coverWidth: coverRect.width,
				coverHeight: coverRect.height,
				hasCover: !!randomBook.cover,
			})
		} else {
			setOriginPosition(null)
		}

		setSelectedBook(randomBook)
	}, [books])

	if (error) {
		return (
			<div className="app">
				<div className="container">
					<Header />
					<div className="error">
						<p>Failed to load books: {error}</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="app">
			<div className="container">
				<Header />

				{loading ? (
					<Loader />
				) : (
					<>
						<CategoryBadges
							categories={categories}
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
							bookCount={books.length}
							onRandomBook={handleRandomBook}
							compactView={compactView}
							onToggleCompact={() => setCompactView(!compactView)}
						/>
						<BookGrid
							books={filteredBooks}
							onBookClick={handleBookClick}
							liftedBookId={selectedBook?.id}
							compactView={compactView}
						/>
					</>
				)}
			</div>

			<footer className="footer">
				<p>
					Built with <span className="heart">♥</span> by{" "}
					<a href="https://wustep.me" target="_blank">
						Stephen Wu
					</a>
				</p>
			</footer>

			{selectedBook && (
				<BookModal
					book={selectedBook}
					isOpen={!!selectedBook}
					onClose={handleCloseModal}
					originPosition={originPosition}
					onNavigate={handleNavigate}
					hasPrev={currentBookIndex > 0}
					hasNext={currentBookIndex < filteredBooks.length - 1}
				/>
			)}
		</div>
	)
}

export default App
