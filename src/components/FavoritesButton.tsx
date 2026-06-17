import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';

interface FavoritesButtonProps {
  animeId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const FavoritesButton = ({ 
  animeId, 
  size = 'md', 
  showLabel = false,
  className = ''
}: FavoritesButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFav = isFavorite(animeId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAnimating(true);
    toggleFavorite(animeId);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-3'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleClick}
      className={`favorite-btn ${isAnimating ? 'active' : ''} ${sizeClasses[size]} rounded-full 
        bg-white/5 backdrop-blur-md border border-white/10
        hover:bg-red-500/10 hover:border-red-500/30
        transition-all duration-300 group
        ${isFav ? 'bg-red-500/10 border-red-500/30' : ''}
        ${className}`}
      aria-label={isFav ? '取消收藏' : '收藏'}
    >
      <Heart
        className={`${iconSizes[size]} transition-all duration-300
          ${isFav 
            ? 'text-red-500 fill-red-500 scale-110' 
            : 'text-museum-textMuted group-hover:text-red-400'
          }`}
      />
      {showLabel && (
        <span className={`ml-2 text-sm font-medium transition-colors duration-300
          ${isFav ? 'text-red-400' : 'text-museum-textMuted group-hover:text-red-400'}`}>
          {isFav ? '已收藏' : '收藏'}
        </span>
      )}
    </button>
  );
};
