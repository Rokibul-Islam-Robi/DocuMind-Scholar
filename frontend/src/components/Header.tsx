import React from 'react';
import { 
  GraduationCap, 
  Layers, 
  Table2, 
  Sparkles, 
  UploadCloud, 
  KeyRound, 
  ChevronDown, 
  Cpu,
  FileText,
  BookOpen
} from 'lucide-react';
import { ModelEngine, WorkspaceMode, Paper } from '../types';

interface HeaderProps {
  currentMode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  selectedEngine: ModelEngine;
  onEngineChange: (engine: ModelEngine) => void;
  papers: Paper[];
  activePaper: Paper | null;
  onSelectPaper: (paper: Paper) => void;
  onOpenUpload: () => void;
  onOpenApiKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  selectedEngine,
  onEngineChange,
  papers,
  activePaper,
  onSelectPaper,
  onOpenUpload,
  onOpenApiKey,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface-elevated/90 backdrop-blur-md px-4 py-2.5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 max-w-[1920px] mx-auto">
        
        {/* Brand & Active Paper */}
        <div className="flex items-center space-x-4 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-research to-study text-zinc-950 shadow-lg shadow-research/20 font-bold">
              <GraduationCap className="w-5 h-5 text-zinc-950" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-surface-elevated animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-tight text-zinc-100 font-sans">
                  DocuMind <span className="text-research">Scholar</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 rounded-md">
                  v2.0 Academic AI
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">AI Research Copilot & Literature Synthesis</p>
            </div>
          </div>

          {/* Active Paper Quick Selector */}
          <div className="relative group">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-surface border border-surface-border hover:border-zinc-500 rounded-xl cursor-pointer transition-all">
              <FileText className="w-3.5 h-3.5 text-research shrink-0" />
              <span className="text-xs font-medium text-zinc-200 max-w-[180px] sm:max-w-[240px] truncate">
                {activePaper ? activePaper.title : 'Select Paper...'}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </div>

            {/* Dropdown menu */}
            <div className="absolute left-0 mt-1.5 w-80 bg-surface-elevated border border-surface-border rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50 animate-fade-in">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 border-b border-surface-border mb-1">
                Indexed Research Papers ({papers.length})
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {papers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPaper(p)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      activePaper?.id === p.id
                        ? 'bg-research/15 text-research-light font-medium'
                        : 'text-zinc-300 hover:bg-surface'
                    }`}
                  >
                    <span className="truncate pr-2">{p.title}</span>
                    <span className="text-[10px] text-zinc-500 shrink-0">{p.year}</span>
                  </button>
                ))}
              </div>
              <div className="pt-1.5 border-t border-surface-border mt-1">
                <button
                  onClick={onOpenUpload}
                  className="w-full flex items-center justify-center space-x-1.5 px-2.5 py-1.5 text-xs text-research hover:bg-research/10 rounded-lg transition-colors font-medium"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload More Papers</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-surface rounded-xl border border-surface-border">
          <button
            onClick={() => onModeChange('research')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentMode === 'research'
                ? 'bg-zinc-800 text-research-light shadow-sm border border-research/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-elevated'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-research" />
            <span>Research Deep-Dive</span>
          </button>

          <button
            onClick={() => onModeChange('matrix')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentMode === 'matrix'
                ? 'bg-zinc-800 text-emerald-300 shadow-sm border border-emerald-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-elevated'
            }`}
          >
            <Table2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Literature Matrix</span>
          </button>

          <button
            onClick={() => onModeChange('study')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentMode === 'study'
                ? 'bg-zinc-800 text-study-light shadow-sm border border-study/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-elevated'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-study" />
            <span>Study Studio</span>
          </button>
        </div>

        {/* Engine Selector & Action Buttons */}
        <div className="flex items-center space-x-2.5">
          {/* LLM Engine Dropdown */}
          <div className="relative flex items-center space-x-1.5 px-3 py-1.5 bg-surface border border-surface-border rounded-xl">
            <Cpu className="w-3.5 h-3.5 text-research" />
            <select
              value={selectedEngine}
              onChange={(e) => onEngineChange(e.target.value as ModelEngine)}
              className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer pr-2"
            >
              <option value="gemini-1.5-flash" className="bg-surface-elevated text-zinc-200">
                Gemini 1.5 Flash (Fast)
              </option>
              <option value="groq-llama-3" className="bg-surface-elevated text-zinc-200">
                Groq Llama-3 (Instant)
              </option>
              <option value="gemini-1.5-pro" className="bg-surface-elevated text-zinc-200">
                Gemini 1.5 Pro (Deep Context)
              </option>
            </select>
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-200 bg-surface border border-surface-border hover:border-research/50 hover:bg-surface/80 rounded-xl transition-all"
            title="Upload research papers (PDF)"
          >
            <UploadCloud className="w-3.5 h-3.5 text-research" />
            <span className="hidden sm:inline">Upload Paper</span>
          </button>

          {/* API Keys Button */}
          <button
            onClick={onOpenApiKey}
            className="p-2 text-zinc-400 hover:text-zinc-200 bg-surface border border-surface-border hover:border-zinc-500 rounded-xl transition-all"
            title="Configure LLM API Keys"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </header>
  );
};
