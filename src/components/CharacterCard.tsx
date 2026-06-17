import { Mic } from 'lucide-react';
import { Character } from '@/types';

interface CharacterCardProps {
  character: Character;
  index?: number;
}

export const CharacterCard = ({ character, index = 0 }: CharacterCardProps) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md 
        border border-white/10 hover:border-white/20
        transition-all duration-500 hover-lift
        opacity-0 animate-slide-up stagger-${(index % 4) + 1}"
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="font-display text-xl font-bold text-white mb-1">
            {character.name}
          </h4>
          <div className="flex items-center gap-1.5 text-white/60 text-xs">
            <Mic className="w-3 h-3" />
            <span>{character.voiceActor}</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4">
        <p className="text-sm text-museum-textMuted leading-relaxed line-clamp-3">
          {character.description}
        </p>
      </div>

      <div 
        className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-500"
        style={{ 
          background: 'linear-gradient(to bottom, #9d4edd, #ff00ff, #ff6b35)'
        }}
      />
    </div>
  );
};
