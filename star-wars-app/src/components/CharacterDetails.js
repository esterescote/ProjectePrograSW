import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useParams, useNavigate } from 'react-router-dom';

function CharacterDetails() {
  const { name } = useParams(); // Utilitzem useParams per obtenir el nom des de la URL
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const [character, setCharacter] = useState(null);
  const [filmTitles, setFilmTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilms, setShowFilms] = useState(false); // Afegim un estat per mostrar/ocultar les pel·lícules

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
        const allCharacters = await fetchAllCharacters();
        const foundCharacter = allCharacters.find(
          (char) => char.name.toLowerCase() === name.toLowerCase() // Cercar per nom directament
        );

        if (!foundCharacter) {
          console.error('Character not found');
          setLoading(false);
          return;
        }

        const homeworld = await fetch(foundCharacter.homeworld).then((res) => res.json());
        const species =
          foundCharacter.species.length > 0
            ? await fetch(foundCharacter.species[0]).then((res) => res.json())
            : { name: 'Unknown' };

        const imageResponse = await fetch('https://akabab.github.io/starwars-api/api/all.json');
        const imageData = await imageResponse.json();
        const characterImage =
          imageData.find((img) => img.name.toLowerCase() === foundCharacter.name.toLowerCase())
            ?.image || null;

        const detailedCharacter = {
          ...foundCharacter,
          homeworld: homeworld.name,
          species: species.name,
          image: characterImage,
        };

        setCharacter(detailedCharacter);

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

    if (name) {
      fetchCharacterDetails();
    }
  }, [name]);

  if (loading) {
    return <p className='breu'>Loading character details...</p>;
  }

  if (!character) {
    return <p className='breu'>Character not found.</p>;
  }

  return (
    <div className="character-details-container">
      <div className="header-buttons">
        <button onClick={() => navigate(-1)} className="btn back-btn">
          Back
        </button>
        <button
          onClick={() => toggleFavorite(character)}
          className={`btn favorite-btn ${
            favorites.some((fav) => fav.url === character.url) ? 'active' : ''
          }`}
        >
          {favorites.some((fav) => fav.url === character.url)
            ? 'Remove from Favorites'
            : 'Add to Favorites'}
        </button>
      </div>
  
      <div className="character-header">
        <h2>{character.name}</h2>
      </div>
  
      <div className="character-content">
        <div className="character-image">
          {character.image && (
            <img src={character.image} alt={character.name} />
          )}
        </div>
        <div className="character-details">
          <p><strong>Height: </strong>{character.height} cm</p>
          <p><strong>Mass: </strong>{character.mass} kg</p>
          <p><strong>Hair color: </strong>{character.hair_color}</p>
          <p><strong>Skin color: </strong>{character.skin_color}</p>
          <p><strong>Eye color: </strong>{character.eye_color}</p>
          <p><strong>Birth year: </strong>{character.birth_year}</p>
          <p><strong>Gender: </strong>{character.gender}</p>
          <p><strong>Homeworld: </strong>{character.homeworld}</p>
          <p><strong>Species: </strong>{character.species}</p>
        </div>
      </div>
  
      <div className="character-films">
        <h3 onClick={() => setShowFilms(!showFilms)} className="desplegables">
          Films
        </h3>
        {showFilms && (
          <ul>
            {filmTitles.map((film, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/films/${film.title}`, { state: { film: film.details } })
                }
              >
                {film.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CharacterDetails;
