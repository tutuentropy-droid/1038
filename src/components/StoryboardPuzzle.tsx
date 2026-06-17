import { useState, useCallback, useEffect } from 'react';
import {
  GripVertical,
  RotateCcw,
  CheckCircle,
  Trophy,
  Clock,
  Camera,
  Shuffle,
} from 'lucide-react';
import { StoryboardCard, storyboardCards } from '@/data/workshop';
import { useWorkshopStore } from '@/store/useWorkshopStore';

interface StoryboardPuzzleProps {
  onBadgeEarned?: (badgeId: string) => void;
}

export const StoryboardPuzzle = ({ onBadgeEarned }: StoryboardPuzzleProps) => {
  const [cards, setCards] = useState<StoryboardCard[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { completeStoryboardPuzzle, completedStoryboardPuzzle, earnBadge } =
    useWorkshopStore();

  const shuffleCards = useCallback(() => {
    const shuffled = [...storyboardCards]
      .map((card) => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ card }) => card);
    setCards(shuffled);
    setIsComplete(false);
    setAttempts(0);
  }, []);

  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  const checkOrder = () => {
    setAttempts((prev) => prev + 1);
    const isCorrect = cards.every(
      (card, index) => card.sceneNumber === index + 1
    );
    if (isCorrect) {
      setIsComplete(true);
      if (!completedStoryboardPuzzle) {
        completeStoryboardPuzzle();
        earnBadge('storyboard-puzzle');
        onBadgeEarned?.('storyboard-puzzle');
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newCards = [...cards];
    const [draggedCard] = newCards.splice(draggedIndex, 1);
    newCards.splice(dropIndex, 0, draggedCard);
    setCards(newCards);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getCardPosition = (sceneNumber: number, currentIndex: number) => {
    if (showHint) {
      const correctIndex = sceneNumber - 1;
      if (currentIndex === correctIndex) return 'correct';
      if (currentIndex < correctIndex) return 'move-right';
      return 'move-left';
    }
    return 'none';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <Shuffle className="w-4 h-4 text-90s-primary" />
          <span className="text-sm text-museum-textMuted">分镜排序挑战</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-white mb-2">
          故事拼图
        </h2>
        <p className="text-museum-textMuted max-w-xl mx-auto">
          拖动分镜卡片，按照正确的故事顺序排列它们。完成后点击"检查顺序"验证你的答案！
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <button
          onClick={shuffleCards}
          className="glass-button px-4 py-2 text-sm text-white flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重新打乱
        </button>
        <button
          onClick={() => setShowHint(!showHint)}
          className={`glass-button px-4 py-2 text-sm flex items-center gap-2 ${
            showHint ? 'text-yellow-400 border-yellow-400/30' : 'text-museum-textMuted'
          }`}
        >
          <Camera className="w-4 h-4" />
          {showHint ? '隐藏提示' : '显示提示'}
        </button>
        <button
          onClick={checkOrder}
          className="glass-button px-6 py-2 text-sm text-white bg-gradient-to-r from-80s-primary/20 to-00s-primary/20 border-white/20 flex items-center gap-2 hover:from-80s-primary/30 hover:to-00s-primary/30 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          检查顺序
        </button>
      </div>

      {attempts > 0 && (
        <div className="text-center">
          <p className="text-sm text-museum-textMuted">
            尝试次数：<span className="text-white font-bold">{attempts}</span>
          </p>
        </div>
      )}

      {isComplete && (
        <div className="glass-card p-6 border-green-500/30 bg-green-500/5 text-center animate-bounce-once">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">恭喜完成！</h3>
          <p className="text-museum-textMuted">
            你成功排列了正确的故事顺序！获得「故事拼图高手」徽章
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, index) => {
          const position = getCardPosition(card.sceneNumber, index);
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={card.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group cursor-grab active:cursor-grabbing transition-all duration-300 
                ${isDragging ? 'opacity-50 scale-105 rotate-2 z-50' : ''}
                ${isDragOver ? 'scale-105 border-80s-primary/50' : ''}
                ${position === 'correct' ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-museum-bg' : ''}
                ${position === 'move-left' ? 'ring-2 ring-yellow-500/50' : ''}
                ${position === 'move-right' ? 'ring-2 ring-yellow-500/50' : ''}`}
            >
              <div className="glass-card overflow-hidden hover-lift">
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-white" />
                  </div>
                </div>

                {showHint && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        position === 'correct'
                          ? 'bg-green-500 text-white'
                          : 'bg-yellow-500/80 text-black'
                      }`}
                    >
                      {card.sceneNumber}
                    </div>
                  </div>
                )}

                <div className="aspect-square relative overflow-hidden bg-museum-bgLight">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>

                <div className="p-3">
                  <h4 className="font-bold text-white text-sm mb-1">
                    {card.title}
                  </h4>
                  <p className="text-xs text-museum-textMuted line-clamp-2 mb-2">
                    {card.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-museum-textMuted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {card.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      {card.camera}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-[inherit] pointer-events-none transition-colors" />
              </div>

              {position === 'move-left' && showHint && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-yellow-400 animate-pulse">
                  ←
                </div>
              )}
              {position === 'move-right' && showHint && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 text-yellow-400 animate-pulse">
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showHint && (
        <div className="text-center text-sm text-museum-textMuted">
          <p>💡 提示：绿色表示位置正确，黄色表示需要移动（箭头指向目标方向）</p>
        </div>
      )}
    </div>
  );
};
