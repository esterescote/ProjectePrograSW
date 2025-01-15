import React, { createContext, useState, useEffect } from 'react';

// Create a context to manage the state of favorite items across the app
export const FavoritesContext = createContext();

/**
 * FavoritesProvider component:
 * This component is responsible for managing the state of favorite items. It provides functions
 * to add or remove items from the favorites list, clear all favorites, and load/save favorites
 * from/to localStorage. The component wraps its children with the FavoritesContext.Provider, 
 * allowing other components to access and manipulate the favorites state.
 * 
 * Related components:
 * - The context is consumed by components that need to read or modify the favorite items (e.g., 
 *   adding/removing items to/from favorites).
 * 
 * Component Structure:
 * - `useState` is used to store the list of favorite items.
 * - `useEffect` is used to load the favorite items from localStorage when the component is mounted,
 *   and to save the favorite items back to localStorage whenever the favorites state changes.
 */
export const FavoritesProvider = ({ children }) => {
  // State to store the list of favorite items
  const [favorites, setFavorites] = useState([]);

  /**
   * toggleFavorite function:
   * This function is responsible for adding or removing an item from the favorites list.
   * If the item is already in the favorites list, it is removed; otherwise, it is added.
   * 
   * @param {Object} item - The item to be toggled in the favorites list.
   */
  const toggleFavorite = (item) => {
    // Check if the item is already in the favorites list
    if (favorites.some((fav) => fav.url === item.url)) {
      // If it is, remove it from the list
      setFavorites(favorites.filter((fav) => fav.url !== item.url));
    } else {
      // If not, add it to the list
      setFavorites([...favorites, item]);
    }
  };

  /**
   * clearFavorites function:
   * This function clears all items from the favorites list by resetting the state to an empty array.
   */
  const clearFavorites = () => {
    setFavorites([]); // Reset the favorites list to an empty array
  };

  /**
   * useEffect hook to load favorites from localStorage:
   * This hook runs once when the component is mounted. It attempts to load the stored favorites 
   * from localStorage (if available), and updates the state with the loaded list.
   */
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites); // Set the loaded favorites into state
  }, []); // Empty dependency array ensures this effect runs only once on mount

  /**
   * useEffect hook to save favorites to localStorage:
   * This hook runs every time the `favorites` state changes. It saves the current favorites list 
   * to localStorage so that it persists between page reloads.
   */
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Store the favorites list in localStorage
  }, [favorites]); // The effect runs when the `favorites` state changes

  return (
    // Provide the favorites state and the functions to modify it to the context
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, clearFavorites }}>
      {children} {/* This allows the child components to access the favorites context */}
    </FavoritesContext.Provider>
  );
};
