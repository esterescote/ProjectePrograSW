// SpeciesDetails Component: This component is responsible for displaying detailed information 
// about a specific species from the Star Wars universe. It fetches data about the species, 
// its homeworld, people, and films. The user can also add or remove the species from their 
// list of favorites, and navigate back to the previous page. It uses the FavoritesContext 
// to manage the favorites state and `useParams` for retrieving the species name from the URL.
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

function SpeciesDetails() {
  // Extract species name from the URL using useParams hook
  const { name } = useParams();
  const [specie, setSpecie] = useState(null); // State to hold species data
  const [homeworldName, setHomeworldName] = useState(''); // State for homeworld name
  const [people, setPeople] = useState([]); // State for people related to the species
  const [films, setFilms] = useState([]); // State for films the species appears in
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Accessing favorites context
  const navigate = useNavigate(); // Hook for navigation

  // States to control dropdown visibility for people and films sections
  const [showPeople, setShowPeople] = useState(false);
  const [showFilms, setShowFilms] = useState(false);

  // Effect hook to fetch species details when the component mounts or when 'name' changes
  useEffect(() => {
    const fetchSpecieDetails = async () => {
      try {
        // Fetch species data from API using the species name
        const response = await fetch(`https://swapi.py4e.com/api/species/?search=${name}`);
        const data = await response.json();
        const specieData = data.results[0]; // Get the first matching species

        setSpecie(specieData); // Set species data to state

        // Fetch the homeworld data if available
        if (specieData && specieData.homeworld) {
          const planetResponse = await fetch(specieData.homeworld);
          const planetData = await planetResponse.json();
          setHomeworldName(planetData.name); // Set homeworld name to state
        }

        // Fetch people data if available (array of people URLs)
        if (specieData.people) {
          const peopleData = await Promise.all(
            specieData.people.map((personUrl) => fetch(personUrl).then((res) => res.json()))
          );
          setPeople(peopleData); // Set people data to state
        }

        // Fetch films data if available (array of film URLs)
        if (specieData.films) {
          const filmsData = await Promise.all(
            specieData.films.map((filmUrl) => fetch(filmUrl).then((res) => res.json()))
          );
          setFilms(filmsData); // Set films data to state
        }
      } catch (error) {
        console.error('Error fetching species details:', error); // Handle any errors during fetching
      }
    };

    fetchSpecieDetails(); // Call the function to fetch data
  }, [name]); // Re-run the effect when 'name' changes

  // If species data is not found, display an error message
  if (!specie) {
    return <p>Species not found.</p>;
  }

  return (
    <div>
      {/* Back button to navigate to the previous page */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
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

      {/* Button to toggle species favorite status */}
      <button
        onClick={() => toggleFavorite(specie)} // Toggle favorite status of the species
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
        {favorites.some((fav) => fav.url === specie.url)
          ? 'Remove from Favorites' // If species is in favorites, display 'Remove from Favorites'
          : 'Add to Favorites'} {/* If species is not in favorites, display 'Add to Favorites' */}
      </button>

      {/* Display species details */}
      <h2>{specie.name}</h2>
      <p className='breu'><strong>Classification:</strong> {specie.classification}</p>
      <p className='breu'><strong>Designation:</strong> {specie.designation}</p>
      <p className='breu'><strong>Average height:</strong> {specie.average_height} cm</p>
      <p className='breu'><strong>Skin colors:</strong> {specie.skin_colors}</p>
      <p className='breu'><strong>Hair colors:</strong> {specie.hair_colors}</p>
      <p className='breu'><strong>Eye colors:</strong> {specie.eye_colors}</p>
      <p className='breu'><strong>Average lifespan:</strong> {specie.average_lifespan} years</p>
      <p className='breu'><strong>Language:</strong> {specie.language}</p>
      <p className='breu'><strong>Homeworld:</strong> {homeworldName || 'Unknown'}</p>

      {/* People section with a toggle button */}
      <h3 className='desplegables' onClick={() => setShowPeople(!showPeople)}>
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
                    state: { characterName: person.name }, // Pass character name in state for navigation
                  })
                }
                style={{
                  cursor: 'pointer', // Show pointer cursor on hover
                }}
              >
                {person.name}
              </li>
            ))
          ) : (
            <p className='breu'>No characters available.</p> // Message when no characters are available
          )}
        </ul>
      )}

      {/* Films section with a toggle button */}
      <h3 className='desplegables' onClick={() => setShowFilms(!showFilms)}>
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
                    state: { film }, // Pass film data in state for navigation
                  })
                }
                style={{
                  cursor: 'pointer', // Show pointer cursor on hover
                }}
              >
                {film.title}
              </li>
            ))
          ) : (
            <p className='breu'>No films available.</p> // Message when no films are available
          )}
        </ul>
      )}
    </div>
  );
}

export default SpeciesDetails; // Export the component
