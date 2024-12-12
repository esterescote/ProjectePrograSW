import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

function Favorites() 
{
  const { favorites, toggleFavorite, clearFavorites  } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleNavigate = (item) => 
  {
    // Verifiquem el tipus de l'element i redirigim a la ruta corresponent
    if (item.title) 
    {
      navigate('/films', { state: { selectedFilm: item } });
    } 
    else if (item.name && item.population)  
    {
      navigate('/planets', { state: { selectedPlanet: item } });
    } 
    else if (item.name && item.designation) 
    {
      navigate('/species', { state: { selectedSpecie: item } });
    } 
    else if (item.name && item.model) 
    {
      navigate('/starships', { state: { selectedStarship: item } });
    }
    else if (item.name) 
    {
      navigate('/characters', { state: { selectedCharacter: item } });
    } 

    else 
    {
      console.error('Unknown item type:', item); // Per identificar errors en l'element
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
                onClick={() => handleNavigate(item)} // Redirigir
                style={{ cursor: 'pointer'}}
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
