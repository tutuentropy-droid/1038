import { useEffect, useState } from 'react';
import { Trophy, Share2, Filter, Star, Target, Gift, Map, Award } from 'lucide-react';
import { useTreasureHuntStore } from '@/store/useTreasureHuntStore';
import { AchievementCard } from '@/components/AchievementCard';
import { ShareCard } from '@/components/ShareCard';
import { achievements } from '@/data/treasureHunt';
import { AchievementRarity, AchievementType } from '@/types';
import { cn } from '@/lib/utils';

export const AchievementCenter = () => {
  const { stats, getUnlockedAchievements, getLockedAchievements } = useTreasureHuntStore();
  const [showShareCard, setShowShareCard] = useState(false);
  const [filterRarity, setFilterRarity] = useState<AchievementRarity | 'all'>('all');
  const [filterType, setFilterType] = useState<AchievementType | 'all'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();

  const getFilteredAchievements = () => {
    let result = achievements;

    if (filterRarity !== 'all') {
      result = result.filter((a) => a.rarity === filterRarity);
    }

    if (filterType !== 'all') {
      result = result.filter((a) => a.type === filterType);
    }

    return result;
  };

  const getProgress = (achievement: typeof achievements[0]) => {
    const req = achievement.requirement;
    switch (req.type) {
      case 'collect_characters':
        if (req.era) {
          return stats.hiddenCharactersFound.filter((id) => {
            const hc = achievements.find((a) => a.id === id);
            return hc?.requirement.era === req.era;
          }).length;
        }
        return stats.hiddenCharactersFound.length;
      case 'find_easter_eggs':
        return stats.easterEggsFound.length;
      case 'complete_quests':
        return stats.completedQuests.length;
      case 'collect_specials':
        return stats.specialCollectionsFound.length;
      case 'visits':
        return stats.visitCount;
      default:
        return 0;
    }
  };

  const rarityFilters: { value: AchievementRarity | 'all'; label: string; color: string }[] = [
    { value: 'all', label: '全部', color: 'text-white' },
    { value: 'bronze', label: '铜', color: 'text-amber-600' },
    { value: 'silver', label: '银', color: 'text-gray-300' },
    { value: 'gold', label: '金', color: 'text-yellow-400' },
    { value: 'platinum', label: '铂金', color: 'text-cyan-300' },
  ];

  const typeFilters: { value: AchievementType | 'all'; label: string; icon: any }[] = [
    { value: 'all', label: '全部', icon: Filter },
    { value: 'collector', label: '收藏', icon: Star },
    { value: 'explorer', label: '探索', icon: Map },
    { value: 'hunter', label: '猎人', icon: Target },
    { value: 'completionist', label: '完成', icon: Award },
    { value: 'special', label: '特殊', icon: Gift },
  ];

  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  const completionRate = Math.round(
    (unlockedAchievements.length / achievements.length) * 100
  );

  return (
    <div className="min-h-screen pt-24 pb-12 page-transition-enter">
      <div className="container px-4">
        <div className="glass-card p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center shadow-lg">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-2">
                    成就中心
                  </h1>
                  <p className="text-museum-textMuted">
                    记录你在博物馆中的每一个里程碑
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowShareCard(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                分享成就
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="font-retro text-4xl font-black text-yellow-400 mb-1">
                  {unlockedAchievements.length}
                </div>
                <div className="text-xs text-museum-textMuted">已解锁</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="font-retro text-4xl font-black text-museum-textMuted mb-1">
                  {lockedAchievements.length}
                </div>
                <div className="text-xs text-museum-textMuted">未解锁</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="font-retro text-4xl font-black text-orange-400 mb-1">
                  {totalPoints}
                </div>
                <div className="text-xs text-museum-textMuted">成就积分</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="font-retro text-4xl font-black bg-gradient-to-r from-80s-primary to-00s-primary bg-clip-text text-transparent mb-1">
                  {completionRate}%
                </div>
                <div className="text-xs text-museum-textMuted">完成度</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-museum-textMuted">总进度</span>
                <span className="text-sm text-white font-medium">
                  {unlockedAchievements.length} / {achievements.length}
                </span>
              </div>
              <div className="h-3 bg-museum-bgLight rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-museum-textMuted" />
              <span className="text-sm text-museum-textMuted">稀有度:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rarityFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterRarity(filter.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    filterRarity === filter.value
                      ? 'bg-white/10 text-white'
                      : 'text-museum-textMuted hover:text-white hover:bg-white/5'
                  )}
                >
                  <span className={filter.color}>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-museum-textMuted" />
              <span className="text-sm text-museum-textMuted">类型:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setFilterType(filter.value)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                      filterType === filter.value
                        ? 'bg-white/10 text-white'
                        : 'text-museum-textMuted hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {unlockedAchievements.length > 0 && (
          <div className="mb-8">
            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              已解锁成就
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredAchievements()
                .filter((a) => unlockedAchievements.some((ua) => ua.id === a.id))
                .map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={true}
                  />
                ))}
            </div>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-museum-textMuted" />
              未解锁成就
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredAchievements()
                .filter((a) => !unlockedAchievements.some((ua) => ua.id === a.id))
                .map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={false}
                    progress={getProgress(achievement)}
                  />
                ))}
            </div>
          </div>
        )}

        {unlockedAchievements.length === 0 && lockedAchievements.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Trophy className="w-16 h-16 text-museum-textMuted mx-auto mb-4" />
            <p className="text-museum-textMuted mb-2">还没有成就数据</p>
            <p className="text-sm text-museum-textMuted/70">
              开始探索博物馆，解锁你的第一个成就吧！
            </p>
          </div>
        )}
      </div>

      {showShareCard && (
        <ShareCard
          playerName="动画爱好者"
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  );
};
