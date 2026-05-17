"""Fix </motion.div> closers that should be </motion.div> for plain <motion.div>."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "components"
CLOSE = re.compile(r"</(motion\.div|div)>")


def is_self_closing(text: str, start: int) -> bool:
    end = text.find(">", start)
    if end == -1:
        return False
    return text[start:end].rstrip().endswith("/")


def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    stack: list[str] = []
    out: list[str] = []
    i = 0
    changed = False

    while i < len(text):
        if text[i] != "<":
            out.append(text[i])
            i += 1
            continue

        if is_self_closing(text, i):
            end = text.find(">", i) + 1
            out.append(text[i:end])
            i = end
            continue

        m = CLOSE.match(text, i)
        if m:
            close = m.group(1)
            if stack:
                expected = stack.pop()
                if expected == "html-div" and close == "motion.div":
                    out.append("</div>")
                    changed = True
                elif expected == "motion-div":
                    out.append("</motion.div>")
                else:
                    out.append(m.group(0))
            else:
                out.append(m.group(0))
            i = m.end()
            continue

        if text.startswith("<motion.div", i):
            end = text.find(">", i) + 1
            out.append(text[i:end])
            stack.append("motion-div")
            i = end
            continue

        if text.startswith("<div", i):
            end = text.find(">", i) + 1
            out.append(text[i:end])
            stack.append("html-div")
            i = end
            continue

        out.append(text[i])
        i += 1

    if changed:
        path.write_text("".join(out), encoding="utf-8")
    return changed


def main() -> None:
    n = sum(1 for p in ROOT.rglob("*.tsx") if fix_file(p))
    print(f"fixed {n} files")


if __name__ == "__main__":
    main()
