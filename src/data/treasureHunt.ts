import { HiddenCharacter, EasterEgg, Achievement, Quest, SpecialCollection, EraType } from '@/types';
import { getAllCharacters } from './characters';
import { animes } from './animes';

const allCharacters = getAllCharacters();

const imgPrompt = (prompt: string, size = 'square') => 
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

export const hiddenCharacters: HiddenCharacter[] = allCharacters
  .filter((_, index) => index % 3 === 0 || index % 5 === 0)
  .map((char, index) => {
    const anime = animes.find(a => a.id === char.animeId);
    const rarityRoll = Math.random();
    const rarity = rarityRoll < 0.6 ? 'common' : rarityRoll < 0.9 ? 'rare' : 'legendary';
    return {
      id: `hidden-${char.id}`,
      characterId: char.id,
      location: anime?.era === '80s' ? '80年代展区' : anime?.era === '90s' ? '90年代展区' : '2000年代展区',
      era: anime?.era || '00s',
      hint: `在${anime?.title || '某部动画'}的附近寻找，${char.name}可能藏在某个角落...`,
      rarity,
      points: rarity === 'common' ? 10 : rarity === 'rare' ? 30 : 100
    };
  });

export const easterEggs: EasterEgg[] = [
  {
    id: 'easter-1',
    name: '时光旅人的信',
    description: '发现了一封来自未来的神秘信件，里面写着关于动画发展的预言...',
    location: '时间长廊',
    hint: '沿着时间轴走到底，看看尽头有什么',
    points: 50,
    image: imgPrompt('mysterious letter from future, glowing anime style, magical, purple and blue lighting')
  },
  {
    id: 'easter-2',
    name: '隐藏的调色板',
    description: '找到了动画大师遗落的调色板，上面还留着未干的颜料...',
    location: '制作工坊',
    hint: '在制作流程的某个环节附近找找看',
    points: 50,
    image: imgPrompt('artist palette with glowing anime colors, magical art supplies, studio background')
  },
  {
    id: 'easter-3',
    name: '80年代的复古游戏机',
    description: '一台保存完好的80年代游戏机，里面装满了经典动画改编的游戏！',
    location: '80年代展区',
    era: '80s',
    hint: '80年代不只有动画，还有那个年代的电子游戏',
    points: 40,
    image: imgPrompt('retro 80s gaming console, pixel art style, neon pink lighting, nostalgic')
  },
  {
    id: 'easter-4',
    name: '90年代的录像带收藏',
    description: '一整箱珍贵的90年代动画录像带，每一盒都是回忆的宝藏！',
    location: '90年代展区',
    era: '90s',
    hint: '在那个DVD还没普及的年代，人们用什么看动画？',
    points: 40,
    image: imgPrompt('collection of vintage 90s anime VHS tapes, warm orange lighting, nostalgic')
  },
  {
    id: 'easter-5',
    name: '00年代的数字原画',
    description: '早期数字动画的原画稿，见证了从手绘到数字的转变！',
    location: '2000年代展区',
    era: '00s',
    hint: '数字革命带来了新的创作方式，找找那些早期的数字作品',
    points: 40,
    image: imgPrompt('digital anime concept art on tablet, futuristic purple lighting, high tech')
  },
  {
    id: 'easter-6',
    name: '神秘的声优签名',
    description: '获得了一位传奇声优的亲笔签名！太幸运了！',
    location: '角色博物馆',
    hint: '在角色详情页多看看，说不定能发现惊喜',
    points: 60,
    image: imgPrompt('anime voice actor autograph on shikishi board, elegant, gold ink')
  },
  {
    id: 'easter-7',
    name: '博物馆馆长的日记',
    description: '偷偷翻开了馆长的日记，里面记录了博物馆建立的故事...',
    location: '大厅',
    hint: '在大厅多转转，馆长可能把日记藏在某个特别的地方',
    points: 80,
    image: imgPrompt('old leather diary with glowing pages, magical anime style, mysterious')
  },
  {
    id: 'easter-8',
    name: '跨次元的对话',
    description: '两个不同动画世界的角色居然在聊天！这是怎么回事？',
    location: '角色关系图',
    hint: '看看角色之间的关系，说不定有意外的发现',
    points: 70,
    image: imgPrompt('two anime characters from different worlds talking, crossover art, magical')
  }
];

