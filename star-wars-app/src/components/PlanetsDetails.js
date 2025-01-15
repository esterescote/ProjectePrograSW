// PlanetsDetails Component: This component is responsible for displaying detailed information 
// about a specific planet from the Star Wars universe. It uses the 'name' parameter from the 
// URL to fetch data about the planet, its residents, and the films it appears in. The user 
// can also add or remove the planet from their list of favorites, and navigate back to the 
// previous page. It uses the FavoritesContext to manage the favorites state.
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';

function PlanetsDetails() {
  // Retrieve the planet name from the URL parameters
  const { name } = useParams(); 
  const navigate = useNavigate(); // Hook to navigate between pages
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Accessing favorites context

  // Local states to manage planet details and loading state
  const [planet, setPlanet] = useState(null); 
  const [loading, setLoading] = useState(true);

  // States for handling dropdown visibility for residents and films
  const [showResidents, setShowResidents] = useState(false);
  const [showFilms, setShowFilms] = useState(false);

  // Fetch planet details from the API when the component mounts or when the 'name' changes
  useEffect(() => {
    const fetchPlanetDetails = async () => {
      try {
        let nextUrl = 'https://swapi.py4e.com/api/planets/'; // Start from the first page
        let foundPlanet = null;

        // Iterate through pages of data until the planet is found
        while (nextUrl && !foundPlanet) {
          const response = await fetch(nextUrl);
          const data = await response.json();
          foundPlanet = data.results.find(
            (planet) => planet.name.toLowerCase() === name.toLowerCase() // Match the planet by name
          );
          nextUrl = data.next; // Move to the next page if available
        }

        if (foundPlanet) {
          // Fetch residents and films data using Promise.all for parallel requests
          const residents = await Promise.all(
            foundPlanet.residents.map((url) =>
              fetch(url).then((res) => res.json())
            )
          );
          const films = await Promise.all(
            foundPlanet.films.map((url) =>
              fetch(url).then((res) => res.json())
            )
          );

          setPlanet({
            ...foundPlanet,
            residents, // Add residents data to planet object
            films, // Add films data to planet object
          });
        }
      } catch (error) {
        console.error('Error fetching planet details:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    if (name) {
      fetchPlanetDetails(); // Fetch planet details when 'name' is available
    }
  }, [name]); // Re-run the effect when 'name' changes in URL

  // Display a loading message if the data is still being fetched
  if (loading) {
    return <p>Loading planet details...</p>;
  }

  // Display an error message if no planet was found
  if (!planet) {
    return <p>Planet not found</p>;
  }

  // Return the JSX to render planet details
  return (
    <div>
      {/* Back button to navigate to the previous page */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
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

      {/* Button to add or remove the planet from favorites */}
      <button
        onClick={() => toggleFavorite(planet)} // Toggle the favorite status
        style={{
          backgroundColor: favorites.some((fav) => fav.url === planet.url)
            ? 'red' // Red if planet is in favorites
            : 'gray', // Gray if planet is not in favorites
          color: 'white',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {favorites.some((fav) => fav.url === planet.url)
          ? 'Remove from Favorites' // If already a favorite, show this label
          : 'Add to Favorites'} // Otherwise, show this label
      </button>

      {/* Display planet's basic information */}
      <h2>{planet.name}</h2>
      <p className='breu'><strong>Diameter: </strong>{planet.diameter}</p>
      <p className='breu'><strong>Rotation period: </strong>{planet.rotation_period}</p>
      <p className='breu'><strong>Orbital period: </strong>{planet.orbital_period}</p>
      <p className='breu'><strong>Gravity: </strong>{planet.gravity}</p>
      <p className='breu'><strong>Population: </strong>{planet.population}</p>
      <p className='breu'><strong>Climate: </strong>{planet.climate}</p>
      <p className='breu'><strong>Terrain: </strong>{planet.terrain}</p>
      <p className='breu'><strong>Surface water: </strong>{planet.surface_water}</p>

      {/* Residents section with a toggle button */}
      <h3 className='desplegables' onClick={() => setShowResidents(!showResidents)}>
        Residents
      </h3>
      {showResidents && (
        <ul className={`display-elements ${showResidents ? 'show' : ''}`}>
          {planet.residents.length > 0 ? (
            planet.residents.map((resident, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/characters/${resident.name}`, {
                    state: { characterName: resident.name }, // Pass resident name in state for navigation
                  })
                }
                style={{
                  cursor: 'pointer', // Show pointer cursor on hover
                }}
              >
                {resident.name}
              </li>
            ))
          ) : (
            <p className='breu'>No residents available</p> // No residents available message
          )}
        </ul>
      )}

      {/* Films section with a toggle button */}
      <h3 className='desplegables' onClick={() => setShowFilms(!showFilms)}>
        Films
      </h3>
      {showFilms && (
        <ul className={`display-elements ${showFilms ? 'show' : ''}`}>
          {planet.films.length > 0 ? (
            planet.films.map((film, index) => (
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
            <p className='breu'>No films available</p> // No films available message
          )}
        </ul>
      )}
    </div>
  );
}

export default PlanetsDetails; // Export the component
