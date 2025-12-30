import { useState, useEffect } from "react"
import { config } from "../config"

// Fetch books from JSON file
async function fetchFromJson() {
	const response = await fetch(config.json.dataPath)
	const data = await response.json()
	return data.books
}

// Fetch books from Notion database
async function fetchFromNotion() {
	// Note: Notion API requires a backend proxy due to CORS
	// This is a simplified example - in production, you'd need a serverless function
	const response = await fetch("/api/notion/books")
	const data = await response.json()

	// Transform Notion response to our book format
	return data.results.map((page) => ({
		id: page.id,
		title: page.properties.Title?.title[0]?.plain_text || "",
		author: page.properties.Author?.rich_text[0]?.plain_text || "",
		year: page.properties.Year?.number || new Date().getFullYear(),
		category: page.properties.Category?.select?.name || "",
		color: page.properties.Color?.rich_text[0]?.plain_text || "#6C5CE7",
		cover:
			page.properties.Cover?.url ||
			page.properties.Cover?.files[0]?.file?.url ||
			"",
		notes: page.properties.Notes?.rich_text[0]?.plain_text || "",
		link: page.properties.Link?.url || "",
	}))
}

export function useBooks() {
	const [books, setBooks] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function loadBooks() {
			try {
				setLoading(true)
				const fetchFn =
					config.backend === "notion" ? fetchFromNotion : fetchFromJson
				const data = await fetchFn()
				setBooks(data)
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
