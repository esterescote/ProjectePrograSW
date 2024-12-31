import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useLocation, useNavigate } from 'react-router-dom';

function CharacterDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const characterName = location.state?.characterName;


  const [character, setCharacter] = useState(null);
  const [filmTitles, setFilmTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funció per carregar tots els personatges de totes les pàgines
  const fetchAllCharacters = async () => {
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

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        // Carregar tots els personatges
        const allCharacters = await fetchAllCharacters();

        // Trobar el personatge corresponent
        const foundCharacter = allCharacters.find(
          (char) => char.name.toLowerCase() === characterName.toLowerCase()
        );

        if (!foundCharacter) {
          console.error('Character not found');
          setLoading(false);
          return;
        }

        // Carregar dades addicionals: món natal i espècie
        const homeworld = await fetch(foundCharacter.homeworld).then((res) => res.json());
        const species =
          foundCharacter.species.length > 0
            ? await fetch(foundCharacter.species[0]).then((res) => res.json())
            : { name: 'Unknown' };

        // Carregar imatge del personatge
        const imageResponse = await fetch('https://akabab.github.io/starwars-api/api/all.json');
        const imageData = await imageResponse.json();
        const characterImage =
          imageData.find((img) => img.name.toLowerCase() === foundCharacter.name.toLowerCase())
            ?.image || null;

        // Construir els detalls complets del personatge
        const detailedCharacter = {
          ...foundCharacter,
          homeworld: homeworld.name,
          species: species.name,
          image: characterImage,
        };

        setCharacter(detailedCharacter);

        // Carregar títols de les pel·lícules
        const titles = await Promise.all(
          foundCharacter.films.map((filmUrl) =>
            fetch(filmUrl)
              .then((response) => response.json())
              .then((film) => ({ title: film.title, details: film }))
          )
        );
        setFilmTitles(titles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching character details:', error);
        setLoading(false);
      }
    };

    if (characterName) {
      fetchCharacterDetails();
    }
  }, [characterName]);

  if (loading) {
    return <p>Loading character details...</p>;
  }

  if (!character) {
    return <p>Character not found.</p>;
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: 'gray',
          color: 'white',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Back
      </button>

      <button
        onClick={() => toggleFavorite(character)}
        style={{
          backgroundColor: favorites.some((fav) => fav.url === character.url) ? 'red' : 'gray',
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

      <h2>{character.name}</h2>
      {character.image && (
        <img
          src={character.image}
          alt={character.name}
          style={{ width: '200px', height: 'auto', marginBottom: '20px' }}
        />
      )}
      <p>Height: {character.height} cm</p>
      <p>Mass: {character.mass} kg</p>
      <p>Hair color: {character.hair_color}</p>
      <p>Skin color: {character.skin_color}</p>
      <p>Eye color: {character.eye_color}</p>
      <p>Birth year: {character.birth_year}</p>
      <p>Gender: {character.gender}</p>
      <p>Homeworld: {character.homeworld}</p>
      <p>Species: {character.species}</p>

      <h3>Films:</h3>
      <ul>
        {filmTitles.map((film, index) => (
          <li
            key={index}
            onClick={() =>
              navigate(`/films/${film.title}`, { state: { film: film.details } })
            }
            style={{ cursor: 'pointer' }}
          >
            {film.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterDetails;
