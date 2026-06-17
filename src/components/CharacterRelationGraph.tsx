import { useMemo, useRef, useEffect, useState } from 'react';
import { Character, CharacterRelation } from '@/types';

interface CharacterRelationGraphProps {
  characters: Character[];
  relations: CharacterRelation[];
  eraColor: string;
}

interface NodePosition {
  x: number;
  y: number;
  character: Character;
}

export const CharacterRelationGraph = ({ characters, relations, eraColor }: CharacterRelationGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredRelation, setHoveredRelation] = useState<number | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const nodePositions = useMemo(() => {
    if (!dimensions.width || characters.length === 0) return [];
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
    
    if (characters.length === 1) {
      return [{ x: centerX, y: centerY, character: characters[0] }];
    }

    return characters.map((character, index) => {
      const angle = (2 * Math.PI * index) / characters.length - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        character
      };
    });
  }, [characters, dimensions]);

  const getNodeById = (id: string) => nodePositions.find(n => n.character.id === id);

  const relationLines = useMemo(() => {
    return relations.map((rel, index) => {
      const fromNode = getNodeById(rel.from);
      const toNode = getNodeById(rel.to);
      if (!fromNode || !toNode) return null;
      return { ...rel, fromPos: fromNode, toPos: toNode, index };
    }).filter(Boolean);
  }, [relations, nodePositions]);

  const isNodeHighlighted = (characterId: string) => {
    if (!hoveredNode) return false;
    if (hoveredNode === characterId) return true;
    return relations.some(
      r => (r.from === hoveredNode && r.to === characterId) || 
           (r.to === hoveredNode && r.from === characterId)
    );
  };

  const isRelationHighlighted = (relIndex: number) => {
    return hoveredRelation === relIndex;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] min-h-[400px] rounded-2xl overflow-hidden"
      style={{ background: `radial-gradient(circle at center, ${eraColor}08 0%, transparent 70%)` }}
    >
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, ${eraColor} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {dimensions.width > 0 && (
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
            {relations.map((rel, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={rel.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={rel.color} stopOpacity="0.6" />
              </linearGradient>
            ))}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {relationLines.map((line) => {
            if (!line) return null;
            const highlighted = isRelationHighlighted(line.index) || 
              (hoveredNode && (line.from === hoveredNode || line.to === hoveredNode));
            
            return (
              <g key={line.index}>
                <line
                  x1={line.fromPos.x}
                  y1={line.fromPos.y}
                  x2={line.toPos.x}
                  y2={line.toPos.y}
                  stroke={line.color}
                  strokeWidth={highlighted ? 3 : 1.5}
                  strokeOpacity={highlighted ? 0.8 : 0.3}
                  filter={highlighted ? 'url(#glow)' : undefined}
                  className="transition-all duration-300"
                />
                
                <text
                  x={(line.fromPos.x + line.toPos.x) / 2}
                  y={(line.fromPos.y + line.toPos.y) / 2 - 8}
                  textAnchor="middle"
                  fill={line.color}
                  fontSize="11"
                  fontWeight="500"
                  opacity={highlighted ? 1 : 0.5}
                  className="transition-all duration-300 pointer-events-none"
                >
                  {line.relation}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {nodePositions.map((node) => {
        const isHighlighted = isNodeHighlighted(node.character.id);
        const isHovered = hoveredNode === node.character.id;
        
        return (
          <div
            key={node.character.id}
            className="absolute z-10 flex flex-col items-center transition-all duration-300 cursor-pointer"
            style={{
              left: node.x,
              top: node.y,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredNode(node.character.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div 
              className={`relative rounded-full overflow-hidden border-2 transition-all duration-500
                ${isHovered ? 'scale-125' : isHighlighted ? 'scale-110' : 'scale-100'}`}
              style={{
                width: isHovered ? 72 : 60,
                height: isHovered ? 72 : 60,
                borderColor: isHighlighted || isHovered ? eraColor : 'rgba(255,255,255,0.2)',
                boxShadow: isHighlighted || isHovered 
                  ? `0 0 20px ${eraColor}40, 0 0 40px ${eraColor}20` 
                  : 'none'
              }}
            >
              <img
                src={node.character.image}
                alt={node.character.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div 
              className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-center whitespace-nowrap transition-all duration-300
                ${isHovered || isHighlighted ? 'opacity-100' : 'opacity-70'}`}
              style={{
                backgroundColor: isHovered || isHighlighted ? `${eraColor}30` : 'rgba(255,255,255,0.05)',
                color: isHovered || isHighlighted ? eraColor : 'rgba(255,255,255,0.7)',
              }}
            >
              {node.character.name}
            </div>

            {(isHovered || isHighlighted) && (
              <div className="mt-1 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm max-w-[160px] text-center animate-scale-in">
                <p className="text-[10px] text-museum-textMuted leading-relaxed line-clamp-2">
                  {node.character.description}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {relations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-museum-textMuted text-sm">暂无角色关系数据</p>
        </div>
      )}
    </div>
  );
};
