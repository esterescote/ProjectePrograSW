import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

function PlanetsDetails() 
{
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const planetName = location.state?.planetName;
  const [planet, setPlanet] = useState(null);

  useEffect(() => {
    const fetchPlanetDetails = async () => {
      try {
        const response = await fetch('https://swapi.py4e.com/api/planets/');
        const data = await response.json();
        const foundPlanet = data.results.find(
          (planet) => planet.name.toLowerCase() === planetName.toLowerCase()
        );

        if (foundPlanet) {
          const residents = await Promise.all(
            foundPlanet.residents.map((url) =>
              fetch(url).then((res) => res.json()).then((data) => data.name)
            )
          );
          const films = await Promise.all(
            foundPlanet.films.map((url) =>
              fetch(url).then((res) => res.json()).then((data) => data.title)
            )
          );

          setPlanet({
            ...foundPlanet,
            residents,
            films,
          });
        }
      } catch (error) {
        console.error('Error fetching planet details:', error);
      }
    };

    if (planetName) {
      fetchPlanetDetails();
    }
  }, [planetName]);

  if (!planet) {
    return <p>Loading planet details...</p>;
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
        onClick={() => toggleFavorite(planet)}
        style={{
          backgroundColor: favorites.some((fav) => fav.url === planet.url) ? 'red' : 'gray',
          color: 'white',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {favorites.some((fav) => fav.url === planet.url)
          ? 'Remove from Favorites'
          : 'Add to Favorites'}
      </button>

      <h2>{planet.name}</h2>
      <p>Diameter: {planet.diameter}</p>
      <p>Rotation period: {planet.rotation_period}</p>
      <p>Orbital period: {planet.orbital_period}</p>
      <p>Gravity: {planet.gravity}</p>
      <p>Population: {planet.population}</p>
      <p>Climate: {planet.climate}</p>
      <p>Terrain: {planet.terrain}</p>
      <p>Surface water: {planet.surface_water}</p>

      <h3>Residents:</h3>
      <ul>
        {planet.residents.length > 0 ? (
          planet.residents.map((resident, index) => <li key={index}>{resident}</li>)
        ) : (
          <p>No residents available</p>
        )}
      </ul>

      <h3>Films:</h3>
      <ul>
        {planet.films.length > 0 ? (
          planet.films.map((film, index) => <li key={index}>{film}</li>)
        ) : (
          <p>No films available</p>
        )}
      </ul>
    </div>
  );
}

export default PlanetsDetails;
