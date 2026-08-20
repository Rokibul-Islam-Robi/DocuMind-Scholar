import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  BookOpen,
  Trophy,
  Zap
} from 'lucide-react';
import { Flashcard } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface FlashcardDeckProps {
  flashcards: Flashcard[];
  paperTitle: string;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ flashcards, paperTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(4);

  const allTags = ['All', ...Array.from(new Set(flashcards.flatMap(f => f.tags || [])))];
  
  const filteredCards = selectedTag === 'All' 
    ? flashcards 
    : flashcards.filter(f => f.tags?.includes(selectedTag));

  const currentCard = filteredCards[currentIndex] || flashcards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleRate = (rating: 'Easy' | 'Good' | 'Hard') => {
    if (rating === 'Easy' || rating === 'Good') {
      if (currentCard && !masteredIds.includes(currentCard.id)) {
        setMasteredIds(prev => [...prev, currentCard.id]);
        setStreak(prev => prev + 1);
      }
    }
    handleNext();
  };

  if (filteredCards.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-soft-sm">
        No flashcards available for this category.
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / filteredCards.length) * 100;

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto space-y-7 animate-fade-in">
      
      {/* Deck Stats Header Card with Ambient Glow */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between p-4 sm:px-6 sm:py-4 bg-white border border-slate-200/90 rounded-3xl shadow-soft-md gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#6351d8]" />
            <span className="text-xs font-black text-slate-800">
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
          </div>
          <div className="h-2.5 w-36 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-[#1c1243] via-[#6351d8] to-[#ffb800] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-1.5 text-amber-900 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200 shadow-sm animate-pulse">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{streak} Study Streak</span>
          </div>
          <div className="flex items-center space-x-1.5 text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-2xl border border-indigo-200 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#6351d8]" />
            <span>{masteredIds.length} Mastered</span>
          </div>
        </div>
      </div>

      {/* Category Filter Chips with Smooth Hover Pill Animation */}
      <div className="w-full flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => {
              setSelectedTag(tag);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
              selectedTag === tag
                ? 'bg-gradient-to-r from-[#1c1243] to-[#6351d8] text-white shadow-indigo-500/25 scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50 hover:scale-102'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 3D Flip Flashcard with Holographic Shadow & Depth */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-96 cursor-pointer perspective-1000 group select-none"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-all rounded-3xl border ${
            isFlipped 
              ? 'rotate-y-180 border-indigo-300 shadow-xl shadow-indigo-500/15 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40' 
              : 'border-slate-200/90 hover:border-indigo-300/80 shadow-soft-xl hover:shadow-2xl hover:shadow-indigo-500/15 bg-white hover:-translate-y-1'
          } flex flex-col justify-between p-8 sm:p-10`}
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* FRONT SIDE (Question) */}
          <div className={`flex flex-col justify-between h-full ${isFlipped ? 'hidden' : 'flex'}`}>
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-indigo-100/90 text-[#4331a6] border border-indigo-200 shadow-sm">
                {currentCard.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1.5 font-bold group-hover:text-[#6351d8] transition-colors">
                <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500 text-[#6351d8]" />
                <span>Click Card to Flip</span>
              </span>
            </div>

            <div className="my-auto py-6 text-center">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed max-w-xl mx-auto">
                <KaTeXRenderer content={currentCard.question} />
              </h3>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400 font-bold">
              <span className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Active Recall Challenge</span>
              </span>
              <span className="text-[#6351d8] group-hover:translate-x-1 transition-transform">
                Reveal Verified Solution →
              </span>
            </div>
          </div>

          {/* BACK SIDE (Answer) */}
          <div 
            className={`flex flex-col justify-between h-full ${isFlipped ? 'flex' : 'hidden'}`}
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-100/90 text-emerald-800 border border-emerald-200 shadow-sm">
                Verified Answer & Derivation
              </span>
              <span className="text-xs text-slate-400 font-bold">Self-Grading</span>
            </div>

            <div className="my-auto py-4 text-slate-800 text-sm sm:text-base leading-relaxed overflow-y-auto max-h-52 font-medium">
              <KaTeXRenderer content={currentCard.answer} />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-indigo-100 text-xs text-slate-500">
              <span className="truncate max-w-[200px] font-semibold">{paperTitle}</span>
              <span className="text-[#6351d8] font-bold">Rate difficulty below</span>
            </div>
          </div>

        </div>
      </div>

      {/* Spaced Repetition Rating Buttons with Bouncy Hover & Color Accents */}
      {isFlipped ? (
        <div className="w-full flex items-center justify-center space-x-3.5 animate-slide-up">
          <button
            onClick={() => handleRate('Hard')}
            className="flex-1 flex flex-col items-center py-3.5 px-4 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/90 rounded-2xl transition-all font-black text-xs shadow-soft-sm hover:scale-103 hover:shadow-md"
          >
            <span className="text-sm">Hard 😓</span>
            <span className="text-[10px] text-orange-500 font-mono mt-0.5">&lt; 10 mins</span>
          </button>

          <button
            onClick={() => handleRate('Good')}
            className="flex-1 flex flex-col items-center py-3.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/90 rounded-2xl transition-all font-black text-xs shadow-soft-sm hover:scale-103 hover:shadow-md"
          >
            <span className="text-sm">Good 👍</span>
            <span className="text-[10px] text-indigo-500 font-mono mt-0.5">1 Day Interval</span>
          </button>

          <button
            onClick={() => handleRate('Easy')}
            className="flex-1 flex flex-col items-center py-3.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/90 rounded-2xl transition-all font-black text-xs shadow-soft-sm hover:scale-103 hover:shadow-md"
          >
            <span className="text-sm">Easy ✨</span>
            <span className="text-[10px] text-amber-600 font-mono mt-0.5">4 Days Interval</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrev}
            className="p-3 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl transition-all shadow-sm hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFlipped(true)}
            className="px-9 py-3.5 text-xs font-black text-[#1a1038] bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] hover:from-[#f5a623] hover:to-[#d98207] rounded-2xl transition-all shadow-md shadow-amber-500/25 hover:shadow-lg hover:scale-102"
          >
            Reveal Answer (Click or Space)
          </button>
          <button
            onClick={handleNext}
            className="p-3 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl transition-all shadow-sm hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
};
