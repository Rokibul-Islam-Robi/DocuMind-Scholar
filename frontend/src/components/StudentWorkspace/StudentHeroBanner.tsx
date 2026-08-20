import React from 'react';
import { Sparkles, BookOpen, GraduationCap, Flame, Star, Lightbulb, ArrowRight } from 'lucide-react';
import { StudentView, Paper } from '../../types';

interface StudentHeroBannerProps {
  currentView: StudentView;
  activePaper: Paper | null;
  samplePapers: Paper[];
  onSelectPaper: (paper: Paper) => void;
}

export const StudentHeroBanner: React.FC<StudentHeroBannerProps> = ({
  currentView,
  activePaper,
  samplePapers,
  onSelectPaper,
}) => {
  const getBannerText = () => {
    switch (currentView) {
      case 'tutor':
        return {
          badge: '24/7 AI ACADEMIC TUTOR & HOMEWORK HELPER',
          title: 'Interactive Study Tutor & Q&A Assistant',
          subtitle: 'Ask questions, get simple step-by-step explanations (ELI5), and solve exercise problems.',
          accentGradient: 'from-[#1c1243] via-[#38207d] to-[#6351d8]',
        };
      case 'guide':
        return {
          badge: 'ROADMAPS & ASSIGNMENT GUIDANCE',
          title: 'Comprehensive Study Guide & Assignment Solver',
          subtitle: 'Structured chapter roadmaps, homework guidance, formula cheat-sheets, and checklists.',
          accentGradient: 'from-[#241556] via-[#462d94] to-[#7b67d9]',
        };
      case 'summary':
        return {
          badge: 'CHAPTER CHEAT-SHEETS & REVISION NOTES',
          title: 'Quick Revision Notes & Formula Cheat-Sheets',
          subtitle: 'Instant key takeaways, summary bullet points, and core definitions for rapid exam preparation.',
          accentGradient: 'from-[#2a1769] via-[#5237ab] to-[#8874e3]',
        };
      case 'flashcards':
        return {
          badge: '3D ANKI FLASHCARD MASTERY',
          title: 'Active Recall Flashcards & Spaced Repetition',
          subtitle: 'Test yourself with KaTeX-powered flip cards. Rate difficulty (Easy, Good, Hard) to schedule memory intervals.',
          accentGradient: 'from-[#1c1243] via-[#3e2689] to-[#d97706]',
        };
      case 'flow':
        return {
          badge: 'INTERACTIVE VISUAL PIPELINES',
          title: 'Visual Concept & Algorithm Pipeline Graphs',
          subtitle: 'Step-by-step interactive visual architecture workflows for complex textbook topics.',
          accentGradient: 'from-[#1e1346] via-[#3e2689] to-[#6f56dc]',
        };
      case 'quiz':
        return {
          badge: 'VIVA VOCE & MOCK EXAM SIMULATOR',
          title: 'Smart Mock Exam & Conceptual Viva Simulator',
          subtitle: 'Multiple-choice viva questions with instant grading, detailed AI rationale, and celebratory scorecards.',
          accentGradient: 'from-[#241556] via-[#4e2c8d] to-[#ff593b]',
        };
      default:
        return {
          badge: 'STUDENT ACADEMIC LEARNING PLATFORM',
          title: 'DocuMind Scholar Student Study Hub',
          subtitle: 'Your personal AI study companion for textbooks, lecture slides, assignments, and exam preparation.',
          accentGradient: 'from-[#1c1243] via-[#3a2280] to-[#6852b7]',
        };
    }
  };

  const info = getBannerText();

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-soft-md p-4 sm:p-5 mb-5 text-white select-none transition-all duration-300">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${info.accentGradient} opacity-95`} />
      
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 max-w-full">
        
        {/* Left Info */}
        <div className="text-left space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[9px] font-black uppercase tracking-widest text-white shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{info.badge}</span>
          </div>

          <h2 className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-white drop-shadow-sm">
            {info.title}
          </h2>

          <p className="text-xs text-white/90 font-medium max-w-2xl leading-snug drop-shadow-2xs">
            {info.subtitle}
          </p>
        </div>

        {/* Right Course Presets Bar */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 justify-end">
          {samplePapers.slice(0, 3).map((p) => {
            const isSelected = activePaper?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPaper(p)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border backdrop-blur-md ${
                  isSelected
                    ? 'bg-white text-slate-900 border-white shadow-md scale-102'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{p.title}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
