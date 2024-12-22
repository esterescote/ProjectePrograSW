import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

function Favorites() {
  const { favorites, toggleFavorite, clearFavorites } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleNavigate = (item) => {
    if (item.title) {
      navigate(`/films/${item.id}`, { state: { film: item } });
    } else if (item.name && item.population) {
      navigate(`/planets/${item.name}`, { state: { planetName: item.name } });
    } else if (item.name && item.designation) {
      navigate(`/species/${item.name}`, { state: { selectedSpecie: item } });
    } else if (item.name && item.model) {
      navigate(`/starships/${item.name}`, { state: { starship: item } });
    } else if (item.name) {
      navigate(`/characters/${item.name}`, { state: { characterName: item.name } });
    } else {
      console.error('Unknown item type:', item);
    }
  };

  return (
    <div>
      <h2>FAVORITES</h2>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((item) => (
            <li key={item.url}>
              <h3
                onClick={() => handleNavigate(item)} // Redirigeix a la ruta de detalls
                style={{ cursor: 'pointer' }}
              >
                {item.title || item.name}
              </h3>
              <button
                onClick={() => toggleFavorite(item)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorites added yet!</p>
      )}

      {favorites.length > 0 && (
        <button
          onClick={clearFavorites}
          style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Clear All Favorites
        </button>
      )}
    </div>
  );
}

export default Favorites;
