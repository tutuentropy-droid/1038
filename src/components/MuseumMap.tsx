import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { museumMapData, npcs } from '@/data/museumMap';
import { NPC, MapExhibit, Direction, PlayerState } from '@/types';
import { X, MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLAYER_SIZE = 32;
const PLAYER_SPEED = 4;
const INTERACTION_RANGE = 60;

export const MuseumMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const animationRef = useRef<number>(0);

  const [player, setPlayer] = useState<PlayerState>({
    position: { x: 560, y: 700 },
    direction: 'down',
    isMoving: false,
  });

  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [nearbyExhibit, setNearbyExhibit] = useState<MapExhibit | null>(null);
  const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null);
  const [showMap, setShowMap] = useState(true);

  const checkCollision = useCallback((x: number, y: number): boolean => {
    const playerRect = {
      left: x - PLAYER_SIZE / 2,
      right: x + PLAYER_SIZE / 2,
      top: y - PLAYER_SIZE / 2,
      bottom: y + PLAYER_SIZE / 2,
    };

    for (const obstacle of museumMapData.obstacles) {
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
  }, []);

  const checkExhibitCollision = useCallback((x: number, y: number): MapExhibit | null => {
    for (const exhibit of museumMapData.exhibits) {
      const centerX = exhibit.position.x + exhibit.size.width / 2;
      const centerY = exhibit.position.y + exhibit.size.height / 2;
      const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const minDist = Math.max(exhibit.size.width, exhibit.size.height) / 2 + INTERACTION_RANGE;

      if (dist < minDist) {
        return exhibit;
      }
    }
    return null;
  }, []);

  const checkNPCCollision = useCallback((x: number, y: number): NPC | null => {
    for (const npc of npcs) {
      const dist = Math.sqrt(
        Math.pow(x - npc.position.x, 2) + Math.pow(y - npc.position.y, 2)
      );
      if (dist < INTERACTION_RANGE) {
        return npc;
      }
    }
    return null;
  }, []);

  const gameLoop = useCallback(() => {
    if (activeNPC || showStory) {
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const keys = keysRef.current;
    let dx = 0;
    let dy = 0;
    let direction: Direction = player.direction;
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

      newX = Math.max(PLAYER_SIZE, Math.min(museumMapData.width - PLAYER_SIZE, newX));
      newY = Math.max(PLAYER_SIZE, Math.min(museumMapData.height - PLAYER_SIZE, newY));

      if (checkCollision(newX, prev.position.y)) {
        newX = prev.position.x;
      }
      if (checkCollision(prev.position.x, newY)) {
        newY = prev.position.y;
      }

      const exhibit = checkExhibitCollision(newX, newY);
      setNearbyExhibit(exhibit);

      const npc = checkNPCCollision(newX, newY);
      setNearbyNPC(npc);

      return {
        position: { x: newX, y: newY },
        direction,
        isMoving,
      };
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [activeNPC, showStory, player.direction, checkCollision, checkExhibitCollision, checkNPCCollision]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (nearbyNPC && !activeNPC) {
          setActiveNPC(nearbyNPC);
          setDialogueIndex(0);
          setShowStory(false);
        } else if (activeNPC && !showStory) {
          if (dialogueIndex < activeNPC.dialogues.length - 1) {
            setDialogueIndex((prev) => prev + 1);
          } else {
            setShowStory(true);
          }
        } else if (nearbyExhibit) {
          navigate(nearbyExhibit.linkPath);
        }
      }

      if (e.code === 'Escape') {
        if (showStory) {
          setShowStory(false);
        } else if (activeNPC) {
          setActiveNPC(null);
          setDialogueIndex(0);
        }
      }

      if (e.code === 'KeyM') {
        setShowMap((prev) => !prev);
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
  }, [nearbyNPC, nearbyExhibit, activeNPC, dialogueIndex, showStory, navigate]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameLoop]);

  const getEraColor = (era: string) => {
    switch (era) {
      case '80s':
        return 'text-80s-primary';
      case '90s':
        return 'text-90s-primary';
      case '00s':
        return 'text-00s-primary';
      default:
        return 'text-museum-textMuted';
    }
  };

  const getEraBorderColor = (era: string) => {
    switch (era) {
      case '80s':
        return '#ff00ff';
      case '90s':
        return '#ff6b35';
      case '00s':
        return '#9d4edd';
      default:
        return '#6b7280';
    }
  };

  const getPlayerSprite = () => {
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full">
            <div
              className="absolute w-2 h-2 bg-museum-bg rounded-full"
              style={{
                left: direction === 'left' ? '1px' : direction === 'right' ? '11px' : '4px',
                top: direction === 'up' ? '1px' : direction === 'down' ? '11px' : '4px',
              }}
            />
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border border-white" />
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-white bg-museum-bg/80 px-2 py-0.5 rounded whitespace-nowrap">
          小导游
        </div>
      </div>
    );
  };

  const renderNPCs = () => {
    return npcs.map((npc) => (
      <div
        key={npc.id}
        className="absolute z-10 cursor-pointer transition-all"
        style={{
          left: npc.position.x - 24,
          top: npc.position.y - 24,
        }}
        onClick={() => {
          setActiveNPC(npc);
          setDialogueIndex(0);
          setShowStory(false);
        }}
      >
        <div className="relative">
          <img
            src={npc.avatar}
            alt={npc.name}
            className="w-12 h-12 rounded-full border-2 object-cover"
            style={{ borderColor: getEraBorderColor(npc.era) }}
          />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-white" />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium text-white bg-museum-bg/80 px-2 py-0.5 rounded whitespace-nowrap">
            {npc.name}
          </div>
          {nearbyNPC?.id === npc.id && !activeNPC && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="bg-yellow-400 text-museum-bg text-xs font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
                按空格键对话
              </div>
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderExhibits = () => {
    return museumMapData.exhibits.map((exhibit) => {
      const isNearby = nearbyExhibit?.id === exhibit.id;
      const eraColor = getEraColor(exhibit.era);
      const borderColor = getEraBorderColor(exhibit.era);

      return (
        <div
          key={exhibit.id}
          className={cn(
            'absolute z-5 transition-all duration-300',
            isNearby && 'scale-105'
          )}
          style={{
            left: exhibit.position.x,
            top: exhibit.position.y,
            width: exhibit.size.width,
            height: exhibit.size.height,
          }}
        >
          <div
            className={cn(
              'w-full h-full rounded-xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer backdrop-blur-sm',
              isNearby ? 'shadow-2xl' : ''
            )}
            style={{
              borderColor,
              background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}05 100%)`,
              boxShadow: isNearby ? `0 0 30px ${borderColor}60` : 'none',
            }}
            onClick={() => navigate(exhibit.linkPath)}
          >
            <MapPin className="w-6 h-6" style={{ color: borderColor }} />
            <span className="text-white font-bold text-sm text-center px-2">
              {exhibit.name}
            </span>
            {isNearby && (
              <div className="text-xs text-yellow-400 font-medium animate-pulse">
                按空格键进入
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (mapContainerRef.current) {
        const containerWidth = mapContainerRef.current.clientWidth - 32;
        const containerHeight = window.innerHeight * 0.7;
        const scaleX = containerWidth / museumMapData.width;
        const scaleY = containerHeight / museumMapData.height;
        const newScale = Math.min(scaleX, scaleY, 1);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div ref={mapContainerRef} className="relative w-full flex items-center justify-center py-4">
      <div
        className="relative"
        style={{
          width: museumMapData.width * scale,
          height: museumMapData.height * scale,
        }}
      >
        <div
          ref={mapRef}
          className="absolute top-0 left-0 origin-top-left overflow-hidden rounded-2xl border-2 border-museum-border shadow-2xl"
          style={{
            width: museumMapData.width,
            height: museumMapData.height,
            transform: `scale(${scale})`,
            opacity: showMap ? 1 : 0,
            pointerEvents: showMap ? 'auto' : 'none',
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 80%, rgba(157, 78, 221, 0.1) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, rgba(255, 107, 53, 0.05) 0%, transparent 50%),
              linear-gradient(180deg, #0a0e27 0%, #0d1230 50%, #0a0e27 100%)
            `,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {museumMapData.obstacles.map((obs, i) => (
            <div
              key={i}
              className="absolute bg-museum-bgLight border border-museum-border rounded"
              style={{
                left: obs.x,
                top: obs.y,
                width: obs.width,
                height: obs.height,
              }}
            />
          ))}

          {renderExhibits()}
          {renderNPCs()}
          {getPlayerSprite()}

          <div className="absolute bottom-4 left-4 glass-card px-4 py-3 text-sm">
            <div className="text-museum-textMuted mb-1">操作提示</div>
            <div className="text-white space-y-1">
              <div>🎮 WASD / 方向键 - 移动</div>
              <div>💬 空格键 - 交互/对话</div>
              <div>🗺️ M键 - 切换地图</div>
              <div>⏎ ESC - 关闭对话</div>
            </div>
          </div>

          <div className="absolute top-4 right-4 glass-card px-4 py-2">
            <div className="text-xs text-museum-textMuted">当前位置</div>
            <div className="text-white font-bold">
              {nearbyExhibit ? nearbyExhibit.name : '博物馆大厅'}
            </div>
          </div>
        </div>

        {!showMap && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setShowMap(true)}
              className="glass-card px-8 py-4 text-white font-bold hover:bg-white/10 transition-all"
            >
              <MapPin className="w-6 h-6 inline mr-2" />
              显示地图 (M)
            </button>
          </div>
        )}
      </div>

      {activeNPC && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 pb-8 pointer-events-none">
          <div
            className="glass-card p-6 max-w-2xl w-full mx-4 animate-slide-up pointer-events-auto"
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="flex items-start gap-4">
              <img
                src={activeNPC.avatar}
                alt={activeNPC.name}
                className="w-16 h-16 rounded-full border-2 object-cover flex-shrink-0"
                style={{ borderColor: getEraBorderColor(activeNPC.era) }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-lg">{activeNPC.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${getEraBorderColor(activeNPC.era)}30`,
                      color: getEraBorderColor(activeNPC.era),
                    }}
                  >
                    {activeNPC.role}
                  </span>
                </div>
                {!showStory ? (
                  <>
                    <p className="text-museum-textMuted mb-4 text-base leading-relaxed">
                      {activeNPC.dialogues[dialogueIndex]}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-museum-textMuted">
                        {dialogueIndex + 1} / {activeNPC.dialogues.length}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActiveNPC(null);
                            setDialogueIndex(0);
                          }}
                          className="px-4 py-2 glass-button text-sm"
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          离开
                        </button>
                        <button
                          onClick={() => {
                            if (dialogueIndex < activeNPC.dialogues.length - 1) {
                              setDialogueIndex((prev) => prev + 1);
                            } else {
                              setShowStory(true);
                            }
                          }}
                          className="px-4 py-2 rounded-xl text-white text-sm font-medium"
                          style={{
                            backgroundColor: getEraBorderColor(activeNPC.era),
                          }}
                        >
                          {dialogueIndex < activeNPC.dialogues.length - 1 ? (
                            <>
                              继续
                              <ArrowRight className="w-4 h-4 inline ml-1" />
                            </>
                          ) : (
                            '听故事'
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="max-h-80 overflow-y-auto pr-2 scrollbar-hide">
                    <h3 className="font-bold text-xl text-white mb-4">
                      {activeNPC.eraStory.title}
                    </h3>
                    <div className="space-y-3 text-museum-textMuted leading-relaxed">
                      {activeNPC.eraStory.content.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setShowStory(false)}
                        className="px-4 py-2 glass-button text-sm"
                      >
                        返回对话
                      </button>
                      <button
                        onClick={() => navigate(`/era/${activeNPC.era}`)}
                        className="px-4 py-2 rounded-xl text-white text-sm font-medium"
                        style={{
                          backgroundColor: getEraBorderColor(activeNPC.era),
                        }}
                      >
                        前往{activeNPC.era === '80s' ? '80年代' : activeNPC.era === '90s' ? '90年代' : '00年代'}展区
                        <ArrowRight className="w-4 h-4 inline ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
