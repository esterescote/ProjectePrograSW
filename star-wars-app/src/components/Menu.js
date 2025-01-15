import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";
import "../styles.css";

// Main Goal: The Menu component handles displaying a navigation menu, a search bar, and a filterable list of items fetched from various SWAPI endpoints.
// Structure: The component includes navigation links, a search input, filter options (category and favorites), and a grid of results.
// Relation: It interacts with the FavoritesContext to display only favorite items and uses the useLocation hook to clear search on page change.

function Menu() {
  // State for controlling search input, result display, category filter, favorites filter, and dropdown visibility
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(""); // Filter by category (e.g., films, characters)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // Show only favorite items if true
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const location = useLocation(); // Hook to get current location (used for resetting search term)
  
  // Access favorites from the FavoritesContext to filter favorite items
  const { favorites } = useContext(FavoritesContext);

  // Effect for fetching data from multiple SWAPI endpoints on component mount
  useEffect(() => {
    // Helper function to fetch paginated results from an endpoint
    const fetchAllPages = async (endpoint) => {
      let allResults = [];
      let nextPage = endpoint;

      try {
        while (nextPage) {
          const response = await fetch(nextPage); // Fetch current page
          const data = await response.json();
          allResults = [...allResults, ...data.results]; // Append fetched results to allResults
          nextPage = data.next; // Set nextPage to the URL of the next page (or null if there is no more data)
        }
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error); // Log errors if the fetch fails
      }

      return allResults; // Return the collected results
    };

    // Fetch data from all SWAPI endpoints
    const fetchData = async () => {
      try {
        const endpoints = [
          "https://swapi.py4e.com/api/films/",
          "https://swapi.py4e.com/api/people/",
          "https://swapi.py4e.com/api/planets/",
          "https://swapi.py4e.com/api/species/",
          "https://swapi.py4e.com/api/starships/",
        ];

        // Fetch data from all endpoints in parallel
        const data = await Promise.all(
          endpoints.map((endpoint) => fetchAllPages(endpoint))
        );

        // Combine results from all categories with an additional 'category' field to distinguish them
        const combinedResults = [
          ...data[0].map((item) => ({ ...item, category: "films" })),
          ...data[1].map((item) => ({ ...item, category: "characters" })),
          ...data[2].map((item) => ({ ...item, category: "planets" })),
          ...data[3].map((item) => ({ ...item, category: "species" })),
          ...data[4].map((item) => ({ ...item, category: "starships" })),
        ];

        setResults(combinedResults); // Set combined results to state
      } catch (error) {
        console.error("Error fetching data:", error); // Log errors if fetching fails
      }
    };

    fetchData(); // Trigger the data fetching on component mount
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Effect for clearing the search term when the page changes (triggered by location change)
  useEffect(() => {
    setSearchTerm(""); // Reset search term when navigating to a new page
  }, [location]);

  // Filtering results based on the selected filters (search term, category, and favorites)
  const filteredResults = results
    .filter((item) => {
      // Filter by selected category
      if (categoryFilter && item.category !== categoryFilter) {
        return false;
      }

      // Filter by favorites if "Show Only Favorites" is enabled
      if (showFavoritesOnly && !favorites.some((fav) => fav.url === item.url)) {
        return false;
      }

      // Filter by search term, matching either name or title (case-insensitive)
      if (
        searchTerm &&
        !(
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return false;
      }

      return true; // Include item if it passes all filters
    })
    .map((item) => item); // Return the filtered results

  // Helper function to extract the ID from a URL (used to generate the link for each item)
  const extractIdFromUrl = (url) => {
    const parts = url.split("/").filter(Boolean); // Split URL by slashes and filter out empty strings
    return parts[parts.length - 1]; // Return the last part (the ID)
  };

  // Function to generate the correct link path based on the category and ID or name of the item
  const getLinkPath = (result) => {
    const idOrName = encodeURIComponent(result.name || result.title || extractIdFromUrl(result.url));
    switch (result.category) {
      case "films":
        return `/films/${idOrName}`; // Film route
      case "characters":
        return `/characters/${idOrName}`; // Character route
      case "planets":
        return `/planets/${idOrName}`; // Planet route
      case "species":
        return `/species/${idOrName}`; // Species route
      case "starships":
        return `/starships/${idOrName}`; // Starship route
      default:
        return "/"; // Default route (fallback)
    }
  };

  // Function to toggle the visibility of the filter dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown state
  };

  return (
    <header className="header">
      <nav className="menu">
        {/* Navigation links for different categories */}
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
        {/* Search input to filter results */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
          className="search-input styled-search"
        />

        {/* Button to toggle the filter dropdown */}
        <button className="filter-button" onClick={toggleDropdown}>
          Filters
        </button>

        {/* Filter dropdown, shown if isDropdownOpen is true */}
        {isDropdownOpen && (
          <div className="filters-dropdown">
            <div className="filters">
              {/* Category filter dropdown */}
              <label>
                Category:
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)} // Update categoryFilter state
                >
                  <option value="">All Categories</option>
                  <option value="films">Films</option>
                  <option value="characters">Characters</option>
                  <option value="planets">Planets</option>
                  <option value="species">Species</option>
                  <option value="starships">Starships</option>
                </select>
              </label>

              {/* Show Only Favorites checkbox */}
              <label>
                Show Only Favorites:
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)} // Update showFavoritesOnly state
                />
              </label>
            </div>
          </div>
        )}

        {/* Display the filtered search results */}
        {searchTerm && (
          <div className="results-grid">
            {filteredResults.map((result) => (
              <Link 
                to={getLinkPath(result)} 
                key={result.url} 
                className="result-card"
                onClick={() => console.log("Element clicked:", result)} // Log clicked item for debugging
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
