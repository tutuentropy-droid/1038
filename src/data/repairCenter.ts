import { RepairableAnimation, RepairBadge, RepairProblem, RepairProblemType, RepairDifficulty } from '@/types';
import { animes } from './animes';

const imgPrompt = (prompt: string, size = 'square') =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

const generateProblems = (types: RepairProblemType[], difficulty: RepairDifficulty): RepairProblem[] => {
  const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  const selectedTypes = types.slice(0, count);
  
  return selectedTypes.map((type, index) => {
    const baseProblem = {
      id: `problem-${type}-${index}`,
      type,
      severity: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      width: 30 + Math.random() * 40,
      height: 10 + Math.random() * 20,
      points: difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 150,
      rotation: Math.random() * 180 - 90,
    };

    if (type === 'scratch') {
      return {
        ...baseProblem,
        name: '胶片划痕',
        description: '时间在胶片上留下了痕迹，需要小心擦拭修复',
      };
    } else if (type === 'fading') {
      return {
        ...baseProblem,
        name: '色彩褪色',
        description: '岁月让色彩流失，需要重新调校色彩通道',
      };
    } else {
      return {
        ...baseProblem,
        name: '帧缺失',
        description: '部分画面帧已经丢失，需要重新排列顺序',
      };
    }
  });
};

export const repairableAnimations: RepairableAnimation[] = animes.map((anime) => {
  const problems: RepairProblemType[] = ['scratch', 'fading', 'missing_frame'];
  const randomProblems = problems.sort(() => Math.random() - 0.5).slice(0, 3);
  const difficulty: RepairDifficulty = 
    anime.year < 1985 ? 'hard' : 
    anime.year < 1995 ? 'medium' : 'easy';

  return {
    id: `repair-${anime.id}`,
    title: anime.title,
    originalTitle: anime.originalTitle,
    year: anime.year,
    era: anime.era,
    poster: anime.poster,
    description: `${anime.title}的珍贵胶片需要修复，年代越久远，修复难度越高。`,
    problems: randomProblems,
    currentProblems: generateProblems(randomProblems, difficulty),
    difficulty,
    basePoints: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300,
    isRepaired: false,
  };
});

export const repairBadges: RepairBadge[] = [
  {
    id: 'repair-newbie',
    name: '新手修复师',
    description: '完成第一次动画修复',
    icon: '🛠️',
    rarity: 'bronze',
    requirement: { type: 'repair_count', target: 1 },
    points: 50,
  },
  {
    id: 'repair-apprentice',
    name: '修复学徒',
    description: '完成5次动画修复',
    icon: '🎨',
    rarity: 'bronze',
    requirement: { type: 'repair_count', target: 5 },
    points: 100,
  },
  {
    id: 'repair-expert',
    name: '修复专家',
    description: '完成20次动画修复',
    icon: '✨',
    rarity: 'silver',
    requirement: { type: 'repair_count', target: 20 },
    points: 200,
  },
  {
    id: 'repair-master',
    name: '修复大师',
    description: '完成50次动画修复',
    icon: '👑',
    rarity: 'gold',
    requirement: { type: 'repair_count', target: 50 },
    points: 500,
  },
  {
    id: 'scratch-remover',
    name: '划痕终结者',
    description: '修复10处胶片划痕',
    icon: '🧹',
    rarity: 'bronze',
    requirement: { type: 'repair_type', target: 10, problemType: 'scratch' },
    points: 100,
  },
  {
    id: 'color-restorer',
    name: '色彩魔法师',
    description: '修复10次色彩褪色问题',
    icon: '🌈',
    rarity: 'bronze',
    requirement: { type: 'repair_type', target: 10, problemType: 'fading' },
    points: 100,
  },
  {
    id: 'frame-puzzler',
    name: '帧拼图高手',
    description: '完成10次帧缺失修复',
    icon: '🧩',
    rarity: 'bronze',
    requirement: { type: 'repair_type', target: 10, problemType: 'missing_frame' },
    points: 100,
  },
  {
    id: 'perfect-repairer',
    name: '完美主义者',
    description: '完成5次完美修复（无失误）',
    icon: '💎',
    rarity: 'silver',
    requirement: { type: 'perfect_repair', target: 5 },
    points: 300,
  },
  {
    id: 'streak-7',
    name: '七日连更',
    description: '连续7天进行修复工作',
    icon: '🔥',
    rarity: 'silver',
    requirement: { type: 'streak', target: 7 },
    points: 200,
  },
  {
    id: 'streak-30',
    name: '月度达人',
    description: '连续30天进行修复工作',
    icon: '🏆',
    rarity: 'legendary',
    requirement: { type: 'streak', target: 30 },
    points: 1000,
  },
  {
    id: 'repair-legend',
    name: '传奇修复师',
    description: '完成100次动画修复',
    icon: '🌟',
    rarity: 'legendary',
    requirement: { type: 'repair_count', target: 100 },
    points: 2000,
  },
];

export const badgeRarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  bronze: {
    bg: 'from-amber-600 to-amber-800',
    border: 'border-amber-500',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/30',
  },
  silver: {
    bg: 'from-slate-400 to-slate-600',
    border: 'border-slate-400',
    text: 'text-slate-300',
    glow: 'shadow-slate-400/30',
  },
  gold: {
    bg: 'from-yellow-400 to-amber-600',
    border: 'border-yellow-400',
    text: 'text-yellow-300',
    glow: 'shadow-yellow-400/30',
  },
  legendary: {
    bg: 'from-purple-400 via-pink-500 to-red-500',
    border: 'border-purple-400',
    text: 'text-purple-300',
    glow: 'shadow-purple-500/50',
  },
};

export const problemTypeInfo: Record<RepairProblemType, { name: string; icon: string; color: string; description: string }> = {
  scratch: {
    name: '划痕',
    icon: '〰️',
    color: '#ef4444',
    description: '用鼠标或手指在划痕上滑动来擦拭消除',
  },
  fading: {
    name: '褪色',
    icon: '🎨',
    color: '#f59e0b',
    description: '调整RGB色彩通道，使颜色恢复到目标值',
  },
  missing_frame: {
    name: '缺帧',
    icon: '🧩',
    color: '#8b5cf6',
    description: '拖动帧画面，按正确的顺序重新排列',
  },
};

export const difficultyInfo: Record<RepairDifficulty, { name: string; color: string; icon: string }> = {
  easy: { name: '简单', color: '#22c55e', icon: '⭐' },
  medium: { name: '中等', color: '#f59e0b', icon: '⭐⭐' },
  hard: { name: '困难', color: '#ef4444', icon: '⭐⭐⭐' },
};

export const getRepairableById = (id: string): RepairableAnimation | undefined => {
  return repairableAnimations.find((a) => a.id === id);
};

export const getBadgeById = (id: string): RepairBadge | undefined => {
  return repairBadges.find((b) => b.id === id);
};
