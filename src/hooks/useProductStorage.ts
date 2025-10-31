import { useState, useEffect } from "react";

interface Product {
  code: string;
  product_name: string;
  brands: string;
  categories: string;
  ingredients_text?: string;
  quantity?: string;
  nutriscore_grade?: string;
  image_url?: string;
}

interface HistoryEntry {
  code: string;
  product_name: string;
  brands: string;
  categories: string;
  ingredients_text?: string;
  quantity?: string;
  nutriscore_grade?: string;
  image_url?: string;
  scannedAt: string;
}

export const useProductStorage = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Load from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    const storedHistory = localStorage.getItem('history');
    
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addToFavorites = (product: Product) => {
    const newFavorites = [...favorites.filter(p => p.code !== product.code), product];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (code: string) => {
    const newFavorites = favorites.filter(p => p.code !== code);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (code: string) => {
    return favorites.some(p => p.code === code);
  };

  const addToHistory = (product: Product) => {
    const entry: HistoryEntry = {
      ...product,
      scannedAt: new Date().toISOString()
    };
    
    const newHistory = [entry, ...history.filter(p => p.code !== product.code)].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('history');
  };

  return {
    favorites,
    history,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToHistory,
    clearHistory
  };
};
