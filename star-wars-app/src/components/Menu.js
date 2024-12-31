import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles.css";

function Menu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const location = useLocation();

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

  useEffect(() => {
    setSearchTerm("");
  }, [location]);

  const filteredResults = searchTerm
    ? results.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const extractIdFromUrl = (url) => {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  };

  const getLinkPath = (result) => {
    const idOrName = encodeURIComponent(result.name || result.title || extractIdFromUrl(result.url));
    switch (result.category) {
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
        <input
          type="text"
          placeholder="Search across all categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input styled-search"
        />
        {searchTerm && (
          <div className="results-grid">
            {filteredResults.map((result) => (
              <Link
                to={getLinkPath(result)}
                key={result.url}
                className="result-card"
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
