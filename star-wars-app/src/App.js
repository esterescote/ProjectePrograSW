import React from 'react';
//import ReactDOM from 'react-dom';  // Importing ReactDOM is not necessary here as it's handled in other files
import './styles.css'; // Importing the CSS file for styling
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing routing components for navigation
import Header from './components/Header'; // Importing the Header component
import Menu from './components/Menu'; // New Menu component
import Footer from './components/Footer'; // Importing the Footer component
import { FavoritesProvider } from './context/FavoritesContext'; // Importing context provider to manage favorites
import Home from './pages/Home'; // Importing the Home page component
import Films from './pages/Films'; // Importing the Films page component
import FilmDetails from './components/FilmDetails'; // Importing FilmDetails component for showing individual film details
import Characters from './pages/Characters'; // Importing the Characters page component
import CharacterDetails from './components/CharacterDetails'; // Importing CharacterDetails component to show details of individual characters
import Planets from './pages/Planets'; // Importing the Planets page component
import PlanetsDetails from './components/PlanetsDetails'; // Importing PlanetsDetails component for individual planet details
import Species from './pages/Species'; // Importing the Species page component
import SpeciesDetails from './components/SpeciesDetails'; // Importing SpeciesDetails component to show details of species
import Starships from './pages/Starships'; // Importing the Starships page component
import StarshipsDetails from './components/StarshipsDetails'; // Importing StarshipsDetails component for individual starship details
import Favorites from './components/Favorites'; // Importing Favorites component to display user's favorite items

function App() {
  return (
    // Wrapping everything in the FavoritesProvider to make the favorites data available throughout the app
    <FavoritesProvider>
      {/* Setting up the Router to handle different routes */}
      <Router>
        <Header /> {/* Displaying the Header component at the top */}
        <Menu /> {/* Displaying the Menu component below the header */}
        {/* Defining the routes for the application */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home route */}
          <Route path="/films" element={<Films />} /> {/* Films page route */}
          <Route path="/films/:title" element={<FilmDetails />} /> {/* Film details route with dynamic title */}
          <Route path="/characters" element={<Characters />} /> {/* Characters page route */}
          <Route path="/characters/:name" element={<CharacterDetails />} /> {/* Character details route with dynamic name */}
          <Route path="/planets" element={<Planets />} /> {/* Planets page route */}
          <Route path="/planets/:name" element={<PlanetsDetails />} /> {/* Planets details route with dynamic name */}
          <Route path="/species" element={<Species />} /> {/* Species page route */}
          <Route path="/species/:name" element={<SpeciesDetails />} /> {/* Species details route with dynamic name */}
          <Route path="/starships" element={<Starships />} /> {/* Starships page route */}
          <Route path="/starships/:name" element={<StarshipsDetails />} /> {/* Starships details route with dynamic name */}
          <Route path="/favorites" element={<Favorites />} /> {/* Favorites page route */}
        </Routes>
        <Footer /> {/* Displaying the Footer component at the bottom */}
      </Router>
    </FavoritesProvider>
  );
}

export default App; // Exporting the App component for use in other parts of the app
