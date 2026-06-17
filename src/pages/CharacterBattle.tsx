import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Swords,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Trophy,
  Heart,
  Vote,
  Check,
} from 'lucide-react';
import { Character } from '@/types';
import { getRandomCharacterPair } from '@/data/characters';
import { useVotingStore } from '@/store/useVotingStore';
import { useCharacterCollectionStore } from '@/store/useCharacterCollectionStore';

export const CharacterBattle = () => {
  const navigate = useNavigate();
  const [pair, setPair] = useState<[Character, Character] | null>(null);
  const [votedId, setVotedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const { vote, canVoteToday, addBattleRecord, getVotes } = useVotingStore();
  const { isInCollection, toggleCollection } = useCharacterCollectionStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    setPair(getRandomCharacterPair());
  }, []);

  const canVote = useMemo(() => canVoteToday(), [canVoteToday]);

  const getNewPair = () => {
    setIsShuffling(true);
    setVotedId(null);
    setShowResult(false);
    setTimeout(() => {
      setPair(getRandomCharacterPair());
      setIsShuffling(false);
    }, 400);
  };

  const handleVote = (character: Character) => {
    if (!pair || votedId || !canVote) return;

    const success = vote(character.id);
    if (success) {
      setVotedId(character.id);
      const loser = pair.find((c) => c.id !== character.id)!;
      addBattleRecord({
        character1Id: pair[0].id,
        character2Id: pair[1].id,
        winnerId: character.id,
        character1Votes: getVotes(pair[0].id),
        character2Votes: getVotes(pair[1].id),
      });

      setTimeout(() => setShowResult(true), 800);
    }
  };

  if (!pair) {
    return (
      <div className="min-h-screen pt-24 pb-16 page-transition-enter flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-80s-primary/30 border-t-80s-primary rounded-full animate-spin" />
      </div>
    );
  }

  const winner = votedId ? pair.find((c) => c.id === votedId) : null;
  const loser = votedId ? pair.find((c) => c.id !== votedId) : null;

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)',
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
            <Swords className="w-4 h-4 text-red-400" />
            <span className="text-sm text-museum-textMuted">人气对决</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-80s-primary bg-clip-text text-transparent">
              角色PK对战
            </span>
          </h1>

          <p className="text-lg text-museum-textMuted max-w-xl mx-auto">
            随机抽取两位经典角色进行人气对决，为你喜欢的角色投票，看看谁才是人气王！
          </p>

          {!canVote && (
            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <Check className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400/80">今日已投票，明天再来吧！</span>
            </div>
          )}
        </div>

        {showResult && winner && loser ? (
          <div className="glass-card p-8 md:p-12 mb-8 animate-scale-in">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
                <Trophy className="w-6 h-6 text-white" />
                <span className="text-white font-bold text-lg">对决结果</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                {winner.name} 获胜！
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {[winner, loser].map((c, idx) => {
                const isWin = idx === 0;
                return (
                  <div
                    key={c.id}
                    className={`relative p-6 rounded-2xl transition-all ${
                      isWin
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border-2 border-yellow-500/50'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {isWin && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold">
                        🏆 获胜
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl font-bold text-white mb-1">
                          {c.name}
                        </h3>
                        {c.animeTitle && (
                          <p className="text-sm text-museum-textMuted mb-2">
                            {c.animeTitle}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-80s-primary">
                          <Vote className="w-4 h-4" />
                          <span className="font-bold">
                            {getVotes(c.id)} 票
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center mb-12">
            {pair.map((character, index) => {
              const isVoted = votedId === character.id;
              const isLeft = index === 0;
              const collected = isInCollection(character.id);

              return (
                <div key={character.id} className="relative">
                  <button
                    onClick={() => handleVote(character)}
                    disabled={!!votedId || !canVote || isShuffling}
                    className={`w-full p-6 rounded-3xl transition-all duration-500 relative group ${
                      isVoted
                        ? isLeft
                          ? 'bg-gradient-to-br from-80s-primary/30 to-00s-primary/20 border-2 border-80s-primary scale-105 shadow-2xl shadow-80s-primary/30'
                          : 'bg-gradient-to-br from-90s-primary/30 to-orange-500/20 border-2 border-90s-primary scale-105 shadow-2xl shadow-90s-primary/30'
                        : votedId
                        ? 'bg-white/5 border border-white/10 opacity-50 scale-95'
                        : canVote && !isShuffling
                        ? 'bg-white/5 border border-white/10 hover:border-white/30 hover:scale-[1.02] hover:bg-white/10 cursor-pointer'
                        : 'bg-white/5 border border-white/10 cursor-not-allowed opacity-70'
                    } ${isShuffling ? 'animate-pulse' : ''}`}
                  >
                    <div
                      className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                        isLeft ? 'bg-gradient-to-br from-80s-primary/10 to-transparent' : 'bg-gradient-to-bl from-90s-primary/10 to-transparent'
                      }`}
                    />

                    <div className="relative">
                      {!votedId && canVote && !isShuffling && (
                        <div
                          className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-white animate-bounce ${
                            isLeft
                              ? 'bg-80s-primary'
                              : 'bg-90s-primary'
                          }`}
                        >
                          点击投票
                        </div>
                      )}

                      <div className="w-full max-w-[320px] mx-auto aspect-square rounded-2xl overflow-hidden mb-5 bg-black/30">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ minHeight: '280px', minWidth: '280px' }}
                        />
                      </div>

                      <div className="text-center">
                        <h3 className="font-display text-2xl font-bold text-white mb-1">
                          {character.name}
                        </h3>
                        {character.animeTitle && (
                          <p className="text-sm text-museum-textMuted mb-3">
                            {character.animeTitle}
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-1 text-80s-primary mb-3">
                          <Vote className="w-4 h-4" />
                          <span className="font-medium">
                            {getVotes(character.id)} 票
                          </span>
                        </div>
                        <p className="text-sm text-museum-textMuted line-clamp-2">
                          {character.description}
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleCollection(character.id)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full transition-all z-10 ${
                      collected
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-black/50 backdrop-blur-sm text-white/70 hover:text-white border border-white/10 hover:border-white/30'
                    }`}
                    aria-label={collected ? '取消收藏' : '加入收藏'}
                  >
                    <Heart
                      className={`w-4 h-4 ${collected ? 'fill-white' : ''}`}
                    />
                  </button>
                </div>
              );
            })}

            <div className="hidden md:flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 via-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-red-500/30 animate-float">
                <Swords className="w-10 h-10 text-white" />
              </div>
              <p className="mt-4 font-display text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                VS
              </p>
            </div>

            <div className="md:hidden flex justify-center col-span-2 my-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Swords className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={getNewPair}
            disabled={isShuffling}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary text-white font-bold transition-all hover:shadow-lg hover:shadow-80s-primary/30 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`}
            />
            换一组对决
          </button>

          <Link
            to="/characters/leaderboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            查看排行榜
          </Link>
        </div>

        <div className="mt-16 glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="font-display text-lg font-bold text-white">
              玩法说明
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-museum-textMuted">
            <li>• 系统随机抽取两位角色进行人气PK对决</li>
            <li>• 点击你喜欢的角色卡片进行投票</li>
            <li>• 每位用户每天可以投票一次</li>
            <li>• 投票结果将实时计入排行榜</li>
            <li>• 点击"换一组对决"可以更换PK角色</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