export const achievements: Achievement[] = [
  {
    id: 'ach-first-find',
    name: '初次发现',
    description: '找到你的第一个隐藏角色',
    type: 'hunter',
    rarity: 'bronze',
    icon: '🔍',
    requirement: { type: 'collect_characters', target: 1 },
    points: 50
  },
  {
    id: 'ach-collector-10',
    name: '收藏新手',
    description: '收集10个隐藏角色',
    type: 'collector',
    rarity: 'bronze',
    icon: '📚',
    requirement: { type: 'collect_characters', target: 10 },
    points: 100
  },
  {
    id: 'ach-collector-30',
    name: '收藏达人',
    description: '收集30个隐藏角色',
    type: 'collector',
    rarity: 'silver',
    icon: '📖',
    requirement: { type: 'collect_characters', target: 30 },
    points: 200
  },
  {
    id: 'ach-collector-50',
    name: '收藏大师',
    description: '收集50个隐藏角色',
    type: 'collector',
    rarity: 'gold',
    icon: '🏆',
    requirement: { type: 'collect_characters', target: 50 },
    points: 500
  },
  {
    id: 'ach-egg-first',
    name: '彩蛋猎人',
    description: '找到你的第一个彩蛋',
    type: 'explorer',
    rarity: 'bronze',
    icon: '🥚',
    requirement: { type: 'find_easter_eggs', target: 1 },
    points: 50
  },
  {
    id: 'ach-egg-5',
    name: '彩蛋专家',
    description: '找到5个彩蛋',
    type: 'explorer',
    rarity: 'silver',
    icon: '🍳',
    requirement: { type: 'find_easter_eggs', target: 5 },
    points: 200
  },
  {
    id: 'ach-egg-all',
    name: '彩蛋大师',
    description: '找到所有彩蛋',
    type: 'explorer',
    rarity: 'platinum',
    icon: '👑',
    requirement: { type: 'find_easter_eggs', target: 8 },
    points: 1000
  },
  {
    id: 'ach-quest-first',
    name: '任务新手',
    description: '完成第一个任务',
    type: 'hunter',
    rarity: 'bronze',
    icon: '📋',
    requirement: { type: 'complete_quests', target: 1 },
    points: 50
  },
  {
    id: 'ach-quest-10',
    name: '任务达人',
    description: '完成10个任务',
    type: 'hunter',
    rarity: 'silver',
    icon: '📜',
    requirement: { type: 'complete_quests', target: 10 },
    points: 300
  },
  {
    id: 'ach-special-5',
    name: '稀世收藏家',
    description: '收集5个特殊藏品',
    type: 'collector',
    rarity: 'gold',
    icon: '💎',
    requirement: { type: 'collect_specials', target: 5 },
    points: 400
  },
  {
    id: 'ach-80s-explorer',
    name: '80年代探索者',
    description: '在80年代展区找到10个隐藏角色',
    type: 'explorer',
    rarity: 'silver',
    icon: '🌸',
    requirement: { type: 'collect_characters', target: 10, era: '80s' },
    points: 200
  },
  {
    id: 'ach-90s-explorer',
    name: '90年代探索者',
    description: '在90年代展区找到10个隐藏角色',
    type: 'explorer',
    rarity: 'silver',
    icon: '🔥',
    requirement: { type: 'collect_characters', target: 10, era: '90s' },
    points: 200
  },
  {
    id: 'ach-00s-explorer',
    name: '00年代探索者',
    description: '在00年代展区找到10个隐藏角色',
    type: 'explorer',
    rarity: 'silver',
    icon: '💜',
    requirement: { type: 'collect_characters', target: 10, era: '00s' },
    points: 200
  },
  {
    id: 'ach-visitor-10',
    name: '常客',
    description: '累计访问博物馆10次',
    type: 'special',
    rarity: 'bronze',
    icon: '🎫',
    requirement: { type: 'visits', target: 10 },
    points: 100
  },
  {
    id: 'ach-completionist',
    name: '完美主义者',
    description: '解锁所有成就',
    type: 'completionist',
    rarity: 'platinum',
    icon: '🏅',
    requirement: { type: 'complete_quests', target: 999 },
    points: 2000
  }
];

