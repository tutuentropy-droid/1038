import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ArrowLeft,
  Trash2,
  Users,
  Sparkles,
  Trophy,
  Vote,
  BookOpen,
} from 'lucide-react';
import { CharacterCard } from '@/components/CharacterCard';
import { getCharacterById } from '@/data/characters';
import { useCharacterCollectionStore } from '@/store/useCharacterCollectionStore';
import { useVotingStore } from '@/store/useVotingStore';
import { Character } from '@/types';

export const CharacterCollection = () => {
  const navigate = useNavigate();
  const { collection, clearCollection, getCollectionCount } =
    useCharacterCollectionStore();
  const { getAllVotes } = useVotingStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allVotes = useMemo(() => getAllVotes(), [getAllVotes]);

  const collectedCharacters = useMemo(() => {
    return collection
      .map((id) => getCharacterById(id))
      .filter((c): c is Character => c !== undefined)
      .map((c) => ({
        ...c,
        votes: allVotes[c.id] || 0,
      }))
      .sort((a, b) => b.votes - a.votes);
  }, [collection, allVotes]);

  const totalVotesInCollection = useMemo(() => {
    return collectedCharacters.reduce(
      (sum, c) => sum + (allVotes[c.id] || 0),
      0
    );
  }, [collectedCharacters, allVotes]);

  const uniqueAnimes = useMemo(() => {
    const animeIds = new Set(
      collectedCharacters.map((c) => c.animeId).filter(Boolean)
    );
    return animeIds.size;
  }, [collectedCharacters]);

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top right, rgba(157, 78, 221, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(255, 0, 255, 0.08) 0%, transparent 50%)',
        }}
      />

      <div className="container relative">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-museum-textMuted hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-00s-primary" />
            <span className="text-sm text-museum-textMuted">我的收藏</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-red-500 via-80s-primary to-00s-primary bg-clip-text text-transparent">
              角色收藏册
            </span>
          </h1>

          <p className="text-lg text-museum-textMuted max-w-xl mx-auto">
            珍藏你最喜欢的经典动画角色，打造专属于你的角色图鉴
          </p>
        </div>

        {collectedCharacters.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="glass-card p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="font-retro text-3xl font-black text-white mb-1">
                  {getCollectionCount()}
                </div>
                <p className="text-sm text-museum-textMuted">收藏角色</p>
              </div>

              <div className="glass-card p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-80s-primary to-90s-primary flex items-center justify-center">
                  <Vote className="w-6 h-6 text-white" />
                </div>
                <div className="font-retro text-3xl font-black text-white mb-1">
                  {totalVotesInCollection}
                </div>
                <p className="text-sm text-museum-textMuted">累计人气</p>
              </div>

              <div className="glass-card p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-00s-primary to-purple-400 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="font-retro text-3xl font-black text-white mb-1">
                  {uniqueAnimes}
                </div>
                <p className="text-sm text-museum-textMuted">涵盖作品</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    我的珍藏角色
                  </h2>
                  <p className="text-museum-textMuted text-sm">
                    共 {collectedCharacters.length} 位角色
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('确定要清空收藏册吗？此操作不可撤销。')) {
                    clearCollection();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-museum-textMuted hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">清空收藏册</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {collectedCharacters.map((char, index) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-16 glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display text-lg font-bold text-white">
                  收藏小贴士
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-museum-textMuted">
                <li>• 在角色卡片右上角点击心形图标可以收藏/取消收藏角色</li>
                <li>• 收藏的角色会按照人气投票数自动排序</li>
                <li>• 点击角色卡片可以查看详细档案并投票支持</li>
                <li>• 参与角色PK对战，为你喜欢的角色增加人气</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <Heart className="w-24 h-24 text-museum-textMuted/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-10 h-10 text-museum-textMuted/40" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              收藏册还是空的
            </h3>
            <p className="text-museum-textMuted mb-10 max-w-md mx-auto">
              浏览角色博物馆，找到你喜欢的经典角色，点击心形图标加入收藏册
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/characters"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary text-white font-bold transition-all hover:shadow-lg hover:shadow-80s-primary/30 hover:scale-105 active:scale-95"
              >
                <Users className="w-5 h-5" />
                浏览角色
              </Link>
              <Link
                to="/characters/battle"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                参与角色PK
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
