import React, { useState, useEffect, useContext } from 'react'; 
import { FavoritesContext } from '../context/FavoritesContext'; // Import context to handle favorites logic
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks for fetching URL parameters and navigating between pages

/**
 * FilmDetails Component
 * 
 * This component displays detailed information about a specific film.
 * It fetches film data from an API and also displays related characters, planets, starships, and species.
 * The user can toggle the film as a favorite, and the component handles navigation to other pages based on the film's related entities.
 * 
 * Component structure:
 * - Displays film information such as title, director, producer, etc.
 * - Displays related characters, planets, starships, and species with collapsible sections.
 * - Provides options to add/remove the film to/from favorites.
 * - Allows navigation to individual entity details (characters, planets, starships, species).
 */
function FilmDetails() {
  // Extract the title of the film from the URL parameters using useParams
  const { title } = useParams(); 
  const navigate = useNavigate(); // Hook to navigate between pages
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Access favorites from context

  // State variables to hold film details and related entity names
  const [film, setFilm] = useState(null);
  const [characterNames, setCharacterNames] = useState([]);
  const [planetNames, setPlanetNames] = useState([]);
  const [starshipNames, setStarshipNames] = useState([]);
  const [speciesNames, setSpeciesNames] = useState([]);

  // State variables to handle showing/hiding of related entities
  const [showCharacters, setShowCharacters] = useState(false);
  const [showPlanets, setShowPlanets] = useState(false);
  const [showStarships, setShowStarships] = useState(false);
  const [showSpecies, setShowSpecies] = useState(false);

  // Fetch all films from the API
  const fetchAllFilms = async () => {
    const response = await fetch('https://swapi.py4e.com/api/films/');
    const data = await response.json();
    return data.results;
  };

  // UseEffect hook to fetch film details when the title in the URL changes
  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        const allFilms = await fetchAllFilms();
        const foundFilm = allFilms.find(
          (f) => f.title.toLowerCase() === title.toLowerCase() // Find the film by matching title
        );

        if (!foundFilm) {
          console.error('Film not found');
          return;
        }

        setFilm(foundFilm);

        // Fetch related data (characters, planets, starships, species)
        const fetchCharacterNames = async () => {
          if (foundFilm.characters && foundFilm.characters.length > 0) {
            const names = await Promise.all(
              foundFilm.characters.map((characterUrl) =>
                fetch(characterUrl)
                  .then((response) => response.json())
                  .then((data) => data.name)
              )
            );
            setCharacterNames(names);
          }
        };

        const fetchPlanetNames = async () => {
          if (foundFilm.planets && foundFilm.planets.length > 0) {
            const names = await Promise.all(
              foundFilm.planets.map((planetUrl) =>
                fetch(planetUrl)
                  .then((response) => response.json())
                  .then((data) => data.name)
              )
            );
            setPlanetNames(names);
          }
        };

        const fetchStarshipNames = async () => {
          if (foundFilm.starships && foundFilm.starships.length > 0) {
            const names = await Promise.all(
              foundFilm.starships.map((starshipUrl) =>
                fetch(starshipUrl)
                  .then((response) => response.json())
                  .then((data) => data.name)
              )
            );
            setStarshipNames(names);
          }
        };

        const fetchSpeciesNames = async () => {
          if (foundFilm.species && foundFilm.species.length > 0) {
            const names = await Promise.all(
              foundFilm.species.map((speciesUrl) =>
                fetch(speciesUrl)
                  .then((response) => response.json())
                  .then((data) => data.name)
              )
            );
            setSpeciesNames(names);
          }
        };

        fetchCharacterNames();
        fetchPlanetNames();
        fetchStarshipNames();
        fetchSpeciesNames();
      } catch (error) {
        console.error('Error fetching film details:', error); // Error handling for fetch
      }
    };

    if (title) {
      fetchFilmDetails();
    }
  }, [title]); // Run this effect when the title parameter changes

  if (!film) {
    return <p className='breu'>No film details available.</p>; // Display a message if no film is found
  }

  return (
    <div>
      {/* Button to navigate back to the previous page */}
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: 'gray',
          color: 'white',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Back
      </button>

      {/* Button to toggle adding/removing the film to/from favorites */}
      <button
        onClick={() => toggleFavorite(film)}
        style={{
          backgroundColor: favorites.some((fav) => fav.url === film.url) ? 'red' : 'gray', // Highlight button if film is in favorites
          color: 'white',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {favorites.some((fav) => fav.url === film.url)
          ? 'Remove from Favorites'
          : 'Add to Favorites'}
      </button>

      {/* Film title */}
      <h2>{film.title}</h2>

      {/* Display the film's poster if available */}
      {film.poster && (
        <img
          src={film.poster}
          alt={film.title}
          style={{ width: '300px', height: 'auto', marginBottom: '20px' }}
        />
      )}

      {/* Display film details */}
      <p className='breu'><strong>Episode: </strong>{film.episode_id}</p>
      <p className='breu'><strong>Director: </strong>{film.director}</p>
      <p className='breu'><strong>Producer: </strong>{film.producer}</p>
      <p className='breu'><strong>Release Date: </strong>{film.release_date}</p>
      <p className='breu'><strong>Opening: </strong>{film.opening_crawl}</p>

      {/* Toggle display of related entities (characters, planets, starships, species) */}
      <h3 className="desplegables" onClick={() => setShowCharacters(!showCharacters)} style={{ cursor: 'pointer' }}>
        Characters
      </h3>
      {showCharacters && (
        <ul className="display-elements">
          {characterNames.length > 0 ? (
            characterNames.map((name, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/characters/${name}`, { state: { characterName: name } }) // Navigate to character details page
                }
                style={{ cursor: 'pointer' }}
              >
                {name}
              </li>
            ))
          ) : (
            <p>No characters available</p>
          )}
        </ul>
      )}

      {/* Similar collapsible sections for planets, starships, and species */}
      <h3 className="desplegables" onClick={() => setShowPlanets(!showPlanets)} style={{ cursor: 'pointer' }}>
        Planets
      </h3>
      {showPlanets && (
        <ul className="display-elements">
          {planetNames.length > 0 ? (
            planetNames.map((name, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/planets/${name}`, { state: { planetName: name } }) // Navigate to planet details page
                }
                style={{ cursor: 'pointer' }}
              >
                {name}
              </li>
            ))
          ) : (
            <p>No planets available</p>
          )}
        </ul>
      )}

      {/* Similar structure for starships and species */}
      <h3 className="desplegables" onClick={() => setShowStarships(!showStarships)} style={{ cursor: 'pointer' }}>
        Starships
      </h3>
      {showStarships && (
        <ul className="display-elements">
          {starshipNames.length > 0 ? (
            starshipNames.map((name, index) => (
              <li
                key={index}
                onClick={() => {
                  const starship = film.starships[index];
                  fetch(starship)
                    .then((response) => response.json())
                    .then((data) => {
                      navigate(`/starships/${data.name}`, { state: { starship: data } });
                    });
                }}
                style={{ cursor: 'pointer' }}
              >
                {name}
              </li>
            ))
          ) : (
            <p>No starships available</p>
          )}
        </ul>
      )}

      <h3 className="desplegables" onClick={() => setShowSpecies(!showSpecies)} style={{ cursor: 'pointer' }}>
        Species
      </h3>
      {showSpecies && (
        <ul className="display-elements">
          {speciesNames.length > 0 ? (
            speciesNames.map((name, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/species/${name}`, { state: { speciesName: name } }) // Navigate to species details page
                }
                style={{ cursor: 'pointer' }}
              >
                {name}
              </li>
            ))
          ) : (
            <p>No species available</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default FilmDetails; // Export the component for use in other parts of the app
