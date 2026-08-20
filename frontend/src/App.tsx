import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { HighlightedUploadCard } from './components/common/HighlightedUploadCard';

// Student Workspace Components
import { StudentSidebar } from './components/StudentWorkspace/StudentSidebar';
import { StudentHeroBanner } from './components/StudentWorkspace/StudentHeroBanner';
import { StudentTutorView } from './components/StudentWorkspace/StudentTutorView';
import { StudyGuideView } from './components/StudentWorkspace/StudyGuideView';
import { ChapterSummaryView } from './components/StudentWorkspace/ChapterSummaryView';
import { FlashcardDeck } from './components/StudyStudio/FlashcardDeck';
import { ConceptFlowVisualizer } from './components/StudyStudio/ConceptFlowVisualizer';
import { QuizSimulator } from './components/StudyStudio/QuizSimulator';

// Researcher Workspace Components
import { ResearcherSidebar } from './components/ResearcherWorkspace/ResearcherSidebar';
import { HeroBanner } from './components/HeroBanner';
import { ResearchDeepDiveView } from './components/Views/ResearchDeepDiveView';
import { FormulaDecoderView } from './components/Views/FormulaDecoderView';
import { LiteratureMatrixView } from './components/LiteratureMatrix/LiteratureMatrixView';
import { ResearchGapsView } from './components/ResearcherWorkspace/ResearchGapsView';
import { ManuscriptReviewerView } from './components/ResearcherWorkspace/ManuscriptReviewerView';

// Modals
import { UploadModal } from './components/UploadModal';
import { ApiKeyModal } from './components/ApiKeyModal';

