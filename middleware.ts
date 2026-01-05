export const config = {
	matcher: ["/"],
}

export default async function middleware(
	request: Request
): Promise<Response | void> {
	const acceptHeader = request.headers.get("accept") || ""

	// Check if the client prefers markdown
	if (
		acceptHeader.includes("text/markdown") ||
		acceptHeader.includes("text/md")
	) {
		// Fetch and serve the markdown file
		const url = new URL("/llms.md", request.url)
		const response = await fetch(url)
		const markdown = await response.text()

		return new Response(markdown, {
			headers: {
				"Content-Type": "text/markdown; charset=utf-8",
				"Cache-Control": "public, max-age=3600",
			},
		})
	}
}
