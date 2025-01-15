import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom'; // Afegir el hook useNavigate

function Starships() {
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pàgina actual
  const itemsPerPage = 10; // Nombre d'elements per pàgina (10 naus)
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate(); // Instanciar el hook de navegació

  // Funció per obtenir totes les naus
  const fetchAllStarships = async () => {
    let allStarships = [];
    let nextPageUrl = 'https://swapi.py4e.com/api/starships/'; // URL de la primera pàgina de l'API

    try {
      setLoading(true);
      // Iterar sobre totes les pàgines fins que no hi hagi més dades
      while (nextPageUrl) {
        const response = await fetch(nextPageUrl);
        const data = await response.json();

        // Afegir les naus d'aquesta pàgina a la llista
        allStarships = [...allStarships, ...data.results];

        // Actualitzar la URL de la següent pàgina si n'hi ha una
        nextPageUrl = data.next;
      }

      // Quan totes les naus s'han obtingut, actualitzar l'estat
      setStarships(allStarships);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Starships:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStarships(); // Carregar totes les naus quan es renderitza el component
  }, []);

  // Calcular quines naus es mostren a la pàgina actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStarships = starships.slice(startIndex, endIndex);

  // Funció per canviar de pàgina
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Generar botons de paginació
  const totalPages = Math.ceil(starships.length / itemsPerPage);
  const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Funció per mostrar els detalls de la nau
  const showDetails = (starship) => {
    navigate(`/starships/${starship.name}`, { state: { starship } });
  };

  return (
    <div>
      <h2>STARSHIPS</h2>
      {loading ? (
        <p className='breu'>Loading starships...</p>
      ) : (
        <>
          <ul className="display-elements">
            {currentStarships.map((starship) => (
              <li key={starship.url}>
                <h3>{starship.name}</h3>
                <p className='breu'><strong>Model: </strong>{starship.model}</p>
                <p className='breu'><strong>Manufacturer: </strong>{starship.manufacturer}</p>
                <p className='breu'><strong>Cost: </strong>{starship.cost_in_credits} credits</p>
                <div className='button-DF'>
                  <button
                    onClick={() => showDetails(starship)} // Navegar als detalls
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
                    onClick={() => toggleFavorite(starship)}
                    style={{
                      backgroundColor: favorites.some((fav) => fav.url === starship.url) ? 'red' : 'gray',
                      color: 'white',
                      padding: '10px',
                      margin: '10px',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {favorites.some((fav) => fav.url === starship.url)
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

export default Starships;
