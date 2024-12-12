import React from "react";
import { Link } from "react-router-dom";
import homeIcon from "../assets/home.png"; // Assegura't que la imatge estigui a la carpeta indicada

function Header() {
  return (
    <header>
      <div className="header-container">
        <Link to="/">
          <img src={homeIcon} alt="Home" className="home-icon" />
        </Link>
        <h1>Star Wars Universe</h1>
      </div>
    </header>
  );
}

export default Header;
