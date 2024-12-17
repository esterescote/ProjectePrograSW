import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useLocation } from 'react-router-dom';

function Planets() {
  const [planets, setPlanets] = useState([]);  // Estat per emmagatzemar la llista
  const [loading, setLoading] = useState(true); // Estat de càrrega
  const [expandedPlanets, setExpandedPlanets] = useState(null); // Estat per controlar el planeta expandit
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const location = useLocation();
  const selectedPlanet = location.state?.selectedPlanet || null;

  // Funció per carregar totes les pàgines
  const fetchAllPlanets = async () => {
    let allPlanets = [];
    let nextPageUrl = 'https://swapi.py4e.com/api/planets/'; // Primer URL de la pàgina

    try {
      setLoading(true);
      while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();

        // Afegir els planetes actuals a la llista
        allPlanets = [...allPlanets, ...data.results];

        // Obtenir la URL de la següent pàgina
        nextPageUrl = data.next;
      }

      // Processar els planetes després de carregar tots
      const fetchResidentsPromises = allPlanets.map((planet) => {
        const residentsPromises = planet.residents.map((url) =>
          fetch(url).then((response) => response.json())
        );

        // Esperem que totes les crides als residents es compleixin
        return Promise.all(residentsPromises).then((residents) => {
          // Afegir els residents al planeta
          return { ...planet, residents: residents.map((resident) => resident.name) };
        });
      });

      // Esperar que tots els planetes tinguin els seus residents
      const planetsWithResidents = await Promise.all(fetchResidentsPromises);

      // Processar els films dels planetes
      const fetchFilmsPromises = planetsWithResidents.map((planet) => {
        const filmsPromises = planet.films.map((url) =>
          fetch(url).then((response) => response.json())
        );
        return Promise.all(filmsPromises).then((films) => {
          return { ...planet, films: films.map((film) => film.title) };
        });
      });

      // Esperar que tots els planetes tinguin els seus films
      const finalPlanets = await Promise.all(fetchFilmsPromises);

      // Actualitzar l'estat amb els planetes finals
      setPlanets(finalPlanets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching planets:', error);
      setLoading(false); // Finalitzar la càrrega en cas d'error
    }
  };

  useEffect(() => {
    fetchAllPlanets(); // Carregar els planetes quan es renderitza el component
  }, []);

  // Funció per alternar la visibilitat de les dades del planeta
  const toggleExpand = (planetName) => {
    if (expandedPlanets === planetName) {
      setExpandedPlanets(null); // Si ja està expandit, el tanquem
    } else {
      setExpandedPlanets(planetName); // Si no està expandit, l'obrim
    }
  };

  return (
    <div>
      <h2>PLANETS</h2>
      {loading ? (
        <p>Loading planets...</p>
      ) : (
        <ul className='display-elements'>
          {planets.map((planet) => (
            <li key={planet.url}>
              <h3 onClick={() => toggleExpand(planet.name)} style={{ cursor: 'pointer' }}>
                {planet.name}
              </h3>
              {expandedPlanets === planet.name && (
                <div>
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
                    {planet.residents.length > 0 ? (
                      planet.residents.map((residentName, index) => <li key={index}>{residentName}</li>)
                    ) : (
                      <p>No residents available</p>
                    )}
                  </ul>
                  <p>Films:</p>
                  <ul>
                    {planet.films.length > 0 ? (
                      planet.films.map((filmTitle, index) => <li key={index}>{filmTitle}</li>)
                    ) : (
                      <p>No films available</p>
                    )}
                  </ul>
                </div>
              )}
              <button
                onClick={() => toggleFavorite(planet)}
                style={{
                  backgroundColor: favorites.some((fav) => fav.url === planet.url) ? 'red' : 'gray',
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Planets;
