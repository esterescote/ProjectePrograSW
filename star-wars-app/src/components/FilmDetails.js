import React, { useState, useEffect, useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { useParams, useNavigate } from 'react-router-dom';

function FilmDetails() {
  const { title } = useParams(); // Utilitzem useParams per obtenir el títol des de la URL
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const [film, setFilm] = useState(null);
  const [characterNames, setCharacterNames] = useState([]);
  const [planetNames, setPlanetNames] = useState([]);
  const [starshipNames, setStarshipNames] = useState([]);
  const [speciesNames, setSpeciesNames] = useState([]);

  const [showCharacters, setShowCharacters] = useState(false);
  const [showPlanets, setShowPlanets] = useState(false);
  const [showStarships, setShowStarships] = useState(false);
  const [showSpecies, setShowSpecies] = useState(false);

  // Funció per carregar totes les pel·lícules de la API
  const fetchAllFilms = async () => {
    const response = await fetch('https://swapi.py4e.com/api/films/');
    const data = await response.json();
    return data.results;
  };

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        const allFilms = await fetchAllFilms();
        const foundFilm = allFilms.find(
          (f) => f.title.toLowerCase() === title.toLowerCase() // Cercar pel títol directament
        );

        if (!foundFilm) {
          console.error('Film not found');
          return;
        }

        setFilm(foundFilm);

        // Fetch characters, planets, starships, species data
        const fetchCharacterNames = async () => {
          if (foundFilm.characters && foundFilm.characters.length > 0) {
            const names = await Promise.all(
              foundFilm.characters.map((characterUrl) =>
                fetch(characterUrl)
                  .then((response) => response.json())
                  .then((data) => data.name)
              )
            );
            setCharacterNames(names);
          }
        };

        const fetchPlanetNames = async () => {
          if (foundFilm.planets && foundFilm.planets.length > 0) {
            const names = await Promise.all(
              foundFilm.planets.map((planetUrl) =>
                fetch(planetUrl)
                  .then((response) => response.json())
                  .then((data) => data.name)
              )
            );
            setPlanetNames(names);
          }
        };

        const fetchStarshipNames = async () => {
          if (foundFilm.starships && foundFilm.starships.length > 0) {
            const names = await Promise.all(
              foundFilm.starships.map((starshipUrl) =>
                fetch(starshipUrl)
                  .then((response) => response.json())
                  .then((data) => data.name)
              )
            );
            setStarshipNames(names);
          }
        };

        const fetchSpeciesNames = async () => {
          if (foundFilm.species && foundFilm.species.length > 0) {
            const names = await Promise.all(
              foundFilm.species.map((speciesUrl) =>
                fetch(speciesUrl)
                  .then((response) => response.json())
                  .then((data) => data.name)
              )
            );
            setSpeciesNames(names);
          }
        };

        fetchCharacterNames();
        fetchPlanetNames();
        fetchStarshipNames();
        fetchSpeciesNames();
      } catch (error) {
        console.error('Error fetching film details:', error);
      }
    };

    if (title) {
      fetchFilmDetails();
    }
  }, [title]);

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
      <p><strong>Episode: </strong>{film.episode_id}</p>
      <p><strong>Director: </strong>{film.director}</p>
      <p><strong>Producer: </strong>{film.producer}</p>
      <p><strong>Release Date: </strong>{film.release_date}</p>
      <p><strong>Opening: </strong>{film.opening_crawl}</p>

      {/* Mostrar títol i subcategoria amb alternança */}
      <h3 className="desplegables" onClick={() => setShowCharacters(!showCharacters)} style={{ cursor: 'pointer' }}>
        Characters
      </h3>
      {showCharacters && (
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
              </li>
            ))
          ) : (
            <p>No characters available</p>
          )}
        </ul>
      )}

      <h3 className="desplegables" onClick={() => setShowPlanets(!showPlanets)} style={{ cursor: 'pointer' }}>
        Planets
      </h3>
      {showPlanets && (
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
      )}

      <h3 className="desplegables" onClick={() => setShowStarships(!showStarships)} style={{ cursor: 'pointer' }}>
        Starships
      </h3>
      {showStarships && (
        <ul className="display-elements">
          {starshipNames.length > 0 ? (
            starshipNames.map((name, index) => (
              <li
                key={index}
                onClick={() => {
                  const starship = film.starships[index];
                  fetch(starship)
                    .then((response) => response.json())
                    .then((data) => {
                      navigate(`/starships/${data.name}`, { state: { starship: data } });
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
      )}

      <h3 className="desplegables" onClick={() => setShowSpecies(!showSpecies)} style={{ cursor: 'pointer' }}>
        Species
      </h3>
      {showSpecies && (
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
      )}
    </div>
  );
}

export default FilmDetails;
