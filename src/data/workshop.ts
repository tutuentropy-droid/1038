export interface ProductionStep {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  details: string[];
  tools: string[];
}

export const productionSteps: ProductionStep[] = [
  {
    id: 'storyboard',
    name: '分镜',
    nameEn: 'Storyboard',
    icon: 'film',
    color: '#ff00ff',
    description: '将文字剧本转化为图像化的视觉剧本，是动画制作的蓝图',
    details: [
      '根据文字剧本绘制关键画面',
      '标注镜头运动、角色动作、台词位置',
      '确定每个镜头的时长和节奏',
      '分镜师与导演共同讨论修改'
    ],
    tools: ['铅笔', '分镜纸', '数位板', 'Storyboard Pro']
  },
  {
    id: 'key-animation',
    name: '原画',
    nameEn: 'Key Animation',
    icon: 'pen-tool',
    color: '#ff6b35',
    description: '绘制动作的关键帧，是角色动起来的灵魂所在',
    details: [
      '绘制每个动作的起始和结束关键帧',
      '确定角色的姿势、表情和运动轨迹',
      '标注时间、图层等技术信息',
      '原画是动画质量的关键决定因素'
    ],
    tools: ['铅笔', '动画纸', '定位尺', '数位板']
  },
  {
    id: 'inbetween',
    name: '中间画',
    nameEn: 'In-between',
    icon: 'layers',
    color: '#4ecdc4',
    description: '在关键帧之间补充过渡画面，让动作流畅自然',
    details: [
      '根据原画的关键帧绘制中间过渡帧',
      '确保动作的流畅性和连贯性',
      '需要精确掌握时间和空间关系',
      '是动画师入门的基础训练'
    ],
    tools: ['铅笔', '动画纸', '定位尺', '透光台']
  },
  {
    id: 'coloring',
    name: '上色',
    nameEn: 'Coloring',
    icon: 'palette',
    color: '#9d4edd',
    description: '为线稿添加色彩，赋予角色和场景生命',
    details: [
      '按照色指定为角色和场景上色',
      '确保不同镜头间颜色一致',
      '传统赛璐璐或数码上色',
      '光影效果和材质表现'
    ],
    tools: ['赛璐璐片', '颜料', '上色软件', '数位板']
  },
  {
    id: 'background',
    name: '背景',
    nameEn: 'Background',
    icon: 'image',
    color: '#00ffff',
    description: '绘制动画场景，为角色提供表演的舞台',
    details: [
      '根据美术设定绘制场景背景',
      '营造故事的氛围和世界观',
      '需要考虑透视和光影',
      '背景美术是动画风格的重要组成'
    ],
    tools: ['水彩', '丙烯', 'Photoshop', '背景绘制软件']
  },
  {
    id: 'voice-acting',
    name: '配音',
    nameEn: 'Voice Acting',
    icon: 'mic',
    color: '#ffd60a',
    description: '声优为角色赋予声音和情感，是动画的听觉灵魂',
    details: [
      '声优根据画面和台词进行配音',
      '需要精准把握角色性格和情绪',
      '配音后进行音效和背景音乐制作',
      '最终混音完成动画的声音部分'
    ],
    tools: ['录音棚', '麦克风', '调音台', '音频编辑软件']
  }
];

export interface StoryboardCard {
  id: string;
  sceneNumber: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  camera: string;
}

