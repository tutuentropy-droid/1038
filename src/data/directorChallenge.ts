import { Character } from '@/types';
import { getAllCharacters } from './characters';

const imgPrompt = (prompt: string, size = 'landscape_16_9') =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

export type SceneType = 'forest' | 'city' | 'school' | 'space' | 'castle' | 'ocean' | 'mountain' | 'cafe' | 'battlefield' | 'fantasy_world';
export type MusicStyle = 'epic' | 'happy' | 'sad' | 'mysterious' | 'energetic' | 'calm' | 'comedic' | 'romantic' | 'tense' | 'nostalgic';
export type ChallengeGenre = 'adventure' | 'comedy' | 'romance' | 'scifi' | 'fantasy' | 'slice_of_life' | 'action' | 'mystery' | 'drama';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface Scene {
  id: string;
  name: string;
  type: SceneType;
  image: string;
  description: string;
  tags: string[];
}

export interface MusicTrack {
  id: string;
  name: string;
  style: MusicStyle;
  description: string;
  icon: string;
  tempo: 'slow' | 'medium' | 'fast';
}

export interface ChallengeTemplate {
  id: string;
  title: string;
  genre: ChallengeGenre;
  description: string;
  brief: string;
  requiredCharacterCount: number;
  preferredSceneTypes: SceneType[];
  preferredMusicStyles: MusicStyle[];
  characterTags: string[];
  difficulty: ChallengeDifficulty;
  basePoints: number;
  icon: string;
}

export interface ActiveChallenge {
  template: ChallengeTemplate;
  selectedCharacters: string[];
  selectedScene: string | null;
  selectedMusic: string | null;
  score: number;
  feedback: string[];
  completed: boolean;
}

export const scenes: Scene[] = [
  {
    id: 'scene-forest',
    name: '神秘森林',
    type: 'forest',
    image: imgPrompt('anime style enchanted forest, lush green trees, sunlight filtering through leaves, magical atmosphere, detailed background art'),
    description: '充满神秘气息的古老森林，阳光透过树叶洒下斑驳光影',
    tags: ['自然', '神秘', '冒险'],
  },
  {
    id: 'scene-city',
    name: '繁华都市',
    type: 'city',
    image: imgPrompt('anime style modern cityscape, skyscrapers, neon lights at night, busy streets, urban atmosphere, detailed background'),
    description: '高楼林立的现代都市，霓虹闪烁，车水马龙',
    tags: ['都市', '现代', '繁华'],
  },
  {
    id: 'scene-school',
    name: '校园操场',
    type: 'school',
    image: imgPrompt('anime style school campus, cherry blossom trees, school building, playground, sunny day, nostalgic atmosphere'),
    description: '樱花飘落的校园，充满青春气息的操场和教学楼',
    tags: ['校园', '青春', '日常'],
  },
  {
    id: 'scene-space',
    name: '宇宙星空',
    type: 'space',
    image: imgPrompt('anime style outer space, stars, nebula, planets, cosmic colors, sci-fi atmosphere, deep space background'),
    description: '浩瀚无垠的宇宙，星云璀璨，星球漂浮',
    tags: ['科幻', '宇宙', '冒险'],
  },
  {
    id: 'scene-castle',
    name: '古老城堡',
    type: 'castle',
    image: imgPrompt('anime style medieval castle, stone walls, towers, fantasy kingdom, dramatic lighting, epic background'),
    description: '屹立在山巅的古老城堡，充满奇幻色彩',
    tags: ['奇幻', '中世纪', '史诗'],
  },
  {
    id: 'scene-ocean',
    name: '碧海蓝天',
    type: 'ocean',
    image: imgPrompt('anime style ocean view, blue sea, white clouds, beach, waves, summer atmosphere, bright and colorful'),
    description: '蔚蓝的大海与天空相接，海浪轻拍沙滩',
    tags: ['海洋', '夏日', '治愈'],
  },
  {
    id: 'scene-mountain',
    name: '云海山巅',
    type: 'mountain',
    image: imgPrompt('anime style mountain peak, sea of clouds, sunrise, majestic scenery, nature landscape, breathtaking view'),
    description: '高耸入云的山峰，云海翻涌，日出东方',
    tags: ['自然', '壮丽', '修行'],
  },
  {
    id: 'scene-cafe',
    name: '温馨咖啡馆',
    type: 'cafe',
    image: imgPrompt('anime style cozy cafe interior, warm lighting, coffee cups, books, comfortable atmosphere, slice of life background'),
    description: '温暖舒适的咖啡馆，弥漫着咖啡香气',
    tags: ['日常', '治愈', '温馨'],
  },
  {
    id: 'scene-battlefield',
    name: '决战战场',
    type: 'battlefield',
    image: imgPrompt('anime style epic battlefield, ruins, smoke, dramatic lighting, intense atmosphere, action scene background'),
    description: '硝烟弥漫的战场，决定命运的决战之地',
    tags: ['战斗', '紧张', '史诗'],
  },
  {
    id: 'scene-fantasy',
    name: '奇幻世界',
    type: 'fantasy_world',
    image: imgPrompt('anime style fantasy world, floating islands, magical trees, crystal formations, otherworldly atmosphere, vibrant colors'),
    description: '漂浮的岛屿与魔法水晶，充满不可思议的奇幻世界',
    tags: ['奇幻', '魔法', '冒险'],
  },
];

