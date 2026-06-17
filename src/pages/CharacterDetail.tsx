import { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Mic,
  Film,
  Vote,
  Swords,
  Trophy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { getCharacterById, getAnimeByCharacterId } from '@/data/characters';
import { useVotingStore } from '@/store/useVotingStore';
import { useCharacterCollectionStore } from '@/store/useCharacterCollectionStore';
import { getCharactersWithVotes } from '@/data/characters';

export const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const character = useMemo(() => (id ? getCharacterById(id) : undefined), [id]);
  const anime = useMemo(
    () => (id ? getAnimeByCharacterId(id) : undefined),
    [id]
  );

  const { vote, canVoteToday, getVotes, getAllVotes } = useVotingStore();
  const { isInCollection, toggleCollection } = useCharacterCollectionStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const canVote = useMemo(() => canVoteToday(), [canVoteToday]);
  const votes = useMemo(() => (id ? getVotes(id) : 0), [id, getVotes]);
  const collected = useMemo(
    () => (id ? isInCollection(id) : false),
    [id, isInCollection]
  );

  const rank = useMemo(() => {
    if (!id) return null;
    const allVotes = getAllVotes();
    const ranked = getCharactersWithVotes(allVotes);
    const found = ranked.find((c) => c.id === id);
    return found?.rank || null;
  }, [id, getAllVotes]);

  const handleVote = () => {
    if (!id || !canVote) return;
    const success = vote(id);
    if (success) {
      // 投票成功后可以添加一些视觉反馈
    }
  };

  if (!character) {
    return (
      <div className="min-h-screen pt-24 pb-16 page-transition-enter">
        <div className="container">
          <div className="text-center py-20">
            <AlertCircle className="w-20 h-20 text-museum-textMuted/20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">角色不存在</h2>
            <p className="text-museum-textMuted mb-8">
              找不到你要查看的角色档案
            </p>
            <Link
              to="/characters"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-80s-primary to-00s-primary text-white font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              返回角色博物馆
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter relative">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, rgba(157, 78, 221, 0.2) 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, rgba(255, 0, 255, 0.15) 0%, transparent 50%)`,
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

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-28">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {rank && rank <= 10 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" />
                    #{rank}
                  </div>
                )}

                <button
                  onClick={() => character.id && toggleCollection(character.id)}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
                    collected
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
                      : 'bg-black/50 backdrop-blur-sm text-white/70 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                  aria-label={collected ? '取消收藏' : '加入收藏'}
                >
                  <Heart
                    className={`w-5 h-5 ${collected ? 'fill-white' : ''}`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="font-display text-3xl font-black text-white mb-2">
                    {character.name}
                  </h1>
                  {character.animeTitle && (
                    <Link
                      to={`/anime/${character.animeId}`}
                      className="inline-flex items-center gap-1.5 text-sm text-80s-primary hover:text-80s-secondary transition-colors"
                    >
                      <Film className="w-4 h-4" />
                      {character.animeTitle}
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-2 text-museum-textMuted text-sm">
                  <Mic className="w-4 h-4" />
                  <span>CV: {character.voiceActor}</span>
                </div>

                <div className="h-px bg-white/10" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Vote className="w-5 h-5 text-80s-primary mx-auto mb-1.5" />
                    <div className="font-retro text-2xl font-black text-white">
                      {votes}
                    </div>
                    <div className="text-xs text-museum-textMuted">人气投票</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1.5" />
                    <div className="font-retro text-2xl font-black text-white">
                      {rank ? `#${rank}` : '-'}
                    </div>
                    <div className="text-xs text-museum-textMuted">当前排名</div>
                  </div>
                </div>

                <button
                  onClick={handleVote}
                  disabled={!canVote}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    canVote
                      ? 'bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary text-white hover:shadow-lg hover:shadow-80s-primary/30 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-white/5 text-museum-textMuted cursor-not-allowed'
                  }`}
                >
                  {canVote ? (
                    <>
                      <Vote className="w-5 h-5" />
                      为TA投票
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      今日已投票
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/characters/battle')}
                  className="w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
                >
                  <Swords className="w-4 h-4" />
                  参与角色PK
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-80s-primary to-00s-primary flex items-center justify-center">
                  <Film className="w-5 h-5 text-white" />
                </div>
                角色档案
              </h2>
              <p className="text-museum-text leading-relaxed text-lg whitespace-pre-line">
                {character.description}
              </p>
            </div>

            {anime && (
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Film className="w-5 h-5 text-white" />
                  </div>
                  出自作品
                </h2>
                <Link
                  to={`/anime/${anime.id}`}
                  className="group flex flex-col sm:flex-row gap-6 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                >
                  <div className="w-32 h-48 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-80s-primary transition-colors">
                      {anime.title}
                    </h3>
                    <p className="text-sm text-museum-textMuted mb-2">
                      {anime.originalTitle} · {anime.year}年 ·{' '}
                      {anime.country}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {anime.genres.slice(0, 4).map((genre) => (
                        <span
                          key={genre}
                          className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-museum-textMuted"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-museum-textMuted line-clamp-2">
                      {anime.description}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {anime && anime.characters.length > 1 && (
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-90s-primary to-red-500 flex items-center justify-center">
                    <Film className="w-5 h-5 text-white" />
                  </div>
                  同作品角色
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {anime.characters
                    .filter((c) => c.id !== character.id)
                    .slice(0, 4)
                    .map((c, index) => {
                      const charWithAnime = {
                        ...c,
                        animeId: anime.id,
                        animeTitle: anime.title,
                      };
                      return (
                        <Link
                          key={c.id}
                          to={`/character/${c.id}`}
                          className="group relative aspect-square rounded-xl overflow-hidden"
                          style={{
                            animationDelay: `${index * 0.1}s`,
                          }}
                        >
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h4 className="font-bold text-white text-sm">
                              {c.name}
                            </h4>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
