import React, { useState, useEffect, useContext } from 'react'; // Import necessary hooks from React
import { useParams, useNavigate } from 'react-router-dom'; // Import hooks for routing (useParams for fetching params, useNavigate for navigation)
import { FavoritesContext } from '../context/FavoritesContext'; // Import the context for managing favorite starships

/**
 * StarshipsDetails component:
 * This component displays the details of a specific starship based on the URL parameter (`name`). 
 * It allows users to view the starship details, see the pilots and films related to it, 
 * and add/remove the starship to/from their favorites list.
 * 
 * Related components:
 * - `FavoritesContext` is used to handle the list of favorite starships.
 * 
 * Component Structure:
 * - useState is used to store the starship, pilots, films, and visibility states for pilots/films.
 * - useEffect is used to fetch the data when the component is mounted or when the name parameter changes.
 */
function StarshipsDetails() {
  const { name } = useParams(); // Obtain the starship name from the URL parameter
  const navigate = useNavigate(); // Navigate to other pages
  const { favorites, toggleFavorite } = useContext(FavoritesContext); // Get the current favorites and toggleFavorite function from context

  // State hooks for storing starship details, pilots, films, and visibility of sections
  const [starship, setStarship] = useState(null); // Store the fetched starship data
  const [pilots, setPilots] = useState([]); // Store the complete list of pilots for this starship
  const [films, setFilms] = useState([]); // Store the complete list of films in which this starship appears

  const [showPilots, setShowPilots] = useState(false); // Toggle visibility of the pilots list
  const [showFilms, setShowFilms] = useState(false); // Toggle visibility of the films list

  // Check if the current starship is in the favorites list
  const isFavorite = favorites.some((fav) => fav.url === starship?.url);

  // useEffect hook to fetch data when the component is mounted or when 'name' changes
  useEffect(() => {
    const fetchStarshipDetails = async () => {
      try {
        // Fetch starship details from the API using the name parameter from the URL
        const response = await fetch(`https://swapi.py4e.com/api/starships/?search=${name}`);
        const data = await response.json();
        const starshipData = data.results[0]; // Assuming the result is unique, take the first result

        setStarship(starshipData); // Update the starship state with the fetched data

        if (starshipData) {
          // If there are pilots, fetch detailed information about each pilot
          if (starshipData.pilots && starshipData.pilots.length > 0) {
            const pilotData = await Promise.all(
              starshipData.pilots.map((pilotUrl) =>
                fetch(pilotUrl).then((response) => response.json())
              )
            );
            setPilots(pilotData); // Save the complete pilot data in state
          }

          // If there are films, fetch detailed information about each film
          if (starshipData.films && starshipData.films.length > 0) {
            const filmData = await Promise.all(
              starshipData.films.map((filmUrl) =>
                fetch(filmUrl).then((response) => response.json())
              )
            );
            setFilms(filmData); // Save the complete film data in state
          }
        }
      } catch (error) {
        console.error('Error fetching starship details:', error); // Log any errors in the fetch process
      }
    };

    fetchStarshipDetails(); // Call the function to fetch data
  }, [name]); // Dependency array, the effect runs when the 'name' changes

  // If starship data hasn't been loaded yet, display a loading message
  if (!starship) {
    return <p className='breu'>Loading starship details...</p>;
  }

  return (
    <div>
      {/* Back button to navigate to the previous page */}
      <button
        onClick={() => navigate(-1)} // Navigate to the previous page
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
      
      {/* Add/remove from favorites button */}
      <button
        onClick={() => toggleFavorite(starship)} // Toggle the starship in/out of favorites
        style={{
          padding: '10px',
          backgroundColor: isFavorite ? 'red' : 'gray', // Highlight the button in red if the starship is in favorites
          color: 'white',
          marginLeft: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'} {/* Change button text based on if it's a favorite */}
      </button>
      
      {/* Display the starship's name */}
      <h2>{starship.name}</h2>
      <div>
        {/* Display starship details such as model, manufacturer, etc. */}
        <p className='breu'><strong>Model:</strong> {starship.model}</p>
        <p className='breu'><strong>Manufacturer:</strong> {starship.manufacturer}</p>
        <p className='breu'><strong>Cost:</strong> {starship.cost_in_credits} credits</p>
        <p className='breu'><strong>Length:</strong> {starship.length} meters</p>
        <p className='breu'><strong>Max speed:</strong> {starship.max_atmosphering_speed} km/h</p>
        <p className='breu'><strong>Crew:</strong> {starship.crew}</p>
        <p className='breu'><strong>Passengers:</strong> {starship.passengers}</p>
        <p className='breu'><strong>Cargo capacity:</strong> {starship.cargo_capacity} kg</p>
        <p className='breu'><strong>Consumables:</strong> {starship.consumables}</p>
        <p className='breu'><strong>Starship class:</strong> {starship.starship_class}</p>
      </div>

      {/* Section for displaying pilots */}
      <h3 className='desplegables' onClick={() => setShowPilots(!showPilots)}>
        Pilots
      </h3>
      {showPilots && (
        <ul className={`display-elements ${showPilots ? 'show' : ''}`}>
          {pilots.length > 0 ? (
            pilots.map((pilot, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/characters/${pilot.name}`, {
                    state: { character: pilot }, // Pass the pilot data to the next page
                  })
                }
                style={{
                  cursor: 'pointer'
                }}
              >
                {pilot.name}
              </li>
            ))
          ) : (
            <p className='breu'>No pilots available</p> // If no pilots, display a message
          )}
        </ul>
      )}

      {/* Section for displaying films */}
      <h3 className='desplegables' onClick={() => setShowFilms(!showFilms)}>
        Appears in the following films
      </h3>
      {showFilms && (
        <ul className={`display-elements ${showFilms ? 'show' : ''}`}>
          {films.length > 0 ? (
            films.map((film, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/films/${film.title}`, {
                    state: { film }, // Pass the film data to the next page
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
            <p>No films available</p> // If no films, display a message
          )}
        </ul>
      )}
    </div>
  );
}

export default StarshipsDetails; // Export the component for use in other parts of the app
