import { SpecialCollection } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, Sparkles, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SpecialCollectionCardProps {
  special: SpecialCollection;
  isCollected: boolean;
  onCollect: () => void;
}

export const SpecialCollectionCard = ({
  special,
  isCollected,
  onCollect,
}: SpecialCollectionCardProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = Date.now();
      const diff = special.expireAt - now;

      if (diff <= 0) {
        setTimeLeft('已过期');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}时${minutes}分`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}分${seconds}秒`);
      } else {
        setTimeLeft(`${seconds}秒`);
      }
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [special.expireAt]);

  const getRarityStyles = () => {
    switch (special.rarity) {
      case 'common':
        return {
          border: 'border-gray-500/30',
          glow: 'shadow-gray-500/20',
          badge: 'bg-gray-500/20 text-gray-400',
          gradient: 'from-gray-600/20 to-gray-800/20',
        };
      case 'rare':
        return {
          border: 'border-blue-500/30',
          glow: 'shadow-blue-500/30',
          badge: 'bg-blue-500/20 text-blue-400',
          gradient: 'from-blue-600/20 to-blue-800/20',
        };
      case 'epic':
        return {
          border: 'border-purple-500/30',
          glow: 'shadow-purple-500/30',
          badge: 'bg-purple-500/20 text-purple-400',
          gradient: 'from-purple-600/20 to-purple-800/20',
        };
      case 'legendary':
        return {
          border: 'border-yellow-500/30',
          glow: 'shadow-yellow-500/40',
          badge: 'bg-yellow-500/20 text-yellow-400',
          gradient: 'from-yellow-600/20 to-orange-800/20',
        };
      default:
        return {
          border: 'border-gray-500/30',
          glow: '',
          badge: 'bg-gray-500/20 text-gray-400',
          gradient: 'from-gray-600/20 to-gray-800/20',
        };
    }
  };

  const getRarityLabel = () => {
    switch (special.rarity) {
      case 'common':
        return '普通';
      case 'rare':
        return '稀有';
      case 'epic':
        return '史诗';
      case 'legendary':
        return '传说';
      default:
        return '';
    }
  };

  const styles = getRarityStyles();
  const isExpired = special.expireAt < Date.now();

  return (
    <div
      className={cn(
        'glass-card p-4 relative overflow-hidden bg-gradient-to-br transition-all duration-300 group',
        styles.gradient,
        styles.border,
        !isCollected && !isExpired && `hover:shadow-lg ${styles.glow} hover:scale-[1.02] cursor-pointer`,
        (isCollected || isExpired) && 'opacity-60'
      )}
      onClick={() => !isCollected && !isExpired && onCollect()}
    >
      {special.rarity === 'legendary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 animate-shimmer pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="flex gap-4">
          <div className="relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={special.image}
              alt={special.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute top-2 left-2">
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', styles.badge)}>
                {getRarityLabel()}
              </span>
            </div>

            {isCollected && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-1 fill-yellow-400" />
                  <span className="text-xs text-white font-medium">已收集</span>
                </div>
              </div>
            )}

            {isExpired && !isCollected && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-xs text-museum-textMuted">已过期</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="font-display text-base font-bold text-white mb-1 truncate">
              {special.name}
            </h3>
            <p className="text-xs text-museum-textMuted mb-3 line-clamp-2">
              {special.description}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-museum-textMuted">
                <Clock className="w-3 h-3" />
                <span>{timeLeft}</span>
              </div>

              <div className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                <Sparkles className="w-3 h-3" />
                +{special.points}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
