import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer le stockage local
 * @param {string} key - La clé de stockage local
 * @param {any} initialValue - La valeur initiale si rien n'est trouvé dans localStorage
 * @returns {[any, function]} Valeur stockée et fonction pour la mettre à jour
 */
function useLocalStorage(key, initialValue) {
  // TODO: Exercice 2 - Implémenter le hook useLocalStorage
  // 1. Initialiser l'état avec la valeur du localStorage ou la valeur initiale
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Récupérer depuis localStorage
      const item = window.localStorage.getItem(key);
      // Retourner l'élément parsé ou la valeur initiale
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error);
      return initialValue;
    }
  });
  
  // 2. Mettre à jour localStorage quand la valeur change
  const setValue = (value) => {
    try {
      // Permettre à la valeur d'être une fonction comme pour useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarder dans l'état
      setStoredValue(valueToStore);
      
      // Sauvegarder dans localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key} dans localStorage:`, error);
    }
  };
  
  // Synchroniser avec d'autres onglets - bonus
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Erreur lors de la synchronisation de ${key}:`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);
  
  // 3. Retourner la valeur et la fonction de mise à jour
  return [storedValue, setValue];
}

export default useLocalStorage;