import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

function Planets() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  // Funció per carregar tots els planetes
  const fetchAllPlanets = async () => {
    let allPlanets = [];
    let nextPageUrl = 'https://swapi.py4e.com/api/planets/'; // URL inicial per carregar planetes

    try {
      setLoading(true);
      while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        allPlanets = [...allPlanets, ...data.results];
        nextPageUrl = data.next;
      }

      // Processar els planetes i obtenir residents i films
      const fetchResidentsPromises = allPlanets.map((planet) => {
        const residentsPromises = planet.residents.map((url) =>
          fetch(url).then((response) => response.json())
        );

        return Promise.all(residentsPromises).then((residents) => {
          return { ...planet, residents: residents.map((resident) => resident.name) };
        });
      });

      const planetsWithResidents = await Promise.all(fetchResidentsPromises);

      const fetchFilmsPromises = planetsWithResidents.map((planet) => {
        const filmsPromises = planet.films.map((url) =>
          fetch(url).then((response) => response.json())
        );
        return Promise.all(filmsPromises).then((films) => {
          return { ...planet, films: films.map((film) => film.title) };
        });
      });

      const finalPlanets = await Promise.all(fetchFilmsPromises);
      setPlanets(finalPlanets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching planets:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPlanets(); // Carregar planetes en muntatge
  }, []);

  // Funció per mostrar els detalls del planeta
  const showDetails = (planet) => 
  {
    navigate(`/planets/${planet.name}`, { state: { planetName: planet.name } })
  };

  return (
    <div>
      <h2>PLANETS</h2>
      {loading ? (
        <p>Loading planets...</p>
      ) : (
        <ul className="display-elements">
          {planets.map((planet) => (
            <li key={planet.url}>
              <h3>{planet.name}</h3>

              {/* Mostrar dos detalls per planeta */}
              <p><strong>Climate:</strong> {planet.climate}</p>
              <p><strong>Terrain:</strong> {planet.terrain}</p>

              <button
                onClick={() => showDetails(planet)}
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
                {favorites.some((fav) => fav.url === planet.url) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Planets;
