// Main task: The `Films` component fetches a list of Star Wars films from SWAPI, enhances the data 
// with posters and ratings from TMDB, and displays them. Users can view details or mark films as favorites.
// Structure: 
// - Data fetching and state management with React hooks (useState, useEffect).
// - Favorites management using a context (FavoritesContext).
// - Navigation to details page using `useNavigate` from `react-router-dom`.

import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext'; // Context to manage favorite films
import { useNavigate } from 'react-router-dom'; // Hook for navigation

const TMDB_API_KEY = '4d3cb710ab798774158802e72c50dfa2'; // API key for TMDB

// Maps Star Wars movie titles to their corresponding IDs in TMDB
const starWarsMovieIds = {
  "A New Hope": 11,
  "The Empire Strikes Back": 1891,
  "Return of the Jedi": 1892,
  "The Phantom Menace": 1893,
  "Attack of the Clones": 1894,
  "Revenge of the Sith": 1895,
  "The Force Awakens": 140607,
};

function Films() {
  const [films, setFilms] = useState([]); // Holds the list of films with additional data
  const [loading, setLoading] = useState(true); // Indicates whether data is being loaded
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Access favorites and toggle functionality
  const navigate = useNavigate(); // Hook to navigate between pages

  // Effect to fetch films when the component mounts
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        // Fetches films from SWAPI (Star Wars API)
        const swapiResponse = await fetch('https://swapi.py4e.com/api/films/');
        const swapiData = await swapiResponse.json();

        // Adds additional details (e.g., poster, rating) from TMDB
        const tmdbPromises = swapiData.results.map(async (film) => {
          const tmdbMovieId = starWarsMovieIds[film.title]; // Get TMDB ID for the film

          if (!tmdbMovieId) return { ...film }; // If no TMDB ID, return the film as is

          // Fetch data from TMDB for the corresponding movie
          const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${TMDB_API_KEY}`
          );
          const tmdbData = await tmdbResponse.json();

          return {
            ...film,
            poster: tmdbData?.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` // Adds poster image
              : null,
            rating: tmdbData?.vote_average || 0, // Adds rating from TMDB
          };
        });

        const filmsWithImages = await Promise.all(tmdbPromises); // Waits for all promises to resolve
        setFilms(filmsWithImages); // Updates the films state
        setLoading(false); // Stops the loading indicator
      } catch (error) {
        console.error('Error fetching films:', error); // Logs any errors
        setLoading(false);
      }
    };

    fetchFilms(); // Fetches films when the component mounts
  }, []);

  // Navigate to film details page
  const handleShowDetails = (film) => {
    navigate(`/films/${film.title}`, { state: { film } });
  };

  return (
    <div>
      <h2>FILMS</h2>
      {loading ? (
        <p>Loading films...</p> // Displays a loading message
      ) : (
        <ul className="display-elements">
          {/* Maps over the films array to display each film */}
          {films.map((film) => (
            <li key={film.url} style={{ marginBottom: '20px' }}>
              <h3>{film.title}</h3>
              {film.poster && (
                <img
                  src={film.poster} // Displays the film's poster
                  alt={film.title}
                  style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                />
              )}
              <p><strong>Episode:</strong> {film.episode_id}</p>
              <p><strong>Director:</strong> {film.director}</p>
              <div>
                {/* Button to show film details */}
                <button
                  onClick={() => handleShowDetails(film)}
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
                {/* Button to toggle favorites */}
                <button
                  onClick={() => toggleFavorite(film)}
                  style={{
                    backgroundColor: favorites.some((fav) => fav.url === film.url)
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
                  {favorites.some((fav) => fav.url === film.url)
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Films;
