"""
Debug upload endpoint test
"""
import urllib.request
import urllib.parse
import json
import mimetypes
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Create a sample PDF-like / txt file to upload
test_txt_content = b"""# Introduction to Artificial Intelligence and Deep Learning
Course Chapter: Fundamentals of Artificial Neural Networks.

## Abstract
This study guide explains the basic principles of Perceptrons, Multi-Layer Perceptrons (MLPs), and Backpropagation.

## Mathematical Formulation
The linear score is given by:
$$z = W x + b$$
The activation is computed as:
$$a = \sigma(z) = \frac{1}{1 + e^{-z}}$$

## Loss Function
Cross-entropy loss:
$$\mathcal{L}(y, a) = - [y \log a + (1-y) \log(1-a)]$$

## Experiments and Results
Trained on 10,000 samples with 98.2% test accuracy.
"""

boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = bytearray()

# Form field: domain
body.extend(f"--{boundary}\r\n".encode("utf-8"))
body.extend(b'Content-Disposition: form-data; name="domain"\r\n\r\n')
body.extend(b'student\r\n')

# File field: file
body.extend(f"--{boundary}\r\n".encode("utf-8"))
body.extend(b'Content-Disposition: form-data; name="file"; filename="Test_AI_Course.txt"\r\n')
body.extend(b'Content-Type: text/plain\r\n\r\n')
body.extend(test_txt_content)
body.extend(b'\r\n')

body.extend(f"--{boundary}--\r\n".encode("utf-8"))

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/papers/upload",
    data=bytes(body),
    headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Content-Length": str(len(body))
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode("utf-8"))
        print("✅ Upload Success Response:")
        print(json.dumps(res_data, indent=2))
except urllib.error.HTTPError as e:
    print(f"❌ HTTP Error {e.code}: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"❌ Error: {e}")
