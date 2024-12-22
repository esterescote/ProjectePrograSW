import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importar useNavigate per navegar
import { FavoritesContext } from '../context/FavoritesContext'; // Importa el context per als favorits

function SpeciesDetails() {
  const { name } = useParams();  // Obtenim el nom de l'espècie des de la URL
  const [specie, setSpecie] = useState(null);
  const [homeworldName, setHomeworldName] = useState('');  // Per emmagatzemar el nom del planeta
  const [people, setPeople] = useState([]); // Per emmagatzemar les persones associades
  const [films, setFilms] = useState([]); // Per emmagatzemar les pel·lícules associades
  const { favorites, toggleFavorite } = React.useContext(FavoritesContext); // Usar el context de favorits
  const navigate = useNavigate();  // Usar el hook per navegar entre pàgines

  useEffect(() => {
    const fetchSpecieDetails = async () => {
      try {
        // Obtenim les dades de l'espècie per nom
        const response = await fetch(`https://swapi.py4e.com/api/species/?search=${name}`);
        const data = await response.json();
        
        const specieData = data.results[0]; // Assumeix que només hi ha un resultat

        setSpecie(specieData);

        // Si hi ha un homeworld, fem una crida per obtenir el nom del planeta
        if (specieData && specieData.homeworld) {
          const planetResponse = await fetch(specieData.homeworld);
          const planetData = await planetResponse.json();
          setHomeworldName(planetData.name); // Guardem el nom del planeta
        }

        // Obtenim la informació de les persones associades a l'espècie
        if (specieData.people) {
          const peopleData = await Promise.all(specieData.people.map(personUrl => fetch(personUrl).then(res => res.json())));
          setPeople(peopleData);
        }

        // Obtenim la informació de les pel·lícules associades a l'espècie
        if (specieData.films) {
          const filmsData = await Promise.all(specieData.films.map(filmUrl => fetch(filmUrl).then(res => res.json())));
          setFilms(filmsData);
        }

      } catch (error) {
        console.error('Error fetching species details:', error);
      }
    };

    fetchSpecieDetails();
  }, [name]);  // Quan el nom de l'espècie canviï, tornarem a carregar la informació

  if (!specie) {
    return <p>Loading species details...</p>;
  }

  const handleBackClick = () => {
    navigate(-1); // Tornar a la pàgina anterior
  };

  const handleFavoriteClick = () => {
    toggleFavorite(specie); // Afegir o eliminar de favorits
  };

  return (
    <div>
      <button
        onClick={handleBackClick}
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

      {/* Botó per afegir/eliminar de favorits */}
      <button
        onClick={handleFavoriteClick}
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

      {/* Mostra les persones associades */}
      <div>
        <h3>People</h3>
        {people.length > 0 ? (
          <ul>
            {people.map((person, index) => (
              <li key={index}>{person.name}</li> // Mostra el nom de cada persona
            ))}
          </ul>
        ) : (
          <p>No characters available.</p>
        )}
      </div>

      {/* Mostra les pel·lícules associades */}
      <div>
        <h3>Films</h3>
        {films.length > 0 ? (
          <ul>
            {films.map((film, index) => (
              <li key={index}>{film.title}</li> // Mostra el títol de cada pel·lícula
            ))}
          </ul>
        ) : (
          <p>No films available.</p>
        )}
      </div>
    </div>
  );
}

export default SpeciesDetails;
