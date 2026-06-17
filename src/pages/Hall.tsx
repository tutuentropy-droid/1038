import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronDown, Film, Star, Tv, Clock, ArrowRight } from 'lucide-react';
import { ERA_INFO } from '@/types';
import { animes } from '@/data/animes';
import { EraCard } from '@/components/EraCard';
import { AnimeCard } from '@/components/AnimeCard';
import { SearchBar } from '@/components/SearchBar';

export const Hall = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
    }));
  }, []);

  const featuredAnimes = useMemo(() => {
    return [...animes]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const eras = Object.values(ERA_INFO);

  return (
    <div className="min-h-screen relative overflow-hidden page-transition-enter">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-museum-pattern pointer-events-none" />

      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-80s-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-00s-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-90s-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 opacity-0 animate-slide-down">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-museum-textMuted">欢迎来到动画的殿堂</span>
          </div>

          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-black mb-6 opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
            <span className="block bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary bg-clip-text text-transparent">
              动画片
            </span>
            <span className="block text-white mt-2">博物馆</span>
          </h1>

          <p className="text-lg md:text-xl text-museum-textMuted max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards' }}>
            穿越时空，重温经典。在这里，每一部动画都是一扇通往童年的门，
            让我们一起探索80年代、90年代、2000年代的动画黄金岁月。
          </p>

          <div className="opacity-0 animate-slide-up stagger-3" style={{ animationFillMode: 'forwards' }}>
            <SearchBar variant="page" />
          </div>
        </div>

        <div className="animate-bounce opacity-0 animate-slide-up stagger-4" style={{ animationFillMode: 'forwards', animationDuration: '1.5s', animationIterationCount: 'infinite' }}>
          <ChevronDown className="w-8 h-8 text-museum-textMuted" />
        </div>
      </section>

      <section className="relative py-20 px-4">
        <div className="container">
          <div className="glass-card p-8 md:p-10 mb-12 relative overflow-hidden opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-80s-primary/10 via-90s-primary/10 to-00s-primary/10" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-80s-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-00s-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/2 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-80s-primary animate-pulse" style={{ transform: 'translateY(-50%)' }} />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-90s-primary animate-pulse" style={{ transform: 'translateY(-50%)', animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 left-3/4 w-2 h-2 rounded-full bg-00s-primary animate-pulse" style={{ transform: 'translateY(-50%)', animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-80s-primary via-90s-primary to-00s-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                    时间长廊
                  </h3>
                  <p className="text-museum-textMuted max-w-md">
                    沿着时间轴探索动画发展的历史脉络，穿越年代，感受经典的力量
                  </p>
                </div>
              </div>
              <Link
                to="/time-corridor"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                开始探索
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-80s-primary to-90s-primary flex items-center justify-center">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                  年代展区
                </h2>
                <p className="text-museum-textMuted text-sm">选择一个年代开始你的旅程</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {eras.map((era, index) => (
              <EraCard key={era.id} era={era} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                  精选展品
                </h2>
                <p className="text-museum-textMuted text-sm">最受欢迎的经典动画</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredAnimes.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4">
        <div className="container">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-80s-primary/10 via-90s-primary/10 to-00s-primary/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-80s-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-00s-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center">
              <div className="opacity-0 animate-slide-up stagger-1" style={{ animationFillMode: 'forwards' }}>
                <div className="font-retro text-5xl md:text-6xl font-black bg-gradient-to-r from-80s-primary to-90s-primary bg-clip-text text-transparent mb-2">
                  {animes.length}
                </div>
                <p className="text-museum-textMuted">部经典动画</p>
              </div>
              <div className="opacity-0 animate-slide-up stagger-2" style={{ animationFillMode: 'forwards' }}>
                <div className="font-retro text-5xl md:text-6xl font-black bg-gradient-to-r from-90s-primary to-00s-primary bg-clip-text text-transparent mb-2">
                  3
                </div>
                <p className="text-museum-textMuted">个年代展区</p>
              </div>
              <div className="opacity-0 animate-slide-up stagger-3" style={{ animationFillMode: 'forwards' }}>
                <div className="font-retro text-5xl md:text-6xl font-black bg-gradient-to-r from-00s-primary to-80s-primary bg-clip-text text-transparent mb-2">
                  {animes.reduce((sum, a) => sum + a.characters.length, 0)}
                </div>
                <p className="text-museum-textMuted">个经典角色</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative py-12 px-4 border-t border-museum-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Film className="w-6 h-6 text-80s-primary" />
              <span className="font-display text-lg font-bold text-white">
                动画片博物馆
              </span>
            </div>
            <p className="text-sm text-museum-textMuted text-center">
              献给所有热爱动画的人们 · 让经典永不褪色
            </p>
            <div className="text-xs text-museum-textMuted/60">
              © 2024 Anime Museum
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
