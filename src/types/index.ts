export interface CharacterRelation {
  from: string;
  to: string;
  relation: string;
  color: string;
}

export interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  voiceActor: string;
  animeId?: string;
  animeTitle?: string;
}

export interface CharacterWithVotes extends Character {
  votes: number;
  rank?: number;
}

export interface VoteRecord {
  characterId: string;
  date: string;
  timestamp: number;
}

export interface BattleRecord {
  id: string;
  character1Id: string;
  character2Id: string;
  winnerId: string | null;
  timestamp: number;
  character1Votes: number;
  character2Votes: number;
}

export interface ClassicClip {
  id: string;
  episode: string;
  title: string;
  description: string;
  quote: string;
}

export type AnimationType = 'TV' | '剧场版' | 'OVA' | 'Web';

export interface Anime {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  era: '80s' | '90s' | '00s';
  country: string;
  animationType: AnimationType[];
  genres: string[];
  poster: string;
  description: string;
  episodes: number;
  studio: string;
  director: string;
  characters: Character[];
  characterRelations: CharacterRelation[];
  classicClips: ClassicClip[];
  productionBackground: string;
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

export interface HiddenCharacter {
  id: string;
  characterId: string;
  location: string;
  era: EraType;
  hint: string;
  rarity: 'common' | 'rare' | 'legendary';
  points: number;
}

export interface EasterEgg {
  id: string;
  name: string;
  description: string;
  location: string;
  era?: EraType;
  hint: string;
  points: number;
  image?: string;
  unlockedAt?: number;
}

export interface SpecialCollection {
  id: string;
  name: string;
  description: string;
  animeId: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  image: string;
  expireAt: number;
}

export type QuestType = 'find_characters' | 'find_easter_eggs' | 'collect_special' | 'combo_era';
export type QuestStatus = 'available' | 'in_progress' | 'completed' | 'expired';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  era?: EraType;
  targetCount: number;
  currentProgress: number;
  targetIds?: string[];
  reward: {
    points: number;
    badge?: string;
  };
  status: QuestStatus;
  expiresAt?: number;
  completedAt?: number;
}

export type AchievementRarity = 'bronze' | 'silver' | 'gold' | 'platinum';
export type AchievementType = 'collector' | 'explorer' | 'hunter' | 'completionist' | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  rarity: AchievementRarity;
  icon: string;
  requirement: {
    type: 'collect_characters' | 'find_easter_eggs' | 'complete_quests' | 'collect_specials' | 'visits';
    target: number;
    era?: EraType;
  };
  points: number;
  unlockedAt?: number;
}

export interface PlayerStats {
  totalPoints: number;
  hiddenCharactersFound: string[];
  easterEggsFound: string[];
  specialCollectionsFound: string[];
  completedQuests: string[];
  unlockedAchievements: string[];
  visitCount: number;
  lastVisit: number;
  currentStreak: number;
}

