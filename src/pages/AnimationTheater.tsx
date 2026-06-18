import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Star,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  Sparkles,
  Calendar,
  Users,
  Ticket,
  ArrowRight,
  Heart,
  X,
  ThumbsUp,
  Compass,
  Zap,
} from 'lucide-react';
import { useTheaterStore } from '@/store/useTheaterStore';
import { getWeekFestivals, generateRecommendedRoute, FESTIVAL_THEMES } from '@/data/theater';
import { animes } from '@/data/animes';
import type { FilmFestival, Screening } from '@/types';
import { cn } from '@/lib/utils';

export const AnimationTheater = () => {
  const {
    addRating,
    getRating,
    addComment,
    getComments,
    getUserPreference,
    setRecommendedRoute,
    recommendedRoute,
    attendFestival,
    hasAttended,
    stats,
  } = useTheaterStore();

  const [weekFestivals, setWeekFestivals] = useState<FilmFestival[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    setWeekFestivals(getWeekFestivals());
  }, []);

  const currentFestival = weekFestivals[selectedDayIndex];

  const preference = useMemo(() => getUserPreference(), [getUserPreference, stats]);

  useEffect(() => {
    if (currentFestival && preference.favoriteGenres.length > 0) {
      const route = generateRecommendedRoute(currentFestival, {
        favoriteGenres: preference.favoriteGenres,
        favoriteEras: preference.favoriteEras,
        ratedAnimeIds: preference.ratedAnimeIds,
      });
      setRecommendedRoute(route);
    }
  }, [currentFestival, preference, setRecommendedRoute]);

  useEffect(() => {
    if (currentFestival) {
      attendFestival(currentFestival.id);
    }
  }, [currentFestival, attendFestival]);

  const handleRate = useCallback(() => {
    if (!selectedScreening || !currentFestival || ratingScore === 0) return;
    addRating(selectedScreening.animeId, currentFestival.id, ratingScore);
    setShowRatingModal(false);
    setRatingScore(0);
    setHoverRating(0);
  }, [selectedScreening, currentFestival, ratingScore, addRating]);

  const handleComment = useCallback(() => {
    if (!selectedScreening || !currentFestival || !commentText.trim()) return;
    addComment(
      selectedScreening.animeId,
      currentFestival.id,
      commentText.trim(),
      0,
      commentAuthor.trim() || '匿名观众'
    );
    setCommentText('');
    setCommentAuthor('');
  }, [selectedScreening, currentFestival, commentText, commentAuthor, addComment]);

  const getAnimeForScreening = useCallback(
    (screening: Screening) => {
      return animes.find((a) => a.id === screening.animeId);
    },
    []
  );

  const dayLabels = useMemo(() => {
    const today = new Date();
    return weekFestivals.map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return {
        weekday: i === 0 ? '今天' : i === 1 ? '明天' : weekdays[d.getDay()],
        date: `${d.getMonth() + 1}/${d.getDate()}`,
      };
    });
  }, [weekFestivals]);

  if (weekFestivals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-80s-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden page-transition-enter">
      <div className="absolute inset-0 bg-museum-pattern pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-80s-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-00s-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      <section className="relative pt-24 pb-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 opacity-0 animate-slide-down">
              <Film className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-museum-textMuted">动画大剧院</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black mb-4 opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
              <span className="bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary bg-clip-text text-transparent">
                动画大剧院
              </span>
            </h1>
            <p className="text-lg text-museum-textMuted max-w-2xl mx-auto opacity-0 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards' }}>
              每天不同主题的动画电影节，为你呈现动画世界的璀璨光影
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {weekFestivals.map((festival, index) => (
              <button
                key={festival.id}
                onClick={() => setSelectedDayIndex(index)}
                className={cn(
                  'flex-shrink-0 px-5 py-3 rounded-xl border transition-all duration-300',
                  selectedDayIndex === index
                    ? 'border-white/30 bg-white/10 backdrop-blur-xl scale-105'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                )}
              >
                <div className={cn(
                  'text-xs font-bold mb-1',
                  selectedDayIndex === index ? 'text-white' : 'text-museum-textMuted'
                )}>
                  {dayLabels[index]?.weekday}
                </div>
                <div className={cn(
                  'text-sm',
                  selectedDayIndex === index ? 'text-museum-text' : 'text-museum-textMuted'
                )}>
                  {dayLabels[index]?.date}
                </div>
                {hasAttended(festival.id) && (
                  <div className="flex justify-center mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {currentFestival && (
        <section className="relative px-4 pb-8">
          <div className="container max-w-6xl mx-auto">
            <div
              className="relative rounded-2xl overflow-hidden mb-8 glass-card"
              style={{ background: currentFestival.themeInfo.bgGradient }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
              <img
                src={currentFestival.bannerImage}
                alt={currentFestival.themeInfo.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center p-8">
                <div className="max-w-lg">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
                    <span className="text-2xl">{currentFestival.themeInfo.icon}</span>
                    <span className="text-sm font-bold text-white">
                      {currentFestival.themeInfo.name}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">
                    {currentFestival.description}
                  </p>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{currentFestival.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Film className="w-4 h-4" />
                      <span>{currentFestival.screenings.length}部作品</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ticket className="w-4 h-4" />
                      <span>正在展映</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-white/90 font-display text-lg italic">
                      "{currentFestival.themeInfo.tagline}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                    <Film className="w-6 h-6 text-90s-primary" />
                    今日展映
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRoute(!showRoute)}
                      className={cn(
                        'glass-button px-4 py-2 text-sm flex items-center gap-2 transition-all',
                        showRoute ? 'text-90s-primary border-90s-primary/30' : 'text-museum-textMuted'
                      )}
                    >
                      <Compass className="w-4 h-4" />
                      推荐路线
                    </button>
                  </div>
                </div>

                {showRoute && recommendedRoute && recommendedRoute.stops.length > 0 && (
                  <div className="glass-card p-5 mb-4 immersive-glow">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-display text-lg font-bold text-white">为你推荐的影展路线</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-bold">
                        匹配度 {Math.round(recommendedRoute.totalMatchScore)}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-80s-primary via-90s-primary to-00s-primary" />
                      <div className="space-y-4">
                        {recommendedRoute.stops.map((stop, index) => {
                          const anime = animes.find((a) => a.id === stop.animeId);
                          if (!anime) return null;
                          return (
                            <div key={stop.animeId} className="flex items-start gap-4 relative">
                              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-museum-bgLighter border-2 border-80s-primary/50 flex items-center justify-center z-10">
                                <span className="text-sm font-bold text-80s-primary">{stop.order}</span>
                              </div>
                              <div className="flex-1 glass-card p-3 flex items-center gap-3">
                                <img
                                  src={anime.poster}
                                  alt={anime.title}
                                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-white text-sm truncate">{anime.title}</h4>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-80s-primary/20 text-80s-primary flex-shrink-0">
                                      {stop.matchScore}%
                                    </span>
                                  </div>
                                  <p className="text-xs text-museum-textMuted mb-1">{stop.reason}</p>
                                  <div className="flex items-center gap-3 text-xs text-museum-textMuted">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {stop.timeSlot}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" /> {stop.hall}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {preference.favoriteGenres.length === 0 && (
                      <p className="text-xs text-museum-textMuted mt-3 text-center">
                        💡 给作品打分后，推荐路线将更加精准
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentFestival.screenings.map((screening) => {
                    const anime = getAnimeForScreening(screening);
                    if (!anime) return null;
                    const existingRating = getRating(anime.id, currentFestival.id);
                    const occupancy = Math.round((screening.reservedSeats / screening.seatCount) * 100);

                    return (
                      <div
                        key={screening.id}
                        className="glass-card overflow-hidden hover-lift group cursor-pointer"
                        style={{
                          borderLeft: `3px solid ${currentFestival.themeInfo.color}`,
                        }}
                        onClick={() => {
                          setSelectedScreening(screening);
                        }}
                      >
                        <div className="flex">
                          <img
                            src={anime.poster}
                            alt={anime.title}
                            className="w-28 h-40 object-cover flex-shrink-0"
                          />
                          <div className="flex-1 p-4 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-white text-sm leading-tight truncate pr-2 group-hover:text-90s-primary transition-colors">
                                {anime.title}
                              </h3>
                              {existingRating && (
                                <div className="flex items-center gap-0.5 flex-shrink-0">
                                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                  <span className="text-xs text-yellow-400 font-bold">{existingRating.score}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {anime.genres.slice(0, 3).map((g) => (
                                <span
                                  key={g}
                                  className="text-[10px] px-1.5 py-0.5 rounded-full border border-white/10 text-museum-textMuted"
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-museum-textMuted mb-2">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {screening.timeSlot}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {screening.hall}
                              </span>
                            </div>
                            <div className="mb-2">
                              <div className="flex items-center justify-between text-[10px] text-museum-textMuted mb-1">
                                <span>座位</span>
                                <span>{occupancy}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all',
                                    occupancy > 80 ? 'bg-red-400' : occupancy > 50 ? 'bg-yellow-400' : 'bg-green-400'
                                  )}
                                  style={{ width: `${occupancy}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/anime/${anime.id}`}
                                className="text-xs text-80s-primary hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                详情 <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-5">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-00s-primary" />
                    我的影展数据
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-museum-textMuted">评分次数</span>
                      <span className="text-sm font-bold text-white">{stats.totalRatings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-museum-textMuted">评论次数</span>
                      <span className="text-sm font-bold text-white">{stats.totalComments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-museum-textMuted">参加影展</span>
                      <span className="text-sm font-bold text-white">{stats.festivalsAttended.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-museum-textMuted">平均评分</span>
                      <span className="text-sm font-bold text-yellow-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        {stats.averageRatingGiven || '-'}
                      </span>
                    </div>
                  </div>

                  {stats.topGenres.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-xs text-museum-textMuted mb-2">喜好类型</p>
                      <div className="flex flex-wrap gap-1">
                        {stats.topGenres.map((genre) => (
                          <span
                            key={genre}
                            className="text-xs px-2 py-0.5 rounded-full bg-80s-primary/10 text-80s-primary border border-80s-primary/20"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-90s-primary" />
                    本周影展
                  </h3>
                  <div className="space-y-2">
                    {weekFestivals.map((festival, index) => (
                      <button
                        key={festival.id}
                        onClick={() => setSelectedDayIndex(index)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2',
                          selectedDayIndex === index
                            ? 'bg-white/10 border border-white/10'
                            : 'hover:bg-white/5'
                        )}
                      >
                        <span className="text-lg">{festival.themeInfo.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-xs font-bold truncate',
                            selectedDayIndex === index ? 'text-white' : 'text-museum-textMuted'
                          )}>
                            {festival.themeInfo.name}
                          </p>
                          <p className="text-[10px] text-museum-textMuted">{dayLabels[index]?.date}</p>
                        </div>
                        {selectedDayIndex === index && (
                          <div className="w-1.5 h-1.5 rounded-full bg-90s-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    影展主题一览
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(FESTIVAL_THEMES).map((theme) => (
                      <div
                        key={theme.id}
                        className={cn(
                          'px-2 py-1.5 rounded-lg border transition-all text-center',
                          currentFestival.theme === theme.id
                            ? 'border-white/20 bg-white/10'
                            : 'border-white/5 bg-white/[0.02]'
                        )}
                      >
                        <span className="text-lg block">{theme.icon}</span>
                        <span className={cn(
                          'text-[10px] leading-tight block mt-0.5',
                          currentFestival.theme === theme.id ? 'text-white' : 'text-museum-textMuted'
                        )}>
                          {theme.name.split('·')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedScreening && !showRatingModal && !showCommentsModal && (() => {
        const anime = getAnimeForScreening(selectedScreening);
        if (!anime) return null;
        const existingRating = currentFestival ? getRating(anime.id, currentFestival.id) : undefined;
        const comments = currentFestival ? getComments(anime.id, currentFestival.id) : [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedScreening(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
              className="relative glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedScreening(null)}
                className="absolute top-4 right-4 text-museum-textMuted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-4 mb-4">
                <img src={anime.poster} alt={anime.title} className="w-24 h-32 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-bold text-white mb-1">{anime.title}</h3>
                  <p className="text-xs text-museum-textMuted mb-2">{anime.originalTitle} · {anime.year}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {anime.genres.map((g) => (
                      <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full border border-white/10 text-museum-textMuted">
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-museum-textMuted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedScreening.timeSlot}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selectedScreening.hall}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-museum-textMuted leading-relaxed mb-4 line-clamp-3">{anime.description}</p>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-museum-textMuted">你的评分:</span>
                  {existingRating ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">{existingRating.score}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-museum-textMuted">未评分</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-museum-textMuted">{comments.length}条评论</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRatingModal(true);
                    if (existingRating) setRatingScore(existingRating.score);
                  }}
                  className="flex-1 glass-button py-3 text-sm font-bold flex items-center justify-center gap-2 text-yellow-400 hover:bg-yellow-400/10"
                >
                  <Star className="w-4 h-4" />
                  {existingRating ? '修改评分' : '打分'}
                </button>
                <button
                  onClick={() => setShowCommentsModal(true)}
                  className="flex-1 glass-button py-3 text-sm font-bold flex items-center justify-center gap-2 text-00s-primary hover:bg-00s-primary/10"
                >
                  <MessageSquare className="w-4 h-4" />
                  评论
                </button>
              </div>

              {comments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-sm font-bold text-white">最新评论</h4>
                  {comments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-museum-bgLighter flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-80s-primary">
                          {comment.author.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-white">{comment.author}</span>
                          <span className="text-[10px] text-museum-textMuted">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-museum-textMuted leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length > 3 && (
                    <button
                      onClick={() => setShowCommentsModal(true)}
                      className="text-xs text-80s-primary hover:underline"
                    >
                      查看全部{comments.length}条评论
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {showRatingModal && selectedScreening && currentFestival && (() => {
        const anime = getAnimeForScreening(selectedScreening);
        if (!anime) return null;

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => { setShowRatingModal(false); setRatingScore(0); setHoverRating(0); }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative glass-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setShowRatingModal(false); setRatingScore(0); setHoverRating(0); }} className="absolute top-4 right-4 text-museum-textMuted hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-bold text-white mb-1">为作品打分</h3>
                <p className="text-sm text-museum-textMuted">{anime.title}</p>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    onClick={() => setRatingScore(score)}
                    onMouseEnter={() => setHoverRating(score)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all duration-200 transform"
                  >
                    <Star
                      className={cn(
                        'w-7 h-7 transition-all duration-200',
                        (hoverRating || ratingScore) >= score
                          ? 'text-yellow-400 fill-yellow-400 scale-110'
                          : 'text-white/20 hover:text-yellow-400/50'
                      )}
                    />
                  </button>
                ))}
              </div>

              {(hoverRating || ratingScore) > 0 && (
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-yellow-400">
                    {hoverRating || ratingScore}
                  </span>
                  <span className="text-lg text-museum-textMuted">/10</span>
                  <p className="text-xs text-museum-textMuted mt-1">
                    {(hoverRating || ratingScore) >= 9 ? '神作！永世经典' :
                     (hoverRating || ratingScore) >= 8 ? '优秀！强烈推荐' :
                     (hoverRating || ratingScore) >= 7 ? '不错！值得一看' :
                     (hoverRating || ratingScore) >= 6 ? '还行，中规中矩' :
                     (hoverRating || ratingScore) >= 5 ? '一般般' : '不太推荐'}
                  </p>
                </div>
              )}

              <button
                onClick={handleRate}
                disabled={ratingScore === 0}
                className={cn(
                  'w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2',
                  ratingScore > 0
                    ? 'bg-yellow-400 text-museum-bg hover:bg-yellow-300'
                    : 'bg-white/5 text-museum-textMuted cursor-not-allowed'
                )}
              >
                <Zap className="w-4 h-4" />
                提交评分
              </button>
            </div>
          </div>
        );
      })()}

      {showCommentsModal && selectedScreening && currentFestival && (() => {
        const anime = getAnimeForScreening(selectedScreening);
        if (!anime) return null;
        const comments = getComments(anime.id, currentFestival.id);

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowCommentsModal(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowCommentsModal(false)} className="absolute top-4 right-4 text-museum-textMuted hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h3 className="font-display text-xl font-bold text-white mb-1">评论</h3>
                <p className="text-sm text-museum-textMuted">{anime.title}</p>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="你的昵称（选填）"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-museum-textMuted focus:border-80s-primary/50 focus:outline-none transition-colors"
                />
                <div className="relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="分享你对这部作品的看法..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-museum-textMuted focus:border-80s-primary/50 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className={cn(
                    'w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2',
                    commentText.trim()
                      ? 'bg-00s-primary text-white hover:bg-00s-primary/80'
                      : 'bg-white/5 text-museum-textMuted cursor-not-allowed'
                  )}
                >
                  <Send className="w-4 h-4" />
                  发表评论
                </button>
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-00s-primary" />
                    全部评论 ({comments.length})
                  </h4>
                </div>
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-museum-textMuted mx-auto mb-2 opacity-30" />
                    <p className="text-sm text-museum-textMuted">暂无评论，来做第一个发言的人吧！</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-9 h-9 rounded-full bg-museum-bgLighter flex items-center justify-center flex-shrink-0 border border-white/10">
                          <span className="text-xs font-bold text-80s-primary">
                            {comment.author.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-white">{comment.author}</span>
                            <span className="text-[10px] text-museum-textMuted">
                              {new Date(comment.timestamp).toLocaleString('zh-CN', {
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-museum-textMuted leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
