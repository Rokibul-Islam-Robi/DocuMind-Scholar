import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, X, Loader2 } from 'lucide-react';
import { Paper, WorkspaceDomain } from '../types';
import { api } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperUploaded: (paper: Paper) => void;
  samplePapers: Paper[];
  onSelectPaper: (paper: Paper) => void;
  domain?: WorkspaceDomain;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onPaperUploaded,
  samplePapers,
  onSelectPaper,
  domain = 'student',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md', '.text'];

  const handleFile = async (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setUploadError('Please select a supported document: PDF, Word (DOCX/DOC), Text (TXT), or Markdown (.md).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setSuccessMessage(null);

    try {
      const res = await api.uploadPaper(file, domain);
      setSuccessMessage(res.message || `Successfully parsed "${res.paper.title}" into persistent database!`);
      setTimeout(() => {
        onPaperUploaded(res.paper);
        onClose();
      }, 900);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse and index document.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-2xl ${domain === 'student' ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {domain === 'student' ? 'Upload Course Lecture, Notes or Textbook' : 'Upload Research Paper & Preprint'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">PDF, Word (DOCX/DOC), Text (TXT) & Markdown (MD) Ingestion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Format Badges */}
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500">
            <span>Supported:</span>
            <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-mono">PDF</span>
            <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-mono">DOCX</span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">TXT</span>
            <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-mono">MD</span>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? domain === 'student' ? 'border-pink-500 bg-pink-50/50' : 'border-emerald-500 bg-emerald-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
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

            <div className="flex flex-col items-center space-y-3">
              <div className={`p-4 rounded-3xl shadow-sm ${domain === 'student' ? 'bg-pink-100 text-pink-600' : 'bg-emerald-100 text-emerald-700'}`}>
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <UploadCloud className="w-8 h-8" />
                )}
              </div>

              <div>
                <p className="text-sm font-black text-slate-800">
                  {isUploading ? 'Extracting sections and storing in database...' : 'Drop your document here or click to browse'}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Multi-format parser extracts sections, math formulas, and page coordinates.
                </p>
              </div>

              <button
                type="button"
                disabled={isUploading}
                className={`mt-2 px-5 py-2.5 rounded-2xl text-xs font-black text-white shadow-md transition-all ${
                  domain === 'student'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                }`}
              >
                {isUploading ? 'Processing...' : 'Select File from Computer'}
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {uploadError && (
            <div className="flex items-center space-x-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center space-x-2 p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Sample preset links */}
          <div className="pt-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Or pick an existing document:
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {samplePapers.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPaper(p);
                    onClose();
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span className="truncate max-w-[140px]">{p.title}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