export const storyboardCards: StoryboardCard[] = [
  {
    id: 'scene-1',
    sceneNumber: 1,
    title: '登场',
    description: '主角从画面左侧走入，站在学校门口，抬头仰望天空',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20storyboard%20scene%20character%20standing%20at%20school%20gate%20looking%20up%20sky%20sunset&image_size=square',
    duration: '3秒',
    camera: '远景→中景'
  },
  {
    id: 'scene-2',
    sceneNumber: 2,
    title: '相遇',
    description: '女主角从对面走来，两人擦肩而过时不经意间对视',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20storyboard%20two%20characters%20passing%20by%20each%20other%20eye%20contact%20cherry%20blossom&image_size=square',
    duration: '4秒',
    camera: '中景→特写'
  },
  {
    id: 'scene-3',
    sceneNumber: 3,
    title: '惊讶',
    description: '两人同时停下脚步，回头看向对方，表情惊讶',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20storyboard%20surprised%20expression%20close%20up%20two%20characters%20looking%20back&image_size=square',
    duration: '2秒',
    camera: '特写'
  },
  {
    id: 'scene-4',
    sceneNumber: 4,
    title: '回忆',
    description: '闪回镜头，童年时两人一起玩耍的温馨画面',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20storyboard%20flashback%20scene%20children%20playing%20together%20nostalgic%20warm%20light&image_size=square',
    duration: '5秒',
    camera: '蒙太奇'
  },
  {
    id: 'scene-5',
    sceneNumber: 5,
    title: '相认',
    description: '两人异口同声说出对方的名字，眼眶微红',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20storyboard%20emotional%20reunion%20scene%20two%20friends%20recognizing%20each%20other%20tears&image_size=square',
    duration: '3秒',
    camera: '中景'
  },
  {
    id: 'scene-6',
    sceneNumber: 6,
    title: '微笑',
    description: '两人相视而笑，阳光洒在身上，画面渐暗',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20storyboard%20happy%20ending%20two%20characters%20smiling%20sunset%20warm%20light%20fade%20out&image_size=square',
    duration: '4秒',
    camera: '全景→淡出'
  }
];

export interface AnimeTerm {
  id: string;
  term: string;
  reading: string;
  category: '技术' | '行业' | '文化';
  definition: string;
  example?: string;
}

export const animeTerms: AnimeTerm[] = [
  {
    id: 'cel',
    term: '赛璐璐',
    reading: 'セル画',
    category: '技术',
    definition: '传统动画制作中使用的透明塑料薄片，画师在上面绘制动画画面。每一张赛璐璐片都是独一无二的原画，具有收藏价值。',
    example: '这部老动画还保留着珍贵的赛璐璐原画。'
  },
  {
    id: 'key-frame',
    term: '关键帧',
    reading: '原画',
    category: '技术',
    definition: '动画中表现动作起止和转折的重要画面，由原画师绘制。关键帧之间的过渡画面由动画师补充。'
  },
  {
    id: 'inbetween',
    term: '中间画',
    reading: '動画',
    category: '技术',
    definition: '在关键帧之间绘制的过渡画面，使动作更加流畅自然。中间画的数量决定了动画的流畅度。'
  },
  {
    id: 'douga',
    term: '动检',
    reading: '動画検査',
    category: '技术',
    definition: '对中间画进行质量检查的工序，确保动作流畅、造型准确。动检是保证动画质量的重要环节。'
  },
  {
    id: 'seiyuu',
    term: '声优',
    reading: 'せいゆう',
    category: '行业',
    definition: '日本对配音演员的称呼，意为"声音的演员"。声优在日本是一个专门的职业，拥有大量粉丝。',
    example: '这部动画的声优阵容非常豪华。'
  },
  {
    id: 'seiyuu-activity',
    term: '声优活动',
    reading: '声優活動',
    category: '文化',
    definition: '声优除配音外还参与唱歌、广播、见面会等活动。声优偶像化是日本动漫产业的特色。'
  },
  {
    id: 'ova',
    term: 'OVA',
    reading: 'オーブイエー',
    category: '行业',
    definition: 'Original Video Animation的缩写，指直接以录像带/光盘形式发行的动画，不在电视台播放。'
  },
  {
    id: 'cour',
    term: '番剧',
    reading: 'クール',
    category: '行业',
    definition: '日本电视动画的播出周期，通常为一个季度（12-13集）。一部动画可能是1季、2季或多季。',
    example: '这部动画是半年番，共24集。'
  },
  {
    id: 'original-anime',
    term: '原创动画',
    reading: 'オリジナルアニメ',
    category: '行业',
    definition: '没有原作基础，直接以动画形式创作的作品。相比漫改和轻改，原创动画风险更高但也更有创意。'
  },
  {
    id: 'isekai',
    term: '异世界',
    reading: 'いせかい',
    category: '文化',
    definition: '日本动画中的一种题材，主角通常从现实世界穿越到奇幻世界。异世界题材在2010年后非常流行。'
  },
  {
    id: 'moe',
    term: '萌',
    reading: 'もえ',
    category: '文化',
    definition: '日语中表示对虚构角色产生强烈喜爱的感情的用语，也可形容角色可爱。"萌"是日本宅文化的核心概念。'
  },
  {
    id: 'tsundere',
    term: '傲娇',
    reading: 'ツンデレ',
    category: '文化',
    definition: '一种角色性格类型，表面冷淡高傲（ツンツン），内心温柔害羞（デレデレ）。是非常经典的萌属性。',
    example: '她是典型的傲娇角色。'
  },
  {
    id: 'slice-of-life',
    term: '日常系',
    reading: '日常',
    category: '文化',
    definition: '以描写平凡日常生活为主题的动画类型，通常没有激烈的剧情冲突，以温馨治愈著称。'
  },
  {
    id: 'sakuga',
    term: '作画',
    reading: 'さくが',
    category: '技术',
    definition: '指动画中的作画质量，特别指那些画得特别出色的片段。作画迷会特别关注某部动画的作监和原画师。'
  },
  {
    id: 'charisma-design',
    term: '人设',
    reading: 'キャラクターデザイン',
    category: '技术',
    definition: '角色设计的简称，包括角色的外貌、服装、表情等设定。人设的好坏直接影响动画的受欢迎程度。'
  }
];

