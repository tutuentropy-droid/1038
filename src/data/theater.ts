import type { FestivalTheme, FestivalThemeInfo, FilmFestival, Screening } from '@/types';
import { animes } from './animes';

const imgPrompt = (prompt: string, size = 'landscape_16_9') =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

export const FESTIVAL_THEMES: Record<FestivalTheme, FestivalThemeInfo> = {
  mecha: {
    id: 'mecha',
    name: '钢铁雄心·机甲电影节',
    description: '致敬那些用钢铁与热血书写传奇的机甲经典，感受机械之美与人类意志的碰撞',
    icon: '🤖',
    color: '#00e5ff',
    accentColor: '#ff6e40',
    bgGradient: 'linear-gradient(135deg, #0a1628 0%, #1a2a4a 40%, #0d1f3c 100%)',
    tagline: '机甲，是人类最后的浪漫',
    genreFilter: ['机甲', '科幻'],
  },
  magical_girl: {
    id: 'magical_girl',
    name: '星光魔法·少女电影节',
    description: '月光下的变身，星辰间的战斗，重温魔法少女的璀璨与感动',
    icon: '🌙',
    color: '#ff80ab',
    accentColor: '#ea80fc',
    bgGradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #1a0a2e 100%)',
    tagline: '爱与正义，永不落幕',
    genreFilter: ['魔法少女', '恋爱'],
  },
  hot_blooded: {
    id: 'hot_blooded',
    name: '燃烧魂魄·热血电影节',
    description: '挑战极限，超越自我！热血少年们的战斗物语，点燃你的每一根神经',
    icon: '🔥',
    color: '#ff6b35',
    accentColor: '#ffea00',
    bgGradient: 'linear-gradient(135deg, #2e1a0a 0%, #4e2d1b 40%, #2e1a0a 100%)',
    tagline: '燃烧吧，我的小宇宙！',
    genreFilter: ['热血', '战斗'],
  },
  mystery: {
    id: 'mystery',
    name: '迷雾追踪·悬疑电影节',
    description: '真相只有一个！在迷雾中寻找线索，在推理中揭开真相的面纱',
    icon: '🔍',
    color: '#7c4dff',
    accentColor: '#18ffff',
    bgGradient: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 40%, #0a0e27 100%)',
    tagline: '真相，永远只有一个',
    genreFilter: ['推理', '悬疑', '犯罪'],
  },
  family: {
    id: 'family',
    name: '温暖时光·合家欢电影节',
    description: '陪伴是最好的礼物，和家人一起在动画的世界里感受爱与温暖',
    icon: '🏠',
    color: '#69f0ae',
    accentColor: '#ffd740',
    bgGradient: 'linear-gradient(135deg, #0a1e0a 0%, #1a3e1a 40%, #0a1e0a 100%)',
    tagline: '每一帧都是家的温度',
    genreFilter: ['喜剧', '儿童', '冒险'],
  },
  fantasy: {
    id: 'fantasy',
    name: '奇幻漫游·幻想电影节',
    description: '打开通往异世界的大门，在无限的想象中探索奇幻的边界',
    icon: '✨',
    color: '#9d4edd',
    accentColor: '#ffd60a',
    bgGradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 40%, #0a1a2e 100%)',
    tagline: '想象力的尽头，是另一个开始',
    genreFilter: ['神话', '冒险', '幻想'],
  },
  sports: {
    id: 'sports',
    name: '青春竞技·体育电影节',
    description: '汗水浇灌的梦想，拼搏铸就的传奇！热血竞技，永不服输',
    icon: '🏀',
    color: '#ffab40',
    accentColor: '#69f0ae',
    bgGradient: 'linear-gradient(135deg, #2e1e0a 0%, #4e3d1b 40%, #2e1e0a 100%)',
    tagline: '不到最后一刻，绝不放弃',
    genreFilter: ['体育', '校园'],
  },
  comedy: {
    id: 'comedy',
    name: '欢乐无限·喜剧电影节',
    description: '笑声是最好的良药！在动画的欢乐世界中释放压力，开怀大笑',
    icon: '😂',
    color: '#ffd740',
    accentColor: '#ff6e40',
    bgGradient: 'linear-gradient(135deg, #1e1a0a 0%, #3e351b 40%, #1e1a0a 100%)',
    tagline: '快乐，就是这么简单',
    genreFilter: ['喜剧'],
  },
  dark_fantasy: {
    id: 'dark_fantasy',
    name: '暗夜序曲·暗黑电影节',
    description: '在黑暗中寻找光明，在绝望中燃起希望。最深沉的黑暗里，藏着最炽热的光',
    icon: '🌑',
    color: '#b388ff',
    accentColor: '#ff5252',
    bgGradient: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 40%, #0a0a14 100%)',
    tagline: '在最深的黑暗中，寻找最亮的光',
    genreFilter: ['黑暗', '悬疑'],
  },
  chinese_classic: {
    id: 'chinese_classic',
    name: '国风盛典·中国动画电影节',
    description: '水墨丹青，神话传说。中国动画的东方美学与文化传承，绽放独特光芒',
    icon: '🏮',
    color: '#ff1744',
    accentColor: '#ffd740',
    bgGradient: 'linear-gradient(135deg, #1e0a0a 0%, #3e1a1a 40%, #1e0a0a 100%)',
    tagline: '东方美学，传世经典',
    genreFilter: ['神话', '国产'],
  },
};

