import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  ArrowLeft,
  Crown,
  Medal,
  Award,
  Vote,
  Heart,
  Swords,
  TrendingUp,
} from 'lucide-react';
import { CharacterWithVotes } from '@/types';
import { getCharactersWithVotes } from '@/data/characters';
import { useVotingStore } from '@/store/useVotingStore';
import { useCharacterCollectionStore } from '@/store/useCharacterCollectionStore';

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        bg: 'bg-gradient-to-br from-yellow-400/20 to-orange-500/10',
        border: 'border-yellow-400/50',
        icon: Crown,
        iconColor: 'text-yellow-400',
        badge: 'from-yellow-400 to-orange-500',
      };
    case 2:
      return {
        bg: 'bg-gradient-to-br from-gray-300/20 to-gray-400/10',
        border: 'border-gray-300/50',
        icon: Medal,
        iconColor: 'text-gray-300',
        badge: 'from-gray-300 to-gray-400',
      };
    case 3:
      return {
        bg: 'bg-gradient-to-br from-orange-600/20 to-amber-700/10',
        border: 'border-orange-600/50',
        icon: Award,
        iconColor: 'text-orange-500',
        badge: 'from-orange-500 to-amber-600',
      };
    default:
      return {
        bg: 'bg-white/5',
        border: 'border-white/10',
        icon: Trophy,
        iconColor: 'text-museum-textMuted',
        badge: 'from-museum-bgLight to-museum-bgLighter',
      };
  }
};

export const CharacterLeaderboard = () => {
  const navigate = useNavigate();
  const { getAllVotes, canVoteToday, vote } = useVotingStore();
  const { isInCollection, toggleCollection } = useCharacterCollectionStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allVotes = useMemo(() => getAllVotes(), [getAllVotes]);
  const rankedCharacters = useMemo(
    () => getCharactersWithVotes(allVotes),
    [allVotes]
  );
  const canVote = useMemo(() => canVoteToday(), [canVoteToday]);

  const totalVotes = useMemo(() => {
    return Object.values(allVotes).reduce((sum, v) => sum + v, 0);
  }, [allVotes]);

  const maxVotes = useMemo(() => {
    return rankedCharacters[0]?.votes || 1;
  }, [rankedCharacters]);

  const handleVote = (characterId: string) => {
    if (!canVote) return;
    vote(characterId);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(255, 200, 0, 0.08) 0%, transparent 50%)',
        }}
      />

      <div className="container relative">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-museum-textMuted hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-museum-textMuted">实时排名</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              人气排行榜
            </span>
          </h1>

          <p className="text-lg text-museum-textMuted max-w-xl mx-auto mb-6">
            为你喜欢的角色投票，支持TA登上人气榜榜首！
          </p>

          <div className="inline-flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-80s-primary" />
              <span className="text-white">
                累计 <span className="font-bold text-80s-primary">{totalVotes}</span> 票
              </span>
            </div>
            {!canVote && (
              <div className="flex items-center gap-2 text-yellow-400/80 text-sm">
                <TrendingUp className="w-4 h-4" />
                今日已投票
              </div>
            )}
          </div>
        </div>

        {rankedCharacters.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12 items-end">
            {[1, 0, 2].map((idx) => {
              const character = rankedCharacters[idx];
              if (!character) return null;
              const rank = idx + 1;
              const actualRank = character.rank || rank;
              const style = getRankStyle(actualRank);
              const RankIcon = style.icon;
              const collected = isInCollection(character.id);

              return (
                <div
                  key={character.id}
                  className={`relative glass-card p-6 border-2 ${style.border} ${
                    actualRank === 1 ? 'md:scale-105 md:-mb-4' : ''
                  }`}
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  {actualRank === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm shadow-lg">
                      👑 人气王
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.badge} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <RankIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-4">
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      <button
                        onClick={() => toggleCollection(character.id)}
                        className={`absolute top-1.5 right-1.5 p-1.5 rounded-full transition-all ${
                          collected
                            ? 'bg-red-500 text-white'
                            : 'bg-black/50 backdrop-blur-sm text-white/70 hover:text-white border border-white/10'
                        }`}
                        aria-label={collected ? '取消收藏' : '加入收藏'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            collected ? 'fill-white' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <Link
                      to={`/character/${character.id}`}
                      className="font-display text-xl font-bold text-white mb-1 hover:text-80s-primary transition-colors"
                    >
                      {character.name}
                    </Link>
                    {character.animeTitle && (
                      <p className="text-xs text-museum-textMuted mb-3">
                        {character.animeTitle}
                      </p>
                    )}
                    <div className="text-3xl font-retro font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {character.votes}
                    </div>
                    <p className="text-xs text-museum-textMuted mt-1">票</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="font-display text-xl font-bold text-white">
              完整排名
            </h2>
          </div>

          <div className="divide-y divide-white/5">
            {rankedCharacters.map((character: CharacterWithVotes, index) => {
              const rank = character.rank || index + 1;
              const style = getRankStyle(rank);
              const RankIcon = style.icon;
              const collected = isInCollection(character.id);
              const votePercent = (character.votes / maxVotes) * 100;

              return (
                <div
                  key={character.id}
                  className={`p-4 md:p-5 transition-all hover:bg-white/5 ${style.bg}`}
                  style={{ animationDelay: `${index * 0.02}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${style.badge} shadow-md`}
                    >
                      {rank <= 3 ? (
                        <RankIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      ) : (
                        <span className="font-retro font-bold text-white text-lg">
                          {rank}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/character/${character.id}`}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 group"
                    >
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/character/${character.id}`}
                        className="font-display text-lg font-bold text-white hover:text-80s-primary transition-colors block truncate"
                      >
                        {character.name}
                      </Link>
                      {character.animeTitle && (
                        <p className="text-xs text-museum-textMuted truncate">
                          {character.animeTitle}
                        </p>
                      )}

                      <div className="mt-2 hidden sm:block">
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary transition-all duration-500"
                            style={{ width: `${votePercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-retro text-2xl font-black text-white">
                        {character.votes}
                      </div>
                      <p className="text-xs text-museum-textMuted">票</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleCollection(character.id)}
                        className={`p-2 rounded-xl transition-all ${
                          collected
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/5 text-museum-textMuted hover:text-white border border-white/10 hover:border-white/20'
                        }`}
                        aria-label={collected ? '取消收藏' : '加入收藏'}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            collected ? 'fill-red-400' : ''
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleVote(character.id)}
                        disabled={!canVote}
                        className={`p-2 rounded-xl transition-all ${
                          canVote
                            ? 'bg-gradient-to-br from-80s-primary to-00s-primary text-white hover:shadow-lg hover:shadow-80s-primary/30 active:scale-95'
                            : 'bg-white/5 text-museum-textMuted cursor-not-allowed'
                        }`}
                        aria-label="投票"
                      >
                        <Vote className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            to="/characters/battle"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold transition-all hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95"
          >
            <Swords className="w-5 h-5" />
            参与角色PK
          </Link>

          <Link
            to="/characters"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            浏览全部角色
          </Link>
        </div>
      </div>
    </div>
  );
};
