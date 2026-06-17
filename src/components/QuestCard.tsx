import { Quest, EraType } from '@/types';
import { Target, CheckCircle, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ERA_INFO } from '@/types';

interface QuestCardProps {
  quest: Quest;
}

export const QuestCard = ({ quest }: QuestCardProps) => {
  const progress = Math.min((quest.currentProgress / quest.targetCount) * 100, 100);
  const isCompleted = quest.status === 'completed';

  const getEraColor = (era?: EraType) => {
    if (!era) return 'from-80s-primary via-90s-primary to-00s-primary';
    switch (era) {
      case '80s':
        return 'from-80s-primary via-80s-primary to-80s-primary';
      case '90s':
        return 'from-90s-primary via-90s-primary to-90s-primary';
      case '00s':
        return 'from-00s-primary via-00s-primary to-00s-primary';
      default:
        return 'from-80s-primary via-90s-primary to-00s-primary';
    }
  };

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (quest.status === 'in_progress') {
      return <Target className="w-5 h-5 text-yellow-400" />;
    }
    return <Clock className="w-5 h-5 text-museum-textMuted" />;
  };

  const getStatusText = () => {
    if (isCompleted) return '已完成';
    if (quest.status === 'in_progress') return '进行中';
    return '待开始';
  };

  return (
    <div
      className={cn(
        'glass-card p-6 relative overflow-hidden transition-all duration-300',
        isCompleted
          ? 'border-green-500/30 hover:border-green-500/50'
          : 'hover:border-white/20'
      )}
    >
      {isCompleted && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                {quest.title}
              </h3>
              <p className="text-sm text-museum-textMuted">{quest.description}</p>
            </div>
          </div>
          <span
            className={cn(
              'text-xs px-3 py-1 rounded-full',
              isCompleted
                ? 'bg-green-500/20 text-green-400'
                : quest.status === 'in_progress'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-white/10 text-museum-textMuted'
            )}
          >
            {getStatusText()}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-museum-textMuted">进度</span>
            <span className="text-white font-medium">
              {quest.currentProgress} / {quest.targetCount}
            </span>
          </div>
          <div className="h-2 bg-museum-bgLight rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 bg-gradient-to-r',
                getEraColor(quest.era)
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium">
              +{quest.reward.points} 积分
            </span>
            {quest.reward.badge && (
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                {quest.reward.badge}
              </span>
            )}
          </div>
          {quest.era && (
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                color: ERA_INFO[quest.era].color,
                backgroundColor: `${ERA_INFO[quest.era].color}20`,
              }}
            >
              {ERA_INFO[quest.era].name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
