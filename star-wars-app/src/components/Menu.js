import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";
import "../styles.css";

function Menu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(""); // Filtre de categoria
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // Filtre per favorits
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estat del desplegable
  const location = useLocation();
  const { favorites } = useContext(FavoritesContext); // Per saber quins són els elements favorits

  // Càrrega inicial de dades
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          "https://swapi.py4e.com/api/films/",
          "https://swapi.py4e.com/api/people/",
          "https://swapi.py4e.com/api/planets/",
          "https://swapi.py4e.com/api/species/",
          "https://swapi.py4e.com/api/starships/",
        ];

        const data = await Promise.all(
          endpoints.map((endpoint) => fetch(endpoint).then((res) => res.json()))
        );

        const combinedResults = [
          ...data[0].results.map((item) => ({ ...item, category: "films" })),
          ...data[1].results.map((item) => ({ ...item, category: "characters" })),
          ...data[2].results.map((item) => ({ ...item, category: "planets" })),
          ...data[3].results.map((item) => ({ ...item, category: "species" })),
          ...data[4].results.map((item) => ({ ...item, category: "starships" })),
        ];

        setResults(combinedResults);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Efecte de neteja de la cerca quan canviem de pàgina
  useEffect(() => {
    setSearchTerm("");
  }, [location]);

  // Filtrar resultats
  const filteredResults = results
    .filter((item) => {
      // Filtrar per categoria si s'ha seleccionat alguna
      if (categoryFilter && item.category !== categoryFilter) {
        return false;
      }

      // Filtrar per favorits si l'usuari ho ha marcat
      if (showFavoritesOnly && !favorites.some((fav) => fav.url === item.url)) {
        return false;
      }

      // Filtrar per terme de cerca
      if (
        searchTerm &&
        !(
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    })
    .map((item) => item);
    
  // Extracció d'id de la URL
  const extractIdFromUrl = (url) => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };

  // Generar ruta per cada element
  const getLinkPath = (result) => {
    const idOrName = encodeURIComponent(result.name || result.title || extractIdFromUrl(result.url));
    switch (result.category) 
    {
      case "films":
        return `/films/${idOrName}`;
      case "characters":
        return `/characters/${idOrName}`;
      case "planets":
        return `/planets/${idOrName}`;
      case "species":
        return `/species/${idOrName}`;
      case "starships":
        return `/starships/${idOrName}`;
      default:
        return "/";
    }
  };

  // Funció per alternar l'estat del desplegable
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <nav className="menu">
        <ul>
          <li><Link to="/films">Films</Link></li>
          <li><Link to="/characters">Characters</Link></li>
          <li><Link to="/planets">Planets</Link></li>
          <li><Link to="/species">Species</Link></li>
          <li><Link to="/starships">Starships</Link></li>
          <li><Link to="/favorites">Favorites</Link></li>
        </ul>
      </nav>

      <div className="search-container">
        {/* Input de cerca */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input styled-search"
        />

        {/* Botó per obrir/tancar el desplegable */}
        <button className="filter-button" onClick={toggleDropdown}>
          Filters
        </button>

        {/* Menú de filtres desplegable */}
        {isDropdownOpen && (
          <div className="filters-dropdown">
            <div className="filters">
              <label>
                Category:
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="films">Films</option>
                  <option value="characters">Characters</option>
                  <option value="planets">Planets</option>
                  <option value="species">Species</option>
                  <option value="starships">Starships</option>
                </select>
              </label>

              <label>
                Show Only Favorites:
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Resultats de la cerca */}
        {searchTerm && (
        <div className="results-grid">
          {filteredResults.map((result) => (
            <Link 
              to={getLinkPath(result)} 
              key={result.url} 
              className="result-card"
              onClick={() => console.log("Element clicat:", result)} // Aquí s'afegeix el console.log
            >
              <h3>{result.name || result.title}</h3>
              <p><strong>Category:</strong> {result.category}</p>
            </Link>
          ))}
        </div>
      )}
      </div>
    </header>
  );
}

export default Menu;
