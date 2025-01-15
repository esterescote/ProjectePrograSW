import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext'; // Import the context to manage the favorites state
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook to handle navigation

/**
 * Planets component displays a list of Star Wars planets.
 * It allows users to view planet details, toggle favorites, and paginate through the list.
 * The component fetches planet data from an external API (SWAPI), adds residents and films info, 
 * and handles page navigation with pagination.
 * 
 * Related to the 'FavoritesContext' for managing favorite planets, and uses React Router for navigation.
 */
function Planets() {
  // State hooks for holding planet data, loading state, and pagination
  const [planets, setPlanets] = useState([]); // Holds the list of planets to be displayed
  const [loading, setLoading] = useState(true); // Determines if the data is still loading
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 10; // Number of items per page for pagination (10 planets)
  
  // Using the FavoritesContext to access the list of favorite planets and toggle functionality
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // Using the useNavigate hook to navigate to a new page with detailed information about a selected planet
  const navigate = useNavigate();

  /**
   * Fetches all planets from the SWAPI, adds residents and films data to each planet, 
   * and updates the state with the final planet data.
   */
  const fetchAllPlanets = async () => {
    let allPlanets = [];
    let nextPageUrl = 'https://swapi.py4e.com/api/planets/'; // Initial URL for fetching planets

    try {
      setLoading(true); // Set loading state to true while fetching data
      while (nextPageUrl) {
        const response = await fetch(nextPageUrl); // Fetch planets data from the API
        const data = await response.json();
        allPlanets = [...allPlanets, ...data.results]; // Append fetched data to allPlanets array
        nextPageUrl = data.next; // Update nextPageUrl to fetch the next page if available
      }

      // Fetch residents' data for each planet
      const fetchResidentsPromises = allPlanets.map((planet) => {
        const residentsPromises = planet.residents.map((url) =>
          fetch(url).then((response) => response.json()) // Fetch data for each resident of the planet
        );

        return Promise.all(residentsPromises).then((residents) => {
          return { ...planet, residents: residents.map((resident) => resident.name) }; // Return planet with resident names
        });
      });

      // Wait for all residents' data to be fetched
      const planetsWithResidents = await Promise.all(fetchResidentsPromises);

      // Fetch films' data related to each planet
      const fetchFilmsPromises = planetsWithResidents.map((planet) => {
        const filmsPromises = planet.films.map((url) =>
          fetch(url).then((response) => response.json()) // Fetch film data for each planet
        );
        return Promise.all(filmsPromises).then((films) => {
          return { ...planet, films: films.map((film) => film.title) }; // Return planet with associated film titles
        });
      });

      // Wait for all films' data to be fetched
      const finalPlanets = await Promise.all(fetchFilmsPromises);

      setPlanets(finalPlanets); // Update the state with the final list of planets
      setLoading(false); // Set loading state to false once data is fetched
    } catch (error) {
      console.error('Error fetching planets:', error); // Log any errors during data fetching
      setLoading(false); // Set loading state to false even in case of error
    }
  };

  // Effect hook to load planets data when the component mounts
  useEffect(() => {
    fetchAllPlanets(); // Fetch planets data when the component is mounted
  }, []);

  // Calculate which planets to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlanets = planets.slice(startIndex, endIndex); // Get the current page planets to display

  // Function to handle page change in pagination
  const changePage = (page) => {
    setCurrentPage(page); // Update the current page state to the selected page
  };

  // Generate pagination buttons dynamically based on the total number of planets
  const totalPages = Math.ceil(planets.length / itemsPerPage); // Total pages based on planet count and items per page
  const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1); // Array of page numbers

  /**
   * Handles showing the details of a specific planet when clicked.
   * It navigates to the planet detail page with the planet name passed in the state.
   */
  const showDetails = (planet) => {
    navigate(`/planets/${planet.name}`, { state: { planetName: planet.name } }); // Navigate to the planet detail page
  };

  return (
    <div>
      <h2>PLANETS</h2>
      {loading ? (
        <p>Loading planets...</p> // Show loading message while data is being fetched
      ) : (
        <>
          <ul className="display-elements">
            {currentPlanets.map((planet) => (
              <li key={planet.url}>
                <h3>{planet.name}</h3>

                {/* Display basic details about each planet */}
                <p className='breu'><strong>Climate:</strong> {planet.climate}</p>
                <p className='breu'><strong>Terrain:</strong> {planet.terrain}</p>

                {/* Buttons for showing planet details and adding/removing from favorites */}
                <div className='button-DF'>
                  <button
                    onClick={() => showDetails(planet)}
                    style={{
                      backgroundColor: 'gray',
                      color: 'white',
                      padding: '10px',
                      margin: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Show Details
                  </button>
                  <button
                    onClick={() => toggleFavorite(planet)} // Toggle favorite status when clicked
                    style={{
                      backgroundColor: favorites.some((fav) => fav.url === planet.url) ? 'red' : 'gray',
                      color: 'white',
                      padding: '10px',
                      margin: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {favorites.some((fav) => fav.url === planet.url) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination buttons */}
          <div className="pagination">
            {paginationButtons.map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)} // Change the page when a button is clicked
                style={{
                  margin: '5px',
                  padding: '10px',
                  backgroundColor: page === currentPage ? '#FFCC00' : 'gray',
                  color: 'white',
                  borderRadius: '5px',
                  border: 'none',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Planets;
