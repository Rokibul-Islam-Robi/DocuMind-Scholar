"""
DocuMind Scholar - Vector Store & Semantic Retrieval Engine
Integrates ChromaDB with rich metadata (document_id, section, page, bbox) and persistent fallback.
"""

import os
import re
import math
from typing import List, Dict, Any, Optional
import chromadb


class DocumentVectorStore:
    """Manages section-aware embeddings and semantic retrieval for research papers and documents."""

    def __init__(self, persist_dir: Optional[str] = None):
        self.persist_dir = persist_dir or os.path.join(os.path.dirname(__file__), "chroma_data")
        os.makedirs(self.persist_dir, exist_ok=True)
        self.in_memory_docs: List[Dict[str, Any]] = []
        
        try:
            self.client = chromadb.PersistentClient(path=self.persist_dir)
            self.collection = self.client.get_or_create_collection(
                name="documind_scholar_papers",
                metadata={"hnsw:space": "cosine"}
            )
            self.chroma_available = True
        except Exception as e:
            print(f"ChromaDB initialization fallback: {e}")
            self.chroma_available = False

    def add_paper_chunks(self, paper_id: str, paper_title: str, chunks: List[Dict[str, Any]]) -> int:
        """Add structured chunks with section and coordinate metadata."""
        if not chunks:
            return 0

        documents = []
        metadatas = []
        ids = []

        for idx, chunk in enumerate(chunks):
            text = chunk.get("text", "").strip()
            if not text or len(text) < 10:
                continue

            chunk_id = f"{paper_id}_c{idx}"
            section = chunk.get("section", "general")
            page = chunk.get("page", 1)
            bbox = chunk.get("bbox", [50, 100, 550, 400])
            bbox_str = ",".join(map(str, bbox)) if isinstance(bbox, list) else str(bbox)

            doc_metadata = {
                "paper_id": str(paper_id),
                "paper_title": str(paper_title),
                "section": str(section),
                "page": int(page),
                "bbox": bbox_str
            }

            documents.append(text)
            metadatas.append(doc_metadata)
            ids.append(chunk_id)

            self.in_memory_docs.append({
                "id": chunk_id,
                "text": text,
                "metadata": doc_metadata
            })

        if self.chroma_available and documents:
            try:
                self.collection.upsert(
                    ids=ids,
                    documents=documents,
                    metadatas=metadatas
                )
            except Exception as e:
                print(f"Error indexing in ChromaDB: {e}")

        return len(documents)

    def search(self, query: str, paper_id: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """Semantic search with section & citation context."""
        results = []

        if self.chroma_available:
            try:
                where_clause = {"paper_id": str(paper_id)} if paper_id else None
                res = self.collection.query(
                    query_texts=[query],
                    n_results=top_k,
                    where=where_clause
                )

                if res and res.get("documents") and res["documents"][0]:
                    for i in range(len(res["documents"][0])):
                        meta = res["metadatas"][0][i]
                        try:
                            bbox_coords = [float(x) for x in meta.get("bbox", "50,100,550,400").split(",")]
                        except Exception:
                            bbox_coords = [50, 100, 550, 400]

                        results.append({
                            "text": res["documents"][0][i],
                            "paper_id": meta.get("paper_id"),
                            "paper_title": meta.get("paper_title"),
                            "section": meta.get("section"),
                            "page": int(meta.get("page", 1)),
                            "bbox": bbox_coords,
                            "distance": res.get("distances", [[0]])[0][i] if res.get("distances") else 0
                        })
                    if results:
                        return results
            except Exception as e:
                print(f"Chroma search exception: {e}")

        # In-memory fallback
        return self._in_memory_search(query, paper_id, top_k)

    def search_paper_sections(self, paper_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Alias for search filtered by paper_id."""
        return self.search(query=query, paper_id=paper_id, top_k=top_k)

    def format_citations(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format retrieved chunks into citation references."""
        citations = []
        for c in chunks:
            citations.append({
                "page": c.get("page", 1),
                "section": c.get("section", "general"),
                "bbox": c.get("bbox", [50, 100, 550, 400]),
                "preview": c.get("text", "")[:120] + "..."
            })
        return citations[:5]

    def _in_memory_search(self, query: str, paper_id: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        query_words = set(re.findall(r'\w+', query.lower()))
        scored = []

        pool = [d for d in self.in_memory_docs if not paper_id or d["metadata"].get("paper_id") == paper_id]

        for doc in pool:
            text = doc["text"]
            doc_words = set(re.findall(r'\w+', text.lower()))
            overlap = len(query_words.intersection(doc_words))
            score = (overlap + 1e-4) / (math.sqrt(len(query_words) + 1) * math.sqrt(len(doc_words) + 1))
            meta = doc["metadata"]
            try:
                bbox_coords = [float(x) for x in meta.get("bbox", "50,100,550,400").split(",")]
            except Exception:
                bbox_coords = [50, 100, 550, 400]

            scored.append({
                "score": score,
                "item": {
                    "text": text,
                    "paper_id": meta.get("paper_id"),
                    "paper_title": meta.get("paper_title"),
                    "section": meta.get("section"),
                    "page": int(meta.get("page", 1)),
                    "bbox": bbox_coords
                }
            })

        scored.sort(key=lambda x: x["score"], reverse=True)
        return [s["item"] for s in scored[:top_k]]
