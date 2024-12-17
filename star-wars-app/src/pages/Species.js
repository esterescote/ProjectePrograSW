import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useLocation } from 'react-router-dom';

function Species() {
  const [species, setSpecies] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [expandedSpecies, setExpandedSpecies] = useState(null);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const location = useLocation();
  const selectedSpecie = location.state?.selectedSpecie || null;

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

  // Funció per alternar la visibilitat de les dades de l'espècie
  const toggleExpand = (speciesName) => {
    if (expandedSpecies === speciesName) {
      setExpandedSpecies(null); // Si ja està expandit, el tanquem
    } else {
      setExpandedSpecies(speciesName); // Si no està expandit, l'obrim
    }
  };

  return (
    <div>
      <h2>SPECIES</h2>
      {loading ? (<p>Loading species...</p>) : (
        <ul className='display-elements'>
          {
            species.map((specie) => 
            (
              <li key={specie.url}>
                <h3 onClick={() => toggleExpand(specie.name)} style={{ cursor: 'pointer'}}>
                  {specie.name}
                </h3>
                {expandedSpecies === specie.name && (
                  <div>
                    <p>Classification: {specie.classification}</p>
                    <p>Designation: {specie.designation}</p>
                    <p>Average height: {specie.average_height} cm</p>
                    <p>Skin colors: {specie.skin_colors}</p>
                    <p>Hair colors: {specie.hair_colors}</p>
                    <p>Eye colors: {specie.eye_colors}</p>
                    <p>Average lifespan: {specie.average_lifespan} years</p>
                    <p>Language: {specie.language}</p>
                    <p>Homeworld: {specie.homeworld}</p>
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(specie)}
                  style={{
                    backgroundColor: favorites.some((fav) => fav.url === specie.url)
                      ? 'red'
                      : 'gray',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {favorites.some((fav) => fav.url === specie.url)
                    ? 'Remove from Favorites'
                    : 'Add to Favorites'}
                </button>
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default Species;
