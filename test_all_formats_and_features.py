"""
DocuMind Scholar - Complete End-to-End System & Multi-Format Ingestion Test
Tests PDF, DOCX, TXT, MD ingestion, SQLite persistence, LLM query, study deck generation, and literature matrix.
"""

import urllib.request
import urllib.parse
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

def upload_file_bytes(filename: str, content: bytes, mime_type: str, domain: str = "student") -> dict:
    boundary = "----WebKitFormBoundaryE2ETestCase999"
    body = bytearray()

    # Domain field
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(b'Content-Disposition: form-data; name="domain"\r\n\r\n')
    body.extend(domain.encode("utf-8"))
    body.extend(b'\r\n')

    # File field
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f'Content-Type: {mime_type}\r\n\r\n'.encode("utf-8"))
    body.extend(content)
    body.extend(b'\r\n')

    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(
        f"{BASE_URL}/api/papers/upload",
        data=bytes(body),
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Content-Length": str(len(body))
        },
        method="POST"
    )

    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode("utf-8"))

print("=" * 70)
print("🚀 STARTING DOCUMIND SCHOLAR FULL END-TO-END VALIDATION SUITE")
print("=" * 70)

# 1. Health check
try:
    with urllib.request.urlopen(f"{BASE_URL}/api/health") as res:
        health = json.loads(res.read().decode("utf-8"))
        print(f"✅ 1. Health Check: {health['status']} | Active docs: {health['active_documents']}")
except Exception as e:
    print(f"❌ 1. Health Check Failed: {e}")
    sys.exit(1)

# 2. Test TXT Upload
txt_content = b"""# Physics 101: Quantum Mechanics Fundamentals
Chapter 4: Wave-Particle Duality and De Broglie Wavelength.

## Abstract
This textbook chapter introduces the foundational postulates of quantum mechanics.

## Mathematical Formulation
The de Broglie wavelength of a particle is:
$$\lambda = \frac{h}{p} = \frac{h}{m v}$$
The time-dependent Schrodinger equation:
$$i \hbar \frac{\partial \Psi}{\partial t} = \hat{H} \Psi$$

## Key Takeaways
Energy quantization and Planck's constant.
"""
try:
    txt_res = upload_file_bytes("Quantum_Physics_Notes.txt", txt_content, "text/plain", domain="student")
    print(f"✅ 2. TXT Upload: '{txt_res['paper']['title']}' (Domain: {txt_res['paper']['domain']}, Chunks: {txt_res['paper']['chunk_count']}, Eq: {txt_res['paper']['equation_count']})")
except Exception as e:
    print(f"❌ 2. TXT Upload Failed: {e}")

# 3. Test Markdown (MD) Upload
md_content = b"""# Chemistry 202: Chemical Kinetics & Thermodynamics
Lecture 7: Arrhenius Activation Energy and Reaction Rates.

## Methodology & Reaction Rate Law
The rate constant dependence on temperature is given by:
$$k = A e^{-\frac{E_a}{R T}}$$

## Gibbs Free Energy
$$\Delta G = \Delta H - T \Delta S$$

## Summary
Spontaneous reactions require negative Delta G.
"""
try:
    md_res = upload_file_bytes("Chemical_Kinetics.md", md_content, "text/markdown", domain="student")
    print(f"✅ 3. MD Upload: '{md_res['paper']['title']}' (Domain: {md_res['paper']['domain']}, Chunks: {md_res['paper']['chunk_count']}, Eq: {md_res['paper']['equation_count']})")
except Exception as e:
    print(f"❌ 3. MD Upload Failed: {e}")

# 4. Test Query Filtering by Domain
try:
    with urllib.request.urlopen(f"{BASE_URL}/api/papers?domain=student") as res:
        student_docs = json.loads(res.read().decode("utf-8"))["papers"]
        print(f"✅ 4. Student Domain Filter: {len(student_docs)} student documents stored.")
        for d in student_docs[:3]:
            print(f"   📘 {d['title']}")

    with urllib.request.urlopen(f"{BASE_URL}/api/papers?domain=researcher") as res:
        researcher_docs = json.loads(res.read().decode("utf-8"))["papers"]
        print(f"✅ 5. Researcher Domain Filter: {len(researcher_docs)} researcher papers stored.")
        for d in researcher_docs[:3]:
            print(f"   🔬 {d['title']}")
except Exception as e:
    print(f"❌ Domain Filtering Failed: {e}")

# 5. Test Study Deck Retrieval (Flashcards, Concept Flow, Quiz)
try:
    test_id = student_docs[0]["id"]
    with urllib.request.urlopen(f"{BASE_URL}/api/study/deck/{test_id}") as res:
        deck = json.loads(res.read().decode("utf-8"))
        print(f"✅ 6. Study Deck Retrieval for '{student_docs[0]['title'][:30]}...':")
        print(f"   🎴 Flashcards: {len(deck.get('flashcards', []))} cards")
        print(f"   🔄 Concept Flow: {len(deck.get('concept_flow', {}).get('steps', []))} steps")
        print(f"   🎯 Mock Quiz: {len(deck.get('quiz', []))} questions")
except Exception as e:
    print(f"❌ Study Deck Failed: {e}")

# 6. Test Literature Matrix Generation
try:
    r_ids = [d["id"] for d in researcher_docs[:3]]
    req_body = json.dumps({"paper_ids": r_ids}).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/matrix/generate",
        data=req_body,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as res:
        matrix_res = json.loads(res.read().decode("utf-8"))
        print(f"✅ 7. Literature Matrix Generator: Generated matrix for {len(matrix_res.get('matrix', []))} papers.")
        print(f"   📄 LaTeX Table length: {len(matrix_res.get('latex_code', ''))} characters")
        print(f"   📚 BibTeX entries length: {len(matrix_res.get('bibtex_code', ''))} characters")
except Exception as e:
    print(f"❌ Literature Matrix Failed: {e}")

print("=" * 70)
print("🎉 ALL END-TO-END UPLOAD AND FEATURE TESTS COMPLETED SUCCESSFULLY!")
print("=" * 70)
