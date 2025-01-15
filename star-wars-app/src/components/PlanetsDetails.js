import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

function PlanetsDetails() {
  const { name } = useParams(); // Obtenim el nom del planeta des de la URL
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Afegim estats per controlar les seccions desplegables
  const [showResidents, setShowResidents] = useState(false);
  const [showFilms, setShowFilms] = useState(false);

  useEffect(() => {
    const fetchPlanetDetails = async () => {
      try {
        let nextUrl = 'https://swapi.py4e.com/api/planets/';
        let foundPlanet = null;

        // Iterar per les pàgines fins que trobem el planeta
        while (nextUrl && !foundPlanet) {
          const response = await fetch(nextUrl);
          const data = await response.json();
          foundPlanet = data.results.find(
            (planet) => planet.name.toLowerCase() === name.toLowerCase() // Usar el 'name' obtingut de la URL
          );
          nextUrl = data.next; // Obtenir la següent pàgina si existeix
        }

        if (foundPlanet) {
          // Carregar residents i films
          const residents = await Promise.all(
            foundPlanet.residents.map((url) =>
              fetch(url).then((res) => res.json())
            )
          );
          const films = await Promise.all(
            foundPlanet.films.map((url) =>
              fetch(url).then((res) => res.json())
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
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchPlanetDetails();
    }
  }, [name]); // Recarregar quan el 'name' canviï

  if (loading) {
    return <p>Loading planet details...</p>;
  }

  if (!planet) {
    return <p>Planet not found</p>;
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
          backgroundColor: favorites.some((fav) => fav.url === planet.url)
            ? 'red'
            : 'gray',
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
      <p className='breu'><strong>Diameter: </strong>{planet.diameter}</p>
      <p className='breu'><strong>Rotation period: </strong>{planet.rotation_period}</p>
      <p className='breu'><strong>Orbital period: </strong>{planet.orbital_period}</p>
      <p className='breu'><strong>Gravity: </strong>{planet.gravity}</p>
      <p className='breu'><strong>Population: </strong>{planet.population}</p>
      <p className='breu'><strong>Climate: </strong>{planet.climate}</p>
      <p className='breu'><strong>Terrain: </strong>{planet.terrain}</p>
      <p className='breu'><strong>Surface water: </strong>{planet.surface_water}</p>

      {/* Residents */}
      <h3 className='desplegables' onClick={() => setShowResidents(!showResidents)}>
        Residents
      </h3>
      {showResidents && (
        <ul className={`display-elements ${showResidents ? 'show' : ''}`}>
          {planet.residents.length > 0 ? (
            planet.residents.map((resident, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/characters/${resident.name}`, {
                    state: { characterName: resident.name },
                  })
                }
                style={{
                  cursor: 'pointer',
                }}
              >
                {resident.name}
              </li>
            ))
          ) : (
            <p className='breu'>No residents available</p>
          )}
        </ul>
      )}

      {/* Films */}
      <h3 className='desplegables' onClick={() => setShowFilms(!showFilms)}>
        Films
      </h3>
      {showFilms && (
        <ul className={`display-elements ${showFilms ? 'show' : ''}`}>
          {planet.films.length > 0 ? (
            planet.films.map((film, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/films/${film.title}`, {
                    state: { film },
                  })
                }
                style={{
                  cursor: 'pointer',
                }}
              >
                {film.title}
              </li>
            ))
          ) : (
            <p className='breu'>No films available</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default PlanetsDetails;
