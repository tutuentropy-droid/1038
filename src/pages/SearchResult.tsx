import { useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, Filter, Tv } from 'lucide-react';
import { ERA_INFO, EraType } from '@/types';
import { useSearch } from '@/hooks/useSearch';
import { AnimeCard } from '@/components/AnimeCard';
import { SearchBar } from '@/components/SearchBar';

export const SearchResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const eraFilter = (searchParams.get('era') as EraType | 'all') || 'all';
  
  const { 
    query, 
    setQuery, 
    results, 
    isSearching,
    setFilterByEra
  } = useSearch();

  useEffect(() => {
    if (q && query !== q) {
      setQuery(q);
    }
  }, [q, query, setQuery]);

  useEffect(() => {
    if (eraFilter) {
      setFilterByEra(eraFilter);
    }
  }, [eraFilter, setFilterByEra]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [q]);

  const filteredResults = useMemo(() => {
    if (eraFilter === 'all') return results;
    return results.filter(anime => anime.era === eraFilter);
  }, [results, eraFilter]);

  const eraOptions = [
    { id: 'all' as const, label: '全部年代', color: 'white' },
    ...Object.values(ERA_INFO).map(era => ({
      id: era.id,
      label: era.name,
      color: era.color
    }))
  ];

  const handleEraFilter = (era: EraType | 'all') => {
    const params = new URLSearchParams(searchParams);
    if (era === 'all') {
      params.delete('era');
    } else {
      params.set('era', era);
    }
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-museum-textMuted hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回大厅
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-80s-primary to-00s-primary flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                搜索结果
              </h1>
              {q && (
                <p className="text-museum-textMuted">
                  关键词: <span className="text-white font-medium">"{q}"</span>
                  {!isSearching && ` · 找到 ${filteredResults.length} 个结果`}
                </p>
              )}
            </div>
          </div>

          <SearchBar variant="page" autoFocus />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-museum-textMuted">
            <Filter className="w-4 h-4" />
            <span className="text-sm">年代筛选:</span>
          </div>
          {eraOptions.map((option) => {
            const isActive = eraFilter === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleEraFilter(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive 
                    ? 'text-white' 
                    : 'text-museum-textMuted hover:text-white hover:bg-white/5'
                  }`}
                style={{
                  backgroundColor: isActive ? `${option.color}20` : 'transparent',
                  border: isActive ? `1px solid ${option.color}40` : '1px solid transparent',
                  color: isActive ? option.color : undefined
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-3 border-80s-primary/30 border-t-80s-primary rounded-full animate-spin mb-4" />
            <p className="text-museum-textMuted">正在搜索...</p>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredResults.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} />
            ))}
          </div>
        ) : q ? (
          <div className="text-center py-20">
            <Tv className="w-16 h-16 text-museum-textMuted/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              没有找到相关动画
            </h3>
            <p className="text-museum-textMuted mb-6">
              试试其他关键词，或者浏览我们的展区
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.values(ERA_INFO).map((era) => (
                <Link
                  key={era.id}
                  to={`/era/${era.id}`}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `${era.color}20`,
                    color: era.color,
                    border: `1px solid ${era.color}30`
                  }}
                >
                  {era.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-museum-textMuted/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              输入关键词开始搜索
            </h3>
            <p className="text-museum-textMuted">
              可以搜索动画名称、角色、类型等
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
