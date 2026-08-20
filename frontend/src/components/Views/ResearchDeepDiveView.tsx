import React, { useState } from 'react';
import { 
  FileText, 
  Bot, 
  Send, 
  Sparkles, 
  Layers, 
  Sigma, 
  Compass, 
  BookOpen, 
  Copy, 
  Check, 
  RotateCcw, 
  Loader2, 
  ExternalLink,
  Target,
  Cpu,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Microscope
} from 'lucide-react';
import { Paper, ChatMessage, Citation, EquationItem, ModelEngine } from '../../types';
import { PDFViewer } from '../ResearchHub/PDFViewer';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface ResearchDeepDiveViewProps {
  paper: Paper;
  selectedEngine: ModelEngine;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, actionType?: string, selectedText?: string) => void;
  isStreaming: boolean;
  onClearHistory: () => void;
}

export const ResearchDeepDiveView: React.FC<ResearchDeepDiveViewProps> = ({
  paper,
  selectedEngine,
  chatHistory,
  onSendMessage,
  isStreaming,
  onClearHistory,
}) => {
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAskTopic = (topicTitle: string, context: string) => {
    onSendMessage(`Provide an in-depth analytical breakdown of the "${topicTitle}" in this paper: ${context}`);
  };

  const handleAskSelectedText = (text: string) => {
    onSendMessage(`Please analyze and contextualize this specific excerpt from the research paper:\n\n"${text}"`, undefined, text);
  };

  const handleExplainEquation = (eq: EquationItem) => {
    onSendMessage(
      `Provide a comprehensive variable breakdown and theoretical derivation for the mathematical formulation:\n\n${eq.latex}\n\nContext description: ${eq.description}`,
      'explain_formula'
    );
  };

  const handleCitationClick = (cit: Citation) => {
    setActiveCitation(cit);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const summary = paper.summary_cards || {
    problem_statement: '',
    core_architecture: '',
    datasets_and_metrics: '',
    critical_limitations: '',
  };

  const actionChips = [
    {
      id: 'deconstruct_methodology',
      label: '🔬 Deconstruct Methodology',
      color: 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
    },
    {
      id: 'explain_formula',
      label: '📐 Explain LaTeX Formula',
      color: 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border-indigo-200',
    },
    {
      id: 'find_gaps',
      label: '🔍 Find Research Gaps & Novelty',
      color: 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200',
    },
    {
      id: 'generate_bibtex',
      label: '📚 Generate BibTeX / APA',
      color: 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border-cyan-200',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* 4 Overview Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Problem Statement */}
        <div
          onClick={() => handleAskTopic('Problem Statement', summary.problem_statement)}
          className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400/80 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Problem Statement</h4>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 group-hover:text-slate-900 font-medium">
              {summary.problem_statement || 'Investigates core computational constraints and representation bottlenecks.'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Click to deep-dive</span>
            <span className="font-mono text-amber-600 font-bold">Inspect →</span>
          </div>
        </div>

        {/* 2. Core Architecture */}
        <div
          onClick={() => handleAskTopic('Core Architecture', summary.core_architecture)}
          className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400/80 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Core Architecture</h4>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 group-hover:text-slate-900 font-medium">
              {summary.core_architecture || 'Modular deep architecture engineered for high-throughput representation.'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Click to deep-dive</span>
            <span className="font-mono text-emerald-600 font-bold">Inspect →</span>
          </div>
        </div>

        {/* 3. Key Metrics */}
        <div
          onClick={() => handleAskTopic('Datasets & Metrics', summary.datasets_and_metrics)}
          className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-cyan-400/80 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Datasets & Metrics</h4>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 group-hover:text-slate-900 font-medium">
              {summary.datasets_and_metrics || 'Demonstrates superior empirical accuracy on benchmark datasets.'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Click to deep-dive</span>
            <span className="font-mono text-cyan-600 font-bold">Inspect →</span>
          </div>
        </div>

        {/* 4. Critical Limitations */}
        <div
          onClick={() => handleAskTopic('Critical Limitations', summary.critical_limitations)}
          className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-rose-400/80 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Critical Limitations</h4>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 group-hover:text-slate-900 font-medium">
              {summary.critical_limitations || 'Requires high compute during training and sensitivity to out-of-domain shift.'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Click to deep-dive</span>
            <span className="font-mono text-rose-600 font-bold">Inspect →</span>
          </div>
        </div>
      </div>

      {/* Main Split Section: Left Reader & Right Research Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Card: Document Reader */}
        <div className="h-[750px] rounded-3xl overflow-hidden shadow-soft-xl border border-slate-200/90 bg-white">
          <PDFViewer
            paper={paper}
            activeCitation={activeCitation}
            onAskSelectedText={handleAskSelectedText}
            onExplainEquation={handleExplainEquation}
          />
        </div>

        {/* Right Card: Multi-Agent AI Terminal */}
        <div className="h-[750px] flex flex-col rounded-3xl overflow-hidden shadow-soft-xl border border-slate-200/90 bg-white">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <span>Research Copilot Terminal</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Engine: <span className="text-emerald-700 font-mono font-bold">{selectedEngine}</span> • Coordinate Citation Linking
                </p>
              </div>
            </div>

            <button
              onClick={onClearHistory}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm font-medium"
              title="Clear conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center space-x-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
              Actions:
            </span>
            {actionChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => onSendMessage(chip.label, chip.id)}
                disabled={isStreaming}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap disabled:opacity-50 shadow-sm ${chip.color}`}
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Chat History & Output */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/40">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-md">
                  <Sparkles className="w-10 h-10 animate-pulse" />
                </div>
                <div className="max-w-md space-y-2">
                  <h4 className="text-base font-black text-slate-900">
                    DocuMind Scholar Copilot Ready
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Click any action chip above, highlight text inside the paper on the left, or type a research query below.
                  </p>
                </div>
              </div>
            ) : (
              chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-2 animate-fade-in ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[94%] rounded-3xl px-5 py-4 text-xs leading-relaxed shadow-soft-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-br-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between space-x-4 mb-2 pb-1.5 border-b border-slate-100 text-[10px] text-slate-400">
                      <span className="font-bold flex items-center space-x-1">
                        {msg.sender === 'user' ? (
                          <span className="text-white">Scholar Query</span>
                        ) : (
                          <span className="text-emerald-700 flex items-center space-x-1">
                            <Bot className="w-3.5 h-3.5" />
                            <span>Research Copilot</span>
                          </span>
                        )}
                      </span>

                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{msg.timestamp}</span>
                        {msg.sender === 'agent' && (
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Body with KaTeX */}
                    <div className="prose prose-slate max-w-none text-xs leading-relaxed">
                      <KaTeXRenderer content={msg.text} />
                    </div>

                    {/* Interactive Citation Pills */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                          <ExternalLink className="w-3 h-3 text-emerald-600" />
                          <span>Verified Citations (Click to jump):</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((cit, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleCitationClick(cit)}
                              className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-mono text-emerald-800 font-bold transition-all shadow-sm"
                            >
                              <span>Page {cit.page}</span>
                              <span className="text-slate-400">•</span>
                              <span className="capitalize">{cit.section}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isStreaming && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 p-2 animate-pulse font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Synthesizing academic response with verified equations...</span>
              </div>
            )}
          </div>

          {/* Form Input Box */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask deep research questions about "${paper.title}"...`}
                disabled={isStreaming}
                className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isStreaming}
                className="absolute right-2.5 p-2.5 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 rounded-xl transition-all shadow-md font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
};
