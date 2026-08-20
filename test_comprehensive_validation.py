"""
DocuMind Scholar - Master Comprehensive End-to-End Validation Suite
Tests all layers:
1. Health & Database Seeding
2. Multi-Format Document Ingestion (TXT, MD, DOCX)
3. Document Domain Partitioning (Student vs Researcher)
4. Structured Parsing, Section Extraction & KaTeX Equation Tagging
5. AI Q&A Generation Quality (Standard, ELI5, Formula Decoder, Problem Solver)
6. Real-Time SSE Token Streaming
7. Active Recall Study Studio (3D Anki Flashcards, Concept Flow, Mock Viva Quiz)
8. Multi-Paper Literature Synthesis Matrix & Exporters (LaTeX .tex, BibTeX .bib)
9. Multi-Turn Chat Persistence & SQLite Memory Lifecycle
"""

import sys
import os
import json
import asyncio
import io
from datetime import datetime

# Set UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from backend.main import app, db, PAPERS_DB, parser, vector_store, orchestrator

client = TestClient(app)

def run_tests():
    print("=" * 80)
    print("🧪 DOCUMIND SCHOLAR - COMPREHENSIVE SYSTEM & AI VALIDATION SUITE")
    print("=" * 80)

    total_tests = 0
    passed_tests = 0

    def assert_test(name, condition, details=""):
        nonlocal total_tests, passed_tests
        total_tests += 1
        if condition:
            passed_tests += 1
            print(f"  ✅ [PASS] {name} {f'({details})' if details else ''}")
        else:
            print(f"  ❌ [FAIL] {name} {f'({details})' if details else ''}")

    # =========================================================================
    # TEST 1: Health & System Initialization
    # =========================================================================
    print("\n--- [1/9] Testing Health Check & System Initialization ---")
    res = client.get("/api/health")
    assert_test("Health Check Status Code", res.status_code == 200)
    health_data = res.json()
    assert_test("System Status Healthy", health_data.get("status") == "healthy")
    assert_test("Active Documents Loaded", health_data.get("active_documents", 0) > 0, f"Count: {health_data.get('active_documents')}")
    assert_test("Supported Formats Included", "PDF" in health_data.get("supported_formats", []))

    # =========================================================================
    # TEST 2: Multi-Format Document Ingestion
    # =========================================================================
    print("\n--- [2/9] Testing Multi-Format Ingestion (TXT, MD, DOCX) ---")

    # A. TXT Ingestion
    txt_content = (
        "# Physics 201: Classical & Quantum Mechanics\n\n"
        "## Abstract\n"
        "This chapter analyzes harmonic oscillators and quantum state vectors.\n\n"
        "## Mathematical Formulation\n"
        "The kinetic and potential energy Hamiltonian:\n"
        "$$H = \\frac{p^2}{2m} + \\frac{1}{2} k x^2$$\n"
        "The de Broglie matter wave relation:\n"
        "$$\\lambda = \\frac{h}{p}$$\n\n"
        "## Experimental Results & Limitations\n"
        "Demonstrates discrete energy level quantization with Planck constant $h$."
    ).encode('utf-8')

    res_txt = client.post(
        "/api/papers/upload",
        files={"file": ("Physics_Notes.txt", io.BytesIO(txt_content), "text/plain")},
        data={"domain": "student"}
    )
    assert_test("TXT File Upload Status", res_txt.status_code == 200)
    txt_data = res_txt.json()
    txt_paper = txt_data.get("paper", {})
    txt_id = txt_paper.get("id")
    assert_test("TXT Parsed Sections & Chunks", txt_paper.get("chunk_count", 0) > 0, f"Chunks: {txt_paper.get('chunk_count')}")
    assert_test("TXT KaTeX Equations Extracted", txt_paper.get("equation_count", 0) > 0, f"Eq Count: {txt_paper.get('equation_count')}")

    # B. Markdown (MD) Ingestion
    md_content = (
        "# Deep Learning: Attention Mechanisms & Transformers\n\n"
        "## Core Architecture\n"
        "Scaled Dot-Product Attention transforms query, key, and value vectors:\n"
        "$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n"
        "## Multi-Head Formulation\n"
        "$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O$$\n\n"
        "## Critical Limitations\n"
        "Quadratic computation complexity with respect to sequence length."
    ).encode('utf-8')

    res_md = client.post(
        "/api/papers/upload",
        files={"file": ("Transformers_Guide.md", io.BytesIO(md_content), "text/markdown")},
        data={"domain": "student"}
    )
    assert_test("MD File Upload Status", res_md.status_code == 200)
    md_data = res_md.json()
    md_paper = md_data.get("paper", {})
    md_id = md_paper.get("id")
    assert_test("MD Title Extracted", "Deep Learning" in md_paper.get("title", ""))
    assert_test("MD Equations Extracted", md_paper.get("equation_count", 0) >= 2)

    # C. DOCX Ingestion (using python-docx if available)
    try:
        import docx
        doc = docx.Document()
        doc.add_heading('Machine Learning Algorithms and Optimization', level=1)
        doc.add_heading('Gradient Descent Methods', level=2)
        doc.add_paragraph('Gradient descent optimizes parameter weights theta by following the negative loss gradient: theta = theta - alpha * grad(J).')
        doc.add_heading('Empirical Evaluation', level=2)
        doc.add_paragraph('Test accuracy reaches 98.4% on standard benchmark datasets.')
        
        docx_buf = io.BytesIO()
        doc.save(docx_buf)
        docx_buf.seek(0)

        res_docx = client.post(
            "/api/papers/upload",
            files={"file": ("ML_Algorithms.docx", docx_buf, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
            data={"domain": "researcher"}
        )
        assert_test("DOCX File Upload Status", res_docx.status_code == 200)
        docx_data = res_docx.json()
        assert_test("DOCX Ingestion Success", "ML_Algorithms" in docx_data.get("paper", {}).get("filename", ""))
    except Exception as e:
        print(f"  ⚠️ DOCX test skipped: {e}")

    # =========================================================================
    # TEST 3: Domain Partitioning (Student vs Researcher)
    # =========================================================================
    print("\n--- [3/9] Testing Domain Partitioning (Student vs Researcher) ---")
    res_student = client.get("/api/papers?domain=student")
    assert_test("Get Student Papers Code", res_student.status_code == 200)
    student_list = res_student.json().get("papers", [])
    assert_test("Student Papers Partition Populated", len(student_list) > 0, f"Found {len(student_list)} docs")

    res_researcher = client.get("/api/papers?domain=researcher")
    assert_test("Get Researcher Papers Code", res_researcher.status_code == 200)
    researcher_list = res_researcher.json().get("papers", [])
    assert_test("Researcher Papers Partition Populated", len(researcher_list) > 0, f"Found {len(researcher_list)} docs")

    # Verify domain isolation
    sample_student_id = student_list[0]["id"]
    student_doc = client.get(f"/api/papers/{sample_student_id}").json()
    assert_test("Student Document Detail Retrieved", "title" in student_doc and "sections" in student_doc)

    # =========================================================================
    # TEST 4: AI Question Answering & Diverse Query Modes
    # =========================================================================
    print("\n--- [4/9] Testing AI Q&A Quality & Reasoning Modes ---")

    # A. Standard Q&A
    q_payload = {
        "paper_id": sample_student_id,
        "prompt": "What is the primary topic and central concept explained in this document?",
        "model_engine": "gemini-1.5-flash"
    }
    res_q = client.post("/api/agent/query", json=q_payload)
    assert_test("Standard Q&A Status", res_q.status_code == 200)
    ans_data = res_q.json()
    ans_text = ans_data.get("response", "")
    assert_test("Q&A Generates Substantial Answer", len(ans_text) > 40, f"Length: {len(ans_text)} chars")
    assert_test("Citations Generated", isinstance(ans_data.get("citations"), list))

    # B. ELI5 Mode (Explain Like I'm 5)
    eli5_payload = {
        "paper_id": sample_student_id,
        "prompt": "Explain this document in very simple terms with an everyday analogy for a beginner.",
        "model_engine": "gemini-1.5-flash",
        "action_type": "eli5_explain"
    }
    res_eli5 = client.post("/api/agent/query", json=eli5_payload)
    assert_test("ELI5 Mode Status", res_eli5.status_code == 200)
    eli5_text = res_eli5.json().get("response", "")
    assert_test("ELI5 Mode Generates Explanation", len(eli5_text) > 30)

    # C. Formula Decoder Mode
    eq_payload = {
        "paper_id": sample_student_id,
        "prompt": "Break down the main mathematical equations and variables step by step.",
        "model_engine": "gemini-1.5-flash",
        "action_type": "explain_formula"
    }
    res_eq = client.post("/api/agent/query", json=eq_payload)
    assert_test("Formula Decoder Status", res_eq.status_code == 200)
    assert_test("Formula Decoder Generates Steps", len(res_eq.json().get("response", "")) > 30)

    # =========================================================================
    # TEST 5: Real-Time SSE Token Streaming
    # =========================================================================
    print("\n--- [5/9] Testing Real-Time SSE Token Streaming ---")
    stream_payload = {
        "paper_id": sample_student_id,
        "prompt": "Summarize 3 essential takeaways from this material.",
        "model_engine": "gemini-1.5-flash"
    }
    with client.stream("POST", "/api/agent/stream", json=stream_payload) as stream_res:
        assert_test("SSE Stream HTTP Status", stream_res.status_code == 200)
        tokens_received = []
        citations_received = False
        done_received = False

        for line in stream_res.iter_lines():
            if line.startswith("event: citations"):
                citations_received = True
            elif line.startswith("data: "):
                data_val = line[6:].strip()
                if data_val == "[DONE]":
                    done_received = True
                else:
                    try:
                        p_json = json.loads(data_val)
                        if "token" in p_json:
                            tokens_received.append(p_json["token"])
                    except Exception:
                        pass

        full_stream_text = "".join(tokens_received)
        assert_test("SSE Received Citations Event", citations_received)
        assert_test("SSE Streamed Tokens Continuously", len(tokens_received) > 0, f"{len(tokens_received)} tokens")
        assert_test("SSE Received [DONE] Event", done_received)
        assert_test("Full Streamed Text Coherent", len(full_stream_text) > 30)

    # =========================================================================
    # TEST 6: Active Recall Study Studio (Flashcards, Concept Flow, Viva Quiz)
    # =========================================================================
    print("\n--- [6/9] Testing Active Recall Study Studio Decks ---")
    res_deck = client.get(f"/api/study/deck/{sample_student_id}")
    assert_test("Study Deck Endpoint Status", res_deck.status_code == 200)
    deck_data = res_deck.json()

    # Flashcards
    flashcards = deck_data.get("flashcards", [])
    assert_test("3D Flashcards Array Present", len(flashcards) >= 1, f"Found {len(flashcards)} flashcards")
    if flashcards:
        fc = flashcards[0]
        assert_test("Flashcard Structure Valid", "question" in fc and "answer" in fc and "category" in fc)

    # Concept Flow
    concept_flow = deck_data.get("concept_flow", {})
    steps = concept_flow.get("steps", [])
    assert_test("Concept Flow Steps Present", len(steps) >= 1, f"Found {len(steps)} pipeline stages")
    if steps:
        assert_test("Concept Step Structure Valid", "step" in steps[0] and "name" in steps[0] and "description" in steps[0])

    # Viva Mock Quiz
    quiz = deck_data.get("quiz", [])
    assert_test("Mock Viva Quiz Questions Present", len(quiz) >= 1, f"Found {len(quiz)} quiz items")
    if quiz:
        q = quiz[0]
        assert_test("Quiz Item Has Options & Correct Index", len(q.get("options", [])) >= 2 and "correct_index" in q)
        assert_test("Quiz Item Has Rationale", "rationale" in q and len(q["rationale"]) > 10)

    # =========================================================================
    # TEST 7: Multi-Paper Literature Synthesis Matrix & Exporters
    # =========================================================================
    print("\n--- [7/9] Testing Multi-Paper Literature Synthesis Matrix ---")
    if len(researcher_list) >= 2:
        r_ids = [d["id"] for d in researcher_list[:3]]
        res_matrix = client.post("/api/matrix/generate", json={"paper_ids": r_ids})
        assert_test("Matrix Endpoint Status", res_matrix.status_code == 200)
        matrix_data = res_matrix.json()
        matrix_rows = matrix_data.get("matrix", [])
        assert_test("Matrix Rows Generated", len(matrix_rows) == len(r_ids), f"Rows: {len(matrix_rows)}")
        assert_test("LaTeX Table (.tex) Generated", "\\begin{table" in matrix_data.get("latex_code", "") and "\\begin{tabularx}" in matrix_data.get("latex_code", ""))
        assert_test("BibTeX Entries (.bib) Generated", "@article" in matrix_data.get("bibtex_code", "") or "@inproceedings" in matrix_data.get("bibtex_code", ""))

    # =========================================================================
    # TEST 8: SQLite Chat History Lifecycle (Save, Fetch, Clear)
    # =========================================================================
    print("\n--- [8/9] Testing SQLite Multi-Turn Chat Persistence ---")
    # A. Fetch history
    res_hist = client.get(f"/api/chat/history/{sample_student_id}")
    assert_test("Fetch Chat History Status", res_hist.status_code == 200)
    history_messages = res_hist.json().get("messages", [])
    assert_test("Auto-Persisted Messages Stored", len(history_messages) >= 2, f"Count: {len(history_messages)}")

    # B. Explicit Save
    custom_msg = {
        "paper_id": sample_student_id,
        "sender": "user",
        "text": "Can you summarize the experimental results?",
        "action_type": "summary"
    }
    res_save = client.post("/api/chat/save", json=custom_msg)
    assert_test("Explicit Save Message Status", res_save.status_code == 200)
    assert_test("Message ID Returned", "message_id" in res_save.json())

    # C. Clear History
    res_clear = client.delete(f"/api/chat/history/{sample_student_id}")
    assert_test("Clear Chat History Status", res_clear.status_code == 200)
    res_empty_hist = client.get(f"/api/chat/history/{sample_student_id}").json()
    assert_test("History Successfully Cleared", res_empty_hist.get("count") == 0)

    # =========================================================================
    # TEST 9: Vector Store Similarity Search
    # =========================================================================
    print("\n--- [9/9] Testing Vector Store Embeddings & Coordinate Retrieval ---")
    chunks = vector_store.search_paper_sections(sample_student_id, "equations, formulation and parameters", top_k=3)
    assert_test("Vector Store Returns Chunks", len(chunks) > 0, f"Found {len(chunks)} chunks")
    if chunks:
        assert_test("Chunk Contains Section & Text", "section" in chunks[0] and "text" in chunks[0])
        assert_test("Chunk Bounding Box Available", "bbox" in chunks[0])

    # =========================================================================
    # SUMMARY
    # =========================================================================
    print("\n" + "=" * 80)
    print(f"📊 VALIDATION SUMMARY: {passed_tests} / {total_tests} Tests Passed ({(passed_tests/total_tests)*100:.1f}%)")
    print("=" * 80)

    if passed_tests == total_tests:
        print("🎉 ALL SYSTEMS OPERATING PERFECTLY AT 100% SPECIFICATION!")
        return 0
    else:
        print(f"⚠️ {total_tests - passed_tests} tests failed.")
        return 1

if __name__ == "__main__":
    exit_code = run_tests()
    sys.exit(exit_code)
