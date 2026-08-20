import React, { useState } from 'react';
import { Sigma, Sparkles, Copy, Check, Calculator } from 'lucide-react';
import { Paper, EquationItem } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface FormulaDecoderViewProps {
  paper: Paper;
  onExplainFormula: (eq: EquationItem) => void;
}

export const FormulaDecoderView: React.FC<FormulaDecoderViewProps> = ({
  paper,
  onExplainFormula,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const equations = paper.equations || [];

  const handleCopyLatex = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-soft-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-700 shadow-sm">
            <Sigma className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <span>Mathematical Formulations Index</span>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-bold">
                {equations.length} Equations Decoded
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              KaTeX rendered mathematical blocks with variable semantic breakdown and tensor dimensions.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Target: {paper.title}
          </span>
        </div>
      </div>

      {/* Equations Grid */}
      {equations.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-soft-sm space-y-2">
          <Calculator className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No explicit LaTeX equations extracted from this document.</p>
          <p className="text-xs text-slate-500 font-medium">Formulas with =, \sum, \int, \frac or matrices are detected automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {equations.map((eq, idx) => (
            <div
              key={eq.id || idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 shadow-soft-sm hover:shadow-soft-md transition-all space-y-4 group"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="px-3 py-1 rounded-xl text-xs font-black font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Equation #{idx + 1} • Page {eq.page || 1}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyLatex(eq.id, eq.latex)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                    title="Copy LaTeX code"
                  >
                    {copiedId === eq.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === eq.id ? 'Copied' : 'Copy LaTeX'}</span>
                  </button>

                  <button
                    onClick={() => onExplainFormula(eq)}
                    className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Decode Variables with Agent</span>
                  </button>
                </div>
              </div>

              {/* KaTeX Math Box */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto text-center">
                <KaTeXRenderer content={eq.latex} block />
              </div>

              {/* Description */}
              {eq.description && (
                <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 leading-relaxed font-medium">
                  <strong className="text-slate-900">Theoretical Role:</strong> {eq.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
