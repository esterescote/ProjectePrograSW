import React, { useState, useEffect } from 'react';

function Species() 
{
  const [species, setSpecies] = useState([]);  // Estat per emmagatzemar la llista d'espècies
  const [loading, setLoading] = useState(true); // Estat de càrrega

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
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default Species;
