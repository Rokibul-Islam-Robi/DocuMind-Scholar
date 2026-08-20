import React, { useState } from 'react';
import { KeyRound, Check, Sparkles, X, Cpu } from 'lucide-react';
import { api } from '../services/api';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiKey: string;
  groqKey: string;
  onSaveKeys: (gemini: string, groq: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  geminiKey,
  groqKey,
  onSaveKeys,
}) => {
  const [localGemini, setLocalGemini] = useState(geminiKey);
  const [localGroq, setLocalGroq] = useState(groqKey);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKeys(localGemini, localGroq);
    try {
      await api.saveApiKeys({
        gemini_api_key: localGemini,
        groq_api_key: localGroq,
      });
    } catch (e) {
      console.warn('Could not persist keys to backend session:', e);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-amber-100 text-amber-700">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">LLM Engine API Keys</h2>
              <p className="text-xs text-slate-500 font-medium">Configure Gemini 1.5 Flash/Pro and Groq Llama-3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              <strong className="text-amber-950 font-bold">Zero-Key Fallback Active:</strong> DocuMind Scholar includes built-in academic intelligence. Adding your own API keys unlocks full live generation with Gemini 1.5 Flash/Pro and Groq Llama-3-70B.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Gemini API Key</span>
              </label>
              <input
                type="password"
                value={localGemini}
                onChange={(e) => setLocalGemini(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-medium">For Gemini 1.5 Flash (Fast) and Gemini 1.5 Pro (Deep Context)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-600" />
                <span>Groq Cloud API Key</span>
              </label>
              <input
                type="password"
                value={localGroq}
                onChange={(e) => setLocalGroq(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-medium">For ultra-fast streaming with Llama-3.3-70B</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-md"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save API Keys</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
