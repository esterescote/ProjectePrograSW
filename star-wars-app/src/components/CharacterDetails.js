import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useLocation, useNavigate } from 'react-router-dom';

function CharacterDetails() 
{
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const characterName = location.state?.characterName;

  const [character, setCharacter] = useState(null);
  const [filmTitles, setFilmTitles] = useState([]);
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://akabab.github.io/starwars-api/api/all.json');
        const data = await response.json();
        const imageMap = {};
        data.forEach((image) => {
          imageMap[image.name.toLowerCase()] = image.image;
        });
        setImageMap(imageMap);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      try {
        const response = await fetch('https://swapi.py4e.com/api/people/');
        const data = await response.json();
        const foundCharacter = data.results.find(
          (char) => char.name.toLowerCase() === characterName.toLowerCase()
        );

        if (foundCharacter) {
          const homeworld = await fetch(foundCharacter.homeworld).then((res) => res.json());
          const species =
            foundCharacter.species.length > 0
              ? await fetch(foundCharacter.species[0]).then((res) => res.json())
              : { name: 'Unknown' };

          // Detalls de les starships
          const starshipNames = await Promise.all(
            foundCharacter.starships.map((starshipUrl) =>
              fetch(starshipUrl).then((res) => res.json()).then((data) => data.name)
            )
          );

          const detailedCharacter = {
            ...foundCharacter,
            homeworld: homeworld.name,
            species: species.name,  // Només mostrem el nom de l'espècie
            starships: starshipNames,  // Afegim els noms de les starships
            image: imageMap[foundCharacter.name.toLowerCase()] || null, // Agafem la imatge del map
          };

          setCharacter(detailedCharacter);

          const titles = await Promise.all(
            detailedCharacter.films.map((filmUrl) =>
              fetch(filmUrl).then((response) => response.json()).then((data) => data.title)
            )
          );
          setFilmTitles(titles);
        }
      } catch (error) {
        console.error('Error fetching character details:', error);
      }
    };

    if (characterName && imageMap[characterName.toLowerCase()]) {
      fetchCharacterDetails();
    }
  }, [characterName, imageMap]);

  if (!character) {
    return <p>Loading character details...</p>;
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

      {/* Nom de l'espècie */}
      <p>Species: {character.species}</p>

      {/* Detalls de les starships */}
      {character.starships && character.starships.length > 0 && (
        <div>
          <h3>Starships:</h3>
          <ul>
            {character.starships.map((starship, index) => (
              <li key={index}>{starship}</li>
            ))}
          </ul>
        </div>
      )}

      <p>Films:</p>
      <ul>
        {filmTitles.map((title, index) => (
          <li
            key={index}
            onClick={() =>
              navigate(`/films/${title}`, { state: { filmTitles: title } })
            }
            style={{ cursor: 'pointer' }}
          >
            {title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CharacterDetails;
