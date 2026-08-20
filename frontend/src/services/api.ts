import { Paper, ChatMessage, Citation, MatrixRow, StudyDeck, ModelEngine } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '') + '/api';

export const api = {
  async getPapers(domain?: string): Promise<Paper[]> {
    try {
      const url = domain ? `${API_BASE}/papers?domain=${domain}` : `${API_BASE}/papers`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      return data.papers || [];
    } catch (e) {
      console.warn('API error fetching documents:', e);
      return [];
    }
  },

  async getPaper(id: string): Promise<Paper | null> {
    try {
      const res = await fetch(`${API_BASE}/papers/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch document ${id}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async uploadPaper(file: File, domain: string = 'student'): Promise<{ paper: Paper; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('domain', domain);

    const res = await fetch(`${API_BASE}/papers/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }

    return await res.json();
  },

  async getChatHistory(paperId: string): Promise<ChatMessage[]> {
    try {
      const res = await fetch(`${API_BASE}/chat/history/${paperId}`);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.messages || []).map((m: any) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp || 'Recent',
        model_used: m.model_used,
        action_type: m.action_type,
        citations: m.citations || [],
        isStreaming: false,
      }));
    } catch (e) {
      console.error('Error fetching chat history:', e);
      return [];
    }
  },

  async clearChatHistory(paperId: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/chat/history/${paperId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Error clearing chat history:', e);
    }
  },

  async queryAgent(params: {
    paper_id: string;
    prompt: string;
    model_engine?: ModelEngine;
    action_type?: string;
    selected_text?: string;
    page?: number;
  }): Promise<{ response: string; citations: Citation[] }> {
    const res = await fetch(`${API_BASE}/agent/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error('Failed to query agent');
    }

    return await res.json();
  },

  async streamAgent(
    params: {
      paper_id: string;
      prompt: string;
      model_engine?: ModelEngine;
      action_type?: string;
      selected_text?: string;
      page?: number;
    },
    callbacks: {
      onCitations?: (citations: Citation[]) => void;
      onToken?: (token: string) => void;
      onDone?: () => void;
      onError?: (error: any) => void;
    }
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/agent/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Streaming failed: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.trim()) continue;

          const eventMatch = block.match(/^event:\s*(\w+)/m);
          const dataMatch = block.match(/^data:\s*(.+)$/m);

          const eventType = eventMatch ? eventMatch[1] : 'message';
          const dataStr = dataMatch ? dataMatch[1] : '';

          if (eventType === 'citations') {
            try {
              const citations = JSON.parse(dataStr);
              callbacks.onCitations?.(citations);
            } catch (e) {
              console.error('Error parsing citations:', e);
            }
          } else if (eventType === 'token') {
            try {
              const payload = JSON.parse(dataStr);
              if (payload.token) {
                callbacks.onToken?.(payload.token);
              }
            } catch (e) {
              callbacks.onToken?.(dataStr);
            }
          } else if (eventType === 'done' || dataStr === '[DONE]') {
            callbacks.onDone?.();
            return;
          }
        }
      }

      callbacks.onDone?.();
    } catch (err) {
      callbacks.onError?.(err);
    }
  },

  async generateMatrix(
    paper_ids: string[],
    model_engine: ModelEngine = 'gemini-1.5-flash'
  ): Promise<{ matrix: MatrixRow[]; latex_code: string; bibtex_code: string }> {
    const res = await fetch(`${API_BASE}/matrix/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paper_ids, model_engine }),
    });

    if (!res.ok) {
      throw new Error('Failed to generate synthesis matrix');
    }

    return await res.json();
  },

  async getStudyDeck(
    paper_id: string,
    model_engine: ModelEngine = 'gemini-1.5-flash'
  ): Promise<StudyDeck> {
    const res = await fetch(`${API_BASE}/study/deck/${paper_id}?model_engine=${model_engine}`);
    if (!res.ok) {
      throw new Error('Failed to fetch study deck');
    }
    return await res.json();
  },

  async saveApiKeys(keys: { gemini_api_key?: string; groq_api_key?: string }): Promise<void> {
    await fetch(`${API_BASE}/keys/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys),
    });
  },
};
