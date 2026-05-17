"""Fix </div> closers that should be </motion.*> when stack top is motion."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "components"

OPEN = re.compile(r"<(motion\.\w+)\b")
CLOSE_DIV = re.compile(r"</div>")
CLOSE_MOTION = re.compile(r"</(motion\.\w+)>")


def fix_file(path: Path) -> bool:
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    stack: list[str] = []
    changed = False
    out: list[str] = []

    for line in lines:
        # process opens left-to-right
        pos = 0
        segments: list[str] = []
        for m in OPEN.finditer(line):
            segments.append(line[pos : m.start()])
            stack.append(m.group(1))
            pos = m.end()
        rest = line[pos:]

        # fix closes on this line
        pos = 0
        fixed_rest = ""
        for m in CLOSE_DIV.finditer(rest):
            fixed_rest += rest[pos : m.start()]
            if stack and stack[-1].startswith("motion."):
                tag = stack.pop()
                fixed_rest += f"</{tag}>"
                changed = True
            else:
                if stack:
                    stack.pop()
                fixed_rest += m.group(0)
            pos = m.end()
        fixed_rest += rest[pos:]

        # also handle correct motion closes
        pos2 = 0
        final = ""
        for m in CLOSE_MOTION.finditer(fixed_rest):
            final += fixed_rest[pos2 : m.start()]
            tag = m.group(1)
            if stack and stack[-1] == tag:
                stack.pop()
            elif stack and stack[-1].startswith("motion."):
                # already handled
                pass
            final += m.group(0)
            pos2 = m.end()
        final += fixed_rest[pos2:]

        out.append("".join(segments) + final)

    new = "".join(out)
    old = "".join(lines)
    if changed:
        path.write_text(new, encoding="utf-8")
    return changed


def main():
    n = sum(1 for p in ROOT.rglob("*.tsx") if fix_file(p))
    print(f"updated {n} files")


if __name__ == "__main__":
    main()
