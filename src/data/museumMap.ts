import { MapData, NPC, EraType } from '@/types';
import { ERA_INFO } from '@/types';

const imgPrompt = (prompt: string, size = 'square') =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

export const npcs: NPC[] = [
  {
    id: 'npc-80s',
    name: '阿诚',
    role: '80年代讲解员',
    position: { x: 250, y: 300 },
    era: '80s',
    avatar: imgPrompt('retro 1980s anime tour guide character, male with big hair, neon pink and cyan outfit, pixel art style, friendly smile, holding clipboard', 'square'),
    dialogues: [
      '欢迎来到80年代展区！我是讲解员阿诚。',
      '这里是电视动画的黄金时代，无数经典从这里诞生。',
      '想听听80年代动画的故事吗？',
    ],
    eraStory: {
      title: '80年代 - 电视动画的黄金起步期',
      content: [
        '80年代是电视动画蓬勃发展的黄金年代。随着彩色电视机的普及，动画开始走进千家万户。',
        '这一时期，日本动画产业迎来爆发式增长，《哆啦A梦》《龙珠》《圣斗士星矢》等传世经典相继问世。',
        '美国动画也不甘示弱，《变形金刚》通过巧妙的商业运作，将玩具与动画完美结合，创造了文化奇迹。',
        '80年代的动画画风鲜明，色彩浓烈，充满了那个年代特有的激情与梦想。像素化的画面和电子合成音，成为一代人最珍贵的记忆。',
        '走进80年代展区，让我们一起重温那个热血与纯真并存的年代吧！',
      ],
    },
  },
  {
    id: 'npc-90s',
    name: '小晴',
    role: '90年代讲解员',
    position: { x: 750, y: 300 },
    era: '90s',
    avatar: imgPrompt('1990s anime tour guide character, female with long flowing hair, warm orange and teal outfit, watercolor art style, gentle smile, holding anime artbook', 'square'),
    dialogues: [
      '你好呀！我是90年代的讲解员小晴。',
      '90年代是动画艺术的巅峰时期，百花齐放，佳作频出。',
      '让我为你讲讲那个黄金年代的故事吧！',
    ],
    eraStory: {
      title: '90年代 - 动画艺术的巅峰时期',
      content: [
        '90年代被誉为动画史上的"黄金十年"。这一时期，动画从儿童娱乐升级为一种严肃的艺术形式。',
        '《美少女战士》开创了魔法少女战斗的新流派，影响了后续无数作品。',
        '《灌篮高手》让篮球热血席卷全亚洲，至今仍被视为体育动画的天花板。',
        '《名侦探柯南》与《海贼王》则开启了超长篇连载的时代，陪伴了几代人的成长。',
        '90年代动画在人物塑造、叙事深度和情感表达上都达到了新高度。手绘的细腻笔触和温暖色调，是那个年代独有的浪漫。',
      ],
    },
  },
  {
    id: 'npc-00s',
    name: '小光',
    role: '2000年代讲解员',
    position: { x: 500, y: 500 },
    era: '00s',
    avatar: imgPrompt('2000s cyber anime tour guide character, male with futuristic haircut, purple and yellow techwear outfit, cyberpunk style, confident smile, holding holographic tablet', 'square'),
    dialogues: [
      '欢迎来到数字时代！我是00年代讲解员小光。',
      '2000年代见证了数字动画革命，技术带来了无限可能。',
      '想了解数字动画是如何改变一切的吗？',
    ],
    eraStory: {
      title: '2000年代 - 数字动画革命',
      content: [
        '进入21世纪，数字技术彻底改变了动画的制作方式。传统手绘逐渐被CGI取代，画面表现力实现了质的飞跃。',
        '《火影忍者》《死神》《海贼王》并称"三大民工漫"，统治了整个2000年代的少年动画市场。',
        '中国动画也在这个时期开始复苏，《哪吒传奇》《喜羊羊与灰太狼》等作品陪伴了无数中国孩子的童年。',
        '到了2010年代以后，《进击的巨人》《鬼灭之刃》等作品以电影级的制作水准，将动画推向了新的艺术高度。',
        '00年代的动画，不仅在技术上日新月异，在题材深度和世界观构建上也更加成熟多元。数字革命让想象力不再受限于画笔！',
      ],
    },
  },
];

export const museumMapData: MapData = {
  width: 1200,
  height: 800,
  exhibits: [
    {
      id: 'exhibit-entrance',
      name: '博物馆入口',
      position: { x: 520, y: 680 },
      size: { width: 160, height: 80 },
      era: 'entrance',
      description: '欢迎来到动画片博物馆！',
      linkPath: '/',
    },
    {
      id: 'exhibit-80s',
      name: '80年代展区',
      position: { x: 100, y: 150 },
      size: { width: 280, height: 180 },
      era: '80s',
      description: ERA_INFO['80s'].description,
      linkPath: '/era/80s',
    },
    {
      id: 'exhibit-90s',
      name: '90年代展区',
      position: { x: 820, y: 150 },
      size: { width: 280, height: 180 },
      era: '90s',
      description: ERA_INFO['90s'].description,
      linkPath: '/era/90s',
    },
    {
      id: 'exhibit-00s',
      name: '2000年代展区',
      position: { x: 460, y: 150 },
      size: { width: 280, height: 180 },
      era: '00s',
      description: ERA_INFO['00s'].description,
      linkPath: '/era/00s',
    },
    {
      id: 'exhibit-time-corridor',
      name: '时间长廊',
      position: { x: 100, y: 450 },
      size: { width: 180, height: 120 },
      era: 'entrance',
      description: '沿着时间轴探索动画发展的历史脉络',
      linkPath: '/time-corridor',
    },
    {
      id: 'exhibit-characters',
      name: '角色博物馆',
      position: { x: 920, y: 450 },
      size: { width: 180, height: 120 },
      era: 'entrance',
      description: '邂逅所有经典动画角色',
      linkPath: '/characters',
    },
    {
      id: 'exhibit-workshop',
      name: '制作工坊',
      position: { x: 100, y: 620 },
      size: { width: 180, height: 80 },
      era: 'entrance',
      description: '体验动画制作的乐趣',
      linkPath: '/workshop',
    },
    {
      id: 'exhibit-treasure',
      name: '寻宝模式',
      position: { x: 920, y: 620 },
      size: { width: 180, height: 80 },
      era: 'entrance',
      description: '在博物馆中寻找隐藏的宝藏',
      linkPath: '/treasure-hunt',
    },
    {
      id: 'exhibit-repair',
      name: '修复中心',
      position: { x: 510, y: 620 },
      size: { width: 180, height: 80 },
      era: 'entrance',
      description: '扮演数字修复师，修复珍贵的老动画胶片',
      linkPath: '/repair-center',
    },
  ],
  npcs,
  obstacles: [
    { x: 30, y: 30, width: 1140, height: 20 },
    { x: 30, y: 750, width: 1140, height: 20 },
    { x: 30, y: 30, width: 20, height: 720 },
    { x: 1150, y: 30, width: 20, height: 720 },
  ],
};

export const getNPCByEra = (era: EraType): NPC | undefined => {
  return npcs.find((npc) => npc.era === era);
};
