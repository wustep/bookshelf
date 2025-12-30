import { useState, useEffect } from "react"
import { config } from "../config"

export function useBooks() {
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function loadBooks() {
			try {
				setLoading(true)
				const response = await fetch(config.dataPath)
				const data = await response.json()
				setBooks(data.books)
			} catch (err) {
				setError(err.message)
				console.error("Failed to load books:", err)
			} finally {
				setLoading(false)
			}
		}

		loadBooks()
	}, [])

	return { books, loading, error }
}

// Get unique categories from books
export function useCategories(books) {
	return [...new Set(books.map((book) => book.category))].sort()
}

// Get unique years from books
export function useYears(books) {
	return [...new Set(books.map((book) => book.year))].sort((a, b) => b - a)
}
