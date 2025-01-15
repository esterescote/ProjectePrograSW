import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

function Species() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pàgina actual
  const itemsPerPage = 10; // Nombre d'elements per pàgina (10 espècies)
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  // Funció per obtenir totes les espècies
  const fetchAllSpecies = async () => {
    let allSpecies = [];
    let nextPageUrl = 'https://swapi.py4e.com/api/species/'; // URL de la primera pàgina de l'API

    try {
      setLoading(true);
      // Iterar sobre totes les pàgines fins que no hi hagi més dades
      while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();

        // Afegir informació dels planetes a cada espècie
        const fetchPlanetsPromises = data.results.map((specie) => {
          const planetsPromises = specie.homeworld
            ? [fetch(specie.homeworld).then((response) => response.json())]
            : [];  // Verifiquem si hi ha un planeta associat
          return Promise.all(planetsPromises).then((planets) => {
            return { ...specie, homeworld: planets.length > 0 ? planets[0].name : 'Unknown' };
          });
        });

        // Esperar que totes les crides als planetes es compleixin abans de continuar
        const updatedSpecies = await Promise.all(fetchPlanetsPromises);

        // Afegir les espècies d'aquesta pàgina a la llista
        allSpecies = [...allSpecies, ...updatedSpecies];

        // Actualitzar la URL de la següent pàgina si n'hi ha una
        nextPageUrl = data.next;
      }

      // Quan totes les espècies s'han obtingut, actualitzar l'estat
      setSpecies(allSpecies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Species:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSpecies(); // Carregar totes les espècies quan es renderitza el component
  }, []);

  // Calcular quines espècies es mostren a la pàgina actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpecies = species.slice(startIndex, endIndex);

  // Funció per canviar de pàgina
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Generar botons de paginació
  const totalPages = Math.ceil(species.length / itemsPerPage);
  const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Funció per mostrar els detalls de l'espècie
  const showDetails = (specie) => {
    navigate(`/species/${specie.name}`, { state: { specieName: specie.name } })
  };

  return (
    <div>
      <h2>SPECIES</h2>
      {loading ? (
        <p>Loading species...</p>
      ) : (
        <>
          <ul className="display-elements">
            {currentSpecies.map((specie) => (
              <li key={specie.url}>
                <h3>{specie.name}</h3>

                {/* Mostrar dos detalls per espècie */}
                <p className='breu'><strong>Classification:</strong> {specie.classification}</p>
                <p className='breu'><strong>Designation:</strong> {specie.designation}</p>
                <div className='button-DF'>
                  <button
                    onClick={() => showDetails(specie)}
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
                    onClick={() => toggleFavorite(specie)}
                    style={{
                      backgroundColor: favorites.some((fav) => fav.url === specie.url) ? 'red' : 'gray',
                      color: 'white',
                      padding: '10px',
                      margin: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {favorites.some((fav) => fav.url === specie.url)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'}
                  </button>
                </div>
                
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
                  backgroundColor: page === currentPage ? '#FFCC00' : 'gray',
                  color: 'white',
                  borderRadius: '5px',
                  border: 'none',
                  justifyContent: 'center',
                  alignItems: 'center',
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

export default Species;
