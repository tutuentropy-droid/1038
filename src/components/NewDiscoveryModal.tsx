import { useEffect, useState } from 'react';
import { X, Sparkles, Star, Trophy } from 'lucide-react';
import { useTreasureHuntStore } from '@/store/useTreasureHuntStore';
import { cn } from '@/lib/utils';

export const NewDiscoveryModal = () => {
  const { showNewDiscovery, newDiscoveryData, closeNewDiscovery } = useTreasureHuntStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showNewDiscovery) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(closeNewDiscovery, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNewDiscovery, closeNewDiscovery]);

  if (!newDiscoveryData) return null;

  const getIcon = () => {
    switch (newDiscoveryData.type) {
      case 'character':
        return <Sparkles className="w-12 h-12 text-80s-primary" />;
      case 'easterEgg':
        return <Star className="w-12 h-12 text-yellow-400" />;
      case 'special':
        return <Trophy className="w-12 h-12 text-purple-400" />;
      case 'achievement':
        return <Trophy className="w-12 h-12 text-yellow-400" />;
      case 'quest':
        return <Trophy className="w-12 h-12 text-green-400" />;
      default:
        return <Sparkles className="w-12 h-12" />;
    }
  };

  const getTypeLabel = () => {
    switch (newDiscoveryData.type) {
      case 'character':
        return '发现隐藏角色';
      case 'easterEgg':
        return '发现彩蛋';
      case 'special':
        return '获得特殊藏品';
      case 'achievement':
        return '解锁成就';
      case 'quest':
        return '完成任务';
      default:
        return '新发现';
    }
  };

  const getBorderColor = () => {
    switch (newDiscoveryData.type) {
      case 'character':
        return 'border-80s-primary';
      case 'easterEgg':
        return 'border-yellow-400';
      case 'special':
        return 'border-purple-400';
      case 'achievement':
        return 'border-yellow-400';
      case 'quest':
        return 'border-green-400';
      default:
        return 'border-white';
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div
        className={cn(
          'glass-card p-8 max-w-md w-full mx-4 border-2 transform transition-all duration-500',
          getBorderColor(),
          isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'
        )}
      >
        <div className="absolute top-4 right-4 pointer-events-auto">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(closeNewDiscovery, 300);
            }}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-museum-textMuted" />
          </button>
        </div>

        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 blur-2xl opacity-50 animate-pulse">
              {getIcon()}
            </div>
            <div className="relative animate-bounce-once">{getIcon()}</div>
          </div>

          <div className="text-sm text-museum-textMuted mb-2 tracking-widest uppercase">
            {getTypeLabel()}
          </div>

          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            {newDiscoveryData.name}
          </h3>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-yellow-400">
              +{newDiscoveryData.points} 积分
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
