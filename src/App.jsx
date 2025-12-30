import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { useBooks, useCategories } from "./hooks/useBooks"
import { Header } from "./components/Header"
import { CategoryBadges } from "./components/CategoryBadges"
import { BookGrid } from "./components/BookGrid"
import { BookModal } from "./components/BookModal"
import { Loader } from "./components/Loader"
import "./App.css"

function App() {
	const [fontsLoaded, setFontsLoaded] = useState(false)
	const { books, loading, error } = useBooks()
	const categories = useCategories(books)

	// Block rendering until fonts are loaded
	useEffect(() => {
		document.fonts.ready.then(() => setFontsLoaded(true))
	}, [])

	const [selectedCategory, setSelectedCategory] = useState("")
	const [selectedBook, setSelectedBook] = useState(null)
	const [originPosition, setOriginPosition] = useState(null)
	const [compactView, setCompactView] = useState(false)
	const [sortBy, setSortBy] = useState("date") // "date" or "alpha"
	const recentRandomIds = useRef([])

	const filteredBooks = useMemo(() => {
		let result = [...books]

		// Filter by category
		if (selectedCategory) {
			result = result.filter((book) => book.category === selectedCategory)
		}

		// Sort based on sortBy
		if (sortBy === "date") {
			result.sort((a, b) => {
				// Parse dates - support both "YYYY-MM-DD" and just year number
				const dateA = a.date ? new Date(a.date) : new Date(a.year, 0, 1)
				const dateB = b.date ? new Date(b.date) : new Date(b.year, 0, 1)
				return dateB - dateA
			})
		} else {
			result.sort((a, b) => a.title.localeCompare(b.title))
		}

		return result
	}, [books, selectedCategory, sortBy])

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

	// Don't render anything until fonts are loaded
	if (!fontsLoaded) {
		return null
	}

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
				<AnimatePresence mode="wait">
					{loading ? (
						<Loader key="loader" />
					) : (
						<div key="content">
							<Header />
							<CategoryBadges
								categories={categories}
								selectedCategory={selectedCategory}
								onCategoryChange={setSelectedCategory}
								bookCount={books.length}
								onRandomBook={handleRandomBook}
								compactView={compactView}
								onToggleCompact={() => setCompactView(!compactView)}
								sortBy={sortBy}
								onSortChange={() =>
									setSortBy(sortBy === "date" ? "alpha" : "date")
								}
							/>
							<BookGrid
								books={filteredBooks}
								onBookClick={handleBookClick}
								liftedBookId={selectedBook?.id}
								compactView={compactView}
							/>
						</div>
					)}
				</AnimatePresence>
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