export const musicTracks: MusicTrack[] = [
  { id: 'music-epic', name: '史诗交响', style: 'epic', description: '气势磅礴的交响乐，适合宏大的冒险故事', icon: '🎺', tempo: 'medium' },
  { id: 'music-happy', name: '欢乐轻快', style: 'happy', description: '轻松愉快的旋律，充满阳光与活力', icon: '🎵', tempo: 'fast' },
  { id: 'music-sad', name: '伤感抒情', style: 'sad', description: '温柔忧伤的钢琴曲，触动心弦', icon: '🎹', tempo: 'slow' },
  { id: 'music-mysterious', name: '神秘悬疑', style: 'mysterious', description: '充满未知感的音效，营造悬疑氛围', icon: '🔮', tempo: 'slow' },
  { id: 'music-energetic', name: '热血燃曲', style: 'energetic', description: '充满力量的摇滚节奏，让人热血沸腾', icon: '🎸', tempo: 'fast' },
  { id: 'music-calm', name: '宁静治愈', style: 'calm', description: '轻柔舒缓的音乐，抚平心灵的躁动', icon: '🍃', tempo: 'slow' },
  { id: 'music-comedic', name: '搞笑滑稽', style: 'comedic', description: '诙谐有趣的曲调，充满喜剧效果', icon: '🎪', tempo: 'fast' },
  { id: 'music-romantic', name: '浪漫柔情', style: 'romantic', description: '甜蜜温柔的旋律，充满爱的氛围', icon: '💕', tempo: 'medium' },
  { id: 'music-tense', name: '紧张刺激', style: 'tense', description: '节奏紧凑的配乐，让人屏息凝神', icon: '⚡', tempo: 'fast' },
  { id: 'music-nostalgic', name: '怀旧回忆', style: 'nostalgic', description: '温暖怀旧的曲调，唤起美好回忆', icon: '📷', tempo: 'slow' },
];

