"""Fix </motion.div> closers that should be </motion.div> for plain <motion.div>."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "components"

OPEN = re.compile(r"<(motion\.div|div)(\s|>)")
SELF = re.compile(r"<(motion\.motion\.motion\.div|motion\.div|motion\.div)(\s[^>]*)?\s*/>")
CLOSE = re.compile(r"</(motion\.div|motion\.motion\.div|div)>")


def fix_text(text: str) -> tuple[str, bool]:
    stack: list[str] = []
    out: list[str] = []
    i = 0
    changed = False

    while i < len(text):
        if text[i] != "<":
            out.append(text[i])
            i += 1
            continue

        m = SELF.match(text, i)
        if m:
            out.append(m.group(0))
            i = m.end()
            continue

        m = CLOSE.match(text, i)
        if m:
            close = m.group(1)
            if stack:
                expected = stack.pop()
                if expected == "html-div" and close == "motion.div":
                    out.append("</motion.div>")
                    changed = True
                elif expected == "motion.div" and close == "motion.div":
                    out.append("</motion.div>")
                elif expected == close or (expected == "motion.div" and close == "motion.div"):
                    out.append(m.group(0))
                else:
                    out.append(f"</{expected}>")
                    changed = True
            else:
                out.append(m.group(0))
            i = m.end()
            continue

        m = OPEN.match(text, i)
        if m:
            tag = m.group(1)
            out.append(m.group(0))
            i = m.end()
            if tag == "motion.div":
                stack.append("motion.div")
            elif tag == "motion.div":
                stack.append("html-div")
            continue

        out.append(text[i])
        i += 1

    return "".join(out), changed


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("*.tsx")):
        text = path.read_text(encoding="utf-8")
        fixed, changed = fix_text(text)
        if changed:
            path.write_text(fixed, encoding="utf-8")
            print("fixed", path.relative_to(ROOT.parent))
            n += 1
    print("total", n)


if __name__ == "__main__":
    main()
