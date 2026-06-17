import { Mic, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Character } from '@/types';
import { useCharacterCollectionStore } from '@/store/useCharacterCollectionStore';

interface CharacterCardProps {
  character: Character;
  index?: number;
  showCollectionButton?: boolean;
  showLink?: boolean;
}

export const CharacterCard = ({
  character,
  index = 0,
  showCollectionButton = true,
  showLink = true,
}: CharacterCardProps) => {
  const navigate = useNavigate();
  const { isInCollection, toggleCollection } = useCharacterCollectionStore();
  const collected = isInCollection(character.id);

  const handleClick = () => {
    if (showLink) {
      navigate(`/character/${character.id}`);
    }
  };

  const handleCollectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCollection(character.id);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md 
        border border-white/10 hover:border-white/20
        transition-all duration-500 hover-lift
        opacity-0 animate-slide-up stagger-${(index % 4) + 1} ${
        showLink ? 'cursor-pointer' : ''
      }`}
      style={{ animationFillMode: 'forwards' }}
      onClick={handleClick}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {showCollectionButton && (
          <button
            onClick={handleCollectionClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm 
              border border-white/10 hover:border-white/30 transition-all duration-300
              hover:scale-110 z-10"
            aria-label={collected ? '取消收藏' : '加入收藏'}
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                collected
                  ? 'text-red-500 fill-red-500 scale-110'
                  : 'text-white/60 hover:text-white'
              }`}
            />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="font-display text-xl font-bold text-white mb-1">
            {character.name}
          </h4>
          {character.animeTitle && (
            <div className="text-[11px] text-80s-primary mb-1">
              {character.animeTitle}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-white/60 text-xs">
            <Mic className="w-3 h-3" />
            <span>{character.voiceActor}</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {showLink && (
          <div className="absolute top-3 left-3 p-2 rounded-full bg-black/50 backdrop-blur-sm 
            border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-museum-textMuted leading-relaxed line-clamp-3">
          {character.description}
        </p>
      </div>

      <div
        className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-500"
        style={{
          background: 'linear-gradient(to bottom, #9d4edd, #ff00ff, #ff6b35)',
        }}
      />
    </div>
  );
};
