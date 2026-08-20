export type ModelEngine = 
  | 'gemini-1.5-flash'
  | 'groq-llama-3'
  | 'gemini-1.5-pro';

export type WorkspaceDomain = 'student' | 'researcher';

export type StudentView = 
  | 'tutor'
  | 'guide'
  | 'summary'
  | 'flashcards'
  | 'flow'
  | 'quiz';

export type ResearcherView = 
  | 'deepdive'
  | 'formula'
  | 'matrix'
  | 'gaps'
  | 'review';

export type WorkspaceView = StudentView | ResearcherView | 'research' | 'matrix' | 'study';

export type WorkspaceMode = 'research' | 'matrix' | 'study';
export type StudySubTab = 'flashcards' | 'flow' | 'quiz';

export interface SectionData {
  section_name: string;
  title: string;
  text: string;
  pages: number[];
  block_count: number;
}

export interface EquationItem {
  id: string;
  page: number;
  raw_text: string;
  latex: string;
  description: string;
}

export interface MetricItem {
  name: string;
  value: string;
  page: number;
  context: string;
}

export interface SummaryCards {
  problem_statement: string;
  core_architecture: string;
  datasets_and_metrics: string;
  critical_limitations: string;
}

export interface BlockCoordinate {
  page: number;
  bbox: [number, number, number, number];
  section: string;
  text: string;
}

export interface PageData {
  page_number: number;
  width: number;
  height: number;
  text: string;
  blocks: BlockCoordinate[];
}

export interface Paper {
  id: string;
  filename: string;
  file_type?: string;
  title: string;
  authors: string[];
  year: string;
  total_pages: number;
  summary_cards: SummaryCards;
  sections?: Record<string, SectionData>;
  equations?: EquationItem[];
  metrics?: MetricItem[];
  pages?: PageData[];
  chunks?: BlockCoordinate[];
  chunk_count?: number;
  equation_count?: number;
  metric_count?: number;
}

export interface Citation {
  page: number;
  section: string;
  bbox: [number, number, number, number];
  preview: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  citations?: Citation[];
  timestamp: string;
  model_used?: string;
  action_type?: string;
  isStreaming?: boolean;
}

export interface MatrixRow {
  paper_id: string;
  title: string;
  year: string;
  authors: string;
  methodology: string;
  dataset: string;
  results_metric: string;
  limitations: string;
  research_gaps: string;
}

export interface Flashcard {
  id: string;
  category: string;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Good' | 'Hard';
  tags: string[];
}

export interface FlowStep {
  step: number;
  name: string;
  description: string;
  formula?: string;
  badge?: string;
}

export interface ConceptFlow {
  title: string;
  description: string;
  steps: FlowStep[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  rationale: string;
  formula_ref?: string;
}

export interface StudyDeck {
  flashcards: Flashcard[];
  concept_flow: ConceptFlow;
  quiz: QuizQuestion[];
}
