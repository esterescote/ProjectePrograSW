import React, { useState, useEffect, useContext } from 'react'; 
import { FavoritesContext } from '../context/FavoritesContext'; // Importing the FavoritesContext to manage favorite starships
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation functionality

/**
 * The Starships component is responsible for fetching, displaying, and managing a list of starships.
 * It fetches starship data from an external API (SWAPI), displays the starships in a paginated list, and allows users to add/remove starships to/from their favorites list.
 * Additionally, it provides a detailed view of each starship when clicked.
 * 
 * The main relationship with other components is through the `FavoritesContext` for managing the favorites of starships.
 * It also uses `useNavigate` from React Router for navigation to the starship details page.
 * 
 * Component Structure:
 * - State management for starship data, loading state, and current page for pagination.
 * - Functionality for displaying a paginated list of starships and rendering the `Show Details` and `Add to Favorites` buttons.
 * - A navigation mechanism to show detailed starship information when clicked.
 * - Pagination logic to control the number of starships displayed per page and allow users to switch between pages.
 */
function Starships() {
  // State variables
  const [starships, setStarships] = useState([]); // Stores the list of all starships
  const [loading, setLoading] = useState(true); // Tracks the loading state while fetching data
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page of starships
  const itemsPerPage = 10; // Number of starships displayed per page (pagination)
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Accessing favorites context to manage favorites
  const navigate = useNavigate(); // Hook for navigation to detailed starship pages

  /**
   * fetchAllStarships is an asynchronous function that fetches starship data from the SWAPI.
   * It supports pagination by fetching data from multiple pages until all starships are retrieved.
   * It also updates the component state with the fetched starship data.
   */
  const fetchAllStarships = async () => {
    let allStarships = []; // Array to store all fetched starships
    let nextPageUrl = 'https://swapi.py4e.com/api/starships/'; // Initial URL to fetch starships

    try {
      setLoading(true); // Set loading state to true while data is being fetched
      // Loop to fetch all pages of starships until there is no "next" page
      while (nextPageUrl) {
        const response = await fetch(nextPageUrl); // Fetch data from the current page URL
        const data = await response.json(); // Parse the JSON data from the response

        // Add the starships from the current page to the allStarships array
        allStarships = [...allStarships, ...data.results];

        // Update the URL for the next page if available
        nextPageUrl = data.next;
      }

      // Once all starships have been fetched, update the state
      setStarships(allStarships);
      setLoading(false); // Set loading state to false once data is loaded
    } catch (error) {
      console.error('Error fetching Starships:', error); // Handle any errors during fetching
      setLoading(false); // Set loading state to false in case of an error
    }
  };

  // useEffect hook to fetch starship data when the component is mounted
  useEffect(() => {
    fetchAllStarships(); // Fetch all starships when the component is first rendered
  }, []); // Empty dependency array ensures this runs only once when the component is mounted

  // Calculate which starships should be displayed on the current page
  const startIndex = (currentPage - 1) * itemsPerPage; // The starting index for the current page
  const endIndex = startIndex + itemsPerPage; // The ending index (exclusive)
  const currentStarships = starships.slice(startIndex, endIndex); // Get the slice of starships for the current page

  /**
   * changePage is a function to update the current page when a pagination button is clicked.
   * It updates the state with the new page number.
   */
  const changePage = (page) => {
    setCurrentPage(page); // Set the new current page number
  };

  // Calculate the total number of pages for pagination
  const totalPages = Math.ceil(starships.length / itemsPerPage); // Total number of pages based on total starships
  const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1); // Create an array of page numbers for the pagination buttons

  /**
   * showDetails is a function that navigates to the detailed view of a specific starship.
   * It uses the `useNavigate` hook to navigate to the `starships/{name}` route with the starship data passed in the state.
   * 
   * @param {Object} starship - The starship object that will be shown in the details page.
   */
  const showDetails = (starship) => {
    navigate(`/starships/${starship.name}`, { state: { starship } }); // Navigate to the details page with the starship data
  };

  return (
    <div>
      <h2>STARSHIPS</h2>
      {loading ? (
        <p className='breu'>Loading starships...</p> // Show loading message while data is being fetched
      ) : (
        <>
          <ul className="display-elements">
            {currentStarships.map((starship) => (
              <li key={starship.url}>
                <h3>{starship.name}</h3>
                {/* Display some basic information for each starship */}
                <p className='breu'><strong>Model: </strong>{starship.model}</p>
                <p className='breu'><strong>Manufacturer: </strong>{starship.manufacturer}</p>
                <p className='breu'><strong>Cost: </strong>{starship.cost_in_credits} credits</p>
                <div className='button-DF'>
                  {/* Button to navigate to the detailed starship page */}
                  <button
                    onClick={() => showDetails(starship)} 
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
                  {/* Button to add/remove the starship from favorites */}
                  <button
                    onClick={() => toggleFavorite(starship)}
                    style={{
                      backgroundColor: favorites.some((fav) => fav.url === starship.url) ? 'red' : 'gray',
                      color: 'white',
                      padding: '10px',
                      margin: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {favorites.some((fav) => fav.url === starship.url)
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
                onClick={() => changePage(page)} // Update the current page when a button is clicked
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

export default Starships;
