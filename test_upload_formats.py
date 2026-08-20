import urllib.request
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# 1. Create a sample research text file
sample_txt = """# Quantum Graph Neural Networks for Molecular Discovery
Abstract: We present Quantum Graph Neural Networks (QGNN), a hybrid quantum-classical architecture that computes graph topological invariants using parameterized quantum circuits.
Methodology: The framework encodes adjacency matrices into quantum state amplitudes. The quantum expectation value is computed as: $$E(\\theta) = \\langle 0| U^\\dagger(\\theta) H U(\\theta) |0\\rangle$$.
Experiments: On QM9 dataset, QGNN achieves 0.012 eV MAE, outperforming standard GNNs by 34%.
Limitations: Quantum state decoherence limits circuit depth to 16 gates on current NISQ hardware.
"""

boundary = "----DocuMindBoundary1234"
body = []
body.append(f"--{boundary}".encode("utf-8"))
body.append(b'Content-Disposition: form-data; name="file"; filename="quantum_gnn.txt"')
body.append(b'Content-Type: text/plain')
body.append(b'')
body.append(sample_txt.encode("utf-8"))
body.append(f"--{boundary}--".encode("utf-8"))
body.append(b'')
data = b"\r\n".join(body)

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/papers/upload",
    data=data,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
)

res = urllib.request.urlopen(req)
result = json.loads(res.read().decode("utf-8"))
print("TXT Upload Result:", result["message"])
print("Parsed Title:", result["paper"]["title"], "| Format:", result["paper"]["file_type"])
doc_id = result["paper"]["id"]

# 2. Test querying agent on the newly uploaded TXT document
query_payload = json.dumps({
    "paper_id": doc_id,
    "prompt": "What is the quantum expectation value formula and how does QGNN perform on QM9?",
    "model_engine": "gemini-1.5-flash",
    "action_type": "deconstruct_methodology"
}).encode("utf-8")

q_req = urllib.request.Request(
    "http://127.0.0.1:8000/api/agent/query",
    data=query_payload,
    headers={"Content-Type": "application/json"}
)

q_res = urllib.request.urlopen(q_req)
q_data = json.loads(q_res.read().decode("utf-8"))
print("\n--- Agent Response on Uploaded TXT Document ---")
print(q_data["response"][:280])

# 3. Test retrieving chat history for this document from SQLite
hist_res = urllib.request.urlopen(f"http://127.0.0.1:8000/api/chat/history/{doc_id}")
hist_data = json.loads(hist_res.read().decode("utf-8"))
print(f"\n--- SQLite Persistent Chat History for {doc_id} ---")
print(f"Total stored messages: {len(hist_data['messages'])}")
for m in hist_data["messages"]:
    print(f"  [{m['sender'].upper()} @ {m['timestamp']}]: {m['text'][:80]}...")
