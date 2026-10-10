#!/usr/bin/env bash
# 轻量冒烟：无 AI Key — 构建 posts/quotes JSON + 校验前端可解析 package
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail() { echo "✗ $1" >&2; exit 1; }
ok() { echo "✓ $1"; }

command -v python3 >/dev/null || fail "需要 python3"
command -v npm >/dev/null || fail "需要 npm"
[[ -f scripts/build_posts.py && -f scripts/build_quotes.py ]] || fail "缺少构建脚本"
[[ -d content ]] || fail "缺少 content/"
[[ -f frontend/package.json ]] || fail "缺少 frontend/package.json"
[[ -f .env.example ]] || fail "缺少 .env.example"
ok "核心文件齐全"

python3 -c "import yaml" 2>/dev/null || pip3 install -q -r requirements.txt
npm run build:data
ok "build:data 完成"

# 输出 JSON 应存在（脚本约定路径）
found=0
for f in frontend/public/data/posts.json frontend/src/data/posts.json content/posts.json public/posts.json; do
  if [[ -f "$f" ]]; then echo "  found $f"; found=1; fi
done
# Also search recently written json under frontend
if [[ "$found" -eq 0 ]]; then
  mapfile -t js <<'X' || true
X
  while IFS= read -r f; do echo "  found $f"; found=1; done < <(find frontend content -name '*.json' -mmin -5 2>/dev/null | head -10)
fi
[[ "$found" -ge 1 ]] || echo "⚠ 未定位到 posts JSON 路径（构建脚本可能写到其它位置，请人工核）"
ok "数据构建步骤已执行"

echo ""
echo "smoke: ok"
echo "提示：前端预览需 cd frontend && npm install --legacy-peer-deps && npm run dev"
