import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';  // Si estàs utilitzant aquest context
import { useNavigate } from 'react-router-dom';

function Characters() 
{
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const fetchAllCharacters = async () => 
  {
    let allCharacters = [];
    let nextUrl = 'https://swapi.py4e.com/api/people/';
    while (nextUrl) {
      const response = await fetch(nextUrl);
      const data = await response.json();
      allCharacters = [...allCharacters, ...data.results];
      nextUrl = data.next;
    }
    return allCharacters;
  };

  useEffect(() => 
  {
    const fetchData = async () => 
    {
      try 
      {
        const allCharacters = await fetchAllCharacters();

        // Obtenim les dades addicionals com el món natal i l'espècie
        const detailedCharacters = await Promise.all(
          allCharacters.map(async (character) => 
          {
            const homeworld = await fetch(character.homeworld).then((res) => res.json());
            const species =
              character.species.length > 0
                ? await fetch(character.species[0]).then((res) => res.json())
                : { name: 'Unknown' };

            return {
              ...character,
              homeworld: homeworld.name,
              species: species.name,
            };
          })
        );

        const fetchImagesPromise = fetch('https://akabab.github.io/starwars-api/api/all.json')
          .then((response) => response.json())
          .then((images) => 
          {
            const imageMap = {};
            images.forEach((image) => 
            {
              imageMap[image.name.toLowerCase()] = image.image;
            });
            return imageMap;
          });

        const imageMap = await fetchImagesPromise;

        const charactersWithImages = detailedCharacters.map((character) => ({
          ...character,
          image: imageMap[character.name.toLowerCase()] || null,
        }));

        setCharacters(charactersWithImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showDetails = (character) => {
    navigate(`/characters/${character.name}`, { state: { characterName: character.name } });
  };
  

  return (
    <div>
      <h2>CHARACTERS</h2>
      {loading ? (
        <p>Loading characters...</p>
      ) : (
        <ul className='display-elements'>
          {characters.map((character) => (
            <li key={character.url} style={{ marginBottom: '20px' }}>
              <h3>{character.name}</h3>
              {character.image && (
                <img
                  src={character.image}
                  alt={character.name}
                  style={{ width: 'auto', height: '250px', marginBottom: '10px' }}
                />
              )}
              <p>Gender: {character.gender}</p>
              <p>Homeworld: {character.homeworld}</p>
              <p>Species: {character.species}</p>
              <button
                onClick={() => showDetails(character)}
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
                onClick={() => toggleFavorite(character)}
                style={{
                  backgroundColor: favorites.some((fav) => fav.url === character.url)
                    ? 'red'
                    : 'gray',
                  color: 'white',
                  padding: '10px',
                  margin: '10px',
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
