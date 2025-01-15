import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

function Planets() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pàgina actual
  const itemsPerPage = 10; // Nombre d'elements per pàgina (10 planetes)
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

  // Calcular quins planetes es mostren a la pàgina actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlanets = planets.slice(startIndex, endIndex);

  // Funció per canviar de pàgina
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Generar botons de paginació
  const totalPages = Math.ceil(planets.length / itemsPerPage);
  const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Funció per mostrar els detalls del planeta
  const showDetails = (planet) => {
    navigate(`/planets/${planet.name}`, { state: { planetName: planet.name } });
  };

  return (
    <div>
      <h2>PLANETS</h2>
      {loading ? (
        <p>Loading planets...</p>
      ) : (
        <>
          <ul className="display-elements">
            {currentPlanets.map((planet) => (
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

          {/* Botons de paginació */}
          <div className="pagination">
            {paginationButtons.map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                style={{
                  margin: '5px',
                  padding: '10px',
                  backgroundColor: page === currentPage ? 'blue' : 'gray',
                  color: 'white',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Planets;
