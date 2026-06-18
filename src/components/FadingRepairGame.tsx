import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorChannel {
  id: string;
  name: string;
  label: string;
  color: string;
  current: number;
  target: number;
  min: number;
  max: number;
}

interface FadingRepairGameProps {
  imageUrl: string;
  onComplete: (isPerfect: boolean) => void;
  onClose: () => void;
}

export const FadingRepairGame = ({
  imageUrl,
  onComplete,
  onClose,
}: FadingRepairGameProps) => {
  const [channels, setChannels] = useState<ColorChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    const newChannels: ColorChannel[] = [
      {
        id: 'red',
        name: 'Red',
        label: '红色通道',
        color: '#ef4444',
        current: 50 + Math.random() * 30 - 15,
        target: 100,
        min: 0,
        max: 200,
      },
      {
        id: 'green',
        name: 'Green',
        label: '绿色通道',
        color: '#22c55e',
        current: 50 + Math.random() * 30 - 15,
        target: 100,
        min: 0,
        max: 200,
      },
      {
        id: 'blue',
        name: 'Blue',
        label: '蓝色通道',
        color: '#3b82f6',
        current: 50 + Math.random() * 30 - 15,
        target: 100,
        min: 0,
        max: 200,
      },
    ];
    setChannels(newChannels);
  }, []);

  const getColorFilter = useCallback(() => {
    const r = channels.find(c => c.id === 'red')?.current || 100;
    const g = channels.find(c => c.id === 'green')?.current || 100;
    const b = channels.find(c => c.id === 'blue')?.current || 100;
    
    return `sepia(0.3) hue-rotate(${(r - 100) * 0.1}deg) saturate(${Math.max(0.5, (r + g + b) / 300)}) brightness(${Math.max(0.5, (r + g + b) / 300 + 0.3)})`;
  }, [channels]);

  const getAccuracy = useCallback(() => {
    if (channels.length === 0) return 0;
    const totalDiff = channels.reduce((sum, ch) => {
      return sum + Math.abs(ch.current - ch.target);
    }, 0);
    const maxDiff = channels.length * 100;
    return Math.max(0, 100 - (totalDiff / maxDiff) * 100);
  }, [channels]);

  const isAllCorrect = useCallback(() => {
    return channels.every(ch => Math.abs(ch.current - ch.target) <= 5);
  }, [channels]);

  const handleChannelChange = (channelId: string, value: number) => {
    if (isComplete) return;
    
    setChannels(prev =>
      prev.map(ch =>
        ch.id === channelId ? { ...ch, current: Math.round(value) } : ch
      )
    );
    setAdjustments(prev => prev + 1);
  };

  const handleReset = () => {
    setChannels(prev =>
      prev.map(ch => ({
        ...ch,
        current: 50 + Math.random() * 30 - 15,
      }))
    );
    setAdjustments(prev => prev + 10);
  };

  useEffect(() => {
    if (isAllCorrect() && !isComplete) {
      setIsComplete(true);
      setShowSuccess(true);
      setTimeout(() => {
        onComplete(adjustments <= 20);
      }, 1500);
    }
  }, [channels, isAllCorrect, isComplete, adjustments, onComplete]);

  const accuracy = getAccuracy();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card p-6 max-w-4xl w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <span>🎨</span> 修复色彩褪色
              </h2>
              <p className="text-museum-textMuted text-sm mt-1">
                调整RGB色彩通道，使画面恢复到原本的鲜艳色彩
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-museum-textMuted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-museum-textMuted">修复效果预览</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-museum-textMuted">准确度:</span>
                  <span className={cn(
                    'font-bold text-lg',
                    accuracy >= 95 ? 'text-green-400' :
                    accuracy >= 80 ? 'text-yellow-400' :
                    accuracy >= 60 ? 'text-orange-400' :
                    'text-red-400'
                  )}>
                    {Math.round(accuracy)}%
                  </span>
                </div>
              </div>
              
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={imageUrl}
                  alt="待修复画面"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: getColorFilter() }}
                />
                <div className="absolute top-2 left-2 text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
                  当前效果
                </div>
                
                {showSuccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-bounce-once">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="font-display text-3xl font-bold text-white mb-2">
                        色彩修复完成！
                      </h3>
                      {adjustments <= 20 && (
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

              <div className="mt-3 aspect-video rounded-xl overflow-hidden opacity-50 relative">
                <img
                  src={imageUrl}
                  alt="原始参考"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-white/80 bg-black/50 px-3 py-1.5 rounded">
                    原始色彩参考（点击显示）
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-4">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎛️</span> 色彩通道调节
                </h3>
                
                <div className="space-y-6">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className={cn(
                        'p-4 rounded-xl transition-all duration-300',
                        selectedChannel === channel.id
                          ? 'bg-white/10 ring-2'
                          : 'bg-white/5 hover:bg-white/10',
                        Math.abs(channel.current - channel.target) <= 5 && 'ring-2 ring-green-500/50',
                        selectedChannel === channel.id && Math.abs(channel.current - channel.target) > 5 && 'ring-current'
                      )}
                      style={{
                        color: Math.abs(channel.current - channel.target) <= 5 ? '#22c55e' : channel.color,
                      }}
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: channel.color }}
                          />
                          <span className="font-medium text-white">{channel.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'text-sm font-mono',
                              Math.abs(channel.current - channel.target) <= 5
                                ? 'text-green-400'
                                : 'text-white'
                            )}
                          >
                            {channel.current}%
                          </span>
                          <span className="text-xs text-museum-textMuted">
                            目标: {channel.target}%
                          </span>
                        </div>
                      </div>
                      
                      <input
                        type="range"
                        min={channel.min}
                        max={channel.max}
                        value={channel.current}
                        onChange={(e) => handleChannelChange(channel.id, Number(e.target.value))}
                        className="w-full h-2 bg-museum-bgLight rounded-lg appearance-none cursor-pointer"
                        style={{
                          accentColor: channel.color,
                        }}
                      />
                      
                      <div className="flex items-center justify-between text-xs text-museum-textMuted mt-2">
                        <span>冷</span>
                        <span className={Math.abs(channel.current - channel.target) <= 5 ? 'text-green-400' : ''}>
                          {Math.abs(channel.current - channel.target) <= 5 ? '✓ 已校准' : '调整至中间'}
                        </span>
                        <span>暖</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-museum-textMuted">
                  调节次数: {adjustments}
                  {adjustments > 20 && (
                    <span className="text-orange-400 ml-2">
                      (太多次会影响完美评价)
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 glass-button text-sm flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重置
                  </button>
                  <button
                    onClick={() => setHintVisible(!hintVisible)}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/30 transition-colors"
                  >
                    💡 提示
                  </button>
                </div>
              </div>

              {hintVisible && (
                <div className="glass-card p-4 text-sm text-museum-textMuted animate-fade-in">
                  <p>1. 观察原始参考图片的色调</p>
                  <p>2. 红色通道影响暖色调，蓝色通道影响冷色调</p>
                  <p>3. 绿色通道影响整体亮度和自然感</p>
                  <p>4. 尽量减少调节次数以获得完美评价</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
