import React, { useState, useEffect } from 'react';
import { 
  Table2, 
  Search, 
  Download, 
  FileCode2, 
  BookMarked, 
  Check, 
  Copy, 
  X, 
  FileSpreadsheet
} from 'lucide-react';
import { Paper, MatrixRow, ModelEngine } from '../../types';
import { api } from '../../services/api';
import { KaTeXRenderer } from '../common/KaTeXRenderer';

interface LiteratureMatrixViewProps {
  papers: Paper[];
  selectedEngine: ModelEngine;
  onOpenUpload: () => void;
}

export const LiteratureMatrixView: React.FC<LiteratureMatrixViewProps> = ({
  papers,
  selectedEngine,
  onOpenUpload,
}) => {
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [matrixData, setMatrixData] = useState<MatrixRow[]>([]);
  const [latexCode, setLatexCode] = useState<string>('');
  const [bibtexCode, setBibtexCode] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'latex' | 'bibtex' | 'markdown'>('latex');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (papers.length > 0 && selectedPaperIds.length === 0) {
      setSelectedPaperIds(papers.map(p => p.id));
    }
  }, [papers]);

  const fetchMatrix = async () => {
    if (selectedPaperIds.length === 0) return;
    setIsLoading(true);
    try {
      const res = await api.generateMatrix(selectedPaperIds, selectedEngine);
      setMatrixData(res.matrix);
      setLatexCode(res.latex_code);
      setBibtexCode(res.bibtex_code);
    } catch (e) {
      console.error('Error generating matrix:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, [selectedPaperIds, selectedEngine]);

  const togglePaperSelection = (id: string) => {
    setSelectedPaperIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredRows = matrixData.filter(row => {
    const q = searchQuery.toLowerCase();
    return (
      row.title.toLowerCase().includes(q) ||
      row.methodology.toLowerCase().includes(q) ||
      row.dataset.toLowerCase().includes(q) ||
      row.results_metric.toLowerCase().includes(q) ||
      row.research_gaps.toLowerCase().includes(q)
    );
  });

  const handleCopyExport = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleDownloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdownTable = () => {
    let md = '| Paper & Year | Authors | Core Methodology | Benchmark Dataset | Key Results | Critical Limitations | Identified Gaps |\n';
    md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';
    filteredRows.forEach(r => {
      md += `| **${r.title}** (${r.year}) | ${r.authors} | ${r.methodology} | ${r.dataset} | ${r.results_metric} | ${r.limitations} | ${r.research_gaps} |\n`;
    });
    return md;
  };

  return (
    <div className="space-y-6">
      
      {/* Controls & Exporters Bar */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-soft-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-100 text-cyan-700">
              <Table2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <span>Multi-Paper Literature Synthesis Matrix</span>
                <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200 font-bold">
                  {selectedPaperIds.length} Papers Selected
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Comparative synthesis across methodology, datasets, accuracy/mAP, and research gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => {
              setExportType('latex');
              setShowExportModal(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:border-cyan-300 hover:bg-slate-100 rounded-xl transition-all shadow-sm"
          >
            <FileCode2 className="w-4 h-4 text-cyan-600" />
            <span>Export LaTeX Table (.tex)</span>
          </button>

          <button
            onClick={() => {
              setExportType('bibtex');
              setShowExportModal(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-slate-100 rounded-xl transition-all shadow-sm"
          >
            <BookMarked className="w-4 h-4 text-indigo-600" />
            <span>BibTeX (.bib)</span>
          </button>

          <button
            onClick={() => {
              setExportType('markdown');
              setShowExportModal(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 rounded-xl transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            <span>Markdown / CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Paper Selector Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by methodology, datasets, metrics..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-medium"
          />
        </div>

        {/* Paper Toggle Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
            Compare:
          </span>
          {papers.map((p) => {
            const isSelected = selectedPaperIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePaperSelection(p.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-200 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-900'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                <span className="truncate max-w-[120px]">{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-soft-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="p-4 min-w-[200px]">Paper & Year</th>
                <th className="p-4 min-w-[120px]">Authors</th>
                <th className="p-4 min-w-[240px]">Core Methodology</th>
                <th className="p-4 min-w-[180px]">Benchmark Dataset</th>
                <th className="p-4 min-w-[180px]">Key Results / Metric</th>
                <th className="p-4 min-w-[220px]">Critical Limitations</th>
                <th className="p-4 min-w-[240px]">Identified Research Gaps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 italic">
                    {isLoading ? 'Synthesizing literature review matrix...' : 'No papers match your search criteria.'}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.paper_id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 font-bold text-slate-900 align-top">
                      <div className="space-y-1">
                        <div className="group-hover:text-cyan-700 transition-colors">{row.title}</div>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 rounded-md">
                          {row.year}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 align-top font-serif italic text-[11px]">
                      {row.authors}
                    </td>
                    <td className="p-4 text-slate-800 align-top leading-relaxed">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <KaTeXRenderer content={row.methodology} />
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 align-top font-mono text-[11px]">
                      <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200 block font-medium">
                        {row.dataset}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-800 font-bold align-top">
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px]">
                        {row.results_metric}
                      </div>
                    </td>
                    <td className="p-4 text-rose-800 align-top leading-relaxed text-[11px] font-medium">
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                        {row.limitations}
                      </div>
                    </td>
                    <td className="p-4 text-amber-800 align-top leading-relaxed text-[11px] font-medium">
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                        {row.research_gaps}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {exportType === 'latex' && 'Export LaTeX Table (.tex)'}
                    {exportType === 'bibtex' && 'Export Academic BibTeX (.bib)'}
                    {exportType === 'markdown' && 'Export Literature Matrix (Markdown)'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Ready-to-compile academic code snippet</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setExportType('latex')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      exportType === 'latex' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    LaTeX
                  </button>
                  <button
                    onClick={() => setExportType('bibtex')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      exportType === 'bibtex' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    BibTeX
                  </button>
                  <button
                    onClick={() => setExportType('markdown')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      exportType === 'markdown' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Markdown
                  </button>
                </div>

                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-900 font-mono text-xs text-slate-200 leading-relaxed select-all">
              <pre className="whitespace-pre-wrap">
                {exportType === 'latex' && latexCode}
                {exportType === 'bibtex' && bibtexCode}
                {exportType === 'markdown' && generateMarkdownTable()}
              </pre>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500 font-medium">
                {exportType === 'latex' && 'Compatible with NeurIPS, IEEE, and ACM LaTeX templates.'}
                {exportType === 'bibtex' && 'Complete citation keys and metadata.'}
                {exportType === 'markdown' && 'Ready for GitHub README or Notion export.'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const content =
                      exportType === 'latex'
                        ? latexCode
                        : exportType === 'bibtex'
                        ? bibtexCode
                        : generateMarkdownTable();
                    handleCopyExport(content);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={() => {
                    if (exportType === 'latex') {
                      handleDownloadFile(latexCode, 'literature_matrix.tex', 'text/x-tex');
                    } else if (exportType === 'bibtex') {
                      handleDownloadFile(bibtexCode, 'citations.bib', 'text/plain');
                    } else {
                      handleDownloadFile(generateMarkdownTable(), 'literature_matrix.md', 'text/markdown');
                    }
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
