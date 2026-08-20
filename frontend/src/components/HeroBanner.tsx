import React from 'react';
import { Sparkles, Layers, Sigma, Table2, Compass, FileCheck } from 'lucide-react';
import { ResearcherView, Paper } from '../types';

interface HeroBannerProps {
  currentView: ResearcherView | string;
  activePaper: Paper | null;
  samplePapers: Paper[];
  onSelectPaper: (paper: Paper) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentView,
  activePaper,
  samplePapers,
  onSelectPaper,
}) => {
  const getBannerDetails = () => {
    switch (currentView) {
      case 'deepdive':
      case 'research':
        return {
          badge: 'COORDINATE-LINKED RESEARCH MULTI-AGENT COPILOT',
          title: 'Research Paper Deep-Dive & Citation Engine',
          subtitle: 'Section-aware document reading, bounding-box coordinate tracking, and interactive peer-level research Q&A.',
          gradient: 'from-emerald-600 via-teal-600 to-indigo-700',
        };
      case 'formula':
        return {
          badge: 'KATEX LATEX MATHEMATICAL DECODER',
          title: 'Methodology & Formula Variable Breakdown',
          subtitle: 'Decode complex mathematical formulations, loss functions, tensor shapes, and variable semantics.',
          gradient: 'from-indigo-600 via-purple-600 to-pink-700',
        };
      case 'matrix':
        return {
          badge: 'CROSS-PAPER SYNTHESIS & BENCHMARKS',
          title: 'Multi-Paper Literature Synthesis Matrix',
          subtitle: 'Compare 2 to 10 papers across methodology, datasets, accuracy/mAP metrics, and 1-click export to LaTeX (.tex) tables.',
          gradient: 'from-cyan-600 via-blue-600 to-indigo-700',
        };
      case 'gaps':
        return {
          badge: 'CRITICAL LIMITATIONS & NOVELTY EXTRACTION',
          title: 'Research Gaps & Novelty Discovery Engine',
          subtitle: 'Discover unaddressed limitations, out-of-domain degradation risks, and formulate novel publication ideas.',
          gradient: 'from-teal-600 via-emerald-600 to-cyan-700',
        };
      case 'review':
        return {
          badge: 'NEURIPS / IEEE PEER REVIEW SIMULATOR',
          title: 'Peer-Review Audit & Manuscript Critiquer',
          subtitle: 'Simulate top-tier peer review feedback, test methodological reproducibility, and anticipate reviewer objections.',
          gradient: 'from-emerald-700 via-teal-700 to-indigo-800',
        };
      default:
        return {
          badge: 'RESEARCH SCHOLAR WORKSPACE',
          title: 'DocuMind Scholar Research Intelligence',
          subtitle: 'Comprehensive literature synthesis, formula decoding, and peer review simulation.',
          gradient: 'from-emerald-600 via-teal-600 to-indigo-700',
        };
    }
  };

  const banner = getBannerDetails();

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-soft-md p-4 sm:p-5 mb-5 text-white select-none transition-all duration-300">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-95`} />
      
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 max-w-full">
        
        {/* Left Info */}
        <div className="text-left space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[9px] font-black uppercase tracking-widest text-white shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{banner.badge}</span>
          </div>

          <h2 className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-white drop-shadow-sm">
            {banner.title}
          </h2>

          <p className="text-xs text-white/90 font-medium max-w-2xl leading-snug drop-shadow-2xs">
            {banner.subtitle}
          </p>
        </div>

        {/* Right Test Presets Bar */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 justify-end">
          {samplePapers.slice(0, 3).map((p) => {
            const isSelected = activePaper?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPaper(p)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border backdrop-blur-md ${
                  isSelected
                    ? 'bg-white text-slate-900 border-white shadow-md scale-102'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{p.title}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
