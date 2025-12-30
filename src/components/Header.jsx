import "./Header.css"

export function Header() {
	return (
		<header className="header">
			<div className="header__content">
				<div className="header__brand">
					<span className="header__icon">✦</span>
					<h1 className="header__title">bookshelf</h1>
				</div>
				<p className="header__subtitle">
					a curated collection of my favorite books
				</p>
			</div>
		</header>
	)
}
