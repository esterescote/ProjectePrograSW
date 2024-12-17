import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useLocation } from 'react-router-dom';

function Starships() {
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const location = useLocation();
  const selectedStarship = location.state?.selectedStarship || null;

  // Funció per obtenir totes les naus
  const fetchAllStarships = async () => {
    let allStarships = [];
    let nextPageUrl = 'https://swapi.py4e.com/api/starships/'; // URL de la primera pàgina de l'API

    try {
      setLoading(true);
      // Iterar sobre totes les pàgines fins que no hi hagi més dades
      while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();

        // Afegir les naus d'aquesta pàgina a la llista
        allStarships = [...allStarships, ...data.results];

        // Actualitzar la URL de la següent pàgina si n'hi ha una
        nextPageUrl = data.next;
      }

      // Quan totes les naus s'han obtingut, actualitzar l'estat
      setStarships(allStarships);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Starships:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStarships(); // Carregar totes les naus quan es renderitza el component
  }, []);

  return (
    <div>
      <h2>STARSHIPS</h2>
      {loading ? (<p>Loading starships...</p>) : (
        <ul className='display-elements'>
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
