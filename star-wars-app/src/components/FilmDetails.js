import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';  // Si estàs utilitzant aquest context
import { useLocation, useNavigate } from 'react-router-dom';

function FilmDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const film = location.state?.film; // Asegura't que film està disponible

  const [characterNames, setCharacterNames] = useState([]);  // Per desar els noms dels personatges

  useEffect(() => {
    const fetchCharacterNames = async () => {
      if (film && film.characters && film.characters.length > 0) {
        const names = await Promise.all(
          film.characters.map((characterUrl) =>
            fetch(characterUrl)
              .then((response) => response.json())
              .then((data) => data.name)
          )
        );
        setCharacterNames(names);
      }
    };

    fetchCharacterNames();
  }, [film]);

  if (!film) {
    return <p>No film details available.</p>;
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: 'gray',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Back
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
      <h2>{film.title}</h2>

      {/* Mostrar el pòster de la pel·lícula */}
      {film.poster && (
        <img
          src={film.poster}
          alt={film.title}
          style={{ width: '300px', height: 'auto', marginBottom: '20px' }}
        />
      )}

      {/* Mostrar més informació de la pel·lícula */}
      <p>Episode: {film.episode_id}</p>
      <p>Director: {film.director}</p>
      <p>Producer: {film.producer}</p>
      <p>Release Date: {film.release_date}</p>
      <p>Description: {film.overview}</p>

      <h3>Characters:</h3>
      <ul>
        {characterNames.length > 0 ? (
          characterNames.map((name, index) => <li key={index}>{name}</li>)
        ) : (
          <p>No characters available</p>
        )}
      </ul>
    </div>
  );
}

export default FilmDetails;
