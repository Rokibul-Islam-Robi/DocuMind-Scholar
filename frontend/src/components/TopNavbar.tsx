import React from 'react';
import { 
  FileText, 
  ChevronDown, 
  Cpu, 
  UploadCloud, 
  KeyRound, 
  GraduationCap, 
  Microscope,
  Sparkles
} from 'lucide-react';
import { ModelEngine, Paper, WorkspaceDomain } from '../types';

interface TopNavbarProps {
  currentDomain: WorkspaceDomain;
  onDomainChange: (domain: WorkspaceDomain) => void;
  papers: Paper[];
  activePaper: Paper | null;
  onSelectPaper: (paper: Paper) => void;
  selectedEngine: ModelEngine;
  onEngineChange: (engine: ModelEngine) => void;
  onOpenUpload: () => void;
  onOpenApiKey: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentDomain,
  onDomainChange,
  papers,
  activePaper,
  onSelectPaper,
  selectedEngine,
  onEngineChange,
  onOpenUpload,
  onOpenApiKey,
}) => {
  const isStudent = currentDomain === 'student';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/90 px-6 sm:px-8 py-3.5 sm:py-4 shadow-soft-sm transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 max-w-[1920px] mx-auto">
        
        {/* Left: Role / Domain Switcher & Active Document Dropdown */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto justify-between md:justify-start flex-wrap sm:flex-nowrap gap-2">
          
          {/* Role / Domain Switcher Pill */}
          <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              onClick={() => onDomainChange('student')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                isStudent
                  ? 'bg-gradient-to-r from-[#1c1243] via-[#38207d] to-[#6351d8] text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${isStudent ? 'text-amber-300 animate-bounce' : 'text-slate-500'}`} style={{ animationDuration: '3s' }} />
              <span>Student Study Hub</span>
            </button>

            <button
              onClick={() => onDomainChange('researcher')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                !isStudent
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-md shadow-emerald-500/25 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Microscope className={`w-4 h-4 ${!isStudent ? 'text-teal-200 animate-bounce' : 'text-slate-500'}`} style={{ animationDuration: '3s' }} />
              <span>Researcher Workspace</span>
            </button>
          </div>

          {/* Active Document Selector Dropdown Card */}
          <div className="relative group">
            <div className={`flex items-center space-x-2.5 px-4 py-2.5 bg-white hover:bg-slate-50/80 border rounded-2xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
              isStudent ? 'border-slate-200 hover:border-indigo-300 ring-1 ring-slate-100' : 'border-slate-200 hover:border-emerald-300 ring-1 ring-slate-100'
            }`}>
              <div className={`p-1.5 rounded-xl transition-transform group-hover:scale-110 ${
                isStudent ? 'bg-indigo-50 text-[#6351d8]' : 'bg-emerald-100 text-emerald-700'
              }`}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-black text-slate-900 max-w-[140px] sm:max-w-[220px] md:max-w-[260px] truncate">
                    {activePaper ? activePaper.title : (isStudent ? 'Select Notes / Book...' : 'Select Paper...')}
                  </span>
                  {activePaper?.file_type && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      {activePaper.file_type}
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform duration-300 group-hover:rotate-180" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute left-0 mt-2 w-84 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-2.5 hidden group-hover:block z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1.5 flex items-center justify-between">
                <span>{isStudent ? 'Available Course Materials' : 'Available Research Papers'} ({papers.length})</span>
                <span className="text-slate-500 font-mono text-[9px]">SQLite Active</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-none">
                {papers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPaper(p)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs transition-all flex items-center justify-between ${
                      activePaper?.id === p.id
                        ? isStudent
                          ? 'bg-indigo-50 text-[#5442be] font-bold border border-indigo-200 shadow-2xs'
                          : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2 font-bold">{p.title}</span>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold shrink-0">
                      {p.file_type || 'PDF'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Engine Selector, Upload CTA & API Key */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          
          {/* LLM Engine Dropdown */}
          <div className="flex items-center space-x-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-colors">
            <div className={`p-1 rounded-lg ${isStudent ? 'bg-indigo-50 text-[#6351d8]' : 'bg-emerald-50 text-emerald-600'}`}>
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedEngine}
              onChange={(e) => onEngineChange(e.target.value as ModelEngine)}
              className="bg-transparent text-xs font-black text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
              <option value="groq-llama-3">Groq Llama-3 (Instant)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Context)</option>
            </select>
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className={`flex items-center space-x-1.5 px-4.5 sm:px-5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all duration-300 hover:scale-103 ${
              isStudent
                ? 'bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] hover:from-[#f5a623] hover:to-[#d98207] text-[#1a1038] shadow-amber-500/25'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25 text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{isStudent ? 'Upload Notes' : 'Upload Paper'}</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKey}
            className="p-2.5 sm:p-3 rounded-2xl bg-white hover:bg-slate-50 text-amber-500 border border-slate-200 hover:border-amber-300 transition-all shadow-sm hover:scale-105"
            title="Configure LLM API Keys"
          >
            <KeyRound className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
