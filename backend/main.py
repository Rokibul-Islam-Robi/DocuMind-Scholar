"""
DocuMind Scholar - FastAPI Backend Server
Decoupled into:
1. Student Study Hub: Homework, textbooks, chapter notes, Anki flashcards, concept flows, quizzes.
2. Researcher Workspace: Research papers, LaTeX decoding, literature matrix, research gaps, peer-review audit.
"""

import os
import shutil
import uuid
import json
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .section_parser import MultiFormatDocumentParser
from .vector_store import DocumentVectorStore
from .llm_orchestrator import MultiAgentOrchestrator
from .sample_papers import SAMPLE_PAPERS, STUDENT_MATERIALS, RESEARCH_PAPERS
from .database import ScholarDatabase

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="DocuMind Scholar API",
    description="Dual-Portal Academic Research & Active Study Workspace",
    version="2.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Singletons
parser = MultiFormatDocumentParser()
vector_store = DocumentVectorStore()
orchestrator = MultiAgentOrchestrator()
db = ScholarDatabase()

# In-memory document cache
PAPERS_DB: Dict[str, Dict[str, Any]] = {}


def init_database_and_index():
    """Seeds student materials and researcher papers into persistent SQLite database."""
    # 1. Seed benchmark datasets if missing
    for pid, pdata in SAMPLE_PAPERS.items():
        existing = db.get_document(pid)
        if not existing:
            pdata_copy = dict(pdata)
            pdata_copy["id"] = pid
            pdata_copy["file_type"] = pdata.get("file_type", "pdf")
            pdata_copy["domain"] = pdata.get("domain", "researcher")
            # Build initial chunks
            chunks = []
            for sec_name, sec_data in pdata_copy.get("sections", {}).items():
                chunks.append({
                    "text": sec_data.get("text", ""),
                    "section": sec_name,
                    "page": sec_data.get("pages", [1])[0],
                    "bbox": [50, 100, 550, 400]
                })
            pdata_copy["chunks"] = chunks
            db.save_document(pdata_copy)

    # 2. Populate in-memory registry
    all_docs = db.list_documents()
    for doc_meta in all_docs:
        doc_id = doc_meta["id"]
        full_doc = db.get_document(doc_id)
        if full_doc:
            PAPERS_DB[doc_id] = full_doc


init_database_and_index()


# --- Request Models ---

class AgentQueryRequest(BaseModel):
    paper_id: str
    prompt: str
    model_engine: str = "gemini-1.5-flash"
    action_type: Optional[str] = None
    selected_text: Optional[str] = None
    page: Optional[int] = None


class MatrixRequest(BaseModel):
    paper_ids: List[str]
    model_engine: str = "gemini-1.5-flash"


class ApiKeyRequest(BaseModel):
    gemini_api_key: Optional[str] = None
    groq_api_key: Optional[str] = None


class SaveChatMessageRequest(BaseModel):
    paper_id: str
    sender: str
    text: str
    id: Optional[str] = None
    model_used: Optional[str] = None
    action_type: Optional[str] = None
    citations: Optional[List[Dict[str, Any]]] = None
    timestamp: Optional[str] = None


# --- Endpoints ---

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "DocuMind Scholar Engine v2.0",
        "database": "SQLite Persistent Active",
        "active_documents": len(PAPERS_DB),
        "supported_formats": ["PDF", "DOCX", "DOC", "TXT", "MD"],
        "vector_store": "ChromaDB Ready" if vector_store.chroma_available else "In-Memory Semantic Fallback"
    }


@app.get("/api/papers")
def list_papers(domain: Optional[str] = None):
    """List all available documents filtered by domain (student vs researcher)."""
    docs = db.list_documents(domain=domain)
    return {"papers": docs, "total": len(docs)}