export interface ShareCardData {
  playerName: string;
  achievements: Achievement[];
  stats: PlayerStats;
  favoriteEra?: EraType;
  generatedAt: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface MapExhibit {
  id: string;
  name: string;
  position: Position;
  size: { width: number; height: number };
  era: EraType | 'entrance';
  description: string;
  linkPath: string;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  position: Position;
  era: EraType;
  avatar: string;
  dialogues: string[];
  eraStory: {
    title: string;
    content: string[];
  };
}

export interface MapData {
  width: number;
  height: number;
  exhibits: MapExhibit[];
  npcs: NPC[];
  obstacles: { x: number; y: number; width: number; height: number }[];
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PlayerState {
  position: Position;
  direction: Direction;
  isMoving: boolean;
}

export type RepairProblemType = 'scratch' | 'fading' | 'missing_frame';
export type RepairGameType = 'swipe' | 'color_match' | 'frame_puzzle';
export type RepairDifficulty = 'easy' | 'medium' | 'hard';

export interface RepairProblem {
  id: string;
  type: RepairProblemType;
  name: string;
  description: string;
  severity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  points: number;
  rotation?: number;
}

export interface RepairableAnimation {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  era: EraType;
  poster: string;
  description: string;
  problems: RepairProblemType[];
  currentProblems: RepairProblem[];
  difficulty: RepairDifficulty;
  basePoints: number;
  isRepaired: boolean;
  repairedAt?: number;
}

export interface RepairBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'legendary';
  requirement: {
    type: 'repair_count' | 'repair_type' | 'perfect_repair' | 'streak';
    target: number;
    problemType?: RepairProblemType;
  };
  points: number;
  unlockedAt?: number;
}

export interface RepairStats {
  totalRepairs: number;
  scratchRepairs: number;
  fadingRepairs: number;
  missingFrameRepairs: number;
  perfectRepairs: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  repairedAnimations: string[];
  earnedBadges: string[];
  newBadges: string[];
  lastRepairAt?: number;
}

export interface ScratchGameState {
  scratches: { id: string; x: number; y: number; length: number; rotation: number; repaired: boolean }[];
  progress: number;
}

export interface FadingGameState {
  colorChannels: { id: string; name: string; current: number; target: number }[];
  selectedChannel: string | null;
}

export interface FramePuzzleGameState {
  frames: { id: string; correctIndex: number; currentIndex: number; image: string }[];
  moves: number;
}

export type WorldTheme = 'forest' | 'ocean' | 'space' | 'school' | 'fantasy' | 'city';

export interface MemoryFragment {
  id: string;
  characterId: string;
  characterName: string;
  characterImage: string;
  animeId: string;
  animeTitle: string;
  quote: string;
  story: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  position: Position;
}

export interface PortalWorld {
  id: string;
  name: string;
  theme: WorldTheme;
  description: string;
  animeIds: string[];
  bgGradient: string;
  accentColor: string;
  icon: string;
  mapWidth: number;
  mapHeight: number;
  obstacles: { x: number; y: number; width: number; height: number; type?: string }[];
  decorations: { id: string; type: string; position: Position; scale?: number }[];
  memoryFragments: MemoryFragment[];
  hiddenStories: HiddenStory[];
  entryPosition: Position;
}

export interface HiddenStory {
  id: string;
  title: string;
  content: string;
  animeId: string;
  animeTitle: string;
  position: Position;
  unlockCondition: string;
  requiredFragments?: number;
  isUnlocked?: boolean;
}

export interface PortalStats {
  unlockedWorlds: string[];
  collectedFragments: string[];
  discoveredStories: string[];
  totalPoints: number;
  visitCount: Record<string, number>;
  lastVisit?: number;
}

export type PortalDirection = 'up' | 'down' | 'left' | 'right';

export interface PortalPlayerState {
  position: Position;
  direction: PortalDirection;
  isMoving: boolean;
}

export type CrossRelationType = 'friend' | 'rival' | 'mentor' | 'family';

export interface CrossAnimeRelation {
  id: string;
  fromCharacterId: string;
  toCharacterId: string;
  type: CrossRelationType;
  label: string;
  description: string;
}

export interface SimilarCharacterPair {
  id: string;
  characterIdA: string;
  characterIdB: string;
  reason: string;
  tags: string[];
}

export type RelationQuestType = 'find_similar' | 'trace_path' | 'discover_link';

export interface RelationQuest {
  id: string;
  title: string;
  description: string;
  type: RelationQuestType;
  hint: string;
  targetIds: string[];
  reward: number;
  isCompleted: boolean;
}

export interface UniverseStats {
  discoveredRelations: string[];
  discoveredSimilar: string[];
  completedQuests: string[];
  totalPoints: number;
}

export type TechEra = 'pioneer' | 'cel' | 'tv_golden' | 'digital_revolution' | 'modern_cg' | 'ai_future';

export interface VisualCapability {
  id: string;
  name: string;
  description: string;
  icon: string;
  example?: string;
}

export interface ProductionTool {
  id: string;
  name: string;
  description: string;
  category: 'drawing' | 'coloring' | 'editing' | 'compositing' | '3d' | 'ai';
  era: TechEra;
  icon: string;
}

export interface TechMilestone {
  id: string;
  name: string;
  year: string;
  description: string;
  impact: string;
  visual: string;
  requiredEra: TechEra;
  cost: number;
  grantTools: string[];
  grantCapabilities: string[];
}

export interface StylePhase {
  id: TechEra;
  name: string;
  period: string;
  tagline: string;
  description: string;
  longDescription: string;
  color: string;
  accentColor: string;
  bgGradient: string;
  visualStyle: string;
  keyWorks: string[];
  visualFeatures: string[];
  unlockedCapabilities: string[];
  unlockedTools: string[];
  milestones: string[];
  position: { x: number; y: number };
  precedingEra?: TechEra;
}

export interface EvolutionEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  type: 'tech' | 'art' | 'cultural' | 'milestone';
  era: TechEra;
}

export interface SandboxState {
  currentEra: TechEra;
  unlockedEras: TechEra[];
  researchPoints: number;
  totalResearchPoints: number;
  unlockedMilestones: string[];
  unlockedCapabilities: string[];
  unlockedTools: string[];
  currentView: 'timeline' | 'workshop' | 'gallery' | 'comparison';
  selectedMilestone: string | null;
  selectedTool: string | null;
  selectedCapability: string | null;
  eraTransitionProgress: number;
  isTransitioning: boolean;
}

export interface SandboxStats {
  totalErasUnlocked: number;
  totalMilestones: number;
  totalCapabilities: number;
  totalTools: number;
  researchEfficiency: number;
  evolutionSpeed: number;
}

export type FestivalTheme =
  | 'mecha'
  | 'magical_girl'
  | 'hot_blooded'
  | 'mystery'
  | 'family'
  | 'fantasy'
  | 'sports'
  | 'comedy'
  | 'dark_fantasy'
  | 'chinese_classic';

export interface FestivalThemeInfo {
  id: FestivalTheme;
  name: string;
  description: string;
  icon: string;
  color: string;
  accentColor: string;
  bgGradient: string;
  tagline: string;
  genreFilter: string[];
}

export interface Screening {
  id: string;
  animeId: string;
  timeSlot: string;
  hall: string;
  seatCount: number;
  reservedSeats: number;
}

export interface FilmFestival {
  id: string;
  date: string;
  theme: FestivalTheme;
  themeInfo: FestivalThemeInfo;
  screenings: Screening[];
  description: string;
  bannerImage: string;
  isActive: boolean;
}

export interface UserRating {
  animeId: string;
  festivalId: string;
  score: number;
  timestamp: number;
}

export interface UserComment {
  id: string;
  animeId: string;
  festivalId: string;
  content: string;
  score: number;
  timestamp: number;
  author: string;
}

export interface UserPreference {
  favoriteGenres: string[];
  favoriteEras: EraType[];
  averageRating: number;
  ratedAnimeIds: string[];
  commentCount: number;
}

export interface RouteStop {
  animeId: string;
  reason: string;
  order: number;
  timeSlot: string;
  hall: string;
  matchScore: number;
}

export interface RecommendedRoute {
  festivalId: string;
  stops: RouteStop[];
  totalMatchScore: number;
  generatedAt: number;
}

export interface TheaterStats {
  totalRatings: number;
  totalComments: number;
  festivalsAttended: string[];
  averageRatingGiven: number;
  topGenres: string[];
}
