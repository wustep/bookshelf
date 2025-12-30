import { useState, useEffect } from "react"
import { config } from "../config"

export function useBooks() {
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function loadBooks() {
			const startTime = Date.now()
			try {
				setLoading(true)
				const response = await fetch(config.dataPath)
				const data = await response.json()
				setBooks(data.books)
			} catch (err) {
				setError(err.message)
				console.error("Failed to load books:", err)
			} finally {
				// Ensure minimum 800ms loading time for smooth transition
				const elapsed = Date.now() - startTime
				const remaining = Math.max(0, 800 - elapsed)
				setTimeout(() => setLoading(false), remaining)
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
