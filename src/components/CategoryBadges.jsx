import "./CategoryBadges.css"

export function CategoryBadges({ categories, selectedCategory, onCategoryChange, bookCount, onRandomBook }) {
	return (
		<div className="category-badges">
			<div className="category-badges__list">
				<button
					className={`category-badge ${!selectedCategory ? "category-badge--active" : ""}`}
					onClick={() => onCategoryChange("")}
				>
					All
					<span className="category-badge__count">{bookCount}</span>
				</button>
				{categories.map((category) => (
					<button
						key={category}
						className={`category-badge ${selectedCategory === category ? "category-badge--active" : ""}`}
						onClick={() => onCategoryChange(selectedCategory === category ? "" : category)}
					>
						{category}
					</button>
				))}
			</div>
			{onRandomBook && (
				<button
					className="category-badges__random"
					onClick={onRandomBook}
					aria-label="Open a random book"
					title="Surprise me!"
				>
					<span>🎲</span>
					<span>Random</span>
				</button>
			)}
		</div>
	)
}

