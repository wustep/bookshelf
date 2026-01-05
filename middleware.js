import { next, rewrite } from "@vercel/edge";

export const config = {
  matcher: "/",
};

export default function middleware(request) {
  const acceptHeader = request.headers.get("accept") || "";

  // Check if the client prefers markdown
  // Common patterns: "text/markdown", "text/md", or explicit markdown preference
  if (
    acceptHeader.includes("text/markdown") ||
    acceptHeader.includes("text/md")
  ) {
    return rewrite(new URL("/llms.md", request.url));
  }

  return next();
}

