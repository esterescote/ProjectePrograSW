import React, { useContext } from 'react';
import { FavoritesContext } from '../FavoritesContext';

function Favorites() {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  return (
    <div>
      <h2>FAVORITES</h2>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((item) => (
            <li key={item.url}>
              <h3>{item.title || item.name}</h3>
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
    </div>
  );
}

export default Favorites;
