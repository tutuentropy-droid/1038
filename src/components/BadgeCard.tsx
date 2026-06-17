import {
  Film,
  PenTool,
  Palette,
  Mic,
  Award,
  Puzzle,
  BookOpen,
  Clock,
  GraduationCap,
  Ticket,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { Badge, badgeRarityColors } from '@/data/workshop';
import { useWorkshopStore } from '@/store/useWorkshopStore';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  film: Film,
  'pen-tool': PenTool,
  palette: Palette,
  mic: Mic,
  award: Award,
  puzzle: Puzzle,
  'book-open': BookOpen,
  clock: Clock,
  'graduation-cap': GraduationCap,
  ticket: Ticket,
  layers: Layers,
  image: ImageIcon,
};

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const BadgeCard = ({ badge, size = 'md', showDetails = true }: BadgeCardProps) => {
  const { isBadgeEarned } = useWorkshopStore();
  const earned = isBadgeEarned(badge.id);
  const colors = badgeRarityColors[badge.rarity];

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const Icon = iconMap[badge.icon] || Award;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center 
          transition-all duration-500 ${earned ? '' : 'grayscale opacity-40'}
          ${earned ? `shadow-lg ${colors.glow}` : ''}`}
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.bg} ${
            earned ? 'animate-pulse-slow' : ''
          }`}
        />
        <div className="absolute inset-1 rounded-full bg-black/30 flex items-center justify-center">
          <Icon className={`${iconSizes[size]} ${earned ? colors.text : 'text-gray-500'}`} />
        </div>
        {earned && (
          <div
            className="absolute inset-0 rounded-full opacity-50"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>

      {showDetails && (
        <div className="text-center mt-3">
          <h4 className={`font-bold text-sm ${earned ? 'text-white' : 'text-gray-500'}`}>
            {badge.name}
          </h4>
          <p className="text-xs text-museum-textMuted mt-1 max-w-32">
            {badge.description}
          </p>
          <div className="mt-2">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border ${colors.border} ${colors.text}`}
            >
              {badge.rarity === 'bronze'
                ? '铜'
                : badge.rarity === 'silver'
                ? '银'
                : badge.rarity === 'gold'
                ? '金'
                : '传说'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
