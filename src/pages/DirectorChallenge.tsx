import { useState, useEffect, useMemo } from 'react';
import {
  Clapperboard,
  Users,
  Image,
  Music,
  Trophy,
  Sparkles,
  Shuffle,
  CheckCircle2,
  X,
  ChevronRight,
  Star,
  Zap,
  Target,
  Award,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  scenes,
  musicTracks,
  challengeTemplates,
  getRandomChallenge,
  calculateScore,
  genreLabels,
  difficultyLabels,
  difficultyColors,
  Scene,
  MusicTrack,
  ChallengeTemplate,
} from '@/data/directorChallenge';
import { getAllCharacters } from '@/data/characters';
import { useDirectorChallengeStore } from '@/store/useDirectorChallengeStore';
import { Character } from '@/types';

type TabType = 'challenge' | 'characters' | 'scenes' | 'music';

export const DirectorChallenge = () => {
  const {
    currentChallenge,
    selectedCharacters,
    selectedScene,
    selectedMusic,
    completedChallenges,
    totalPoints,
    challengesCompleted,
    hasVisited,
    setCurrentChallenge,
    toggleCharacter,
    setSelectedScene,
    setSelectedMusic,
    completeChallenge,
    resetSelection,
    visit,
    getHighScore,
  } = useDirectorChallengeStore();

  const [activeTab, setActiveTab] = useState<TabType>('challenge');
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{
    score: number;
    maxScore: number;
    feedback: string[];
    breakdown: { category: string; score: number; maxScore: number }[];
  } | null>(null);
  const [newChallengeAnimation, setNewChallengeAnimation] = useState(false);

  const allCharacters = useMemo(() => getAllCharacters(), []);

  const selectedCharObjects = useMemo(() => {
    return allCharacters.filter((c) => selectedCharacters.includes(c.id));
  }, [allCharacters, selectedCharacters]);

  const selectedSceneObj = useMemo(() => {
    return scenes.find((s) => s.id === selectedScene) || null;
  }, [selectedScene]);

  const selectedMusicObj = useMemo(() => {
    return musicTracks.find((m) => m.id === selectedMusic) || null;
  }, [selectedMusic]);

  useEffect(() => {
    if (!hasVisited) {
      visit();
    }
    if (!currentChallenge) {
      const randomChallenge = getRandomChallenge();
      setCurrentChallenge(randomChallenge);
    }
  }, [hasVisited, currentChallenge, visit, setCurrentChallenge]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNewChallenge = () => {
    setNewChallengeAnimation(true);
    setShowResult(false);
    setResultData(null);
    resetSelection();
    setTimeout(() => {
      const newChallenge = getRandomChallenge();
      setCurrentChallenge(newChallenge);
      setNewChallengeAnimation(false);
    }, 300);
  };

  const handleSubmit = () => {
    if (!currentChallenge) return;
    if (selectedCharacters.length === 0 || !selectedScene || !selectedMusic) return;

    const result = calculateScore(
      currentChallenge,
      selectedCharObjects,
      selectedSceneObj,
      selectedMusicObj
    );

    setResultData(result);
    setShowResult(true);

    if (selectedSceneObj && selectedMusicObj) {
      completeChallenge(
        currentChallenge,
        result.score,
        result.maxScore,
        selectedCharObjects,
        selectedSceneObj,
        selectedMusicObj
      );
    }
  };

  const canSubmit =
    currentChallenge &&
    selectedCharacters.length > 0 &&
    selectedScene &&
    selectedMusic;

  const tabs = [
    { id: 'challenge', label: '挑战任务', icon: Target, color: 'from-80s-primary to-90s-primary' },
    { id: 'characters', label: '角色库', icon: Users, color: 'from-90s-primary to-00s-primary' },
    { id: 'scenes', label: '场景库', icon: Image, color: 'from-00s-primary to-80s-primary' },
    { id: 'music', label: '音乐库', icon: Music, color: 'from-yellow-500 to-amber-600' },
  ] as const;

  const getScoreColor = (score: number, maxScore: number) => {
    const percent = (score / maxScore) * 100;
    if (percent >= 80) return 'text-green-400';
    if (percent >= 60) return 'text-yellow-400';
    if (percent >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgGradient = (score: number, maxScore: number) => {
    const percent = (score / maxScore) * 100;
    if (percent >= 80) return 'from-green-500 to-emerald-600';
    if (percent >= 60) return 'from-yellow-500 to-amber-600';
    if (percent >= 40) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="min-h-screen pt-24 pb-16 page-transition-enter relative">
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-80s-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-00s-primary/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="container">
        <section className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Clapperboard className="w-4 h-4 text-80s-primary" />
              <span className="text-sm text-museum-textMuted">动画导演挑战馆</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary bg-clip-text text-transparent">
                动画导演挑战馆
              </span>
            </h1>

            <p className="text-lg text-museum-textMuted max-w-2xl mx-auto mb-8">
              接受随机动画制作挑战，从角色库、场景库和音乐库中精心挑选素材，
              组合出属于你的动画企划！考验你的创意与审美，成为真正的动画导演！
            </p>

            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="glass-card px-6 py-4 text-center">
                <div className="text-2xl mb-1">🎬</div>
                <div className="font-retro text-2xl font-black text-80s-primary">
                  {challengeTemplates.length}
                </div>
                <p className="text-xs text-museum-textMuted mt-1">挑战类型</p>
              </div>
              <div className="glass-card px-6 py-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-retro text-2xl font-black text-90s-primary">
                  {challengesCompleted}
                </div>
                <p className="text-xs text-museum-textMuted mt-1">完成挑战</p>
              </div>
              <div className="glass-card px-6 py-4 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="font-retro text-2xl font-black text-00s-primary">
                  {totalPoints}
                </div>
                <p className="text-xs text-museum-textMuted mt-1">累计积分</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="glass-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-80s-primary" />
                当前挑战
              </h2>
              <button
                onClick={handleNewChallenge}
                className="glass-button px-4 py-2 text-sm text-museum-textMuted hover:text-white flex items-center gap-2 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                换一个挑战
              </button>
            </div>

            {currentChallenge && (
              <div
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                  newChallengeAnimation
                    ? 'opacity-0 scale-95'
                    : 'opacity-100 scale-100'
                }`}
                style={{
                  background: 'linear-gradient(135deg, rgba(157,78,221,0.1) 0%, rgba(255,0,255,0.05) 100%)',
                  borderColor: 'rgba(157,78,221,0.3)',
                }}
              >
                <div className="absolute top-4 right-4 text-5xl opacity-30">
                  {currentChallenge.icon}
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      difficultyColors[currentChallenge.difficulty]
                    } bg-white/5 border border-white/10`}
                  >
                    {difficultyLabels[currentChallenge.difficulty]}难度
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
                    {genreLabels[currentChallenge.genre]}题材
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20">
                    +{currentChallenge.basePoints} 基础分
                  </span>
                  {getHighScore(currentChallenge.id) > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      最高分: {getHighScore(currentChallenge.id)}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  {currentChallenge.title}
                </h3>
                <p className="text-museum-textMuted mb-4">{currentChallenge.description}</p>

                <div className="bg-black/30 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <BookIcon className="w-4 h-4 text-80s-primary" />
                    制作简报
                  </h4>
                  <p className="text-sm text-museum-textMuted">{currentChallenge.brief}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-museum-textMuted mb-1">需要角色</div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-80s-primary" />
                      {currentChallenge.requiredCharacterCount} 位角色
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-museum-textMuted mb-1">推荐场景</div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      <Image className="w-5 h-5 text-90s-primary" />
                      {currentChallenge.preferredSceneTypes.length} 种
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-museum-textMuted mb-1">推荐音乐</div>
                    <div className="text-lg font-bold text-white flex items-center gap-2">
                      <Music className="w-5 h-5 text-00s-primary" />
                      {currentChallenge.preferredMusicStyles.length} 种
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 
                    flex items-center gap-2 group overflow-hidden
                    ${isActive
                      ? 'text-white shadow-lg'
                      : 'bg-white/5 text-museum-textMuted hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                >
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-90`}
                    />
                  )}
                  <TabIcon className={`w-5 h-5 relative z-10 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'challenge' && currentChallenge && (
            <div className="glass-card p-6">
              <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                你的企划
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-80s-primary" />
                      已选角色
                    </h4>
                    <span className="text-xs text-museum-textMuted">
                      {selectedCharacters.length}/{currentChallenge.requiredCharacterCount}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[80px]">
                    {selectedCharObjects.map((char) => (
                      <div
                        key={char.id}
                        className="flex items-center gap-2 px-2 py-1 rounded-lg bg-80s-primary/20 border border-80s-primary/30"
                      >
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-xs text-white font-medium truncate max-w-20">
                          {char.name}
                        </span>
                      </div>
                    ))}
                    {selectedCharacters.length === 0 && (
                      <p className="text-xs text-museum-textMuted">点击"角色库"选择角色</p>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Image className="w-4 h-4 text-90s-primary" />
                      已选场景
                    </h4>
                  </div>
                  <div className="min-h-[80px]">
                    {selectedSceneObj ? (
                      <div className="relative rounded-lg overflow-hidden aspect-video">
                        <img
                          src={selectedSceneObj.image}
                          alt={selectedSceneObj.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <span className="text-xs text-white font-medium">
                            {selectedSceneObj.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-museum-textMuted">点击"场景库"选择场景</p>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Music className="w-4 h-4 text-00s-primary" />
                      已选音乐
                    </h4>
                  </div>
                  <div className="min-h-[80px]">
                    {selectedMusicObj ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-00s-primary/20 border border-00s-primary/30">
                        <div className="w-12 h-12 rounded-lg bg-00s-primary/30 flex items-center justify-center text-2xl">
                          {selectedMusicObj.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {selectedMusicObj.name}
                          </div>
                          <div className="text-xs text-museum-textMuted">
                            {selectedMusicObj.tempo === 'fast'
                              ? '快节奏'
                              : selectedMusicObj.tempo === 'slow'
                              ? '慢节奏'
                              : '中速'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-museum-textMuted">点击"音乐库"选择音乐</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={resetSelection}
                  className="glass-button px-6 py-3 text-museum-textMuted hover:text-white flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  重置选择
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`relative px-8 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                    canSubmit
                      ? 'text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-white/5 text-museum-textMuted cursor-not-allowed'
                  }`}
                >
                  {canSubmit && (
                    <div className="absolute inset-0 bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary opacity-90" />
                  )}
                  <Play className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">提交企划</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-80s-primary" />
                  角色库
                </h3>
                <span className="text-sm text-museum-textMuted">
                  已选择 {selectedCharacters.length} 位角色
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allCharacters.map((char) => {
                  const isSelected = selectedCharacters.includes(char.id);
                  return (
                    <div
                      key={char.id}
                      onClick={() => toggleCharacter(char.id)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                        isSelected
                          ? 'ring-2 ring-80s-primary ring-offset-2 ring-offset-museum-bg scale-105'
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-80s-primary flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="text-sm font-bold text-white truncate">{char.name}</h4>
                          <p className="text-xs text-museum-textMuted truncate">
                            {char.animeTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'scenes' && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-90s-primary" />
                  场景库
                </h3>
                <span className="text-sm text-museum-textMuted">
                  共 {scenes.length} 个场景
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {scenes.map((scene) => {
                  const isSelected = selectedScene === scene.id;
                  return (
                    <div
                      key={scene.id}
                      onClick={() => setSelectedScene(isSelected ? null : scene.id)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                        isSelected
                          ? 'ring-2 ring-90s-primary ring-offset-2 ring-offset-museum-bg scale-105'
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={scene.image}
                          alt={scene.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-90s-primary flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="text-sm font-bold text-white">{scene.name}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {scene.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white/80"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-00s-primary" />
                  音乐库
                </h3>
                <span className="text-sm text-museum-textMuted">
                  共 {musicTracks.length} 首音乐
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {musicTracks.map((music) => {
                  const isSelected = selectedMusic === music.id;
                  return (
                    <div
                      key={music.id}
                      onClick={() => setSelectedMusic(isSelected ? null : music.id)}
                      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'bg-00s-primary/20 border-2 border-00s-primary scale-105'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                            isSelected ? 'bg-00s-primary/30' : 'bg-white/10'
                          }`}
                        >
                          {music.icon}
                        </div>
                        {isSelected && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-00s-primary flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{music.name}</h4>
                      <p className="text-xs text-museum-textMuted line-clamp-2">
                        {music.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {completedChallenges.length > 0 && (
          <section className="mb-8">
            <div className="glass-card p-6">
              <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                挑战记录
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
                {[...completedChallenges].reverse().slice(0, 10).map((record, index) => (
                  <div
                    key={`${record.challengeId}-${record.completedAt}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-80s-primary/20 flex items-center justify-center font-bold text-80s-primary">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {record.challengeTitle}
                      </h4>
                      <p className="text-xs text-museum-textMuted">
                        {new Date(record.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold ${getScoreColor(
                          record.score,
                          record.maxScore
                        )}`}
                      >
                        {record.score}/{record.maxScore}
                      </div>
                      <div className="text-xs text-yellow-400">+{record.earnedPoints}分</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {showResult && resultData && currentChallenge && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowResult(false)}
        >
          <div
            className="glass-card p-8 max-w-lg w-full text-center animate-scale-in relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-80s-primary/10 to-transparent" />

            <button
              onClick={() => setShowResult(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-museum-textMuted hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10">
              <div className="mb-6">
                <div className="text-yellow-400 font-bold text-sm mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  企划评审结果
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="relative inline-block">
                  <div
                    className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl animate-bounce-once`}
                    style={{
                      background: `linear-gradient(135deg, ${
                        resultData.score / resultData.maxScore >= 0.8
                          ? '#22c55e, #10b981'
                          : resultData.score / resultData.maxScore >= 0.6
                          ? '#eab308, #f59e0b'
                          : resultData.score / resultData.maxScore >= 0.4
                          ? '#f97316, #ef4444'
                          : '#ef4444, #ec4899'
                      })`,
                      boxShadow: `0 0 60px ${
                        resultData.score / resultData.maxScore >= 0.8
                          ? 'rgba(34,197,94,0.4)'
                          : resultData.score / resultData.maxScore >= 0.6
                          ? 'rgba(234,179,8,0.4)'
                          : resultData.score / resultData.maxScore >= 0.4
                          ? 'rgba(249,115,22,0.4)'
                          : 'rgba(239,68,68,0.4)'
                      }`,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-black text-white">
                        {resultData.score}
                      </div>
                      <div className="text-xs text-white/70">
                        /{resultData.maxScore}
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)',
                    }}
                  />
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {currentChallenge.title}
              </h3>
              <p className="text-museum-textMuted mb-6">
                获得 {Math.round(currentChallenge.basePoints * (resultData.score / resultData.maxScore))} 积分
              </p>

              <div className="space-y-3 mb-6">
                {resultData.breakdown.map((item) => (
                  <div key={item.category} className="text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white font-medium">{item.category}</span>
                      <span className="text-sm text-museum-textMuted">
                        {item.score}/{item.maxScore}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-80s-primary to-00s-primary transition-all duration-500"
                        style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
                <h4 className="text-sm font-semibold text-white mb-2">评审反馈</h4>
                <div className="space-y-1">
                  {resultData.feedback.map((fb, idx) => (
                    <p key={idx} className="text-xs text-museum-textMuted">
                      {fb}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResult(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-museum-textMuted hover:bg-white/10 hover:text-white font-medium transition-all"
                >
                  继续调整
                </button>
                <button
                  onClick={() => {
                    setShowResult(false);
                    handleNewChallenge();
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-80s-primary to-00s-primary text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  下一个挑战
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function BookIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
