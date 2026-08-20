import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  ListOrdered, 
  HelpCircle, 
  BookOpen, 
  Copy, 
  Check, 
  RotateCcw, 
  Loader2, 
  GraduationCap, 
  Target, 
  Compass,
  ArrowRight,
  BookMarked
} from 'lucide-react';
import { Paper, ChatMessage, Citation, ModelEngine } from '../../types';
import { PDFViewer } from '../ResearchHub/PDFViewer';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface StudentTutorViewProps {
  paper: Paper;
  selectedEngine: ModelEngine;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, actionType?: string, selectedText?: string) => void;
  isStreaming: boolean;
  onClearHistory: () => void;
}

export const StudentTutorView: React.FC<StudentTutorViewProps> = ({
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

  const handleAskSelectedText = (text: string) => {
    onSendMessage(`Explain this textbook concept in simple, easy-to-understand terms for a student:\n\n"${text}"`, undefined, text);
  };

  const handleExplainEquation = (eq: any) => {
    onSendMessage(
      `Please explain this formula step-by-step in simple language with an intuitive real-world example:\n\n${eq.latex}\n\nContext: ${eq.description}`,
      'explain_formula'
    );
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

  const studentActionChips = [
    {
      id: 'eli5_explain',
      label: "💡 Explain Like I'm 5 (ELI5)",
      prompt: `Explain the core topic of "${paper.title}" in extremely simple, intuitive terms with relatable real-world analogies.`,
      color: 'bg-amber-50 text-amber-900 hover:bg-amber-100 border-amber-200',
    },
    {
      id: 'chapter_bullets',
      label: '📝 5-Bullet Chapter Summary',
      prompt: `Summarize the most important 5 key concepts from "${paper.title}" that are guaranteed to appear on exams.`,
      color: 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border-indigo-200',
    },
    {
      id: 'solve_exercise',
      label: '🧩 Step-by-Step Problem Solver',
      prompt: `Provide a step-by-step numerical example and conceptual solution for the main problem addressed in "${paper.title}".`,
      color: 'bg-purple-50 text-purple-900 hover:bg-purple-100 border-purple-200',
    },
    {
      id: 'exam_questions',
      label: '🎯 High-Yield Exam Questions',
      prompt: `Generate 3 potential exam questions based on "${paper.title}" along with model answers and scoring tips.`,
      color: 'bg-orange-50 text-orange-900 hover:bg-orange-100 border-orange-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      
      {/* Left Card: Clean Light Document Reader */}
      <div className="h-[750px] rounded-3xl overflow-hidden shadow-soft-xl border border-slate-200/90 bg-white">
        <PDFViewer
          paper={paper}
          activeCitation={activeCitation}
          onAskSelectedText={handleAskSelectedText}
          onExplainEquation={handleExplainEquation}
        />
      </div>

      {/* Right Card: AI Study Tutor Terminal */}
      <div className="h-[750px] flex flex-col rounded-3xl overflow-hidden shadow-soft-xl border border-slate-200/90 bg-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-indigo-50 text-[#6351d8] shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <span>AI Study Tutor & Homework Helper</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-500">
                Engine: <span className="text-[#6351d8] font-mono font-bold">{selectedEngine}</span> • Instant Student Guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm font-medium"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Action Chips Bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
            Study Modes:
          </span>
          {studentActionChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => onSendMessage(chip.prompt, chip.id)}
              disabled={isStreaming}
              className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all whitespace-nowrap disabled:opacity-50 shadow-sm ${chip.color}`}
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/40">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-200 text-[#6351d8] shadow-md">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <div className="max-w-md space-y-2">
                <h4 className="text-base font-black text-slate-900">
                  Ready to Learn with AI Tutor
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Click any study button above (like <strong className="text-[#6351d8]">ELI5</strong> or <strong className="text-[#6351d8]">5-Bullet Summary</strong>), or select text inside your textbook on the left to ask for a simple breakdown.
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
                      ? 'bg-gradient-to-r from-[#1c1243] via-[#38207d] to-[#6351d8] text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {/* Header */}
                  <div className={`flex items-center justify-between space-x-4 mb-2 pb-1.5 border-b text-[10px] ${
                    msg.sender === 'user' ? 'border-white/20 text-indigo-200' : 'border-slate-100 text-slate-400'
                  }`}>
                    <span className="font-bold flex items-center space-x-1">
                      {msg.sender === 'user' ? (
                        <span className="text-amber-300 font-black">Student Question</span>
                      ) : (
                        <span className="text-[#6351d8] font-black flex items-center space-x-1">
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Study Tutor</span>
                        </span>
                      )}
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{msg.timestamp}</span>
                      {msg.sender === 'agent' && (
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="text-slate-400 hover:text-slate-700 transition-colors"
                          title="Copy answer"
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

                  {/* Body */}
                  {msg.sender === 'user' ? (
                    <div className="text-white text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap select-text">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-800">
                      <KaTeXRenderer content={msg.text} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isStreaming && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 p-2 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-[#6351d8]" />
              <span>AI Tutor is preparing simple step-by-step notes...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask anything about "${paper.title}" (e.g. "Explain formula on page 2")...`}
              disabled={isStreaming}
              className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-slate-200 focus:border-[#6351d8] rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isStreaming}
              className="absolute right-2.5 p-2.5 text-[#1a1038] bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] hover:from-[#f5a623] hover:to-[#d98207] disabled:opacity-40 rounded-xl transition-all shadow-md font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
