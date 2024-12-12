import React from "react";
import { Link } from "react-router-dom";


function Header() 
{
  return (
    <header>
      <h1>Star Wars Universe</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/films">Films</Link></li>
          <li><Link to="/characters">Characters</Link></li>
          <li><Link to="/planets">Planets</Link></li>
          <li><Link to="/species">Species</Link></li>
          <li><Link to="/starships">Starships</Link></li>
          <li><Link to="/favorites">Favorites</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