export const challengeTemplates: ChallengeTemplate[] = [
  {
    id: 'challenge-adventure-1',
    title: '勇者的冒险之旅',
    genre: 'adventure',
    description: '制作一部充满冒险精神的动画短片',
    brief: '讲述一位勇敢的主角踏上未知旅程，探索神秘世界的故事。需要展现出冒险的刺激感和探索的乐趣。',
    requiredCharacterCount: 2,
    preferredSceneTypes: ['forest', 'mountain', 'fantasy_world'],
    preferredMusicStyles: ['epic', 'energetic'],
    characterTags: ['勇者', '冒险', '热血', '主角'],
    difficulty: 'easy',
    basePoints: 100,
    icon: '🗺️',
  },
  {
    id: 'challenge-comedy-1',
    title: '搞笑日常大作战',
    genre: 'comedy',
    description: '制作一部令人捧腹大笑的搞笑短片',
    brief: '围绕日常生活中的趣事展开，角色们的互动要充满喜剧效果，让观众忍俊不禁。',
    requiredCharacterCount: 3,
    preferredSceneTypes: ['school', 'cafe', 'city'],
    preferredMusicStyles: ['comedic', 'happy'],
    characterTags: ['搞笑', '可爱', '日常', '朋友'],
    difficulty: 'easy',
    basePoints: 100,
    icon: '😂',
  },
  {
    id: 'challenge-romance-1',
    title: '心动的瞬间',
    genre: 'romance',
    description: '制作一部温馨浪漫的爱情故事',
    brief: '描绘两个角色之间萌生的情愫，捕捉那些心动的瞬间，传递温暖与甜蜜。',
    requiredCharacterCount: 2,
    preferredSceneTypes: ['school', 'ocean', 'cafe'],
    preferredMusicStyles: ['romantic', 'nostalgic'],
    characterTags: ['恋爱', '青春', '温柔', '青梅竹马'],
    difficulty: 'medium',
    basePoints: 150,
    icon: '💕',
  },
  {
    id: 'challenge-scifi-1',
    title: '星际穿越',
    genre: 'scifi',
    description: '制作一部科幻题材的太空冒险动画',
    brief: '讲述未来世界的星际探险故事，展现浩瀚宇宙的壮丽与未知文明的神秘。',
    requiredCharacterCount: 2,
    preferredSceneTypes: ['space', 'city', 'fantasy_world'],
    preferredMusicStyles: ['epic', 'mysterious'],
    characterTags: ['科幻', '机器人', '未来', '宇宙'],
    difficulty: 'medium',
    basePoints: 150,
    icon: '🚀',
  },
  {
    id: 'challenge-fantasy-1',
    title: '魔法王国历险记',
    genre: 'fantasy',
    description: '制作一部奇幻风格的魔法冒险动画',
    brief: '在一个充满魔法的世界里，主角踏上拯救王国的旅程，结交伙伴，战胜邪恶。',
    requiredCharacterCount: 3,
    preferredSceneTypes: ['castle', 'fantasy_world', 'forest'],
    preferredMusicStyles: ['epic', 'mysterious'],
    characterTags: ['魔法', '奇幻', '勇者', '公主'],
    difficulty: 'medium',
    basePoints: 150,
    icon: '✨',
  },
  {
    id: 'challenge-slice-1',
    title: '温暖的日常',
    genre: 'slice_of_life',
    description: '制作一部治愈系日常动画',
    brief: '描绘平凡生活中的小确幸，角色们的日常互动温馨而治愈，让人感受到生活的美好。',
    requiredCharacterCount: 2,
    preferredSceneTypes: ['cafe', 'school', 'ocean'],
    preferredMusicStyles: ['calm', 'nostalgic'],
    characterTags: ['日常', '治愈', '温柔', '朋友'],
    difficulty: 'easy',
    basePoints: 100,
    icon: '☕',
  },
  {
    id: 'challenge-action-1',
    title: '巅峰对决',
    genre: 'action',
    description: '制作一部热血战斗动画',
    brief: '两位实力相当的对手展开宿命对决，战斗场面要激烈震撼，展现角色的力量与意志。',
    requiredCharacterCount: 2,
    preferredSceneTypes: ['battlefield', 'castle', 'mountain'],
    preferredMusicStyles: ['energetic', 'tense', 'epic'],
    characterTags: ['战斗', '热血', '宿敌', '强者'],
    difficulty: 'hard',
    basePoints: 200,
    icon: '⚔️',
  },
  {
    id: 'challenge-mystery-1',
    title: '消失的秘密',
    genre: 'mystery',
    description: '制作一部悬疑解谜动画',
    brief: '围绕一个神秘事件展开，主角需要寻找线索、揭开真相，全程充满悬念与惊喜。',
    requiredCharacterCount: 2,
    preferredSceneTypes: ['city', 'forest', 'castle'],
    preferredMusicStyles: ['mysterious', 'tense'],
    characterTags: ['神秘', '智慧', '侦探', '解谜'],
    difficulty: 'hard',
    basePoints: 200,
    icon: '🔍',
  },
  {
    id: 'challenge-drama-1',
    title: '成长的代价',
    genre: 'drama',
    description: '制作一部感人至深的剧情动画',
    brief: '讲述角色在困境中成长的故事，情感真挚动人，让观众产生共鸣与思考。',
    requiredCharacterCount: 2,
    preferredSceneTypes: ['school', 'city', 'mountain'],
    preferredMusicStyles: ['sad', 'nostalgic', 'epic'],
    characterTags: ['成长', '友情', '努力', '感动'],
    difficulty: 'medium',
    basePoints: 150,
    icon: '🎭',
  },
];

const genreToTags: Record<ChallengeGenre, string[]> = {
  adventure: ['冒险', '勇者', '热血', '探索'],
  comedy: ['搞笑', '可爱', '日常', '幽默'],
  romance: ['恋爱', '青春', '温柔', '甜蜜'],
  scifi: ['科幻', '机器人', '未来', '宇宙'],
  fantasy: ['魔法', '奇幻', '公主', '魔王'],
  slice_of_life: ['日常', '治愈', '温馨', '朋友'],
  action: ['战斗', '热血', '强者', '宿敌'],
  mystery: ['神秘', '智慧', '侦探', '悬疑'],
  drama: ['成长', '感动', '友情', '努力'],
};

