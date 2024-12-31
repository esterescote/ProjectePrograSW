import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

function StarshipsDetails() {
  const { name } = useParams(); // Obtenir el nom de la nau des de la URL
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const [starship, setStarship] = useState(null); // Per emmagatzemar les dades de la nau
  const [pilots, setPilots] = useState([]); // Per desar els objectes complets dels pilots
  const [films, setFilms] = useState([]); // Per desar els objectes complets de les pel·lícules

  // Comprovar si la nau està en favorites
  const isFavorite = favorites.some((fav) => fav.url === starship?.url);

  useEffect(() => {
    const fetchStarshipDetails = async () => {
      try {
        const response = await fetch(`https://swapi.py4e.com/api/starships/?search=${name}`);
        const data = await response.json();
        const starshipData = data.results[0]; // Assumim que el resultat és únic

        setStarship(starshipData);

        if (starshipData) {
          // Carregar pilots
          if (starshipData.pilots && starshipData.pilots.length > 0) {
            const pilotData = await Promise.all(
              starshipData.pilots.map((pilotUrl) =>
                fetch(pilotUrl).then((response) => response.json())
              )
            );
            setPilots(pilotData); // Guardar objectes complets dels pilots
          }

          // Carregar pel·lícules
          if (starshipData.films && starshipData.films.length > 0) {
            const filmData = await Promise.all(
              starshipData.films.map((filmUrl) =>
                fetch(filmUrl).then((response) => response.json())
              )
            );
            setFilms(filmData); // Guardar objectes complets de les pel·lícules
          }
        }
      } catch (error) {
        console.error('Error fetching starship details:', error);
      }
    };

    fetchStarshipDetails();
  }, [name]);

  if (!starship) {
    return <p>Loading starship details...</p>;
  }

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
      
      {/* Botó de favorites */}
      <button
        onClick={() => toggleFavorite(starship)}
        style={{
          padding: '10px',
          backgroundColor: isFavorite ? 'red' : 'gray',
          color: 'white',
          marginLeft: '10px',
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
        {pilots.length > 0 ? (
          pilots.map((pilot, index) => (
            <li
              key={index}
              onClick={() =>
                navigate(`/characters/${pilot.name}`, {
                  state: { character: pilot },
                })
              }
              style={{
                cursor: 'pointer'
              }}
            >
              {pilot.name}
            </li>
          ))
        ) : (
          <p>No pilots available</p>
        )}
      </ul>

      {/* Mostrar les pel·lícules */}
      <h3>Appears in the following films:</h3>
      <ul>
        {films.length > 0 ? (
          films.map((film, index) => (
            <li
              key={index}
              onClick={() =>
                navigate(`/films/${film.title}`, {
                  state: { film },
                })
              }
              style={{
                cursor: 'pointer'
              }}
            >
              {film.title}
            </li>
          ))
        ) : (
          <p>No films available</p>
        )}
      </ul>
    </div>
  );
}

export default StarshipsDetails;
