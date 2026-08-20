import React, { useState } from 'react';
import { FileText, Sparkles, BookOpen, Copy, Check, Download, Layers, Target, CheckCircle2 } from 'lucide-react';
import { Paper } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface ChapterSummaryViewProps {
  paper: Paper;
  onAskTutor: (topic: string) => void;
}

export const ChapterSummaryView: React.FC<ChapterSummaryViewProps> = ({
  paper,
  onAskTutor,
}) => {
  const [copied, setCopied] = useState(false);

  const sections = paper.sections ? Object.values(paper.sections) : [];
  const summary = paper.summary_cards || {
    problem_statement: '',
    core_architecture: '',
    datasets_and_metrics: '',
    critical_limitations: '',
  };

  const handleCopyNotes = () => {
    let text = `# ${paper.title} - Study Revision Notes\n\n`;
    text += `## Core Concept Overview\n${summary.core_architecture}\n\n`;
    text += `## Problem & Motivation\n${summary.problem_statement}\n\n`;
    text += `## Key Takeaways & Metrics\n${summary.datasets_and_metrics}\n\n`;
    text += `## Critical Considerations\n${summary.critical_limitations}\n\n`;
    sections.forEach(s => {
      text += `### ${s.title}\n${s.text}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-soft-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 text-[#6351d8] shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <span>Chapter Notes & Revision Cheat-Sheet</span>
              <span className="text-[10px] font-mono text-[#5442be] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 font-bold">
                {sections.length} Sections Extracted
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Structured summary bullet points, core concepts, and key definitions for {paper.title}.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyNotes}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#1c1243] via-[#38207d] to-[#6351d8] hover:from-[#241556] hover:to-[#5240c4] shadow-md transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Full Cheat-Sheet!' : 'Copy Study Notes'}</span>
        </button>
      </div>

      {/* 4 Essential Revision Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            1. Core Problem & Concept
          </span>
          <h4 className="text-sm font-black text-slate-900 pt-1">Why are we studying this?</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {summary.problem_statement || 'Foundational conceptual constraints and bottlenecks in standard approaches.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200">
            2. Proposed Method & Formula
          </span>
          <h4 className="text-sm font-black text-slate-900 pt-1">How does it work?</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {summary.core_architecture || 'Modular deep architecture engineered for high-throughput representation.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
            3. Key Results & Evidence
          </span>
          <h4 className="text-sm font-black text-slate-900 pt-1">What did experiments show?</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {summary.datasets_and_metrics || 'Demonstrates superior empirical accuracy on benchmark datasets.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-800 border border-orange-200">
            4. Edge Cases & Caveats
          </span>
          <h4 className="text-sm font-black text-slate-900 pt-1">What to watch out for in exams?</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {summary.critical_limitations || 'Requires high compute and sensitivity to hyperparameter scaling.'}
          </p>
        </div>
      </div>

      {/* Detailed Section Breakdown */}
      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <div
            key={sec.section_name || idx}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#6351d8]" />
                <span>{sec.title}</span>
              </h4>
              <button
                onClick={() => onAskTutor(`Explain the section "${sec.title}" in detail`)}
                className="text-xs font-bold text-[#6351d8] hover:text-[#5240c4] font-mono"
              >
                Ask Tutor to Clarify →
              </button>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2">
              {sec.text.split('\n\n').slice(0, 3).map((p, pIdx) => (
                <p key={pIdx}>
                  <KaTeXRenderer content={p} />
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
