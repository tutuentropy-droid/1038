import { CrossAnimeRelation, SimilarCharacterPair, RelationQuest, CrossRelationType } from '@/types';

export const CROSS_RELATION_TYPE_CONFIG: Record<CrossRelationType, { label: string; color: string; icon: string }> = {
  friend: { label: '朋友', color: '#4FC3F7', icon: '🤝' },
  rival: { label: '宿敌', color: '#EF5350', icon: '⚔️' },
  mentor: { label: '师徒', color: '#AB47BC', icon: '📜' },
  family: { label: '家人', color: '#FF7043', icon: '🏠' },
};

export const crossAnimeRelations: CrossAnimeRelation[] = [
  {
    id: 'cr-1',
    fromCharacterId: 'db-1',
    toCharacterId: 'n-1',
    type: 'friend',
    label: '热血主角',
    description: '悟空和鸣人都是天真热血的战斗型主角，从小孤独却从不放弃，用乐观感染身边的伙伴。',
  },
  {
    id: 'cr-2',
    fromCharacterId: 'db-1',
    toCharacterId: 'op-1',
    type: 'friend',
    label: '冒险搭档',
    description: '悟空和路飞都是热爱冒险的天真少年，对食物和战斗同样执着，身边都聚集了一群可靠的伙伴。',
  },
  {
    id: 'cr-3',
    fromCharacterId: 'n-1',
    toCharacterId: 'op-1',
    type: 'friend',
    label: '热血继承者',
    description: '鸣人和路飞同为热血少年漫主角，都有不服输的意志，都为伙伴不顾一切，梦想都是站在顶点。',
  },
  {
    id: 'cr-4',
    fromCharacterId: 'n-2',
    toCharacterId: 'sd-2',
    type: 'rival',
    label: '冷酷天才',
    description: '佐助和流川枫都是冷酷的天才型角色，话少实力强，和主角形成了经典的宿敌关系。',
  },
  {
    id: 'cr-5',
    fromCharacterId: 'n-1',
    toCharacterId: 'sd-1',
    type: 'friend',
    label: '永不放弃',
    description: '鸣人和樱木都是"永不放弃"精神的化身，虽天赋异于常人但起点最低，靠努力逆风翻盘。',
  },
  {
    id: 'cr-6',
    fromCharacterId: 'tf-1',
    toCharacterId: 'ss-1',
    type: 'friend',
    label: '正义领袖',
    description: '擎天柱和星矢都是为了正义而战的领袖型角色，始终守护同伴，即使面对绝境也绝不退缩。',
  },
  {
    id: 'cr-7',
    fromCharacterId: 'tf-1',
    toCharacterId: 'tf-2',
    type: 'rival',
    label: '永恒对立',
    description: '擎天柱与威震天的宿敌关系贯穿整个变形金刚系列，是动画史上最经典的对立关系之一。',
  },
  {
    id: 'cr-8',
    fromCharacterId: 'n-1',
    toCharacterId: 'n-2',
    type: 'rival',
    label: '命运之友',
    description: '鸣人与佐助从同伴到对立再到和解，是少年漫画中最深刻的亦敌亦友关系。',
  },
  {
    id: 'cr-9',
    fromCharacterId: 'sm-1',
    toCharacterId: 'ss-1',
    type: 'friend',
    label: '守护之者',
    description: '月野兔和星矢都是为了守护重要之人而战斗的普通少年，从懦弱成长为真正的战士。',
  },
  {
    id: 'cr-10',
    fromCharacterId: 'dc-1',
    toCharacterId: 'b-1',
    type: 'friend',
    label: '非自愿的英雄',
    description: '柯南和一护都是非自愿踏上战斗之路的少年，本来过着普通生活，却因为意外获得了力量。',
  },
  {
    id: 'cr-11',
    fromCharacterId: 'aot-1',
    toCharacterId: 'ds-1',
    type: 'friend',
    label: '命运抗争者',
    description: '艾伦和炭治郎都因家人被残酷夺走而踏上战斗之路，为了保护重要之人不惜一切。',
  },
  {
    id: 'cr-12',
    fromCharacterId: 'aot-2',
    toCharacterId: 'ds-2',
    type: 'family',
    label: '守护至亲',
    description: '三笠守护艾伦，祢豆子守护炭治郎，两人都是拼尽全力守护最亲近之人的女性角色。',
  },
  {
    id: 'cr-13',
    fromCharacterId: 'ss-2',
    toCharacterId: 'ss-3',
    type: 'family',
    label: '兄弟羁绊',
    description: '瞬和一辉是亲兄弟，一辉表面冷酷实则深爱弟弟，是动画中最感人的兄弟关系之一。',
  },
  {
    id: 'cr-14',
    fromCharacterId: 'ds-1',
    toCharacterId: 'ds-2',
    type: 'family',
    label: '兄妹之情',
    description: '炭治郎和祢豆子的兄妹羁绊是鬼灭之刃的核心，即使祢豆子变成鬼也不放弃。',
  },
  {
    id: 'cr-15',
    fromCharacterId: 'sd-1',
    toCharacterId: 'sd-2',
    type: 'rival',
    label: '天才之争',
    description: '樱木自称天才与流川的真正天才形成经典对比，从竞争到默契是成长的最佳写照。',
  },
  {
    id: 'cr-16',
    fromCharacterId: 'doraemon-1',
    toCharacterId: 'nezha-1',
    type: 'friend',
    label: '超能力伙伴',
    description: '哆啦A梦和哪吒都拥有超常力量，却用来帮助身边的人，是纯真善良的代表。',
  },
  {
    id: 'cr-17',
    fromCharacterId: 'pg-1',
    toCharacterId: 'pg-2',
    type: 'rival',
    label: '猫鼠游戏',
    description: '喜羊羊和灰太狼是经典的对手关系，永远斗智斗勇却从不会真正伤害对方。',
  },
  {
    id: 'cr-18',
    fromCharacterId: 'dc-1',
    toCharacterId: 'sm-1',
    type: 'friend',
    label: '变身侦探',
    description: '柯南和月野兔都拥有双重身份——普通学生与特殊战士，在双重生活中不断成长。',
  },
  {
    id: 'cr-19',
    fromCharacterId: 'b-1',
    toCharacterId: 'n-1',
    type: 'friend',
    label: '三大民工漫',
    description: '一护和鸣人同为三大民工漫主角，都是为守护而战的热血少年，各自代表了不同世代的少年精神。',
  },
  {
    id: 'cr-20',
    fromCharacterId: 'doraemon-1',
    toCharacterId: 'doraemon-2',
    type: 'mentor',
    label: '守护与成长',
    description: '哆啦A梦是大雄的守护者和人生导师，用未来道具帮助他成长，却也教会他自己面对困难。',
  },
  {
    id: 'cr-21',
    fromCharacterId: 'dc-3',
    toCharacterId: 'b-2',
    type: 'friend',
    label: '神秘少女',
    description: '灰原哀和露琪亚都是来自另一个世界的神秘少女，都有着不为人知的过去，在关键时刻给予主角重要帮助。',
  },
  {
    id: 'cr-22',
    fromCharacterId: 'op-2',
    toCharacterId: 'sd-2',
    type: 'friend',
    label: '沉默实力派',
    description: '索隆和流川都是沉默寡言的实力派，话不多但实力顶尖，对目标有着执着的追求。',
  },
  {
    id: 'cr-23',
    fromCharacterId: 'aot-3',
    toCharacterId: 'sd-3',
    type: 'mentor',
    label: '严格队长',
    description: '利威尔兵长和赤木队长都是严格的领导者，对队员要求极高，但也深爱着团队。',
  },
  {
    id: 'cr-24',
    fromCharacterId: 'n-3',
    toCharacterId: 'ds-3',
    type: 'mentor',
    label: '热血导师',
    description: '卡卡西和富冈义勇都是实力强大的导师角色，外表冷淡但内心温柔，指引主角成长。',
  },
  {
    id: 'cr-25',
    fromCharacterId: 'db-2',
    toCharacterId: 'n-2',
    type: 'rival',
    label: '天才竞争者',
    description: '贝吉塔和佐助都是骄傲的天才，始终追逐着主角的背影，在竞争中不断成长。',
  },
  {
    id: 'cr-26',
    fromCharacterId: 'op-3',
    toCharacterId: 'dc-2',
    type: 'friend',
    label: '智慧参谋',
    description: '娜美和毛利兰都是团队中的智慧担当，关键时刻总能给出正确的判断。',
  },
  {
    id: 'cr-27',
    fromCharacterId: 'sm-2',
    toCharacterId: 'ss-2',
    type: 'friend',
    label: '温柔战士',
    description: '水野亚美和阿瞬都是外表温柔内心坚强的战士，用智慧和善良守护着伙伴。',
  },
  {
    id: 'cr-28',
    fromCharacterId: 'nezha-1',
    toCharacterId: 'ss-1',
    type: 'friend',
    label: '不屈少年',
    description: '哪吒和星矢都是永不言败的少年，面对强大的敌人也绝不退缩，用信念创造奇迹。',
  },
  {
    id: 'cr-29',
    fromCharacterId: 'doraemon-3',
    toCharacterId: 'sm-1',
    type: 'friend',
    label: '邻家女孩',
    description: '静香和月野兔都是温柔善良的邻家女孩形象，是主角心中最柔软的存在。',
  },
  {
    id: 'cr-30',
    fromCharacterId: 'pg-1',
    toCharacterId: 'db-1',
    type: 'friend',
    label: '乐观勇者',
    description: '喜羊羊和孙悟空都有着乐观开朗的性格，面对困难总能保持笑容，用智慧化解危机。',
  },
  {
    id: 'cr-31',
    fromCharacterId: 'dc-1',
    toCharacterId: 'ds-1',
    type: 'friend',
    label: '推理战士',
    description: '柯南和炭治郎都有着敏锐的观察力和坚定的意志，用智慧和勇气守护身边的人。',
  },
  {
    id: 'cr-32',
    fromCharacterId: 'ss-1',
    toCharacterId: 'db-1',
    type: 'friend',
    label: '不灭斗志',
    description: '星矢和悟空都是打不倒的热血少年，无论倒下多少次都会重新站起来，越战越强。',
  },
  {
    id: 'cr-33',
    fromCharacterId: 'sm-1',
    toCharacterId: 'n-1',
    type: 'friend',
    label: '吊车尾逆袭',
    description: '月野兔和鸣人都是一开始的吊车尾，靠着不懈努力和伙伴的支持成长为最强的战士。',
  },
  {
    id: 'cr-34',
    fromCharacterId: 'aot-1',
    toCharacterId: 'b-1',
    type: 'friend',
    label: '死神之力',
    description: '艾伦和一护都在某个瞬间获得了改变命运的力量，从普通人变为战斗者。',
  },
  {
    id: 'cr-35',
    fromCharacterId: 'tf-1',
    toCharacterId: 'ss-1',
    type: 'friend',
    label: '正义领袖',
    description: '擎天柱和星矢都是正义的化身，为了保护所爱之人和世界和平而战。',
  },
  {
    id: 'cr-36',
    fromCharacterId: 'nezha-1',
    toCharacterId: 'n-1',
    type: 'friend',
    label: '我命由我',
    description: '哪吒和鸣人都不信命运，靠着自己的努力和不服输的精神改变了人生轨迹。',
  },
  {
    id: 'cr-37',
    fromCharacterId: 'doraemon-1',
    toCharacterId: 'ds-1',
    type: 'mentor',
    label: '温柔守护',
    description: '哆啦A梦和炭治郎都有着温柔善良的心，用自己的方式守护着重要的人。',
  },
];

