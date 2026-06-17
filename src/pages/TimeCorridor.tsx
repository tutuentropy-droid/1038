import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Globe, 
  Tag, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Star,
  MapPin
} from 'lucide-react';
import { animes } from '@/data/animes';
import { ERA_INFO, EraType, AnimationType } from '@/types';

type CountryFilter = 'all' | string;
type EraFilter = 'all' | EraType;
type TypeFilter = 'all' | AnimationType;

export const TimeCorridor = () => {
  const [eraFilter, setEraFilter] = useState<EraFilter>('all');
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const countries = useMemo(() => {
    const set = new Set(animes.map(a => a.country));
    return Array.from(set).sort();
  }, []);

  const allTypes: AnimationType[] = ['TV', '剧场版', 'OVA', 'Web'];

  const filteredAnimes = useMemo(() => {
    return animes
      .filter(a => {
        if (eraFilter !== 'all' && a.era !== eraFilter) return false;
        if (countryFilter !== 'all' && a.country !== countryFilter) return false;
        if (typeFilter !== 'all' && !a.animationType.includes(typeFilter)) return false;
        return true;
      })
      .sort((a, b) => a.year - b.year);
  }, [eraFilter, countryFilter, typeFilter]);

  const timelineNodes = useMemo(() => {
    if (filteredAnimes.length === 0) return [];
    const minYear = filteredAnimes[0].year;
    const maxYear = filteredAnimes[filteredAnimes.length - 1].year;
    const range = maxYear - minYear || 1;
    return filteredAnimes.map(anime => ({
      ...anime,
      position: ((anime.year - minYear) / range) * 100
    }));
  }, [filteredAnimes]);

  const eraOptions = [
    { id: 'all' as const, label: '全部年代', color: '#ffffff' },
    ...Object.values(ERA_INFO).map(era => ({
      id: era.id,
      label: era.name,
      color: era.color
    }))
  ];

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (!timelineRef.current) return;
    const scrollAmount = 400;
    timelineRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const getEraColor = (era: EraType) => ERA_INFO[era].color;
  const getEraGlow = (era: EraType) => ERA_INFO[era].glowColor;

  const clearFilters = () => {
    setEraFilter('all');
    setCountryFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilter = eraFilter !== 'all' || countryFilter !== 'all' || typeFilter !== 'all';

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter">
      <div className="container">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-museum-textMuted hover:text-white mb-8 transition-colors opacity-0 animate-slide-down"
          style={{ animationFillMode: 'forwards' }}
        >
          <ArrowLeft className="w-4 h-4" />
          返回博物馆大厅
        </Link>

        <div className="mb-12 opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-80s-primary via-90s-primary to-00s-primary flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                时间长廊
              </h1>
              <p className="text-museum-textMuted">沿着时间轴，探索动画发展的历史脉络</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-10 opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-80s-primary" />
              <h3 className="font-display text-lg font-bold text-white">筛选展品</h3>
            </div>
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="text-sm text-museum-textMuted hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
              >
                清除筛选
              </button>
            )}
          </div>
          
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-90s-primary" />
                <span className="text-sm text-museum-textMuted font-medium">年代</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {eraOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setEraFilter(option.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${eraFilter === option.id ? 'text-white' : 'text-museum-textMuted hover:text-white hover:bg-white/5'}`}
                    style={{
                      backgroundColor: eraFilter === option.id ? `${option.color}20` : 'transparent',
                      border: eraFilter === option.id ? `1px solid ${option.color}40` : '1px solid rgba(255,255,255,0.1)',
                      color: eraFilter === option.id ? option.color : undefined
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-00s-primary" />
                <span className="text-sm text-museum-textMuted font-medium">国家</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCountryFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${countryFilter === 'all' ? 'text-white' : 'text-museum-textMuted hover:text-white hover:bg-white/5'}`}
                  style={{
                    backgroundColor: countryFilter === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: countryFilter === 'all' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  全部国家
                </button>
                {countries.map(country => (
                  <button
                    key={country}
                    onClick={() => setCountryFilter(country)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${countryFilter === country ? 'text-white' : 'text-museum-textMuted hover:text-white hover:bg-white/5'}`}
                    style={{
                      backgroundColor: countryFilter === country ? 'rgba(157,78,221,0.2)' : 'transparent',
                      border: countryFilter === country ? '1px solid rgba(157,78,221,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      color: countryFilter === country ? '#9d4edd' : undefined
                    }}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-80s-primary" />
                <span className="text-sm text-museum-textMuted font-medium">类型</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${typeFilter === 'all' ? 'text-white' : 'text-museum-textMuted hover:text-white hover:bg-white/5'}`}
                  style={{
                    backgroundColor: typeFilter === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: typeFilter === 'all' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  全部类型
                </button>
                {allTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${typeFilter === type ? 'text-white' : 'text-museum-textMuted hover:text-white hover:bg-white/5'}`}
                    style={{
                      backgroundColor: typeFilter === type ? 'rgba(255,107,53,0.2)' : 'transparent',
                      border: typeFilter === type ? '1px solid rgba(255,107,53,0.3)' : '1px solid rgba(255,255,255,0.1)',
                      color: typeFilter === type ? '#ff6b35' : undefined
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filteredAnimes.length > 0 ? (
          <>
            <div className="relative mb-6 opacity-0 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards' }}>
              <button
                onClick={() => scrollTimeline('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-button flex items-center justify-center text-white hover:text-80s-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollTimeline('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-button flex items-center justify-center text-white hover:text-80s-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="mx-10 overflow-hidden">
                <div 
                  ref={timelineRef}
                  className="overflow-x-auto scrollbar-hide py-8"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="relative" style={{ minWidth: `${Math.max(timelineNodes.length * 220, 800)}px` }}>
                    <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-80s-primary/30 via-90s-primary/30 to-00s-primary/30" />
                      <div className="absolute inset-0 shimmer-effect" />
                    </div>

                    {timelineNodes.map((anime, index) => {
                      const eraColor = getEraColor(anime.era);
                      const eraGlow = getEraGlow(anime.era);
                      const isActive = activeIndex === index;
                      
                      return (
                        <div
                          key={anime.id}
                          className="absolute top-1/2 -translate-y-1/2"
                          style={{ left: `${(index / (timelineNodes.length - 1 || 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(-1)}
                        >
                          <Link
                            to={`/anime/${anime.id}`}
                            className="group relative flex flex-col items-center"
                          >
                            <div 
                              className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-500 z-10
                                ${isActive ? 'scale-125 border-white shadow-2xl' : 'border-transparent group-hover:scale-110 group-hover:border-white/50'}`}
                              style={{
                                boxShadow: isActive 
                                  ? `0 0 30px ${eraGlow}, 0 0 60px ${eraGlow}` 
                                  : `0 0 15px ${eraGlow}`,
                              }}
                            >
                              <img
                                src={anime.poster}
                                alt={anime.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div 
                              className={`absolute w-3 h-3 rounded-full transition-all duration-300 z-20
                                ${isActive ? 'scale-150' : 'group-hover:scale-125'}`}
                              style={{ 
                                backgroundColor: eraColor,
                                boxShadow: `0 0 10px ${eraGlow}`,
                                top: 'calc(50% + 32px)',
                              }}
                            />

                            <div className={`absolute transition-all duration-500 z-30
                              ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}
                              style={{ top: 'calc(50% + 52px)' }}
                            >
                              <div className="glass-card p-3 min-w-[160px] text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <span className="font-retro text-sm font-bold" style={{ color: eraColor }}>
                                    {anime.year}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                                  {anime.title}
                                </h4>
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <MapPin className="w-3 h-3 text-museum-textMuted" />
                                  <span className="text-xs text-museum-textMuted">{anime.country}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1 mb-2">
                                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                  <span className="text-xs text-white/80">{anime.rating}</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-1">
                                  {anime.animationType.map(t => (
                                    <span
                                      key={t}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                                      style={{ backgroundColor: `${eraColor}15`, color: eraColor }}
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div 
                              className={`absolute transition-all duration-500 z-30
                                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}
                              style={{ bottom: 'calc(50% + 36px)' }}
                            >
                              <span 
                                className="px-2 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
                                style={{ backgroundColor: eraColor }}
                              >
                                {anime.year}
                              </span>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 opacity-0 animate-slide-up stagger-3" style={{ animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-5 h-5 text-00s-primary" />
                <h2 className="font-display text-2xl font-bold text-white">
                  展品一览
                </h2>
                <span className="text-museum-textMuted text-sm">共 {filteredAnimes.length} 部</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAnimes.map((anime, index) => {
                  const eraColor = getEraColor(anime.era);
                  const eraGlow = getEraGlow(anime.era);
                  
                  return (
                    <Link
                      key={anime.id}
                      to={`/anime/${anime.id}`}
                      className="group glass-card overflow-hidden hover-lift transition-all duration-500
                        opacity-0 animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={anime.poster}
                          alt={anime.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-museum-bg via-transparent to-transparent" />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: eraColor }}
                          >
                            {anime.year}
                          </span>
                          {anime.animationType.map(t => (
                            <span
                              key={t}
                              className="px-2 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white/80"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60">
                          {anime.title}
                        </h3>
                        <p className="text-xs text-museum-textMuted mb-3">{anime.originalTitle}</p>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" style={{ color: eraColor }} />
                            <span className="text-xs text-museum-textMuted">{anime.country}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-white/80">{anime.rating}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {anime.genres.slice(0, 3).map(genre => (
                            <span
                              key={genre}
                              className="px-2 py-0.5 rounded text-[10px] font-medium"
                              style={{ backgroundColor: `${eraColor}15`, color: eraColor }}
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ 
                          background: `linear-gradient(90deg, ${eraColor}, transparent, ${eraColor})`,
                          boxShadow: `0 0 10px ${eraGlow}`
                        }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            <Clock className="w-16 h-16 text-museum-textMuted/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">没有匹配的展品</h3>
            <p className="text-museum-textMuted mb-6">试试调整筛选条件</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-80s-primary to-00s-primary
                text-white font-medium transition-all hover:scale-105"
            >
              清除筛选
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
