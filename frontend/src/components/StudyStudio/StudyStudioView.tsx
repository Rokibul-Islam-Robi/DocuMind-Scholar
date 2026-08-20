import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  Workflow, 
  Award, 
  Sparkles, 
  RotateCw,
  Loader2,
  FileText
} from 'lucide-react';
import { Paper, StudyDeck, StudySubTab, ModelEngine } from '../../types';
import { api } from '../../services/api';
import { FlashcardDeck } from './FlashcardDeck';
import { ConceptFlowVisualizer } from './ConceptFlowVisualizer';
import { QuizSimulator } from './QuizSimulator';

interface StudyStudioViewProps {
  paper: Paper;
  selectedEngine: ModelEngine;
}

export const StudyStudioView: React.FC<StudyStudioViewProps> = ({
  paper,
  selectedEngine,
}) => {
  const [activeTab, setActiveTab] = useState<StudySubTab>('flashcards');
  const [studyDeck, setStudyDeck] = useState<StudyDeck | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDeck = async () => {
    setIsLoading(true);
    try {
      const data = await api.getStudyDeck(paper.id, selectedEngine);
      setStudyDeck(data);
    } catch (e) {
      console.error('Error fetching study deck:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeck();
  }, [paper.id, selectedEngine]);

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] p-4 max-w-[1920px] mx-auto overflow-hidden">
      
      {/* Studio Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-surface-elevated border border-surface-border rounded-2xl mb-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-study/10 text-study border border-study/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center space-x-2">
              <span>Academic Study Studio</span>
              <span className="text-[10px] font-mono text-study-light bg-study/10 px-2 py-0.5 rounded-full border border-study/20">
                Active Recall Mode
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Transforming <strong className="text-zinc-300">"{paper.title}"</strong> into active recall flashcards, pipeline flows, and viva quizzes.
            </p>
          </div>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center p-1 bg-surface rounded-xl border border-surface-border">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'flashcards'
                ? 'bg-zinc-800 text-study-light shadow-sm border border-study/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'flow'
                ? 'bg-zinc-800 text-study-light shadow-sm border border-study/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Concept Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'quiz'
                ? 'bg-zinc-800 text-study-light shadow-sm border border-study/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Academic Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="flex-1 overflow-y-auto p-4 bg-surface-elevated/40 border border-surface-border rounded-2xl shadow-xl flex flex-col justify-center min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <Loader2 className="w-8 h-8 text-study animate-spin" />
            <p className="text-xs text-zinc-400">
              Generating active study materials with KaTeX equations...
            </p>
          </div>
        ) : studyDeck ? (
          <>
            {activeTab === 'flashcards' && (
              <FlashcardDeck
                flashcards={studyDeck.flashcards}
                paperTitle={paper.title}
              />
            )}

            {activeTab === 'flow' && (
              <ConceptFlowVisualizer
                conceptFlow={studyDeck.concept_flow}
                paperTitle={paper.title}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizSimulator
                quiz={studyDeck.quiz}
                paperTitle={paper.title}
              />
            )}
          </>
        ) : (
          <div className="text-center text-zinc-500 text-xs">
            Failed to load study deck. Please try again.
          </div>
        )}
      </div>

    </div>
  );
};
