import { useState, useMemo } from "react"
import { useBooks, useCategories, useYears } from "./hooks/useBooks"
import { Header } from "./components/Header"
import { FilterBar } from "./components/FilterBar"
import { BookGrid } from "./components/BookGrid"
import { BookModal } from "./components/BookModal"
import { Loader } from "./components/Loader"
import "./App.css"

function App() {
	const { books, loading, error } = useBooks()
	const categories = useCategories(books)
	const years = useYears(books)

	const [selectedCategory, setSelectedCategory] = useState("")
	const [selectedYear, setSelectedYear] = useState("")
	const [sortBy, setSortBy] = useState("recent")
	const [selectedBook, setSelectedBook] = useState(null)

	const filteredAndSortedBooks = useMemo(() => {
		let result = [...books]

		// Filter by category
		if (selectedCategory) {
			result = result.filter((book) => book.category === selectedCategory)
		}

		// Filter by year
		if (selectedYear) {
			result = result.filter(
				(book) => book.year === parseInt(selectedYear, 10)
			)
		}

		// Sort
		switch (sortBy) {
			case "recent":
				result.sort((a, b) => b.year - a.year)
				break
			case "oldest":
				result.sort((a, b) => a.year - b.year)
				break
			case "title":
				result.sort((a, b) => a.title.localeCompare(b.title))
				break
			case "author":
				result.sort((a, b) => a.author.localeCompare(b.author))
				break
			default:
				break
		}

		return result
	}, [books, selectedCategory, selectedYear, sortBy])

	const handleBookClick = (book) => {
		setSelectedBook(book)
	}

	const handleCloseModal = () => {
		setSelectedBook(null)
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
						<FilterBar
							categories={categories}
							years={years}
							selectedCategory={selectedCategory}
							selectedYear={selectedYear}
							onCategoryChange={setSelectedCategory}
							onYearChange={setSelectedYear}
							sortBy={sortBy}
							onSortChange={setSortBy}
							bookCount={filteredAndSortedBooks.length}
						/>
						<BookGrid
							books={filteredAndSortedBooks}
							onBookClick={handleBookClick}
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
				/>
			)}
		</div>
	)
}

export default App
