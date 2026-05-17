from pathlib import Path

p = Path(__file__).resolve().parents[1] / "components/cart/CartPageClient.tsx"
t = p.read_text(encoding="utf-8")
t = t.replace(
    "                      </motion.div>\n                      <motion.div>",
    "                      </motion.div>\n                      <motion.div>",
)
# fix html div closed as motion
lines = t.splitlines()
out = []
for i, line in enumerate(lines):
    if i == 44 and line.strip() == "</motion.div>":
        out.append("                      </motion.div>".replace("motion.", ""))
    elif "motion.div className=\"flex justify-between" in line:
        out.append(line.replace("<motion.div", "<motion.div").replace("motion.div", "div"))
    elif i == 107 and "</motion.div>" in line:
        out.append("                </motion.div>".replace("motion.", ""))
    else:
        out.append(line)
p.write_text("\n".join(out) + "\n", encoding="utf-8")
print("patched")
