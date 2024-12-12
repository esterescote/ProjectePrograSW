import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useLocation } from 'react-router-dom';

function Starships() 
{
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const location = useLocation();
  const selectedStarship = location.state?.selectedStarship || null;

  // useEffect per carregar automàticament quan es renderitza el component
  useEffect(() => 
  {
    fetch('https://swapi.dev/api/starships/')  // Fetch a l'API per obtenir la llista de naus
      .then((response) => response.json())  // Convertir la resposta a JSON
      .then((data) => 
      {
        setStarships(data.results);  // Guardar la llista de naus a l'estat
        setLoading(false); // Finalitzar la càrrega
      })
      .catch((error) => 
      {
        console.error('Error fetching Starships:', error);
        setLoading(false); // Finalitzar la càrrega en cas d'error
      });
  }, []);

  return (
    <div>
      <h2>STARSHIPS</h2>
      {loading ? (<p>Loading starships...</p>) : (
        <ul>
          {
            starships.map((starship) => 
            (
              <li key={starship.url}>
                <h3>{starship.name}</h3>
                <p>Model: {starship.model}</p>
                <p>Manufacturer: {starship.manufacturer}</p>
                <p>Cost: {starship.cost_in_credits} credits</p>
                <p>Length: {starship.length} meters</p>
                <p>Max speed: {starship.max_atmosphering_speed} km/h</p>
                <p>Crew: {starship.crew}</p>
                <p>Passengers: {starship.passengers}</p>
                <p>Cargo capacity: {starship.cargo_capacity} kg</p>
                <p>Consumables: {starship.consumables}</p>
                <p>Starship class: {starship.starship_class}</p>
                <button
                onClick={() => toggleFavorite(starship)}
                style={{
                  backgroundColor: favorites.some((fav) => fav.url === starship.url)
                    ? 'red'
                    : 'gray',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {favorites.some((fav) => fav.url === starship.url)
                  ? 'Remove from Favorites'
                  : 'Add to Favorites'}
              </button>
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default Starships;
