import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portalWorlds, getWorldThemeInfo } from '@/data/portalWorlds';
import { usePortalStore } from '@/store/usePortalStore';
import { Sparkles, MapPin, Star, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PortalHall = () => {
  const navigate = useNavigate();
  const { stats, getWorldProgress, isFragmentCollected } = usePortalStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen page-transition-enter">
      <section className="pt-24 pb-16 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-museum-textMuted text-sm">传送门系统</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              动画世界传送门
            </h1>
            <p className="text-museum-textMuted max-w-2xl mx-auto text-lg">
              穿越时空的传送门，进入每个经典动画作品的主题场景。
              探索森林、海底、太空、校园，收集散落的角色记忆碎片，发现隐藏的故事。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {portalWorlds.map((world, index) => {
              const themeInfo = getWorldThemeInfo(world.theme);
              const progress = getWorldProgress(world.id);
              const isUnlocked = stats.unlockedWorlds.includes(world.id);

              return (
                <div
                  key={world.id}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500',
                    isUnlocked ? 'hover:scale-105' : 'opacity-60 cursor-not-allowed'
                  )}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                  onClick={() => {
                    if (isUnlocked) {
                      navigate(`/portal/${world.id}`);
                    }
                  }}
                >
                  <div
                    className="aspect-[3/4] relative overflow-hidden"
                    style={{
                      background: world.bgGradient,
                    }}
                  >
                    <div className="absolute inset-0 opacity-30">
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl"
                        style={{ backgroundColor: world.accentColor }}
                      />
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <div
                        className="text-7xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
                      >
                        {world.icon}
                      </div>

                      <h3 className="font-display text-2xl font-bold text-white mb-2">
                        {world.name}
                      </h3>

                      <div
                        className="text-sm px-3 py-1 rounded-full mb-4"
                        style={{
                          backgroundColor: `${world.accentColor}20`,
                          color: world.accentColor,
                        }}
                      >
                        {themeInfo.name}主题
                      </div>

                      <p className="text-museum-textMuted text-sm text-center leading-relaxed">
                        {world.description}
                      </p>

                      {!isUnlocked && (
                        <div className="mt-4 px-4 py-2 bg-black/50 rounded-lg">
                          <span className="text-museum-textMuted text-sm">🔒 即将开放</span>
                        </div>
                      )}
                    </div>

                    {isUnlocked && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-4 h-4" />
                              <span>{progress.fragments}/{progress.totalFragments} 碎片</span>
                            </div>
                            <div className="flex items-center gap-1 text-cyan-400">
                              <BookOpen className="w-4 h-4" />
                              <span>{progress.stories}/{progress.totalStories} 故事</span>
                            </div>
                          </div>

                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${progress.totalFragments > 0 ? (progress.fragments / progress.totalFragments) * 100 : 0}%`,
                                backgroundColor: world.accentColor,
                                boxShadow: `0 0 10px ${world.accentColor}`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {isUnlocked && (
                      <div
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: world.accentColor }}
                        >
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 30px ${world.accentColor}40`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="glass-card p-6 max-w-3xl mx-auto">
            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              探索指南
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-3xl mb-2">🎮</div>
                <h4 className="text-white font-semibold mb-1">自由探索</h4>
                <p className="text-museum-textMuted text-sm">
                  使用 WASD 或方向键在场景中自由移动，发现隐藏的惊喜。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-3xl mb-2">✨</div>
                <h4 className="text-white font-semibold mb-1">收集碎片</h4>
                <p className="text-museum-textMuted text-sm">
                  找到散落的角色记忆碎片，解锁角色的专属故事。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="text-3xl mb-2">📖</div>
                <h4 className="text-white font-semibold mb-1">隐藏故事</h4>
                <p className="text-museum-textMuted text-sm">
                  收集足够的碎片后，解锁每个世界的隐藏故事篇章。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 glass-card rounded-full">
              <div className="text-museum-textMuted">
                总积分
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {stats.totalPoints}
              </div>
              <div className="text-museum-textMuted">
                已收集碎片
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {stats.collectedFragments.length}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
