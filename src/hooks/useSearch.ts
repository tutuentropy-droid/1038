import { useState, useCallback, useEffect } from 'react';
import { Anime, EraType } from '@/types';
import { searchAnimes } from '@/data/animes';

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: Anime[];
  isSearching: boolean;
  filterByEra: EraType | 'all';
  setFilterByEra: (era: EraType | 'all') => void;
  clearSearch: () => void;
  searchHistory: string[];
  addToHistory: (term: string) => void;
  clearHistory: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Anime[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [filterByEra, setFilterByEra] = useState<EraType | 'all'>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('anime-museum-search-history');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch {
        setSearchHistory([]);
      }
    }
  }, []);

  const performSearch = useCallback(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    const timer = setTimeout(() => {
      let searchResults = searchAnimes(query);
      
      if (filterByEra !== 'all') {
        searchResults = searchResults.filter(anime => anime.era === filterByEra);
      }
      
      setResults(searchResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filterByEra]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setFilterByEra('all');
  }, []);

  const addToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== term);
      const newHistory = [term, ...filtered].slice(0, 10);
      localStorage.setItem('anime-museum-search-history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('anime-museum-search-history');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    filterByEra,
    setFilterByEra,
    clearSearch,
    searchHistory,
    addToHistory,
    clearHistory
  };
};
