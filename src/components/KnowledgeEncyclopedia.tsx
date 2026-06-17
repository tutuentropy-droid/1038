import { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Search,
  Tag,
  Quote,
  Lightbulb,
  Star,
  ChevronRight,
  BookMarked,
  History,
} from 'lucide-react';
import {
  animeTerms,
  AnimeTerm,
  historyEvents,
  HistoryEvent,
} from '@/data/workshop';
import { useWorkshopStore } from '@/store/useWorkshopStore';

type TabType = 'terms' | 'history';
type TermCategory = '全部' | '技术' | '行业' | '文化';

interface KnowledgeEncyclopediaProps {
  onBadgeEarned?: (badgeId: string) => void;
}

export const KnowledgeEncyclopedia = ({ onBadgeEarned }: KnowledgeEncyclopediaProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('terms');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TermCategory>('全部');
  const [selectedTerm, setSelectedTerm] = useState<AnimeTerm | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const { markTermLearned, markHistoryLearned, learnedTerms, learnedHistory, earnBadge } =
    useWorkshopStore();

  const categories: TermCategory[] = ['全部', '技术', '行业', '文化'];

  const filteredTerms = animeTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.reading.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === '全部' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedEvents = [...historyEvents].sort((a, b) => a.year - b.year);

  const handleTermClick = (term: AnimeTerm) => {
    setSelectedTerm(term);
    if (!learnedTerms.includes(term.id)) {
      markTermLearned(term.id);
      checkTermBadges();
    }
  };

  const handleEventClick = (event: HistoryEvent) => {
    setSelectedEvent(event);
    if (!learnedHistory.includes(event.id)) {
      markHistoryLearned(event.id);
      checkHistoryBadges();
    }
  };

  const checkTermBadges = () => {
    const newCount = learnedTerms.length + 1;
    if (newCount >= 5 && !learnedTerms.some(() => false)) {
      earnBadge('term-scholar');
      onBadgeEarned?.('term-scholar');
    }
    if (newCount >= animeTerms.length && learnedHistory.length >= historyEvents.length) {
      earnBadge('animation-expert');
      onBadgeEarned?.('animation-expert');
    }
  };

  const checkHistoryBadges = () => {
    const newCount = learnedHistory.length + 1;
    if (newCount >= historyEvents.length) {
      earnBadge('history-buff');
      onBadgeEarned?.('history-buff');
    }
    if (learnedTerms.length >= animeTerms.length && newCount >= historyEvents.length) {
      earnBadge('animation-expert');
      onBadgeEarned?.('animation-expert');
    }
  };

  const categoryColors: Record<string, string> = {
    技术: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    行业: 'bg-green-500/20 text-green-400 border-green-500/30',
    文化: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };

  const getEraColor = (era: string) => {
    switch (era) {
      case '80s':
        return '#ff00ff';
      case '90s':
        return '#ff6b35';
      case '00s':
        return '#9d4edd';
      default:
        return '#ffffff';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <BookOpen className="w-4 h-4 text-00s-primary" />
          <span className="text-sm text-museum-textMuted">动画知识百科</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-white mb-2">
          探索动画的奥秘
        </h2>
        <p className="text-museum-textMuted">
          学习动画术语，了解动画发展史上的重要事件
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'terms'
              ? 'bg-00s-primary/20 text-00s-primary border border-00s-primary/50'
              : 'bg-white/5 text-museum-textMuted border border-transparent hover:bg-white/10 hover:text-white'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          动画术语
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-00s-primary/20 text-00s-primary border border-00s-primary/50'
              : 'bg-white/5 text-museum-textMuted border border-transparent hover:bg-white/10 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          历史事件
        </button>
      </div>

      {activeTab === 'terms' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-museum-textMuted" />
              <input
                type="text"
                placeholder="搜索动画术语..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-museum-textMuted focus:outline-none focus:border-00s-primary/50 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'bg-white/5 text-museum-textMuted border border-transparent hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-museum-textMuted mb-4 flex items-center justify-between">
            <span>
              共 {filteredTerms.length} 个术语 · 已学习{' '}
              <span className="text-white font-bold">{learnedTerms.length}</span> /{' '}
              {animeTerms.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((term, index) => {
              const isLearned = learnedTerms.includes(term.id);
              const isSelected = selectedTerm?.id === term.id;

              return (
                <div
                  key={term.id}
                  onClick={() => handleTermClick(term)}
                  className={`glass-card p-5 cursor-pointer transition-all duration-300 hover:border-white/20 
                    ${isSelected ? 'border-00s-primary/50 ring-1 ring-00s-primary/30' : ''}
                    ${isLearned ? 'border-green-500/20' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        {term.term}
                        {isLearned && (
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        )}
                      </h3>
                      <p className="text-xs text-museum-textMuted font-mono">
                        {term.reading}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        categoryColors[term.category]
                      }`}
                    >
                      {term.category}
                    </span>
                  </div>

                  <p className="text-sm text-museum-textMuted line-clamp-3">
                    {term.definition}
                  </p>

                  {term.example && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-start gap-2">
                        <Quote className="w-3.5 h-3.5 text-80s-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-museum-textMuted italic">
                          「{term.example}」
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-end">
                    <span className="text-xs text-00s-primary flex items-center gap-1">
                      查看详情
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-museum-textMuted/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                没有找到匹配的术语
              </h3>
              <p className="text-museum-textMuted">试试其他关键词或分类</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <>
          <div className="text-sm text-museum-textMuted mb-6 text-center">
            已学习{' '}
            <span className="text-white font-bold">{learnedHistory.length}</span> /{' '}
            {historyEvents.length} 个历史事件
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-80s-primary via-90s-primary to-00s-primary" />

            <div className="space-y-8">
              {sortedEvents.map((event, index) => {
                const isLearned = learnedHistory.includes(event.id);
                const eraColor = getEraColor(event.era);

                return (
                  <div key={event.id} className="relative pl-20">
                    <div
                      className={`absolute left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center 
                        transition-all duration-300 z-10 ${
                          isLearned
                            ? 'scale-110'
                            : 'bg-museum-bg border border-museum-border'
                        }`}
                      style={{
                        backgroundColor: isLearned ? eraColor : undefined,
                        boxShadow: isLearned ? `0 0 20px ${eraColor}50` : undefined,
                      }}
                    >
                      {isLearned ? (
                        <Star className="w-4 h-4 text-white fill-white" />
                      ) : (
                        <span className="text-xs font-bold text-museum-textMuted">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div
                      onClick={() => handleEventClick(event)}
                      className="glass-card p-5 cursor-pointer hover:border-white/20 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div
                            className="font-retro text-2xl font-black mb-1"
                            style={{ color: eraColor }}
                          >
                            {event.year}
                          </div>
                          <h3 className="font-bold text-white text-lg">
                            {event.title}
                          </h3>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full`}
                          style={{
                            backgroundColor: `${eraColor}20`,
                            color: eraColor,
                            border: `1px solid ${eraColor}40`,
                          }}
                        >
                          {event.era === '80s'
                            ? '80年代'
                            : event.era === '90s'
                            ? '90年代'
                            : '2000年代'}
                        </span>
                      </div>

                      <p className="text-sm text-museum-textMuted mb-3">
                        {event.description}
                      </p>

                      <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5">
                        <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-yellow-400 font-medium">
                            历史意义
                          </span>
                          <p className="text-sm text-museum-textMuted mt-1">
                            {event.significance}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-end">
                        <span className="text-xs text-00s-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          了解更多
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {selectedTerm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTerm(null)}
        >
          <div
            className="glass-card p-8 max-w-lg w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-white">
                  {selectedTerm.term}
                </h2>
                <p className="text-museum-textMuted font-mono mt-1">
                  {selectedTerm.reading}
                </p>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded-full border ${
                  categoryColors[selectedTerm.category]
                }`}
              >
                {selectedTerm.category}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-00s-primary" />
                  释义
                </h4>
                <p className="text-museum-textMuted leading-relaxed">
                  {selectedTerm.definition}
                </p>
              </div>

              {selectedTerm.example && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Quote className="w-4 h-4 text-80s-primary" />
                    例句
                  </h4>
                  <p className="text-museum-textMuted italic p-3 bg-white/5 rounded-lg">
                    「{selectedTerm.example}」
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTerm(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="glass-card p-8 max-w-lg w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div
                  className="font-retro text-4xl font-black mb-1"
                  style={{ color: getEraColor(selectedEvent.era) }}
                >
                  {selectedEvent.year}
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  {selectedEvent.title}
                </h2>
              </div>
              <span
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${getEraColor(selectedEvent.era)}20`,
                  color: getEraColor(selectedEvent.era),
                  border: `1px solid ${getEraColor(selectedEvent.era)}40`,
                }}
              >
                {selectedEvent.era === '80s'
                  ? '80年代'
                  : selectedEvent.era === '90s'
                  ? '90年代'
                  : '2000年代'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-90s-primary" />
                  事件简介
                </h4>
                <p className="text-museum-textMuted leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  历史意义
                </h4>
                <p className="text-museum-textMuted leading-relaxed">
                  {selectedEvent.significance}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
