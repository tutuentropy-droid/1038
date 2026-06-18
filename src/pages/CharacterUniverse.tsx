import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Target,
  ChevronRight,
  Filter,
  RotateCcw,
  Zap,
  Heart,
  Swords,
  BookOpen,
  Home,
  CheckCircle2,
  Circle,
  Lightbulb,
  X,
  Route,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { animes } from '@/data/animes';
import { getAllCharacters } from '@/data/characters';
import {
  crossAnimeRelations,
  similarCharacterPairs,
  relationQuests,
  CROSS_RELATION_TYPE_CONFIG,
  findRelationPath,
} from '@/data/characterUniverse';
import { useCharacterUniverseStore } from '@/store/useCharacterUniverseStore';
import { Character, CrossAnimeRelation, CrossRelationType } from '@/types';

interface GraphNode {
  id: string;
  character: Character;
  x: number;
  y: number;
  vx: number;
  vy: number;
  animeId: string;
  mass: number;
  fx?: number;
  fy?: number;
}

interface GraphEdge {
  relation: CrossAnimeRelation;
  source: GraphNode;
  target: GraphNode;
}

const RELATION_ICONS: Record<CrossRelationType, React.ReactNode> = {
  friend: <Heart className="w-3 h-3" />,
  rival: <Swords className="w-3 h-3" />,
  mentor: <BookOpen className="w-3 h-3" />,
  family: <Home className="w-3 h-3" />,
};

