// Main task: The `Characters` component fetches a list of Star Wars characters from SWAPI,
// enriches their data with homeworld, species, and images, and displays them with pagination.
// It also allows users to mark characters as favorites and view detailed character information.

// Imports React and necessary hooks, context, and navigation tools
import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext'; // Context for managing favorite characters
import { useNavigate } from 'react-router-dom'; // Navigation hook for routing

function Characters() {
  // State variables to manage characters, loading status, current page, and pagination
  const [characters, setCharacters] = useState([]); // List of enriched character data
  const [loading, setLoading] = useState(true); // Tracks loading status
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const itemsPerPage = 10; // Number of characters to display per page
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Favorites context for adding/removing favorites
  const navigate = useNavigate(); // React Router's navigation hook

  // Function to fetch all characters from the SWAPI API, handling paginated responses
  const fetchAllCharacters = async () => {
    let allCharacters = []; // Array to store all characters
    let nextUrl = 'https://swapi.py4e.com/api/people/'; // Initial API endpoint
    while (nextUrl) {
      const response = await fetch(nextUrl); // Fetch a page of data
      const data = await response.json();
      allCharacters = [...allCharacters, ...data.results]; // Accumulate characters
      nextUrl = data.next; // Update the URL for the next page
    }
    return allCharacters; // Return the combined list of characters
  };

  // Effect to fetch character data, enrich it, and set the component state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCharacters = await fetchAllCharacters(); // Fetch basic character data

        // Enrich character data with homeworld and species information
        const detailedCharacters = await Promise.all(
          allCharacters.map(async (character) => {
            // Fetch homeworld data
            const homeworld = await fetch(character.homeworld).then((res) => res.json());
            // Fetch species data if available, otherwise default to "Unknown"
            const species =
              character.species.length > 0
                ? await fetch(character.species[0]).then((res) => res.json())
                : { name: 'Unknown' };

            return {
              ...character,
              homeworld: homeworld.name, // Add homeworld name
              species: species.name, // Add species name
            };
          })
        );

        // Fetch images for characters from an external API
        const fetchImagesPromise = fetch('https://akabab.github.io/starwars-api/api/all.json')
          .then((response) => response.json())
          .then((images) => {
            const imageMap = {}; // Map character names to image URLs
            images.forEach((image) => {
              imageMap[image.name.toLowerCase()] = image.image;
            });
            return imageMap; // Return the image map
          });

        const imageMap = await fetchImagesPromise; // Await image map data

        // Add image URLs to characters
        const charactersWithImages = detailedCharacters.map((character) => ({
          ...character,
          image: imageMap[character.name.toLowerCase()] || null, // Add image URL or null
        }));

        setCharacters(charactersWithImages); // Set the enriched character data
        setLoading(false); // Mark data loading as complete
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
        setLoading(false); // Stop loading on error
      }
    };

    fetchData(); // Trigger data fetching on component mount
  }, []);

  // Navigate to character details page with the selected character's name
  const showDetails = (character) => {
    navigate(`/characters/${character.name}`, { state: { characterName: character.name } });
  };

  // Calculate the characters to display based on the current pagination page
  const startIndex = (currentPage - 1) * itemsPerPage; // Starting index for slicing
  const endIndex = startIndex + itemsPerPage; // Ending index for slicing
  const currentCharacters = characters.slice(startIndex, endIndex); // Current page characters

  // Update the current page for pagination
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination buttons based on the total number of pages
  const totalPages = Math.ceil(characters.length / itemsPerPage); // Total pages
  const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1); // Page numbers

  return (
    <div>
      <h2>CHARACTERS</h2>
      {loading ? (
        <p className="breu">Loading characters...</p> // Show a loading message if data is still fetching
      ) : (
        <>
          {/* Display the list of characters */}
          <ul className="display-elements">
            {currentCharacters.map((character) => (
              <li key={character.url} style={{ marginBottom: '20px' }}>
                <h3>{character.name}</h3>
                {/* Show character image if available */}
                {character.image && (
                  <img
                    src={character.image}
                    alt={character.name}
                    style={{ width: 'auto', height: '250px', marginBottom: '10px' }}
                  />
                )}
                <p className="breu"><strong>Gender:</strong> {character.gender}</p>
                <p className="breu"><strong>Homeworld:</strong> {character.homeworld}</p>
                <p className="breu"><strong>Species:</strong> {character.species}</p>
                <div>
                  {/* Button to show character details */}
                  <button
                    onClick={() => showDetails(character)}
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
                  {/* Button to add/remove from favorites */}
                  <button
                    onClick={() => toggleFavorite(character)}
                    style={{
                      backgroundColor: favorites.some((fav) => fav.url === character.url)
                        ? 'red'
                        : 'gray',
                      color: 'white',
                      padding: '10px',
                      margin: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {favorites.some((fav) => fav.url === character.url)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'}
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Display pagination buttons */}
          <div className="pagination">
            {paginationButtons.map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                style={{
                  margin: '5px',
                  padding: '10px',
                  backgroundColor: page === currentPage ? '#FFCC00' : 'gray',
                  color: 'white',
                  borderRadius: '5px',
                  border: 'none',
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

export default Characters;
