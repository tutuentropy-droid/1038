import { Achievement } from '@/types';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  progress?: number;
}

export const AchievementCard = ({ achievement, isUnlocked, progress = 0 }: AchievementCardProps) => {
  const getRarityBg = () => {
    switch (achievement.rarity) {
      case 'bronze':
        return 'from-amber-900/30 to-amber-700/10 border-amber-600/30';
      case 'silver':
        return 'from-gray-600/30 to-gray-400/10 border-gray-400/30';
      case 'gold':
        return 'from-yellow-700/30 to-yellow-500/10 border-yellow-500/30';
      case 'platinum':
        return 'from-cyan-700/30 to-cyan-500/10 border-cyan-400/30';
      default:
        return 'from-gray-700/30 to-gray-500/10 border-gray-500/30';
    }
  };

  const getRarityGlow = () => {
    switch (achievement.rarity) {
      case 'bronze':
        return 'shadow-amber-500/20';
      case 'silver':
        return 'shadow-gray-400/20';
      case 'gold':
        return 'shadow-yellow-500/30';
      case 'platinum':
        return 'shadow-cyan-400/30';
      default:
        return '';
    }
  };

  const getRarityLabel = () => {
    switch (achievement.rarity) {
      case 'bronze':
        return '铜';
      case 'silver':
        return '银';
      case 'gold':
        return '金';
      case 'platinum':
        return '铂金';
      default:
        return '';
    }
  };

  const progressPercent = Math.min((progress / achievement.requirement.target) * 100, 100);

  return (
    <div
      className={cn(
        'glass-card p-6 relative overflow-hidden transition-all duration-300 bg-gradient-to-br',
        getRarityBg(),
        isUnlocked ? 'opacity-100' : 'opacity-60 grayscale',
        isUnlocked && `hover:shadow-lg ${getRarityGlow()} hover:scale-[1.02]`
      )}
    >
      {isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0',
              isUnlocked ? 'bg-white/10' : 'bg-black/30'
            )}
          >
            {isUnlocked ? achievement.icon : <Lock className="w-8 h-8 text-museum-textMuted" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-lg font-bold text-white truncate">
                {achievement.name}
              </h3>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  achievement.rarity === 'bronze' && 'bg-amber-600/30 text-amber-400',
                  achievement.rarity === 'silver' && 'bg-gray-400/30 text-gray-300',
                  achievement.rarity === 'gold' && 'bg-yellow-500/30 text-yellow-400',
                  achievement.rarity === 'platinum' && 'bg-cyan-400/30 text-cyan-300'
                )}
              >
                {getRarityLabel()}
              </span>
            </div>

            <p className="text-sm text-museum-textMuted mb-3 line-clamp-2">
              {achievement.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!isUnlocked && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-museum-textMuted">进度</span>
                      <span className="text-white">
                        {progress} / {achievement.requirement.target}
                      </span>
                    </div>
                    <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-80s-primary to-00s-primary rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
                {isUnlocked && (
                  <span className="text-xs text-museum-textMuted">
                    已解锁
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-yellow-400">
                +{achievement.points}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
