from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "components"

def fix_lines(path: Path, line_fixes: dict[int, str]):
    lines = path.read_text(encoding="utf-8").splitlines()
    for i, v in line_fixes.items():
        if 0 <= i < len(lines):
            lines[i] = v
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")

fix_lines(ROOT / "layout/SiteFooter.tsx", {27: "          </motion.div>", 62: "      </motion.div>"})

ab = ROOT / "layout/AnnouncementBar.tsx"
lines = ab.read_text(encoding="utf-8").splitlines()
if len(lines) > 117 and lines[117].strip() == "</motion.div>":
    lines[117] = "    </motion.div>"
ab.write_text("\n".join(lines) + "\n", encoding="utf-8")

fix_lines(
    ROOT / "layout/MobileMenu.tsx",
    {
        99: "                        </motion.div>",
        101: "                    </div>",
        102: "                  </motion.div>",
        105: "            </motion.div>",
        126: "          </motion.div>",
        131: "        </motion.div>",
    },
)

pc = ROOT / "product/ProductCard.tsx"
text = pc.read_text(encoding="utf-8")
text = text.replace(
    "{formatPriceRange(product.priceMin, product.priceMax)}",
    "${product.price.toFixed(0)}",
)
text = text.replace(
    "            />\n          </div>\n          <motion.div className=\"pointer-events-none",
    "            />\n          </motion.div>\n          <motion.div className=\"pointer-events-none",
)
text = text.replace(
    '<motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t',
    '<motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t',
)
text = text.replace(
    'opacity-80" />\n          <motion.div\n            className="absolute left-3',
    'opacity-80" />\n          <motion.div\n            className="absolute left-3',
)
text = text.replace(
    "            <PurityBadge value={product.purity} animated={!reduce} />\n          </div>\n        </div>",
    "            <PurityBadge value={product.purity} animated={!reduce} />\n          </motion.div>\n        </motion.div>",
)
text = text.replace(
    "          </motion.button>\n        </div>\n      </motion.div>\n    </motion.article>",
    "          </motion.button>\n        </motion.div>\n      </motion.div>\n    </motion.article>",
)
# pointer-events overlay should be plain div
text = text.replace(
    '<motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lab-base via-transparent to-transparent opacity-80" />',
    '<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-lab-base via-transparent to-transparent opacity-80" />',
)
pc.write_text(text, encoding="utf-8")

co = ROOT / "checkout/CheckoutPageClient.tsx"
text = co.read_text(encoding="utf-8")
text = text.replace(
    "                  </motion.div>\n                </section>\n                <section>\n                  <h2 className=\"font-display text-lg text-white\">Shipping method</h2>",
    "                  </motion.div>\n                </section>\n                <section>\n                  <h2 className=\"font-display text-lg text-white\">Shipping method</h2>",
)
text = text.replace(
    '<motion.div className="mt-4 grid gap-4 md:grid-cols-2">',
    '<motion.div className="mt-4 grid gap-4 md:grid-cols-2">',
)
text = text.replace(
    "                    </label>\n                  </motion.div>\n                </section>",
    "                    </label>\n                  </motion.div>\n                </section>",
)
text = text.replace(
    "              <motion.div className=\"mt-4 space-y-2 border-t border-white/10 pt-4 text-sm\">",
    "              <motion.div className=\"mt-4 space-y-2 border-t border-white/10 pt-4 text-sm\">",
)
text = text.replace(
    "                </motion.div>\n              </motion.div>\n              <Link",
    "                </div>\n              </motion.div>\n              <Link",
)
co.write_text(text, encoding="utf-8")

# SiteHeader - read and fix critical closes
sh = ROOT / "layout/SiteHeader.tsx"
lines = sh.read_text(encoding="utf-8").splitlines()
header_fixes = {
    111: "                        </motion.div>",
    112: "                      </motion.div>",
    113: "                    </motion.div>",
    134: "                    </motion.div>",
    135: "                  </motion.div>",
    136: "                </motion.div>",
    138: "          </motion.div>",
    182: "          </motion.div>",
    183: "        </motion.div>",
    214: "          </motion.div>",
}
for i, v in header_fixes.items():
    if i < len(lines):
        lines[i] = v
sh.write_text("\n".join(lines) + "\n", encoding="utf-8")

print("done")