export const similarCharacterPairs: SimilarCharacterPair[] = [
  {
    id: 'sim-1',
    characterIdA: 'db-1',
    characterIdB: 'op-1',
    reason: '同为热血少年漫主角，性格天真开朗，对战斗和食物同样执着，都有强大的意志力和感染力。',
    tags: ['热血主角', '战斗型', '吃货属性', '乐观精神'],
  },
  {
    id: 'sim-2',
    characterIdA: 'db-1',
    characterIdB: 'n-1',
    reason: '都是从小孤独的战斗型少年，拥有强大的力量却始终保持纯真，靠不懈努力赢得认可。',
    tags: ['热血主角', '孤独童年', '强大力量', '纯真善良'],
  },
  {
    id: 'sim-3',
    characterIdA: 'n-2',
    characterIdB: 'sd-2',
    reason: '都是冷酷天才型角色，话少实力强，与主角形成经典宿敌关系，内心却有柔软的一面。',
    tags: ['冷酷天才', '沉默寡言', '宿敌', '隐藏温柔'],
  },
  {
    id: 'sim-4',
    characterIdA: 'sm-1',
    characterIdB: 'ss-1',
    reason: '都是普通少年被命运选中成为守护者，从懦弱成长为真正的战士，为守护重要之人而战。',
    tags: ['普通少年', '命运守护', '成长蜕变', '爱的力量'],
  },
  {
    id: 'sim-5',
    characterIdA: 'aot-2',
    characterIdB: 'ds-2',
    reason: '都是为守护至亲而拼尽全力的女性角色，拥有强大战斗力，是主角最坚强的后盾。',
    tags: ['守护至亲', '强大女性', '战斗天赋', '深沉感情'],
  },
  {
    id: 'sim-6',
    characterIdA: 'dc-1',
    characterIdB: 'b-1',
    reason: '都是非自愿获得力量的普通少年，被迫踏入战斗世界，为守护日常而战。',
    tags: ['非自愿英雄', '双重身份', '守护日常', '意外觉醒'],
  },
  {
    id: 'sim-7',
    characterIdA: 'op-2',
    characterIdB: 'sd-2',
    reason: '都是沉默寡言的实力派角色，话不多但实力顶尖，对目标有执着追求。',
    tags: ['沉默实力派', '剑术高手', '目标执着', '冷酷外表'],
  },
  {
    id: 'sim-8',
    characterIdA: 'aot-1',
    characterIdB: 'ds-1',
    reason: '都因家人被夺走而踏上战斗之路，性格善良却被命运逼向残酷选择。',
    tags: ['命运抗争', '家人被夺', '善良本心', '残酷选择'],
  },
  {
    id: 'sim-9',
    characterIdA: 'db-2',
    characterIdB: 'n-2',
    reason: '都是骄傲的天才角色，始终追逐着主角的背影，在竞争中不断超越自我。',
    tags: ['天才', '骄傲', '竞争者', '亦敌亦友'],
  },
  {
    id: 'sim-10',
    characterIdA: 'n-3',
    characterIdB: 'ds-3',
    reason: '都是实力强大的导师型角色，外表冷淡但内心温柔，是主角成长路上的引路人。',
    tags: ['导师', '外冷内热', '实力强大', '引路人'],
  },
  {
    id: 'sim-11',
    characterIdA: 'sm-2',
    characterIdB: 'ss-2',
    reason: '都是外表温柔内心坚强的战士，用智慧和善良守护着身边的伙伴。',
    tags: ['温柔战士', '智慧型', '内心坚强', '守护者'],
  },
  {
    id: 'sim-12',
    characterIdA: 'op-2',
    characterIdB: 'n-2',
    reason: '都是主角的第一个伙伴和对手，实力强大，对目标有着执着的追求。',
    tags: ['第一伙伴', '实力强大', '目标执着', '剑士'],
  },
];