@app.get("/api/papers/{paper_id}")
def get_paper(paper_id: str):
    """Retrieve full structured sections, equations, and coordinates for a document."""
    doc = db.get_document(paper_id)
    if not doc:
        if paper_id in PAPERS_DB:
            return PAPERS_DB[paper_id]
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@app.post("/api/papers/upload")
async def upload_document(
    file: UploadFile = File(...),
    domain: str = Form("student")
):
    """Upload and parse student course material or research paper."""
    allowed_exts = [".pdf", ".docx", ".doc", ".txt", ".md", ".text"]
    filename = file.filename or "uploaded_document"
    ext = os.path.splitext(filename)[1].lower()

    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. Supported formats: PDF, DOCX, DOC, TXT, MD."
        )

    doc_id = f"doc_{uuid.uuid4().hex[:8]}"
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{filename}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        parsed_data = parser.extract_document(file_path, paper_id=doc_id)
        parsed_data["file_type"] = ext.replace(".", "")
        parsed_data["filename"] = filename
        parsed_data["domain"] = domain

        # 1. Save to SQLite database
        db.save_document(parsed_data)

        # 2. Add to in-memory registry
        PAPERS_DB[doc_id] = parsed_data

        # 3. Index semantic chunks in vector store
        chunks_to_index = parsed_data.get("chunks", [])
        vector_store.add_paper_chunks(doc_id, parsed_data["title"], chunks_to_index)

        return {
            "message": f"Document '{filename}' parsed and stored in database.",
            "paper": {
                "id": doc_id,
                "domain": domain,
                "filename": filename,
                "file_type": parsed_data["file_type"],
                "title": parsed_data["title"],
                "authors": parsed_data["authors"],
                "year": parsed_data["year"],
                "total_pages": parsed_data["total_pages"],
                "summary_cards": parsed_data["summary_cards"],
                "chunk_count": len(chunks_to_index),
                "equation_count": len(parsed_data.get("equations", [])),
                "metric_count": len(parsed_data.get("metrics", []))
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing document: {str(e)}")


# --- Chat History Endpoints ---

@app.get("/api/chat/history/{paper_id}")
def get_chat_history(paper_id: str):
    """Retrieve persisted multi-turn chat history for a paper from SQLite."""
    history = db.get_chat_history(paper_id)
    return {"messages": history, "paper_id": paper_id, "count": len(history)}


@app.post("/api/chat/save")
def save_chat_message(req: SaveChatMessageRequest):
    """Explicitly save a chat message to persistent SQLite storage."""
    msg_id = db.save_chat_message(
        paper_id=req.paper_id,
        sender=req.sender,
        text=req.text,
        msg_id=req.id,
        model_used=req.model_used,
        action_type=req.action_type,
        citations=req.citations,
        timestamp=req.timestamp
    )
    return {"status": "saved", "message_id": msg_id}


@app.delete("/api/chat/history/{paper_id}")
def clear_chat_history(paper_id: str):
    """Clear persistent chat history for a paper."""
    db.clear_chat_history(paper_id)
    return {"status": "cleared", "paper_id": paper_id}


# --- Agent Query & Streaming Endpoints ---

@app.post("/api/agent/query")
async def query_agent(req: AgentQueryRequest):
    """Direct JSON query against document chunks with auto-persistence."""
    paper_data = PAPERS_DB.get(req.paper_id)
    if not paper_data:
        paper_data = db.get_document(req.paper_id)
        if not paper_data:
            raise HTTPException(status_code=404, detail="Document not found")

    context_chunks = vector_store.search_paper_sections(req.paper_id, req.prompt, top_k=5)
    citations = vector_store.format_citations(context_chunks)

    # Save User message to SQLite
    user_msg_id = f"usr_{uuid.uuid4().hex[:8]}"
    db.save_chat_message(
        paper_id=req.paper_id,
        sender="user",
        text=req.prompt,
        msg_id=user_msg_id,
        action_type=req.action_type
    )

    response_text = await orchestrator.query_paper(
        paper_data=paper_data,
        context_chunks=context_chunks,
        prompt=req.prompt,
        model_engine=req.model_engine,
        action_type=req.action_type,
        selected_text=req.selected_text
    )

    # Save Agent response to SQLite
    agent_msg_id = f"agent_{uuid.uuid4().hex[:8]}"
    db.save_chat_message(
        paper_id=req.paper_id,
        sender="agent",
        text=response_text,
        msg_id=agent_msg_id,
        model_used=req.model_engine,
        action_type=req.action_type,
        citations=citations
    )

    return {
        "response": response_text,
        "citations": citations,
        "model_used": req.model_engine,
        "action_type": req.action_type,
        "timestamp": datetime.now().strftime("%I:%M %p")
    }


@app.post("/api/agent/stream")
async def stream_agent(req: AgentQueryRequest):
    """Server-Sent Events (SSE) streaming endpoint with auto-persistence."""
    paper_data = PAPERS_DB.get(req.paper_id)
    if not paper_data:
        paper_data = db.get_document(req.paper_id)
        if not paper_data:
            raise HTTPException(status_code=404, detail="Document not found")

    context_chunks = vector_store.search_paper_sections(req.paper_id, req.prompt, top_k=5)
    citations = vector_store.format_citations(context_chunks)

    # Auto-persist user query
    user_msg_id = f"usr_{uuid.uuid4().hex[:8]}"
    db.save_chat_message(
        paper_id=req.paper_id,
        sender="user",
        text=req.prompt,
        msg_id=user_msg_id,
        action_type=req.action_type
    )

    async def event_generator():
        # First send citations event
        yield f"event: citations\ndata: {json.dumps(citations)}\n\n"

        accumulated_chunks = []
        async for chunk in orchestrator.stream_paper_query(
            paper_data=paper_data,
            context_chunks=context_chunks,
            prompt=req.prompt,
            model_engine=req.model_engine,
            action_type=req.action_type,
            selected_text=req.selected_text
        ):
            accumulated_chunks.append(chunk)
            yield f"event: token\ndata: {json.dumps({'token': chunk})}\n\n"

        full_response = "".join(accumulated_chunks)
        # Auto-persist complete response
        agent_msg_id = f"agent_{uuid.uuid4().hex[:8]}"
        db.save_chat_message(
            paper_id=req.paper_id,
            sender="agent",
            text=full_response,
            msg_id=agent_msg_id,
            model_used=req.model_engine,
            action_type=req.action_type,
            citations=citations
        )

        yield "event: done\ndata: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# --- Synthesis Matrix & Study Decks ---

@app.post("/api/matrix/generate")
async def generate_matrix(req: MatrixRequest):
    """Generate multi-paper comparative literature matrix."""
    papers_data = []
    for pid in req.paper_ids:
        p = PAPERS_DB.get(pid) or db.get_document(pid)
        if p:
            papers_data.append(p)

    matrix_rows = []
    for p in papers_data:
        m_row = p.get("matrix_row")
        if not m_row:
            summary = p.get("summary_cards", {})
            m_row = {
                "paper_id": p.get("id"),
                "title": p.get("title"),
                "year": p.get("year", "2024"),
                "authors": ", ".join(p.get("authors", ["Author"])),
                "methodology": summary.get("core_architecture", "Deep Neural Pipeline"),
                "dataset": "Standard Benchmark",
                "results_metric": summary.get("datasets_and_metrics", "Superior accuracy"),
                "limitations": summary.get("critical_limitations", "Compute requirements"),
                "research_gaps": "Out-of-domain transfer, edge quantization"
            }
        matrix_rows.append(m_row)

    latex_code = orchestrator.export_latex_matrix(matrix_rows)
    bibtex_code = orchestrator.export_bibtex(papers_data)

    return {
        "matrix": matrix_rows,
        "latex_code": latex_code,
        "bibtex_code": bibtex_code
    }


@app.get("/api/study/deck/{paper_id}")
async def get_study_deck(paper_id: str, model_engine: str = "gemini-1.5-flash"):
    """Retrieve or generate flashcards, concept flow, and quiz for a paper/book."""
    paper_data = PAPERS_DB.get(paper_id) or db.get_document(paper_id)
    if not paper_data:
        raise HTTPException(status_code=404, detail="Document not found")

    flashcards = paper_data.get("flashcards", [])
    concept_flow = paper_data.get("concept_flow", {})
    quiz = paper_data.get("quiz", [])

    if not flashcards or not concept_flow or not quiz:
        generated = await orchestrator.generate_study_deck(paper_data, model_engine)
        flashcards = flashcards or generated.get("flashcards", [])
        concept_flow = concept_flow or generated.get("concept_flow", {})
        quiz = quiz or generated.get("quiz", [])

    return {
        "flashcards": flashcards,
        "concept_flow": concept_flow,
        "quiz": quiz
    }


@app.post("/api/keys/save")
def save_api_keys(req: ApiKeyRequest):
    """Save user-provided API keys in current session."""
    if req.gemini_api_key:
        orchestrator.gemini_key = req.gemini_api_key
        os.environ["GEMINI_API_KEY"] = req.gemini_api_key
    if req.groq_api_key:
        orchestrator.groq_key = req.groq_api_key
        os.environ["GROQ_API_KEY"] = req.groq_api_key

    return {"status": "keys_updated"}
