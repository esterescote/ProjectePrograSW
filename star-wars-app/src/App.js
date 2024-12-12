import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { FavoritesProvider } from './context/FavoritesContext'; // Si està a src/context
import Home from './pages/Home'; // Crearem aquesta pàgina més endavant
import Films from './pages/Films'; // Crearem aquesta pàgina també
import Characters from './pages/Characters'; // Això també ho crearem més endavant
import Planets from './pages/Planets';
import Species from './pages/Species';
import Starships from './pages/Starships';
//import Favorites from './pages/Favorites';

ReactDOM.render(
  <FavoritesProvider>
      <App />
  </FavoritesProvider>,
  document.getElementById('root')
);

function App() 
{
  return (
    <FavoritesProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films" element={<Films />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/planets" element={<Planets />} />
        <Route path="/species" element={<Species />} />
        <Route path="/starships" element={<Starships />} />
      </Routes>
      <Footer />
    </Router>
    </FavoritesProvider>
  );
}

export default App;
