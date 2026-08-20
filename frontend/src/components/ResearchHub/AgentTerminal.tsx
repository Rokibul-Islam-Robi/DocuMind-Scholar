import React, { useState, useRef, useEffect } from 'react';
import { 
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
  Cpu
} from 'lucide-react';
import { Paper, ChatMessage, Citation, ModelEngine } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface AgentTerminalProps {
  paper: Paper;
  selectedEngine: ModelEngine;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, actionType?: string) => void;
  isStreaming: boolean;
  onCitationClick: (citation: Citation) => void;
  onClearHistory: () => void;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  paper,
  selectedEngine,
  chatHistory,
  onSendMessage,
  isStreaming,
  onCitationClick,
  onClearHistory,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const actionChips = [
    {
      id: 'deconstruct_methodology',
      label: 'Deconstruct Methodology',
      icon: Layers,
      color: 'text-research hover:bg-research/10 border-research/30',
    },
    {
      id: 'explain_formula',
      label: 'Explain LaTeX Formula',
      icon: Sigma,
      color: 'text-indigo-400 hover:bg-indigo-500/10 border-indigo-500/30',
    },
    {
      id: 'find_gaps',
      label: 'Find Research Gaps & Novelty',
      icon: Compass,
      color: 'text-amber-400 hover:bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'generate_bibtex',
      label: 'Generate BibTeX / APA',
      icon: BookOpen,
      color: 'text-cyan-400 hover:bg-cyan-500/10 border-cyan-500/30',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-surface-elevated border border-surface-border rounded-2xl overflow-hidden shadow-xl">
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-research/15 text-research border border-research/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-100 flex items-center space-x-2">
              <span>Multi-Agent Research Terminal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-zinc-400 flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-zinc-500" />
              <span>Engine: {selectedEngine}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="flex items-center space-x-1 px-2.5 py-1 text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-surface rounded-lg transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Action Chips Bar */}
      <div className="flex items-center space-x-2 px-4 py-2 border-b border-surface-border bg-surface/30 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 shrink-0">
          Agent Actions:
        </span>
        {actionChips.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              onClick={() => onSendMessage(chip.label, chip.id)}
              disabled={isStreaming}
              className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium bg-surface border rounded-lg transition-all whitespace-nowrap disabled:opacity-50 ${chip.color}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-research/5 border border-research/20 text-research">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-sm font-semibold text-zinc-200">
                DocuMind Scholar Research Copilot Active
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ask deep questions regarding <strong className="text-zinc-300">{paper.title}</strong>, click an action chip above, or select text in the PDF reader to trigger focused queries.
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
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-br-none'
                    : 'bg-surface text-zinc-200 border border-surface-border rounded-bl-none shadow-md'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between space-x-4 mb-2 pb-1.5 border-b border-zinc-700/40 text-[10px] text-zinc-400">
                  <div className="flex items-center space-x-1.5 font-semibold">
                    {msg.sender === 'user' ? (
                      <span>Scholar Query</span>
                    ) : (
                      <span className="text-research-light flex items-center space-x-1">
                        <Bot className="w-3 h-3 text-research" />
                        <span>Research Agent ({msg.model_used || selectedEngine})</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-zinc-500">{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-xs leading-relaxed">
                  <KaTeXRenderer content={msg.text} />
                </div>

                {/* Interactive Citations Bar */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-surface-border/80 space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3 text-research" />
                      <span>Verified Citations (Click to Jump):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cit, idx) => (
                        <button
                          key={idx}
                          onClick={() => onCitationClick(cit)}
                          className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-zinc-800/80 hover:bg-research/20 border border-surface-border hover:border-research/40 text-[10px] font-mono text-research-light transition-all"
                        >
                          <span>Page {cit.page}</span>
                          <span className="text-zinc-500">•</span>
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
          <div className="flex items-center space-x-2 text-xs text-zinc-400 p-2 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-research" />
            <span>Agent synthesizing academic response with LaTeX notation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-surface-border bg-surface/90">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask research questions about "${paper.title}"...`}
            disabled={isStreaming}
            className="w-full pl-4 pr-12 py-3 bg-surface-elevated border border-surface-border focus:border-research rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-research transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className="absolute right-2 p-2 text-zinc-950 bg-research hover:bg-research-hover disabled:opacity-40 rounded-lg transition-all shadow-md font-semibold"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

    </div>
  );
};
