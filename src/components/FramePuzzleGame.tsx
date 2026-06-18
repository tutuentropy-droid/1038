import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Sparkles, CheckCircle2, RotateCcw, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Frame {
  id: string;
  correctIndex: number;
  currentIndex: number;
  image: string;
  hint: string;
}

interface FramePuzzleGameProps {
  imageUrl: string;
  onComplete: (isPerfect: boolean) => void;
  onClose: () => void;
  frameCount?: number;
}

const imgPrompt = (prompt: string, size = 'square') =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

export const FramePuzzleGame = ({
  imageUrl,
  onComplete,
  onClose,
  frameCount = 5,
}: FramePuzzleGameProps) => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newFrames: Frame[] = [];
    const sceneHints = [
      '开场画面',
      '角色登场',
      '情节发展',
      '高潮部分',
      '结局画面',
    ];
    
    for (let i = 0; i < frameCount; i++) {
      newFrames.push({
        id: `frame-${i}`,
        correctIndex: i,
        currentIndex: i,
        image: imgPrompt(`anime scene ${i + 1}, part of a sequence, ${sceneHints[i] || ''}, style consistent`, 'square'),
        hint: sceneHints[i] || `第${i + 1}帧`,
      });
    }

    const shuffled = [...newFrames].sort(() => Math.random() - 0.5);
    shuffled.forEach((frame, index) => {
      frame.currentIndex = index;
    });

    setFrames(shuffled);
  }, [frameCount]);

  const isCorrectOrder = useCallback(() => {
    return frames.every(frame => frame.currentIndex === frame.correctIndex);
  }, [frames]);

  const handleFrameClick = (frameId: string) => {
    if (isComplete || isPlaying) return;

    if (!selectedFrame) {
      setSelectedFrame(frameId);
    } else if (selectedFrame === frameId) {
      setSelectedFrame(null);
    } else {
      setFrames(prev => {
        const newFrames = [...prev];
        const frame1 = newFrames.find(f => f.id === selectedFrame)!;
        const frame2 = newFrames.find(f => f.id === frameId)!;
        
        const tempIndex = frame1.currentIndex;
        frame1.currentIndex = frame2.currentIndex;
        frame2.currentIndex = tempIndex;
        
        return newFrames;
      });
      setMoves(prev => prev + 1);
      setSelectedFrame(null);
    }
  };

  const handleReset = () => {
    setFrames(prev => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      shuffled.forEach((frame, index) => {
        frame.currentIndex = index;
      });
      return shuffled;
    });
    setMoves(prev => prev + 5);
    setSelectedFrame(null);
    setHintUsed(true);
  };

  const handleShowHint = () => {
    setHintUsed(true);
    setMoves(prev => prev + 3);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setPlayingIndex(0);
      playIntervalRef.current = setInterval(() => {
        setPlayingIndex(prev => {
          if (prev >= frameCount - 1) {
            if (playIntervalRef.current) {
              clearInterval(playIntervalRef.current);
            }
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 800);
    }
  };

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCorrectOrder() && !isComplete && frames.length > 0) {
      setIsComplete(true);
      setShowSuccess(true);
      setTimeout(() => {
        onComplete(moves <= frameCount * 2 && !hintUsed);
      }, 1500);
    }
  }, [frames, isCorrectOrder, isComplete, moves, frameCount, hintUsed, onComplete]);

  const sortedFrames = [...frames].sort((a, b) => a.currentIndex - b.currentIndex);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card p-6 max-w-4xl w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>🧩</span> 修复缺失帧
              </h2>
              <p className="text-museum-textMuted text-sm mt-1">
                点击两帧交换位置，按正确的故事顺序排列画面
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
                <span className="text-museum-textMuted">移动次数</span>
                <span className="text-white font-bold">{moves}</span>
              </div>
              <div className="h-2 bg-museum-bgLight rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    moves <= frameCount * 2
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  )}
                  style={{
                    width: `${Math.min(100, (moves / (frameCount * 3)) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? '暂停' : '播放'}
            </button>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-museum-bgLight">
            {isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={sortedFrames[playingIndex]?.image || imageUrl}
                  alt={`帧 ${playingIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 px-4 py-2 rounded-lg">
                  帧 {playingIndex + 1} / {frameCount}
                </div>
                <div className="absolute bottom-4 right-4 flex gap-1">
                  {sortedFrames.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all duration-300',
                        i === playingIndex ? 'bg-white w-6' : 'bg-white/30'
                      )}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 p-4">
                <div className="grid grid-cols-5 gap-2 h-full">
                  {sortedFrames.map((frame, index) => (
                    <div
                      key={frame.id}
                      className={cn(
                        'relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 group',
                        selectedFrame === frame.id && 'ring-4 ring-purple-400 scale-105 z-10',
                        frame.currentIndex === frame.correctIndex && !selectedFrame && 'ring-2 ring-green-500/50'
                      )}
                      onClick={() => handleFrameClick(frame.id)}
                    >
                      <img
                        src={frame.image}
                        alt={`帧 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-xs text-white font-bold">
                          位置 {index + 1}
                        </div>
                        {hintUsed && (
                          <div className="text-[10px] text-purple-300">
                            应该是: {frame.hint}
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {index + 1}
                        </span>
                      </div>
                      {frame.currentIndex === frame.correctIndex && !selectedFrame && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                      {selectedFrame === frame.id && (
                        <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">已选中</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-bounce-once">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-display text-3xl font-bold text-white mb-2">
                    帧顺序修复完成！
                  </h3>
                  {moves <= frameCount * 2 && !hintUsed && (
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

          <div className="flex items-center justify-between">
            <div className="text-sm text-museum-textMuted">
              💡 点击选中一帧，再点击另一帧交换位置
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShowHint}
                className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/30 transition-colors"
                disabled={hintUsed}
              >
                💡 {hintUsed ? '已显示提示' : '显示提示'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 glass-button text-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                重新打乱
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
