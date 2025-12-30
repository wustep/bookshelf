import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__brand">
          <span className="header__icon">✦</span>
          <h1 className="header__title">bookshelf</h1>
        </div>
        <p className="header__subtitle">
          a curated collection of design books
        </p>
      </div>
      <div className="header__decoration">
        <div className="header__orb header__orb--1" />
        <div className="header__orb header__orb--2" />
        <div className="header__orb header__orb--3" />
      </div>
    </header>
  );
}

