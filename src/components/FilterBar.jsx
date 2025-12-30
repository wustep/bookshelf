import './FilterBar.css';

export function FilterBar({
  categories,
  years,
  selectedCategory,
  selectedYear,
  onCategoryChange,
  onYearChange,
  sortBy,
  onSortChange,
  bookCount,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__filters">
        <div className="filter-group">
          <label className="filter-label" htmlFor="category-filter">
            Category
          </label>
          <select
            id="category-filter"
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="year-filter">
            Year
          </label>
          <select
            id="year-filter"
            className="filter-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="sort-select">
            Sort
          </label>
          <select
            id="sort-select"
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A–Z</option>
            <option value="author">Author A–Z</option>
          </select>
        </div>
      </div>

      <div className="filter-bar__count">
        <span className="count-number">{bookCount}</span>
        <span className="count-label">{bookCount === 1 ? 'book' : 'books'}</span>
      </div>
    </div>
  );
}

