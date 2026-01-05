export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  const acceptHeader = request.headers.get("accept") || "";

  // Check if the client prefers markdown
  if (
    acceptHeader.includes("text/markdown") ||
    acceptHeader.includes("text/md")
  ) {
    // Fetch and return the markdown file
    const url = new URL("/llms.md", request.url);
    const response = await fetch(url);
    const markdown = await response.text();

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  }

  // For regular requests, fetch the index.html
  const url = new URL("/index.html", request.url);
  return fetch(url);
}

