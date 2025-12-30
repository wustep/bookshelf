// Backend configuration - switch between 'json' and 'notion'
export const config = {
	// Backend type: 'json' | 'notion'
	backend: "json",

	// Notion configuration (only needed if backend is 'notion')
	notion: {
		// Your Notion integration token
		apiKey: import.meta.env.VITE_NOTION_API_KEY || "",
		// Your Notion database ID
		databaseId: import.meta.env.VITE_NOTION_DATABASE_ID || "",
	},

	// JSON configuration (only needed if backend is 'json')
	json: {
		// Path to your books data file
		dataPath: "/data/books.json",
	},
}
