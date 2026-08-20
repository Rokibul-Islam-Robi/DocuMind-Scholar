import React, { useState } from 'react';
import { Paper, ChatMessage, Citation, EquationItem, ModelEngine } from '../../types';
import { SectionBreakdownCards } from './SectionBreakdownCards';
import { PDFViewer } from './PDFViewer';
import { AgentTerminal } from './AgentTerminal';

interface SplitWorkspaceProps {
  paper: Paper;
  selectedEngine: ModelEngine;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, actionType?: string, selectedText?: string) => void;
  isStreaming: boolean;
  onClearHistory: () => void;
}

export const SplitWorkspace: React.FC<SplitWorkspaceProps> = ({
  paper,
  selectedEngine,
  chatHistory,
  onSendMessage,
  isStreaming,
  onClearHistory,
}) => {
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const handleAskTopic = (topicTitle: string, context: string) => {
    onSendMessage(`Provide an in-depth analysis of the "${topicTitle}" in this paper: ${context}`);
  };

  const handleAskSelectedText = (text: string) => {
    onSendMessage(`Please analyze and contextualize this specific excerpt from the paper:\n\n"${text}"`, undefined, text);
  };

  const handleExplainEquation = (eq: EquationItem) => {
    onSendMessage(
      `Provide a comprehensive variable breakdown and theoretical derivation for the mathematical equation:\n\n${eq.latex}\n\nContext description: ${eq.description}`,
      'explain_formula'
    );
  };

  const handleCitationClick = (citation: Citation) => {
    setActiveCitation(citation);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] p-4 max-w-[1920px] mx-auto overflow-hidden">
      
      {/* Top Section Breakdown Cards */}
      <SectionBreakdownCards
        summaryCards={paper.summary_cards}
        onAskTopic={handleAskTopic}
      />

      {/* 50/50 Responsive Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden">
        
        {/* Left Panel: High-Performance PDF Viewer */}
        <div className="h-full min-h-0">
          <PDFViewer
            paper={paper}
            activeCitation={activeCitation}
            onAskSelectedText={handleAskSelectedText}
            onExplainEquation={handleExplainEquation}
          />
        </div>

        {/* Right Panel: Multi-Agent AI Terminal */}
        <div className="h-full min-h-0">
          <AgentTerminal
            paper={paper}
            selectedEngine={selectedEngine}
            chatHistory={chatHistory}
            onSendMessage={(text, actionType) => onSendMessage(text, actionType)}
            isStreaming={isStreaming}
            onCitationClick={handleCitationClick}
            onClearHistory={onClearHistory}
          />
        </div>

      </div>

    </div>
  );
};
