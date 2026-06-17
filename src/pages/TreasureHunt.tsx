import { useEffect, useState } from 'react';
import {
  Search,
  Sparkles,
  Trophy,
  Target,
  Star,
  Clock,
  Map,
  RefreshCw,
  Gift,
  ChevronRight,
} from 'lucide-react';
import { useTreasureHuntStore } from '@/store/useTreasureHuntStore';
import { hiddenCharacters, easterEggs } from '@/data/treasureHunt';
import { QuestCard } from '@/components/QuestCard';
import { SpecialCollectionCard } from '@/components/SpecialCollectionCard';
import { ERA_INFO, EraType } from '@/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export const TreasureHunt = () => {
  const {
    stats,
    specialCollections,
    getActiveQuests,
    getCompletedQuests,
    refreshSpecialCollections,
    getHiddenCharactersByEra,
    getFoundHiddenCharactersByEra,
    collectSpecialCollection,
    findEasterEgg,
    isEasterEggFound,
    lastSpecialRefresh,
  } = useTreasureHuntStore();

  const [activeTab, setActiveTab] = useState<'quests' | 'specials' | 'hints'>('quests');
  const [selectedEra, setSelectedEra] = useState<EraType | 'all'>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeQuests = getActiveQuests();
  const completedQuests = getCompletedQuests();

  const totalHiddenByEra = (era: EraType | 'all') => {
    if (era === 'all') return hiddenCharacters.length;
    return getHiddenCharactersByEra(era).length;
  };

  const foundHiddenByEra = (era: EraType | 'all') => {
    if (era === 'all') return stats.hiddenCharactersFound.length;
    return getFoundHiddenCharactersByEra(era).length;
  };

  const getRefreshTimeText = () => {
    const diff = Date.now() - lastSpecialRefresh;
    const sixHours = 6 * 60 * 60 * 1000;
    const remaining = Math.max(0, sixHours - diff);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}时${Math.floor(minutes)}分`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 page-transition-enter">
      <div className="container px-4">
        <div className="glass-card p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-80s-primary/10 via-90s-primary/10 to-00s-primary/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-80s-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-00s-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-80s-primary via-90s-primary to-00s-primary flex items-center justify-center shadow-lg">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-2">
                    寻宝模式
                  </h1>
                  <p className="text-museum-textMuted">
                    在博物馆中探索隐藏的角色、彩蛋和特殊藏品
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="font-retro text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {stats.totalPoints}
                  </div>
                  <div className="text-sm text-museum-textMuted">总积分</div>
                </div>
                <div className="text-center">
                  <div className="font-retro text-4xl font-black text-white">
                    🔥 {stats.currentStreak}
                  </div>
                  <div className="text-sm text-museum-textMuted">连续访问</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Star className="w-5 h-5" />}
                label="隐藏角色"
                value={`${stats.hiddenCharactersFound.length} / ${hiddenCharacters.length}`}
                color="text-80s-primary"
              />
              <StatCard
                icon={<Gift className="w-5 h-5" />}
                label="发现彩蛋"
                value={`${stats.easterEggsFound.length} / ${easterEggs.length}`}
                color="text-yellow-400"
              />
              <StatCard
                icon={<Target className="w-5 h-5" />}
                label="完成任务"
                value={`${completedQuests.length} / ${activeQuests.length + completedQuests.length}`}
                color="text-green-400"
              />
              <StatCard
                icon={<Trophy className="w-5 h-5" />}
                label="特殊藏品"
                value={`${stats.specialCollectionsFound.length}`}
                color="text-purple-400"
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-8">
          <h3 className="font-display text-xl font-bold text-white mb-4">探索进度</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedEra('all')}
              className={cn(
                'px-4 py-2 rounded-xl transition-all duration-300',
                selectedEra === 'all'
                  ? 'bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary text-white'
                  : 'bg-white/5 text-museum-textMuted hover:bg-white/10 hover:text-white'
              )}
            >
              全部
            </button>
            {(['80s', '90s', '00s'] as EraType[]).map((era) => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={cn(
                  'px-4 py-2 rounded-xl transition-all duration-300',
                  selectedEra === era
                    ? 'text-white'
                    : 'text-museum-textMuted hover:text-white'
                )}
                style={{
                  backgroundColor:
                    selectedEra === era ? ERA_INFO[era].color + '30' : undefined,
                  border:
                    selectedEra === era
                      ? `1px solid ${ERA_INFO[era].color}`
                      : '1px solid transparent',
                }}
              >
                {ERA_INFO[era].name} ({foundHiddenByEra(era)}/{totalHiddenByEra(era)})
              </button>
            ))}
          </div>

          {selectedEra !== 'all' && (
            <div className="mt-4 p-4 rounded-xl bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-museum-textMuted text-sm">收集进度</span>
                <span className="text-white text-sm font-medium">
                  {foundHiddenByEra(selectedEra)} / {totalHiddenByEra(selectedEra)}
                </span>
              </div>
              <div className="h-2 bg-museum-bgLight rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(foundHiddenByEra(selectedEra) / totalHiddenByEra(selectedEra)) * 100}%`,
                    backgroundColor: ERA_INFO[selectedEra].color,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: 'quests', label: '任务', icon: Target },
            { id: 'specials', label: '特殊藏品', icon: Gift },
            { id: 'hints', label: '探索提示', icon: Map },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium',
                activeTab === tab.id
                  ? 'bg-white/10 text-white'
                  : 'text-museum-textMuted hover:text-white hover:bg-white/5'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'quests' && activeQuests.length > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-80s-primary/30 text-80s-primary">
                  {activeQuests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'quests' && (
          <div>
            <div className="mb-8">
              <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                进行中的任务
              </h3>
              {activeQuests.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {activeQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <Trophy className="w-12 h-12 text-museum-textMuted mx-auto mb-4" />
                  <p className="text-museum-textMuted">太棒了！所有任务都已完成！</p>
                </div>
              )}
            </div>

            {completedQuests.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-400" />
                  已完成的任务
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {completedQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specials' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-400" />
                限时特殊藏品
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-museum-textMuted flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  下次刷新: {getRefreshTimeText()}
                </span>
                <button
                  onClick={refreshSpecialCollections}
                  className="glass-button px-4 py-2 text-sm flex items-center gap-2 text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  刷新
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialCollections.map((special) => (
                <SpecialCollectionCard
                  key={special.id}
                  special={special}
                  isCollected={stats.specialCollectionsFound.includes(special.id)}
                  onCollect={() => collectSpecialCollection(special.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hints' && (
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Map className="w-5 h-5 text-80s-primary" />
              彩蛋探索提示
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {easterEggs.map((egg) => {
              const isFound = isEasterEggFound(egg.id);
              return (
                <div
                  key={egg.id}
                  className={cn(
                    'glass-card p-6 transition-all duration-300',
                    isFound
                      ? 'border-yellow-500/30'
                      : 'hover:border-white/20 cursor-pointer'
                  )}
                  onClick={() => !isFound && findEasterEgg(egg.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-16 h-16 rounded-xl flex items-center justify-center text-3xl',
                        isFound ? 'bg-yellow-500/20' : 'bg-white/5'
                      )}
                    >
                      {isFound ? '🎉' : '❓'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-bold text-white mb-1">
                        {isFound ? egg.name : '???'}
                      </h4>
                      <p className="text-sm text-museum-textMuted mb-2">
                        {isFound ? egg.description : '还未发现这个彩蛋...'}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-white/10 rounded text-museum-textMuted">
                          {egg.location}
                        </span>
                        {isFound && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                            +{egg.points} 积分
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isFound && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-yellow-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        提示: {egg.hint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        )}

        <div className="mt-12 glass-card p-8">
          <h3 className="font-display text-xl font-bold text-white mb-6">快速导航</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/time-corridor"
              className="glass-button p-4 text-center hover:border-80s-primary/50 transition-colors group"
            >
              <Clock className="w-8 h-8 text-80s-primary mx-auto mb-2" />
              <span className="text-white">时间长廊</span>
            </Link>
            <Link
              to="/characters"
              className="glass-button p-4 text-center hover:border-90s-primary/50 transition-colors group"
            >
              <Target className="w-8 h-8 text-90s-primary mx-auto mb-2" />
              <span className="text-white">角色博物馆</span>
            </Link>
            <Link
              to="/workshop"
              className="glass-button p-4 text-center hover:border-00s-primary/50 transition-colors group"
            >
              <Sparkles className="w-8 h-8 text-00s-primary mx-auto mb-2" />
              <span className="text-white">制作工坊</span>
            </Link>
            <Link
              to="/achievements"
              className="glass-button p-4 text-center hover:border-yellow-500/50 transition-colors group"
            >
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <span className="text-white">成就中心</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => (
  <div className="bg-white/5 rounded-xl p-4 text-center">
    <div className={cn('mb-2 flex justify-center', color)}>{icon}</div>
    <div className="font-display text-2xl font-bold text-white mb-1">
      {value}
    </div>
    <div className="text-xs text-museum-textMuted">{label}</div>
  </div>
);
