import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { AnimeCard } from './AnimeCard';

interface SearchBarProps {
  variant?: 'page' | 'inline';
  autoFocus?: boolean;
}

export const SearchBar = ({ variant = 'page', autoFocus = false }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { 
    query, 
    setQuery, 
    results, 
    isSearching, 
    searchHistory, 
    addToHistory,
    clearHistory 
  } = useSearch();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (query.trim()) {
      setShowSuggestions(true);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToHistory(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    addToHistory(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setShowSuggestions(false);
  };

  const clearQuery = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const containerClasses = variant === 'page' 
    ? 'max-w-2xl mx-auto' 
    : 'w-full max-w-md';

  return (
    <div className={`relative ${containerClasses}`}>
      <form onSubmit={handleSearch}>
        <div 
          className={`relative flex items-center transition-all duration-300
            ${isFocused ? 'scale-[1.02]' : ''}`}
        >
          <div 
            className={`absolute inset-0 rounded-2xl blur-sm transition-opacity duration-300
              ${isFocused ? 'opacity-50' : 'opacity-0'}`}
            style={{
              background: 'linear-gradient(135deg, #ff00ff, #9d4edd, #ff6b35)',
            }}
          />
          <div 
            className={`relative flex items-center w-full bg-museum-card backdrop-blur-xl 
              border rounded-2xl overflow-hidden transition-all duration-300
              ${isFocused 
                ? 'border-80s-primary/50 shadow-lg shadow-80s-primary/20' 
                : 'border-museum-border hover:border-white/20'}`}
          >
            <div className="pl-5">
              <Search className={`w-5 h-5 transition-colors duration-300 
                ${isFocused ? 'text-80s-primary' : 'text-museum-textMuted'}`} 
              />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (query.trim()) setShowSuggestions(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder="搜索动画名称、角色、类型..."
              className="flex-1 px-4 py-4 bg-transparent text-white placeholder:text-museum-textMuted 
                focus:outline-none text-base"
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="p-2 mr-2 text-museum-textMuted hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="h-full px-6 py-4 bg-gradient-to-r from-80s-primary to-00s-primary
                text-white font-medium transition-all duration-300
                hover:shadow-lg hover:shadow-80s-primary/30 active:scale-95"
            >
              搜索
            </button>
          </div>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-3 z-50 
          glass-card max-h-96 overflow-y-auto animate-scale-in origin-top">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-80s-primary/30 border-t-80s-primary 
                rounded-full animate-spin mx-auto mb-3" />
              <p className="text-museum-textMuted text-sm">搜索中...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <p className="px-4 py-2 text-xs text-museum-textMuted font-medium">
                找到 {results.length} 个结果
              </p>
              <div className="space-y-1">
                {results.slice(0, 5).map((anime) => (
                  <AnimeCard 
                    key={anime.id} 
                    anime={anime} 
                    variant="search" 
                    showFavorite={false}
                  />
                ))}
              </div>
              {results.length > 5 && (
                <button
                  onClick={handleSearch}
                  className="w-full px-4 py-3 text-center text-sm text-80s-primary 
                    hover:bg-white/5 rounded-xl transition-colors mt-2"
                >
                  查看全部 {results.length} 个结果 →
                </button>
              )}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center">
              <p className="text-museum-textMuted">没有找到相关动画</p>
              <p className="text-xs text-museum-textMuted/60 mt-1">
                试试其他关键词吧
              </p>
            </div>
          ) : searchHistory.length > 0 ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-museum-textMuted">
                  <Clock className="w-4 h-4" />
                  <span>搜索历史</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    clearHistory();
                  }}
                  className="flex items-center gap-1 text-xs text-museum-textMuted 
                    hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  清空
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleHistoryClick(term)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full 
                      text-sm text-white/80 hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
