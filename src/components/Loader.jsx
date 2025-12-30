import './Loader.css';

export function Loader() {
  return (
    <div className="loader">
      <div className="loader__books">
        <div className="loader__book loader__book--1" />
        <div className="loader__book loader__book--2" />
        <div className="loader__book loader__book--3" />
      </div>
      <p className="loader__text">Loading books...</p>
    </div>
  );
}

