import React, { useMemo, useState } from 'react';
import { Target, Info } from 'lucide-react';

interface Habilidade {
  nomeHabilidade: string;
  longevidade: string;
  anosRestantes?: number;
  riscoObsolescencia: number;
  categoria: string;
}

interface RotaUpcycling {
  habilidadeOrigem: string;
  microHabilidade: string;
  horasEstimadas: number;
  novaCompetencia: string;
  ganhoLongevidade: number;
  tipoRota: string;
}

interface SugestaoCarreira {
  nomeCarreira: string;
  compatibilidade: number;
  nivelExperiencia: string;
}

interface HabilidadeMapProps {
  habilidades: Habilidade[];
  rotaUpcycling?: RotaUpcycling[];
  sugestoesCarreira?: SugestaoCarreira[];
}

// Interfaces internas para o grafo
interface Node {
  id: string;
  x: number;
  y: number;
  type: 'current' | 'target' | 'micro';
  risk?: number;
  label: string;
}

interface Link {
  source: string;
  target: string;
  type: 'solid' | 'dashed';
}

export default function HabilidadeMap({ habilidades, rotaUpcycling = [] }: HabilidadeMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Lógica para gerar posições dos nós (Simulação de Grafo)
  const graphData = useMemo(() => {
    const nodes: Node[] = [];
    const links: Link[] = [];
    const width = 800;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Identificar o "Alvo Central" (A competência nova mais frequente)
    // Se não tiver rota, pega a primeira habilidade como centro fictício
    const targetName = rotaUpcycling.length > 0 
      ? rotaUpcycling[0].novaCompetencia 
      : (habilidades[0]?.nomeHabilidade || "Centro");

    // Adiciona o Nó Central (Cyan/Neon)
    nodes.push({
      id: targetName,
      x: centerX,
      y: centerY,
      type: 'target',
      label: targetName
    });

    // 2. Posicionar Habilidades Atuais ao redor (Orbita)
    const currentSkills = habilidades.filter(h => h.nomeHabilidade !== targetName);
    const radius = 180; // Distância do centro
    const angleStep = (2 * Math.PI) / (currentSkills.length || 1);

    currentSkills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2; // Começa do topo
      // Adiciona uma pequena aleatoriedade para parecer orgânico
      const randomOffset = (index % 2 === 0 ? 20 : -20); 
      
      const x = centerX + Math.cos(angle) * (radius + randomOffset);
      const y = centerY + Math.sin(angle) * (radius + randomOffset);

      nodes.push({
        id: skill.nomeHabilidade,
        x,
        y,
        type: 'current',
        risk: skill.riscoObsolescencia,
        label: skill.nomeHabilidade
      });

      // Se houver uma rota dessa habilidade para o alvo, cria o link
      const hasRoute = rotaUpcycling.find(r => 
        r.habilidadeOrigem === skill.nomeHabilidade && r.novaCompetencia === targetName
      );

      if (hasRoute) {
        // Link direto tracejado (Upcycling)
        links.push({ source: skill.nomeHabilidade, target: targetName, type: 'dashed' });
        
        // Opcional: Adicionar nó intermediário (Micro-habilidade)
        const midX = (x + centerX) / 2;
        const midY = (y + centerY) / 2;
        nodes.push({
            id: `micro-${skill.nomeHabilidade}`,
            x: midX,
            y: midY + 30, // Levemente deslocado
            type: 'micro',
            label: hasRoute.microHabilidade
        });
        // Link solido para a micro
        links.push({ source: skill.nomeHabilidade, target: `micro-${skill.nomeHabilidade}`, type: 'solid' });
        links.push({ source: `micro-${skill.nomeHabilidade}`, target: targetName, type: 'solid' });
      } else {
        // Se não tem rota direta, cria uma linha fina de conexão apenas visual
        links.push({ source: skill.nomeHabilidade, target: targetName, type: 'solid' });
      }
    });

    return { nodes, links };
  }, [habilidades, rotaUpcycling]);

  // Função auxiliar de cores
  const getNodeColor = (node: Node) => {
    if (node.type === 'target') return '#22d3ee'; // Cyan (Power BI style)
    if (node.type === 'micro') return '#94a3b8'; // Cinza
    
    // Cores baseadas no risco (Current)
    const risk = node.risk || 0;
    if (risk > 0.6) return '#ef4444'; // Vermelho (Obsolescente)
    if (risk > 0.3) return '#fbbf24'; // Amarelo
    return '#10b981'; // Verde (Estável)
  };

  const getNodeRadius = (type: string) => {
    if (type === 'target') return 35;
    if (type === 'micro') return 20;
    return 28;
  };

  if (habilidades.length === 0) {
     return <div className="p-8 text-center text-gray-500 bg-[#0B0516] border border-white/10 rounded-xl">Sem dados para gerar o mapa.</div>;
  }

  return (
    <div className="bg-[#0B0516] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col h-full w-full">
      
      {/* Grid de Fundo (Efeito visual) */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}
      />

      {/* Cabeçalho */}
      <div className="relative z-10 mb-2">
        <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
          Rotas de Upcycling
        </span>
        <h3 className="text-2xl font-bold text-white mb-1">Mapa de Habilidades</h3>
        <p className="text-gray-400 text-sm">Navegue pelo universo de possibilidades da sua carreira</p>
      </div>

      {/* Área do Grafo SVG */}
      <div className="flex-1 w-full min-h-[400px] relative z-10 flex items-center justify-center">
        <svg 
            viewBox="0 0 800 500" 
            className="w-full h-full max-w-4xl cursor-grab active:cursor-grabbing"
            style={{ filter: 'drop-shadow(0px 0px 20px rgba(0,0,0,0.5))' }}
        >
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" opacity="0.5" />
                </marker>
                {/* Glow Effect */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Links (Linhas) */}
            {graphData.links.map((link, i) => {
                const sourceNode = graphData.nodes.find(n => n.id === link.source);
                const targetNode = graphData.nodes.find(n => n.id === link.target);
                if (!sourceNode || !targetNode) return null;

                return (
                    <line
                        key={i}
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={link.type === 'dashed' ? '#ef4444' : '#475569'}
                        strokeWidth={link.type === 'dashed' ? 2 : 1}
                        strokeDasharray={link.type === 'dashed' ? "5,5" : "0"}
                        opacity={link.type === 'dashed' ? 0.8 : 0.4}
                    />
                );
            })}

            {/* Nós (Bolinhas) */}
            {graphData.nodes.map((node) => {
                const color = getNodeColor(node);
                const radius = getNodeRadius(node.type);
                const isHovered = hoveredNode === node.id;

                return (
                    <g 
                        key={node.id} 
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        style={{ transition: 'all 0.3s ease' }}
                        className="cursor-pointer group"
                    >
                        {/* Círculo externo (Glow) no Hover */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={radius + (isHovered ? 10 : 0)}
                            fill={color}
                            opacity={isHovered ? 0.2 : 0}
                            className="transition-all duration-300"
                        />
                        
                        {/* Círculo Principal */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={radius}
                            fill={node.type === 'micro' ? '#1e293b' : color}
                            stroke={color}
                            strokeWidth={node.type === 'micro' ? 1 : 0}
                            className="transition-all duration-300"
                            filter={node.type === 'target' ? "url(#glow)" : ""}
                            opacity={node.type === 'micro' ? 0.8 : 1}
                        />

                        {/* Texto dentro ou abaixo */}
                        <text
                            x={node.x}
                            y={node.y}
                            dy=".3em"
                            textAnchor="middle"
                            fill={node.type === 'target' || (node.risk || 0) > 0.6 ? '#fff' : '#fff'}
                            fontSize={node.type === 'micro' ? 10 : 12}
                            fontWeight="bold"
                            pointerEvents="none"
                            style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
                        >
                            {/* Quebra de linha simples para nomes longos */}
                            {node.label.split(' ').length > 1 && node.type !== 'micro' ? (
                                <>
                                    <tspan x={node.x} dy="-0.5em">{node.label.split(' ')[0]}</tspan>
                                    <tspan x={node.x} dy="1.2em">{node.label.split(' ').slice(1).join(' ')}</tspan>
                                </>
                            ) : node.label}
                        </text>
                        
                        {/* Tooltip simples simulado */}
                        {isHovered && node.type === 'current' && (
                             <text x={node.x} y={node.y - radius - 10} textAnchor="middle" fill="#fff" fontSize="10">
                                Risco: {((node.risk || 0) * 100).toFixed(0)}%
                             </text>
                        )}
                    </g>
                );
            })}
        </svg>
      </div>

      {/* Legenda (Rodapé) */}
      <div className="mt-4 flex flex-wrap gap-6 items-center justify-start text-xs text-gray-400 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              <span>Obsolescente (Alto Risco)</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
              <span>Alta Demanda (Alvo)</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span>Oportunidade (Baixo Risco)</span>
          </div>
           <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 border-t-2 border-dashed border-red-500"></div>
              <span>Rota de Upcycling</span>
          </div>
      </div>
    </div>
  );
}