// Types & Services
import { 
  Paper, 
  WorkspaceDomain, 
  StudentView, 
  ResearcherView, 
  ModelEngine, 
  ChatMessage, 
  Citation, 
  StudyDeck 
} from './types';
import { api } from './services/api';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  // Domain / Role Switcher: 'student' | 'researcher'
  const [currentDomain, setCurrentDomain] = useState<WorkspaceDomain>('student');
  
  // Views for each domain
  const [studentView, setStudentView] = useState<StudentView>('tutor');
  const [researcherView, setResearcherView] = useState<ResearcherView>('deepdive');

  // Engine & Papers
  const [selectedEngine, setSelectedEngine] = useState<ModelEngine>('gemini-1.5-flash');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [activePaper, setActivePaper] = useState<Paper | null>(null);
  
  // Data states
  const [chatHistoryMap, setChatHistoryMap] = useState<Record<string, ChatMessage[]>>({});
  const [studyDeck, setStudyDeck] = useState<StudyDeck | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStudyLoading, setIsStudyLoading] = useState(false);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');

  // Load documents whenever currentDomain changes
  useEffect(() => {
    const loadDomainData = async () => {
      setIsLoading(true);
      try {
        const fetchedPapers = await api.getPapers(currentDomain);
        setPapers(fetchedPapers);
        if (fetchedPapers.length > 0) {
          const firstId = fetchedPapers[0].id;
          const fullPaper = await api.getPaper(firstId);
          setActivePaper(fullPaper || fetchedPapers[0]);
          
          // Load chat history
          const history = await api.getChatHistory(firstId);
          setChatHistoryMap(prev => ({
            ...prev,
            [firstId]: history,
          }));
        } else {
          setActivePaper(null);
        }
      } catch (e) {
        console.error('Initialization error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadDomainData();
  }, [currentDomain]);

  // Fetch study deck for active paper if on study-related views
  useEffect(() => {
    if (!activePaper) return;
    if (currentDomain === 'student' && ['flashcards', 'flow', 'quiz'].includes(studentView)) {
      const fetchDeck = async () => {
        setIsStudyLoading(true);
        try {
          const deck = await api.getStudyDeck(activePaper.id, selectedEngine);
          setStudyDeck(deck);
        } catch (e) {
          console.error('Error fetching study deck:', e);
        } finally {
          setIsStudyLoading(false);
        }
      };
      fetchDeck();
    }
  }, [activePaper?.id, currentDomain, studentView, selectedEngine]);

  const handleSelectPaper = async (paper: Paper) => {
    try {
      const full = await api.getPaper(paper.id);
      setActivePaper(full || paper);

      // Load persistent chat history from SQLite
      const history = await api.getChatHistory(paper.id);
      setChatHistoryMap(prev => ({
        ...prev,
        [paper.id]: history,
      }));
    } catch (e) {
      setActivePaper(paper);
    }
  };

  const handlePaperUploaded = async (newPaper: Paper) => {
    setPapers(prev => [newPaper, ...prev]);
    setActivePaper(newPaper);
    const history = await api.getChatHistory(newPaper.id);
    setChatHistoryMap(prev => ({
      ...prev,
      [newPaper.id]: history,
    }));
  };

  const handleSaveKeys = (gemini: string, groq: string) => {
    setGeminiKey(gemini);
    setGroqKey(groq);
  };

  const activeChatHistory = (activePaper ? chatHistoryMap[activePaper.id] : []) || [];

  const handleSendMessage = async (text: string, actionType?: string, selectedText?: string) => {
    if (!activePaper || isStreaming) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action_type: actionType,
    };

    const agentMsgId = `agent-${Date.now()}`;
    const agentMsgPlaceholder: ChatMessage = {
      id: agentMsgId,
      sender: 'agent',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model_used: selectedEngine,
      citations: [],
      isStreaming: true,
    };

    setChatHistoryMap(prev => ({
      ...prev,
      [activePaper.id]: [...(prev[activePaper.id] || []), userMsg, agentMsgPlaceholder],
    }));

    setIsStreaming(true);

    let accumulatedText = '';
    let accumulatedCitations: Citation[] = [];

    await api.streamAgent(
      {
        paper_id: activePaper.id,
        prompt: text,
        model_engine: selectedEngine,
        action_type: actionType,
        selected_text: selectedText,
      },
      {
        onCitations: (citations) => {
          accumulatedCitations = citations;
          setChatHistoryMap(prev => {
            const list = [...(prev[activePaper.id] || [])];
            const last = list[list.length - 1];
            if (last && last.id === agentMsgId) {
              last.citations = citations;
            }
            return { ...prev, [activePaper.id]: list };
          });
        },
        onToken: (token) => {
          accumulatedText += token;
          setChatHistoryMap(prev => {
            const list = [...(prev[activePaper.id] || [])];
            const last = list[list.length - 1];
            if (last && last.id === agentMsgId) {
              last.text = accumulatedText;
            }
            return { ...prev, [activePaper.id]: list };
          });
        },
        onDone: () => {
          setIsStreaming(false);
          setChatHistoryMap(prev => {
            const list = [...(prev[activePaper.id] || [])];
            const last = list[list.length - 1];
            if (last && last.id === agentMsgId) {
              last.isStreaming = false;
            }
            return { ...prev, [activePaper.id]: list };
          });
        },
        onError: (err) => {
          console.error('Streaming error:', err);
          setIsStreaming(false);
          setChatHistoryMap(prev => {
            const list = [...(prev[activePaper.id] || [])];
            const last = list[list.length - 1];
            if (last && last.id === agentMsgId) {
              last.text = `Error processing query: ${err.message || 'Please check connection'}`;
              last.isStreaming = false;
            }
            return { ...prev, [activePaper.id]: list };
          });
        },
      }
    );
  };

  const handleClearHistory = async () => {
    if (activePaper) {
      await api.clearChatHistory(activePaper.id);
      setChatHistoryMap(prev => ({
        ...prev,
        [activePaper.id]: [],
      }));
    }
  };

  const handleExplainFormula = (eq: any) => {
    setResearcherView('deepdive');
    handleSendMessage(
      `Provide an in-depth variable breakdown, theoretical derivation, and intuitive explanation for the mathematical equation:\n\n${eq.latex}\n\nDescription: ${eq.description}`,
      'explain_formula'
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* 1. Left Sidebar Navigation (Domain-Specific: Student vs Researcher) */}
      {currentDomain === 'student' ? (
        <StudentSidebar
          currentView={studentView}
          onViewChange={setStudentView}
          activePaper={activePaper}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenApiKey={() => setIsApiKeyOpen(true)}
          totalDocsCount={papers.length}
        />
      ) : (
        <ResearcherSidebar
          currentView={researcherView}
          onViewChange={setResearcherView}
          activePaper={activePaper}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenApiKey={() => setIsApiKeyOpen(true)}
          totalPapersCount={papers.length}
        />
      )}

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50">
        
        {/* Top Navbar Header with Role / Domain Switcher */}
        <TopNavbar
          currentDomain={currentDomain}
          onDomainChange={setCurrentDomain}
          papers={papers}
          activePaper={activePaper}
          onSelectPaper={handleSelectPaper}
          selectedEngine={selectedEngine}
          onEngineChange={setSelectedEngine}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenApiKey={() => setIsApiKeyOpen(true)}
        />

        {/* Workspace Body */}
        <div className="p-6 lg:p-8 max-w-[1920px] mx-auto w-full">
          
          {/* A. Hero Banner (Domain-Specific) */}
          {currentDomain === 'student' ? (
            <StudentHeroBanner
              currentView={studentView}
              activePaper={activePaper}
              samplePapers={papers}
              onSelectPaper={handleSelectPaper}
            />
          ) : (
            <HeroBanner
              currentView={researcherView}
              activePaper={activePaper}
              samplePapers={papers}
              onSelectPaper={handleSelectPaper}
            />
          )}

          {/* B. Highlighted Dedicated Upload Card (Domain-Specific Content) */}
          <HighlightedUploadCard
            domain={currentDomain}
            onPaperUploaded={handlePaperUploaded}
            onSelectSample={handleSelectPaper}
            samplePapers={papers}
          />

          {/* C. Dynamic Section-Wise Views */}
          {isLoading ? (
            <div className="h-80 flex flex-col items-center justify-center space-y-4">
              <Loader2 className={`w-10 h-10 animate-spin ${currentDomain === 'student' ? 'text-[#6351d8]' : 'text-emerald-600'}`} />
              <p className="text-sm font-bold text-slate-500">
                Loading {currentDomain === 'student' ? 'Student Course Materials' : 'Research Benchmark Papers'}...
              </p>
            </div>
          ) : !activePaper ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft-sm space-y-4">
              <p className="text-sm text-slate-500">
                {currentDomain === 'student' ? 'No student course materials found.' : 'No research papers found.'}
              </p>
              <button
                onClick={() => setIsUploadOpen(true)}
                className={`px-6 py-3 text-xs font-bold rounded-2xl shadow-md ${
                  currentDomain === 'student'
                    ? 'bg-gradient-to-r from-[#ffb800] via-[#f5a623] to-[#e69516] text-[#1a1038] font-black'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                }`}
              >
                {currentDomain === 'student' ? 'Upload Course Lecture / Notes' : 'Upload Research Paper'}
              </button>
            </div>
          ) : (
            <>
              {/* ================= STUDENT WORKSPACE VIEWS ================= */}
              {currentDomain === 'student' && (
                <>
                  {/* 1. AI Study Tutor & Q&A */}
                  {studentView === 'tutor' && (
                    <StudentTutorView
                      paper={activePaper}
                      selectedEngine={selectedEngine}
                      chatHistory={activeChatHistory}
                      onSendMessage={handleSendMessage}
                      isStreaming={isStreaming}
                      onClearHistory={handleClearHistory}
                    />
                  )}

                  {/* 2. Study Guide & Homework Solver */}
                  {studentView === 'guide' && (
                    <StudyGuideView
                      paper={activePaper}
                      onAskTutor={(prompt) => {
                        setStudentView('tutor');
                        handleSendMessage(prompt);
                      }}
                    />
                  )}

                  {/* 3. Chapter Notes & Formula Cheat-Sheet */}
                  {studentView === 'summary' && (
                    <ChapterSummaryView
                      paper={activePaper}
                      onAskTutor={(prompt) => {
                        setStudentView('tutor');
                        handleSendMessage(prompt);
                      }}
                    />
                  )}

                  {/* 4. 3D Anki Flashcards */}
                  {studentView === 'flashcards' && (
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-soft-md">
                      {isStudyLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-3">
                          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                          <p className="text-xs text-slate-500 font-medium">Generating 3D Anki flashcards with LaTeX equations...</p>
                        </div>
                      ) : studyDeck ? (
                        <FlashcardDeck
                          flashcards={studyDeck.flashcards}
                          paperTitle={activePaper.title}
                        />
                      ) : (
                        <p className="text-xs text-slate-500 text-center">Failed to load flashcard deck.</p>
                      )}
                    </div>
                  )}

                  {/* 5. Visual Concept Flow */}
                  {studentView === 'flow' && (
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-soft-md">
                      {isStudyLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-3">
                          <Loader2 className="w-8 h-8 text-[#6351d8] animate-spin" />
                          <p className="text-xs text-slate-500 font-medium">Constructing interactive visual concept flow graph...</p>
                        </div>
                      ) : studyDeck ? (
                        <ConceptFlowVisualizer
                          conceptFlow={studyDeck.concept_flow}
                          paperTitle={activePaper.title}
                        />
                      ) : (
                        <p className="text-xs text-slate-500 text-center">Failed to load concept flow.</p>
                      )}
                    </div>
                  )}

                  {/* 6. Mock Exam & Viva Quiz */}
                  {studentView === 'quiz' && (
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-soft-md">
                      {isStudyLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-3">
                          <Loader2 className="w-8 h-8 text-[#6351d8] animate-spin" />
                          <p className="text-xs text-slate-500 font-medium">Compiling mock viva questions and grading matrix...</p>
                        </div>
                      ) : studyDeck ? (
                        <QuizSimulator
                          quiz={studyDeck.quiz}
                          paperTitle={activePaper.title}
                        />
                      ) : (
                        <p className="text-xs text-slate-500 text-center">Failed to load viva quiz.</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ================= RESEARCHER WORKSPACE VIEWS ================= */}
              {currentDomain === 'researcher' && (
                <>
                  {/* 1. Paper Deep-Dive & Citation Engine */}
                  {researcherView === 'deepdive' && (
                    <ResearchDeepDiveView
                      paper={activePaper}
                      selectedEngine={selectedEngine}
                      chatHistory={activeChatHistory}
                      onSendMessage={handleSendMessage}
                      isStreaming={isStreaming}
                      onClearHistory={handleClearHistory}
                    />
                  )}

                  {/* 2. LaTeX & Math Variable Decoder */}
                  {researcherView === 'formula' && (
                    <FormulaDecoderView
                      paper={activePaper}
                      onExplainFormula={handleExplainFormula}
                    />
                  )}

                  {/* 3. Literature Synthesis Matrix */}
                  {researcherView === 'matrix' && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft-md">
                      <LiteratureMatrixView
                        papers={papers}
                        selectedEngine={selectedEngine}
                        onOpenUpload={() => setIsUploadOpen(true)}
                      />
                    </div>
                  )}

                  {/* 4. Research Gaps & Novelty Finder */}
                  {researcherView === 'gaps' && (
                    <ResearchGapsView
                      paper={activePaper}
                      onAskAgent={(prompt) => {
                        setResearcherView('deepdive');
                        handleSendMessage(prompt);
                      }}
                    />
                  )}

                  {/* 5. Peer-Review & Manuscript Audit */}
                  {researcherView === 'review' && (
                    <ManuscriptReviewerView
                      paper={activePaper}
                      onAskAgent={(prompt) => {
                        setResearcherView('deepdive');
                        handleSendMessage(prompt);
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}

        </div>

      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onPaperUploaded={handlePaperUploaded}
        samplePapers={papers}
        onSelectPaper={handleSelectPaper}
        domain={currentDomain}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        geminiKey={geminiKey}
        groqKey={groqKey}
        onSaveKeys={handleSaveKeys}
      />

    </div>
  );
};

export default App;
