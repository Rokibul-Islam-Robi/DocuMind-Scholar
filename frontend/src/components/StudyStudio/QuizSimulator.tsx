import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  Trophy,
  Zap,
  HelpCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface QuizSimulatorProps {
  quiz: QuizQuestion[];
  paperTitle: string;
}

export const QuizSimulator: React.FC<QuizSimulatorProps> = ({ quiz, paperTitle }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = quiz[currentQIndex] || quiz[0];
  const answeredCount = Object.keys(userAnswers).length;

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_index) {
        score++;
      }
    });
    return score;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (userAnswers[currentQIndex] !== undefined) return;

    const newAnswers = { ...userAnswers, [currentQIndex]: optionIndex };
    setUserAnswers(newAnswers);

    if (Object.keys(newAnswers).length === quiz.length) {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 160,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#ffb800', '#6351d8', '#8b9bf7', '#1c1243', '#ff593b'],
        });
      } catch (e) {
        // fallback
      }
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setCurrentQIndex(0);
    setIsCompleted(false);
  };

  if (!quiz || quiz.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-soft-sm">
        No quiz questions generated for this document yet.
      </div>
    );
  }

  const score = calculateScore();
  const percentage = Math.round((score / quiz.length) * 100);

  return (
    <div className="flex flex-col max-w-3xl mx-auto space-y-7 animate-fade-in">
      
      {/* Quiz Progress Header Card */}
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-soft-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1c1243] via-[#38207d] to-[#6351d8] text-white shadow-md shadow-indigo-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Academic Mock Exam & Viva Simulator
              </h2>
              <span className="text-[10px] font-mono text-[#5442be] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 font-bold">
                {quiz.length} Questions
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Instant AI grading with LaTeX formula rationale</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-800">
              Score: <strong className="text-[#6351d8] font-black">{score}</strong> / {answeredCount}
            </span>
            <div className="h-2.5 w-32 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#1c1243] via-[#6351d8] to-[#ffb800] transition-all duration-300 rounded-full"
                style={{ width: `${(answeredCount / quiz.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all shadow-sm hover:scale-105"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Trophy Card with Glowing Particle Theme */}
      {isCompleted && (
        <div className="relative p-8 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-amber-50/40 border border-indigo-200 rounded-3xl shadow-soft-xl text-center space-y-4 animate-slide-up overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex p-4 rounded-3xl bg-white text-[#6351d8] shadow-md shadow-indigo-500/20 animate-bounce">
            <Trophy className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            Quiz Completed! Score: {score}/{quiz.length} ({percentage}%)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
            Great effort on <strong className="text-slate-900">{paperTitle}</strong>. Review your rationale breakdown below or retake the test!
          </p>
          <button
            onClick={handleReset}
            className="px-7 py-3 text-xs font-black text-[#1a1038] bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] hover:from-[#f5a623] hover:to-[#d98207] rounded-2xl transition-all shadow-md shadow-amber-500/20 hover:scale-105"
          >
            Retake Mock Exam
          </button>
        </div>
      )}

      {/* Question Card */}
      {currentQ && (
        <div className="relative p-8 sm:p-10 bg-white border border-slate-200/90 rounded-3xl shadow-soft-xl space-y-7">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-mono font-black text-[#6351d8] flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>QUESTION {currentQIndex + 1} OF {quiz.length}</span>
            </span>

            {/* Question Selector Chips */}
            <div className="flex space-x-1.5">
              {quiz.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                    idx === currentQIndex
                      ? 'bg-gradient-to-r from-[#1c1243] to-[#6351d8] text-white shadow-md scale-105'
                      : userAnswers[idx] !== undefined
                      ? userAnswers[idx] === quiz[idx].correct_index
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-orange-100 text-orange-800 border border-orange-300 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="text-slate-900 font-black text-base sm:text-lg leading-relaxed">
            <KaTeXRenderer content={currentQ.question} />
          </div>

          {/* Option Choices with Delightful Interactive Feedback */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isAnswered = userAnswers[currentQIndex] !== undefined;
              const isUserChoice = userAnswers[currentQIndex] === optIdx;
              const isCorrect = optIdx === currentQ.correct_index;

              let style = 'bg-slate-50/80 border-slate-200 hover:border-indigo-300 text-slate-800 hover:bg-indigo-50/30 hover:scale-101';
              if (isAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm font-bold scale-[1.01]';
                } else if (isUserChoice) {
                  style = 'bg-orange-50 border-orange-400 text-orange-950 font-bold scale-[0.99]';
                } else {
                  style = 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between text-xs sm:text-sm leading-relaxed font-medium ${style}`}
                >
                  <div className="flex items-center space-x-3.5 pr-2">
                    <span className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-mono text-xs font-black shrink-0 text-slate-700 shadow-sm">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <KaTeXRenderer content={option} />
                  </div>

                  {isAnswered && (
                    <div className="shrink-0 ml-2">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />}
                      {!isCorrect && isUserChoice && <XCircle className="w-5 h-5 text-orange-600 animate-shake" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Rationale & Formula Box */}
          {userAnswers[currentQIndex] !== undefined && (
            <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 space-y-3 animate-fade-in shadow-sm">
              <div className="flex items-center space-x-2 text-xs font-black text-[#5442be]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Academic Explanation & Rationale:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentQ.rationale}
              </p>
              {currentQ.formula_ref && (
                <div className="p-4 bg-white rounded-xl border border-indigo-200 text-center shadow-sm">
                  <KaTeXRenderer content={currentQ.formula_ref} block />
                </div>
              )}
            </div>
          )}

          {/* Stepper Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors"
            >
              ← Previous Question
            </button>

            <button
              onClick={() => setCurrentQIndex(prev => Math.min(quiz.length - 1, prev + 1))}
              disabled={currentQIndex === quiz.length - 1}
              className="flex items-center space-x-1.5 px-6 py-2.5 text-xs font-black text-[#1a1038] bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] hover:from-[#f5a623] hover:to-[#d98207] rounded-xl disabled:opacity-30 transition-all shadow-md hover:scale-102"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
