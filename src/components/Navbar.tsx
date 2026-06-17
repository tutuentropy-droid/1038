import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart, Search, Menu, X, Clock, Users, Hammer, Search as SearchIcon, Trophy } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useCharacterCollectionStore } from '@/store/useCharacterCollectionStore';
import { useTreasureHuntStore } from '@/store/useTreasureHuntStore';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { favorites } = useFavoritesStore();
  const { getCollectionCount } = useCharacterCollectionStore();
  const { stats, init } = useTreasureHuntStore();
  const collectionCount = getCollectionCount();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: '大厅', icon: Film },
    { path: '/time-corridor', label: '时间长廊', icon: Clock },
    { path: '/characters', label: '角色博物馆', icon: Users },
    { path: '/workshop', label: '制作工坊', icon: Hammer },
    { path: '/treasure-hunt', label: '寻宝模式', icon: SearchIcon },
    { path: '/achievements', label: '成就中心', icon: Trophy },
    { path: '/era/80s', label: '80年代', color: 'text-80s-primary' },
    { path: '/era/90s', label: '90年代', color: 'text-90s-primary' },
    { path: '/era/00s', label: '2000年代', color: 'text-00s-primary' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-museum-bg/80 backdrop-blur-xl border-b border-museum-border py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Film className="w-8 h-8 text-80s-primary transition-all duration-300 group-hover:scale-110 group-hover:text-90s-primary" />
            <div className="absolute -inset-1 bg-80s-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wide">
              <span className="text-80s-primary">动画</span>
              <span className="text-90s-primary">片</span>
              <span className="text-00s-primary">博物馆</span>
            </h1>
            <p className="text-[10px] text-museum-textMuted tracking-widest">ANIME MUSEUM</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
                  isActive ? 'bg-white/5' : 'hover:bg-white/5'
                }`}
              >
                <span className={`font-medium transition-colors duration-300 flex items-center gap-2 ${
                  isActive ? link.color || 'text-white' : 'text-museum-textMuted group-hover:text-white'
                }`}>
                  {LinkIcon && <LinkIcon className="w-4 h-4" />}
                  {link.label}
                </span>
                {isActive && (
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    link.color?.includes('80s') ? 'bg-80s-primary' :
                    link.color?.includes('90s') ? 'bg-90s-primary' :
                    link.color?.includes('00s') ? 'bg-00s-primary' :
                    'bg-white'
                  } animate-pulse`} />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/treasure-hunt"
            className="glass-button px-3 py-2 text-museum-textMuted hover:text-yellow-400 hidden sm:flex items-center gap-2"
            aria-label="积分"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">{stats.totalPoints}</span>
          </Link>
          <Link
            to="/search"
            className="glass-button p-2.5 text-museum-textMuted hover:text-white"
            aria-label="搜索"
          >
            <Search className="w-5 h-5" />
          </Link>
          <Link
            to="/characters/collection"
            className="glass-button p-2.5 text-museum-textMuted hover:text-00s-primary relative group"
            aria-label="角色收藏"
          >
            <Users className={`w-5 h-5 transition-colors ${collectionCount > 0 ? 'text-00s-primary' : ''}`} />
            {collectionCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-00s-primary text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce-once">
                {collectionCount}
              </span>
            )}
          </Link>
          <Link
            to="/favorites"
            className="glass-button p-2.5 text-museum-textMuted hover:text-red-400 relative group"
            aria-label="收藏"
          >
            <Heart className={`w-5 h-5 transition-colors ${favorites.length > 0 ? 'text-red-400 fill-red-400' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce-once">
                {favorites.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden glass-button p-2.5"
            aria-label="菜单"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-museum-bg/95 backdrop-blur-xl border-b border-museum-border animate-slide-down">
          <div className="container py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {LinkIcon && <LinkIcon className={`w-5 h-5 ${isActive ? link.color || 'text-white' : 'text-museum-textMuted'}`} />}
                  <span className={`font-medium ${
                    isActive ? link.color || 'text-white' : 'text-museum-textMuted'
                  }`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
