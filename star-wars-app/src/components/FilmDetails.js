import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';  // Si estàs utilitzant aquest context
import { useLocation, useNavigate} from 'react-router-dom';

function FilmDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const film = location.state?.film; // Asegura't que film està disponible

  const [characterNames, setCharacterNames] = useState([]);  // Per desar els noms dels personatges
  const [planetNames, setPlanetNames] = useState([]);  // Per desar els noms dels planetes
  const [starshipNames, setStarshipNames] = useState([]);  // Per desar els noms de les starships
  const [speciesNames, setSpeciesNames] = useState([]);  // Per desar els noms de les species
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    const fetchCharacterNames = async () => {
      if (film && film.characters && film.characters.length > 0) {
        const names = await Promise.all(
          film.characters.map((characterUrl) =>
            fetch(characterUrl)
              .then((response) => response.json())
              .then((data) => data.name)
          )
        );
        setCharacterNames(names);
      }
    };

    const fetchPlanetNames = async () => {
      if (film && film.planets && film.planets.length > 0) {
        const names = await Promise.all(
          film.planets.map((planetUrl) =>
            fetch(planetUrl)
              .then((response) => response.json())
              .then((data) => data.name)
          )
        );
        setPlanetNames(names);
      }
    };

    const fetchStarshipNames = async () => {
      if (film && film.starships && film.starships.length > 0) {
        const names = await Promise.all(
          film.starships.map((starshipUrl) =>
            fetch(starshipUrl)
              .then((response) => response.json())
              .then((data) => data.name)
          )
        );
        setStarshipNames(names);
      }
    };

    const fetchSpeciesNames = async () => {
      if (film && film.species && film.species.length > 0) {
        const names = await Promise.all(
          film.species.map((speciesUrl) =>
            fetch(speciesUrl)
              .then((response) => response.json())
              .then((data) => data.name)
          )
        );
        setSpeciesNames(names);
      }
    };

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

    fetchCharacterNames();
    fetchPlanetNames();
    fetchStarshipNames();
    fetchSpeciesNames();
    fetchImages();
  }, [film]);

  if (!film) {
    return <p>No film details available.</p>;
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
        onClick={() => toggleFavorite(film)}
        style={{
          backgroundColor: favorites.some((fav) => fav.url === film.url) ? 'red' : 'gray',
          color: 'white',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {favorites.some((fav) => fav.url === film.url)
          ? 'Remove from Favorites'
          : 'Add to Favorites'}
      </button>
      <h2>{film.title}</h2>

      {/* Mostrar el pòster de la pel·lícula */}
      {film.poster && (
        <img
          src={film.poster}
          alt={film.title}
          style={{ width: '300px', height: 'auto', marginBottom: '20px' }}
        />
      )}

      {/* Mostrar més informació de la pel·lícula */}
      <p>Episode: {film.episode_id}</p>
      <p>Director: {film.director}</p>
      <p>Producer: {film.producer}</p>
      <p>Release Date: {film.release_date}</p>
      <p>Opening: {film.opening_crawl}</p>

      <h3>Characters:</h3>
      <ul className="display-elements">
        {characterNames.length > 0 ? (
          characterNames.map((name, index) => (
            <li
              key={index}
              onClick={() =>
                navigate(`/characters/${name}`, { state: { characterName: name } })
              }
              style={{ cursor: 'pointer' }}
            >
              {name}
              {/* Si tens imatges, es poden mostrar aquí */}
              {imageMap[name.toLowerCase()] && (
                <img
                  src={imageMap[name.toLowerCase()]}
                  alt={name}
                  style={{ width: '30px', height: 'auto', marginLeft: '10px' }}
                />
              )}
            </li>
          ))
        ) : (
          <p>No characters available</p>
        )}
      </ul>

      {/* Mostrar planetes */}
      <h3>Planets:</h3>
      <ul className="display-elements">
        {planetNames.length > 0 ? (
          planetNames.map((name, index) => (
            <li
              key={index}
              onClick={() =>
                navigate(`/planets/${name}`, { state: { planetName: name } })
              }
              style={{ cursor: 'pointer' }}
            >
              {name}
            </li>
          ))
        ) : (
          <p>No planets available</p>
        )}
      </ul>

      {/* Mostrar starships */}
      <h3>Starships:</h3>
      <ul className="display-elements">
        {starshipNames.length > 0 ? (
          starshipNames.map((name, index) => (
            <li
              key={index}
              onClick={() => {
                // Trobar l'objecte complet de la nau per URL
                const starship = film.starships[index]; // Usar l'índex per obtenir el URL de la starship
                fetch(starship)
                  .then((response) => response.json())
                  .then((data) => {
                    navigate(`/starships/${data.name}`, { state: { starship: data } }); // Passar tot l'objecte de la starship
                  });
              }}
              style={{ cursor: 'pointer' }}
            >
              {name}
            </li>
          ))
        ) : (
          <p>No starships available</p>
        )}
      </ul>

      {/* Mostrar species */}
      <h3>Species:</h3>
      <ul className="display-elements">
        {speciesNames.length > 0 ? (
          speciesNames.map((name, index) => (
            <li
              key={index}
              onClick={() =>
                navigate(`/species/${name}`, { state: { speciesName: name } })
              }
              style={{ cursor: 'pointer' }}
            >
              {name}
            </li>
          ))
        ) : (
          <p>No species available</p>
        )}
      </ul>
    </div>
  );
}

export default FilmDetails;
