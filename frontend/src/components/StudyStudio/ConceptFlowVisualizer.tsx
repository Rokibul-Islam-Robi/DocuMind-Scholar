import React, { useState } from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Workflow, 
  ChevronRight, 
  Cpu, 
  Layers
} from 'lucide-react';
import { ConceptFlow, FlowStep } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface ConceptFlowVisualizerProps {
  conceptFlow: ConceptFlow;
  paperTitle: string;
}

export const ConceptFlowVisualizer: React.FC<ConceptFlowVisualizerProps> = ({
  conceptFlow,
  paperTitle,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = conceptFlow.steps || [];
  const activeStep: FlowStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* Title & Overview Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-soft-md flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-[#6351d8]">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <span>{conceptFlow.title}</span>
                <span className="text-[10px] font-mono text-[#5442be] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-bold">
                  {steps.length} Pipeline Stages
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">{conceptFlow.description}</p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Layers className="w-4 h-4 text-[#6351d8]" />
          <span>Interactive Execution Graph</span>
        </div>
      </div>

      {/* Visual Pipeline Stepper Track */}
      <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-soft-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] relative">
          
          {/* Background Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-[#1c1243] via-[#6351d8] to-[#ffb800] -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(activeStepIndex / (steps.length - 1)) * 90}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <div
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className="relative z-10 flex flex-col items-center cursor-pointer group select-none"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#1c1243] to-[#6351d8] text-white shadow-lg shadow-indigo-500/25 scale-110 ring-4 ring-indigo-100'
                      : isCompleted
                      ? 'bg-indigo-50 text-[#5442be] border border-indigo-200 font-bold'
                      : 'bg-slate-100 text-slate-500 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5 text-[#6351d8]" /> : step.step}
                </div>

                <span
                  className={`text-xs font-bold mt-3 max-w-[120px] text-center truncate transition-colors ${
                    isCurrent ? 'text-[#6351d8]' : 'text-slate-500 group-hover:text-slate-900'
                  }`}
                >
                  {step.name}
                </span>

                {step.badge && (
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                    {step.badge}
                  </span>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* Deep Step Detail Inspector */}
      {activeStep && (
        <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-soft-md space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-xl text-xs font-black font-mono bg-indigo-50 text-[#5442be] border border-indigo-200">
                STAGE {activeStep.step} OF {steps.length}
              </span>
              <h3 className="text-base font-black text-slate-900">{activeStep.name}</h3>
            </div>

            {activeStep.badge && (
              <span className="px-3 py-1 rounded-xl text-[11px] font-mono uppercase font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {activeStep.badge}
              </span>
            )}
          </div>

          <div className="text-slate-700 text-sm leading-relaxed font-medium">
            <p>{activeStep.description}</p>
          </div>

          {activeStep.formula && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block font-mono">
                Mathematical Tensor Transformation:
              </span>
              <div className="py-2 overflow-x-auto text-base">
                <KaTeXRenderer content={activeStep.formula} block />
              </div>
            </div>
          )}

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl disabled:opacity-30 transition-all"
            >
              ← Previous Stage
            </button>

            <span className="text-xs font-mono text-slate-500 font-bold">
              Stage {activeStepIndex + 1} of {steps.length}
            </span>

            <button
              onClick={() => setActiveStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStepIndex === steps.length - 1}
              className="flex items-center space-x-1.5 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 rounded-xl disabled:opacity-30 transition-all shadow-md"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
