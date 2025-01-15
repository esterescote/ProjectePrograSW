import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API key for The Movie Database (TMDB)
const TMDB_API_KEY = '4d3cb710ab798774158802e72c50dfa2'; // Replace with your own API key

// Mapping of Star Wars movie titles to their TMDB movie IDs
const starWarsMovieIds = {
  "A New Hope": 11,
  "The Empire Strikes Back": 1891,
  "Return of the Jedi": 1892,
  "The Phantom Menace": 1893,
  "Attack of the Clones": 1894,
  "Revenge of the Sith": 1895,
  "The Force Awakens": 140607,
};

/**
 * Home component:
 * This component is responsible for fetching and displaying Star Wars films. It uses the SWAPI 
 * to retrieve film data and enriches it with additional details (e.g., posters, ratings) from 
 * The Movie Database (TMDB). The component also displays the films in two lists: one ordered 
 * by release date and the other by rating.
 * 
 * Related Components:
 * - This component is related to the "Film Details" page that shows detailed information about 
 *   each film when selected.
 * 
 * Component Structure:
 * - `useState` is used to manage the state of the films data (`films`) and loading status (`loading`).
 * - `useEffect` is used to fetch film data from SWAPI and TMDB when the component is mounted.
 * - `handleShowDetails` navigates to the details page of a selected film.
 */
function Home() {
  // State to store the list of films
  const [films, setFilms] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // Hook for navigation
  const navigate = useNavigate();

  /**
   * useEffect to fetch films:
   * This hook fetches film data from SWAPI and enriches it with additional details (posters, 
   * ratings) from TMDB. It runs once when the component is mounted.
   */
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        // Fetch the list of films from SWAPI
        const swapiResponse = await fetch('https://swapi.py4e.com/api/films/');
        const swapiData = await swapiResponse.json();

        // Map through the films and fetch additional data from TMDB
        const tmdbPromises = swapiData.results.map(async (film) => {
          const tmdbMovieId = starWarsMovieIds[film.title];
          if (!tmdbMovieId) return { ...film }; // If no TMDB ID, return the film as is

          // Fetch the movie details from TMDB using the film's TMDB ID
          const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${TMDB_API_KEY}`
          );
          const tmdbData = await tmdbResponse.json();

          return {
            ...film,
            poster: tmdbData?.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
              : null, // Add poster if available
            rating: tmdbData?.vote_average || 0,  // Add rating (default to 0 if not available)
          };
        });

        // Wait for all TMDB data to be fetched
        const filmsWithImages = await Promise.all(tmdbPromises);

        // Sort films by their release date
        filmsWithImages.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

        // Update state with the fetched films data
        setFilms(filmsWithImages);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching films:', error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchFilms();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  /**
   * handleShowDetails function:
   * This function is called when a user clicks on a film. It navigates to the details page 
   * for that specific film and passes the film data through React Router's state.
   * 
   * @param {Object} film - The selected film object.
   */
  const handleShowDetails = (film) => {
    navigate(`/films/${film.title}`, { state: { film } });
  };

  return (
    <div className="home-container">
      <h2 className='titol-h2'>Welcome to the Star Wars Universe!</h2>
      <p className='titol-p' style={{ fontSize: '25px', }}>
        Here you will find all the information you need about the Star Wars universe, 
        including the films, the characters, the planets, the starships, and the species! 
        Explore the rich history of the galaxy far, far away, dive into each film's details, 
        learn about iconic characters, and discover the diverse worlds and vehicles that make up this epic saga.
      </p>
      <p className='titol-p' style={{ fontSize: '40px', }}>
        Whether you're a long-time fan or new to the Star Wars universe, there's something here for everyone!
      </p>

      {/* List of films ordered by release date */}
      <div className="films-list">
        <h2 className='titol-h2'>All Star Wars Films:</h2>
        <div className="films-container">
          {films.length > 0 ? (
            films
              .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))  // Sort films by release date
              .map((film) => (
                <div key={film.episode_id} className="film-card" onClick={() => handleShowDetails(film)}>
                  <h3>{film.title}</h3>
                  <img
                    src={film.poster}
                    alt={film.title}
                    style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                  />
                  <p>Episode: {film.episode_id}</p>
                  <p>Director: {film.director}</p>
                  <p>Release Date: {film.release_date}</p>
                </div>
              ))
          ) : (
            <p>Loading films...</p> // Display loading message if films are still being fetched
          )}
        </div>
      </div>

      {/* List of Top 5 films ordered by rating */}
      <div className="top-films-list">
        <h2>Top 5 Star Wars Films (Ordered by Rating):</h2>
        <div className="films-container">
          {films.length > 0 ? (
            films
              .sort((a, b) => b.rating - a.rating)  // Sort films by rating in descending order
              .slice(0, 5)  // Get only the top 5 films
              .map((film) => (
                <div key={film.episode_id} className="film-card" onClick={() => handleShowDetails(film)}>
                  <h3>{film.title}</h3>
                  <img
                    src={film.poster}
                    alt={film.title}
                    style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                  />
                  <p>Rating: <h2>{film.rating}</h2></p>
                </div>
              ))
          ) : (
            <p>Loading films...</p> // Display loading message if films are still being fetched
          )}
        </div>
      </div>

    </div>
  );
}

export default Home;
