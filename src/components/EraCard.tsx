import { Link } from 'react-router-dom';
import { ChevronRight, Tv } from 'lucide-react';
import { EraInfo } from '@/types';
import { getAnimesByEra } from '@/data/animes';

interface EraCardProps {
  era: EraInfo;
  index: number;
}

export const EraCard = ({ era, index }: EraCardProps) => {
  const animes = getAnimesByEra(era.id);
  const count = animes.length;

  const getPatternClass = () => {
    switch (era.pattern) {
      case 'pixel': return 'pixel-pattern';
      case 'watercolor': return 'watercolor-overlay';
      case 'cyber': return 'cyber-grid';
      default: return '';
    }
  };

  const getEffectClass = () => {
    if (era.id === '80s') return 'crt-effect scanline-overlay';
    return '';
  };

  return (
    <Link
      to={`/era/${era.id}`}
      className={`group relative perspective-card overflow-hidden rounded-3xl ${getPatternClass()} ${getEffectClass()}
        opacity-0 animate-slide-up stagger-${index + 1}`}
      style={{
        background: era.bgGradient,
        minHeight: '400px',
      }}
    >
      <div className="perspective-inner absolute inset-0 p-8 flex flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute top-6 right-6 w-20 h-20 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: era.color }} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Tv className="w-5 h-5" style={{ color: era.color }} />
            <span className="text-sm font-medium text-white/60 tracking-wider">EXHIBITION HALL</span>
          </div>
          
          <div className="font-retro text-8xl font-black mb-2 tracking-tight"
            style={{ color: era.color }}>
            {era.id === '00s' ? '00' : era.id.replace('s', '')}
            <span className="text-4xl align-top">s</span>
          </div>
          
          <h3 className="font-display text-3xl font-bold text-white mb-2">
            {era.name}
          </h3>
          
          <p className="text-white/70 max-w-xs text-sm leading-relaxed">
            {era.description}
          </p>
        </div>

        <div className="relative z-10 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-retro text-4xl font-bold" style={{ color: era.color }}>
                {count}
              </span>
              <span className="text-white/60 text-sm">部经典动画</span>
            </div>
            <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700 group-hover:w-full"
                style={{ 
                  width: `${(count / 6) * 100}%`,
                  backgroundColor: era.color,
                  boxShadow: `0 0 10px ${era.glowColor}`
                }}
              />
            </div>
          </div>

          <div 
            className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-500 group-hover:scale-105"
            style={{ 
              backgroundColor: `${era.color}20`,
              border: `1px solid ${era.color}40`
            }}
          >
            <span className="font-medium text-sm" style={{ color: era.color }}>
              进入展厅
            </span>
            <ChevronRight 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: era.color }}
            />
          </div>
        </div>

        <div 
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:opacity-40 group-hover:scale-125"
          style={{ backgroundColor: era.color }}
        />
      </div>
    </Link>
  );
};