export interface HistoryEvent {
  id: string;
  year: number;
  era: '80s' | '90s' | '00s';
  title: string;
  description: string;
  significance: string;
  image?: string;
}

export const historyEvents: HistoryEvent[] = [
  {
    id: 'astro-boy',
    year: 1963,
    era: '80s',
    title: '铁臂阿童木开播',
    description: '手冢治虫的《铁臂阿童木》作为日本第一部国产电视动画系列片开播，开创了日本电视动画的历史。',
    significance: '日本TV动画的起点，确立了有限动画的制作方式。'
  },
  {
    id: 'ghibli-founded',
    year: 1985,
    era: '80s',
    title: '吉卜力工作室成立',
    description: '宫崎骏、高畑勋和铃木敏夫共同创立吉卜力工作室，开启了日本动画电影的黄金时代。',
    significance: '日本动画电影的最高水准代表，在全球享有盛誉。'
  },
  {
    id: 'eva',
    year: 1995,
    era: '90s',
    title: '新世纪福音战士播出',
    description: '《新世纪福音战士》播出，引发社会现象级热潮，被称为"御宅族的圣经"。',
    significance: '重塑了日本动画的表现手法和商业模式，影响深远。'
  },
  {
    id: 'pokemon-boom',
    year: 1997,
    era: '90s',
    title: '宝可梦动画全球热潮',
    description: '《精灵宝可梦》动画在全球范围内掀起热潮，皮卡丘成为世界闻名的动画角色。',
    significance: '日本动画全球化的标志性作品，带动了媒体混合营销策略。'
  },
  {
    id: 'digital-animation',
    year: 2000,
    era: '00s',
    title: '数码动画普及',
    description: '进入21世纪后，数码制作逐渐取代传统赛璐璐动画，动画制作进入全数字化时代。',
    significance: '大幅提高了制作效率，降低了成本，也带来了新的表现手法。'
  },
  {
    id: 'spirited-away',
    year: 2001,
    era: '00s',
    title: '千与千寻获奥斯卡',
    description: '宫崎骏导演的《千与千寻》获得第75届奥斯卡最佳动画长片奖，成为首部获此殊荣的日本动画。',
    significance: '日本动画在国际上获得最高认可，艺术价值得到全球肯定。'
  },
  {
    id: 'late-night-anime',
    year: 2006,
    era: '00s',
    title: '深夜动画繁荣',
    description: '深夜时段播出的动画数量激增，面向核心粉丝的动画成为市场重要组成部分。',
    significance: '动画市场细分，小众题材有了生存空间，催生了更多元化的作品。'
  },
  {
    id: 'streaming-age',
    year: 2015,
    era: '00s',
    title: '流媒体时代到来',
    description: 'Netflix等流媒体平台开始进军动画领域，全球同步播出成为常态。',
    significance: '动画的传播方式发生根本改变，国际化制作和发行成为趋势。'
  }
];

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'legendary';
  requirement: string;
  category: 'production' | 'knowledge' | 'collection' | 'achievement';
}

