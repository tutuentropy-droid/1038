import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Film, Star, Tv, Clock } from 'lucide-react';
import { ERA_INFO, EraType } from '@/types';
import { getAnimesByEra } from '@/data/animes';
import { AnimeCard } from '@/components/AnimeCard';

export const EraPage = () => {
  const { eraId } = useParams<{ eraId: string }>();
  const era = ERA_INFO[eraId as EraType];
  const animes = useMemo(() => getAnimesByEra(eraId as EraType), [eraId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eraId]);

  if (!era) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">展区不存在</h1>
          <Link to="/" className="text-80s-primary hover:underline">
            返回大厅
          </Link>
        </div>
      </div>
    );
  }

  const getPatternClass = () => {
    switch (era.pattern) {
      case 'pixel': return 'pixel-pattern';
      case 'watercolor': return 'watercolor-overlay';
      case 'cyber': return 'cyber-grid';
      default: return '';
    }
  };

  const timeline = useMemo(() => {
    return animes
      .sort((a, b) => a.year - b.year)
      .map((anime, index) => ({
        ...anime,
        position: index / (animes.length - 1 || 1) * 100
      }));
  }, [animes]);

  const avgRating = useMemo(() => {
    if (animes.length === 0) return 0;
    return (animes.reduce((sum, a) => sum + a.rating, 0) / animes.length).toFixed(1);
  }, [animes]);

  const totalEpisodes = useMemo(() => {
    return animes.reduce((sum, a) => sum + a.episodes, 0);
  }, [animes]);

  return (
    <div className={`min-h-screen era-${era.id} page-transition-enter`}>
      <div 
        className={`relative h-[50vh] min-h-[400px] ${getPatternClass()} overflow-hidden`}
        style={{ background: era.bgGradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-museum-bg" />
        
        {era.id === '80s' && (
          <>
            <div className="absolute inset-0 crt-effect opacity-30" />
            <div className="absolute inset-0 scanline-overlay" />
          </>
        )}

        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse-slow"
          style={{ backgroundColor: era.color }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
          style={{ backgroundColor: era.color, animationDelay: '1s' }}
        />

        <div className="relative container h-full flex flex-col justify-end pb-12 pt-24">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors opacity-0 animate-slide-down"
            style={{ animationFillMode: 'forwards' }}
          >
            <ArrowLeft className="w-4 h-4" />
            返回博物馆大厅
          </Link>

          <div className="flex items-center gap-3 mb-4 opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: era.color }}
            >
              <Tv className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/60 tracking-widest text-sm">EXHIBITION HALL</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4 opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
            <span 
              className="font-retro text-8xl font-black"
              style={{ color: era.color, textShadow: `0 0 30px ${era.glowColor}` }}
            >
              {era.id === '00s' ? '00' : era.id.replace('s', '')}
              <span className="text-4xl align-top">s</span>
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
              {era.name}
            </h1>
          </div>

          <p className="text-lg text-white/70 max-w-2xl mb-8 opacity-0 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards' }}>
            {era.description}
          </p>

          <div className="flex flex-wrap gap-4 opacity-0 animate-slide-up stagger-3" style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm">
              <Film className="w-4 h-4" style={{ color: era.color }} />
              <span className="text-white/80">{animes.length} 部动画</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white/80">平均 {avgRating} 分</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm">
              <Clock className="w-4 h-4" style={{ color: era.color }} />
              <span className="text-white/80">共 {totalEpisodes.toLocaleString()} 集</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-8 border-b border-museum-border overflow-hidden">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5" style={{ color: era.color }} />
            <h3 className="font-display text-xl font-bold text-white">年代时间轴</h3>
          </div>
          
          <div className="relative">
            <div 
              className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${era.color}30, ${era.color}, ${era.color}30, transparent)`
              }}
            />
            
            <div className="relative flex justify-between px-4">
              {timeline.map((anime, index) => (
                <Link
                  key={anime.id}
                  to={`/anime/${anime.id}`}
                  className="group relative flex flex-col items-center"
                  style={{ left: `${anime.position}%`, transform: 'translateX(-50%)', position: 'absolute' }}
                >
                  <div 
                    className="w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-150"
                    style={{ 
                      backgroundColor: era.color,
                      boxShadow: `0 0 10px ${era.glowColor}`
                    }}
                  />
                  <div className="absolute -bottom-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <div 
                      className="px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
                      style={{ backgroundColor: `${era.color}20`, color: era.color }}
                    >
                      {anime.year} · {anime.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-2">
              展区展品
            </h2>
            <p className="text-museum-textMuted">
              {era.name}的经典动画作品
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {animes.map((anime, index) => (
            <AnimeCard key={anime.id} anime={anime} index={index} />
          ))}
        </div>

        {animes.length === 0 && (
          <div className="text-center py-20">
            <Tv className="w-16 h-16 text-museum-textMuted/30 mx-auto mb-4" />
            <p className="text-museum-textMuted">该展区暂无展品</p>
          </div>
        )}
      </div>
    </div>
  );
};