const HALLS = ['星辰厅', '月光厅', '彩虹厅', '极光厅', '星云厅'];

const TIME_SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

function hashDate(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  let h = y * 374761393 + m * 668265263 + d * 1274126177;
  h = (h ^ (h >> 13)) * 1103515245;
  h = h ^ (h >> 16);
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return (s & 0x7fffffff) / 2147483647;
  };
}

const THEME_ORDER: FestivalTheme[] = [
  'mecha',
  'magical_girl',
  'hot_blooded',
  'mystery',
  'family',
  'fantasy',
  'sports',
  'comedy',
  'dark_fantasy',
  'chinese_classic',
];

export function getFestivalForDate(date: Date): FilmFestival {
  const seed = hashDate(date);
  const rng = seededRandom(seed);

  const themeIndex = Math.floor(rng() * THEME_ORDER.length);
  const theme = THEME_ORDER[themeIndex];
  const themeInfo = FESTIVAL_THEMES[theme];

  const matchingAnimes = animes.filter((a) =>
    a.genres.some((g) => themeInfo.genreFilter.includes(g))
  );

  const shuffled = [...matchingAnimes].sort(() => rng() - 0.5);
  const selectedAnimes = shuffled.slice(0, Math.min(6, shuffled.length));

  if (selectedAnimes.length < 3) {
    const remaining = animes.filter(
      (a) => !selectedAnimes.some((s) => s.id === a.id)
    );
    const extraShuffled = [...remaining].sort(() => rng() - 0.5);
    selectedAnimes.push(...extraShuffled.slice(0, 3 - selectedAnimes.length));
  }

  const screenings: Screening[] = selectedAnimes.map((anime, index) => ({
    id: `screening-${date.toISOString().split('T')[0]}-${anime.id}`,
    animeId: anime.id,
    timeSlot: TIME_SLOTS[index % TIME_SLOTS.length],
    hall: HALLS[index % HALLS.length],
    seatCount: 120 + Math.floor(rng() * 80),
    reservedSeats: Math.floor(rng() * 60) + 20,
  }));

  const dateStr = date.toISOString().split('T')[0];

  return {
    id: `festival-${dateStr}`,
    date: dateStr,
    theme,
    themeInfo,
    screenings,
    description: generateFestivalDescription(theme, selectedAnimes.map((a) => a.title)),
    bannerImage: imgPrompt(
      `${themeInfo.name} animation film festival banner, cinematic, ${themeInfo.color} lighting, grand theater stage, movie screens, festive atmosphere, elegant design`,
      'landscape_16_9'
    ),
    isActive: true,
  };
}

