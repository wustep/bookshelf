import { Dices, LayoutGrid, Library } from "lucide-react"
import "./CategoryBadges.css"

export function CategoryBadges({ 
	categories, 
	selectedCategory, 
	onCategoryChange, 
	bookCount, 
	onRandomBook,
	compactView,
	onToggleCompact 
}) {
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
			<div className="category-badges__actions">
				{onToggleCompact && (
					<button
						className={`category-badges__toggle ${compactView ? "category-badges__toggle--active" : ""}`}
						onClick={onToggleCompact}
						aria-label={compactView ? "Show full cards" : "Show covers only"}
						data-tooltip={compactView ? "Card view" : "Compact view"}
					>
						{compactView ? (
							<LayoutGrid size={16} />
						) : (
							<Library size={16} />
						)}
					</button>
				)}
				{onRandomBook && (
					<button
						className="category-badges__random"
						onClick={onRandomBook}
						aria-label="Open a random book"
						data-tooltip="Random book"
					>
						<Dices size={16} />
					</button>
				)}
			</div>
		</div>
	)
}

