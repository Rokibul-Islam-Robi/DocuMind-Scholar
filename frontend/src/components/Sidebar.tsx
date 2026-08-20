import React from 'react';
import { 
  GraduationCap, 
  Layers, 
  Sigma, 
  Table2, 
  BookOpen, 
  Workflow, 
  Award, 
  UploadCloud, 
  Sparkles, 
  FileText,
  KeyRound,
  ChevronRight,
  Database
} from 'lucide-react';
import { WorkspaceView, Paper } from '../types';

interface SidebarProps {
  currentView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  activePaper: Paper | null;
  onOpenUpload: () => void;
  onOpenApiKey: () => void;
  totalPapersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  activePaper,
  onOpenUpload,
  onOpenApiKey,
  totalPapersCount,
}) => {
  const navSections = [
    {
      group: 'RESEARCH WORKSPACE',
      items: [
        {
          id: 'research' as WorkspaceView,
          label: 'Research Deep-Dive',
          icon: Layers,
          badge: 'Live AI',
          gradient: 'from-emerald-500 to-teal-600',
          activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25',
        },
        {
          id: 'formula' as WorkspaceView,
          label: 'LaTeX & Math Decoder',
          icon: Sigma,
          badge: 'KaTeX',
          gradient: 'from-indigo-500 to-purple-600',
          activeBg: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25',
        },
      ],
    },
    {
      group: 'SYNTHESIS & COMPARISON',
      items: [
        {
          id: 'matrix' as WorkspaceView,
          label: 'Literature Matrix',
          icon: Table2,
          badge: `${totalPapersCount} Papers`,
          gradient: 'from-cyan-500 to-blue-600',
          activeBg: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25',
        },
      ],
    },
    {
      group: 'ACTIVE STUDY STUDIO',
      items: [
        {
          id: 'flashcards' as WorkspaceView,
          label: 'AI Flashcard Deck',
          icon: BookOpen,
          badge: 'Anki 3D',
          gradient: 'from-amber-500 to-orange-600',
          activeBg: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25',
        },
        {
          id: 'flow' as WorkspaceView,
          label: 'Concept Pipeline Flow',
          icon: Workflow,
          badge: 'Visual',
          gradient: 'from-purple-500 to-pink-600',
          activeBg: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25',
        },
        {
          id: 'quiz' as WorkspaceView,
          label: 'Academic Viva & Quiz',
          icon: Award,
          badge: 'Scored',
          gradient: 'from-rose-500 to-red-600',
          activeBg: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/25',
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 text-slate-950 shadow-xl shadow-emerald-500/20 font-bold">
            <GraduationCap className="w-6 h-6 text-slate-950" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">
                DocuMind <span className="text-emerald-400">Scholar</span>
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 rounded-md">
                v2.0 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Academic Research Platform</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {sec.group}
              </h3>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                        isActive
                          ? item.activeBg
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-1.5 rounded-xl transition-all ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-all ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Document Status Card & Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
        {/* Active Paper Mini-Pill */}
        {activePaper && (
          <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/60 space-y-1.5 shadow-md">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase text-slate-400">
              <span className="flex items-center space-x-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Active Document</span>
              </span>
              <span className="font-mono text-emerald-400 uppercase">{activePaper.file_type || 'PDF'}</span>
            </div>
            <p className="text-xs font-semibold text-white truncate" title={activePaper.title}>
              {activePaper.title}
            </p>
            <p className="text-[10px] text-slate-400">
              {activePaper.total_pages || 1} Pages • {activePaper.year || '2024'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenUpload}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={onOpenApiKey}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-400/50 transition-all shadow-md"
            title="Configure LLM API Keys"
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
