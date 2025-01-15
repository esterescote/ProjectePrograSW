import React, { useState, useEffect, useContext } from 'react'; 
import { FavoritesContext } from '../context/FavoritesContext'; // Importing the FavoritesContext to manage favorite species
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook to handle navigation

/**
 * The Species component is responsible for displaying a list of species from the Star Wars API.
 * It fetches species data and displays them with the option to view detailed information or mark them as favorites.
 * The component also implements pagination and integrates with the FavoritesContext to manage favorites.
 * 
 * The main relationship with other components is the use of `FavoritesContext` for toggling favorites.
 * It also navigates to detailed species pages using React Router's `useNavigate`.
 * 
 * Component Structure:
 * - State management for species data, loading status, and current page.
 * - Pagination logic to display a limited number of species per page.
 * - Display a list of species with buttons for viewing details and adding/removing favorites.
 */
function Species() {
  // State variables
  const [species, setSpecies] = useState([]); // Stores all species data
  const [loading, setLoading] = useState(true); // Boolean for loading state
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page of species
  const itemsPerPage = 10; // The number of species per page
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Accesses FavoritesContext for managing favorites
  const navigate = useNavigate(); // Hook for navigation to detailed species pages

  /**
   * Fetches species data from the Star Wars API, including their homeworlds (planets).
   * This function handles pagination and fetches additional details as needed.
   * Updates the species state with the fetched data.
   */
  const fetchAllSpecies = async () => {
    let allSpecies = []; // Array to store all species
    let nextPageUrl = 'https://swapi.py4e.com/api/species/'; // Starting URL for the first page of species

    try {
      setLoading(true); // Set loading state to true while fetching data
      // Loop to fetch all pages of species data
      while (nextPageUrl) {
        const response = await fetch(nextPageUrl); // Fetch data from the current URL
        const data = await response.json(); // Parse the JSON response

        // Fetch homeworld (planet) data for each species, if available
        const fetchPlanetsPromises = data.results.map((specie) => {
          const planetsPromises = specie.homeworld
            ? [fetch(specie.homeworld).then((response) => response.json())] // Fetch the homeworld planet details
            : [];  // No homeworld, so return an empty array
          return Promise.all(planetsPromises).then((planets) => {
            return { ...specie, homeworld: planets.length > 0 ? planets[0].name : 'Unknown' };
          });
        });

        // Wait for all homeworld fetches to complete
        const updatedSpecies = await Promise.all(fetchPlanetsPromises);

        // Add the species data to the allSpecies array
        allSpecies = [...allSpecies, ...updatedSpecies];

        // Update the nextPageUrl for pagination (if another page exists)
        nextPageUrl = data.next;
      }

      setSpecies(allSpecies); // Update the species state with the fetched data
      setLoading(false); // Set loading state to false once the data is fetched
    } catch (error) {
      console.error('Error fetching Species:', error); // Handle any errors during the fetch process
      setLoading(false); // Set loading state to false in case of an error
    }
  };

  // useEffect hook to fetch data when the component is mounted
  useEffect(() => {
    fetchAllSpecies(); // Fetch all species when the component is first rendered
  }, []); // Empty dependency array to ensure this only runs on mount

  // Calculate which species should be displayed on the current page
  const startIndex = (currentPage - 1) * itemsPerPage; // Starting index of species for the current page
  const endIndex = startIndex + itemsPerPage; // Ending index (exclusive)
  const currentSpecies = species.slice(startIndex, endIndex); // Slice the species array to get only the current page's species

  // Function to change the current page
  const changePage = (page) => {
    setCurrentPage(page); // Update the current page state
  };

  // Calculate the total number of pages for pagination
  const totalPages = Math.ceil(species.length / itemsPerPage); // Total pages is the total species divided by items per page
  const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1); // Array of page numbers for pagination buttons

  /**
   * Navigates to the details page for the selected species.
   * Uses React Router's navigate function to route to a dynamic URL based on species name.
   * 
   * @param {Object} specie - The species object for which to show details.
   */
  const showDetails = (specie) => {
    navigate(`/species/${specie.name}`, { state: { specieName: specie.name } });
  };

  return (
    <div>
      <h2>SPECIES</h2>
      {loading ? (
        <p>Loading species...</p> // Show loading message while species data is being fetched
      ) : (
        <>
          <ul className="display-elements">
            {currentSpecies.map((specie) => (
              <li key={specie.url}>
                <h3>{specie.name}</h3>
                {/* Display basic information for each species */}
                <p className='breu'><strong>Classification:</strong> {specie.classification}</p>
                <p className='breu'><strong>Designation:</strong> {specie.designation}</p>
                <div className='button-DF'>
                  {/* Button to show detailed species info */}
                  <button
                    onClick={() => showDetails(specie)} 
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
                  {/* Button to toggle favorite status */}
                  <button
                    onClick={() => toggleFavorite(specie)} 
                    style={{
                      backgroundColor: favorites.some((fav) => fav.url === specie.url) ? 'red' : 'gray',
                      color: 'white',
                      padding: '10px',
                      margin: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {favorites.some((fav) => fav.url === specie.url)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'}
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
                onClick={() => changePage(page)} // Change to the selected page
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
                {page} {/* Display the page number */}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Species;
