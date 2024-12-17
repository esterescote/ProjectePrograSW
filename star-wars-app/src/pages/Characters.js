import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useLocation } from 'react-router-dom';

function Characters() 
{
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCharacter, setExpandedCharacter] = useState(null); // Estat per controlar el personatge expandit
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const location = useLocation();
  const selectedCharacter = location.state?.selectedCharacter || null;

  // useEffect per carregar automàticament quan es renderitza el component
  useEffect(() => 
  {
    // Crida inicial per obtenir els personatges
    fetch('https://swapi.py4e.com/api/people/')
      .then((response) => response.json())
      .then((data) => 
      {
        // Per cada personatge, buscar la informació dels films
        const fetchFilmsPromises = data.results.map((character) => 
        {
          const filmsPromises = character.films.map((url) => fetch(url).then((response) => response.json()));
          
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

            // Expandir automàticament el personatge seleccionat si n'hi ha
            if (selectedCharacter) 
            {
              const matchingCharacter = updatedCharacters.find((char) => char.name === selectedCharacter.name);
              if (matchingCharacter) 
              {
                setExpandedCharacter(matchingCharacter.name);
              }
            }
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
  }, [selectedCharacter]);

  // Funció per alternar la visibilitat de les dades del personatge
  const toggleExpand = (characterName) => 
  {
    setExpandedCharacter((prev) => (prev === characterName ? null : characterName));
  };

  return (
    <div>
      <h2>CHARACTERS</h2>
      {loading ? (<p>Loading characters...</p>) : (
        <ul>
          {characters.map((character) => 
          (
            <li key={character.url}>
              <h3 onClick={() => toggleExpand(character.name)} style={{ cursor: 'pointer'}}>
                {character.name}
              </h3>

              {/* Mostrar la resta de la informació només si aquest personatge està expandit */}
              {expandedCharacter === character.name && 
              (
                <div>
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
                </div>
              )}

              <button 
              onClick={() => toggleFavorite(character)}
              style={{
                backgroundColor: favorites.some((fav) => fav.url === character.url)
                  ? 'red'
                  : 'gray',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
              >
                {favorites.some((fav) => fav.url === character.url)
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

export default Characters;