export const CharacterUniverse = () => {
  const {
    stats,
    expandedCharacters,
    activeFilter,
    discoverRelation,
    discoverSimilar,
    completeQuest,
    toggleExpandCharacter,
    clearExpandedCharacters,
    setActiveFilter,
    isRelationDiscovered,
    isQuestCompleted,
    isCharacterExpanded,
  } = useCharacterUniverseStore();

  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [showQuestPanel, setShowQuestPanel] = useState(false);
  const [questHintVisible, setQuestHintVisible] = useState<string | null>(null);
  const [showSimilarPanel, setShowSimilarPanel] = useState(false);
  const [showPathPanel, setShowPathPanel] = useState(false);
  const [pathStart, setPathStart] = useState<string | null>(null);
  const [pathEnd, setPathEnd] = useState<string | null>(null);
  const [foundPath, setFoundPath] = useState<string[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);
  const [scale, setScale] = useState(1);
  const [nodesReady, setNodesReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const nodesRef = useRef<GraphNode[]>([]);
  const animationRef = useRef<number>();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const allCharacters = useMemo(() => getAllCharacters(), []);

  const characterMap = useMemo(() => {
    const map: Record<string, Character> = {};
    allCharacters.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [allCharacters]);

  const animeMap = useMemo(() => {
    const map: Record<string, string> = {};
    animes.forEach((a) => {
      a.characters.forEach((c) => {
        map[c.id] = a.id;
      });
    });
    return map;
  }, []);

  const getAnimeColor = useCallback(
    (characterId: string) => {
      const animeId = animeMap[characterId];
      const anime = animes.find((a) => a.id === animeId);
      if (!anime) return '#9ca3af';
      if (anime.era === '80s') return '#ff00ff';
      if (anime.era === '90s') return '#ff6b35';
      return '#9d4edd';
    },
    [animeMap]
  );

  const getAnimeTitle = useCallback(
    (characterId: string) => {
      const char = characterMap[characterId];
      return char?.animeTitle || '';
    },
    [characterMap]
  );

  const visibleCharacterIds = useMemo(() => {
    const ids = new Set<string>();

    if (selectedCharacter) {
      ids.add(selectedCharacter);
      crossAnimeRelations.forEach((r) => {
        if (r.fromCharacterId === selectedCharacter) ids.add(r.toCharacterId);
        if (r.toCharacterId === selectedCharacter) ids.add(r.fromCharacterId);
      });
      similarCharacterPairs.forEach((p) => {
        if (p.characterIdA === selectedCharacter) ids.add(p.characterIdB);
        if (p.characterIdB === selectedCharacter) ids.add(p.characterIdA);
      });
    }

    expandedCharacters.forEach((cid) => {
      ids.add(cid);
      crossAnimeRelations.forEach((r) => {
        if (r.fromCharacterId === cid) ids.add(r.toCharacterId);
        if (r.toCharacterId === cid) ids.add(r.fromCharacterId);
      });
    });

    if (ids.size === 0) {
      const hubIds = ['db-1', 'n-1', 'op-1', 'dc-1', 'aot-1', 'ds-1'];
      hubIds.forEach((id) => {
        if (characterMap[id]) ids.add(id);
      });
      hubIds.forEach((hubId) => {
        crossAnimeRelations.forEach((r) => {
          if (r.fromCharacterId === hubId && characterMap[r.toCharacterId]) ids.add(r.toCharacterId);
          if (r.toCharacterId === hubId && characterMap[r.fromCharacterId]) ids.add(r.fromCharacterId);
        });
      });
    }

    return ids;
  }, [selectedCharacter, expandedCharacters, characterMap]);

  const filteredRelations = useMemo(() => {
    let relations = crossAnimeRelations.filter(
      (r) =>
        visibleCharacterIds.has(r.fromCharacterId) &&
        visibleCharacterIds.has(r.toCharacterId)
    );
    if (activeFilter !== 'all') {
      relations = relations.filter((r) => r.type === activeFilter);
    }
    return relations;
  }, [visibleCharacterIds, activeFilter]);

  const nodes = useMemo<GraphNode[]>(() => {
    if (!dimensions.width) return [];

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const nodeCount = visibleCharacterIds.size;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;

    const ids = Array.from(visibleCharacterIds);
    const newNodes: GraphNode[] = [];

    ids.forEach((id, index) => {
      const char = characterMap[id];
      if (!char) return;

      const existingNode = nodesRef.current.find((n) => n.id === id);
      if (existingNode) {
        newNodes.push({ ...existingNode });
      } else {
        const angle = (2 * Math.PI * index) / nodeCount - Math.PI / 2;
        const relationCount = crossAnimeRelations.filter(
          (r) => r.fromCharacterId === id || r.toCharacterId === id
        ).length;
        newNodes.push({
          id,
          character: char,
          x: centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 40,
          y: centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 40,
          vx: 0,
          vy: 0,
          animeId: animeMap[id] || '',
          mass: 1 + relationCount * 0.3,
        });
      }
    });

    return newNodes;
  }, [visibleCharacterIds, dimensions, characterMap, animeMap]);

  useEffect(() => {
    nodesRef.current = nodes;
    if (nodes.length > 0 && !nodesReady) {
      setTimeout(() => setNodesReady(true), 100);
    }
  }, [nodes, nodesReady]);

  useEffect(() => {
    if (!isSimulating || !dimensions.width || nodes.length === 0) return;

    const simulate = () => {
      const currentNodes = nodesRef.current;
      if (currentNodes.length === 0) return;

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      const width = dimensions.width;
      const height = dimensions.height;

      const repulsionStrength = 800;
      const attractionStrength = 0.008;
      const centerStrength = 0.002;
      const damping = 0.9;
      const velocityLimit = 8;

      for (let i = 0; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const dx = currentNodes[j].x - currentNodes[i].x;
          const dy = currentNodes[j].y - currentNodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsionStrength / (dist * dist);

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          currentNodes[i].vx -= fx / currentNodes[i].mass;
          currentNodes[i].vy -= fy / currentNodes[i].mass;
          currentNodes[j].vx += fx / currentNodes[j].mass;
          currentNodes[j].vy += fy / currentNodes[j].mass;
        }
      }

      filteredRelations.forEach((rel) => {
        const source = currentNodes.find((n) => n.id === rel.fromCharacterId);
        const target = currentNodes.find((n) => n.id === rel.toCharacterId);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = dist * attractionStrength;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      });

      currentNodes.forEach((node) => {
        if (node.fx !== undefined && node.fy !== undefined) {
          node.x = node.fx;
          node.y = node.fy;
          node.vx = 0;
          node.vy = 0;
          return;
        }

        node.vx += (centerX - node.x) * centerStrength;
        node.vy += (centerY - node.y) * centerStrength;

        node.vx *= damping;
        node.vy *= damping;

        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > velocityLimit) {
          node.vx = (node.vx / speed) * velocityLimit;
          node.vy = (node.vy / speed) * velocityLimit;
        }

        node.x += node.vx;
        node.y += node.vy;

        const margin = 60;
        node.x = Math.max(margin, Math.min(width - margin, node.x));
        node.y = Math.max(margin, Math.min(height - margin, node.y));
      });

      forceUpdate({});
      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSimulating, dimensions, filteredRelations, nodes.length]);

  const displayNodes = nodesRef.current.length > 0 ? nodesRef.current : nodes;

  const edges = useMemo<GraphEdge[]>(() => {
    return filteredRelations
      .map((rel) => {
        const source = displayNodes.find((n) => n.id === rel.fromCharacterId);
        const target = displayNodes.find((n) => n.id === rel.toCharacterId);
        if (!source || !target) return null;
        return { relation: rel, source, target };
      })
      .filter(Boolean) as GraphEdge[];
  }, [filteredRelations, displayNodes]);

  const handleCharacterClick = useCallback(
    (characterId: string) => {
      if (selectedCharacter === characterId) {
        setSelectedCharacter(null);
      } else {
        setSelectedCharacter(characterId);
      }
      toggleExpandCharacter(characterId);

      crossAnimeRelations
        .filter(
          (r) =>
            (r.fromCharacterId === characterId || r.toCharacterId === characterId) &&
            visibleCharacterIds.has(r.fromCharacterId) &&
            visibleCharacterIds.has(r.toCharacterId)
        )
        .forEach((r) => {
          if (!isRelationDiscovered(r.id)) {
            discoverRelation(r.id);
          }
        });
    },
    [selectedCharacter, toggleExpandCharacter, isRelationDiscovered, discoverRelation, visibleCharacterIds]
  );

  const handleQuestCheck = useCallback(
    (questId: string, questType: string, targetIds: string[], reward: number) => {
      if (isQuestCompleted(questId)) return;

      let completed = false;

      if (questType === 'discover_link') {
        completed = targetIds.every((relId) => isRelationDiscovered(relId));
      } else {
        completed = targetIds.every((id) => {
          return expandedCharacters.includes(id) || selectedCharacter === id;
        });
      }

      if (completed) {
        completeQuest(questId, reward);
      }
    },
    [isQuestCompleted, isRelationDiscovered, expandedCharacters, selectedCharacter, completeQuest]
  );

  const handlePathSearch = useCallback(() => {
    if (!pathStart || !pathEnd) return;
    const path = findRelationPath(pathStart, pathEnd, crossAnimeRelations);
    setFoundPath(path);
    if (path && path.length > 0) {
      path.forEach((charId) => {
        if (!isCharacterExpanded(charId)) {
          toggleExpandCharacter(charId);
        }
      });
    }
  }, [pathStart, pathEnd, isCharacterExpanded, toggleExpandCharacter]);

  const isOnPath = useCallback(
    (nodeId: string) => {
      if (!foundPath) return false;
      return foundPath.includes(nodeId);
    },
    [foundPath]
  );

  const isPathEdge = useCallback(
    (relationId: string) => {
      if (!foundPath || foundPath.length < 2) return false;
      const rel = crossAnimeRelations.find((r) => r.id === relationId);
      if (!rel) return false;
      for (let i = 0; i < foundPath.length - 1; i++) {
        if (
          (rel.fromCharacterId === foundPath[i] && rel.toCharacterId === foundPath[i + 1]) ||
          (rel.toCharacterId === foundPath[i] && rel.fromCharacterId === foundPath[i + 1])
        ) {
          return true;
        }
      }
      return false;
    },
    [foundPath]
  );

  const isNodeHighlighted = useCallback(
    (nodeId: string) => {
      if (hoveredCharacter === nodeId || selectedCharacter === nodeId) return true;
      if (isOnPath(nodeId)) return true;
      if (!hoveredCharacter && !selectedCharacter) return false;
      const focusId = hoveredCharacter || selectedCharacter;
      return filteredRelations.some(
        (r) =>
          (r.fromCharacterId === focusId && r.toCharacterId === nodeId) ||
          (r.toCharacterId === focusId && r.fromCharacterId === nodeId)
      );
    },
    [hoveredCharacter, selectedCharacter, filteredRelations, isOnPath]
  );

  const isEdgeHighlighted = useCallback(
    (relationId: string) => {
      if (hoveredEdge === relationId) return true;
      if (isPathEdge(relationId)) return true;
      const focusId = hoveredCharacter || selectedCharacter;
      if (!focusId) return false;
      return filteredRelations.some(
        (r) =>
          r.id === relationId &&
          (r.fromCharacterId === focusId || r.toCharacterId === focusId)
      );
    },
    [hoveredEdge, hoveredCharacter, selectedCharacter, filteredRelations, isPathEdge]
  );

  const selectedCharInfo = useMemo(() => {
    if (!selectedCharacter) return null;
    const char = characterMap[selectedCharacter];
    if (!char) return null;
    const rels = crossAnimeRelations.filter(
      (r) => r.fromCharacterId === selectedCharacter || r.toCharacterId === selectedCharacter
    );
    const sims = similarCharacterPairs.filter(
      (p) => p.characterIdA === selectedCharacter || p.characterIdB === selectedCharacter
    );
    return { character: char, relations: rels, similarPairs: sims };
  }, [selectedCharacter, characterMap]);

  const discoveryProgress = useMemo(() => {
    return {
      relations: stats.discoveredRelations.length,
      totalRelations: crossAnimeRelations.length,
      similar: stats.discoveredSimilar.length,
      totalSimilar: similarCharacterPairs.length,
      quests: stats.completedQuests.length,
      totalQuests: relationQuests.length,
    };
  }, [stats]);

  return (
    <div className="min-h-screen page-transition-enter relative">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-80s-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-00s-primary/10 rounded-full blur-3xl animate-pulse-slow" />

      <section className="pt-24 pb-8 px-4">
        <div className="container">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-museum-textMuted text-sm">角色关系宇宙</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              动画角色关系宇宙
            </h1>
            <p className="text-museum-textMuted max-w-2xl mx-auto text-lg">
              探索跨越作品的角色关系网络，发现朋友、宿敌、师徒与家人之间的隐秘联系。
              点击任意角色，展开关联角色链路，开启关系探索之旅。
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">🤝</div>
              <div className="font-retro text-2xl font-bold text-white">
                {discoveryProgress.relations}/{discoveryProgress.totalRelations}
              </div>
              <p className="text-xs text-museum-textMuted">已发现关系</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">🔗</div>
              <div className="font-retro text-2xl font-bold text-white">
                {discoveryProgress.similar}/{discoveryProgress.totalSimilar}
              </div>
              <p className="text-xs text-museum-textMuted">相似角色</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div className="font-retro text-2xl font-bold text-white">
                {discoveryProgress.quests}/{discoveryProgress.totalQuests}
              </div>
              <p className="text-xs text-museum-textMuted">完成探索</p>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="font-retro text-2xl font-bold text-yellow-400">
                {stats.totalPoints}
              </div>
              <p className="text-xs text-museum-textMuted">探索积分</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="container">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 mr-2">
              <Filter className="w-4 h-4 text-museum-textMuted" />
              <span className="text-sm text-museum-textMuted">关系类型：</span>
            </div>
            {(['all', 'friend', 'rival', 'mentor', 'family'] as const).map((type) => {
              const config = type !== 'all' ? CROSS_RELATION_TYPE_CONFIG[type] : null;
              const isActive = activeFilter === type;
              return (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? type === 'all'
                        ? 'bg-gradient-to-r from-80s-primary to-00s-primary text-white'
                        : 'text-white'
                      : 'bg-white/5 text-museum-textMuted hover:bg-white/10 hover:text-white'
                  }`}
                  style={
                    isActive && type !== 'all' && config
                      ? { backgroundColor: `${config.color}30`, borderColor: config.color, borderWidth: 1 }
                      : undefined
                  }
                >
                  {type === 'all' ? '全部' : config?.icon}
                  {type === 'all' ? '' : config?.label}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`glass-button p-2 transition-colors ${
                  isSimulating ? 'text-green-400' : 'text-museum-textMuted hover:text-white'
                }`}
                title={isSimulating ? '暂停动画' : '播放动画'}
              >
                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
                className="glass-button p-2 text-museum-textMuted hover:text-white"
                title="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
                className="glass-button p-2 text-museum-textMuted hover:text-white"
                title="缩小"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setScale(1)}
                className="glass-button p-2 text-museum-textMuted hover:text-white"
                title="重置缩放"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button
                onClick={() => {
                  setSelectedCharacter(null);
                  setHoveredCharacter(null);
                  setHoveredEdge(null);
                  setFoundPath(null);
                  setPathStart(null);
                  setPathEnd(null);
                  setQuestHintVisible(null);
                  setScale(1);
                  setActiveFilter('all');
                  clearExpandedCharacters();
                  nodesRef.current = [];
                  setNodesReady(false);
                }}
                className="glass-button px-3 py-1.5 text-sm text-museum-textMuted hover:text-white flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重置视图
              </button>
              <button
                onClick={() => setShowPathPanel(!showPathPanel)}
                className={`glass-button px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  showPathPanel ? 'text-purple-400 border-purple-400/30' : 'text-museum-textMuted hover:text-white'
                }`}
              >
                <Route className="w-3.5 h-3.5" />
                路径探索
              </button>
              <button
                onClick={() => setShowQuestPanel(!showQuestPanel)}
                className={`glass-button px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  showQuestPanel ? 'text-yellow-400 border-yellow-400/30' : 'text-museum-textMuted hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                探索任务
                {stats.completedQuests.length > 0 && (
                  <span className="text-xs bg-yellow-400/20 text-yellow-400 px-1.5 rounded">
                    {stats.completedQuests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowSimilarPanel(!showSimilarPanel)}
                className={`glass-button px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  showSimilarPanel ? 'text-cyan-400 border-cyan-400/30' : 'text-museum-textMuted hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                相似角色
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div
                ref={containerRef}
                className="relative w-full aspect-[16/10] min-h-[500px] rounded-2xl overflow-hidden glass-card"
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `radial-gradient(circle, rgba(157,78,221,0.5) 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                  }}
                />

                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-xs text-museum-textMuted">
                  <span className="px-2 py-1 rounded bg-80s-primary/20 text-80s-primary">80年代</span>
                  <span className="px-2 py-1 rounded bg-90s-primary/20 text-90s-primary">90年代</span>
                  <span className="px-2 py-1 rounded bg-00s-primary/20 text-00s-primary">00年代</span>
                </div>

                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  {foundPath && (
                    <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
                      路径: {foundPath.length} 个角色
                    </span>
                  )}
                  {selectedCharacter && (
                    <button
                      onClick={() => setSelectedCharacter(null)}
                      className="glass-button p-2 text-museum-textMuted hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div
                  className="absolute inset-0 transition-transform duration-300"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                  }}
                >
                  {dimensions.width > 0 && displayNodes.length > 0 && (
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                      <defs>
                        <filter id="universe-glow">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="path-glow">
                          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <marker id="arrow-friend" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                          <path d="M0,0 L8,4 L0,8" fill="#4FC3F7" fillOpacity="0.6" />
                        </marker>
                        <marker id="arrow-rival" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                          <path d="M0,0 L8,4 L0,8" fill="#EF5350" fillOpacity="0.6" />
                        </marker>
                        <marker id="arrow-mentor" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                          <path d="M0,0 L8,4 L0,8" fill="#AB47BC" fillOpacity="0.6" />
                        </marker>
                        <marker id="arrow-family" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                          <path d="M0,0 L8,4 L0,8" fill="#FF7043" fillOpacity="0.6" />
                        </marker>
                        <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9d4edd" />
                          <stop offset="50%" stopColor="#ff00ff" />
                          <stop offset="100%" stopColor="#9d4edd" />
                        </linearGradient>
                      </defs>

                      {edges.map((edge) => {
                        const highlighted = isEdgeHighlighted(edge.relation.id);
                        const discovered = isRelationDiscovered(edge.relation.id);
                        const isPath = isPathEdge(edge.relation.id);
                        const color = isPath
                          ? 'url(#path-gradient)'
                          : CROSS_RELATION_TYPE_CONFIG[edge.relation.type].color;
                        const baseColor = CROSS_RELATION_TYPE_CONFIG[edge.relation.type].color;

                        const midX = (edge.source.x + edge.target.x) / 2;
                        const midY = (edge.source.y + edge.target.y) / 2 - 12;
                        const dx = edge.target.x - edge.source.x;
                        const dy = edge.target.y - edge.source.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const nx = -dy / dist;
                        const ny = dx / dist;
                        const curveOffset = 20;
                        const cx = midX + nx * curveOffset;
                        const cy = midY + ny * curveOffset;

                        return (
                          <g key={edge.relation.id}>
                            <path
                              d={`M ${edge.source.x} ${edge.source.y} Q ${cx} ${cy} ${edge.target.x} ${edge.target.y}`}
                              fill="none"
                              stroke={color}
                              strokeWidth={isPath ? 3.5 : highlighted ? 2.5 : 1.5}
                              strokeOpacity={isPath ? 0.9 : highlighted ? 0.8 : discovered ? 0.4 : 0.15}
                              strokeDasharray={discovered ? 'none' : '4 4'}
                              filter={isPath ? 'url(#path-glow)' : highlighted ? 'url(#universe-glow)' : undefined}
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredEdge(edge.relation.id)}
                              onMouseLeave={() => setHoveredEdge(null)}
                              onClick={() => {
                                if (!isRelationDiscovered(edge.relation.id)) {
                                  discoverRelation(edge.relation.id);
                                }
                              }}
                            />
                            {(highlighted || discovered || isPath) && (
                              <g
                                transform={`translate(${midX}, ${midY})`}
                                className="pointer-events-none"
                              >
                                <rect
                                  x={-30}
                                  y={-8}
                                  width={60}
                                  height={16}
                                  rx={4}
                                  fill="rgba(0,0,0,0.8)"
                                  stroke={isPath ? '#9d4edd' : baseColor}
                                  strokeWidth={0.5}
                                  strokeOpacity={0.5}
                                />
                                <text
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fill={isPath ? '#9d4edd' : baseColor}
                                  fontSize="9"
                                  fontWeight="500"
                                >
                                  {edge.relation.label}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  )}

                  {displayNodes.map((node) => {
                    const highlighted = isNodeHighlighted(node.id);
                    const isSelected = selectedCharacter === node.id;
                    const isHovered = hoveredCharacter === node.id;
                    const isExpanded = isCharacterExpanded(node.id);
                    const onPath = isOnPath(node.id);
                    const eraColor = getAnimeColor(node.id);
                    const nodeScale = isSelected ? 1.25 : isHovered ? 1.15 : highlighted ? 1.1 : 1;

                    return (
                      <div
                        key={node.id}
                        className={`absolute z-10 flex flex-col items-center cursor-pointer transition-transform ${
                          nodesReady ? 'duration-500' : 'duration-0'
                        }`}
                        style={{
                          left: node.x,
                          top: node.y,
                          transform: `translate(-50%, -50%) scale(${nodeScale})`,
                          opacity: nodesReady ? 1 : 0,
                        }}
                        onMouseEnter={() => setHoveredCharacter(node.id)}
                        onMouseLeave={() => setHoveredCharacter(null)}
                        onClick={() => handleCharacterClick(node.id)}
                      >
                        <div
                          className={`relative rounded-full overflow-hidden border-2 transition-all duration-500 ${
                            isExpanded || isSelected ? 'ring-2 ring-offset-2 ring-offset-museum-bg' : ''
                          } ${onPath ? 'ring-4 ring-purple-400/50 ring-offset-2 ring-offset-museum-bg animate-pulse-slow' : ''}`}
                          style={{
                            width: isSelected ? 72 : isHovered || highlighted ? 66 : 54,
                            height: isSelected ? 72 : isHovered || highlighted ? 66 : 54,
                            borderColor: onPath ? '#9d4edd' : eraColor,
                            boxShadow:
                              onPath
                                ? `0 0 30px #9d4edd60, 0 0 60px #9d4edd30`
                                : isSelected || isHovered || highlighted
                                ? `0 0 20px ${eraColor}40, 0 0 40px ${eraColor}20`
                                : `0 0 8px ${eraColor}15`,
                            '--tw-ring-color': onPath ? '#9d4edd' : eraColor,
                          } as React.CSSProperties}
                        >
                          <img
                            src={node.character.image}
                            alt={node.character.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {isExpanded && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {onPath && (
                            <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-purple-400 flex items-center justify-center">
                              <Route className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                      <div
                        className="mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-center whitespace-nowrap transition-all duration-300"
                        style={{
                          backgroundColor:
                            onPath
                              ? '#9d4edd30'
                              : isSelected || isHovered || highlighted
                              ? `${eraColor}30`
                              : 'rgba(255,255,255,0.05)',
                          color:
                            onPath
                              ? '#9d4edd'
                              : isSelected || isHovered || highlighted
                              ? eraColor
                              : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {node.character.name}
                      </div>

                      {(isSelected || isHovered || onPath) && (
                        <div className="mt-1 px-2 py-0.5 rounded text-[10px] text-museum-textMuted bg-black/60 whitespace-nowrap">
                          {getAnimeTitle(node.id)}
                        </div>
                      )}
                    </div>
                  );
                })}

                {displayNodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-museum-textMuted text-sm">点击角色开始探索关系网络</p>
                  </div>
                )}
                </div>
              </div>
            </div>

            {(showPathPanel || showQuestPanel || showSimilarPanel) && (
              <div className="w-80 flex-shrink-0 space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                {showPathPanel && (
                <div className="glass-card p-4">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Route className="w-5 h-5 text-purple-400" />
                    关系路径探索
                  </h3>
                  <p className="text-xs text-museum-textMuted mb-4">
                    选择两个角色，探索它们之间的关系链路，发现隐藏的联系。
                  </p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="text-xs text-museum-textMuted mb-1 block">起点角色</label>
                      <select
                        value={pathStart || ''}
                        onChange={(e) => setPathStart(e.target.value || null)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400/50"
                      >
                        <option value="">选择起点角色</option>
                        {allCharacters.map((char) => (
                          <option key={char.id} value={char.id}>
                            {char.name} - {char.animeTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-museum-textMuted mb-1 block">终点角色</label>
                      <select
                        value={pathEnd || ''}
                        onChange={(e) => setPathEnd(e.target.value || null)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400/50"
                      >
                        <option value="">选择终点角色</option>
                        {allCharacters.map((char) => (
                          <option key={char.id} value={char.id}>
                            {char.name} - {char.animeTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handlePathSearch}
                    disabled={!pathStart || !pathEnd}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                      pathStart && pathEnd
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                        : 'bg-white/5 text-museum-textMuted cursor-not-allowed'
                    }`}
                  >
                    探索关系路径
                  </button>

                  {foundPath && (
                    <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                      <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        发现路径！
                      </h4>
                      <p className="text-xs text-museum-textMuted mb-3">
                        共 {foundPath.length} 个角色，{foundPath.length - 1} 段关系
                      </p>
                      <div className="space-y-1">
                        {foundPath.map((charId, index) => {
                          const char = characterMap[charId];
                          if (!char) return null;
                          return (
                            <div
                              key={charId}
                              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                              onClick={() => {
                                setSelectedCharacter(charId);
                                if (!isCharacterExpanded(charId)) {
                                  toggleExpandCharacter(charId);
                                }
                              }}
                            >
                              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-xs text-white flex-1 truncate">{char.name}</span>
                              {index < foundPath.length - 1 && (
                                <ChevronRight className="w-3 h-3 text-museum-textMuted flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {foundPath === null && pathStart && pathEnd && (
                    <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                      <p className="text-xs text-red-400">
                        未找到两个角色之间的关系路径
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-semibold text-museum-textMuted mb-2">快速尝试</h4>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setPathStart('db-1');
                          setPathEnd('ds-1');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded text-xs text-museum-textMuted hover:text-white hover:bg-white/5 transition-colors"
                      >
                        孙悟空 → 灶门炭治郎
                      </button>
                      <button
                        onClick={() => {
                          setPathStart('doraemon-1');
                          setPathEnd('n-1');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded text-xs text-museum-textMuted hover:text-white hover:bg-white/5 transition-colors"
                      >
                        哆啦A梦 → 漩涡鸣人
                      </button>
                      <button
                        onClick={() => {
                          setPathStart('tf-1');
                          setPathEnd('aot-1');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded text-xs text-museum-textMuted hover:text-white hover:bg-white/5 transition-colors"
                      >
                        擎天柱 → 艾伦·耶格尔
                      </button>
                    </div>
                  </div>
                </div>
                )}

                {showQuestPanel && (
                <div className="glass-card p-4">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-yellow-400" />
                    关系探索任务
                  </h3>
                  <div className="space-y-3">
                    {relationQuests.map((quest) => {
                      const completed = isQuestCompleted(quest.id);
                      const typeIcon =
                        quest.type === 'find_similar'
                          ? '🔍'
                          : quest.type === 'trace_path'
                          ? '🗺️'
                          : '🔗';
                      return (
                        <div
                          key={quest.id}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            completed
                              ? 'bg-green-500/10 border border-green-500/30'
                              : 'bg-white/5 border border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-sm">{typeIcon}</span>
                            <div className="flex-1">
                              <h4
                                className={`text-sm font-semibold ${
                                  completed ? 'text-green-400' : 'text-white'
                                }`}
                              >
                                {quest.title}
                              </h4>
                              <p className="text-xs text-museum-textMuted mt-0.5">
                                {quest.description}
                              </p>
                            </div>
                            {completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-museum-textMuted flex-shrink-0 mt-0.5" />
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-yellow-400 font-medium">
                              +{quest.reward} 积分
                            </span>
                            {!completed && (
                              <button
                                onClick={() =>
                                  questHintVisible === quest.id
                                    ? setQuestHintVisible(null)
                                    : setQuestHintVisible(quest.id)
                                }
                                className="flex items-center gap-1 text-xs text-museum-textMuted hover:text-white transition-colors"
                              >
                                <Lightbulb className="w-3 h-3" />
                                提示
                              </button>
                            )}
                          </div>

                          {questHintVisible === quest.id && !completed && (
                            <div className="mt-2 p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                              <p className="text-xs text-yellow-400/90">{quest.hint}</p>
                            </div>
                          )}

                          {!completed && (
                            <button
                              onClick={() => handleQuestCheck(quest.id, quest.type, quest.targetIds, quest.reward)}
                              className="mt-2 w-full py-1.5 rounded-lg text-xs font-medium bg-white/5 text-museum-textMuted hover:bg-white/10 hover:text-white transition-all"
                            >
                              检查完成情况
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

                {showSimilarPanel && (
                <div className="glass-card p-4">
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    跨作品相似角色
                  </h3>
                  <div className="space-y-3">
                    {similarCharacterPairs.map((pair) => {
                      const charA = characterMap[pair.characterIdA];
                      const charB = characterMap[pair.characterIdB];
                      if (!charA || !charB) return null;
                      const discovered = stats.discoveredSimilar.includes(pair.id);

                      return (
                        <div
                          key={pair.id}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            discovered
                              ? 'bg-cyan-500/10 border border-cyan-500/30'
                              : 'bg-white/5 border border-white/10 hover:border-white/20'
                          }`}
                          onClick={() => {
                            if (!discovered) {
                              discoverSimilar(pair.id);
                            }
                            setSelectedCharacter(pair.characterIdA);
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                              <img src={charA.image} alt={charA.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-museum-textMuted text-xs">↔</span>
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                              <img src={charB.image} alt={charB.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {charA.name} &amp; {charB.name}
                              </p>
                            </div>
                            {discovered && <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-museum-textMuted mb-2 line-clamp-2">
                            {pair.reason}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {pair.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-400/10 text-cyan-400/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}
              </div>
            )}
          </div>

          {selectedCharInfo && (
            <div className="mt-6 glass-card p-6 relative overflow-hidden animate-slide-up">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `radial-gradient(circle at 0% 50%, ${getAnimeColor(selectedCharacter!)}40 0%, transparent 60%)`,
                }}
              />
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0"
                    style={{ borderColor: getAnimeColor(selectedCharacter!) }}
                  >
                    <img
                      src={selectedCharInfo.character.image}
                      alt={selectedCharInfo.character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-white">
                      {selectedCharInfo.character.name}
                    </h3>
                    <p className="text-sm text-museum-textMuted">
                      {selectedCharInfo.character.animeTitle}
                    </p>
                    <p className="text-sm text-museum-textMuted mt-1">
                      {selectedCharInfo.character.description}
                    </p>
                  </div>
                  <Link
                    to={`/character/${selectedCharacter}`}
                    className="glass-button px-3 py-2 text-sm text-museum-textMuted hover:text-white flex items-center gap-1.5"
                  >
                    查看详情
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-80s-primary" />
                      关系链路 ({selectedCharInfo.relations.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedCharInfo.relations.map((rel) => {
                        const otherCharId =
                          rel.fromCharacterId === selectedCharacter
                            ? rel.toCharacterId
                            : rel.fromCharacterId;
                        const otherChar = characterMap[otherCharId];
                        if (!otherChar) return null;
                        const typeConfig = CROSS_RELATION_TYPE_CONFIG[rel.type];
                        const discovered = isRelationDiscovered(rel.id);

                        return (
                          <div
                            key={rel.id}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                              discovered
                                ? 'bg-white/5'
                                : 'bg-white/[0.02] hover:bg-white/5'
                            }`}
                            onClick={() => {
                              setSelectedCharacter(otherCharId);
                              if (!discovered) {
                                discoverRelation(rel.id);
                              }
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-full overflow-hidden border"
                              style={{ borderColor: typeConfig.color }}
                            >
                              <img src={otherChar.image} alt={otherChar.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium">{otherChar.name}</p>
                              <p className="text-xs text-museum-textMuted truncate">{otherChar.animeTitle}</p>
                            </div>
                            <div
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${typeConfig.color}20`,
                                color: typeConfig.color,
                              }}
                            >
                              {RELATION_ICONS[rel.type]}
                              {rel.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedCharInfo.similarPairs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        跨作品相似角色
                      </h4>
                      <div className="space-y-2">
                        {selectedCharInfo.similarPairs.map((pair) => {
                          const otherCharId =
                            pair.characterIdA === selectedCharacter
                              ? pair.characterIdB
                              : pair.characterIdA;
                          const otherChar = characterMap[otherCharId];
                          if (!otherChar) return null;
                          const discovered = stats.discoveredSimilar.includes(pair.id);

                          return (
                            <div
                              key={pair.id}
                              className={`p-3 rounded-lg transition-all cursor-pointer ${
                                discovered
                                  ? 'bg-cyan-500/10 border border-cyan-500/20'
                                  : 'bg-white/[0.02] hover:bg-white/5 border border-transparent'
                              }`}
                              onClick={() => {
                                setSelectedCharacter(otherCharId);
                                if (!discovered) {
                                  discoverSimilar(pair.id);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                  <img src={otherChar.image} alt={otherChar.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm font-medium text-white">{otherChar.name}</span>
                                <span className="text-xs text-museum-textMuted">{otherChar.animeTitle}</span>
                              </div>
                              <p className="text-xs text-museum-textMuted line-clamp-2">{pair.reason}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container">
          <div className="glass-card p-6 max-w-4xl mx-auto">
            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              探索指南
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-3xl mb-2">👆</div>
                <h4 className="text-white font-semibold mb-1">点击探索</h4>
                <p className="text-museum-textMuted text-sm">
                  点击任意角色节点，展开其关联角色链路，发现跨作品关系。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="text-white font-semibold mb-1">完成任务</h4>
                <p className="text-museum-textMuted text-sm">
                  接受关系探索任务，找到指定角色组合，赢取探索积分。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-3xl mb-2">🔗</div>
                <h4 className="text-white font-semibold mb-1">发现连接</h4>
                <p className="text-museum-textMuted text-sm">
                  点击虚线关系发现隐藏连接，探索不同作品角色间的隐秘关联。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
