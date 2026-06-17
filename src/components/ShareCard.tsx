import { useState, useRef } from 'react';
import { Share, Download, Copy, Check, Share2 } from 'lucide-react';
import { ShareCardData, Achievement } from '@/types';
import { useTreasureHuntStore } from '@/store/useTreasureHuntStore';
import { ERA_INFO } from '@/types';
import { cn } from '@/lib/utils';

interface ShareCardProps {
  playerName?: string;
  onClose?: () => void;
}

export const ShareCard = ({ playerName = '动画爱好者', onClose }: ShareCardProps) => {
  const { stats, getUnlockedAchievements } = useTreasureHuntStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const topAchievements = getUnlockedAchievements().slice(0, 4);
  const favoriteEra = getFavoriteEra();

  function getFavoriteEra(): string | undefined {
    const counts: Record<string, number> = { '80s': 0, '90s': 0, '00s': 0 };
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const scale = 2;
      
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.scale(scale, scale);

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, '#1a0a2e');
      gradient.addColorStop(0.5, '#2d1b4e');
      gradient.addColorStop(1, '#1a0a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      const borderGradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      borderGradient.addColorStop(0, '#ff00ff');
      borderGradient.addColorStop(0.5, '#ff6b35');
      borderGradient.addColorStop(1, '#9d4edd');
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 3;
      ctx.strokeRect(15, 15, rect.width - 30, rect.height - 30);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.fillText('动画片博物馆', rect.width / 2, 60);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px "Noto Sans SC", sans-serif';
      ctx.fillText('ANIME MUSEUM - 寻宝成就', rect.width / 2, 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Noto Sans SC", sans-serif';
      ctx.fillText(playerName, rect.width / 2, 130);

      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 48px "Orbitron", sans-serif';
      ctx.fillText(`${stats.totalPoints}`, rect.width / 2, 190);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px "Noto Sans SC", sans-serif';
      ctx.fillText('总积分', rect.width / 2, 215);

      const statY = 260;
      const statWidth = rect.width / 3;
      const statsData = [
        { value: stats.hiddenCharactersFound.length, label: '隐藏角色' },
        { value: stats.easterEggsFound.length, label: '发现彩蛋' },
        { value: stats.unlockedAchievements.length, label: '成就解锁' },
      ];

      statsData.forEach((stat, i) => {
        const x = statWidth / 2 + i * statWidth;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Noto Sans SC", sans-serif';
        ctx.fillText(String(stat.value), x, statY);
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px "Noto Sans SC", sans-serif';
        ctx.fillText(stat.label, x, statY + 20);
      });

      if (topAchievements.length > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Noto Sans SC", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🏆 荣誉成就', 40, 330);

        topAchievements.forEach((achievement, i) => {
          const y = 360 + i * 35;
          ctx.fillStyle = '#ffffff';
          ctx.font = '16px "Noto Sans SC", sans-serif';
          ctx.fillText(`${achievement.icon} ${achievement.name}`, 40, y);
        });
      }

      ctx.fillStyle = '#6b7280';
      ctx.font = '11px "Noto Sans SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`生成时间: ${new Date().toLocaleDateString('zh-CN')}`, rect.width / 2, rect.height - 30);

      const link = document.createElement('a');
      link.download = `anime-museum-achievement-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${playerName}的动画片博物馆成就`,
      text: `我在动画片博物馆获得了${stats.totalPoints}积分，解锁了${stats.unlockedAchievements.length}个成就！快来一起寻宝吧！`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-card p-6 max-w-md w-full">
        <h2 className="font-display text-2xl font-bold text-white mb-6 text-center">
          分享我的成就
        </h2>

        <div
          ref={cardRef}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-80s-primary/10 via-90s-primary/10 to-00s-primary/10 border-2 border-transparent mb-6"
          style={{
            borderImage: 'linear-gradient(135deg, #ff00ff, #ff6b35, #9d4edd) 1',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="mb-4">
              <h3 className="font-display text-xl font-bold text-white">动画片博物馆</h3>
              <p className="text-xs text-museum-textMuted tracking-widest">ANIME MUSEUM · 寻宝成就</p>
            </div>

            <div className="mb-6">
              <p className="text-lg text-white font-bold mb-2">{playerName}</p>
              <div className="text-5xl font-retro font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-1">
                {stats.totalPoints}
              </div>
              <p className="text-sm text-museum-textMuted">总积分</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.hiddenCharactersFound.length}</div>
                <div className="text-xs text-museum-textMuted">隐藏角色</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.easterEggsFound.length}</div>
                <div className="text-xs text-museum-textMuted">发现彩蛋</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.unlockedAchievements.length}</div>
                <div className="text-xs text-museum-textMuted">成就解锁</div>
              </div>
            </div>

            {topAchievements.length > 0 && (
              <div className="text-left">
                <p className="text-sm font-medium text-white mb-3">🏆 荣誉成就</p>
                <div className="space-y-2">
                  {topAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-2 text-sm text-museum-textMuted"
                    >
                      <span className="text-lg">{achievement.icon}</span>
                      <span>{achievement.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-museum-textMuted">
                生成时间: {new Date().toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex flex-col items-center gap-2 p-4 glass-button hover:border-80s-primary/50 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5 text-80s-primary" />
            <span className="text-xs text-white">保存图片</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-2 p-4 glass-button hover:border-90s-primary/50 transition-colors"
          >
            <Share2 className="w-5 h-5 text-90s-primary" />
            <span className="text-xs text-white">分享</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 p-4 glass-button hover:border-00s-primary/50 transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-00s-primary" />
            )}
            <span className="text-xs text-white">{copied ? '已复制' : '复制链接'}</span>
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 text-museum-textMuted hover:text-white transition-colors"
          >
            关闭
          </button>
        )}
      </div>
    </div>
  );
};
