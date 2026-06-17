import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Tv, Trash2 } from 'lucide-react';
import { animes } from '@/data/animes';
import { AnimeCard } from '@/components/AnimeCard';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export const Favorites = () => {
  const { favorites, clearFavorites } = useFavoritesStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const favoriteAnimes = useMemo(() => {
    return animes.filter(anime => favorites.includes(anime.id));
  }, [favorites]);

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter">
      <div className="container">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-museum-textMuted hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回大厅
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                我的收藏
              </h1>
              <p className="text-museum-textMuted">
                {favorites.length > 0 
                  ? `已收藏 ${favorites.length} 部动画` 
                  : '还没有收藏任何动画'}
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={() => {
                if (confirm('确定要清空所有收藏吗？')) {
                  clearFavorites();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 
                border border-white/10 hover:border-red-500/30
                text-museum-textMuted hover:text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">清空收藏</span>
            </button>
          )}
        </div>

        {favoriteAnimes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {favoriteAnimes.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <Heart className="w-20 h-20 text-museum-textMuted/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Tv className="w-8 h-8 text-museum-textMuted/40" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              收藏夹是空的
            </h3>
            <p className="text-museum-textMuted mb-8 max-w-md mx-auto">
              浏览博物馆，找到你喜欢的动画，点击心形图标即可收藏，随时回来重温经典
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-80s-primary to-00s-primary
                  text-white font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-80s-primary/30"
              >
                开始探索
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
