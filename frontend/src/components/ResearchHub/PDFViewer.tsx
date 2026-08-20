import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  BookMarked, 
  Sigma, 
  Sparkles, 
  Copy, 
  Check 
} from 'lucide-react';
import { Paper, Citation, EquationItem, SectionData } from '../../types';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface PDFViewerProps {
  paper: Paper;
  activeCitation: Citation | null;
  onAskSelectedText: (text: string) => void;
  onExplainEquation: (eq: EquationItem) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  paper,
  activeCitation,
  onAskSelectedText,
  onExplainEquation,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeSection, setActiveSection] = useState<string>('abstract');
  const [selectedText, setSelectedText] = useState<string>('');
  const [copiedText, setCopiedText] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCitation && activeCitation.page) {
      setCurrentPage(activeCitation.page);
      if (activeCitation.section) {
        setActiveSection(activeCitation.section);
      }
    }
  }, [activeCitation]);

  useEffect(() => {
    setCurrentPage(1);
    const firstSec = paper.sections ? Object.keys(paper.sections)[0] : 'abstract';
    setActiveSection(firstSec || 'abstract');
  }, [paper.id]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 5) {
      setSelectedText(selection.toString().trim());
    } else {
      setSelectedText('');
    }
  };

  const sectionsList = paper.sections ? Object.values(paper.sections) : [];
  const currentSectionData = paper.sections?.[activeSection] || sectionsList[0];
  const pageEquations = paper.equations?.filter(e => e.page === currentPage) || paper.equations || [];

  const handleCopy = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1500);
    }
  };

  const fileTypeLabel = (paper.file_type || 'PDF').toUpperCase();

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-soft-sm">
      
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center space-x-2">
          <BookMarked className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">Document Reader</span>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 uppercase">
            {fileTypeLabel}
          </span>
          <span className="text-[10px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200">
            {paper.total_pages || 1} {paper.total_pages === 1 ? 'Page' : 'Pages'}
          </span>
        </div>

        {/* Zoom & Page Navigation */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 px-2">
              {currentPage} / {paper.total_pages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(paper.total_pages || 1, prev + 1))}
              disabled={currentPage >= (paper.total_pages || 1)}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded-lg transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
            <button
              onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))}
              className="p-1 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-semibold text-slate-600 px-1.5">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
              className="p-1 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Jump Tabs */}
      {sectionsList.length > 0 && (
        <div className="flex items-center space-x-1.5 px-5 py-2 border-b border-slate-100 bg-white overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Index:
          </span>
          {sectionsList.map((sec) => (
            <button
              key={sec.section_name}
              onClick={() => {
                setActiveSection(sec.section_name);
                if (sec.pages && sec.pages.length > 0) {
                  setCurrentPage(sec.pages[0]);
                }
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeSection === sec.section_name
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>
      )}

      {/* Main Document Content Canvas */}
      <div 
        ref={containerRef}
        onMouseUp={handleMouseUp}
        className="relative flex-1 overflow-y-auto p-6 bg-slate-50 select-text font-serif leading-relaxed"
        style={{ fontSize: `${zoomLevel * 0.01}rem` }}
      >
        {/* Floating Highlight Toolbar */}
        {selectedText && (
          <div className="sticky top-2 z-30 flex items-center space-x-2 p-2 bg-white/95 backdrop-blur-md border border-slate-300 shadow-xl rounded-2xl animate-fade-in mb-4 max-w-lg mx-auto">
            <span className="text-xs text-slate-700 font-sans truncate max-w-[200px] pl-2 italic font-medium">
              "{selectedText}"
            </span>
            <div className="flex items-center space-x-1 ml-auto">
              <button
                onClick={() => {
                  onAskSelectedText(selectedText);
                  setSelectedText('');
                }}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl transition-all font-sans shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask AI</span>
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-sans"
                title="Copy selection"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Citation Highlight Banner */}
        {activeCitation && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between animate-fade-in font-sans shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-900">
                Viewing Citation: Page {activeCitation.page} • Section: {activeCitation.section}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 font-mono font-semibold">
              BBox: [{activeCitation.bbox.join(', ')}]
            </span>
          </div>
        )}

        {/* Document Sheet */}
        <div className="max-w-3xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-soft-md space-y-6">
          
          {/* Header Title on First Page */}
          {currentPage === 1 && (
            <div className="border-b border-slate-100 pb-6 text-center space-y-2.5 font-sans">
              <div className="inline-block px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-600 rounded-lg">
                {paper.filename || paper.title}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {paper.title}
              </h1>
              <p className="text-xs text-slate-500 font-serif italic">
                {paper.authors?.join(', ')} • {paper.year}
              </p>
            </div>
          )}

          {/* Section Heading */}
          <div className="flex items-center justify-between pt-2 border-b border-slate-100 pb-2.5 font-sans">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{currentSectionData ? currentSectionData.title : 'Document Content'}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono font-bold">Page {currentPage}</span>
          </div>

          {/* Section Body Text */}
          <div className="text-slate-800 text-sm leading-relaxed space-y-4 font-sans">
            {currentSectionData ? (
              currentSectionData.text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-justify leading-relaxed">
                  <KaTeXRenderer content={paragraph} />
                </p>
              ))
            ) : (
              <p className="text-slate-400 italic">No text extracted for this section.</p>
            )}
          </div>

          {/* Detected LaTeX Equations Block */}
          {pageEquations.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 font-sans space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                  <Sigma className="w-4 h-4 text-indigo-600" />
                  <span>Detected Mathematical Formulations</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">KaTeX Decoded</span>
              </div>

              <div className="space-y-3">
                {pageEquations.map((eq) => (
                  <div
                    key={eq.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all group shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{eq.id}</span>
                      <button
                        onClick={() => onExplainEquation(eq)}
                        className="flex items-center space-x-1 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>Explain Variable Breakdown</span>
                      </button>
                    </div>

                    <div className="my-2 p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto text-center shadow-inner">
                      <KaTeXRenderer content={eq.latex} block />
                    </div>

                    {eq.description && (
                      <p className="text-xs text-slate-600 mt-2 font-medium leading-normal">
                        {eq.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
