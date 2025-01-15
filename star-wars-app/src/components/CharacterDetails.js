// Import necessary modules and hooks from React and React Router
import React, { useState, useEffect, useContext } from 'react'; // Import React and hooks
import { FavoritesContext } from '../context/FavoritesContext'; // Import context for managing favorites
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks for routing

function CharacterDetails() {
  const { name } = useParams(); // Extract the character's name from the URL
  const navigate = useNavigate(); // Navigation hook for routing
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Access favorites context

  // State to manage character details, associated film titles, loading state, and film list visibility
  const [character, setCharacter] = useState(null); // Character details
  const [filmTitles, setFilmTitles] = useState([]); // List of film titles
  const [loading, setLoading] = useState(true); // Loading indicator
  const [showFilms, setShowFilms] = useState(false); // Toggle for displaying film list

  // Function to fetch all characters from SWAPI (handles pagination)
  const fetchAllCharacters = async () => {
    let allCharacters = []; // Initialize an array to store characters
    let nextUrl = 'https://swapi.py4e.com/api/people/'; // SWAPI endpoint for characters
    while (nextUrl) {
      const response = await fetch(nextUrl); // Fetch data from the current URL
      const data = await response.json(); // Parse the response as JSON
      allCharacters = [...allCharacters, ...data.results]; // Append characters to the array
      nextUrl = data.next; // Update the URL for the next page
    }
    return allCharacters; // Return the combined list of characters
  };

  // Effect to fetch character details whenever the name parameter changes
  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const allCharacters = await fetchAllCharacters(); // Fetch all characters
        const foundCharacter = allCharacters.find(
          (char) => char.name.toLowerCase() === name.toLowerCase()
        ); // Find the character by name (case-insensitive)

        if (!foundCharacter) {
          console.error('Character not found');
          setLoading(false); // Stop loading if character is not found
          return;
        }

        // Fetch additional data for the character (homeworld, species, and image)
        const homeworld = await fetch(foundCharacter.homeworld).then((res) => res.json());
        const species =
          foundCharacter.species.length > 0
            ? await fetch(foundCharacter.species[0]).then((res) => res.json())
            : { name: 'Unknown' };

        const imageResponse = await fetch('https://akabab.github.io/starwars-api/api/all.json');
        const imageData = await imageResponse.json();
        const characterImage =
          imageData.find((img) => img.name.toLowerCase() === foundCharacter.name.toLowerCase())
            ?.image || null; // Match character name to image

        // Combine all character details into a single object
        const detailedCharacter = {
          ...foundCharacter,
          homeworld: homeworld.name,
          species: species.name,
          image: characterImage,
        };

        setCharacter(detailedCharacter); // Save character details to state

        // Fetch titles for all films the character appeared in
        const titles = await Promise.all(
          foundCharacter.films.map((filmUrl) =>
            fetch(filmUrl)
              .then((response) => response.json())
              .then((film) => ({ title: film.title, details: film }))
          )
        );
        setFilmTitles(titles); // Save film titles to state
        setLoading(false); // Loading complete
      } catch (error) {
        console.error('Error fetching character details:', error);
        setLoading(false); // Stop loading in case of an error
      }
    };

    if (name) {
      fetchCharacterDetails(); // Fetch character details only when `name` is available
    }
  }, [name]);

  // Return a loading message while data is being fetched
  if (loading) {
    return <p className="breu">Loading character details...</p>;
  }

  // Display an error message if the character is not found
  if (!character) {
    return <p className="breu">Character not found.</p>;
  }

  return (
    <div className="character-details-container">
      {/* Header with navigation and favorite toggle buttons */}
      <div className="header-buttons">
        <button onClick={() => navigate(-1)} className="btn back-btn">Back</button>
        <button
          onClick={() => toggleFavorite(character)}
          className={`btn favorite-btn ${favorites.some((fav) => fav.url === character.url) ? 'active' : ''}`}
        >
          {favorites.some((fav) => fav.url === character.url)
            ? 'Remove from Favorites'
            : 'Add to Favorites'}
        </button>
      </div>

      {/* Character header displaying the name */}
      <div className="character-header">
        <h2>{character.name}</h2>
      </div>

      {/* Main content section with character image and details */}
      <div className="character-content">
        <div className="character-image">
          {character.image && <img src={character.image} alt={character.name} />}
        </div>
        <div className="character-details">
          <p><strong>Height:</strong> {character.height} cm</p>
          <p><strong>Mass:</strong> {character.mass} kg</p>
          <p><strong>Hair color:</strong> {character.hair_color}</p>
          <p><strong>Skin color:</strong> {character.skin_color}</p>
          <p><strong>Eye color:</strong> {character.eye_color}</p>
          <p><strong>Birth year:</strong> {character.birth_year}</p>
          <p><strong>Gender:</strong> {character.gender}</p>
          <p><strong>Homeworld:</strong> {character.homeworld}</p>
          <p><strong>Species:</strong> {character.species}</p>
        </div>
      </div>

      {/* Section to display a list of films the character appeared in */}
      <div className="character-films">
        <h3 onClick={() => setShowFilms(!showFilms)} className="desplegables">Films</h3>
        {showFilms && (
          <ul>
            {filmTitles.map((film, index) => (
              <li
                key={index}
                onClick={() => navigate(`/films/${film.title}`, { state: { film: film.details } })}
              >
                {film.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CharacterDetails;
