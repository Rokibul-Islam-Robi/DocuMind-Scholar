import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowUpRight, BookOpen } from 'lucide-react';
import { WorkspaceDomain, Paper } from '../../types';
import { api } from '../../services/api';

interface HighlightedUploadCardProps {
  domain: WorkspaceDomain;
  onPaperUploaded: (paper: Paper) => void;
  onSelectSample: (paper: Paper) => void;
  samplePapers: Paper[];
}

export const HighlightedUploadCard: React.FC<HighlightedUploadCardProps> = ({
  domain,
  onPaperUploaded,
  onSelectSample,
  samplePapers,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isStudent = domain === 'student';
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md', '.text'];

  const handleFile = async (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setUploadError('Please select a supported document: PDF, Word (DOCX/DOC), Text (TXT), or Markdown (MD).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setSuccessMessage(null);

    try {
      const res = await api.uploadPaper(file, domain);
      setSuccessMessage(res.message || `Successfully processed and indexed "${res.paper.title}"!`);
      setTimeout(() => {
        onPaperUploaded(res.paper);
        setSuccessMessage(null);
      }, 900);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse and index document. Please check file format.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-xl overflow-hidden mb-8 transition-all group">
      <div className="p-6 sm:p-8">
        
        {/* Header Badge & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider font-mono shadow-sm bg-slate-100 text-slate-700">
              <Sparkles className={`w-3.5 h-3.5 ${isStudent ? 'text-[#6351d8] animate-spin' : 'text-emerald-600 animate-spin'}`} />
              <span>{isStudent ? 'STUDENT COURSE MATERIAL INGESTION' : 'RESEARCH PAPER & PREPRINT INGESTION'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isStudent ? 'Upload Lecture Notes, Slides, Textbooks, or Assignments' : 'Upload Academic Research Papers & Preprints'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
              {isStudent 
                ? 'Upload your PDF, Word doc, or text notes. The AI Study Tutor will automatically parse chapters, generate 3D Anki flashcards, concept flowcharts, and mock viva quizzes.'
                : 'Upload arXiv or conference PDFs. The multi-agent orchestrator classifies sections, decodes LaTeX equations, and links coordinates for citation verification.'}
            </p>
          </div>

          {/* Supported Format Badges */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-center">
            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-[#5442be] border border-indigo-200 text-xs font-bold font-mono shadow-sm">PDF</span>
            <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-mono shadow-sm">DOCX</span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono shadow-sm">TXT</span>
            <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold font-mono shadow-sm">MD</span>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`mt-6 cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all duration-300 ${
            isDragging
              ? isStudent ? 'border-[#6351d8] bg-indigo-50/60 scale-[0.99] shadow-inner' : 'border-emerald-500 bg-emerald-50/60 scale-[0.99] shadow-inner'
              : 'border-slate-300/80 hover:border-indigo-300 bg-slate-50/60 hover:bg-slate-50/90 hover:shadow-md'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md,.text"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center space-y-3.5">
            <div className={`p-4 rounded-3xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${
              isStudent ? 'bg-indigo-50 text-[#6351d8]' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm sm:text-base font-black text-slate-800">
                {isUploading ? 'Extracting sections, KaTeX equations & indexing chunks...' : 'Click or Drag & Drop document (PDF, DOCX, TXT, MD) here'}
              </p>
              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                Automatic section categorization, KaTeX formula extraction & persistent SQLite storage
              </p>
            </div>

            <button
              type="button"
              disabled={isUploading}
              className={`mt-2 px-6 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all hover:scale-103 ${
                isStudent 
                  ? 'bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] hover:from-[#f5a623] hover:to-[#d98207] text-[#1a1038] shadow-amber-500/20' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20 text-white'
              }`}
            >
              {isUploading ? 'Processing File...' : 'Browse Document from Computer'}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {uploadError && (
          <div className="mt-4 flex items-center space-x-2.5 p-3.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl font-bold animate-fade-in shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-center space-x-2.5 p-3.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl font-bold animate-fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Quick Sample Presets */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Or Choose Pre-Loaded {isStudent ? 'Course Material' : 'Benchmark Paper'}:</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {samplePapers.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectSample(p)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-bold transition-all hover:scale-102"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[150px]">{p.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
