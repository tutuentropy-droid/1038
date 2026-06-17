import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Trophy,
  Swords,
  Heart,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { CharacterCard } from '@/components/CharacterCard';
import { SearchBar } from '@/components/SearchBar';
import { getAllCharacters } from '@/data/characters';
import { useVotingStore } from '@/store/useVotingStore';
import { useCharacterCollectionStore } from '@/store/useCharacterCollectionStore';
import { Character } from '@/types';

export const CharacterMuseum = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<'all' | '80s' | '90s' | '00s'>(
    'all'
  );
  const { getAllVotes, canVoteToday } = useVotingStore();
  const { getCollectionCount } = useCharacterCollectionStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allCharacters = useMemo(() => getAllCharacters(), []);
  const allVotes = useMemo(() => getAllVotes(), [getAllVotes]);
  const collectionCount = useMemo(
    () => getCollectionCount(),
    [getCollectionCount]
  );
  const canVote = useMemo(() => canVoteToday(), [canVoteToday]);

  const filteredCharacters = useMemo(() => {
    let result = allCharacters;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.animeTitle && c.animeTitle.toLowerCase().includes(q)) ||
          c.voiceActor.toLowerCase().includes(q)
      );
    }

    if (selectedEra !== 'all') {
      const eraAnimeIds: Record<string, string[]> = {
        '80s': ['doraemon', 'transformers', 'saint-seiya', 'dragon-ball'],
        '90s': ['sailor-moon', 'slam-dunk', 'detective-conan', 'one-piece'],
        '00s': [
          'naruto',
          'bleach',
          'attack-on-titan',
          'demon-slayer',
          'nezha',
          'pleasant-goat',
        ],
      };
      result = result.filter(
        (c) => c.animeId && eraAnimeIds[selectedEra].includes(c.animeId)
      );
    }

    return result;
  }, [allCharacters, searchQuery, selectedEra]);

  const featuredCharacters = useMemo(() => {
    return [...allCharacters]
      .map((c) => ({
        ...c,
        votes: allVotes[c.id] || 0,
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 8);
  }, [allCharacters, allVotes]);

  const totalVotes = useMemo(() => {
    return Object.values(allVotes).reduce((sum, v) => sum + v, 0);
  }, [allVotes]);

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter relative">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-80s-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-00s-primary/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="container">
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-museum-textMuted">角色博物馆</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary bg-clip-text text-transparent">
                经典角色档案
              </span>
            </h1>

            <p className="text-lg text-museum-textMuted max-w-2xl mx-auto mb-10">
              探索每一位经典动画角色的故事，为你喜欢的角色投票，
              参与人气PK，打造专属于你的角色收藏册
            </p>

            <div className="max-w-xl mx-auto mb-8">
              <SearchBar
                variant="page"
                placeholder="搜索角色名称、动画或声优..."
                onSearch={setSearchQuery}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="glass-card p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-80s-primary to-90s-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="font-retro text-3xl font-black text-white mb-1">
                {allCharacters.length}
              </div>
              <p className="text-sm text-museum-textMuted">经典角色</p>
            </div>

            <Link
              to="/characters/leaderboard"
              className="glass-card p-5 text-center hover:border-80s-primary/50 transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="font-retro text-3xl font-black text-white mb-1">
                {totalVotes}
              </div>
              <p className="text-sm text-museum-textMuted">累计投票</p>
            </Link>

            <Link
              to="/characters/battle"
              className="glass-card p-5 text-center hover:border-90s-primary/50 transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Swords className="w-6 h-6 text-white" />
              </div>
              <div className="font-retro text-3xl font-black text-white mb-1">
                PK
              </div>
              <p className="text-sm text-museum-textMuted">角色对战</p>
            </Link>

            <Link
              to="/characters/collection"
              className="glass-card p-5 text-center hover:border-00s-primary/50 transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-00s-primary to-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="font-retro text-3xl font-black text-white mb-1">
                {collectionCount}
              </div>
              <p className="text-sm text-museum-textMuted">我的收藏</p>
            </Link>
          </div>

          {!canVote && (
            <div className="glass-card p-4 mb-8 flex items-center justify-center gap-3 border-yellow-500/30">
              <Search className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-400/80">
                今日已投票，明天再来为喜欢的角色投票吧！
              </span>
            </div>
          )}
        </section>

        {!searchQuery && selectedEra === 'all' && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    人气角色榜
                  </h2>
                  <p className="text-museum-textMuted text-sm">当前最受欢迎的角色</p>
                </div>
              </div>
              <Link
                to="/characters/leaderboard"
                className="flex items-center gap-2 text-80s-primary hover:text-80s-secondary text-sm font-medium transition-colors"
              >
                查看完整排行榜
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {featuredCharacters.map((char: Character, index: number) => (
                <CharacterCard key={char.id} character={char} index={index} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-80s-primary to-00s-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  全部角色
                </h2>
                <p className="text-museum-textMuted text-sm">
                  共 {filteredCharacters.length} 位角色
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(['all', '80s', '90s', '00s'] as const).map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedEra === era
                      ? era === 'all'
                        ? 'bg-gradient-to-r from-80s-primary to-00s-primary text-white'
                        : era === '80s'
                        ? 'bg-80s-primary/20 text-80s-primary border border-80s-primary/50'
                        : era === '90s'
                        ? 'bg-90s-primary/20 text-90s-primary border border-90s-primary/50'
                        : 'bg-00s-primary/20 text-00s-primary border border-00s-primary/50'
                      : 'bg-white/5 text-museum-textMuted hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  {era === 'all'
                    ? '全部'
                    : era === '80s'
                    ? '80年代'
                    : era === '90s'
                    ? '90年代'
                    : '2000年代'}
                </button>
              ))}
            </div>
          </div>

          {filteredCharacters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredCharacters.map((char, index) => (
                <CharacterCard key={char.id} character={char} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-museum-textMuted/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                没有找到匹配的角色
              </h3>
              <p className="text-museum-textMuted">
                试试其他关键词或筛选条件
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
