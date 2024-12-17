import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';  // Si estàs utilitzant aquest context
import { useNavigate } from 'react-router-dom';


const TMDB_API_KEY = '4d3cb710ab798774158802e72c50dfa2'; // Substitueix per la teva clau d'API

function Films() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        // Obtenir les pel·lícules de SWAPI
        const swapiResponse = await fetch('https://swapi.py4e.com/api/films/');
        const swapiData = await swapiResponse.json();

        // Afegir informació de TMDB a cada pel·lícula
        const tmdbPromises = swapiData.results.map(async (film) => {
          const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
              film.title
            )}`
          );
          const tmdbData = await tmdbResponse.json();

          const tmdbMovie =
            tmdbData.results && tmdbData.results.length > 0
              ? tmdbData.results[0]
              : null;

          return {
            ...film,
            poster: tmdbMovie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
              : null,
          };
        });

        const filmsWithImages = await Promise.all(tmdbPromises);
        setFilms(filmsWithImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching films:', error);
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const handleShowDetails = (film) => {
    navigate(`/films/${film.episode_id}`, { state: { film } });
  };

  return (
    <div>
      <h2>FILMS</h2>
      {loading ? (
        <p>Loading films...</p>
      ) : (
        <ul>
          {films.map((film) => (
            <li key={film.url} style={{ marginBottom: '20px' }}>
              <h3>{film.title}</h3>
              {film.poster && (
                <img
                  src={film.poster}
                  alt={film.title}
                  style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
                />
              )}
              <p>Episode: {film.episode_id}</p>
              <p>Director: {film.director}</p>
              <button
                onClick={() => handleShowDetails(film)}
                
              >
                Show Details
              </button>
              <button
                onClick={() => toggleFavorite(film)}
                style={{
                  backgroundColor: favorites.some((fav) => fav.url === film.url)
                    ? 'red'
                    : 'gray',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {favorites.some((fav) => fav.url === film.url)
                  ? 'Remove from Favorites'
                  : 'Add to Favorites'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Films;
