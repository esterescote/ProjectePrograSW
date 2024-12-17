import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';  // Si estàs utilitzant aquest context
import { useNavigate } from 'react-router-dom';

const TMDB_API_KEY = '4d3cb710ab798774158802e72c50dfa2'; // Substitueix per la teva clau d'API

// Mapeja els títols de les pel·lícules de Star Wars amb els seus IDs a TMDB
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

        // Afegir informació de TMDB a cada pel·lícula utilitzant l'ID
        const tmdbPromises = swapiData.results.map(async (film) => {
          const tmdbMovieId = starWarsMovieIds[film.title];  // Obtenir l'ID de TMDB per cada pel·lícula

          if (!tmdbMovieId) return { ...film }; // Si no trobem l'ID, retornem la pel·lícula original sense TMDB

          const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${TMDB_API_KEY}`
          );
          const tmdbData = await tmdbResponse.json();

          return {
            ...film,
            poster: tmdbData?.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
              : null,
            rating: tmdbData?.vote_average || 0,  // Afegir la valoració de TMDB
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
        <ul className="display-elements">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Films;
