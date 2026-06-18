import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  FlaskConical,
  Hammer,
  Palette,
  BarChart3,
  ArrowRight,
  Lock,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Layers,
  Wrench,
  Star,
  X,
  Zap,
  Eye,
  Film,
  History,
  BookOpen,
  GitBranch,
  RefreshCw,
  Award,
  Lightbulb,
  Cpu,
  Rocket,
} from 'lucide-react';
import { useEvolutionSandboxStore } from '@/store/useEvolutionSandboxStore';
import {
  STYLE_PHASES,
  TECH_MILESTONES,
  VISUAL_CAPABILITIES,
  PRODUCTION_TOOLS,
  EVOLUTION_EVENTS,
  ERA_ORDER,
  CATEGORY_NAMES,
} from '@/data/evolutionSandbox';
import type { TechEra, TechMilestone, ProductionTool, VisualCapability } from '@/types';
import { cn } from '@/lib/utils';

export const EvolutionSandbox = () => {
  const {
    currentEra,
    unlockedEras,
    researchPoints,
    unlockedMilestones,
    unlockedCapabilities,
    unlockedTools,
    currentView,
    selectedMilestone,
    selectedTool,
    selectedCapability,
    isTransitioning,
    eraTransitionProgress,
    stats,
    actions,
  } = useEvolutionSandboxStore();

  const [showDetail, setShowDetail] = useState(false);
  const [detailType, setDetailType] = useState<'milestone' | 'tool' | 'capability' | 'era'>('era');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [autoEvolve, setAutoEvolve] = useState(false);

  const phase = STYLE_PHASES[currentEra];

  useEffect(() => {
    if (!autoEvolve) return;
    const interval = setInterval(() => {
      actions.addResearchPoints(10);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoEvolve, actions]);

  const openDetail = (type: 'milestone' | 'tool' | 'capability' | 'era', id: string) => {
    setDetailType(type);
    setDetailId(id);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setDetailId(null);
  };

  const canUnlockNextEra = useMemo(() => {
    const currentIndex = ERA_ORDER.indexOf(currentEra);
    if (currentIndex >= ERA_ORDER.length - 1) return false;
    const nextEra = ERA_ORDER[currentIndex + 1];
    if (unlockedEras.includes(nextEra)) return true;

    const currentPhase = STYLE_PHASES[currentEra];
    const requiredMilestones = currentPhase.milestones;
    const unlockedCount = requiredMilestones.filter(
      (m) => unlockedMilestones.includes(m)
    ).length;
    return unlockedCount >= Math.ceil(requiredMilestones.length / 2);
  }, [currentEra, unlockedEras, unlockedMilestones]);

  const currentMilestones = useMemo(() => {
    return phase.milestones.map((id) => TECH_MILESTONES[id]);
  }, [phase]);

  const currentTools = useMemo(() => {
    return Object.values(PRODUCTION_TOOLS).filter((t) => t.era === currentEra);
  }, [currentEra]);

  const currentCapabilities = useMemo(() => {
    return phase.unlockedCapabilities.map((id) => VISUAL_CAPABILITIES[id]);
  }, [phase]);

  const detailContent = useMemo(() => {
    if (!detailId) return null;

    if (detailType === 'milestone') {
      const m = TECH_MILESTONES[detailId];
      if (!m) return null;
      return {
        title: m.name,
        subtitle: `${m.year} 年`,
        icon: m.visual,
        sections: [
          { label: '描述', content: m.description },
          { label: '历史影响', content: m.impact },
          { label: '所属时代', content: STYLE_PHASES[m.requiredEra].name },
          { label: '研究点数', content: `${m.cost} RP` },
        ],
        action: !unlockedMilestones.includes(detailId) && unlockedEras.includes(m.requiredEra)
          ? {
              label: `解锁 (${m.cost} RP)`,
              disabled: researchPoints < m.cost,
              onClick: () => {
                if (actions.unlockMilestone(detailId)) {
                  closeDetail();
                }
              },
            }
          : unlockedMilestones.includes(detailId)
          ? { label: '已解锁 ✓', disabled: true, onClick: () => {} }
          : { label: '需要先解锁对应时代', disabled: true, onClick: () => {} },
      };
    }

    if (detailType === 'tool') {
      const t = PRODUCTION_TOOLS[detailId];
      if (!t) return null;
      return {
        title: t.name,
        subtitle: CATEGORY_NAMES[t.category],
        icon: t.icon,
        sections: [
          { label: '描述', content: t.description },
          { label: '工具类别', content: CATEGORY_NAMES[t.category] },
          { label: '所属时代', content: STYLE_PHASES[t.era].name },
        ],
        action: unlockedTools.includes(detailId)
          ? { label: '已解锁 ✓', disabled: true, onClick: () => {} }
          : { label: '随时代解锁', disabled: true, onClick: () => {} },
      };
    }

    if (detailType === 'capability') {
      const c = VISUAL_CAPABILITIES[detailId];
      if (!c) return null;
      return {
        title: c.name,
        subtitle: '视觉表现能力',
        icon: c.icon,
        sections: [
          { label: '描述', content: c.description },
          { label: '实例', content: c.example || '无' },
        ],
        action: unlockedCapabilities.includes(detailId)
          ? { label: '已解锁 ✓', disabled: true, onClick: () => {} }
          : { label: '随时代解锁', disabled: true, onClick: () => {} },
      };
    }

    if (detailType === 'era') {
      const e = STYLE_PHASES[detailId as TechEra];
      if (!e) return null;
      return {
        title: e.name,
        subtitle: e.period,
        icon: '🏛️',
        sections: [
          { label: '时代标语', content: e.tagline },
          { label: '简介', content: e.description },
          { label: '详细介绍', content: e.longDescription },
          { label: '视觉特点', content: e.visualFeatures.join('、') },
          { label: '代表作品', content: e.keyWorks.join('、') },
        ],
        action: unlockedEras.includes(detailId as TechEra)
          ? currentEra === (detailId as TechEra)
            ? { label: '当前时代', disabled: true, onClick: () => {} }
            : {
                label: '切换到此时代',
                disabled: false,
                onClick: () => {
                  actions.selectEra(detailId as TechEra);
                  closeDetail();
                },
              }
          : { label: '尚未解锁', disabled: true, onClick: () => {} },
      };
    }

    return null;
  }, [detailType, detailId, unlockedMilestones, unlockedTools, unlockedCapabilities, unlockedEras, researchPoints, currentEra, actions]);

  const renderTimelineView = () => (
    <div className="relative">
      <div className="relative h-[500px] rounded-2xl border border-white/10 overflow-hidden" style={{ background: phase.bgGradient }}>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {ERA_ORDER.map((eraId, index) => {
            if (index === 0) return null;
            const prev = STYLE_PHASES[ERA_ORDER[index - 1]];
            const curr = STYLE_PHASES[eraId];
            const isActive = unlockedEras.includes(eraId);
            return (
              <line
                key={eraId}
                x1={`${prev.position.x}%`}
                y1={`${prev.position.y}%`}
                x2={`${curr.position.x}%`}
                y2={`${curr.position.y}%`}
                stroke={isActive ? curr.color : 'rgba(255,255,255,0.1)'}
                strokeWidth="3"
                strokeDasharray={isActive ? '0' : '8 8'}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {ERA_ORDER.map((eraId, index) => {
          const era = STYLE_PHASES[eraId];
          const isUnlocked = unlockedEras.includes(eraId);
          const isCurrent = currentEra === eraId;

          return (
            <button
              key={eraId}
              onClick={() => openDetail('era', eraId)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 hover:scale-110"
              style={{
                left: `${era.position.x}%`,
                top: `${era.position.y}%`,
                zIndex: isCurrent ? 20 : 10,
              }}
            >
              <div
                className={cn(
                  'relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-300',
                  isCurrent && 'ring-4 ring-white/30 animate-pulse-slow'
                )}
                style={{
                  backgroundColor: isUnlocked ? era.color : 'rgba(255,255,255,0.05)',
                  borderColor: isUnlocked ? era.accentColor : 'rgba(255,255,255,0.1)',
                }}
              >
                {isUnlocked ? (
                  <span className="text-3xl">{['🎬', '🎨', '📺', '💻', '🎮', '🧠'][index]}</span>
                ) : (
                  <Lock className="w-6 h-6 text-white/40" />
                )}

                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                  <div className={cn(
                    'font-bold text-sm mb-1',
                    isUnlocked ? 'text-white' : 'text-white/40'
                  )}>
                    {era.name}
                  </div>
                  <div className="text-xs text-white/50">{era.period}</div>
                </div>
              </div>
            </button>
          );
        })}

        <div className="absolute bottom-4 left-4 right-4 glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: phase.color }}>
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-white/60">当前时代</div>
              <div className="font-bold text-lg text-white">{phase.name}</div>
              <div className="text-xs text-white/50">{phase.period} · {phase.tagline}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => actions.selectEra(ERA_ORDER[Math.max(0, ERA_ORDER.indexOf(currentEra) - 1)])}
              disabled={ERA_ORDER.indexOf(currentEra) === 0}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-white/20 transition"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => actions.selectEra(ERA_ORDER[Math.min(ERA_ORDER.length - 1, ERA_ORDER.indexOf(currentEra) + 1)])}
              disabled={ERA_ORDER.indexOf(currentEra) === ERA_ORDER.length - 1 || !unlockedEras.includes(ERA_ORDER[ERA_ORDER.indexOf(currentEra) + 1])}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-white/20 transition"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => actions.unlockNextEra()}
              disabled={!canUnlockNextEra}
              className={cn(
                'px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg',
                canUnlockNextEra
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              )}
            >
              <Rocket className="w-4 h-4" />
              {unlockedEras.length > ERA_ORDER.indexOf(currentEra) + 1 ? '进入下一个时代' : '解锁下一个时代'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <StatCard icon={<Clock className="w-5 h-5" />} label="时代进度" value={`${unlockedEras.length} / ${ERA_ORDER.length}`} color="#8B5CF6" />
        <StatCard icon={<Zap className="w-5 h-5" />} label="研究点数" value={`${researchPoints} RP`} color="#F59E0B" highlight />
        <StatCard icon={<Award className="w-5 h-5" />} label="技术里程碑" value={`${unlockedMilestones.length} / ${Object.keys(TECH_MILESTONES).length}`} color="#10B981" />
        <StatCard icon={<Wrench className="w-5 h-5" />} label="制作工具" value={`${unlockedTools.length} / ${Object.keys(PRODUCTION_TOOLS).length}`} color="#06B6D4" />
      </div>
    </div>
  );

  const renderWorkshopView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">技术里程碑</h3>
              <p className="text-sm text-white/60">研究解锁，推动时代进步</p>
            </div>
          </div>
          <button
            onClick={() => setAutoEvolve(!autoEvolve)}
            className={cn(
              'px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition',
              autoEvolve ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-white/70 hover:bg-white/15'
            )}
          >
            <Play className="w-4 h-4" />
            {autoEvolve ? '自动研究中...' : '开启自动研究'}
          </button>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {currentMilestones.map((m) => {
            const isUnlocked = unlockedMilestones.includes(m.id);
            const canAfford = researchPoints >= m.cost;
            return (
              <MilestoneCard
                key={m.id}
                milestone={m}
                isUnlocked={isUnlocked}
                canAfford={canAfford}
                onClick={() => openDetail('milestone', m.id)}
                onUnlock={() => actions.unlockMilestone(m.id)}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">制作工具</h3>
              <p className="text-sm text-white/60">本时代可用的制作工具</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {currentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isUnlocked={unlockedTools.includes(tool.id)}
                onClick={() => openDetail('tool', tool.id)}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">视觉能力</h3>
              <p className="text-sm text-white/60">本时代解锁的表现能力</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {currentCapabilities.map((cap) => (
              <CapabilityCard
                key={cap.id}
                capability={cap}
                isUnlocked={unlockedCapabilities.includes(cap.id)}
                onClick={() => openDetail('capability', cap.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGalleryView = () => (
    <div className="space-y-6">
      <div className="glass-card p-8" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.03), ${phase.bgGradient})` }}>
        <div className="flex items-start gap-8">
          <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl shadow-2xl" style={{ backgroundColor: phase.color }}>
            {['🎬', '🎨', '📺', '💻', '🎮', '🧠'][ERA_ORDER.indexOf(currentEra)]}
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium px-3 py-1 rounded-full inline-block mb-3" style={{ backgroundColor: `${phase.color}30`, color: phase.accentColor }}>
              {phase.period}
            </div>
            <h2 className="font-display text-4xl font-black text-white mb-3">{phase.name}</h2>
            <p className="text-lg text-white/70 mb-4">{phase.tagline}</p>
            <p className="text-base text-white/60 leading-relaxed">{phase.longDescription}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <Palette className="w-6 h-6" style={{ color: phase.accentColor }} />
            <h3 className="font-bold text-xl text-white">视觉特点</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {phase.visualFeatures.map((feature, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: `${phase.color}20`,
                  color: phase.accentColor,
                  border: `1px solid ${phase.color}40`,
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <Star className="w-6 h-6 text-yellow-400" />
            <h3 className="font-bold text-xl text-white">代表作品</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {phase.keyWorks.map((work, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <Film className="w-4 h-4 text-white/50" />
                <span className="text-white/90">{work}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-cyan-400" />
          <h3 className="font-bold text-xl text-white">历史大事件年表</h3>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="space-y-4">
            {EVOLUTION_EVENTS
              .filter((e) => e.era === currentEra)
              .map((event, index) => (
                <div key={event.id} className="relative pl-16">
                  <div
                    className={cn(
                      'absolute left-0 top-1 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg',
                      event.type === 'milestone' && 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white',
                      event.type === 'tech' && 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white',
                      event.type === 'art' && 'bg-gradient-to-br from-pink-500 to-purple-600 text-white',
                      event.type === 'cultural' && 'bg-gradient-to-br from-green-400 to-emerald-600 text-white'
                    )}
                  >
                    {event.year.toString().slice(2)}
                  </div>
                  <div className="glass-card p-4 hover:bg-white/10 transition">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: event.type === 'milestone' ? 'rgba(245,158,11,0.15)' :
                            event.type === 'tech' ? 'rgba(6,182,212,0.15)' :
                            event.type === 'art' ? 'rgba(168,85,247,0.15)' :
                            'rgba(16,185,129,0.15)',
                          color: event.type === 'milestone' ? '#F59E0B' :
                            event.type === 'tech' ? '#06B6D4' :
                            event.type === 'art' ? '#A855F7' : '#10B981',
                        }}
                      >
                        {event.type === 'milestone' ? '里程碑' :
                          event.type === 'tech' ? '技术' :
                          event.type === 'art' ? '艺术' : '文化'}
                      </span>
                      <span className="text-xs text-white/50">{event.year}</span>
                    </div>
                    <div className="font-bold text-white mb-1">{event.title}</div>
                    <div className="text-sm text-white/60">{event.description}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderComparisonView = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">演化进度总览</h3>
              <p className="text-sm text-white/60">纵观各时代的解锁情况</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {ERA_ORDER.map((eraId) => {
            const era = STYLE_PHASES[eraId];
            const isUnlocked = unlockedEras.includes(eraId);
            const eraMilestones = era.milestones;
            const unlockedCount = eraMilestones.filter((m) => unlockedMilestones.includes(m)).length;
            const progress = (unlockedCount / eraMilestones.length) * 100;

            return (
              <div
                key={eraId}
                className={cn(
                  'p-5 rounded-2xl border transition cursor-pointer',
                  isUnlocked
                    ? 'border-white/20 bg-white/5 hover:bg-white/10'
                    : 'border-white/5 bg-white/[0.02]'
                )}
                onClick={() => isUnlocked && openDetail('era', eraId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg',
                        !isUnlocked && 'grayscale opacity-40'
                      )}
                      style={{ backgroundColor: era.color }}
                    >
                      {isUnlocked ? (
                        ['🎬', '🎨', '📺', '💻', '🎮', '🧠'][ERA_ORDER.indexOf(eraId)]
                      ) : (
                        <Lock className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-white flex items-center gap-2">
                        {era.name}
                        {isUnlocked && currentEra === eraId && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">当前</span>
                        )}
                      </div>
                      <div className="text-sm text-white/50">{era.period}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black" style={{ color: isUnlocked ? era.accentColor : 'rgba(255,255,255,0.2)' }}>
                      {unlockedCount}/{eraMilestones.length}
                    </div>
                    <div className="text-xs text-white/50">里程碑</div>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: isUnlocked ? era.color : 'rgba(255,255,255,0.1)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="font-retro text-3xl font-black text-white mb-1">{stats.totalErasUnlocked}/{ERA_ORDER.length}</div>
          <div className="text-sm text-white/60">时代解锁</div>
        </div>
        <div className="glass-card p-5 text-center">
          <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <div className="font-retro text-3xl font-black text-white mb-1">{stats.totalMilestones}/{Object.keys(TECH_MILESTONES).length}</div>
          <div className="text-sm text-white/60">技术里程碑</div>
        </div>
        <div className="glass-card p-5 text-center">
          <Eye className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <div className="font-retro text-3xl font-black text-white mb-1">{stats.totalCapabilities}/{Object.keys(VISUAL_CAPABILITIES).length}</div>
          <div className="text-sm text-white/60">视觉能力</div>
        </div>
        <div className="glass-card p-5 text-center">
          <Wrench className="w-8 h-8 text-orange-400 mx-auto mb-3" />
          <div className="font-retro text-3xl font-black text-white mb-1">{stats.totalTools}/{Object.keys(PRODUCTION_TOOLS).length}</div>
          <div className="text-sm text-white/60">制作工具</div>
        </div>
        <div className="glass-card p-5 text-center">
          <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="font-retro text-3xl font-black text-white mb-1">{researchPoints}</div>
          <div className="text-sm text-white/60">研究点数 RP</div>
        </div>
        <div className="glass-card p-5 text-center">
          <Rocket className="w-8 h-8 text-pink-400 mx-auto mb-3" />
          <div className="font-retro text-3xl font-black text-white mb-1">{Math.round(stats.evolutionSpeed * 100)}%</div>
          <div className="text-sm text-white/60">演化完成度</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden page-transition-enter">
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000" style={{ background: phase.bgGradient }} />
      <div className="absolute inset-0 bg-museum-pattern pointer-events-none opacity-30" />

      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse-slow pointer-events-none"
        style={{ backgroundColor: `${phase.color}15` }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl animate-pulse-slow pointer-events-none"
        style={{ backgroundColor: `${phase.accentColor}15`, animationDelay: '1s' }}
      />

      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-6 animate-bounce">✨</div>
            <h2 className="font-display text-3xl font-black text-white mb-4">
              进入 {STYLE_PHASES[ERA_ORDER[Math.min(ERA_ORDER.length - 1, ERA_ORDER.indexOf(currentEra))]].name}
            </h2>
            <p className="text-white/70 mb-6">
              新的技术和工具正在解锁中...
            </p>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 transition-all duration-100"
                style={{ width: `${eraTransitionProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 pt-24 pb-20 px-4">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/70">动画文明演化沙盘</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
              <div>
                <h1 className="font-display text-5xl md:text-6xl font-black mb-4">
                  <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                    文明演化
                  </span>
                  <br />
                  <span className="bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${phase.color}, ${phase.accentColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    沙盘
                  </span>
                </h1>
                <p className="text-lg text-white/70 max-w-xl">
                  观察动画风格如何从手绘时代逐渐发展到数字时代。解锁技术节点，获得新的表现能力和制作工具。
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="glass-card px-5 py-3 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-xs text-white/50">研究点数</div>
                    <div className="font-bold text-xl text-white">{researchPoints} RP</div>
                  </div>
                </div>
                <button
                  onClick={() => actions.addResearchPoints(100)}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <FlaskConical className="w-4 h-4" />
                  做研究 +100
                </button>
                <button
                  onClick={() => {
                    if (confirm('确定要重置所有演化进度吗？')) {
                      actions.resetAll();
                    }
                  }}
                  className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                  title="重置进度"
                >
                  <RefreshCw className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>

            <div className="glass-card p-1.5 inline-flex">
              {(
                [
                  { key: 'timeline', label: '演化沙盘', icon: <Layers className="w-4 h-4" /> },
                  { key: 'workshop', label: '工坊', icon: <Hammer className="w-4 h-4" /> },
                  { key: 'gallery', label: '展厅', icon: <BookOpen className="w-4 h-4" /> },
                  { key: 'comparison', label: '总览', icon: <BarChart3 className="w-4 h-4" /> },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => actions.setCurrentView(tab.key)}
                  className={cn(
                    'px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition',
                    currentView === tab.key
                      ? 'text-white shadow-lg'
                      : 'text-white/60 hover:text-white/90'
                  )}
                  style={
                    currentView === tab.key
                      ? { background: `linear-gradient(135deg, ${phase.color}, ${phase.accentColor})` }
                      : {}
                  }
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {currentView === 'timeline' && renderTimelineView()}
          {currentView === 'workshop' && renderWorkshopView()}
          {currentView === 'gallery' && renderGalleryView()}
          {currentView === 'comparison' && renderComparisonView()}
        </div>
      </div>

      {showDetail && detailContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeDetail}>
          <div
            className="glass-card w-full max-w-lg p-8 relative shadow-2xl animate-slide-up"
            style={{ animationFillMode: 'forwards' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDetail}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-start gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl" style={{ backgroundColor: `${detailType === 'era' ? (STYLE_PHASES[detailId as TechEra]?.color || phase.color) : phase.color}40` }}>
                {detailContent.icon}
              </div>
              <div className="flex-1 pt-2">
                <div className="text-xs font-medium text-white/50 mb-1">{detailContent.subtitle}</div>
                <h3 className="font-display text-2xl font-black text-white">{detailContent.title}</h3>
              </div>
            </div>

            <div className="space-y-4 mb-8 max-h-[50vh] overflow-y-auto pr-2">
              {detailContent.sections.map((section, i) => (
                <div key={i}>
                  <div className="text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">{section.label}</div>
                  <div className="text-white/90 leading-relaxed">{section.content}</div>
                </div>
              ))}
            </div>

            {detailContent.action && (
              <button
                onClick={detailContent.action.onClick}
                disabled={detailContent.action.disabled}
                className={cn(
                  'w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
                  !detailContent.action.disabled
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                )}
              >
                {detailContent.action.disabled && !detailContent.action.label.includes('✓') && !detailContent.action.label.includes('解锁') && !detailContent.action.label.includes('当前') ? (
                  <Lock className="w-4 h-4" />
                ) : detailContent.action.label.includes('✓') ? (
                  <Check className="w-4 h-4" />
                ) : null}
                {detailContent.action.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) => (
  <div className={cn(
    'glass-card p-5 transition hover:scale-[1.02]',
    highlight && 'ring-2 ring-yellow-400/30'
  )}>
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-white/50 mb-1">{label}</div>
        <div className="font-black text-xl text-white">{value}</div>
      </div>
    </div>
  </div>
);

const MilestoneCard = ({
  milestone,
  isUnlocked,
  canAfford,
  onClick,
  onUnlock,
}: {
  milestone: TechMilestone;
  isUnlocked: boolean;
  canAfford: boolean;
  onClick: () => void;
  onUnlock: () => void;
}) => (
  <div
    className={cn(
      'p-5 rounded-2xl border transition cursor-pointer group',
      isUnlocked
        ? 'bg-green-500/5 border-green-500/20'
        : canAfford
        ? 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-yellow-500/40'
        : 'bg-white/[0.02] border-white/5'
    )}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div
        className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0 transition',
          !isUnlocked && !canAfford && 'grayscale opacity-50'
        )}
        style={{
          backgroundColor: isUnlocked ? 'rgba(16,185,129,0.15)' : canAfford ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
        }}
      >
        {isUnlocked ? <Check className="w-6 h-6 text-green-400" /> : milestone.visual}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-white/50">{milestone.year}</span>
          {isUnlocked && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-green-500/20 text-green-400">已解锁</span>
          )}
        </div>
        <div className="font-bold text-white mb-1 truncate">{milestone.name}</div>
        <div className="text-sm text-white/60 line-clamp-1">{milestone.description}</div>
      </div>
      {!isUnlocked && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnlock();
          }}
          disabled={!canAfford}
          className={cn(
            'px-4 py-2 rounded-xl font-medium text-sm flex-shrink-0 flex items-center gap-1.5 transition',
            canAfford
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:scale-105'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          {milestone.cost}
        </button>
      )}
    </div>
  </div>
);

const ToolCard = ({
  tool,
  isUnlocked,
  onClick,
}: {
  tool: ProductionTool;
  isUnlocked: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'p-4 rounded-2xl border transition text-left hover:scale-[1.02]',
      isUnlocked
        ? 'bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10'
        : 'bg-white/[0.02] border-white/5'
    )}
  >
    <div className="text-3xl mb-3">{isUnlocked ? tool.icon : '🔒'}</div>
    <div className="font-bold text-sm text-white mb-1 truncate">{tool.name}</div>
    <div className="text-xs text-white/50">{CATEGORY_NAMES[tool.category]}</div>
  </button>
);

const CapabilityCard = ({
  capability,
  isUnlocked,
  onClick,
}: {
  capability: VisualCapability;
  isUnlocked: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      'p-4 rounded-2xl border transition text-left hover:scale-[1.02]',
      isUnlocked
        ? 'bg-pink-500/5 border-pink-500/20 hover:bg-pink-500/10'
        : 'bg-white/[0.02] border-white/5'
    )}
  >
    <div className="text-3xl mb-3">{isUnlocked ? capability.icon : '🔒'}</div>
    <div className="font-bold text-sm text-white mb-1 truncate">{capability.name}</div>
    <div className="text-xs text-white/50 line-clamp-1">{capability.description}</div>
  </button>
);
