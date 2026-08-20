import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Send, 
  TrendingUp, 
  Zap, 
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';
import { Paper } from '../../types';

interface ResearchGapsViewProps {
  paper: Paper;
  onAskAgent: (prompt: string) => void;
}

export const ResearchGapsView: React.FC<ResearchGapsViewProps> = ({
  paper,
  onAskAgent,
}) => {
  const [copied, setCopied] = useState(false);

  const summary = paper.summary_cards || {
    problem_statement: '',
    core_architecture: '',
    datasets_and_metrics: '',
    critical_limitations: '',
  };

  const handleGenerateHypotheses = () => {
    onAskAgent(
      `Based on the identified critical limitations of "${paper.title}", formulate 3 distinct, high-impact novel research hypotheses for a follow-up publication. For each hypothesis, specify:\n1. Proposed Architectural Innovation\n2. Expected Theoretical & Empirical Advantage\n3. Suggested Experimental Evaluation Strategy.`
    );
  };

  const handleCopyGaps = () => {
    let text = `# Research Gaps & Novelty Analysis: ${paper.title}\n\n`;
    text += `## 1. Identified Critical Limitations\n${summary.critical_limitations}\n\n`;
    text += `## 2. Core Novelty & Methodological Strengths\n${summary.core_architecture}\n\n`;
    text += `## 3. Empirical Benchmark Verification\n${summary.datasets_and_metrics}\n\n`;
    text += `## 4. Problem Formulation & Scope\n${summary.problem_statement}\n\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-soft-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-indigo-700 text-white shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <span>Research Gaps & Novelty Discovery Engine</span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                Publication Opportunities
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Detect unaddressed limitations, edge-case vulnerabilities, and actionable future research directions for <strong className="text-slate-800">{paper.title}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleCopyGaps}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 shadow-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Gaps Report'}</span>
          </button>

          <button
            onClick={handleGenerateHypotheses}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate 3 Novel Hypotheses</span>
          </button>
        </div>
      </div>

      {/* 2-Column Core Analysis: Critical Limitations vs Empirical Novelty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Critical Limitations & Unaddressed Edge Cases */}
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-soft-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5 text-rose-700">
              <div className="p-2 rounded-xl bg-rose-100">
                <ShieldAlert className="w-5 h-5 text-rose-700" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Unaddressed Research Limitations
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
              High Priority
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs text-slate-800 leading-relaxed font-medium">
            <p>
              {summary.critical_limitations || 'High computational training costs, quadratic attention complexity, and sensitivity to out-of-distribution shifts.'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Key Vulnerability Breakdown:
            </span>
            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-start space-x-2">
                <span className="text-rose-600 font-bold">•</span>
                <span>Computational / Memory Scaling bottlenecks relative to context size.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-rose-600 font-bold">•</span>
                <span>Degradation under noisy, adversarial, or out-of-domain evaluation inputs.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-rose-600 font-bold">•</span>
                <span>Hyperparameter sensitivity during fine-tuning and domain transfer.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onAskAgent(`Propose a concrete algorithmic technique to solve the computational and memory limitations identified in "${paper.title}".`)}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Explore Algorithmic Solutions to Limitations →</span>
          </button>
        </div>

        {/* Card 2: Core Empirical Novelty & Theoretical Contribution */}
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-soft-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2.5 text-emerald-700">
              <div className="p-2 rounded-xl bg-emerald-100">
                <Zap className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Core Theoretical Novelty
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Novelty
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 leading-relaxed font-medium">
            <p>
              {summary.core_architecture || 'Modular deep architecture engineered for high-throughput representation.'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Empirical Significance:
            </span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
              {summary.datasets_and_metrics || 'Demonstrates superior empirical accuracy on benchmark datasets.'}
            </div>
          </div>

          <button
            onClick={() => onAskAgent(`Deconstruct the exact theoretical novelty of "${paper.title}" compared to prior state-of-the-art literature.`)}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Deconstruct Theoretical Novelty with Agent →</span>
          </button>
        </div>

      </div>

      {/* Actionable Follow-Up Hypotheses Launcher */}
      <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-soft-md space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <span>Actionable Future Research Directions:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onAskAgent(`Propose an efficient linear or state-space model approximation for "${paper.title}" to achieve sub-quadratic complexity.`)}
            className="p-4 text-left rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all group"
          >
            <div className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
              ⚡ Linear / State-Space Adaptation
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Achieve O(N) linear time scaling</p>
          </button>

          <button
            onClick={() => onAskAgent(`Design a quantization and pruning strategy (e.g. 4-bit / 8-bit FP8) for "${paper.title}" for edge NPU deployment.`)}
            className="p-4 text-left rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all group"
          >
            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
              📱 Edge NPU Quantization
            </div>
            <p className="text-[11px] text-slate-500 mt-1">4-bit INT/FP8 hardware efficiency</p>
          </button>

          <button
            onClick={() => onAskAgent(`How can the methodology in "${paper.title}" be extended to multi-modal domains (e.g. vision, audio, robotics)?`)}
            className="p-4 text-left rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all group"
          >
            <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-900">
              🌐 Multi-Modal Extension
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Cross-modal vision & robotics transfer</p>
          </button>
        </div>
      </div>

    </div>
  );
};
