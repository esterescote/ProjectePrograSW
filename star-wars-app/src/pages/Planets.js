import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';


function Planets() 
{
  const [planets, setPlanets] = useState([]);  // Estat per emmagatzemar la llista
  const [loading, setLoading] = useState(true); // Estat de càrrega
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // useEffect per carregar automàticament quan es renderitza el component
  useEffect(() => 
  {
    fetch('https://swapi.dev/api/planets/')    // Fetch a l'API
      .then((response) => response.json())  // Convertir la resposta a JSON
      .then((data) => 
      {
        // Per cada planeta, buscar la informació dels residents
        const fetchResidentsPromises = data.results.map((planet) => 
        {
          const residentsPromises = planet.residents.map((url) =>
          fetch(url).then((response) => response.json()));

          // Esperem a que totes les crides als residents d'un planeta es compleixin
          return Promise.all(residentsPromises).then((residents) => 
          {
            // Afegir els residents al planeta
            return { ...planet, residents: residents.map((resident) => resident.name) };
          });
        });;
        // Quan tots els residents s'han carregat, guardem els planetes actualitzats
        Promise.all(fetchResidentsPromises)
          .then((updatedPlanets) => 
          {
            // Per cada planeta, carregar també els noms dels films
            const fetchFilmsPromises = updatedPlanets.map((planet) => 
            {
              const filmsPromises = planet.films.map((url) => fetch(url).then((response) => response.json()));
              // Esperem a que totes les crides als films es compleixin
              return Promise.all(filmsPromises).then((films) => 
              {
                // Afegir els noms dels films al planeta
                return { ...planet, films: films.map((film) => film.title) };
              });
            });

            // Quan tots els films han estat carregats, actualitzar l'estat amb els planetes i films
            Promise.all(fetchFilmsPromises)
              .then((finalPlanets) => 
              {
                setPlanets(finalPlanets); // Actualitzar l'estat amb els planetes i els films
                setLoading(false); // Acabar la càrrega
              })
              .catch((error) => 
              {
                console.error('Error fetching films:', error);
                setLoading(false); // Acabar la càrrega en cas d'error
              });
          })
          .catch((error) => 
          {
            console.error('Error fetching residents:', error);
            setLoading(false); // Acabar la càrrega en cas d'error
          });
    })
    .catch((error) => 
    {
      console.error('Error fetching Planets:', error);
      setLoading(false); // Acabar la càrrega en cas d'error
    });
  }, []); // L'array buit fa que només es faci la crida un cop quan el component es renderitza
      

  return (
    <div>
      <h2>PLANETS</h2>
      {loading ? (
          <p>Loading planets...</p> 
        ) : (
          <ul>
            {planets.map((planet) => (
              <li key={planet.url}>
                <h3>{planet.name}</h3>
                <p>Diameter: {planet.diameter}</p>
                <p>Rotation period: {planet.rotation_period}</p>
                <p>Orbital period: {planet.orbital_period}</p>
                <p>Gravity: {planet.gravity}</p>
                <p>Population: {planet.population}</p>
                <p>Climate: {planet.climate}</p>
                <p>Terrain: {planet.terrain}</p>
                <p>Surface water: {planet.surface_water}</p>
                <p>Residents:</p>
                  <ul>
                    {
                      planet.residents.length > 0 ? (
                        planet.residents.map((residentName, index) => (
                          <li key={index}>{residentName}</li>
                        ))
                      ) : (<p>No residents available</p>)
                    }
                  </ul>
                <p>Films:</p>
                  <ul>
                    {
                      planet.films.length > 0 ? (
                        planet.films.map((filmTitle, index) => (<li key={index}>{filmTitle}</li>))
                      ) : (<p>No films available</p>)
                    }
                  </ul>
                  <button
                onClick={() => toggleFavorite(planet)}
                style={{
                  backgroundColor: favorites.some((fav) => fav.url === planet.url)
                    ? 'red'
                    : 'gray',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {favorites.some((fav) => fav.url === planet.url)
                  ? 'Remove from Favorites'
                  : 'Add to Favorites'}
              </button>
              </li>))
            }
          </ul>
      )}
    </div>
  );
}

export default Planets;