export const generateQuests = (): Quest[] => {
  const eras: EraType[] = ['80s', '90s', '00s'];
  const quests: Quest[] = [];

  eras.forEach((era, index) => {
    const eraHiddenChars = hiddenCharacters.filter(hc => hc.era === era);
    const targetChars = eraHiddenChars.slice(0, 3).map(hc => hc.characterId);
    
    quests.push({
      id: `quest-era-${era}`,
      title: `${ERA_INFO_NAMES[era]}寻宝记`,
      description: `在${ERA_INFO_NAMES[era]}找到${targetChars.length}个隐藏角色`,
      type: 'find_characters',
      era,
      targetCount: targetChars.length,
      currentProgress: 0,
      targetIds: targetChars,
      reward: { points: 100, badge: `${ERA_INFO_NAMES[era]}探险家` },
      status: 'available'
    });

    quests.push({
      id: `quest-combo-${era}`,
      title: `${ERA_INFO_NAMES[era]}组合收集`,
      description: `找到${ERA_INFO_NAMES[era]}的3个经典角色组合`,
      type: 'combo_era',
      era,
      targetCount: 3,
      currentProgress: 0,
      targetIds: eraHiddenChars.slice(0, 3).map(hc => hc.characterId),
      reward: { points: 150, badge: `${ERA_INFO_NAMES[era]}收藏家` },
      status: 'available'
    });
  });

  quests.push({
    id: 'quest-easter-3',
    title: '彩蛋大搜索',
    description: '在博物馆中找到3个隐藏彩蛋',
    type: 'find_easter_eggs',
    targetCount: 3,
    currentProgress: 0,
    reward: { points: 200, badge: '彩蛋猎人' },
    status: 'available'
  });

  quests.push({
    id: 'quest-collect-all',
    title: '收集大师',
    description: '找到总共10个隐藏角色',
    type: 'find_characters',
    targetCount: 10,
    currentProgress: 0,
    reward: { points: 300, badge: '收集大师' },
    status: 'available'
  });

  return quests;
};

const ERA_INFO_NAMES: Record<EraType, string> = {
  '80s': '80年代',
  '90s': '90年代',
  '00s': '2000年代'
};

export const generateSpecialCollections = (): SpecialCollection[] => {
  const specials: SpecialCollection[] = [];
  const shuffledAnimes = [...animes].sort(() => Math.random() - 0.5);
  
  shuffledAnimes.slice(0, 6).forEach((anime, index) => {
    const rarityRoll = Math.random();
    const rarity = rarityRoll < 0.4 ? 'common' : rarityRoll < 0.7 ? 'rare' : rarityRoll < 0.9 ? 'epic' : 'legendary';
    const points = rarity === 'common' ? 20 : rarity === 'rare' ? 50 : rarity === 'epic' ? 100 : 200;
    
    specials.push({
      id: `special-${anime.id}-${Date.now()}-${index}`,
      name: `${anime.title}特别展`,
      description: `${anime.title}的珍贵原画和设定资料限时展出！`,
      animeId: anime.id,
      rarity,
      points,
      image: anime.poster,
      expireAt: Date.now() + (24 * 60 * 60 * 1000)
    });
  });

  return specials;
};

export const getHiddenCharacterByCharacterId = (characterId: string): HiddenCharacter | undefined => {
  return hiddenCharacters.find(hc => hc.characterId === characterId);
};

export const getEasterEggById = (id: string): EasterEgg | undefined => {
  return easterEggs.find(ee => ee.id === id);
};

export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(a => a.id === id);
};
