import { useEffect } from 'react';
import { MuseumMap } from '@/components/MuseumMap';

export const ExploreMap = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen page-transition-enter">
      <section className="pt-24 pb-16 px-4">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              探索博物馆
            </h1>
            <p className="text-museum-textMuted max-w-2xl mx-auto">
              使用方向键或WASD控制小导游在博物馆中自由探索，与NPC讲解员对话，
              了解各个动画时代的精彩故事！
            </p>
          </div>

          <div className="glass-card p-4">
            <MuseumMap />
          </div>
        </div>
      </section>
    </div>
  );
};
