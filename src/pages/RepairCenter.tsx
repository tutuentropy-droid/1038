import { useState, useEffect } from 'react';
import {
  Wrench,
  Film,
  Sparkles,
  ChevronRight,
  X,
  Award,
  Trophy,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ScratchRepairGame } from '@/components/ScratchRepairGame';
import { FadingRepairGame } from '@/components/FadingRepairGame';
import { FramePuzzleGame } from '@/components/FramePuzzleGame';
import { useRepairStore } from '@/store/useRepairStore';
import {
  repairableAnimations,
  repairBadges,
  badgeRarityColors,
  problemTypeInfo,
  difficultyInfo,
  getBadgeById,
} from '@/data/repairCenter';
import { RepairableAnimation, RepairProblemType, RepairBadge } from '@/types';
import { cn } from '@/lib/utils';

type TabType = 'workshop' | 'badges' | 'history';
type GameType = 'scratch' | 'fading' | 'missing_frame' | null;

export const RepairCenter = () => {
  const [activeTab, setActiveTab] = useState<TabType>('workshop');
  const [selectedAnimation, setSelectedAnimation] = useState<RepairableAnimation | null>(null);
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [isPerfectRun, setIsPerfectRun] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [newBadgePopup, setNewBadgePopup] = useState<RepairBadge | null>(null);
  const [filterEra, setFilterEra] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const {
    stats,
    hasVisitedRepairCenter,
    visitRepairCenter,
    completeRepair,
    dismissNewBadge,
    isBadgeEarned,
    getProgress,
  } = useRepairStore();

  useEffect(() => {
    if (!hasVisitedRepairCenter) {
      visitRepairCenter();
    }
  }, [hasVisitedRepairCenter, visitRepairCenter]);

  useEffect(() => {
    if (stats.newBadges.length > 0 && !newBadgePopup) {
      const badgeId = stats.newBadges[0];
      const badge = getBadgeById(badgeId);
      if (badge) {
        setNewBadgePopup(badge);
      }
    }
  }, [stats.newBadges, newBadgePopup]);

  const progress = getProgress();

  const tabs = [
    { id: 'workshop', label: '修复工坊', icon: Wrench, color: 'from-blue-500 to-cyan-500' },
    { id: 'badges', label: '修复徽章', icon: Award, color: 'from-yellow-500 to-amber-600' },
    { id: 'history', label: '修复记录', icon: Film, color: 'from-purple-500 to-pink-500' },
  ] as const;

  const filteredAnimations = repairableAnimations.filter((anim) => {
    const eraMatch = filterEra === 'all' || anim.era === filterEra;
    const isRepaired = stats.repairedAnimations.includes(anim.id);
    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && !isRepaired) ||
      (filterStatus === 'completed' && isRepaired);
    return eraMatch && statusMatch;
  });

  const startRepair = (animation: RepairableAnimation) => {
    setSelectedAnimation(animation);
    setCurrentProblemIndex(0);
    setEarnedPoints(0);
    setIsPerfectRun(true);
    setShowCompletion(false);
    const firstProblem = animation.currentProblems[0]?.type;
    if (firstProblem) {
      setActiveGame(firstProblem);
    }
  };

  const handleGameComplete = (isPerfect: boolean) => {
    if (!selectedAnimation) return;

    if (!isPerfect) {
      setIsPerfectRun(false);
    }

    const currentProblem = selectedAnimation.currentProblems[currentProblemIndex];
    if (currentProblem) {
      setEarnedPoints((prev) => prev + currentProblem.points);
    }

    if (currentProblemIndex < selectedAnimation.currentProblems.length - 1) {
      setCurrentProblemIndex((prev) => prev + 1);
      const nextProblem = selectedAnimation.currentProblems[currentProblemIndex + 1]?.type;
      if (nextProblem) {
        setActiveGame(nextProblem);
      }
    } else {
      const totalPoints = earnedPoints + (currentProblem?.points || 0);
      const bonusPoints = isPerfectRun && isPerfect ? Math.floor(totalPoints * 0.5) : 0;
      const finalPoints = totalPoints + bonusPoints;

      completeRepair(
        selectedAnimation.id,
        selectedAnimation.currentProblems.map((p) => p.type),
        isPerfectRun && isPerfect,
        finalPoints
      );

      setEarnedPoints(finalPoints);
      setActiveGame(null);
      setShowCompletion(true);
    }
  };

  const closeGame = () => {
    setActiveGame(null);
    setSelectedAnimation(null);
    setShowCompletion(false);
  };

  const closeBadgePopup = () => {
    if (newBadgePopup) {
      dismissNewBadge(newBadgePopup.id);
    }
    setNewBadgePopup(null);
  };

  const renderActiveGame = () => {
    if (!selectedAnimation || !activeGame) return null;

    const gameProps = {
      imageUrl: selectedAnimation.poster,
      onComplete: handleGameComplete,
      onClose: closeGame,
    };

    if (activeGame === 'scratch') {
      return <ScratchRepairGame {...gameProps} />;
    }
    if (activeGame === 'fading') {
      return <FadingRepairGame {...gameProps} />;
    }
    if (activeGame === 'missing_frame') {
      return <FramePuzzleGame {...gameProps} />;
    }
  };

  const renderWorkshop = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div className="font-display text-2xl font-black text-white">{stats.totalRepairs}</div>
          <div className="text-xs text-museum-textMuted">总修复次数</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div className="font-display text-2xl font-black text-yellow-400">{stats.totalPoints}</div>
          <div className="text-xs text-museum-textMuted">总积分</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="font-display text-2xl font-black text-green-400">{stats.perfectRepairs}</div>
          <div className="text-xs text-museum-textMuted">完美修复</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div className="font-display text-2xl font-black text-orange-400">{stats.currentStreak}</div>
          <div className="text-xs text-museum-textMuted">连续修复天数</div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            修复进度
          </h3>
          <span className="text-sm text-museum-textMuted">
            {progress.repaired} / {progress.total} 部动画已修复
          </span>
        </div>
        <div className="w-full h-3 bg-museum-bgLight rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 transition-all duration-700 shimmer-effect"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-museum-textMuted">年代:</span>
          {['all', '80s', '90s', '00s'].map((era) => (
            <button
              key={era}
              onClick={() => setFilterEra(era)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-all',
                filterEra === era
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-museum-textMuted hover:bg-white/10'
              )}
            >
              {era === 'all' ? '全部' : era === '80s' ? '80年代' : era === '90s' ? '90年代' : '00年代'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-museum-textMuted">状态:</span>
          {['all', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-all',
                filterStatus === status
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-museum-textMuted hover:bg-white/10'
              )}
            >
              {status === 'all' ? '全部' : status === 'pending' ? '待修复' : '已完成'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimations.map((animation) => {
          const isRepaired = stats.repairedAnimations.includes(animation.id);
          const diffInfo = difficultyInfo[animation.difficulty];

          return (
            <div
              key={animation.id}
              className={cn(
                'glass-card overflow-hidden group transition-all duration-300 hover:scale-[1.02]',
                isRepaired && 'ring-2 ring-green-500/50'
              )}
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={animation.poster}
                  alt={animation.title}
                  className={cn(
                    'w-full h-full object-cover transition-all duration-300',
                    isRepaired ? 'grayscale-0' : 'grayscale-[30%]'
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${diffInfo.color}30`,
                      color: diffInfo.color,
                    }}
                  >
                    {diffInfo.icon} {diffInfo.name}
                  </span>
                  {isRepaired && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/30 text-green-400 font-medium">
                      ✓ 已修复
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `var(--era-${animation.era}-color)`,
                        color: 'white',
                      }}
                    >
                      {animation.year}
                    </span>
                    <span className="text-xs text-museum-textMuted">
                      {animation.era === '80s' ? '80年代' : animation.era === '90s' ? '90年代' : '00年代'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">
                    {animation.title}
                  </h3>
                  <p className="text-xs text-museum-textMuted mb-3">
                    {animation.originalTitle}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    {animation.currentProblems.map((problem) => {
                      const info = problemTypeInfo[problem.type];
                      return (
                        <div
                          key={problem.id}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: `${info.color}20`,
                            color: info.color,
                          }}
                        >
                          <span>{info.icon}</span>
                          <span>{info.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-yellow-400 font-bold">+{animation.basePoints}</span>
                      <span className="text-museum-textMuted"> 基础积分</span>
                    </div>
                    <button
                      onClick={() => startRepair(animation)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium hover:from-blue-400 hover:to-cyan-400 transition-all flex items-center gap-2 group-hover:scale-105"
                    >
                      {isRepaired ? (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          重新修复
                        </>
                      ) : (
                        <>
                          开始修复
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAnimations.length === 0 && (
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 mx-auto text-museum-textMuted mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">没有找到符合条件的动画</h3>
          <p className="text-museum-textMuted">试试调整筛选条件</p>
        </div>
      )}
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-white mb-2">修复徽章收藏</h2>
        <p className="text-museum-textMuted">
          完成修复任务，收集所有修复师专属徽章
        </p>
        <div className="mt-4 text-lg">
          <span className="text-yellow-400 font-bold">{stats.earnedBadges.length}</span>
          <span className="text-museum-textMuted"> / {repairBadges.length} 已获得</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {repairBadges.map((badge) => {
          const earned = isBadgeEarned(badge.id);
          const colors = badgeRarityColors[badge.rarity];

          return (
            <div
              key={badge.id}
              className={cn(
                'glass-card p-6 text-center transition-all duration-300',
                earned ? 'ring-2' : 'opacity-60 grayscale',
                earned && colors.border
              )}
            >
              <div
                className={cn(
                  'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl',
                  earned
                    ? `bg-gradient-to-br ${colors.bg} shadow-lg ${colors.glow}`
                    : 'bg-museum-bgLight'
                )}
              >
                {badge.icon}
              </div>
              <h3 className="font-bold text-white mb-1">{badge.name}</h3>
              <p className="text-xs text-museum-textMuted mb-3">{badge.description}</p>
              <div className="flex items-center justify-center gap-2">
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full border',
                    colors.border,
                    colors.text
                  )}
                >
                  {badge.rarity === 'bronze'
                    ? '铜'
                    : badge.rarity === 'silver'
                    ? '银'
                    : badge.rarity === 'gold'
                    ? '金'
                    : '传说'}
                </span>
                <span className="text-xs text-yellow-400">+{badge.points}</span>
              </div>
              {earned && (
                <div className="mt-3 flex items-center justify-center gap-1 text-green-400 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>已获得</span>
                </div>
              )}
              {!earned && (
                <div className="mt-3 text-xs text-museum-textMuted">
                  进度: {Math.min(100, Math.round(
                    (badge.requirement.type === 'repair_count'
                      ? (stats.totalRepairs / badge.requirement.target) * 100
                      : badge.requirement.type === 'repair_type'
                      ? badge.requirement.problemType === 'scratch'
                        ? (stats.scratchRepairs / badge.requirement.target) * 100
                        : badge.requirement.problemType === 'fading'
                        ? (stats.fadingRepairs / badge.requirement.target) * 100
                        : (stats.missingFrameRepairs / badge.requirement.target) * 100
                      : badge.requirement.type === 'perfect_repair'
                      ? (stats.perfectRepairs / badge.requirement.target) * 100
                      : (stats.longestStreak / badge.requirement.target) * 100)
                  ))}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-white mb-2">修复记录</h2>
        <p className="text-museum-textMuted">查看你修复过的所有经典动画</p>
      </div>

      {stats.repairedAnimations.length === 0 ? (
        <div className="text-center py-16">
          <Film className="w-16 h-16 mx-auto text-museum-textMuted mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">还没有修复记录</h3>
          <p className="text-museum-textMuted mb-6">去修复工坊开始你的第一次修复吧！</p>
          <button
            onClick={() => setActiveTab('workshop')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium"
          >
            开始修复
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stats.repairedAnimations.map((animId) => {
            const anim = repairableAnimations.find((a) => a.id === animId);
            if (!anim) return null;

            return (
              <div
                key={anim.id}
                className="glass-card overflow-hidden group hover:scale-105 transition-all"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={anim.poster}
                    alt={anim.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="font-bold text-white text-sm truncate">{anim.title}</h4>
                    <p className="text-xs text-museum-textMuted">{anim.year}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="glass-card p-6 mt-8">
        <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          修复统计
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-museum-textMuted mb-1">划痕修复</div>
            <div className="text-2xl font-bold text-red-400">{stats.scratchRepairs}</div>
          </div>
          <div>
            <div className="text-sm text-museum-textMuted mb-1">褪色修复</div>
            <div className="text-2xl font-bold text-amber-400">{stats.fadingRepairs}</div>
          </div>
          <div>
            <div className="text-sm text-museum-textMuted mb-1">缺帧修复</div>
            <div className="text-2xl font-bold text-purple-400">{stats.missingFrameRepairs}</div>
          </div>
          <div>
            <div className="text-sm text-museum-textMuted mb-1">最长连续天数</div>
            <div className="text-2xl font-bold text-orange-400">{stats.longestStreak} 天</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter relative">
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="container">
        <section className="mb-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-museum-textMuted">动画修复中心</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                动画修复中心
              </span>
            </h1>

            <p className="text-lg text-museum-textMuted max-w-2xl mx-auto mb-8">
              扮演数字修复师，修复那些珍贵的老动画胶片。
              擦拭划痕、校正色彩、补全缺失帧，让经典重现光芒！
            </p>

            <div className="flex items-center justify-center gap-6">
              <div className="glass-card px-6 py-4 text-center">
                <div className="font-retro text-2xl font-black text-cyan-400">
                  {repairableAnimations.length}
                </div>
                <p className="text-xs text-museum-textMuted mt-1">待修复动画</p>
              </div>
              <div className="glass-card px-6 py-4 text-center">
                <div className="font-retro text-2xl font-black text-yellow-400">
                  {repairBadges.length}
                </div>
                <p className="text-xs text-museum-textMuted mt-1">专属徽章</p>
              </div>
              <div className="glass-card px-6 py-4 text-center">
                <div className="font-retro text-2xl font-black text-green-400">
                  3
                </div>
                <p className="text-xs text-museum-textMuted mt-1">修复小游戏</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 
                  flex items-center gap-2 group overflow-hidden
                  ${isActive
                    ? 'text-white shadow-lg'
                    : 'bg-white/5 text-museum-textMuted hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                {isActive && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-90`}
                  />
                )}
                <TabIcon className={`w-5 h-5 relative z-10 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <section className="mb-12">
          {activeTab === 'workshop' && renderWorkshop()}
          {activeTab === 'badges' && renderBadges()}
          {activeTab === 'history' && renderHistory()}
        </section>
      </div>

      {renderActiveGame()}

      {showCompletion && selectedAnimation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 max-w-md w-full text-center animate-scale-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent" />
            
            <button
              onClick={closeGame}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-museum-textMuted hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-bounce-once">
                  <CheckCircle2 className="w-14 h-14 text-white" />
                </div>
              </div>

              <h3 className="font-display text-3xl font-bold text-white mb-2">
                修复完成！
              </h3>
              <p className="text-museum-textMuted mb-4">
                {selectedAnimation.title} 已成功修复
              </p>

              {isPerfectRun && (
                <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold">完美修复！+50% 积分奖励</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              )}

              <div className="glass-card p-4 mb-6">
                <div className="text-4xl font-black text-yellow-400 mb-1">
                  +{earnedPoints}
                </div>
                <div className="text-sm text-museum-textMuted">获得积分</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeGame}
                  className="flex-1 py-3 rounded-xl glass-button"
                >
                  返回工坊
                </button>
                <button
                  onClick={() => startRepair(selectedAnimation)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:from-blue-400 hover:to-cyan-400 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  再次修复
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {newBadgePopup && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeBadgePopup}
        >
          <div
            className="glass-card p-8 max-w-sm w-full text-center animate-scale-in relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent" />

            <button
              onClick={closeBadgePopup}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-museum-textMuted hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10">
              <div className="mb-6">
                <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  恭喜获得新徽章
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="relative inline-block">
                  <div
                    className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br ${badgeRarityColors[newBadgePopup.rarity]?.bg} flex items-center justify-center shadow-2xl ${badgeRarityColors[newBadgePopup.rarity]?.glow} animate-bounce-once text-5xl`}
                  >
                    {newBadgePopup.icon}
                  </div>
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-1">
                {newBadgePopup.name}
              </h3>
              <p className="text-museum-textMuted mb-4">{newBadgePopup.description}</p>

              <div className="mb-6">
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${badgeRarityColors[newBadgePopup.rarity]?.border} ${badgeRarityColors[newBadgePopup.rarity]?.text}`}
                >
                  {newBadgePopup.rarity === 'bronze'
                    ? '铜'
                    : newBadgePopup.rarity === 'silver'
                    ? '银'
                    : newBadgePopup.rarity === 'gold'
                    ? '金'
                    : '传说'}{' '}
                  级徽章
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 text-yellow-400 mb-6">
                <Trophy className="w-4 h-4" />
                <span className="font-bold">+{newBadgePopup.points} 积分</span>
              </div>

              <button
                onClick={closeBadgePopup}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                太棒了！
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
