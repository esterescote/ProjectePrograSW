import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

function SpeciesDetails() 
{
  const { name } = useParams();
  const [specie, setSpecie] = useState(null);
  const [homeworldName, setHomeworldName] = useState('');
  const [people, setPeople] = useState([]);
  const [films, setFilms] = useState([]);
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  // Afegim estats per controlar les seccions desplegables
  const [showPeople, setShowPeople] = useState(false);
  const [showFilms, setShowFilms] = useState(false);

  useEffect(() => 
  {
    const fetchSpecieDetails = async () => 
    {
      try 
      {
        const response = await fetch(`https://swapi.py4e.com/api/species/?search=${name}`);
        const data = await response.json();
        const specieData = data.results[0];

        setSpecie(specieData);

        if (specieData && specieData.homeworld) {
          const planetResponse = await fetch(specieData.homeworld);
          const planetData = await planetResponse.json();
          setHomeworldName(planetData.name);
        }

        if (specieData.people) {
          const peopleData = await Promise.all(
            specieData.people.map((personUrl) => fetch(personUrl).then((res) => res.json()))
          );
          setPeople(peopleData);
        }

        if (specieData.films) {
          const filmsData = await Promise.all(
            specieData.films.map((filmUrl) => fetch(filmUrl).then((res) => res.json()))
          );
          setFilms(filmsData);
        }
      } catch (error) {
        console.error('Error fetching species details:', error);
      }
    };

    fetchSpecieDetails();
  }, [name]);

  if (!specie) {
    return <p>Species not found.</p>;
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
        }}
      >
        Back
      </button>

      <button
        onClick={() => toggleFavorite(specie)}
        style={{
          backgroundColor: favorites.some((fav) => fav.url === specie.url) ? 'red' : 'gray',
          color: 'white',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {favorites.some((fav) => fav.url === specie.url) ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>

      <h2>{specie.name}</h2>
      <p><strong>Classification:</strong> {specie.classification}</p>
      <p><strong>Designation:</strong> {specie.designation}</p>
      <p><strong>Average height:</strong> {specie.average_height} cm</p>
      <p><strong>Skin colors:</strong> {specie.skin_colors}</p>
      <p><strong>Hair colors:</strong> {specie.hair_colors}</p>
      <p><strong>Eye colors:</strong> {specie.eye_colors}</p>
      <p><strong>Average lifespan:</strong> {specie.average_lifespan} years</p>
      <p><strong>Language:</strong> {specie.language}</p>
      <p><strong>Homeworld:</strong> {homeworldName || 'Unknown'}</p>

      {/* People */}
      <h3 className='desplegables'
        onClick={() => setShowPeople(!showPeople)}
      >
        People
      </h3>
      {showPeople && (
        <ul className={`display-elements ${showPeople ? 'show' : ''}`}>
          {people.length > 0 ? (
            people.map((person, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/characters/${person.name}`, {
                    state: { characterName: person.name },
                  })
                }
                style={{
                  cursor: 'pointer'
                }}
              >
                {person.name}
              </li>
            ))
          ) : (
            <p>No characters available.</p>
          )}
        </ul>
      )}

      {/* Films */}
      <h3 className='desplegables'
        onClick={() => setShowFilms(!showFilms)}
      >
        Films
      </h3>
      {showFilms && (
        <ul className={`display-elements ${showFilms ? 'show' : ''}`}>
          {films.length > 0 ? (
            films.map((film, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/films/${film.title}`, {
                    state: { film },
                  })
                }
                style={{
                  cursor: 'pointer'
                }}
              >
                {film.title}
              </li>
            ))
          ) : (
            <p>No films available.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default SpeciesDetails;