export const relationQuests: RelationQuest[] = [
  {
    id: 'rq-1',
    title: '热血三角',
    description: '找到三位拥有相同"热血主角"属性的角色，发现他们之间的友谊纽带。',
    type: 'find_similar',
    hint: '他们分别来自龙珠、火影忍者和海贼王，都用笑容面对困难。',
    targetIds: ['db-1', 'n-1', 'op-1'],
    reward: 100,
    isCompleted: false,
  },
  {
    id: 'rq-2',
    title: '宿敌对决',
    description: '追踪三对经典宿敌关系，感受对立中迸发的火花。',
    type: 'discover_link',
    hint: '擎天柱vs威震天、鸣人vs佐助、樱木vs流川——宿敌让彼此更强。',
    targetIds: ['cr-7', 'cr-8', 'cr-15'],
    reward: 120,
    isCompleted: false,
  },
  {
    id: 'rq-3',
    title: '守护之路',
    description: '找到两位为守护至亲而战的女性角色，发现她们的共同点。',
    type: 'find_similar',
    hint: '一个守护青梅竹马，一个守护哥哥——她们都来自近年的热门作品。',
    targetIds: ['aot-2', 'ds-2'],
    reward: 80,
    isCompleted: false,
  },
  {
    id: 'rq-4',
    title: '兄弟情深',
    description: '发现两组以兄弟/兄妹关系为核心的角色对。',
    type: 'discover_link',
    hint: '一辉守护着瞬，炭治郎守护着祢豆子——血浓于水的羁绊。',
    targetIds: ['cr-13', 'cr-14'],
    reward: 90,
    isCompleted: false,
  },
  {
    id: 'rq-5',
    title: '双重身份',
    description: '找到拥有双重身份的角色，探索他们在平凡与非凡之间的平衡。',
    type: 'find_similar',
    hint: '一个变小的高中生侦探，一个变身战斗的普通少女。',
    targetIds: ['dc-1', 'sm-1'],
    reward: 80,
    isCompleted: false,
  },
  {
    id: 'rq-6',
    title: '非自愿英雄',
    description: '追踪那些并非自愿却不得不战斗的角色，发现他们的共同命运。',
    type: 'trace_path',
    hint: '工藤新一被灌药变小，黑崎一护被动获得死神之力——命运选择了他们。',
    targetIds: ['dc-1', 'b-1'],
    reward: 100,
    isCompleted: false,
  },
  {
    id: 'rq-7',
    title: '宇宙连线',
    description: '找到一条从孙悟空到炭治郎的关系路径，跨越多个作品的角色链路。',
    type: 'trace_path',
    hint: '悟空→鸣人→一护→柯南→炭治郎，每一步都是相似命运的传递。',
    targetIds: ['db-1', 'n-1', 'b-1', 'dc-1', 'ds-1'],
    reward: 150,
    isCompleted: false,
  },
  {
    id: 'rq-8',
    title: '师者传承',
    description: '发现角色之间的师徒关系，感受知识与信念的传递。',
    type: 'discover_link',
    hint: '哆啦A梦教导大雄，利威尔训练新兵，赤木带领湘北——传承从不停止。',
    targetIds: ['cr-20', 'cr-23'],
    reward: 100,
    isCompleted: false,
  },
  {
    id: 'rq-9',
    title: '温柔战士',
    description: '找到两位外表温柔内心坚强的女性战士角色。',
    type: 'find_similar',
    hint: '一个是水的战士，一个是青铜圣斗士——她们都用温柔的力量守护世界。',
    targetIds: ['sm-2', 'ss-2'],
    reward: 80,
    isCompleted: false,
  },
  {
    id: 'rq-10',
    title: '骄傲的天才',
    description: '发现两位骄傲的天才角色，他们始终追逐着主角的背影。',
    type: 'find_similar',
    hint: '一个是赛亚人王子，一个是宇智波末裔——骄傲是他们的底色。',
    targetIds: ['db-2', 'n-2'],
    reward: 90,
    isCompleted: false,
  },
  {
    id: 'rq-11',
    title: '跨世纪连线',
    description: '找到一条从80年代到00年代的角色关系路径。',
    type: 'trace_path',
    hint: '从哆啦A梦开始，经过多个时代的角色，最终到达鬼灭之刃。',
    targetIds: ['doraemon-1', 'db-1', 'n-1', 'ds-1'],
    reward: 200,
    isCompleted: false,
  },
  {
    id: 'rq-12',
    title: '导师之路',
    description: '发现两位外表冷淡内心温柔的导师型角色。',
    type: 'find_similar',
    hint: '卡卡西和富冈义勇——他们的面罩下藏着怎样的温柔？',
    targetIds: ['n-3', 'ds-3'],
    reward: 80,
    isCompleted: false,
  },
  {
    id: 'rq-13',
    title: '全家团圆',
    description: '发现所有的家人关系，感受亲情的力量。',
    type: 'discover_link',
    hint: '兄弟、兄妹、守护至亲——家人是最坚强的后盾。',
    targetIds: ['cr-12', 'cr-13', 'cr-14'],
    reward: 150,
    isCompleted: false,
  },
  {
    id: 'rq-14',
    title: '中日合璧',
    description: '找到中国和日本动画角色之间的友谊纽带。',
    type: 'discover_link',
    hint: '哪吒和星矢，喜羊羊和孙悟空——跨越国界的友情。',
    targetIds: ['cr-16', 'cr-28', 'cr-30'],
    reward: 120,
    isCompleted: false,
  },
];

