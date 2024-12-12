import React, { useState, useEffect } from 'react';

function Films() 
{
  const [films, setFilms] = useState([]);  // Estat per emmagatzemar la llista de pel·lícules

  // useEffect per carregar les pel·lícules automàticament quan es renderitza el component
  useEffect(() => 
  {
    fetch('https://swapi.dev/api/films/')    // Fetch a l'API de films
      .then((response) => response.json())  // Convertir la resposta a JSON
      .then((data) => 
      {
        setFilms(data.results);            // Guardar les pel·lícules a l'estat
      })
      .catch((error) => 
      {
        console.error('Error fetching films:', error);
      });
  }, []); // L'array buit fa que només es faci la crida un cop quan el component es renderitza

  return (
    <div>
      <h2>FILMS</h2>
      {films.length > 0 ? (
        <ul>
          {
            films.map((film) => (
              <li key={film.url}>
                <h3>{film.title}</h3>
                <p>Episode: {film.episode_id}</p>
                <p>Director: {film.director}</p>
                <p>Producer: {film.producer}</p>
                <p>Release Date: {film.release_date}</p>
              </li>
            ))
          }
        </ul>
      ) : (
        <p>Loading films...</p>
      )}
    </div>
  );
}

export default Films;