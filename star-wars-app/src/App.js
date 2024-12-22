import React from 'react';
//import ReactDOM from 'react-dom';
import './styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu'; // Nou component del menú
import Footer from './components/Footer';
import { FavoritesProvider } from './context/FavoritesContext';
import Home from './pages/Home';
import Films from './pages/Films';
import FilmDetails from './components/FilmDetails';
import Characters from './pages/Characters';
import CharacterDetails from './components/CharacterDetails';
import Planets from './pages/Planets';
import PlanetsDetails from './components/PlanetsDetails';
import Species from './pages/Species';
import SpeciesDetails from './components/SpeciesDetails';
import Starships from './pages/Starships';
import StarshipsDetails from './components/StarshipsDetails';
import Favorites from './components/Favorites';

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <Header />
        <Menu /> {/* Mostrem el menú sota el header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/films/:id" element={<FilmDetails />} />
          <Route path="/films/:title" element={<FilmDetails />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/:name" element={<CharacterDetails />} />
          <Route path="/planets" element={<Planets />} />
          <Route path="/planets/:planetName" element={<PlanetsDetails />} />
          <Route path="/species" element={<Species />} />
          <Route path="/species/:name" element={<SpeciesDetails />} />
          <Route path="/starships" element={<Starships />} />
          <Route path="/starships/:name" element={<StarshipsDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        <Footer />
      </Router>
    </FavoritesProvider>
  );
}

export default App;
