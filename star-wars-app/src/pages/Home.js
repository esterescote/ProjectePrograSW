import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TMDB_API_KEY = '4d3cb710ab798774158802e72c50dfa2'; // Substitueix per la teva clau d'API

// Mapeja els títols de les pel·lícules de Star Wars amb els seus IDs a TMDB
const starWarsMovieIds = 
{
  "A New Hope": 11,  // ID de la pel·lícula 'Star Wars: Episode IV - A New Hope'
  "The Empire Strikes Back": 1891,  // ID de la pel·lícula 'Star Wars: Episode V - The Empire Strikes Back'
  "Return of the Jedi": 1892,  // ID de la pel·lícula 'Star Wars: Episode VI - Return of the Jedi'
  "The Phantom Menace": 1893,  // ID de la pel·lícula 'Star Wars: Episode I - The Phantom Menace'
  "Attack of the Clones": 1894,  // ID de la pel·lícula 'Star Wars: Episode II - Attack of the Clones'
  "Revenge of the Sith": 1895,  // ID de la pel·lícula 'Star Wars: Episode III - Revenge of the Sith'
  "The Force Awakens": 140607,  // ID de la pel·lícula 'Star Wars: Episode VII - The Force Awakens'
};

function Home() 
{
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => 
  {
    const fetchFilms = async () => {
      try {
        // Obtenir les pel·lícules de SWAPI
        const swapiResponse = await fetch('https://swapi.py4e.com/api/films/');
        const swapiData = await swapiResponse.json();

        // Afegir informació de TMDB a cada pel·lícula
        const tmdbPromises = swapiData.results.map(async (film) => {
          // Utilitzar l'ID de la pel·lícula per fer una cerca més precisa
          const tmdbMovieId = starWarsMovieIds[film.title];
          if (!tmdbMovieId) return { ...film }; // Si no trobem l'ID, només retornem la pel·lícula original sense TMDB

          const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${TMDB_API_KEY}`
          );
          const tmdbData = await tmdbResponse.json();

          return {
            ...film,
            poster: tmdbData?.poster_path
              ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
              : null,
            rating: tmdbData?.vote_average || 0,  // Afegir la valoració de TMDB
          };
        });

        const filmsWithImages = await Promise.all(tmdbPromises);

        // Ordenar les pel·lícules per la seva data de llançament (release_date) per a la primera llista
        filmsWithImages.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

        setFilms(filmsWithImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching films:', error);
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const handleShowDetails = (film) => {
    navigate(`/films/${film.episode_id}`, { state: { film } });
  };

  return (
    <div className="home-container">
      <h2>Welcome to the Star Wars Universe!</h2>
      <p style={{ fontSize: '25px',}}>Here you will find all the information you need about the Star Wars universe, including the films, the characters, the planets, the starships, and the species! Explore the rich history of the galaxy far, far away, dive into each film's details, learn about iconic characters, and discover the diverse worlds and vehicles that make up this epic saga.</p>
      <p style={{ fontSize: '40px',}}>Whether you're a long-time fan or new to the Star Wars universe, there's something here for everyone!</p> 

      {/* Llista de pel·lícules ordenada per data de llançament */}
<div className="films-list">
  <h2>All Star Wars Films:</h2>
  <div className="films-container">
    {films.length > 0 ? (
      films
        .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))  // Ordena per data de llançament
        .map((film) => (
          <div key={film.episode_id} className="film-card" onClick={() => handleShowDetails(film)}>
            <h3>{film.title}</h3>
            <img
              src={film.poster}
              alt={film.title}
              style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
            />
            <p>Episode: {film.episode_id}</p>
            <p>Director: {film.director}</p>
            <p>Release Date: {film.release_date}</p>
          </div>
        ))
    ) : (
      <p>Loading films...</p>
    )}
  </div>
</div>

{/* Llista de Top 5 ordenada per rating */}
<div className="top-films-list">
  <h2>Top 5 Star Wars Films (Ordered by Rating):</h2>
  <div className="films-container">
    {films.length > 0 ? (
      films
        .sort((a, b) => b.rating - a.rating)  // Ordena per rating de major a menor
        .slice(0, 5)  // Agafa només les primeres 5 pel·lícules
        .map((film) => (
          <div key={film.episode_id} className="film-card" onClick={() => handleShowDetails(film)}>
            <h3>{film.title}</h3>
            <img
              src={film.poster}
              alt={film.title}
              style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
            />
            <p>Rating: <h2>{film.rating}</h2></p>
          </div>
        ))
    ) : (
      <p>Loading films...</p>
    )}
  </div>
</div>

    </div>
  );
}

export default Home;
