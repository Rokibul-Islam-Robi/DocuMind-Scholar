import React from 'react';
import { 
  GraduationCap, 
  MessageSquareText, 
  BookOpenCheck, 
  FileSpreadsheet, 
  Layers, 
  GitFork, 
  Award, 
  UploadCloud, 
  KeyRound, 
  Sparkles,
  BookOpen,
  Zap
} from 'lucide-react';
import { StudentView, Paper } from '../../types';

interface StudentSidebarProps {
  currentView: StudentView;
  onViewChange: (view: StudentView) => void;
  activePaper: Paper | null;
  onOpenUpload: () => void;
  onOpenApiKey: () => void;
  totalDocsCount: number;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  currentView,
  onViewChange,
  activePaper,
  onOpenUpload,
  onOpenApiKey,
}) => {
  const navSections = [
    {
      group: 'STUDY TUTOR',
      items: [
        {
          id: 'tutor' as StudentView,
          label: 'AI Study Tutor & Q&A',
          icon: MessageSquareText,
          badge: 'Live',
          accent: 'from-[#1c1243] via-[#38207d] to-[#6351d8]',
          shadow: 'shadow-indigo-500/20',
        },
        {
          id: 'guide' as StudentView,
          label: 'Study Guide & Homework',
          icon: BookOpenCheck,
          badge: 'Guide',
          accent: 'from-[#241556] via-[#462d94] to-[#7b67d9]',
          shadow: 'shadow-purple-500/20',
        },
        {
          id: 'summary' as StudentView,
          label: 'Chapter Notes & Cheat-Sheet',
          icon: FileSpreadsheet,
          badge: 'Notes',
          accent: 'from-[#2a1769] via-[#5237ab] to-[#8874e3]',
          shadow: 'shadow-indigo-500/20',
        },
      ],
    },
    {
      group: 'ACTIVE RECALL',
      items: [
        {
          id: 'flashcards' as StudentView,
          label: '3D Anki Flashcards',
          icon: Layers,
          badge: 'Anki',
          accent: 'from-[#d97706] via-[#f59e0b] to-[#fbbf24]',
          shadow: 'shadow-amber-500/20',
        },
        {
          id: 'flow' as StudentView,
          label: 'Visual Concept Flow',
          icon: GitFork,
          badge: 'Flow',
          accent: 'from-[#1e1346] via-[#3e2689] to-[#6f56dc]',
          shadow: 'shadow-indigo-500/20',
        },
        {
          id: 'quiz' as StudentView,
          label: 'Mock Exam & Viva Quiz',
          icon: Award,
          badge: 'Quiz',
          accent: 'from-[#241556] via-[#4e2c8d] to-[#ff593b]',
          shadow: 'shadow-orange-500/20',
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
            <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#1c1243] via-[#38207d] to-[#6351d8] text-white shadow-sm font-bold">
              <GraduationCap className="w-4.5 h-4.5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-1.5 ring-white animate-pulse" />
            </div>
          </div>

          <div className="min-w-0">
            <h1 className="text-xs font-black text-slate-900 tracking-tight truncate">
              DocuMind <span className="bg-gradient-to-r from-[#241556] via-[#6351d8] to-[#917fe8] bg-clip-text text-transparent">Scholar</span>
            </h1>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider bg-indigo-50 text-[#5442be] font-mono border border-indigo-200">
                STUDENT
              </span>
              <span className="text-[9px] text-slate-400 font-bold">Study Portal</span>
            </div>
          </div>
        </div>

        {/* Compact Navigation Section Cards */}
        <div className="p-2.5 space-y-4 overflow-y-auto max-h-[calc(100vh-230px)] scrollbar-none">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-2 text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-[#6351d8]" />
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
                          : 'bg-slate-50/50 hover:bg-white text-slate-600 hover:text-slate-900 border-slate-200/50 hover:border-indigo-200/80 hover:shadow-2xs hover:translate-x-0.5'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0 pr-1">
                        <div
                          className={`p-1.5 rounded-lg transition-all ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-white text-slate-500 border border-slate-200 group-hover:text-[#6351d8] group-hover:border-indigo-300'
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
                              : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-[#5442be]'
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
        
        {/* Active Document Card */}
        {activePaper && (
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs group">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-wider font-extrabold mb-0.5">
              <span className="flex items-center space-x-1 text-[#6351d8]">
                <BookOpen className="w-3 h-3" />
                <span>Active Notes</span>
              </span>
              <span className="px-1 py-0.2 rounded bg-indigo-50 text-[#5442be] font-bold border border-indigo-200 text-[8px]">
                {activePaper.file_type?.toUpperCase() || 'PDF'}
              </span>
            </div>
            
            <p className="text-[11px] font-black text-slate-900 truncate" title={activePaper.title}>
              {activePaper.title}
            </p>

            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 text-[9px] text-slate-400 font-bold">
              <span>{activePaper.total_pages || 1} Pages</span>
              <span className="flex items-center space-x-1 text-emerald-600">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ready</span>
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenUpload}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl font-black text-[11px] text-[#1a1038] bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] hover:from-[#f5a623] hover:to-[#d98207] shadow-sm transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Notes</span>
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
