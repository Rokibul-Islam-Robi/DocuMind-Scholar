"""
Test query and streaming endpoints
"""
import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

# 1. Fetch available papers
res = json.loads(urllib.request.urlopen(f"{BASE_URL}/api/papers?domain=student").read().decode("utf-8"))
papers = res.get("papers", [])
if not papers:
    print("No student papers found!")
    sys.exit(1)

test_paper = papers[0]
paper_id = test_paper["id"]
print(f"Testing with Paper: '{test_paper['title']}' (ID: {paper_id})")

# 2. Test JSON query endpoint (/api/agent/query)
query_payload = {
    "paper_id": paper_id,
    "prompt": "Explain the foundational concepts in simple terms with an example.",
    "model_engine": "gemini-1.5-flash"
}

req = urllib.request.Request(
    f"{BASE_URL}/api/agent/query",
    data=json.dumps(query_payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode("utf-8"))
        print("\n✅ 1. Direct JSON Query Successful:")
        print(f"Response ({len(data['response'])} chars):")
        print(data['response'][:300] + "...")
        print(f"Citations count: {len(data.get('citations', []))}")
except Exception as e:
    print(f"\n❌ JSON Query Failed: {e}")

# 3. Test SSE Streaming endpoint (/api/agent/stream)
stream_payload = {
    "paper_id": paper_id,
    "prompt": "Provide step-by-step guidance for an assignment problem.",
    "model_engine": "gemini-1.5-flash"
}

stream_req = urllib.request.Request(
    f"{BASE_URL}/api/agent/stream",
    data=json.dumps(stream_payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    method="POST"
)

try:
    with urllib.request.urlopen(stream_req) as response:
        print("\n✅ 2. SSE Streaming Query Successful:")
        full_streamed = []
        for line in response:
            line_str = line.decode("utf-8")
            if line_str.startswith("data: "):
                payload_str = line_str[6:].strip()
                if payload_str != "[DONE]":
                    try:
                        p_data = json.loads(payload_str)
                        if isinstance(p_data, dict) and "token" in p_data:
                            full_streamed.append(p_data["token"])
                    except Exception:
                        pass
        full_text = "".join(full_streamed)
        print(f"Streamed Total Tokens: {len(full_streamed)} | Total Chars: {len(full_text)}")
        print("Stream Preview:")
        print(full_text[:300] + "...")
except Exception as e:
    print(f"\n❌ SSE Streaming Failed: {e}")

print("\n🎉 ALL QUERY & STREAMING TESTS COMPLETED!")
