import { Link } from 'react-router-dom';
import { Star, Play, MapPin, Calendar } from 'lucide-react';
import { Anime, ERA_INFO } from '@/types';
import { FavoritesButton } from './FavoritesButton';

interface AnimeCardProps {
  anime: Anime;
  index?: number;
  variant?: 'default' | 'compact' | 'search';
  showFavorite?: boolean;
}

export const AnimeCard = ({ 
  anime, 
  index = 0, 
  variant = 'default',
  showFavorite = true 
}: AnimeCardProps) => {
  const eraInfo = ERA_INFO[anime.era];

  if (variant === 'compact') {
    return (
      <Link
        to={`/anime/${anime.id}`}
        className="group flex gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 
          border border-white/5 hover:border-white/10
          transition-all duration-300 hover-lift"
      >
        <div className="relative w-20 h-28 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div 
            className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5"
            style={{ backgroundColor: eraInfo.color }}
          >
            <Calendar className="w-2.5 h-2.5" />
            {anime.year}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60">
            {anime.title}
          </h4>
          <p className="text-xs text-museum-textMuted truncate mt-1">
            {anime.originalTitle}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-white/80">{anime.rating}</span>
            </div>
            <span className="text-xs text-museum-textMuted">{anime.episodes}集</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-museum-textMuted">
            <MapPin className="w-3 h-3" />
            <span>{anime.country}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.animationType.slice(0, 2).map((t) => (
              <span 
                key={t}
                className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/70"
              >
                {t}
              </span>
            ))}
            {anime.genres.slice(0, 2).map((genre) => (
              <span 
                key={genre}
                className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-museum-textMuted"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
        {showFavorite && (
          <FavoritesButton animeId={anime.id} size="sm" />
        )}
      </Link>
    );
  }

  if (variant === 'search') {
    return (
      <Link
        to={`/anime/${anime.id}`}
        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 
          transition-all duration-300"
      >
        <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate">{anime.title}</h4>
          <p className="text-xs text-museum-textMuted truncate">
            {anime.originalTitle} · {anime.year}
          </p>
        </div>
        <div 
          className="px-2 py-1 rounded text-[10px] font-bold"
          style={{ color: eraInfo.color, backgroundColor: `${eraInfo.color}20` }}
        >
          {eraInfo.name}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/anime/${anime.id}`}
      className={`group relative overflow-hidden rounded-2xl hover-lift 
        opacity-0 animate-slide-up stagger-${(index % 8) + 1}
        era-${anime.era}`}
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <div 
            className="px-2 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
            style={{ 
              backgroundColor: eraInfo.color,
              boxShadow: `0 0 15px ${eraInfo.glowColor}`
            }}
          >
            <Calendar className="w-3 h-3" />
            {anime.year}
          </div>
          <div className="px-2 py-1 rounded-full text-[10px] font-medium bg-black/50 backdrop-blur-sm text-white/80 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {anime.country}
          </div>
        </div>

        {showFavorite && (
          <div className="absolute top-3 right-3 z-20">
            <FavoritesButton animeId={anime.id} size="sm" />
          </div>
        )}

        <div className="absolute top-14 left-3 right-3 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {anime.animationType.map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 backdrop-blur-sm text-white"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{anime.rating}</span>
            </div>
            <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white/80">
              {anime.episodes}集
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-white mb-1 line-clamp-1">
            {anime.title}
          </h3>
          <p className="text-xs text-white/60 mb-2">{anime.originalTitle}</p>
          
          <div className="flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
            {anime.genres.slice(0, 3).map((genre) => (
              <span 
                key={genre}
                className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 backdrop-blur-sm text-white/80"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: `${eraInfo.color}30`,
              border: `2px solid ${eraInfo.color}`,
              boxShadow: `0 0 30px ${eraInfo.glowColor}`
            }}
          >
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(90deg, ${eraInfo.color}, transparent, ${eraInfo.color})`,
          boxShadow: `0 0 10px ${eraInfo.glowColor}`
        }}
      />
    </Link>
  );
};
