import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext'; // Importar el context de favorites

function StarshipsDetails() {
  const location = useLocation(); // Obtenir l'estat de la ubicació
  const navigate = useNavigate(); // Hook per navegar entre pàgines
  const starship = location.state?.starship || {}; // Obtenir la nau seleccionada des de la ubicació
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Obtenir toggleFavorite del context

  // Funció per tornar a la pàgina de Starships
  const goBack = () => {
    navigate('/starships'); // Tornar a la pàgina de Starships
  };

  // Comprovar si la nau està en favorites
  const isFavorite = favorites.some((fav) => fav.url === starship.url);

  return (
    <div>
      <h2>{starship.name}</h2>
      
      {/* Botó de tornada */}
      <button onClick={goBack} style={{ padding: '10px', backgroundColor: 'gray', color: 'white' }}>
        Back
      </button>

      {/* Botó de favoritos */}
      <button
        onClick={() => toggleFavorite(starship)} // Afegir o eliminar de favorites
        style={{
          padding: '10px',
          backgroundColor: isFavorite ? 'red' : 'gray',
          color: 'white',
          marginLeft: '10px', // Separar els botons
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>

      <div>
        <p><strong>Model:</strong> {starship.model}</p>
        <p><strong>Manufacturer:</strong> {starship.manufacturer}</p>
        <p><strong>Cost:</strong> {starship.cost_in_credits} credits</p>
        <p><strong>Length:</strong> {starship.length} meters</p>
        <p><strong>Max speed:</strong> {starship.max_atmosphering_speed} km/h</p>
        <p><strong>Crew:</strong> {starship.crew}</p>
        <p><strong>Passengers:</strong> {starship.passengers}</p>
        <p><strong>Cargo capacity:</strong> {starship.cargo_capacity} kg</p>
        <p><strong>Consumables:</strong> {starship.consumables}</p>
        <p><strong>Starship class:</strong> {starship.starship_class}</p>
      </div>
    </div>
  );
}

export default StarshipsDetails;
