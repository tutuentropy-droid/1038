import { Anime, EraType } from '@/types';

const imgPrompt = (prompt: string, size = 'portrait_4_3') => 
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

export const animes: Anime[] = [
  {
    id: 'doraemon',
    title: '哆啦A梦',
    originalTitle: 'ドラえもん',
    year: 1979,
    era: '80s',
    genres: ['科幻', '喜剧', '冒险'],
    poster: imgPrompt('Doraemon anime poster, blue robot cat, Nobita, magical gadgets, retro 1980s anime style, colorful, nostalgic'),
    description: '来自22世纪的猫型机器人哆啦A梦，受主人野比世修的托付，回到20世纪，借助从四维口袋里拿出来的各种未来道具，来帮助世修的高祖父——小学生野比大雄化解身边的种种困难问题，以及生活中和妈妈野比玉子、身边的小伙伴静香、胖虎、小夫发生的轻松幽默搞笑感人的故事。',
    episodes: 2000,
    studio: 'SHIN-EI动画',
    director: '楠叶宏三',
    rating: 9.6,
    characters: [
      {
        id: 'doraemon-1',
        name: '哆啦A梦',
        image: imgPrompt('Doraemon character, blue robot cat, round face, red nose, smiling, white belly pocket, cute cartoon style', 'square'),
        description: '来自22世纪的猫型育儿机器人，拥有神奇的四次元口袋，心肠好，乐于助人，但却心肠软。',
        voiceActor: '大山羡代 / 水田山葵'
      },
      {
        id: 'doraemon-2',
        name: '野比大雄',
        image: imgPrompt('Nobita Nobi anime character, boy with glasses, blue shirt, yellow shorts, sad expression but kind eyes, cartoon style', 'square'),
        description: '故事的主角，性子懦弱，胆小怕事，丢三落四。但有责任心，善良正直。',
        voiceActor: '小原乃梨子 / 大原惠美'
      },
      {
        id: 'doraemon-3',
        name: '源静香',
        image: imgPrompt('Shizuka Minamoto anime character, cute girl with pigtails, pink dress, sweet smile, kind eyes, cartoon style', 'square'),
        description: '大雄的青梅竹马，聪明乖巧，成绩优秀，人见人爱的女孩子。',
        voiceActor: '野村道子 / 嘉数由美'
      }
    ],
    classicClips: [
      {
        id: 'doraemon-clip-1',
        episode: '第1集',
        title: '来自未来世界的机器人',
        description: '大雄的房间抽屉突然打开，来自22世纪的蓝色机器人哆啦A梦出现了，改变了大雄的命运。',
        quote: '你好，我叫哆啦A梦，来自22世纪！'
      },
      {
        id: 'doraemon-clip-2',
        episode: '特别篇',
        title: '大雄的结婚前夜',
        description: '大雄用时光机去看自己结婚的前夜，看到了静香和家人的感人对话。',
        quote: '大雄，我相信你一定可以的！'
      }
    ]
  },
  {
    id: 'transformers',
    title: '变形金刚',
    originalTitle: 'Transformers',
    year: 1984,
    era: '80s',
    genres: ['科幻', '动作', '机甲'],
    poster: imgPrompt('Transformers G1 anime poster, Optimus Prime, Megatron, Autobots vs Decepticons, epic battle, retro 80s cartoon style, dynamic action'),
    description: '在遥远的宇宙中有一个星球——赛博特恩。星球上有一种金属生命体，他们在近百万年间分化成正义的汽车人和邪恶的霸天虎。两军进行了几百万年的战争，星球能源耗尽霸天虎追随汽车人来到了地球。',
    episodes: 98,
    studio: 'Sunbow Productions',
    director: 'John Gibbs',
    rating: 9.3,
    characters: [
      {
        id: 'tf-1',
        name: '擎天柱',
        image: imgPrompt('Optimus Prime Transformers G1, red and blue truck robot, brave leader, glowing blue eyes, holding laser rifle, heroic pose', 'square'),
        description: '汽车人领袖，正直、强壮、博爱、杰出的战士，在任何环境下都能完美完成任务。',
        voiceActor: 'Peter Cullen'
      },
      {
        id: 'tf-2',
        name: '威震天',
        image: imgPrompt('Megatron Transformers G1, silver and purple robot, evil leader, glowing red eyes, menacing expression, holding fusion cannon', 'square'),
        description: '霸天虎首领，冷酷无情，残暴但并不完全邪恶，为了塞伯坦的复兴而战。',
        voiceActor: 'Frank Welker'
      }
    ],
    classicClips: [
      {
        id: 'tf-clip-1',
        episode: '第1集',
        title: '第一天',
        description: '汽车人和霸天虎在地球苏醒，开始了新一轮的战斗。',
        quote: '汽车人，变形出发！'
      },
      {
        id: 'tf-clip-2',
        episode: '大电影',
        title: '擎天柱之死',
        description: '擎天柱在与威震天的决战中重伤身亡，将领导模块传给了热破。',
        quote: '有时就连我们中最强大的战士，也需要帮助。'
      }
    ]
  },
  {
    id: 'saint-seiya',
    title: '圣斗士星矢',
    originalTitle: '聖闘士星矢',
    year: 1986,
    era: '80s',
    genres: ['热血', '战斗', '神话'],
    poster: imgPrompt('Saint Seiya anime poster, Pegasus Seiya, Gold Saints, Athena Saori, epic fantasy battle, 1980s retro anime style, cosmic energy'),
    description: '在遥远的神话时代，海神波塞冬、冥王哈迪斯等神多次想要夺取大地，但是，每次都有一群充满勇气与力量的少年们出现，他们被称为女神雅典娜的圣斗士。青铜圣斗士天马座星矢等人为了守护雅典娜，经历了无数战斗。',
    episodes: 114,
    studio: '东映动画',
    director: '森下孝三',
    rating: 9.2,
    characters: [
      {
        id: 'ss-1',
        name: '天马座星矢',
        image: imgPrompt('Pegasus Seiya Saint Seiya, bronze cloth armor, brown hair, determined expression, cosmic energy aura, anime style', 'square'),
        description: '故事主角，天马座青铜圣斗士。从小被送去希腊圣域接受圣斗士训练，性格热血冲动，但重友情。',
        voiceActor: '古谷彻'
      },
      {
        id: 'ss-2',
        name: '仙女座瞬',
        image: imgPrompt('Andromeda Shun Saint Seiya, bronze cloth, green hair, gentle expression, Nebula Chain, pink and green armor', 'square'),
        description: '一辉的弟弟，仙女座青铜圣斗士。性格温柔善良，不喜欢战斗，但在关键时刻会爆发惊人力量。',
        voiceActor: '堀川亮'
      },
      {
        id: 'ss-3',
        name: '凤凰座一辉',
        image: imgPrompt('Phoenix Ikki Saint Seiya, bronze cloth, blue hair, cold expression, flames aura, strongest bronze saint', 'square'),
        description: '瞬的哥哥，凤凰座青铜圣斗士。性格冷酷，实力强大，被称为"不死鸟"。',
        voiceActor: '小西克幸'
      }
    ],
    classicClips: [
      {
        id: 'ss-clip-1',
        episode: '第1集',
        title: '雅典娜的圣斗士',
        description: '星矢在希腊圣域获得天马座圣衣，回到日本参加银河战争。',
        quote: '燃烧吧，我的小宇宙！天马流星拳！'
      },
      {
        id: 'ss-clip-2',
        episode: '黄道十二宫篇',
        title: '沙加的觉悟',
        description: '在沙罗双树园，沙加领悟第八感，从容面对死亡。',
        quote: '花开了，然后会凋零，星星是璀璨的，可那光芒也会消失。'
      }
    ]
  },
  {
    id: 'dragon-ball',
    title: '龙珠',
    originalTitle: 'ドラゴンボール',
    year: 1986,
    era: '80s',
    genres: ['热血', '冒险', '战斗'],
    poster: imgPrompt('Dragon Ball anime poster, Son Goku, Kamehameha energy blast, Dragon Balls, Master Roshi, Bulma, retro 80s anime style, vibrant colors'),
    description: '独自住在深山的少年孙悟空，遇上搜集七龙珠的少女科学家布尔玛，布尔玛为得到悟空拥有的四星七龙珠而带同悟空踏上找寻七龙珠的旅程。长有尾巴的孙悟空天生神力，加上曾得到武师龟仙人的指导修行，在找寻七龙珠的过程中遇到了很多好朋友，也遇到了很多敌人。',
    episodes: 153,
    studio: '东映动画',
    director: '西尾大介',
    rating: 9.5,
    characters: [
      {
        id: 'db-1',
        name: '孙悟空',
        image: imgPrompt('Son Goku Dragon Ball, orange gi, black spiky hair, monkey tail, smiling, energetic pose, martial arts stance, anime style', 'square'),
        description: '故事主角，原名卡卡罗特，是战斗民族赛亚人。性格单纯善良，对战斗有着无限热情。',
        voiceActor: '野泽雅子'
      },
      {
        id: 'db-2',
        name: '布尔玛',
        image: imgPrompt('Bulma Dragon Ball, blue hair, purple dress, holding dragon radar, smart expression, cute anime girl style', 'square'),
        description: '天才少女，为了寻找龙珠而与悟空相遇。是胶囊公司的千金，发明了龙珠雷达。',
        voiceActor: '鹤弘美'
      }
    ],
    classicClips: [
      {
        id: 'db-clip-1',
        episode: '第1集',
        title: '布玛和悟空',
        description: '布尔玛在山中遇到了带着四星龙珠的悟空，两人开始了寻找龙珠的冒险。',
        quote: '我叫孙悟空！你是谁？'
      },
      {
        id: 'db-clip-2',
        episode: '第22届天下第一武道会',
        title: '悟空vs天津饭',
        description: '悟空与天津饭在武道会决赛展开激战，最后悟空惜败但赢得了尊重。',
        quote: '我还没输呢！'
      }
    ]
  },
  {
    id: 'sailor-moon',
    title: '美少女战士',
    originalTitle: '美少女戦士セーラームーン',
    year: 1992,
    era: '90s',
    genres: ['魔法少女', '恋爱', '战斗'],
    poster: imgPrompt('Sailor Moon anime poster, Usagi Tsukino, Sailor Scouts, Tuxedo Mask, magical girl transformation, 90s anime style, pink and blue theme'),
    description: '月野兔是一个平凡的初中生，某天她遇到了一只会说话的黑猫露娜，从此她的命运发生了巨大改变。她变身成为爱与正义的水手服美少女战士水手月亮，与伙伴们一起对抗黑暗势力，保卫地球。',
    episodes: 200,
    studio: '东映动画',
    director: '佐藤顺一',
    rating: 9.1,
    characters: [
      {
        id: 'sm-1',
        name: '月野兔',
        image: imgPrompt('Usagi Tsukino Sailor Moon, blonde hair in buns, sailor uniform, blue eyes, magical girl, holding silver crystal, cute smile', 'square'),
        description: '故事主角，性格活泼开朗，爱哭但重友情。变身为水手月亮，是银千年王国的公主。',
        voiceActor: '三石琴乃'
      },
      {
        id: 'sm-2',
        name: '地场卫',
        image: imgPrompt('Tuxedo Mask Mamoru Chiba, black tuxedo, cape, top hat, mask, red rose, handsome anime guy, mysterious expression', 'square'),
        description: '夜礼服假面，前世是地球王子安迪米欧，今世是大学生地场卫，是小兔的恋人。',
        voiceActor: '古谷彻'
      }
    ],
    classicClips: [
      {
        id: 'sm-clip-1',
        episode: '第1集',
        title: '爱哭鬼的变身',
        description: '月野兔遇到黑猫露娜，第一次变身成为水手月亮，拯救了被妖魔控制的朋友。',
        quote: '爱与正义的水手服美少女战士！水手月亮！我要替月行道，消灭你们！'
      },
      {
        id: 'sm-clip-2',
        episode: '第一部结局',
        title: '最后的战斗',
        description: '水手月亮与伙伴们在银千年王国与贝利尔女王展开最终决战。',
        quote: '即使失去记忆，我也会再次爱上你。'
      }
    ]
  },
  {
    id: 'slam-dunk',
    title: '灌篮高手',
    originalTitle: 'スラムダンク',
    year: 1993,
    era: '90s',
    genres: ['体育', '热血', '校园'],
    poster: imgPrompt('Slam Dunk anime poster, Hanamichi Sakuragi, Shohoku basketball team, red jersey, basketball court, dynamic sports action, 90s anime style'),
    description: '为了讨好同级暗恋对象赤木晴子的欢心，原来毫无篮球基础的樱木花道不加思索就参加了篮球队，而晴子却喜欢从初中开始就一直是明星球员的流川枫。天生的潜质加上不服输的精神，使樱木飞速进步，渐渐成为湘北篮球队不可缺的主力球员。',
    episodes: 101,
    studio: '东映动画',
    director: '西泽信孝',
    rating: 9.7,
    characters: [
      {
        id: 'sd-1',
        name: '樱木花道',
        image: imgPrompt('Hanamichi Sakuragi Slam Dunk, red hair, Shohoku 10 jersey, basketball, excited expression, dynamic pose, anime style', 'square'),
        description: '故事主角，自称"天才"，红发，性格外向开朗，对篮球有着惊人的天赋。',
        voiceActor: '草尾毅'
      },
      {
        id: 'sd-2',
        name: '流川枫',
        image: imgPrompt('Kaede Rukawa Slam Dunk, black hair, Shohoku 11 jersey, cool expression, holding basketball, handsome anime guy', 'square'),
        description: '超级新人，篮球技术一流，性格冷酷，是樱木的竞争对手和队友。',
        voiceActor: '绿川光'
      },
      {
        id: 'sd-3',
        name: '赤木刚宪',
        image: imgPrompt('Takenori Akagi Slam Dunk, Shohoku 4 jersey, captain, serious expression, tall, basketball captain, anime style', 'square'),
        description: '湘北篮球队队长，中锋，绰号"大猩猩"，一直梦想着"称霸全国"。',
        voiceActor: '梁田清之'
      }
    ],
    classicClips: [
      {
        id: 'sd-clip-1',
        episode: '第1集',
        title: '天才篮球手诞生？！',
        description: '樱木花道升入高中，对篮球一窍不通的他为了晴子加入了篮球部。',
        quote: '我是天才！'
      },
      {
        id: 'sd-clip-2',
        episode: '湘北vs陵南',
        title: '最后的灌篮',
        description: '樱木在比赛最后关头完成了决定胜负的灌篮，帮助湘北战胜陵南。',
        quote: '老爹，你最辉煌的时刻是什么时候？是全日本时代吗？而我，就是现在了！'
      }
    ]
  },
  {
    id: 'detective-conan',
    title: '名侦探柯南',
    originalTitle: '名探偵コナン',
    year: 1996,
    era: '90s',
    genres: ['推理', '悬疑', '犯罪'],
    poster: imgPrompt('Detective Conan anime poster, Shinichi Kudo, Conan Edogawa, Ran Mouri, mystery crime scene, magnifying glass, 90s anime style'),
    description: '高中生侦探工藤新一，被称为"日本警察的救世主"、"平成年代的福尔摩斯"。一次在与青梅竹马毛利兰去游乐园游玩时，发现两个行动诡异的黑衣人。新一跟踪他们直到交易现场，另一个黑衣人趁其不注意从后面将他一棒击倒，并灌下一种名为APTX4869的神秘毒药企图杀他灭口，但因为副作用他的身体竟回到发育期的孩童状态。',
    episodes: 1100,
    studio: 'TMS Entertainment',
    director: '儿玉兼嗣',
    rating: 9.6,
    characters: [
      {
        id: 'dc-1',
        name: '江户川柯南',
        image: imgPrompt('Conan Edogawa Detective Conan, child with glasses, blue suit, red bowtie, holding magnifying glass, smart expression, anime style', 'square'),
        description: '外表看似小孩，智慧却过于常人的名侦探。真实身份是高中生侦探工藤新一。',
        voiceActor: '高山南'
      },
      {
        id: 'dc-2',
        name: '毛利兰',
        image: imgPrompt('Ran Mouri Detective Conan, long brown hair, school uniform, karate pose, kind eyes, beautiful anime girl', 'square'),
        description: '新一的青梅竹马，帝丹高中二年级学生，空手道高手，性格温柔善良。',
        voiceActor: '山崎和佳奈'
      },
      {
        id: 'dc-3',
        name: '灰原哀',
        image: imgPrompt('Ai Haibara Detective Conan, short brown hair, cold expression, smart eyes, lab coat, mysterious anime girl', 'square'),
        description: '原黑衣组织成员，代号雪莉，后背叛组织，身体缩小后与柯南成为同学。',
        voiceActor: '林原惠美'
      }
    ],
    classicClips: [
      {
        id: 'dc-clip-1',
        episode: '第1集',
        title: '云霄飞车杀人事件',
        description: '新一与小兰去游乐园约会，遇到杀人事件，之后新一被黑衣人灌下毒药身体缩小。',
        quote: '真相永远只有一个！'
      },
      {
        id: 'dc-clip-2',
        episode: '《瞳孔中的暗杀者》',
        title: '新一向小兰告白',
        description: '在游乐园，柯南向失去记忆的小兰表明心意。',
        quote: '因为我喜欢你，比这个世界上的任何一个人都要喜欢你！'
      }
    ]
  },
  {
    id: 'one-piece',
    title: '海贼王',
    originalTitle: 'ONE PIECE',
    year: 1999,
    era: '90s',
    genres: ['热血', '冒险', '战斗'],
    poster: imgPrompt('One Piece anime poster, Monkey D Luffy, Straw Hat Pirates, Thousand Sunny ship, Grand Line ocean, epic adventure, 90s anime style'),
    description: '拥有财富、名声、权力，这世界上的一切的男人"海贼王"哥尔·D·罗杰，在被行刑受死之前说了一句话，让全世界的人都涌向了大海。"想要我的宝藏吗？如果想要的话，那就到海上去找吧，我全部都放在那里。"于是，所有男子汉们都前往"伟大航路"追寻梦想，世界开始迎接"大海贼时代"的来临。',
    episodes: 1100,
    studio: '东映动画',
    director: '宇田钢之助',
    rating: 9.8,
    characters: [
      {
        id: 'op-1',
        name: '蒙奇·D·路飞',
        image: imgPrompt('Monkey D Luffy One Piece, straw hat, red vest, blue shorts, big smile, stretching rubber arm, energetic, anime style', 'square'),
        description: '草帽海贼团船长，橡胶果实能力者，梦想是找到One Piece成为海贼王。',
        voiceActor: '田中真弓'
      },
      {
        id: 'op-2',
        name: '罗罗诺亚·索隆',
        image: imgPrompt('Roronoa Zoro One Piece, green hair, three swords, pirate hunter, serious expression, bandana, muscular, anime style', 'square'),
        description: '草帽海贼团剑士，三刀流剑士，梦想是成为世界第一大剑豪。',
        voiceActor: '中井和哉'
      },
      {
        id: 'op-3',
        name: '娜美',
        image: imgPrompt('Nami One Piece, orange hair, tattoo on arm, holding map, beautiful pirate girl, smile, bikini top, anime style', 'square'),
        description: '草帽海贼团航海士，擅长偷窃和绘制海图，梦想是绘制世界地图。',
        voiceActor: '冈村明美'
      }
    ],
    classicClips: [
      {
        id: 'op-clip-1',
        episode: '第1集',
        title: '我是路飞！将要成为海贼王的男人！',
        description: '路飞从桶中出现，与克比相遇，开始了寻找One Piece的冒险。',
        quote: '我要成为海贼王！'
      },
      {
        id: 'op-clip-2',
        episode: '第377集',
        title: '索隆的觉悟',
        description: '为了保护路飞，索隆承受了熊的攻击，满身是血但依然站立。',
        quote: '什么都没有发生。'
      }
    ]
  },
  {
    id: 'naruto',
    title: '火影忍者',
    originalTitle: 'NARUTO -ナルト-',
    year: 2002,
    era: '00s',
    genres: ['热血', '战斗', '忍者'],
    poster: imgPrompt('Naruto anime poster, Naruto Uzumaki, orange outfit, Nine Tails fox chakra, Sasuke Uchiha, Konoha village, ninja action, 2000s anime style'),
    description: '十多年前一只拥有巨大威力的妖兽"九尾妖狐"袭击了木叶忍者村，当时的第四代火影拼尽全力，以自己的生命为代价将"九尾妖狐"封印在了刚出生的鸣人身上。木叶村终于恢复了平静，但村民们却把鸣人当成怪物看待，所有人都疏远他。鸣人自小孤苦无依，为了让更多人认可自己，他的目标是成为火影！',
    episodes: 720,
    studio: 'Studio Pierrot',
    director: '伊达勇登',
    rating: 9.5,
    characters: [
      {
        id: 'n-1',
        name: '漩涡鸣人',
        image: imgPrompt('Naruto Uzumaki, blonde spiky hair, orange jacket, blue eyes, whisker marks, ninja headband, fox chakra aura, determined smile', 'square'),
        description: '故事主角，九尾人柱力，梦想是成为火影，得到全村人的认可。',
        voiceActor: '竹内顺子'
      },
      {
        id: 'n-2',
        name: '宇智波佐助',
        image: imgPrompt('Sasuke Uchiha, black spiky hair, blue outfit, red Sharingan eyes, cold expression, ninja, anime style', 'square'),
        description: '宇智波一族的幸存者，为了复仇而活着，是鸣人的挚友和对手。',
        voiceActor: '杉山纪彰'
      },
      {
        id: 'n-3',
        name: '春野樱',
        image: imgPrompt('Sakura Haruno, pink hair, green eyes, kunoichi, medical ninja, fist pose, strong beautiful anime girl', 'square'),
        description: '第七班成员，医疗忍者，从一个爱哭的小女孩成长为强大的忍者。',
        voiceActor: '中村千绘'
      }
    ],
    classicClips: [
      {
        id: 'n-clip-1',
        episode: '第1集',
        title: '漩涡鸣人登场！',
        description: '鸣人调皮捣蛋，但在水木事件中第一次展现了螺旋丸，得到了伊鲁卡老师的认可。',
        quote: '我的梦想是成为火影，而且是超越历代火影的火影！'
      },
      {
        id: 'n-clip-2',
        episode: '第388集',
        title: '四代目火影',
        description: '鸣人在与佩恩战斗中即将九尾化时，见到了自己的父亲第四代火影波风水门。',
        quote: '我从来都不觉得父母是什么样的人有多么重要，重要的是，我现在活着，而你是我父亲，这就够了。'
      }
    ]
  },
  {
    id: 'bleach',
    title: '境·界',
    originalTitle: 'BLEACH',
    year: 2004,
    era: '00s',
    genres: ['热血', '战斗', '死神'],
    poster: imgPrompt('Bleach anime poster, Ichigo Kurosaki, Soul Reaper, black katana, bankai orange energy, Rukia Kuchiki, Soul Society, 2000s anime style'),
    description: '男主角黑崎一护是个看似暴力、单薄，实质上善良、勇敢、爱护家庭的少年，并且拥有能看见灵的体质。家里有两个同样能看见灵的妹妹夏梨和游子，还有一个开诊所、异常严厉的老爸。一护15岁这年，遇见了朽木露琪亚，人生发生了天翻地覆的变化。',
    episodes: 366,
    studio: 'Studio Pierrot',
    director: '阿部记之',
    rating: 9.0,
    characters: [
      {
        id: 'b-1',
        name: '黑崎一护',
        image: imgPrompt('Ichigo Kurosaki Bleach, orange spiky hair, black Soul Reaper outfit, holding Zangetsu sword, determined expression, spirit pressure', 'square'),
        description: '故事主角，代理死神，拥有强大的灵压，为了保护家人和朋友而战。',
        voiceActor: '森田成一'
      },
      {
        id: 'b-2',
        name: '朽木露琪亚',
        image: imgPrompt('Rukia Kuchiki Bleach, black hair, Soul Reaper uniform, holding Zanpakuto, elegant, cool expression, anime girl', 'square'),
        description: '尸魂界四大贵族朽木家的养女，将死神之力传给了一护。',
        voiceActor: '折笠富美子'
      }
    ],
    classicClips: [
      {
        id: 'b-clip-1',
        episode: '第1集',
        title: '成为死神的那天',
        description: '一护为了保护家人，从露琪亚那里获得了死神的力量。',
        quote: '吾等前方，绝无敌手！'
      },
      {
        id: 'b-clip-2',
        episode: '第58集',
        title: '无月',
        description: '一护领悟最后的月牙天冲，与蓝染展开最终决战。',
        quote: '我等，因无形而恐惧。'
      }
    ]
  },
  {
    id: 'attack-on-titan',
    title: '进击的巨人',
    originalTitle: '進撃の巨人',
    year: 2013,
    era: '00s',
    genres: ['黑暗', '战斗', '悬疑'],
    poster: imgPrompt('Attack on Titan anime poster, Eren Yeager, Mikasa Ackerman, Colossal Titan, wall Maria, epic dark fantasy, survey corps cloak, modern anime style'),
    description: '107年前，世界上突然出现了人类的天敌"巨人"。面临着生存危机而残存下来的人类逃到了一个地方，盖起了三重巨大的墙壁。人们在这隔绝的环境里享受了一百多年的和平，直到艾伦·耶格尔十岁那年，60米高的"超大型巨人"突然出现，以压倒性的力量破坏城门，其后瞬间消失，巨人们成群的冲进墙内捕食人类。',
    episodes: 87,
    studio: 'WIT Studio / MAPPA',
    director: '荒木哲郎',
    rating: 9.7,
    characters: [
      {
        id: 'aot-1',
        name: '艾伦·耶格尔',
        image: imgPrompt('Eren Yeager Attack on Titan, brown hair, green Survey Corps cloak, determined angry expression, Titan marks under eyes, holding blades', 'square'),
        description: '故事主角，拥有进击的巨人、始祖巨人、战锤巨人三大巨人之力。',
        voiceActor: '梶裕贵'
      },
      {
        id: 'aot-2',
        name: '三笠·阿克曼',
        image: imgPrompt('Mikasa Ackerman Attack on Titan, black hair, Survey Corps cloak, red scarf, dual blades, cool expression, beautiful strong anime girl', 'square'),
        description: '艾伦的青梅竹马，阿克曼一族的后裔，战斗力超群，深爱着艾伦。',
        voiceActor: '石川由依'
      },
      {
        id: 'aot-3',
        name: '利威尔·阿克曼',
        image: imgPrompt('Levi Ackerman Attack on Titan, black undercut hair, Survey Corps cloak, dual blades, cold expression, humanity strongest soldier', 'square'),
        description: '调查兵团兵长，人类最强士兵，实力碾压一切巨人。',
        voiceActor: '神谷浩史'
      }
    ],
    classicClips: [
      {
        id: 'aot-clip-1',
        episode: '第1集',
        title: '致两千年后的你',
        description: '超大型巨人攻破城墙，艾伦亲眼看着母亲被巨人吃掉，立下消灭所有巨人的誓言。',
        quote: '我要把它们...全部驱逐出去！一个不留！'
      },
      {
        id: 'aot-clip-2',
        episode: '第55集',
        title: '白夜',
        description: '团长埃尔文和阿尔敏都濒死，利威尔面临艰难抉择，最终选择救活阿尔敏。',
        quote: '放弃你的梦想去死吧，带着新兵们的命去地狱，我会让他们见识地狱的。'
      }
    ]
  },
  {
    id: 'demon-slayer',
    title: '鬼灭之刃',
    originalTitle: '鬼滅の刃',
    year: 2019,
    era: '00s',
    genres: ['热血', '战斗', '时代剧'],
    poster: imgPrompt('Demon Slayer anime poster, Tanjiro Kamado, Nezuko, Water Breathing Nichirin Sword, demons, Taisho era Japan, beautiful Ufotable animation style'),
    description: '大正时期，日本。卖炭少年炭治郎，某天家人惨遭鬼杀害。而唯一幸存的妹妹祢豆子，也被变成了鬼。在猎鬼人的指引下，立志成为猎鬼人的炭治郎与变成鬼却尚存理智的祢豆子踏上了旅程。通过艰苦的修行和赌上性命的试炼，炭治郎成为了鬼杀队的一员。',
    episodes: 55,
    studio: 'ufotable',
    director: '外崎春雄',
    rating: 9.4,
    characters: [
      {
        id: 'ds-1',
        name: '灶门炭治郎',
        image: imgPrompt('Tanjiro Kamado Demon Slayer, checkered haori, black uniform, earrings, Nichirin sword, Water Breathing effects, kind determined expression', 'square'),
        description: '故事主角，鬼杀队剑士，水之呼吸使用者，嗅觉灵敏，性格温柔善良。',
        voiceActor: '花江夏树'
      },
      {
        id: 'ds-2',
        name: '灶门祢豆子',
        image: imgPrompt('Nezuko Kamado Demon Slayer, pink kimono, bamboo muzzle, black hair with orange tips, cute demon girl, pink eyes', 'square'),
        description: '炭治郎的妹妹，虽然变成了鬼但依然保护人类，能在战斗中帮助哥哥。',
        voiceActor: '鬼头明里'
      },
      {
        id: 'ds-3',
        name: '我妻善逸',
        image: imgPrompt('Zenitsu Agatsuma Demon Slayer, yellow haori, blonde hair, scared expression, sleeping pose, lightning breathing', 'square'),
        description: '炭治郎的同期，雷之呼吸使用者，平时胆小如鼠，但睡着后会变强。',
        voiceActor: '下野纮'
      }
    ],
    classicClips: [
      {
        id: 'ds-clip-1',
        episode: '第1集',
        title: '残酷',
        description: '炭治郎卖炭归来发现家人被杀，妹妹祢豆子变成了鬼，遇到富冈义勇。',
        quote: '祢豆子是我的妹妹，我绝对不会把她交给任何人！'
      },
      {
        id: 'ds-clip-2',
        episode: '第19集',
        title: '火神',
        description: '炭治郎在与下弦五累的战斗中，使出了火神神乐，配合祢豆子的血鬼术。',
        quote: '集中一点，登峰造极！'
      }
    ]
  },
  {
    id: 'nezha',
    title: '哪吒传奇',
    originalTitle: '哪吒传奇',
    year: 2003,
    era: '00s',
    genres: ['神话', '冒险', '国产'],
    poster: imgPrompt('Nezha Chinese animation poster, Nezha with fire wheels, red ribbon, golden spear, Chinese mythology, traditional art style, dragons, epic battle'),
    description: '哪吒还没出生就被申公豹与石矶暗算，经历千辛万苦终于顺利出生。哪吒从小就展现出非凡的能力，但是因为误伤敖丙而与东海结下怨仇。为了不连累陈塘关百姓，哪吒削骨还父、削肉还母。后来在太乙真人的帮助下，哪吒借莲花复活，并最终战胜了石矶。',
    episodes: 52,
    studio: '中国国际电视总公司',
    director: '蔡志军',
    rating: 9.3,
    characters: [
      {
        id: 'nezha-1',
        name: '哪吒',
        image: imgPrompt('Nezha Chinese myth character, red hair buns, golden spear, fire wheels, red silk sash, lotus base, brave child hero, Chinese cartoon style', 'square'),
        description: '陈塘关总兵李靖的三儿子，生来就拥有神奇的力量，勇敢善良。',
        voiceActor: '郝幽玥'
      },
      {
        id: 'nezha-2',
        name: '小龙女',
        image: imgPrompt('Xiao Long Nu Dragon Princess, blue hair, dragon horns, traditional Chinese dress, water powers, beautiful Chinese cartoon girl', 'square'),
        description: '东海龙王的小女儿，哪吒的好朋友，温柔善良，多次帮助哪吒。',
        voiceActor: '陈红'
      }
    ],
    classicClips: [
      {
        id: 'nezha-clip-1',
        episode: '第1集',
        title: '哪吒出世',
        description: '怀胎三年六个月，哪吒终于降生，却被石矶视为眼中钉。',
        quote: '是他，就是他，我们的英雄小哪吒！'
      },
      {
        id: 'nezha-clip-2',
        episode: '第27集',
        title: '哪吒自刎',
        description: '为了保护陈塘关百姓，哪吒挺身而出，削骨还父、削肉还母。',
        quote: '爹爹，你的骨肉我还给你！'
      }
    ]
  },
  {
    id: 'pleasant-goat',
    title: '喜羊羊与灰太狼',
    originalTitle: '喜羊羊与灰太狼',
    year: 2005,
    era: '00s',
    genres: ['喜剧', '儿童', '国产'],
    poster: imgPrompt('Pleasant Goat and Big Big Wolf cartoon poster, Xi Yangyang, Lan Yangyang, Fei Yangyang, Grey Wolf, Red Wolf, green meadow, cute cartoon style'),
    description: '在绿草甜美、宁静安详的青青草原上，生活着一群无忧无虑的小白羊。聪明伶俐的喜羊羊，可爱漂亮的美羊羊，大智若愚的懒羊羊，外粗内细的沸羊羊，还有行动缓慢的慢羊羊村长。而在草原另一边的森林里，住着灰太狼和红太狼夫妇。灰太狼天天都在计划着如何吃到羊，但每次都失败而归。',
    episodes: 1000,
    studio: '广东原创动力文化传播有限公司',
    director: '黄伟明',
    rating: 8.8,
    characters: [
      {
        id: 'pg-1',
        name: '喜羊羊',
        image: imgPrompt('Xi Yangyang Pleasant Goat, blue ribbon around neck, smart expression, running pose, cute white cartoon sheep', 'square'),
        description: '青青草原上最聪明的小羊，每次都能识破灰太狼的诡计。',
        voiceActor: '祖晴'
      },
      {
        id: 'pg-2',
        name: '灰太狼',
        image: imgPrompt('Grey Wolf cartoon, gray fur, blue hat, scar on face, evil but silly smile, holding cooking pot, cartoon wolf', 'square'),
        description: '故事反派角色，但也是可怜的丈夫，每次抓羊失败都会被红太狼平底锅打。',
        voiceActor: '张琳'
      }
    ],
    classicClips: [
      {
        id: 'pg-clip-1',
        episode: '第1集',
        title: '狼来了',
        description: '灰太狼第一次来到羊村，开始了与小羊们的斗智斗勇。',
        quote: '我一定会回来的！'
      },
      {
        id: 'pg-clip-2',
        episode: '经典桥段',
        title: '红太狼的平底锅',
        description: '灰太狼抓羊失败回到家，红太狼用平底锅把他打飞。',
        quote: '笨蛋！抓不到羊就别回来！'
      }
    ]
  }
];

export const getAnimesByEra = (era: EraType): Anime[] => {
  return animes.filter(anime => anime.era === era);
};

export const getAnimeById = (id: string): Anime | undefined => {
  return animes.find(anime => anime.id === id);
};

export const searchAnimes = (query: string): Anime[] => {
  const lowerQuery = query.toLowerCase();
  return animes.filter(anime => 
    anime.title.toLowerCase().includes(lowerQuery) ||
    anime.originalTitle.toLowerCase().includes(lowerQuery) ||
    anime.description.toLowerCase().includes(lowerQuery) ||
    anime.genres.some(g => g.toLowerCase().includes(lowerQuery)) ||
    anime.characters.some(c => c.name.toLowerCase().includes(lowerQuery))
  );
};
