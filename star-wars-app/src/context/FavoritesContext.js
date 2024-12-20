import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => 
{
    const [favorites, setFavorites] = useState([]);

    // Afegir o eliminar un favorit
    const toggleFavorite = (item) => 
    {
        if (favorites.some((fav) => fav.url === item.url)) 
        {
            setFavorites(favorites.filter((fav) => fav.url !== item.url));
        } 
        else 
        {
            setFavorites([...favorites, item]);
        }
    };

    // Funció per esborrar tots els favorits
    const clearFavorites = () => 
    {  
        setFavorites([]);  // Netegem la llista de favorits
    };

    // Carregar favorits des de localStorage al muntar
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    // Actualitzar localStorage quan els favorits canvien
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, clearFavorites  }}>
            {children} {/* Això permet que els components "fills" accedeixin al context */}
        </FavoritesContext.Provider>
    );
};
