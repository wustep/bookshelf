import { useState, useMemo } from "react"
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

	const handleBookClick = (book, position) => {
		setOriginPosition(position)
		setSelectedBook(book)
	}

	const handleCloseModal = () => {
		setSelectedBook(null)
		setOriginPosition(null)
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
						/>
						<BookGrid
							books={filteredBooks}
							onBookClick={handleBookClick}
							liftedBookId={selectedBook?.id}
						/>
					</>
				)}
			</div>

			<footer className="footer">
				<p>
					Built with <span className="heart">♥</span> for book lovers
				</p>
			</footer>

			{selectedBook && (
				<BookModal
					book={selectedBook}
					isOpen={!!selectedBook}
					onClose={handleCloseModal}
					originPosition={originPosition}
				/>
			)}
		</div>
	)
}

export default App
