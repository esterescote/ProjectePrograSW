import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext'; // Importar el context de favorites

function StarshipsDetails() {
  const location = useLocation(); // Obtenir l'estat de la ubicació
  const navigate = useNavigate(); // Hook per navegar entre pàgines
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Obtenir toggleFavorite del context
  
  const starship = useMemo(() => location.state?.starship || {}, [location.state?.starship]); // Memoritzar el valor de starship

  const [pilotNames, setPilotNames] = useState([]);  // Per desar els noms dels pilots
  const [filmTitles, setFilmTitles] = useState([]);  // Per desar els títols de les pel·lícules

  // Comprovar si la nau està en favorites
  const isFavorite = favorites.some((fav) => fav.url === starship.url);

  // Carregar els pilots i films de la nau
  useEffect(() => {
    const fetchPilots = async () => {
      if (starship.pilots && starship.pilots.length > 0) {
        const pilots = await Promise.all(
          starship.pilots.map((pilotUrl) =>
            fetch(pilotUrl)
              .then((response) => response.json())
              .then((data) => data.name)
          )
        );
        setPilotNames(pilots);
      }
    };

    const fetchFilms = async () => {
      if (starship.films && starship.films.length > 0) {
        const films = await Promise.all(
          starship.films.map((filmUrl) =>
            fetch(filmUrl)
              .then((response) => response.json())
              .then((data) => data.title)
          )
        );
        setFilmTitles(films);
      }
    };

    fetchPilots();
    fetchFilms();
  }, [starship]);  // Afegir `starship` com a dependència

  return (
    <div>
      <h2>{starship.name}</h2>
      
      {/* Botó de tornada */}
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

      {/* Mostrar els pilots */}
      <h3>Pilots:</h3>
      <ul>
        {pilotNames.length > 0 ? (
          pilotNames.map((name, index) => <li key={index}>{name}</li>)
        ) : (
          <p>No pilots available</p>
        )}
      </ul>

      {/* Mostrar les pel·lícules */}
      <h3>Appears in the following films:</h3>
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

export default StarshipsDetails;
