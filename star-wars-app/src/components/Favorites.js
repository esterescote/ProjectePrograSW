import React, { useContext } from 'react'; 
import { FavoritesContext } from '../context/FavoritesContext'; // Import context to access favorites data and actions
import { useNavigate } from 'react-router-dom'; // Import hook for navigation between routes

/**
 * Favorites Component
 * 
 * The purpose of this component is to display a list of favorite items, 
 * including characters, films, starships, species, and planets. 
 * It allows the user to navigate to detailed views of these items and to remove them from favorites.
 * The component interacts with the `FavoritesContext` to fetch, remove, and clear the favorites list.
 * It uses React Router for navigation to detailed pages.
 * 
 * Component structure:
 * - A list of favorites with clickable items and a button to remove them.
 * - A button to clear all favorites at once.
 */
function Favorites() {
  // Access the favorites array and functions to toggle and clear favorites from context
  const { favorites, toggleFavorite, clearFavorites } = useContext(FavoritesContext); 
  const navigate = useNavigate(); // Hook for navigating between pages

  // Function to handle navigation to the details of a selected item based on its type
  const handleNavigate = (item) => {
    // Check the type of item and navigate to the corresponding page with relevant data
    if (item.title) { 
      navigate(`/films/${item.id}`, { state: { film: item } }); // Navigate to film details
    } else if (item.name && item.population) {
      navigate(`/planets/${item.name}`, { state: { planetName: item.name } }); // Navigate to planet details
    } else if (item.name && item.designation) {
      navigate(`/species/${item.name}`, { state: { selectedSpecie: item } }); // Navigate to species details
    } else if (item.name && item.model) {
      navigate(`/starships/${item.name}`, { state: { starship: item } }); // Navigate to starship details
    } else if (item.name) {
      navigate(`/characters/${item.name}`, { state: { characterName: item.name } }); // Navigate to character details
    } else {
      console.error('Unknown item type:', item); // Log error if item type is unrecognized
    }
  };

  return (
    <div>
      <h2>FAVORITES</h2>
      {/* Check if there are any favorites */}
      {favorites.length > 0 ? (
        <ul>
          {/* Map over each favorite item to display its name or title */}
          {favorites.map((item) => (
            <li key={item.url}> {/* Use item's URL as unique key */}
              <h3
                onClick={() => handleNavigate(item)} // Trigger navigation on click
                style={{ cursor: 'pointer' }} // Style for making the title clickable
              >
                {item.title || item.name} {/* Display the title or name of the item */}
              </h3>
              <button
                onClick={() => toggleFavorite(item)} // Trigger function to remove item from favorites
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      ) : (
        // If there are no favorites, display a message
        <p className='breu'>No favorites added yet!</p>
      )}

      {/* Show a button to clear all favorites if there are any */}
      {favorites.length > 0 && (
        <button
          onClick={clearFavorites} // Trigger function to clear all favorites
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Clear All Favorites
        </button>
      )}
    </div>
  );
}

export default Favorites; // Export the component for use in other parts of the app
