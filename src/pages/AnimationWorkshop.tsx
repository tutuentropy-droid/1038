import { useState, useEffect } from 'react';
import {
  Hammer,
  Film,
  Puzzle,
  BookOpen,
  Award,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { ProductionFlow } from '@/components/ProductionFlow';
import { StoryboardPuzzle } from '@/components/StoryboardPuzzle';
import { KnowledgeEncyclopedia } from '@/components/KnowledgeEncyclopedia';
import { BadgeCard } from '@/components/BadgeCard';
import { badges, Badge, badgeRarityColors } from '@/data/workshop';
import { useWorkshopStore } from '@/store/useWorkshopStore';

type TabType = 'production' | 'storyboard' | 'encyclopedia' | 'badges';

export const AnimationWorkshop = () => {
  const [activeTab, setActiveTab] = useState<TabType>('production');
  const [newBadgePopup, setNewBadgePopup] = useState<Badge | null>(null);
  const {
    earnedBadges,
    newBadges,
    dismissNewBadge,
    visitWorkshop,
    hasVisitedWorkshop,
    earnBadge,
  } = useWorkshopStore();

  useEffect(() => {
    if (!hasVisitedWorkshop) {
      visitWorkshop();
      earnBadge('museum-visitor');
      const visitorBadge = badges.find((b) => b.id === 'museum-visitor');
      if (visitorBadge) {
        setNewBadgePopup(visitorBadge);
      }
    }
  }, [hasVisitedWorkshop, visitWorkshop, earnBadge]);

  const handleBadgeEarned = (badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (badge) {
      setNewBadgePopup(badge);
    }
  };

  const closeBadgePopup = () => {
    if (newBadgePopup) {
      dismissNewBadge(newBadgePopup.id);
    }
    setNewBadgePopup(null);
  };

  const tabs = [
    { id: 'production', label: '制作流程', icon: Film, color: 'from-80s-primary to-90s-primary' },
    { id: 'storyboard', label: '分镜互动', icon: Puzzle, color: 'from-90s-primary to-00s-primary' },
    { id: 'encyclopedia', label: '知识百科', icon: BookOpen, color: 'from-00s-primary to-80s-primary' },
    { id: 'badges', label: '我的徽章', icon: Award, color: 'from-yellow-500 to-amber-600' },
  ] as const;

  const badgeCategories = [
    { category: 'production', name: '制作系列' },
    { category: 'knowledge', name: '知识系列' },
    { category: 'achievement', name: '成就系列' },
    { category: 'collection', name: '收藏系列' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter relative">
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-80s-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-00s-primary/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="container">
        <section className="mb-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Hammer className="w-4 h-4 text-90s-primary" />
              <span className="text-sm text-museum-textMuted">动画制作工坊</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary bg-clip-text text-transparent">
                动画制作工坊
              </span>
            </h1>

            <p className="text-lg text-museum-textMuted max-w-2xl mx-auto mb-8">
              深入了解动画制作的奥秘，从分镜到配音，每一步都充满创意与匠心。
              互动体验、知识学习，还有精美徽章等你收集！
            </p>

            <div className="flex items-center justify-center gap-6">
              <div className="glass-card px-6 py-4 text-center">
                <div className="font-retro text-2xl font-black text-80s-primary">
                  {badges.length}
                </div>
                <p className="text-xs text-museum-textMuted mt-1">总徽章数</p>
              </div>
              <div className="glass-card px-6 py-4 text-center">
                <div className="font-retro text-2xl font-black text-90s-primary">
                  {earnedBadges.length}
                </div>
                <p className="text-xs text-museum-textMuted mt-1">已获得</p>
              </div>
              <div className="glass-card px-6 py-4 text-center">
                <div className="font-retro text-2xl font-black text-00s-primary">
                  {Math.round((earnedBadges.length / badges.length) * 100)}%
                </div>
                <p className="text-xs text-museum-textMuted mt-1">完成度</p>
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
                onClick={() => setActiveTab(tab.id as TabType)}
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
                {tab.id === 'badges' && newBadges.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-20 animate-bounce-once">
                    {newBadges.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <section className="mb-12">
          {activeTab === 'production' && <ProductionFlow onBadgeEarned={handleBadgeEarned} />}
          {activeTab === 'storyboard' && <StoryboardPuzzle onBadgeEarned={handleBadgeEarned} />}
          {activeTab === 'encyclopedia' && <KnowledgeEncyclopedia onBadgeEarned={handleBadgeEarned} />}

          {activeTab === 'badges' && (
            <div className="space-y-10">
              <div className="text-center">
                <h2 className="font-display text-3xl font-bold text-white mb-2">
                  我的徽章收藏
                </h2>
                <p className="text-museum-textMuted">
                  完成学习和挑战，收集所有博物馆徽章
                </p>
              </div>

              {badgeCategories.map((cat) => {
                const catBadges = badges.filter((b) => b.category === cat.category);
                const earnedCount = catBadges.filter((b) =>
                  earnedBadges.includes(b.id)
                ).length;

                if (catBadges.length === 0) return null;

                return (
                  <div key={cat.category} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        {cat.name}
                      </h3>
                      <span className="text-sm text-museum-textMuted">
                        {earnedCount} / {catBadges.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                      {catBadges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} size="lg" />
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="glass-card p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  收集进度
                </h3>
                <p className="text-museum-textMuted mb-4">
                  已获得 {earnedBadges.length} / {badges.length} 枚徽章
                </p>
                <div className="w-full max-w-md mx-auto h-3 bg-museum-bgLight rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 transition-all duration-700 shimmer-effect"
                    style={{
                      width: `${(earnedBadges.length / badges.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

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
                  <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-yellow-500/30 animate-bounce-once">
                    <div className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center">
                      <Award
                        className={`w-12 h-12 ${
                          badgeRarityColors[newBadgePopup.rarity]?.text || 'text-yellow-300'
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                    }}
                  />
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-1">
                {newBadgePopup.name}
              </h3>
              <p className="text-museum-textMuted mb-4">{newBadgePopup.description}</p>

              <div className="mb-6">
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${
                    badgeRarityColors[newBadgePopup.rarity]?.border
                  } ${badgeRarityColors[newBadgePopup.rarity]?.text}`}
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
