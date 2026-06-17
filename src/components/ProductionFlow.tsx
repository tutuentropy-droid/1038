import { useState, useEffect } from 'react';
import {
  Film,
  PenTool,
  Palette,
  Mic,
  Layers,
  Image as ImageIcon,
  ChevronDown,
  Check,
  Wrench,
} from 'lucide-react';
import { ProductionStep, productionSteps } from '@/data/workshop';
import { useWorkshopStore } from '@/store/useWorkshopStore';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  film: Film,
  'pen-tool': PenTool,
  palette: Palette,
  mic: Mic,
  layers: Layers,
  image: ImageIcon,
};

interface ProductionFlowProps {
  onBadgeEarned?: (badgeId: string) => void;
}

export const ProductionFlow = ({ onBadgeEarned }: ProductionFlowProps) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const { markStepLearned, learnedSteps, earnBadge } = useWorkshopStore();

  const handleStepClick = (stepId: string) => {
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
      if (!learnedSteps.includes(stepId)) {
        markStepLearned(stepId);
        checkBadges(stepId);
      }
    }
  };

  const checkBadges = (stepId: string) => {
    const step = productionSteps.find((s) => s.id === stepId);
    if (!step) return;

    if (stepId === 'storyboard') {
      earnBadge('storyboard-apprentice');
      onBadgeEarned?.('storyboard-apprentice');
    }
    if (stepId === 'key-animation') {
      earnBadge('key-animation-beginner');
      onBadgeEarned?.('key-animation-beginner');
    }
    if (stepId === 'coloring') {
      earnBadge('color-master');
      onBadgeEarned?.('color-master');
    }
    if (stepId === 'voice-acting') {
      earnBadge('voice-director');
      onBadgeEarned?.('voice-director');
    }

    const newLearnedCount = learnedSteps.length + 1;
    if (newLearnedCount >= productionSteps.length) {
      earnBadge('production-master');
      onBadgeEarned?.('production-master');
    }
  };

  useEffect(() => {
    if (learnedSteps.length >= productionSteps.length && !earnBadge) {
    }
  }, [learnedSteps, earnBadge]);

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
          <Film className="w-4 h-4 text-80s-primary" />
          <span className="text-sm text-museum-textMuted">动画制作流水线</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-white mb-2">
          动画是怎样制作的？
        </h2>
        <p className="text-museum-textMuted">
          点击每个步骤，了解动画制作的完整流程
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-80s-primary via-90s-primary to-00s-primary" />

        <div className="space-y-6">
          {productionSteps.map((step, index) => {
            const isExpanded = expandedStep === step.id;
            const isLearned = learnedSteps.includes(step.id);
            const Icon = iconMap[step.icon] || Film;

            return (
              <div key={step.id} className="relative pl-20">
                <div
                  className={`absolute left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center 
                    transition-all duration-300 z-10 ${
                      isLearned
                        ? 'bg-green-500 text-white'
                        : 'bg-museum-bgLight border border-museum-border'
                    }`}
                >
                  {isLearned ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold text-museum-textMuted">
                      {index + 1}
                    </span>
                  )}
                </div>

                <div
                  className={`glass-card overflow-hidden cursor-pointer transition-all duration-300 
                    hover:border-white/20 ${isExpanded ? 'border-white/30' : ''}`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: step.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                          {step.name}
                          <span className="text-xs font-normal text-museum-textMuted">
                            {step.nameEn}
                          </span>
                        </h3>
                        <p className="text-sm text-museum-textMuted">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-museum-textMuted transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-5 pb-5 space-y-4">
                      <div className="border-t border-museum-border pt-4">
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Film className="w-4 h-4" style={{ color: step.color }} />
                          工作内容
                        </h4>
                        <ul className="space-y-2">
                          {step.details.map((detail, i) => (
                            <li
                              key={i}
                              className="text-sm text-museum-textMuted flex items-start gap-2"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: step.color }}
                              />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Wrench className="w-4 h-4" style={{ color: step.color }} />
                          使用工具
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {step.tools.map((tool, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-museum-textMuted"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-museum-textMuted">
          已学习 <span className="text-white font-bold">{learnedSteps.length}</span> /{' '}
          {productionSteps.length} 个制作步骤
        </p>
        <div className="w-full max-w-md mx-auto mt-3 h-2 bg-museum-bgLight rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-80s-primary via-90s-primary to-00s-primary transition-all duration-500"
            style={{
              width: `${(learnedSteps.length / productionSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
