import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

function Films() 
{
  const [films, setFilms] = useState([]);  // Estat per emmagatzemar la llista de pel·lícules
  const [expandedFilm, setExpandedFilm] = useState(null); // Estat per controlar el personatge expandit
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // useEffect per carregar les pel·lícules automàticament quan es renderitza el component
  useEffect(() => {
    fetch('https://swapi.dev/api/films/')
      .then((response) => response.json())
      .then((data) => setFilms(data.results))
      .catch((error) => console.error('Error fetching films:', error));
  }, []);
 // Funció per alternar la visibilitat de les dades del personatge
 const toggleExpand = (filmName) => {
  if (expandedFilm === filmName) {
    setExpandedFilm(null); // Si ja està expandit, el tanquem
  } else {
    setExpandedFilm(filmName); // Si no està expandit, l'obrim
  }
};
  return (
    <div>
      <h2>FILMS</h2>
      {films.length > 0 ? (
        <ul>
          {
            films.map((film) => (
              <li key={film.url}>
                <h3>{film.title}</h3>
                <p>Episode: {film.episode_id}</p>
                <p>Director: {film.director}</p>
                <p>Producer: {film.producer}</p>
                <p>Release Date: {film.release_date}</p>
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
      ) : (
        <p>Loading films...</p>
      )}
    </div>
  );
}

export default Films;