import React from 'react';
import { Target, Cpu, BarChart3, AlertTriangle, ArrowRight } from 'lucide-react';
import { SummaryCards } from '../../types';

interface SectionBreakdownCardsProps {
  summaryCards: SummaryCards;
  onAskTopic: (topicTitle: string, context: string) => void;
}

export const SectionBreakdownCards: React.FC<SectionBreakdownCardsProps> = ({
  summaryCards,
  onAskTopic,
}) => {
  const cards = [
    {
      id: 'problem',
      title: 'Problem Statement',
      icon: Target,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      content: summaryCards.problem_statement || 'Investigates fundamental constraints in prior baselines.',
    },
    {
      id: 'architecture',
      title: 'Core Architecture',
      icon: Cpu,
      color: 'text-research',
      bg: 'bg-research/10',
      border: 'border-research/20 hover:border-research/40',
      content: summaryCards.core_architecture || 'Modular deep architecture engineered for high-throughput representation.',
    },
    {
      id: 'metrics',
      title: 'Datasets & Key Metrics',
      icon: BarChart3,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      content: summaryCards.datasets_and_metrics || 'Demonstrates superior empirical accuracy on standard academic benchmarks.',
    },
    {
      id: 'limitations',
      title: 'Critical Limitations',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      content: summaryCards.critical_limitations || 'Requires high compute during training and parameter sensitivity.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onAskTopic(card.title, card.content)}
            className={`p-3.5 rounded-xl bg-surface border ${card.border} cursor-pointer transition-all hover:translate-y-[-2px] group relative overflow-hidden flex flex-col justify-between`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${card.bg} ${card.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100">
                    {card.title}
                  </h4>
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3 group-hover:text-zinc-300">
                {card.content}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-surface-border/60 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Click to query agent</span>
              <span className="font-mono text-zinc-400 group-hover:text-research">Inspect →</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
