"""
DocuMind Scholar - Persistent SQLite Database Engine
Stores uploaded documents (PDF, DOCX, TXT, MD), semantic chunks, domain tags (student vs researcher), and multi-turn chat history.
"""

import os
import sqlite3
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, "documind_scholar.db")


class ScholarDatabase:
    """Manages persistent SQLite storage for documents, chunks, and chat history."""

    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_tables()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_tables(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Documents table (with domain support)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id TEXT PRIMARY KEY,
                    domain TEXT DEFAULT 'researcher',
                    filename TEXT NOT NULL,
                    file_type TEXT NOT NULL,
                    title TEXT NOT NULL,
                    authors TEXT,
                    year TEXT,
                    total_pages INTEGER DEFAULT 1,
                    summary_cards TEXT,
                    sections TEXT,
                    equations TEXT,
                    metrics TEXT,
                    pages TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Check if domain column exists (migration helper)
            cursor.execute("PRAGMA table_info(documents)")
            columns = [row["name"] for row in cursor.fetchall()]
            if "domain" not in columns:
                cursor.execute("ALTER TABLE documents ADD COLUMN domain TEXT DEFAULT 'researcher'")

            # Chunks table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS document_chunks (
                    id TEXT PRIMARY KEY,
                    document_id TEXT NOT NULL,
                    chunk_index INTEGER NOT NULL,
                    section TEXT,
                    page INTEGER DEFAULT 1,
                    bbox TEXT,
                    text TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
                )
            """)

            # Chat messages table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_history (
                    id TEXT PRIMARY KEY,
                    paper_id TEXT NOT NULL,
                    sender TEXT NOT NULL,
                    text TEXT NOT NULL,
                    model_used TEXT,
                    action_type TEXT,
                    citations TEXT,
                    timestamp TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (paper_id) REFERENCES documents(id) ON DELETE CASCADE
                )
            """)

            conn.commit()

    # --- Document Methods ---

    def save_document(self, doc_data: Dict[str, Any]) -> str:
        doc_id = doc_data.get("id")
        if not doc_id:
            raise ValueError("Document must have an 'id'")

        domain = doc_data.get("domain", "researcher")

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO documents (
                    id, domain, filename, file_type, title, authors, year, total_pages,
                    summary_cards, sections, equations, metrics, pages
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                doc_id,
                domain,
                doc_data.get("filename", f"{doc_id}.pdf"),
                doc_data.get("file_type", "pdf"),
                doc_data.get("title", "Untitled Document"),
                json.dumps(doc_data.get("authors", ["Scholar Author"])),
                str(doc_data.get("year", datetime.now().year)),
                int(doc_data.get("total_pages", 1)),
                json.dumps(doc_data.get("summary_cards", {})),
                json.dumps(doc_data.get("sections", {})),
                json.dumps(doc_data.get("equations", [])),
                json.dumps(doc_data.get("metrics", [])),
                json.dumps(doc_data.get("pages", []))
            ))

            # Save chunks if provided
            chunks = doc_data.get("chunks", [])
            if chunks:
                cursor.execute("DELETE FROM document_chunks WHERE document_id = ?", (doc_id,))
                for i, ch in enumerate(chunks):
                    chunk_id = f"{doc_id}_ch_{i}"
                    cursor.execute("""
                        INSERT INTO document_chunks (
                            id, document_id, chunk_index, section, page, bbox, text
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        chunk_id,
                        doc_id,
                        i,
                        ch.get("section", "content"),
                        ch.get("page", 1),
                        json.dumps(ch.get("bbox", [50, 100, 550, 400])),
                        ch.get("text", "")
                    ))

            conn.commit()
        return doc_id

    def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
            row = cursor.fetchone()
            if not row:
                return None

            doc = dict(row)
            doc["authors"] = json.loads(doc.get("authors") or "[]")
            doc["summary_cards"] = json.loads(doc.get("summary_cards") or "{}")
            doc["sections"] = json.loads(doc.get("sections") or "{}")
            doc["equations"] = json.loads(doc.get("equations") or "[]")
            doc["metrics"] = json.loads(doc.get("metrics") or "[]")
            doc["pages"] = json.loads(doc.get("pages") or "[]")

            # Load chunks
            chunks = self.get_document_chunks(doc_id)
            doc["chunks"] = chunks
            doc["chunk_count"] = len(chunks)
            doc["equation_count"] = len(doc["equations"])
            doc["metric_count"] = len(doc["metrics"])
            return doc

    def list_documents(self, domain: Optional[str] = None) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            if domain:
                cursor.execute("""
                    SELECT id, domain, filename, file_type, title, authors, year, total_pages, created_at
                    FROM documents
                    WHERE domain = ?
                    ORDER BY created_at DESC
                """, (domain,))
            else:
                cursor.execute("""
                    SELECT id, domain, filename, file_type, title, authors, year, total_pages, created_at
                    FROM documents
                    ORDER BY created_at DESC
                """)

            rows = cursor.fetchall()
            result = []
            for r in rows:
                item = dict(r)
                item["authors"] = json.loads(item.get("authors") or "[]")
                result.append(item)
            return result

    def get_document_chunks(self, doc_id: str) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT chunk_index, section, page, bbox, text
                FROM document_chunks
                WHERE document_id = ?
                ORDER BY chunk_index ASC
            """, (doc_id,))
            rows = cursor.fetchall()
            chunks = []
            for r in rows:
                ch = dict(r)
                ch["bbox"] = json.loads(ch.get("bbox") or "[50, 100, 550, 400]")
                chunks.append(ch)
            return chunks

    # --- Chat History Persistence ---

    def save_chat_message(self, paper_id: str, sender: str, text: str,
                          msg_id: Optional[str] = None, model_used: Optional[str] = None,
                          action_type: Optional[str] = None,
                          citations: Optional[List[Dict[str, Any]]] = None,
                          timestamp: Optional[str] = None) -> str:
        if not msg_id:
            msg_id = f"msg_{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        if not timestamp:
            timestamp = datetime.now().strftime("%I:%M %p")

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO chat_history (
                    id, paper_id, sender, text, model_used, action_type, citations, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                msg_id,
                paper_id,
                sender,
                text,
                model_used,
                action_type,
                json.dumps(citations or []),
                timestamp
            ))
            conn.commit()
        return msg_id

    def get_chat_history(self, paper_id: str) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, sender, text, model_used, action_type, citations, timestamp
                FROM chat_history
                WHERE paper_id = ?
                ORDER BY created_at ASC
            """, (paper_id,))
            rows = cursor.fetchall()
            messages = []
            for r in rows:
                msg = dict(r)
                msg["citations"] = json.loads(msg.get("citations") or "[]")
                messages.append(msg)
            return messages

    def clear_chat_history(self, paper_id: str):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM chat_history WHERE paper_id = ?", (paper_id,))
            conn.commit()
