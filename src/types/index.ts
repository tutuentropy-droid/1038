export interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  voiceActor: string;
}

export interface ClassicClip {
  id: string;
  episode: string;
  title: string;
  description: string;
  quote: string;
}

export interface Anime {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  era: '80s' | '90s' | '00s';
  genres: string[];
  poster: string;
  description: string;
  episodes: number;
  studio: string;
  director: string;
  characters: Character[];
  classicClips: ClassicClip[];
  rating: number;
}

export type EraType = '80s' | '90s' | '00s';

export interface EraInfo {
  id: EraType;
  name: string;
  description: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  pattern: string;
}

export const ERA_INFO: Record<EraType, EraInfo> = {
  '80s': {
    id: '80s',
    name: '80年代',
    description: '电视动画的黄金起步期，经典IP诞生的年代',
    color: '#ff00ff',
    glowColor: 'rgba(255, 0, 255, 0.5)',
    bgGradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)',
    pattern: 'pixel'
  },
  '90s': {
    id: '90s',
    name: '90年代',
    description: '动画艺术的巅峰时期，百花齐放的经典年代',
    color: '#ff6b35',
    glowColor: 'rgba(255, 107, 53, 0.5)',
    bgGradient: 'linear-gradient(135deg, #2e1a0a 0%, #4e2d1b 50%, #2e1a0a 100%)',
    pattern: 'watercolor'
  },
  '00s': {
    id: '00s',
    name: '2000年代',
    description: '数字动画革命，新技术带来全新视觉体验',
    color: '#9d4edd',
    glowColor: 'rgba(157, 78, 221, 0.5)',
    bgGradient: 'linear-gradient(135deg, #0a1a2e 0%, #1b2d4e 50%, #0a1a2e 100%)',
    pattern: 'cyber'
  }
};
