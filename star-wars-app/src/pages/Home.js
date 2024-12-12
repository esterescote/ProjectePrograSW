import React from 'react';
import { Link } from 'react-router-dom'; // Afegim Link per navegar entre pàgines

function Home() {
  return (
    <div className="home-container">
      <h2>Welcome to the Star Wars Universe!</h2>
      <p>Select a category to explore more.</p>

      <div className="button-container">
        <Link to="/films" className="button-link">
          <button className="category-button">Films</button>
        </Link>
        <Link to="/characters" className="button-link">
          <button className="category-button">Characters</button>
        </Link>
        <Link to="/planets" className="button-link">
          <button className="category-button">Planets</button>
        </Link>
        <Link to="/species" className="button-link">
          <button className="category-button">Species</button>
        </Link>
        <Link to="/starships" className="button-link">
          <button className="category-button">Starships</button>
        </Link>
        <Link to="/favorites" className="button-link">
          <button className="category-button">Favorites</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