export function getRandomChallenge(): ChallengeTemplate {
  const randomIndex = Math.floor(Math.random() * challengeTemplates.length);
  return challengeTemplates[randomIndex];
}

export function getRandomCharacters(count: number): Character[] {
  const all = getAllCharacters();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, all.length));
}

export function calculateScore(
  challenge: ChallengeTemplate,
  selectedCharacters: Character[],
  selectedScene: Scene | null,
  selectedMusic: MusicTrack | null
): { score: number; maxScore: number; feedback: string[]; breakdown: { category: string; score: number; maxScore: number }[] } {
  const feedback: string[] = [];
  const breakdown: { category: string; score: number; maxScore: number }[] = [];
  let totalScore = 0;
  let maxScore = 0;

  const charMax = 40;
  maxScore += charMax;
  let charScore = 0;
  if (selectedCharacters.length === challenge.requiredCharacterCount) {
    charScore += 20;
    feedback.push('✓ 角色数量完美符合要求！');
  } else if (selectedCharacters.length > 0) {
    charScore += 10;
    feedback.push(`△ 角色数量为 ${selectedCharacters.length} 人（要求 ${challenge.requiredCharacterCount} 人）`);
  } else {
    feedback.push('✗ 还没有选择任何角色');
  }

  if (selectedCharacters.length > 0) {
    const genreTags = genreToTags[challenge.genre] || [];
    let tagMatches = 0;
    selectedCharacters.forEach((char) => {
      const charDesc = char.description.toLowerCase();
      const charName = char.name.toLowerCase();
      genreTags.forEach((tag) => {
        if (charDesc.includes(tag.toLowerCase()) || charName.includes(tag.toLowerCase())) {
          tagMatches++;
        }
      });
    });
    if (tagMatches > 0) {
      charScore += Math.min(20, tagMatches * 5);
      feedback.push(`✓ 角色与题材契合度：${tagMatches} 个匹配点`);
    } else {
      charScore += 10;
      feedback.push('△ 角色与题材有一定差距，但仍有创意空间');
    }
  }
  breakdown.push({ category: '角色选择', score: charScore, maxScore: charMax });
  totalScore += charScore;

  const sceneMax = 30;
  maxScore += sceneMax;
  let sceneScore = 0;
  if (selectedScene) {
    if (challenge.preferredSceneTypes.includes(selectedScene.type)) {
      sceneScore = 30;
      feedback.push('✓ 场景与故事主题完美契合！');
    } else {
      sceneScore = 15;
      feedback.push('△ 场景选择有创意，但与主题契合度一般');
    }
  } else {
    feedback.push('✗ 还没有选择场景');
  }
  breakdown.push({ category: '场景选择', score: sceneScore, maxScore: sceneMax });
  totalScore += sceneScore;

  const musicMax = 30;
  maxScore += musicMax;
  let musicScore = 0;
  if (selectedMusic) {
    if (challenge.preferredMusicStyles.includes(selectedMusic.style)) {
      musicScore = 30;
      feedback.push('✓ 音乐风格与氛围完美搭配！');
    } else {
      musicScore = 15;
      feedback.push('△ 音乐风格有独特想法，但与氛围契合度一般');
    }
  } else {
    feedback.push('✗ 还没有选择音乐');
  }
  breakdown.push({ category: '音乐选择', score: musicScore, maxScore: musicMax });
  totalScore += musicScore;

  if (totalScore >= 80) {
    feedback.push('🌟 太棒了！这是一部完美的动画企划！');
  } else if (totalScore >= 60) {
    feedback.push('👍 不错的企划，继续加油！');
  } else if (totalScore >= 40) {
    feedback.push('💪 还不错，但还有提升空间哦～');
  } else {
    feedback.push('🎯 试试调整一下选择，会有更好的效果！');
  }

  return { score: totalScore, maxScore, feedback, breakdown };
}

export const genreLabels: Record<ChallengeGenre, string> = {
  adventure: '冒险',
  comedy: '搞笑',
  romance: '恋爱',
  scifi: '科幻',
  fantasy: '奇幻',
  slice_of_life: '日常',
  action: '战斗',
  mystery: '悬疑',
  drama: '剧情',
};

export const difficultyLabels: Record<ChallengeDifficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export const difficultyColors: Record<ChallengeDifficulty, string> = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-red-400',
};
