import { Mic, Heart, ArrowRight, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Character } from '@/types';
import { useCharacterCollectionStore } from '@/store/useCharacterCollectionStore';
import { useTreasureHuntStore } from '@/store/useTreasureHuntStore';
import { getHiddenCharacterByCharacterId } from '@/data/treasureHunt';
import { cn } from '@/lib/utils';

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
  const { isCharacterHidden, findHiddenCharacter, stats, getRarityColor } = useTreasureHuntStore();
  const collected = isInCollection(character.id);
  const isHidden = isCharacterHidden(character.id);
  const isFound = stats.hiddenCharactersFound.includes(character.id);
  const hiddenInfo = getHiddenCharacterByCharacterId(character.id);

  const handleClick = () => {
    if (isHidden && !isFound) {
      findHiddenCharacter(character.id);
    }
    if (showLink) {
      navigate(`/character/${character.id}`);
    }
  };

  const handleCollectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCollection(character.id);
  };

  const handleFindClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFound) {
      findHiddenCharacter(character.id);
    }
  };

  return (
    <div
      className={cn(
        `group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md 
        border transition-all duration-500 hover-lift
        opacity-0 animate-slide-up stagger-${(index % 4) + 1}`,
        showLink ? 'cursor-pointer' : '',
        isHidden && !isFound
          ? 'border-yellow-500/30 hover:border-yellow-500/60'
          : 'border-white/10 hover:border-white/20',
        isFound && 'border-green-500/30'
      )}
      style={{ animationFillMode: 'forwards' }}
      onClick={handleClick}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={character.image}
          alt={character.name}
          className={cn(
            'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110',
            isHidden && !isFound && 'blur-sm group-hover:blur-none'
          )}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {isHidden && !isFound && (
          <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center z-20">
            <div className="text-center">
              <Search className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-pulse" />
              <span className="text-yellow-400 text-sm font-bold">隐藏角色</span>
            </div>
          </div>
        )}

        {isFound && hiddenInfo && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/30 text-green-400 text-xs font-bold z-20">
            <Star className="w-3 h-3 fill-current" />
            已发现
          </div>
        )}

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

        {isHidden && !isFound && (
          <button
            onClick={handleFindClick}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-yellow-500/30 backdrop-blur-sm 
              border border-yellow-500/50 text-yellow-400 text-sm font-medium
              hover:bg-yellow-500/50 transition-all duration-300 z-30 opacity-0 group-hover:opacity-100"
          >
            点击发现
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          {isHidden && !isFound ? (
            <div>
              <h4 className="font-display text-xl font-bold text-white mb-1 blur-sm group-hover:blur-none">
                ???
              </h4>
              <div className="text-[11px] text-yellow-400 mb-1">
                隐藏角色
              </div>
              <div className="flex items-center gap-1.5 text-yellow-400/60 text-xs">
                <Search className="w-3 h-3" />
                <span>{getRarityColor(hiddenInfo?.rarity || 'common')}</span>
              </div>
            </div>
          ) : (
            <div>
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
          )}
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
        {isHidden && !isFound ? (
          <p className="text-sm text-yellow-400/60 leading-relaxed">
            这是一个隐藏角色！点击卡片发现TA的真实身份，获得额外积分奖励。
          </p>
        ) : (
          <p className="text-sm text-museum-textMuted leading-relaxed line-clamp-3">
            {character.description}
          </p>
        )}
      </div>

      <div
        className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-500"
        style={{
          background: isHidden
            ? 'linear-gradient(to bottom, #fbbf24, #f59e0b, #d97706)'
            : 'linear-gradient(to bottom, #9d4edd, #ff00ff, #ff6b35)',
        }}
      />

      {isFound && hiddenInfo && (
        <div className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-yellow-400 bg-yellow-500/20 rounded-bl-lg">
          +{hiddenInfo.points}
        </div>
      )}
    </div>
  );
};
