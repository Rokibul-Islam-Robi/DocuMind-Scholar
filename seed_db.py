"""
DocuMind Scholar - Standalone DB Seeder
Seeds Student Course Materials (domain='student') and Research Papers (domain='researcher').
"""

import sqlite3
import json
import os
import sys

import sys
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "backend", "data", "documind_scholar.db")

from backend.sample_papers import STUDENT_MATERIALS, RESEARCH_PAPERS

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Ensure domain column exists
cursor.execute("PRAGMA table_info(documents)")
columns = [row[1] for row in cursor.fetchall()]
if "domain" not in columns:
    cursor.execute("ALTER TABLE documents ADD COLUMN domain TEXT DEFAULT 'researcher'")

# 1. Seed Student Course Materials
for pid, d in STUDENT_MATERIALS.items():
    cursor.execute("""
        INSERT OR REPLACE INTO documents (
            id, domain, filename, file_type, title, authors, year, total_pages,
            summary_cards, sections, equations, metrics, pages
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        pid,
        "student",
        d.get("filename", f"{pid}.pdf"),
        d.get("file_type", "pdf"),
        d["title"],
        json.dumps(d.get("authors", ["Student Faculty"])),
        str(d.get("year", "2024")),
        int(d.get("total_pages", 1)),
        json.dumps(d.get("summary_cards", {})),
        json.dumps(d.get("sections", {})),
        json.dumps(d.get("equations", [])),
        json.dumps(d.get("metrics", [])),
        json.dumps(d.get("pages", []))
    ))

# 2. Update Research Papers with domain='researcher'
for pid, d in RESEARCH_PAPERS.items():
    cursor.execute("UPDATE documents SET domain = 'researcher' WHERE id = ?", (pid,))

conn.commit()

cursor.execute("SELECT domain, count(*), group_concat(title, ' | ') FROM documents GROUP BY domain")
print("=" * 60)
print("📚 SQLite Database Domain Separation Summary:")
print("=" * 60)
for row in cursor.fetchall():
    print(f"Domain [{row[0]}]: {row[1]} documents")
    print(f"  Titles: {row[2][:120]}...\n")

conn.close()
