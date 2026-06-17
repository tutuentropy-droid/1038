export type Era = 'pre-qin' | 'han' | 'wei-jin' | 'tang' | 'song-ming';

export type RelationType = 'inherit' | 'influence' | 'criticize' | 'complement';

export type TimelineEventType = 'birth' | 'work' | 'event' | 'death';

export interface CoreBelief {
  id: string;
  title: string;
  description: string;
  quote: string;
  source: string;
}

export interface Person {
  id: string;
  name: string;
  styleName?: string;
  years: string;
  avatar: string;
  briefIntro: string;
  famousQuotes: string[];
  majorWorks: string[];
  schoolId: string;
}

export interface Classic {
  id: string;
  title: string;
  author: string;
  period: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  type: TimelineEventType;
}

export interface Relation {
  id: string;
  fromSchoolId: string;
  toSchoolId: string;
  type: RelationType;
  description: string;
  strength: number;
}

export interface School {
  id: string;
  name: string;
  englishName: string;
  period: string;
  era: Era;
  color: string;
  icon: string;
  briefIntro: string;
  fullIntro: string;
  coreBeliefs: CoreBelief[];
  representatives: Person[];
  classics: Classic[];
  timeline: TimelineEvent[];
  relations: Relation[];
  position: { x: number; y: number };
  parentId?: string;
}

export interface TreeNode {
  id: string;
  school: School;
  children: TreeNode[];
  parentId?: string;
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  school: School;
  radius: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: Relation;
}
