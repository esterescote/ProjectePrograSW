import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';  // Si estàs utilitzant aquest context
import { useLocation, useNavigate } from 'react-router-dom';

function CharacterDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const character = location.state?.character;

  const [filmTitles, setFilmTitles] = useState([]);

  useEffect(() => {
    const fetchFilmTitles = async () => {
      if (character && character.films.length > 0) {
        const titles = await Promise.all(
          character.films.map((filmUrl) =>
            fetch(filmUrl)
              .then((response) => response.json())
              .then((data) => data.title)
          )
        );
        setFilmTitles(titles);
      }
    };

    fetchFilmTitles();
  }, [character]);

  if (!character) {
    return <p>No character details available.</p>;
  }

  return (
    <div>
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
      <h2>{character.name}</h2>
      {character.image && (
        <img
          src={character.image}
          alt={character.name}
          style={{ width: '200px', height: 'auto', marginBottom: '20px' }}
        />
      )}
      <p>Height: {character.height} cm</p>
      <p>Mass: {character.mass} kg</p>
      <p>Hair color: {character.hair_color}</p>
      <p>Skin color: {character.skin_color}</p>
      <p>Eye color: {character.eye_color}</p>
      <p>Birth year: {character.birth_year}</p>
      <p>Gender: {character.gender}</p>
      <p>Homeworld: {character.homeworld}</p>
      <p>Species: {character.species}</p>
      <p>Films:</p>
      <ul>
        {filmTitles.length > 0 ? (
          filmTitles.map((title, index) => <li key={index}>{title}</li>)
        ) : (
          <p>No films available</p>
        )}
      </ul>
    </div>
  );
}

export default CharacterDetails;
