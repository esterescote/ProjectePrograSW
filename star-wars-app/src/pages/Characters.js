import React, { useState, useEffect } from 'react';

function Characters() 
{
  const [characters, setCharacters] = useState([]);  // Estat per emmagatzemar la llista de personatges
  const [loading, setLoading] = useState(true); // Estat de càrrega

  // useEffect per carregar automàticament quan es renderitza el component
  useEffect(() => 
  {
    fetch('https://swapi.dev/api/people/')  // Fetch a l'API per obtenir la llista de personatges
      .then((response) => response.json())  // Convertir la resposta a JSON
      .then((data) => 
      {
        // Per cada personatge, buscar la informació dels films
        const fetchFilmsPromises = data.results.map((character) => 
        {
          const filmsPromises = character.films.map((url) =>
            fetch(url).then((response) => response.json())
          );
          return Promise.all(filmsPromises).then((films) => 
          {
            return { ...character, films: films.map((film) => film.title) };
          });
        });

        // Esperar que totes les crides als films es compleixin abans de continuar
        Promise.all(fetchFilmsPromises)
          .then((updatedCharacters) => 
          {
            setCharacters(updatedCharacters); // Actualitzar l'estat amb els personatges i els films
            setLoading(false); // Finalitzar la càrrega
          })
          .catch((error) => 
          {
            console.error('Error fetching films:', error);
            setLoading(false); // Finalitzar la càrrega en cas d'error
          });
      })
      .catch((error) => 
      {
        console.error('Error fetching Characters:', error);
        setLoading(false); // Finalitzar la càrrega en cas d'error
      });
  }, []);

  return (
    <div>
      <h2>CHARACTERS</h2>
      {loading ? (<p>Loading characters...</p>) : (
        <ul>
          {
            characters.map((character) => (
              <li key={character.url}>
                <h3>{character.name}</h3>
                <p>Height: {character.height} cm</p>
                <p>Mass: {character.mass} kg</p>
                <p>Hair color: {character.hair_color}</p>
                <p>Skin color: {character.skin_color}</p>
                <p>Eye color: {character.eye_color}</p>
                <p>Birth year: {character.birth_year}</p>
                <p>Gender: {character.gender}</p>
                <p>Films:</p>
                  <ul>
                    {
                      character.films.length > 0 ? (
                        character.films.map((filmTitle, index) => (<li key={index}>{filmTitle}</li>))
                      ) : (<p>No films available</p>)
                    }
                  </ul>
              </li>))
            }
        </ul>)
      }
    </div>
  );
}

export default Characters;
