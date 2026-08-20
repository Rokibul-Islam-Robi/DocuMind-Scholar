import React, { useState } from 'react';
import { 
  BookCheck, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  ListOrdered, 
  FileEdit, 
  GraduationCap, 
  Send, 
  Download, 
  Copy, 
  Check, 
  Lightbulb,
  ArrowRight,
  Flame,
  Target,
  BookOpen,
  Zap
} from 'lucide-react';
import { Paper } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface StudyGuideViewProps {
  paper: Paper;
  onAskTutor: (prompt: string) => void;
}

export const StudyGuideView: React.FC<StudyGuideViewProps> = ({
  paper,
  onAskTutor,
}) => {
  const [assignmentQuery, setAssignmentQuery] = useState('');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const sections = paper.sections ? Object.values(paper.sections) : [];
  const summary = paper.summary_cards || {
    problem_statement: '',
    core_architecture: '',
    datasets_and_metrics: '',
    critical_limitations: '',
  };

  const toggleTopic = (topic: string) => {
    setCompletedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleSolveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentQuery.trim()) return;
    onAskTutor(
      `Here is my assignment / homework question related to "${paper.title}":\n\n"${assignmentQuery.trim()}"\n\nPlease provide a clear, step-by-step explanation, relevant formulas, and guidance on how to solve this problem correctly.`
    );
    setAssignmentQuery('');
  };

  const handleCopyGuide = () => {
    let guide = `# Comprehensive Study Guide: ${paper.title}\n\n`;
    guide += `## 1. Executive Summary & Big Picture\n${summary.core_architecture}\n\n`;
    guide += `## 2. Core Problem & Concept Overview\n${summary.problem_statement}\n\n`;
    guide += `## 3. Key Formulas & Evidence\n${summary.datasets_and_metrics}\n\n`;
    guide += `## 4. Exam Watch-outs & Common Traps\n${summary.critical_limitations}\n\n`;
    guide += `## 5. Chapter Topics Breakdown\n`;
    sections.forEach((s, idx) => {
      guide += `\n### Topic ${idx + 1}: ${s.title}\n${s.text.slice(0, 300)}...\n`;
    });

    navigator.clipboard.writeText(guide);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const progressPercent = sections.length > 0 ? Math.round((completedTopics.length / sections.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header Banner Card with Gradient Border & Ambient Glow */}
      <div className="relative p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-soft-xl overflow-hidden group hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1c1243] via-[#6351d8] to-[#ffb800]" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50/70 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1c1243] via-[#38207d] to-[#6351d8] text-white shadow-md shadow-indigo-500/25 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300">
              <BookCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Study Guide & Homework Solver
                </h2>
                <span className="text-[10px] font-mono text-[#5442be] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-bold">
                  AI Mentor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Structured chapter roadmaps, homework guidance, and conceptual mastery checklist for <strong className="text-slate-800">{paper.title}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyGuide}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#1c1243] via-[#38207d] to-[#6351d8] hover:from-[#241556] hover:to-[#5240c4] shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all shrink-0 hover:scale-102"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Full Study Guide!' : 'Copy Study Guide'}</span>
          </button>
        </div>
      </div>

      {/* 2. 2-Column Grid: Assignment Helper & Topic Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Assignment & Homework Question Solver */}
        <div className="relative p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-soft-xl space-y-5 flex flex-col justify-between hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6351d8] to-[#ffb800]" />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-[#6351d8] shadow-sm group-hover:scale-110 transition-transform">
                <FileEdit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <span>Assignment & Homework Solver</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </h3>
                <p className="text-xs text-slate-500 font-medium">Type your homework question to get step-by-step guidance</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 leading-relaxed font-medium space-y-1.5 shadow-sm">
              <div className="flex items-center space-x-1.5 font-bold text-[#5442be]">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>How the AI Homework Assistant works:</span>
              </div>
              <p className="text-slate-600 leading-normal">
                It deconstructs your problem, identifies the relevant formulas in your course notes, and gives you step-by-step reasoning hints.
              </p>
            </div>

            <form onSubmit={handleSolveAssignment} className="space-y-3 pt-1">
              <textarea
                value={assignmentQuery}
                onChange={(e) => setAssignmentQuery(e.target.value)}
                placeholder="Paste your assignment prompt, homework problem, or exercise question here..."
                rows={4}
                className="w-full p-4 bg-slate-50/80 border border-slate-200 focus:border-[#6351d8] focus:bg-white rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium resize-none shadow-inner"
              />

              <button
                type="submit"
                disabled={!assignmentQuery.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl text-xs font-bold text-[#1a1038] bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] hover:from-[#f5a623] hover:to-[#d98207] disabled:opacity-40 shadow-md shadow-amber-500/20 hover:shadow-lg transition-all hover:scale-101"
              >
                <Sparkles className="w-4 h-4 text-[#1a1038]" />
                <span>Get Step-by-Step Assignment Guidance →</span>
              </button>
            </form>
          </div>

          {/* Quick Homework Presets */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Quick Homework Action Chips:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onAskTutor(`How do I write a comprehensive summary of the core concepts in "${paper.title}" for my class assignment?`)}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition-all hover:scale-102"
              >
                📝 Assignment Summary Format
              </button>
              <button
                onClick={() => onAskTutor(`Provide a practical numerical / code example for the main concept in "${paper.title}".`)}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all hover:scale-102"
              >
                🔢 Practical Step-by-Step Example
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Topic Mastery Checklist */}
        <div className="relative p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-soft-xl space-y-5 flex flex-col justify-between hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#241556] to-[#6351d8]" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-[#6351d8] shadow-sm group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Topic Mastery Checklist</h3>
                  <p className="text-xs text-slate-500 font-medium">Click topics to check off your revision progress</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-mono font-bold text-indigo-900 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{completedTopics.length} / {sections.length || 4} Mastered</span>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 mt-4">
              {sections.map((sec, idx) => {
                const isChecked = completedTopics.includes(sec.title);
                return (
                  <div
                    key={sec.section_name || idx}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between group/item ${
                      isChecked
                        ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-sm scale-[0.99]'
                        : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:scale-101'
                    }`}
                  >
                    <div
                      onClick={() => toggleTopic(sec.title)}
                      className="flex items-center space-x-3 cursor-pointer flex-1 select-none pr-2"
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                          isChecked
                            ? 'bg-[#6351d8] border-[#6351d8] text-white scale-110 shadow-sm'
                            : 'bg-white border-slate-300 group-hover/item:border-indigo-400'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] animate-fade-in" />}
                      </div>
                      <span className={`text-xs font-bold transition-all ${isChecked ? 'line-through opacity-70 text-indigo-900' : ''}`}>
                        {sec.title}
                      </span>
                    </div>

                    <button
                      onClick={() => onAskTutor(`Explain the topic "${sec.title}" in simple terms with an example.`)}
                      className="text-[11px] font-bold text-[#6351d8] hover:text-[#5240c4] font-mono hover:underline shrink-0 flex items-center space-x-0.5 opacity-80 group-hover/item:opacity-100"
                    >
                      <span>Ask Tutor</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Animated Gradient Progress Meter */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Chapter Mastery Progress</span>
              </span>
              <span className="font-mono text-[#6351d8] font-black">{progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-[#1c1243] via-[#6351d8] to-[#ffb800] transition-all duration-500 rounded-full shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 3. 4 Revision Pillar Cards with Micro-Interactions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-[#6351d8]" />
          <h3 className="text-base font-black text-slate-900">
            Core Revision Roadmap & High-Yield Pillars
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Problem & Big Picture */}
          <div
            onClick={() => onAskTutor(`Explain the foundational problem and motivation in "${paper.title}" in simple terms.`)}
            className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 to-amber-100/30 border border-amber-200/90 hover:border-amber-400 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all duration-200 hover:-translate-y-1.5 space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 font-mono">
                1. Big Picture
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-xs font-black text-slate-900">Why are we studying this?</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-3">
              {summary.problem_statement || 'Identifies core computational bottlenecks and foundational concepts.'}
            </p>
            <span className="text-[10px] font-bold text-amber-700 font-mono block pt-1">
              Click to clarify with Tutor →
            </span>
          </div>

          {/* 2. Core Method */}
          <div
            onClick={() => onAskTutor(`Break down the core methodology and mechanism in "${paper.title}" step by step.`)}
            className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 border border-indigo-200/90 hover:border-indigo-400 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all duration-200 hover:-translate-y-1.5 space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-300 font-mono">
                2. Core Solution
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-xs font-black text-slate-900">How does it work?</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-3">
              {summary.core_architecture || 'Modular deep architecture engineered for high-throughput representation.'}
            </p>
            <span className="text-[10px] font-bold text-indigo-700 font-mono block pt-1">
              Click to clarify with Tutor →
            </span>
          </div>

          {/* 3. Evidence */}
          <div
            onClick={() => onAskTutor(`What empirical evidence and benchmark results are demonstrated in "${paper.title}"?`)}
            className="p-6 rounded-3xl bg-gradient-to-br from-purple-50/80 to-purple-100/30 border border-purple-200/90 hover:border-purple-400 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all duration-200 hover:-translate-y-1.5 space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300 font-mono">
                3. Key Results
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-xs font-black text-slate-900">What does data prove?</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-3">
              {summary.datasets_and_metrics || 'Demonstrates superior empirical accuracy across benchmark datasets.'}
            </p>
            <span className="text-[10px] font-bold text-purple-700 font-mono block pt-1">
              Click to clarify with Tutor →
            </span>
          </div>

          {/* 4. Exam Traps */}
          <div
            onClick={() => onAskTutor(`What are common student misconceptions and exam traps for "${paper.title}"?`)}
            className="p-6 rounded-3xl bg-gradient-to-br from-orange-50/80 to-orange-100/30 border border-orange-200/90 hover:border-orange-400 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all duration-200 hover:-translate-y-1.5 space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-300 font-mono">
                4. Exam Watch-outs
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="text-xs font-black text-slate-900">What to avoid in tests?</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-3">
              {summary.critical_limitations || 'Requires high compute and sensitivity to hyperparameter scaling.'}
            </p>
            <span className="text-[10px] font-bold text-orange-700 font-mono block pt-1">
              Click to clarify with Tutor →
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
