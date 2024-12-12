import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';


function Species() 
{
  const [species, setSpecies] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // useEffect per carregar automàticament quan es renderitza el component
  useEffect(() => 
  {
    fetch('https://swapi.dev/api/species/')
      .then((response) => response.json())
      .then((data) => 
      {
        const fetchPlanetsPromises = data.results.map((species) => 
        {
          const planetsPromises = species.homeworld
            ? [fetch(species.homeworld).then((response) => response.json())]
            : [];  // Verifiquem si hi ha un planeta associat
          return Promise.all(planetsPromises).then((planets) => 
          {
            return { ...species, homeworld: planets.length > 0 ? planets[0].name : 'Unknown' };
          });
        });

        // Esperar que totes les crides als planetes es compleixin abans de continuar
        Promise.all(fetchPlanetsPromises)
          .then((updatedSpecies) => 
          {
            setSpecies(updatedSpecies); // Actualitzar l'estat amb les espècies i els planetes
            setLoading(false); // Finalitzar la càrrega
          })
          .catch((error) => 
          {
            console.error('Error fetching planets:', error);
            setLoading(false); // Finalitzar la càrrega en cas d'error
          });
      })
      .catch((error) => 
      {
        console.error('Error fetching Species:', error);
        setLoading(false); // Finalitzar la càrrega en cas d'error
      });
  }, []);

  return (
    <div>
      <h2>SPECIES</h2>
      {loading ? (<p>Loading species...</p>) : (
        <ul>
          {
            species.map((specie) => 
            (
              <li key={specie.url}>
                <h3>{specie.name}</h3>
                <p>Classification: {specie.classification}</p>
                <p>Designation: {specie.designation}</p>
                <p>Average height: {specie.average_height} cm</p>
                <p>Skin colors: {specie.skin_colors}</p>
                <p>Hair colors: {specie.hair_colors}</p>
                <p>Eye colors: {specie.eye_colors}</p>
                <p>Average lifespan: {specie.average_lifespan} years</p>
                <p>Language: {specie.language}</p>
                <p>Homeworld: {specie.homeworld}</p>
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
