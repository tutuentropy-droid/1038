import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Film, 
  User, 
  Building, 
  Play,
  Quote,
  Tv,
  Heart,
  Globe,
  Tag,
  BookOpen
} from 'lucide-react';
import { getAnimeById, animes } from '@/data/animes';
import { ERA_INFO } from '@/types';
import { CharacterCard } from '@/components/CharacterCard';
import { CharacterRelationGraph } from '@/components/CharacterRelationGraph';
import { AnimeCard } from '@/components/AnimeCard';
import { FavoritesButton } from '@/components/FavoritesButton';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const anime = useMemo(() => getAnimeById(id || ''), [id]);
  const { isFavorite } = useFavoritesStore();
  const isFav = isFavorite(id || '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">动画不存在</h1>
          <Link to="/" className="text-80s-primary hover:underline">
            返回大厅
          </Link>
        </div>
      </div>
    );
  }

  const eraInfo = ERA_INFO[anime.era];

  const relatedAnimes = useMemo(() => {
    return animes
      .filter(a => a.era === anime.era && a.id !== anime.id)
      .slice(0, 4);
  }, [anime.era, anime.id]);

  return (
    <div className={`min-h-screen era-${anime.era} page-transition-enter`}>
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: eraInfo.bgGradient }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-museum-bg via-museum-bg/50 to-transparent" />
        
        <div 
          className="absolute inset-0 opacity-30 blur-3xl"
          style={{ 
            backgroundImage: `url(${anime.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="absolute top-0 left-0 right-0 p-4 pt-24">
          <div className="container">
            <Link 
              to={`/era/${anime.era}`}
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回{eraInfo.name}展区
            </Link>
          </div>
        </div>

        <div className="container relative h-full flex items-end pb-16">
          <div className="grid md:grid-cols-3 gap-8 items-end w-full">
            <div className="hidden md:block opacity-0 animate-slide-left" style={{ animationFillMode: 'forwards' }}>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl max-w-sm">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <div 
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1"
                    style={{ 
                      backgroundColor: eraInfo.color,
                      boxShadow: `0 0 20px ${eraInfo.glowColor}`
                    }}
                  >
                    <Tv className="w-3 h-3" />
                    {eraInfo.name}
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <FavoritesButton animeId={anime.id} size="lg" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-col md:hidden mb-6 opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
                <div className="flex gap-4">
                  <div className="relative w-32 h-44 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <FavoritesButton animeId={anime.id} size="sm" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-white mb-2"
                      style={{ backgroundColor: eraInfo.color }}
                    >
                      <Tv className="w-3 h-3" />
                      {eraInfo.name}
                    </div>
                    <h1 className="font-display text-2xl font-bold text-white line-clamp-2">
                      {anime.title}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
                <div className="hidden md:flex items-center gap-2 mb-4">
                  <div 
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1"
                    style={{ backgroundColor: eraInfo.color }}
                  >
                    <Tv className="w-3 h-3" />
                    {eraInfo.name}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span className="font-bold">{anime.rating}</span>
                  </div>
                  {isFav && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400">
                      <Heart className="w-3 h-3 fill-red-400" />
                      <span className="text-xs font-medium">已收藏</span>
                    </div>
                  )}
                </div>

                <h1 className="hidden md:block font-display text-4xl md:text-5xl font-black text-white mb-2">
                  {anime.title}
                </h1>
                <p className="text-white/60 text-lg mb-4">{anime.originalTitle}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-4 h-4" style={{ color: eraInfo.color }} />
                    <span className="text-sm">{anime.year}年</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Film className="w-4 h-4" style={{ color: eraInfo.color }} />
                    <span className="text-sm">全{anime.episodes}集</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Globe className="w-4 h-4" style={{ color: eraInfo.color }} />
                    <span className="text-sm">{anime.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <User className="w-4 h-4" style={{ color: eraInfo.color }} />
                    <span className="text-sm">{anime.director}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Building className="w-4 h-4" style={{ color: eraInfo.color }} />
                    <span className="text-sm">{anime.studio}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {anime.animationType.map((t) => (
                    <span 
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                  {anime.genres.map((genre) => (
                    <span 
                      key={genre}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${eraInfo.color}20`,
                        color: eraInfo.color,
                        border: `1px solid ${eraInfo.color}30`
                      }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span 
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: eraInfo.color }}
                />
                作品简介
              </h2>
              <div className="glass-card p-6 md:p-8">
                <p className="text-museum-textMuted leading-relaxed text-lg">
                  {anime.description}
                </p>
              </div>
            </section>

            <section className="opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span 
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: eraInfo.color }}
                />
                <BookOpen className="w-5 h-5" style={{ color: eraInfo.color }} />
                制作背景
              </h2>
              <div className="glass-card p-6 md:p-8 relative overflow-hidden">
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: eraInfo.color }}
                />
                <p className="text-museum-textMuted leading-relaxed text-lg relative z-10">
                  {anime.productionBackground}
                </p>
              </div>
            </section>

            {anime.characterRelations.length > 0 && (
              <section className="opacity-0 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards' }}>
                <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span 
                    className="w-1 h-8 rounded-full"
                    style={{ backgroundColor: eraInfo.color }}
                  />
                  角色关系图
                </h2>
                <div className="glass-card p-4 md:p-6">
                  <CharacterRelationGraph 
                    characters={anime.characters}
                    relations={anime.characterRelations}
                    eraColor={eraInfo.color}
                  />
                  <div className="mt-4 flex flex-wrap gap-3 justify-center">
                    {anime.characterRelations.map((rel, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-museum-textMuted">
                        <div 
                          className="w-3 h-0.5 rounded-full"
                          style={{ backgroundColor: rel.color }}
                        />
                        <span>{rel.relation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section className="opacity-0 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards' }}>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span 
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: eraInfo.color }}
                />
                主要角色
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {anime.characters.map((character, index) => (
                  <CharacterCard 
                    key={character.id} 
                    character={character} 
                    index={index}
                  />
                ))}
              </div>
            </section>

            <section className="opacity-0 animate-slide-up stagger-3" style={{ animationFillMode: 'forwards' }}>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span 
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: eraInfo.color }}
                />
                经典片段
              </h2>
              <div className="space-y-4">
                {anime.classicClips.map((clip, index) => (
                  <div 
                    key={clip.id}
                    className="glass-card p-6 hover-lift group"
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: `${eraInfo.color}20`,
                        }}
                      >
                        <Play className="w-5 h-5 ml-0.5" style={{ color: eraInfo.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">{clip.title}</h4>
                          <span 
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `${eraInfo.color}15`,
                              color: eraInfo.color
                            }}
                          >
                            {clip.episode}
                          </span>
                        </div>
                        <p className="text-museum-textMuted text-sm mb-3">
                          {clip.description}
                        </p>
                        <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                          <Quote 
                            className="w-5 h-5 flex-shrink-0 mt-0.5" 
                            style={{ color: eraInfo.color, opacity: 0.5 }}
                          />
                          <p className="text-white/90 italic leading-relaxed">
                            "{clip.quote}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="glass-card p-6 opacity-0 animate-slide-right" style={{ animationFillMode: 'forwards' }}>
                <h3 className="font-display text-lg font-bold text-white mb-4">
                  快速信息
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-museum-textMuted text-sm">评分</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{anime.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-museum-textMuted text-sm">年份</span>
                    <span className="text-white">{anime.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-museum-textMuted text-sm">国家</span>
                    <span className="text-white">{anime.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-museum-textMuted text-sm">集数</span>
                    <span className="text-white">{anime.episodes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-museum-textMuted text-sm">制作公司</span>
                    <span className="text-white">{anime.studio}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-museum-textMuted text-sm">导演</span>
                    <span className="text-white">{anime.director}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-museum-textMuted text-sm">年代</span>
                    <span style={{ color: eraInfo.color }}>{eraInfo.name}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 opacity-0 animate-slide-right stagger-1" style={{ animationFillMode: 'forwards' }}>
                <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" style={{ color: eraInfo.color }} />
                  类型标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {anime.animationType.map((t) => (
                    <span 
                      key={t}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/5 text-white/70 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                  {anime.genres.map((genre) => (
                    <span 
                      key={genre}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${eraInfo.color}15`,
                        color: eraInfo.color,
                      }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {relatedAnimes.length > 0 && (
                <div className="opacity-0 animate-slide-right stagger-2" style={{ animationFillMode: 'forwards' }}>
                  <h3 className="font-display text-lg font-bold text-white mb-4">
                    同年代推荐
                  </h3>
                  <div className="space-y-3">
                    {relatedAnimes.map((a) => (
                      <AnimeCard 
                        key={a.id} 
                        anime={a} 
                        variant="compact"
                        showFavorite={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