function generateFestivalDescription(theme: FestivalTheme, titles: string[]): string {
  const descriptions: Record<FestivalTheme, string> = {
    mecha: `钢铁轰鸣，机甲觉醒！今日影展精选${titles.length}部机甲经典，从初代巨型机器人到现代化变形机甲，每一部都是机械美学的巅峰之作。`,
    magical_girl: `星光璀璨，魔法绽放！今日特别呈现${titles.length}部魔法少女名作，在月光下重温那些关于爱与勇气的永恒传说。`,
    hot_blooded: `热血沸腾，斗志昂扬！今日影展带来${titles.length}部燃爆全场的经典，感受少年们燃烧灵魂的战斗物语！`,
    mystery: `迷雾笼罩，真相待揭！今日悬疑专场精选${titles.length}部推理名作，跟随侦探的脚步，在蛛丝马迹中寻找唯一的真相。`,
    family: `温馨时光，快乐相伴！今日合家欢专场精选${titles.length}部适合全家观赏的动画佳作，让欢笑与感动充满整个影院。`,
    fantasy: `异界之门已然开启！今日奇幻专场带来${titles.length}部幻想经典，在无限的想象力中探索未知的世界。`,
    sports: `青春无悔，竞技至上！今日体育专场精选${titles.length}部热血运动作品，感受汗水与荣耀交织的青春旋律。`,
    comedy: `快乐至上，笑对人生！今日喜剧专场带来${titles.length}部爆笑佳作，保证让你从开场笑到散场！`,
    dark_fantasy: `暗夜降临，光明未远！今日暗黑专场精选${titles.length}部深沉之作，在最深的黑暗中，见证最璀璨的希望。`,
    chinese_classic: `东方韵味，国风传承！今日国风专场精选${titles.length}部中国动画经典，在水墨丹青中感受华夏文化的独特魅力。`,
  };
  return descriptions[theme];
}

export function getWeekFestivals(): FilmFestival[] {
  const today = new Date();
  const festivals: FilmFestival[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const festival = getFestivalForDate(date);
    festival.isActive = i === 0;
    festivals.push(festival);
  }
  return festivals;
}

export function generateRecommendedRoute(
  festival: FilmFestival,
  preferences: { favoriteGenres: string[]; favoriteEras: string[]; ratedAnimeIds: string[] }
): import('@/types').RecommendedRoute {
  const { favoriteGenres, favoriteEras, ratedAnimeIds } = preferences;

  const scoredScreenings = festival.screenings.map((screening) => {
    const anime = animes.find((a) => a.id === screening.animeId);
    if (!anime) return { screening, score: 0, reason: '' };

    let score = 50;

    const genreMatch = anime.genres.filter((g) => favoriteGenres.includes(g)).length;
    score += genreMatch * 20;

    if (favoriteEras.includes(anime.era)) {
      score += 15;
    }

    if (ratedAnimeIds.includes(anime.id)) {
      score += 10;
    }

    score += anime.rating * 2;

    const reasons: string[] = [];
    if (genreMatch > 0) {
      reasons.push(`匹配你喜欢的${anime.genres.filter((g) => favoriteGenres.includes(g)).join('、')}类型`);
    }
    if (favoriteEras.includes(anime.era)) {
      reasons.push(`${anime.era}年代经典`);
    }
    if (ratedAnimeIds.includes(anime.id)) {
      reasons.push('你曾评价过的作品');
    }
    if (anime.rating >= 9.5) {
      reasons.push('超高评分佳作');
    }

    return {
      screening,
      score: Math.min(score, 100),
      reason: reasons.length > 0 ? reasons.join('，') : '热门推荐',
    };
  });

  const sortedStops = scoredScreenings
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(5, scoredScreenings.length))
    .map((item, index) => ({
      animeId: item.screening.animeId,
      reason: item.reason,
      order: index + 1,
      timeSlot: item.screening.timeSlot,
      hall: item.screening.hall,
      matchScore: item.score,
    }));

  return {
    festivalId: festival.id,
    stops: sortedStops,
    totalMatchScore: sortedStops.reduce((sum, s) => sum + s.matchScore, 0) / sortedStops.length,
    generatedAt: Date.now(),
  };
}
