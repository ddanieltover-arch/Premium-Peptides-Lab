"""Restore component TSX from latest Write in agent transcript."""
from __future__ import annotations

import json
import re
from pathlib import Path

TRANSCRIPT = Path(
    r"C:\Users\User\.cursor\projects\c-Users-User-Desktop-Premium-Peptides-Lab"
    r"\agent-transcripts\1674de91-1ce7-4edc-a0e2-4b9bf502de7f"
    r"\1674de91-1ce7-4edc-a0e2-4b9bf502de7f.jsonl"
)
ROOT = Path(__file__).resolve().parents[1]

BROKEN_RE = re.compile(
    r"^\s+(className=|initial=\{|whileInView=|animate=\{|variants=|whileHover=|whileTap=| key=)",
    re.M,
)


def is_broken(text: str) -> bool:
    return bool(BROKEN_RE.search(text)) or "<motion.article\n" not in text and "    </motion.article>" in text


def main() -> None:
    latest: dict[Path, str] = {}
    with TRANSCRIPT.open(encoding="utf-8") as f:
        for line in f:
            try:
                o = json.loads(line)
            except json.JSONDecodeError:
                continue
            for part in (o.get("message") or {}).get("content") or []:
                if part.get("type") != "tool_use":
                    continue
                inp = part.get("input") or {}
                p = inp.get("path")
                c = inp.get("contents")
                if not p or not c:
                    continue
                path = Path(p)
                if "pharma-ecommerce-rebrand" not in str(path):
                    continue
                try:
                    rel = path.relative_to(ROOT)
                except ValueError:
                    continue
                if rel.parts[0] != "components" or rel.suffix != ".tsx":
                    continue
                latest[rel] = c

    restored = 0
    for rel, content in sorted(latest.items()):
        target = ROOT / rel
        if not target.exists():
            continue
        current = target.read_text(encoding="utf-8")
        if not is_broken(current):
            continue
        target.write_text(content, encoding="utf-8")
        print("restored", rel)
        restored += 1

    print(f"done: {restored} files")


if __name__ == "__main__":
    main()