export const getRelationsForCharacter = (characterId: string): CrossAnimeRelation[] => {
  return crossAnimeRelations.filter(
    (r) => r.fromCharacterId === characterId || r.toCharacterId === characterId
  );
};

export const getSimilarPairsForCharacter = (characterId: string): SimilarCharacterPair[] => {
  return similarCharacterPairs.filter(
    (p) => p.characterIdA === characterId || p.characterIdB === characterId
  );
};

export const findRelationPath = (
  startId: string,
  endId: string,
  relations: CrossAnimeRelation[]
): string[] | null => {
  if (startId === endId) return [startId];

  const adjacencyList: Record<string, string[]> = {};
  relations.forEach((rel) => {
    if (!adjacencyList[rel.fromCharacterId]) {
      adjacencyList[rel.fromCharacterId] = [];
    }
    if (!adjacencyList[rel.toCharacterId]) {
      adjacencyList[rel.toCharacterId] = [];
    }
    adjacencyList[rel.fromCharacterId].push(rel.toCharacterId);
    adjacencyList[rel.toCharacterId].push(rel.fromCharacterId);
  });

  const visited = new Set<string>();
  const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
  visited.add(startId);

  while (queue.length > 0) {
    const current = queue.shift()!;

    const neighbors = adjacencyList[current.id] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const newPath = [...current.path, neighbor];
        if (neighbor === endId) {
          return newPath;
        }
        queue.push({ id: neighbor, path: newPath });
      }
    }
  }

  return null;
};
