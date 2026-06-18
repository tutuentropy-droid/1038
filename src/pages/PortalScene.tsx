import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPortalWorldById, getWorldThemeInfo } from '@/data/portalWorlds';
import { usePortalStore } from '@/store/usePortalStore';
import { PortalPlayerState, MemoryFragment, HiddenStory } from '@/types';
import { ArrowLeft, Sparkles, BookOpen, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLAYER_SIZE = 36;
const PLAYER_SPEED = 3.5;
const INTERACTION_RANGE = 50;

export const PortalScene = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const world = getPortalWorldById(worldId || '');
  const themeInfo = world ? getWorldThemeInfo(world.theme) : null;

  const {
    collectFragment,
    discoverStory,
    isFragmentCollected,
    isStoryDiscovered,
    canUnlockStory,
    getRarityColor,
    getRarityBgColor,
    visitWorld,
    closeFragmentModal,
    closeStoryModal,
    openFragmentModal,
    openStoryModal,
    showFragmentModal,
    currentFragment,
    showStoryModal,
    currentStory,
  } = usePortalStore();

  const mapRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const animationRef = useRef<number>(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [player, setPlayer] = useState<PortalPlayerState>({
    position: world ? { ...world.entryPosition } : { x: 600, y: 450 },
    direction: 'down',
    isMoving: false,
  });

  const [nearbyFragment, setNearbyFragment] = useState<MemoryFragment | null>(null);
  const [nearbyStory, setNearbyStory] = useState<HiddenStory | null>(null);
  const [scale, setScale] = useState(1);
  const [showCollectionPanel, setShowCollectionPanel] = useState(false);

  useEffect(() => {
    if (world) {
      visitWorld(world.id);
    }
  }, [world?.id, visitWorld]);

  const checkCollision = useCallback((x: number, y: number): boolean => {
    if (!world) return false;

    const playerRect = {
      left: x - PLAYER_SIZE / 2,
      right: x + PLAYER_SIZE / 2,
      top: y - PLAYER_SIZE / 2,
      bottom: y + PLAYER_SIZE / 2,
    };

    for (const obstacle of world.obstacles) {
      const obsRect = {
        left: obstacle.x,
        right: obstacle.x + obstacle.width,
        top: obstacle.y,
        bottom: obstacle.y + obstacle.height,
      };

      if (
        playerRect.left < obsRect.right &&
        playerRect.right > obsRect.left &&
        playerRect.top < obsRect.bottom &&
        playerRect.bottom > obsRect.top
      ) {
        return true;
      }
    }

    return false;
  }, [world]);

  const checkFragmentCollision = useCallback((x: number, y: number): MemoryFragment | null => {
    if (!world) return null;

    for (const fragment of world.memoryFragments) {
      if (isFragmentCollected(fragment.id)) continue;

      const dist = Math.sqrt(
        Math.pow(x - fragment.position.x, 2) + Math.pow(y - fragment.position.y, 2)
      );

      if (dist < INTERACTION_RANGE) {
        return fragment;
      }
    }
    return null;
  }, [world, isFragmentCollected]);

  const checkStoryCollision = useCallback((x: number, y: number): HiddenStory | null => {
    if (!world) return null;

    for (const story of world.hiddenStories) {
      if (!canUnlockStory(story, world.id)) continue;

      const dist = Math.sqrt(
        Math.pow(x - story.position.x, 2) + Math.pow(y - story.position.y, 2)
      );

      if (dist < INTERACTION_RANGE) {
        return story;
      }
    }
    return null;
  }, [world, canUnlockStory]);

  const gameLoop = useCallback(() => {
    if (!world || showFragmentModal || showStoryModal || showCollectionPanel) {
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const keys = keysRef.current;
    let dx = 0;
    let dy = 0;
    let direction = player.direction;
    let isMoving = false;

    if (keys.has('ArrowUp') || keys.has('KeyW')) {
      dy -= PLAYER_SPEED;
      direction = 'up';
      isMoving = true;
    }
    if (keys.has('ArrowDown') || keys.has('KeyS')) {
      dy += PLAYER_SPEED;
      direction = 'down';
      isMoving = true;
    }
    if (keys.has('ArrowLeft') || keys.has('KeyA')) {
      dx -= PLAYER_SPEED;
      direction = 'left';
      isMoving = true;
    }
    if (keys.has('ArrowRight') || keys.has('KeyD')) {
      dx += PLAYER_SPEED;
      direction = 'right';
      isMoving = true;
    }

    if (dx !== 0 && dy !== 0) {
      const factor = 1 / Math.sqrt(2);
      dx *= factor;
      dy *= factor;
    }

    setPlayer((prev) => {
      let newX = prev.position.x + dx;
      let newY = prev.position.y + dy;

      newX = Math.max(PLAYER_SIZE, Math.min(world.mapWidth - PLAYER_SIZE, newX));
      newY = Math.max(PLAYER_SIZE, Math.min(world.mapHeight - PLAYER_SIZE, newY));

      if (checkCollision(newX, prev.position.y)) {
        newX = prev.position.x;
      }
      if (checkCollision(prev.position.x, newY)) {
        newY = prev.position.y;
      }

      const fragment = checkFragmentCollision(newX, newY);
      setNearbyFragment(fragment);

      const story = checkStoryCollision(newX, newY);
      setNearbyStory(story);

      return {
        position: { x: newX, y: newY },
        direction,
        isMoving,
      };
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [world, player.direction, checkCollision, checkFragmentCollision, checkStoryCollision, showFragmentModal, showStoryModal, showCollectionPanel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (nearbyFragment && !isFragmentCollected(nearbyFragment.id)) {
          collectFragment(nearbyFragment);
        } else if (nearbyStory && canUnlockStory(nearbyStory, world?.id || '')) {
          discoverStory(nearbyStory);
        }
      }

      if (e.code === 'Escape') {
        if (showFragmentModal) {
          closeFragmentModal();
        } else if (showStoryModal) {
          closeStoryModal();
        }
      }

      if (e.code === 'KeyE') {
        setShowCollectionPanel((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyFragment, nearbyStory, isFragmentCollected, collectFragment, canUnlockStory, discoverStory, world?.id, showFragmentModal, showStoryModal, closeFragmentModal, closeStoryModal]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    const updateScale = () => {
      if (mapContainerRef.current && world) {
        const containerWidth = mapContainerRef.current.clientWidth - 32;
        const containerHeight = window.innerHeight * 0.7;
        const scaleX = containerWidth / world.mapWidth;
        const scaleY = containerHeight / world.mapHeight;
        const newScale = Math.min(scaleX, scaleY, 1);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [world]);

  if (!world || !themeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">世界不存在</h2>
          <button
            onClick={() => navigate('/portal')}
            className="text-cyan-400 hover:underline"
          >
            返回传送门大厅
          </button>
        </div>
      </div>
    );
  }

  const renderObstacle = (obs: { x: number; y: number; width: number; height: number; type?: string }, index: number) => {
    const typeStyles: Record<string, { bg: string; border: string }> = {
      tree: { bg: 'bg-green-800/60', border: 'border-green-600/40' },
      rock: { bg: 'bg-gray-600/60', border: 'border-gray-500/40' },
      river: { bg: 'bg-blue-500/40', border: 'border-blue-400/30' },
      coral: { bg: 'bg-pink-600/50', border: 'border-pink-400/40' },
      planet: { bg: 'bg-purple-700/60', border: 'border-purple-500/40' },
      asteroid: { bg: 'bg-gray-500/60', border: 'border-gray-400/40' },
      building: { bg: 'bg-indigo-900/60', border: 'border-indigo-600/40' },
      bush: { bg: 'bg-green-700/50', border: 'border-green-500/30' },
      basketball: { bg: 'bg-orange-600/30', border: 'border-orange-400/40' },
      shipwreck: { bg: 'bg-amber-800/50', border: 'border-amber-600/40' },
    };

    const style = typeStyles[obs.type || 'rock'] || typeStyles.rock;

    return (
      <div
        key={index}
        className={cn('absolute rounded-lg border', style.bg, style.border)}
        style={{
          left: obs.x,
          top: obs.y,
          width: obs.width,
          height: obs.height,
        }}
      />
    );
  };

  const renderDecoration = (dec: { id: string; type: string; position: { x: number; y: number }; scale?: number }) => {
    const decorations: Record<string, { emoji: string; size: string; animation?: string }> = {
      flower: { emoji: '🌸', size: 'text-xl' },
      mushroom: { emoji: '🍄', size: 'text-lg' },
      bush: { emoji: '🌿', size: 'text-2xl' },
      firefly: { emoji: '✨', size: 'text-sm', animation: 'animate-pulse' },
      bubble: { emoji: '🫧', size: 'text-lg', animation: 'animate-float' },
      fish: { emoji: '🐟', size: 'text-xl', animation: 'animate-float-slow' },
      jellyfish: { emoji: '🪼', size: 'text-2xl', animation: 'animate-float' },
      treasure: { emoji: '💎', size: 'text-2xl' },
      star: { emoji: '⭐', size: 'text-sm', animation: 'animate-pulse' },
      nebula: { emoji: '🌌', size: 'text-4xl', animation: 'animate-pulse-slow' },
      satellite: { emoji: '🛰️', size: 'text-xl', animation: 'animate-float' },
      ufo: { emoji: '🛸', size: 'text-2xl', animation: 'animate-float-slow' },
      sakura: { emoji: '🌸', size: 'text-2xl', animation: 'animate-float' },
      bench: { emoji: '🪑', size: 'text-2xl' },
      locker: { emoji: '🚪', size: 'text-xl' },
      clock: { emoji: '🕐', size: 'text-2xl', animation: 'animate-pulse-slow' },
    };

    const deco = decorations[dec.type] || { emoji: '✨', size: 'text-lg' };

    return (
      <div
        key={dec.id}
        className={cn('absolute pointer-events-none', deco.size, deco.animation)}
        style={{
          left: dec.position.x,
          top: dec.position.y,
          transform: `scale(${dec.scale || 1})`,
        }}
      >
        {deco.emoji}
      </div>
    );
  };

  const renderFragments = () => {
    return world.memoryFragments.map((fragment) => {
      const collected = isFragmentCollected(fragment.id);
      const isNearby = nearbyFragment?.id === fragment.id;

      return (
        <div
          key={fragment.id}
          className={cn(
            'absolute z-10 transition-all duration-300',
            collected && 'opacity-30'
          )}
          style={{
            left: fragment.position.x - 20,
            top: fragment.position.y - 20,
          }}
          onClick={() => {
            if (!collected) {
              collectFragment(fragment);
            }
          }}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center cursor-pointer',
              `bg-gradient-to-br ${getRarityBgColor(fragment.rarity)}`,
              isNearby && 'scale-125 animate-pulse'
            )}
            style={{
              boxShadow: isNearby
                ? `0 0 20px ${fragment.rarity === 'legendary' ? '#fbbf24' : fragment.rarity === 'epic' ? '#a855f7' : fragment.rarity === 'rare' ? '#3b82f6' : '#6b7280'}`
                : 'none',
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          {isNearby && !collected && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
                按空格收集
              </div>
            </div>
          )}

          {collected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-green-400 text-lg">✓</div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderStories = () => {
    return world.hiddenStories.map((story) => {
      const discovered = isStoryDiscovered(story.id);
      const canUnlock = canUnlockStory(story, world.id);
      const isNearby = nearbyStory?.id === story.id;

      return (
        <div
          key={story.id}
          className={cn(
            'absolute z-10 transition-all duration-300',
            !canUnlock && 'opacity-40 grayscale'
          )}
          style={{
            left: story.position.x - 20,
            top: story.position.y - 20,
          }}
          onClick={() => {
            if (canUnlock) {
              discoverStory(story);
            }
          }}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center cursor-pointer',
              discovered ? 'bg-green-600' : canUnlock ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gray-600 cursor-not-allowed'
            )}
            style={{
              boxShadow: isNearby && canUnlock ? '0 0 20px #06b6d4' : 'none',
            }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>

          {isNearby && canUnlock && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
              <div className={cn(
                'text-xs px-2 py-1 rounded-lg',
                discovered 
                  ? 'bg-green-900/90 text-green-100' 
                  : 'bg-cyan-900/90 text-cyan-100'
              )}>
                {discovered ? '按空格重看' : '按空格阅读'}
              </div>
            </div>
          )}

          {!canUnlock && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="text-xs text-museum-textMuted">
                🔒 {story.requiredFragments}碎片解锁
              </div>
            </div>
          )}

          {discovered && canUnlock && !isNearby && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="text-xs text-green-400">
                ✓ 已发现
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderPlayer = () => {
    const { direction, isMoving } = player;
    return (
      <div
        className="absolute z-20 transition-transform"
        style={{
          left: player.position.x - PLAYER_SIZE / 2,
          top: player.position.y - PLAYER_SIZE / 2,
          width: PLAYER_SIZE,
          height: PLAYER_SIZE,
        }}
      >
        <div
          className={cn(
            'w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white shadow-lg relative',
            isMoving && 'animate-bounce'
          )}
          style={{ animationDuration: '0.3s' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full">
            <div
              className="absolute w-2.5 h-2.5 bg-museum-bg rounded-full"
              style={{
                left: direction === 'left' ? '1px' : direction === 'right' ? '13px' : '5px',
                top: direction === 'up' ? '1px' : direction === 'down' ? '13px' : '5px',
              }}
            />
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border border-white" />
        </div>
      </div>
    );
  };

  const collectedCount = world.memoryFragments.filter(f => isFragmentCollected(f.id)).length;
  const discoveredCount = world.hiddenStories.filter(s => isStoryDiscovered(s.id)).length;

  return (
    <div className="min-h-screen page-transition-enter py-6 px-4">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/portal')}
              className="flex items-center gap-2 text-museum-textMuted hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回大厅</span>
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">
                {collectedCount} / {world.memoryFragments.length}
              </span>
              <span className="text-museum-textMuted text-sm">碎片</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-semibold">
                {discoveredCount} / {world.hiddenStories.length}
              </span>
              <span className="text-museum-textMuted text-sm">故事</span>
            </div>
            <button
              onClick={() => setShowCollectionPanel(true)}
              className="glass-button px-4 py-2 text-sm"
            >
              收藏册 (E)
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <h1 className="font-display text-3xl font-bold text-white flex items-center justify-center gap-3">
            <span className="text-4xl">{world.icon}</span>
            {world.name}
          </h1>
          <p className="text-museum-textMuted mt-2">{world.description}</p>
        </div>

        <div ref={mapContainerRef} className="relative w-full flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: world.mapWidth * scale,
              height: world.mapHeight * scale,
            }}
          >
            <div
              ref={mapRef}
              className="absolute top-0 left-0 origin-top-left overflow-hidden rounded-2xl border-2 shadow-2xl"
              style={{
                width: world.mapWidth,
                height: world.mapHeight,
                transform: `scale(${scale})`,
                background: world.bgGradient,
                borderColor: `${world.accentColor}40`,
                boxShadow: `0 0 40px ${world.accentColor}20`,
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />

              {world.obstacles.map((obs, i) => renderObstacle(obs, i))}

              {world.decorations.map(renderDecoration)}

              {renderFragments()}
              {renderStories()}
              {renderPlayer()}

              <div className="absolute bottom-4 left-4 glass-card px-4 py-3 text-sm z-30">
                <div className="text-museum-textMuted mb-1">操作提示</div>
                <div className="text-white space-y-1">
                  <div>🎮 WASD / 方向键 - 移动</div>
                  <div>✨ 空格键 - 收集/交互</div>
                  <div>📖 E键 - 打开收藏册</div>
                  <div>⏎ ESC - 关闭弹窗</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFragmentModal && currentFragment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 max-w-md w-full animate-scale-in relative">
            <button
              onClick={closeFragmentModal}
              className="absolute top-4 right-4 text-museum-textMuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div
                className={cn(
                  'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center',
                  `bg-gradient-to-br ${getRarityBgColor(currentFragment.rarity)}`
                )}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              <div className="mb-2">
                <span
                  className={cn(
                    'text-xs px-3 py-1 rounded-full font-semibold',
                    getRarityColor(currentFragment.rarity)
                  )}
                  style={{
                    backgroundColor: `${currentFragment.rarity === 'legendary' ? '#fbbf24' : currentFragment.rarity === 'epic' ? '#a855f7' : currentFragment.rarity === 'rare' ? '#3b82f6' : '#6b7280'}20`,
                  }}
                >
                  {currentFragment.rarity === 'common' && '普通碎片'}
                  {currentFragment.rarity === 'rare' && '稀有碎片'}
                  {currentFragment.rarity === 'epic' && '史诗碎片'}
                  {currentFragment.rarity === 'legendary' && '传说碎片'}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-1">
                发现记忆碎片！
              </h3>

              <div className="flex items-center justify-center gap-3 my-4">
                <img
                  src={currentFragment.characterImage}
                  alt={currentFragment.characterName}
                  className="w-16 h-16 rounded-full border-2 border-white/20 object-cover"
                />
                <div className="text-left">
                  <div className="text-white font-bold text-lg">
                    {currentFragment.characterName}
                  </div>
                  <div className="text-museum-textMuted text-sm">
                    来自《{currentFragment.animeTitle}》
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <p className="text-yellow-300 italic mb-2">
                  "{currentFragment.quote}"
                </p>
                <p className="text-museum-textMuted text-sm leading-relaxed">
                  {currentFragment.story}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Star className="w-5 h-5" />
                <span className="font-bold text-lg">+{currentFragment.points} 积分</span>
              </div>

              <button
                onClick={closeFragmentModal}
                className="mt-6 w-full py-3 rounded-xl text-white font-semibold"
                style={{
                  backgroundColor: world.accentColor,
                }}
              >
                太棒了！
              </button>
            </div>
          </div>
        </div>
      )}

      {showStoryModal && currentStory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 max-w-lg w-full animate-scale-in relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeStoryModal}
              className="absolute top-4 right-4 text-museum-textMuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-1">
                {currentStory.title}
              </h3>

              <div className="text-cyan-400 text-sm mb-4">
                隐藏故事 · 来自《{currentStory.animeTitle}》
              </div>

              <div className="bg-white/5 rounded-xl p-6 text-left">
                <p className="text-museum-text/90 leading-relaxed">
                  {currentStory.content}
                </p>
              </div>

              <button
                onClick={closeStoryModal}
                className="mt-6 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {showCollectionPanel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                收藏册
              </h3>
              <button
                onClick={() => setShowCollectionPanel(false)}
                className="text-museum-textMuted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">记忆碎片</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {collectedCount} / {world.memoryFragments.length}
                </div>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-semibold">隐藏故事</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {discoveredCount} / {world.hiddenStories.length}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh] pr-2">
              <h4 className="text-white font-semibold mb-3">记忆碎片</h4>
              <div className="grid grid-cols-1 gap-3 mb-6">
                {world.memoryFragments.map((fragment) => {
                  const collected = isFragmentCollected(fragment.id);
                  return (
                    <div
                      key={fragment.id}
                      className={cn(
                        'p-3 rounded-xl flex items-center gap-3 transition-colors',
                        collected ? 'bg-white/10 hover:bg-white/15 cursor-pointer' : 'bg-white/5 opacity-50'
                      )}
                      onClick={() => {
                        if (collected) {
                          openFragmentModal(fragment);
                          setShowCollectionPanel(false);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                          collected
                            ? `bg-gradient-to-br ${getRarityBgColor(fragment.rarity)}`
                            : 'bg-gray-700'
                        )}
                      >
                        {collected ? (
                          <Sparkles className="w-6 h-6 text-white" />
                        ) : (
                          <span className="text-gray-500">?</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {collected ? fragment.characterName : '???'}
                        </div>
                        <div className="text-museum-textMuted text-sm truncate">
                          {collected ? `《${fragment.animeTitle}》` : '未收集'}
                        </div>
                      </div>
                      <div className={cn('text-sm font-semibold', getRarityColor(fragment.rarity))}>
                        {collected ? `+${fragment.points}` : '---'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <h4 className="text-white font-semibold mb-3">隐藏故事</h4>
              <div className="space-y-3">
                {world.hiddenStories.map((story) => {
                  const discovered = isStoryDiscovered(story.id);
                  const canUnlock = canUnlockStory(story, world.id);
                  return (
                    <div
                      key={story.id}
                      className={cn(
                        'p-4 rounded-xl transition-colors',
                        discovered
                          ? 'bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/15 cursor-pointer'
                          : canUnlock
                          ? 'bg-white/5 border border-white/10'
                          : 'bg-white/5 opacity-50 border border-white/5'
                      )}
                      onClick={() => {
                        if (discovered) {
                          openStoryModal(story);
                          setShowCollectionPanel(false);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            discovered
                              ? 'bg-cyan-600'
                              : canUnlock
                              ? 'bg-gray-600'
                              : 'bg-gray-700'
                          )}
                        >
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            {discovered ? story.title : '???'}
                          </div>
                          <div className="text-museum-textMuted text-sm">
                            {discovered
                              ? `《${story.animeTitle}》 · 点击重看`
                              : canUnlock
                              ? '按空格发现故事'
                              : `需要 ${story.requiredFragments} 个碎片解锁`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