export const badges: Badge[] = [
  {
    id: 'storyboard-apprentice',
    name: '分镜学徒',
    description: '完成了分镜制作的学习',
    icon: 'film',
    rarity: 'bronze',
    requirement: '学习分镜制作流程',
    category: 'production'
  },
  {
    id: 'key-animation-beginner',
    name: '原画新人',
    description: '了解了原画绘制的奥秘',
    icon: 'pen-tool',
    rarity: 'bronze',
    requirement: '学习原画制作流程',
    category: 'production'
  },
  {
    id: 'color-master',
    name: '上色达人',
    description: '掌握了动画上色的技巧',
    icon: 'palette',
    rarity: 'bronze',
    requirement: '学习上色制作流程',
    category: 'production'
  },
  {
    id: 'voice-director',
    name: '配音导演',
    description: '熟悉了动画配音的流程',
    icon: 'mic',
    rarity: 'bronze',
    requirement: '学习配音制作流程',
    category: 'production'
  },
  {
    id: 'production-master',
    name: '制作大师',
    description: '学习了全部动画制作流程',
    icon: 'award',
    rarity: 'gold',
    requirement: '学习所有制作流程',
    category: 'production'
  },
  {
    id: 'storyboard-puzzle',
    name: '故事拼图高手',
    description: '成功完成分镜排序挑战',
    icon: 'puzzle',
    rarity: 'silver',
    requirement: '完成分镜排序互动',
    category: 'achievement'
  },
  {
    id: 'term-scholar',
    name: '术语学者',
    description: '学习了5个以上动画术语',
    icon: 'book-open',
    rarity: 'silver',
    requirement: '学习5个动画术语',
    category: 'knowledge'
  },
  {
    id: 'history-buff',
    name: '历史达人',
    description: '了解了动画发展的重要历史',
    icon: 'clock',
    rarity: 'silver',
    requirement: '学习所有历史事件',
    category: 'knowledge'
  },
  {
    id: 'animation-expert',
    name: '动画专家',
    description: '掌握了丰富的动画知识',
    icon: 'graduation-cap',
    rarity: 'gold',
    requirement: '学习所有术语和历史事件',
    category: 'knowledge'
  },
  {
    id: 'museum-visitor',
    name: '博物馆访客',
    description: '首次来到动画博物馆工坊',
    icon: 'ticket',
    rarity: 'bronze',
    requirement: '首次访问工坊页面',
    category: 'achievement'
  }
];

export const badgeRarityColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  bronze: {
    bg: 'from-amber-700 to-amber-900',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
    glow: 'shadow-amber-500/30'
  },
  silver: {
    bg: 'from-gray-400 to-gray-600',
    text: 'text-gray-300',
    border: 'border-gray-400/50',
    glow: 'shadow-gray-400/30'
  },
  gold: {
    bg: 'from-yellow-400 to-amber-600',
    text: 'text-yellow-300',
    border: 'border-yellow-400/50',
    glow: 'shadow-yellow-400/30'
  },
  legendary: {
    bg: 'from-purple-400 via-pink-500 to-red-500',
    text: 'text-purple-200',
    border: 'border-purple-400/50',
    glow: 'shadow-purple-500/50'
  }
};
