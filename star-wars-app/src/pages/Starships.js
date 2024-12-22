import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom'; // Afegir el hook useNavigate

function Starships() {
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate(); // Instanciar el hook de navegaicó

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

  // Funció per mostrar els detalls de la nau
  const showDetails = (starship) => {
    navigate(`/starships/${starship.name}`, { state: { starship } });
  };

  return (
    <div>
      <h2>STARSHIPS</h2>
      {loading ? (<p>Loading starships...</p>) : (
        <ul className="display-elements">
          {starships.map((starship) => (
            <li key={starship.url}>
              <h3>{starship.name}</h3>
              <p>Model: {starship.model}</p>
              <p>Manufacturer: {starship.manufacturer}</p>
              <p>Cost: {starship.cost_in_credits} credits</p>
              <button
                onClick={() => showDetails(starship)} // Navegar als detalls
                style={{
                  backgroundColor: 'gray',
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
                onClick={() => toggleFavorite(starship)}
                style={{
                  backgroundColor: favorites.some((fav) => fav.url === starship.url) ? 'red' : 'gray',
                  color: 'white',
                  padding: '10px',
                  margin: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {favorites.some((fav) => fav.url === starship.url) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Starships;
