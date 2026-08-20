import React from 'react';
import { 
  Microscope, 
  Layers, 
  Sigma, 
  Table2, 
  Compass, 
  FileCheck, 
  UploadCloud, 
  KeyRound, 
  Database,
  Sparkles,
  FileText
} from 'lucide-react';
import { ResearcherView, Paper } from '../../types';

interface ResearcherSidebarProps {
  currentView: ResearcherView;
  onViewChange: (view: ResearcherView) => void;
  activePaper: Paper | null;
  onOpenUpload: () => void;
  onOpenApiKey: () => void;
  totalPapersCount: number;
}

export const ResearcherSidebar: React.FC<ResearcherSidebarProps> = ({
  currentView,
  onViewChange,
  activePaper,
  onOpenUpload,
  onOpenApiKey,
  totalPapersCount,
}) => {
  const navSections = [
    {
      group: 'RESEARCH PIPELINE',
      items: [
        {
          id: 'deepdive' as ResearcherView,
          label: 'Paper Deep-Dive',
          icon: Layers,
          badge: 'Citation AI',
          accent: 'from-emerald-600 via-teal-600 to-indigo-700',
          shadow: 'shadow-emerald-500/20',
        },
        {
          id: 'formula' as ResearcherView,
          label: 'LaTeX & Math Decoder',
          icon: Sigma,
          badge: 'KaTeX',
          accent: 'from-indigo-600 to-purple-600',
          shadow: 'shadow-indigo-500/20',
        },
      ],
    },
    {
      group: 'SYNTHESIS & REVIEW',
      items: [
        {
          id: 'matrix' as ResearcherView,
          label: 'Literature Matrix',
          icon: Table2,
          badge: `${totalPapersCount} Papers`,
          accent: 'from-cyan-600 to-blue-600',
          shadow: 'shadow-cyan-500/20',
        },
        {
          id: 'gaps' as ResearcherView,
          label: 'Research Gaps & Novelty',
          icon: Compass,
          badge: 'Critical',
          accent: 'from-teal-600 to-emerald-700',
          shadow: 'shadow-teal-500/20',
        },
        {
          id: 'review' as ResearcherView,
          label: 'Peer-Review & Audit',
          icon: FileCheck,
          badge: 'NeurIPS',
          accent: 'from-emerald-700 to-teal-800',
          shadow: 'shadow-emerald-700/20',
        },
      ],
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20 shadow-soft-sm">
      
      {/* Brand Header */}
      <div>
        <div className="p-3.5 border-b border-slate-100/80 flex items-center space-x-2.5 bg-gradient-to-b from-slate-50/70 to-transparent">
          <div className="relative group cursor-pointer shrink-0">
            <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-sm font-bold">
              <Microscope className="w-4.5 h-4.5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1.5 ring-white animate-pulse" />
            </div>
          </div>

          <div className="min-w-0">
            <h1 className="text-xs font-black text-slate-900 tracking-tight truncate">
              DocuMind <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 bg-clip-text text-transparent">Scholar</span>
            </h1>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 font-mono border border-emerald-200">
                RESEARCHER
              </span>
              <span className="text-[9px] text-slate-400 font-bold">Scholar AI</span>
            </div>
          </div>
        </div>

        {/* Compact Navigation Section Cards */}
        <div className="p-2.5 space-y-4 overflow-y-auto max-h-[calc(100vh-230px)] scrollbar-none">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-2 text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600/70" />
                <span>{sec.group}</span>
              </h3>

              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 group border ${
                        isActive
                          ? `bg-gradient-to-r ${item.accent} text-white ${item.shadow} shadow-md border-transparent scale-[1.01]`
                          : 'bg-slate-50/50 hover:bg-white text-slate-600 hover:text-slate-900 border-slate-200/50 hover:border-emerald-200/80 hover:shadow-2xs hover:translate-x-0.5'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0 pr-1">
                        <div
                          className={`p-1.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-white text-slate-500 border border-slate-200 group-hover:text-emerald-600 group-hover:border-emerald-300'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                        </div>
                        <span className="truncate text-left">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full font-bold transition-all shrink-0 ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-800'
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

      {/* Bottom Floating Active Document Card & Upload Actions */}
      <div className="p-2.5 border-t border-slate-100 space-y-2 bg-gradient-to-t from-slate-50/80 to-transparent">
        
        {/* Active Paper Card */}
        {activePaper && (
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs group">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-wider font-extrabold mb-0.5">
              <span className="flex items-center space-x-1 text-emerald-600">
                <FileText className="w-3 h-3" />
                <span>Active Paper</span>
              </span>
              <span className="px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[8px]">
                {activePaper.file_type?.toUpperCase() || 'PDF'}
              </span>
            </div>
            
            <p className="text-[11px] font-black text-slate-900 truncate" title={activePaper.title}>
              {activePaper.title}
            </p>

            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 text-[9px] text-slate-400 font-bold">
              <span>{activePaper.total_pages || 1} Pages • {activePaper.year || '2024'}</span>
              <span className="flex items-center space-x-1 text-emerald-600">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span>Indexed</span>
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenUpload}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl font-black text-[11px] text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-700 hover:to-teal-700 shadow-sm transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Paper</span>
          </button>

          <button
            onClick={onOpenApiKey}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-amber-500 border border-slate-200 hover:border-amber-300 transition-all shadow-2xs"
            title="Configure LLM API Keys"
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </aside>
  );
};
