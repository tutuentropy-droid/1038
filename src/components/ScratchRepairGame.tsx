import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Scratch {
  id: string;
  x: number;
  y: number;
  length: number;
  rotation: number;
  width: number;
  repaired: boolean;
  progress: number;
}

interface ScratchRepairGameProps {
  imageUrl: string;
  onComplete: (isPerfect: boolean) => void;
  onClose: () => void;
  scratchCount?: number;
}

export const ScratchRepairGame = ({
  imageUrl,
  onComplete,
  onClose,
  scratchCount = 5,
}: ScratchRepairGameProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scratches, setScratches] = useState<Scratch[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const repairedPathRef = useRef<Set<string>>(new Set());
  const mistakeCooldownRef = useRef<number>(0);
  const lastHitTimeRef = useRef<number>(0);

  useEffect(() => {
    const newScratches: Scratch[] = [];
    for (let i = 0; i < scratchCount; i++) {
      newScratches.push({
        id: `scratch-${i}`,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        length: 15 + Math.random() * 25,
        rotation: Math.random() * 180 - 90,
        width: 3 + Math.random() * 4,
        repaired: false,
        progress: 0,
      });
    }
    setScratches(newScratches);
  }, [scratchCount]);

  const getMousePos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const checkScratchCollision = useCallback((mouseX: number, mouseY: number) => {
    let hitAnyScratch = false;

    setScratches((prev) =>
      prev.map((scratch) => {
        if (scratch.repaired) return scratch;

        const radians = (scratch.rotation * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const dx = mouseX - scratch.x;
        const dy = mouseY - scratch.y;

        const rotatedX = dx * cos + dy * sin;
        const rotatedY = -dx * sin + dy * cos;

        const halfLength = scratch.length / 2;
        const hitWidth = scratch.width + 10;

        if (
          Math.abs(rotatedX) <= halfLength &&
          Math.abs(rotatedY) <= hitWidth
        ) {
          hitAnyScratch = true;
          const pathKey = `${scratch.id}-${Math.round(mouseX * 2)}-${Math.round(mouseY * 2)}`;
          if (!repairedPathRef.current.has(pathKey)) {
            repairedPathRef.current.add(pathKey);
            const newProgress = Math.min(100, scratch.progress + 12);
            return {
              ...scratch,
              progress: newProgress,
              repaired: newProgress >= 100,
            };
          }
        }
        return scratch;
      })
    );

    const now = Date.now();
    if (hitAnyScratch) {
      lastHitTimeRef.current = now;
    } else if (isDragging) {
      const timeSinceLastHit = now - lastHitTimeRef.current;
      const cooldownOK = now - mistakeCooldownRef.current > 500;
      if (timeSinceLastHit > 800 && cooldownOK && lastHitTimeRef.current > 0) {
        mistakeCooldownRef.current = now;
        setMistakes((prev) => prev + 1);
      }
    }
  }, [isDragging]);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pos = getMousePos(e);
    lastPosRef.current = pos;
    checkScratchCollision(pos.x, pos.y);
  }, [getMousePos, checkScratchCollision]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const pos = getMousePos(e);
    checkScratchCollision(pos.x, pos.y);
    lastPosRef.current = pos;
  }, [isDragging, getMousePos, checkScratchCollision]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    lastPosRef.current = null;
  }, []);

  useEffect(() => {
    const allRepaired = scratches.length > 0 && scratches.every((s) => s.repaired);
    if (allRepaired && !isComplete) {
      setIsComplete(true);
      setShowSuccess(true);
      setTimeout(() => {
        onComplete(mistakes === 0);
      }, 1500);
    }
  }, [scratches, isComplete, mistakes, onComplete]);

  const repairedCount = scratches.filter((s) => s.repaired).length;
  const progress = scratches.length > 0 ? Math.round((repairedCount / scratches.length) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card p-6 max-w-2xl w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>〰️</span> 修复胶片划痕
              </h2>
              <p className="text-museum-textMuted text-sm mt-1">
                用鼠标或手指在划痕上滑动擦拭，修复所有划痕
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-museum-textMuted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-museum-textMuted">修复进度</span>
                <span className="text-white font-bold">{repairedCount} / {scratches.length}</span>
              </div>
              <div className="h-2 bg-museum-bgLight rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {mistakes > 0 && (
              <div className="text-sm text-orange-400">
                失误: {mistakes}
              </div>
            )}
          </div>

          <div
            ref={canvasRef}
            className="relative aspect-video rounded-xl overflow-hidden cursor-crosshair select-none touch-none"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
            
            {scratches.map((scratch) => (
              <div
                key={scratch.id}
                className={cn(
                  'absolute transition-opacity duration-500',
                  scratch.repaired && 'opacity-0'
                )}
                style={{
                  left: `${scratch.x}%`,
                  top: `${scratch.y}%`,
                  width: `${scratch.length}%`,
                  height: `${scratch.width}px`,
                  transform: `translate(-50%, -50%) rotate(${scratch.rotation}deg)`,
                  opacity: scratch.repaired ? 0 : 1 - scratch.progress / 100,
                }}
              >
                <div
                  className="w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
                  style={{
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                    filter: 'blur(0.5px)',
                  }}
                />
                {!scratch.repaired && scratch.progress > 0 && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/80 whitespace-nowrap">
                    {scratch.progress}%
                  </div>
                )}
              </div>
            ))}

            {showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-bounce-once">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-display text-3xl font-bold text-white mb-2">
                    划痕修复完成！
                  </h3>
                  {mistakes === 0 && (
                    <div className="flex items-center justify-center gap-2 text-yellow-400">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-bold">完美修复！</span>
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm">
            <div className="text-museum-textMuted">
              💡 提示：沿着划痕方向擦拭效果更好，注意不要蹭到其他区域
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
