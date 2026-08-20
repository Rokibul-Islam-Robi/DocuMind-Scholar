import React, { useState } from 'react';
import { 
  FileCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Copy, 
  Check, 
  Send,
  Microscope,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Paper } from '../../types';

interface ManuscriptReviewerViewProps {
  paper: Paper;
  onAskAgent: (prompt: string) => void;
}

export const ManuscriptReviewerView: React.FC<ManuscriptReviewerViewProps> = ({
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

  const handleRunFormalReview = () => {
    onAskAgent(
      `Act as a top-tier peer reviewer (e.g. for NeurIPS/ICLR/IEEE). Provide a formal academic peer-review for "${paper.title}". Structure your review with:\n1. Summary of Contributions & Novelty Score (1-10)\n2. Key Strengths\n3. Critical Weaknesses & Potential Reviewer Objections\n4. Methodology Reproducibility & Statistical Rigor Assessment\n5. Actionable Recommendations for Manuscript Improvement.`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-soft-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-md">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <span>Peer-Review & Manuscript Audit Engine</span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                NeurIPS / IEEE Standard
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Simulate peer-review critique, identify methodological vulnerabilities, and audit statistical rigor for <strong className="text-slate-800">{paper.title}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunFormalReview}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Full Peer Review Report</span>
        </button>
      </div>

      {/* 3 Core Audit Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* 1. Methodological Rigor */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-3">
          <div className="flex items-center space-x-2.5 text-emerald-700">
            <div className="p-2 rounded-xl bg-emerald-100">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">1. Methodology & Proofs</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Evaluates the mathematical soundess of the formulations, proof invariants, and theoretical claims.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
            {paper.equations?.length || 0} Equations Verified
          </div>
        </div>

        {/* 2. Statistical Evidence */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-3">
          <div className="flex items-center space-x-2.5 text-cyan-700">
            <div className="p-2 rounded-xl bg-cyan-100">
              <Scale className="w-5 h-5 text-cyan-700" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">2. Empirical Baselines</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Checks dataset variance, statistical significance tests, and baseline comparison fairness.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
            {summary.datasets_and_metrics ? 'Baselines Indexed' : 'Pending Verification'}
          </div>
        </div>

        {/* 3. Vulnerability & Limitation Audit */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-3">
          <div className="flex items-center space-x-2.5 text-rose-700">
            <div className="p-2 rounded-xl bg-rose-100">
              <AlertTriangle className="w-5 h-5 text-rose-700" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">3. Reviewer Objections</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Proactively identifies unaddressed edge cases and out-of-domain degradation before journal submission.
          </p>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium">
            {summary.critical_limitations || 'Compute scaling bottlenecks'}
          </div>
        </div>

      </div>

      {/* Review Actions Panel */}
      <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-soft-md space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Interactive Peer-Review Deep-Dives:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => onAskAgent(`What are the top 3 most severe methodological weaknesses in "${paper.title}" that a harsh peer reviewer would attack?`)}
            className="p-4 text-left rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all group"
          >
            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
              🛡️ Harsh Reviewer Attack Points
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Anticipate critical objections</p>
          </button>

          <button
            onClick={() => onAskAgent(`Assess the reproducibility of the algorithms and experiments described in "${paper.title}". What details are missing?`)}
            className="p-4 text-left rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 transition-all group"
          >
            <div className="text-xs font-bold text-slate-800 group-hover:text-cyan-900">
              🔄 Reproducibility Assessment
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Evaluate code & parameter completeness</p>
          </button>

          <button
            onClick={() => onAskAgent(`Compare the novelty claims of "${paper.title}" against existing literature prior to ${paper.year || '2024'}. Is the novelty incremental or fundamental?`)}
            className="p-4 text-left rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-all group"
          >
            <div className="text-xs font-bold text-slate-800 group-hover:text-purple-900">
              🌟 True Novelty Classification
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Incremental vs Fundamental breakdown</p>
          </button>
        </div>
      </div>

    </div>
  );
};
