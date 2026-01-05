#!/usr/bin/env node

/**
 * Generates a markdown version of the bookshelf for LLMs
 * Run with: node scripts/generate-llms-md.js
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Read config to get the data path
const configContent = readFileSync(join(ROOT, "src/config.js"), "utf-8");
const dataPathMatch = configContent.match(/dataPath:\s*["']([^"']+)["']/);
const dataPath = dataPathMatch ? dataPathMatch[1] : "/data/books.json";

// Read the books data
const booksJsonPath = join(ROOT, "public", dataPath);
const booksData = JSON.parse(readFileSync(booksJsonPath, "utf-8"));
const books = booksData.books;

// Group books by category
const booksByCategory = {};
for (const book of books) {
  const category = book.category || "Uncategorized";
  if (!booksByCategory[category]) {
    booksByCategory[category] = [];
  }
  booksByCategory[category].push(book);
}

// Sort categories alphabetically
const sortedCategories = Object.keys(booksByCategory).sort();

// Generate markdown
let md = `# Bookshelf

> A curated collection of recommended books. This document is optimized for LLMs and AI assistants.

**Total Books:** ${books.length}  
**Categories:** ${sortedCategories.join(", ")}

---

## Overview

This bookshelf contains book recommendations organized by category. Each entry includes:
- Title and author
- Personal notes and reflections
- Notable quotes (when available)
- Links to Goodreads and Amazon

---

`;

// Generate table of contents
md += `## Table of Contents

`;
for (const category of sortedCategories) {
  const anchor = category.toLowerCase().replace(/\s+/g, "-");
  md += `- [${category}](#${anchor}) (${booksByCategory[category].length} books)\n`;
}
md += `\n---\n\n`;

// Generate each category section
for (const category of sortedCategories) {
  const categoryBooks = booksByCategory[category];
  
  md += `## ${category}\n\n`;
  
  for (const book of categoryBooks) {
    md += `### ${book.title}\n\n`;
    md += `**Author:** ${book.author}`;
    
    if (book.date) {
      const year = new Date(book.date).getFullYear();
      md += `  \n**Year Read:** ${year}`;
    } else if (book.year) {
      md += `  \n**Year Read:** ${book.year}`;
    }
    
    md += `\n\n`;
    
    if (book.notes) {
      md += `${book.notes}\n\n`;
    }
    
    if (book.summary) {
      md += `**Summary:** ${book.summary}\n\n`;
    }
    
    if (book.quotes && book.quotes.length > 0) {
      md += `**Notable Quotes:**\n\n`;
      for (const quote of book.quotes) {
        // Wrap long quotes nicely
        md += `> ${quote}\n\n`;
      }
    }
    
    // Links
    const links = [];
    if (book.goodreadsLink) {
      links.push(`[Goodreads](${book.goodreadsLink})`);
    }
    if (book.amazonLink) {
      links.push(`[Amazon](${book.amazonLink})`);
    }
    if (book.link) {
      links.push(`[Website](${book.link})`);
    }
    
    if (links.length > 0) {
      md += `**Links:** ${links.join(" · ")}\n\n`;
    }
    
    md += `---\n\n`;
  }
}

// Add footer
md += `## About

This is a markdown representation of the Bookshelf web application, designed for consumption by LLMs and AI assistants.

For the interactive version, visit the website.

*Generated on ${new Date().toISOString().split("T")[0]}*
`;

// Write the file
const outputPath = join(ROOT, "public/llms.md");
writeFileSync(outputPath, md, "utf-8");

console.log(`✅ Generated ${outputPath}`);
console.log(`   📚 ${books.length} books across ${sortedCategories.length} categories`);

