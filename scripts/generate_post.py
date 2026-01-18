#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.request
import yaml
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


def read_text(path: Path) -> str:
  return path.read_text(encoding="utf-8")


def load_topics_config(root: Path) -> Dict[str, Any]:
  return json.loads(read_text(root / "tools" / "topics.json"))


def slugify(value: str) -> str:
  value = value.strip().lower()
  value = re.sub(r"[^a-z0-9\\s-]", "", value)
  value = re.sub(r"\\s+", "-", value)
  value = re.sub(r"-{2,}", "-", value)
  return value.strip("-")


def default_slug(topic: str, title: str, today: str) -> str:
  s = slugify(title)
  if s:
    return s
  return f"{topic}-{today}"


def format_sources(urls: List[str]) -> str:
  return "\n".join(f"- {u}" for u in urls)

def format_must_links(links: List[str]) -> str:
  return "\n".join(f"- {link}" for link in links)


def load_prompt(root: Path, name: str) -> Tuple[str, str]:
  base = root / "tools" / "prompts"
  system_path = base / f"{name}.system.txt"
  user_path = base / f"{name}.user.txt"
  if not system_path.exists() or not user_path.exists():
    raise FileNotFoundError(f"prompt not found: {name}")
  return read_text(system_path), read_text(user_path)


def http_post_json(url: str, headers: Dict[str, str], payload: Dict[str, Any]) -> Dict[str, Any]:
  data = json.dumps(payload).encode("utf-8")
  req = urllib.request.Request(url, data=data, headers=headers, method="POST")
  try:
    with urllib.request.urlopen(req, timeout=120) as resp:
      body = resp.read().decode("utf-8")
      return json.loads(body)
  except urllib.error.HTTPError as e:
    # 读取错误响应体
    error_body = ""
    try:
      error_body = e.read().decode("utf-8")
      error_data = json.loads(error_body) if error_body else {}
    except:
      error_data = {"error": {"message": error_body or str(e)}}

    # 构建详细的错误信息
    error_msg = f"HTTP Error {e.code}: {e.reason}\n"
    error_msg += f"URL: {url}\n"

    if error_data.get("error"):
      error_info = error_data["error"]
      if isinstance(error_info, dict):
        error_msg += f"Error Type: {error_info.get('type', 'unknown')}\n"
        error_msg += f"Error Message: {error_info.get('message', 'No error message')}\n"
        if "code" in error_info:
          error_msg += f"Error Code: {error_info.get('code')}\n"
      else:
        error_msg += f"Error: {error_info}\n"
    else:
      error_msg += f"Response: {error_body}\n"

    # 401 错误特别提示
    if e.code == 401:
      error_msg += "\n⚠️  API Key 认证失败，请检查：\n"
      error_msg += "  1. API Key 是否正确配置\n"
      error_msg += "  2. API Key 是否有效且未过期\n"
      error_msg += "  3. API Key 是否有权限访问该模型\n"
      # 从 headers 中提取 API key 的前几位用于提示（不泄露完整 key）
      auth_header = headers.get("Authorization", "")
      if auth_header.startswith("Bearer "):
        api_key_preview = auth_header[7:15] + "..." if len(auth_header) > 15 else ""
        error_msg += f"  4. 使用的 API Key 前缀: {api_key_preview}\n"

    raise RuntimeError(error_msg) from e
  except urllib.error.URLError as e:
    raise RuntimeError(f"Network error: {e.reason}\nURL: {url}") from e

ProviderName = str


def get_provider_defaults(provider: ProviderName) -> Dict[str, str]:
  """
  获取阿里云通义千问的默认配置

  API Key 命名规范：
  - 优先使用 DASHSCOPE_API_KEY
  - 后备使用 AI_API_KEY（向后兼容）
  """
  # 只支持阿里云通义千问
  return {
    "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "model": "qwen-plus",
    "api_key_env": "DASHSCOPE_API_KEY",
    "api_key_env_fallback": "AI_API_KEY",
  }


def resolve_api_key(provider: ProviderName, explicit: str) -> str:
  """
  解析 API key，优先级：
  1. Provider 特定的环境变量（如 OPENAI_API_KEY, DASHSCOPE_API_KEY）
  2. Provider 的后备环境变量（如 AI_API_KEY）
  3. 命令行参数 --api-key（explicit，可能是从环境变量读取的默认值）
  4. 返回空字符串（调用方会报错）

  注意：优先使用 provider 特定的 key，确保不同 provider 使用正确的 API key。
  """
  provider_defaults = get_provider_defaults(provider)

  # 优先级 1: Provider 特定的 API key（如 OPENAI_API_KEY, DASHSCOPE_API_KEY）
  api_key_env = provider_defaults.get("api_key_env", "")
  if api_key_env:
    # 直接使用 os.environ 而不是 os.getenv，确保能读取到环境变量
    provider_key = os.environ.get(api_key_env, "").strip() if api_key_env in os.environ else ""
    # 调试信息（总是输出）
    print(f"DEBUG resolve_api_key: 检查 {api_key_env}", file=sys.stderr)
    print(f"  os.environ.get: {provider_key[:15] if provider_key else '未设置'}... (长度: {len(provider_key)})", file=sys.stderr)
    print(f"  os.getenv: {os.getenv(api_key_env, '未设置')[:15] if os.getenv(api_key_env) else '未设置'}... (长度: {len(os.getenv(api_key_env, ''))})", file=sys.stderr)
    if provider_key:
      print(f"DEBUG resolve_api_key: ✅ 返回 {api_key_env} (长度: {len(provider_key)})", file=sys.stderr)
      return provider_key
    else:
      print(f"DEBUG resolve_api_key: ❌ {api_key_env} 不可用，继续检查后备 key", file=sys.stderr)

  # 优先级 2: Provider 的后备 API key（通常是 AI_API_KEY）
  api_key_fallback = provider_defaults.get("api_key_env_fallback", "")
  if api_key_fallback:
    # 直接使用 os.environ 而不是 os.getenv
    fallback_key = os.environ.get(api_key_fallback, "").strip() if api_key_fallback in os.environ else ""
    # 调试信息（总是输出）
    print(f"DEBUG resolve_api_key: 检查 {api_key_fallback}", file=sys.stderr)
    print(f"  os.environ.get: {fallback_key[:15] if fallback_key else '未设置'}... (长度: {len(fallback_key)})", file=sys.stderr)
    if fallback_key:
      print(f"DEBUG resolve_api_key: ⚠️  返回 {api_key_fallback} (后备, 长度: {len(fallback_key)})", file=sys.stderr)
      return fallback_key

  # 优先级 3: 命令行参数 --api-key（可能是从环境变量读取的默认值）
  if explicit.strip():
    print(f"DEBUG resolve_api_key: ⚠️  使用命令行参数 --api-key (长度: {len(explicit.strip())})", file=sys.stderr)
    return explicit.strip()

  # 优先级 4: 通用后备（向后兼容）
  ai_key = os.getenv("AI_API_KEY", "")
  if ai_key and ai_key.strip():
    print(f"DEBUG resolve_api_key: ⚠️  使用通用后备 AI_API_KEY (长度: {len(ai_key.strip())})", file=sys.stderr)
    return ai_key.strip()

  return ""


def call_openai_compatible_chat(
  base_url: str,
  api_key: str,
  model: str,
  system: str,
  user: str,
  temperature: float,
) -> str:
  url = base_url.rstrip("/") + "/chat/completions"
  headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}",
  }
  payload = {
    "model": model,
    "temperature": temperature,
    "messages": [
      {"role": "system", "content": system},
      {"role": "user", "content": user},
    ],
  }
  data = http_post_json(url, headers, payload)
  try:
    return data["choices"][0]["message"]["content"]
  except Exception as e:
    raise RuntimeError(f"unexpected response shape: {data}") from e


FRONTMATTER_RE = re.compile(r"^---\s*\n[\s\S]*?\n---\s*\n", re.MULTILINE)

FENCED_MD_RE = re.compile(
  r"^\s*```(?:markdown|md|yaml)?\s*\n([\s\S]*?)\n```\s*$",
  re.IGNORECASE,
)


def normalize_model_markdown(raw: str) -> str:
  text = raw.replace("\r\n", "\n").strip()

  # 移除可能的代码块包裹（如 ```yaml ... ```）
  # 先尝试匹配完整的代码块
  fenced = FENCED_MD_RE.match(text)
  if fenced:
    text = fenced.group(1).strip()

  # 如果文本以代码块标记开始，移除它
  # 处理 ```yaml 或 ``` 开头的代码块
  if text.startswith("```"):
    lines = text.split("\n")
    # 移除第一行的代码块标记
    if lines[0].startswith("```"):
      lines = lines[1:]
    # 移除最后一行的代码块标记
    if lines and lines[-1].strip() == "```":
      lines = lines[:-1]
    text = "\n".join(lines).strip()

  # 确保 frontmatter 以 --- 开始（不是 ```yaml）
  if not text.startswith("---"):
    # 查找第一个 --- 的位置
    frontmatter_start = text.find("\n---")
    if frontmatter_start > 0:
      # 移除前面的代码块标记
      text = text[frontmatter_start + 1:].strip()

  return text


def basic_validate(markdown: str, must_links: Optional[List[str]] = None) -> List[str]:
  errors: List[str] = []
  if not FRONTMATTER_RE.search(markdown):
    errors.append("missing YAML frontmatter at top")
  # 使用正则匹配，允许标题后带括号说明
  required_sections = [
    r"##\s+TL;DR",
    r"##\s+要点",
    r"##\s+事实与来源",
    r"##\s+时间线",
    r"##\s+增量整理",
    r"##\s+风险与边界",
    r"##\s+站内延伸阅读",
  ]
  for section_pattern in required_sections:
    if not re.search(section_pattern, markdown):
      # 提取基础标题名称用于错误提示
      section_name = re.sub(r"##\s+", "", section_pattern)
      errors.append(f"missing section: ## {section_name}")

  if must_links:
    for link in must_links:
      needle = f"\n- {link}"
      if needle not in markdown:
        errors.append(f"missing must_link line: {needle.strip()}")
  return errors


def write_output(path: Path, content: str, force: bool) -> None:
  path.parent.mkdir(parents=True, exist_ok=True)
  if path.exists() and not force:
    raise FileExistsError(f"output exists: {path} (use --force)")
  path.write_text(content, encoding="utf-8")


def main() -> int:
  parser = argparse.ArgumentParser(description="Generate 51chigua Markdown post via an AI API.")
  parser.add_argument("--topic", required=True, choices=["book", "ai", "finance", "ent", "today", "entertainment", "influencer", "campus", "sports", "hot", "global", "fashion", "tech"])
  parser.add_argument("--title", required=True)
  parser.add_argument("--slug", default="")
  parser.add_argument("--date", default="")
  parser.add_argument("--source", action="append", default=[], help="Repeatable. External source URL.")
  parser.add_argument("--author", default="", help="Book author (for book topic)")
  parser.add_argument("--goal", default="", help="Reading goal (for book topic)")
  parser.add_argument("--prompt", default="hot_topic_breakdown")
  parser.add_argument("--out", default="")
  parser.add_argument(
    "--provider",
    default="qwen",
    help="Model provider: 仅支持 qwen (阿里云通义千问)",
  )
  parser.add_argument("--model", default=os.getenv("AI_MODEL", ""))
  parser.add_argument("--base-url", default=os.getenv("AI_BASE_URL", ""))
  parser.add_argument("--api-key", default=os.getenv("AI_API_KEY", ""))
  parser.add_argument("--temperature", type=float, default=float(os.getenv("AI_TEMPERATURE", "0.2")))
  parser.add_argument("--dry-run", action="store_true")
  parser.add_argument("--force", action="store_true")
  args = parser.parse_args()

  root = Path(__file__).resolve().parents[1]
  topics_cfg = load_topics_config(root)
  topic_cfg = topics_cfg[args.topic]

  now = dt.datetime.now()
  # 用于 slug 的日期（只取日期部分）
  today_date = now.date().isoformat()
  # 用于 frontmatter 的日期时间（精确到秒）
  if args.date.strip():
    # 如果提供了日期，尝试解析并添加当前时间
    try:
      date_obj = dt.datetime.strptime(args.date.strip(), "%Y-%m-%d")
      date_time = date_obj.replace(hour=now.hour, minute=now.minute, second=now.second)
    except:
      # 如果解析失败，使用当前时间
      date_time = now
  else:
    date_time = now

  date = date_time.strftime("%Y-%m-%d %H:%M:%S")
  date_for_slug = date_time.date().isoformat()
  slug = args.slug.strip() or default_slug(args.topic, args.title, date_for_slug)

  sources = [s.strip() for s in args.source if s.strip()]
  # 对于 book 类型，source 不是必需的
  if args.topic != "book" and len(sources) < 1:
    print("error: please provide at least 1 --source URL", file=sys.stderr)
    return 2

  provider = str(args.provider).strip().lower() or "qwen"
  provider_defaults = get_provider_defaults(provider)
  model = (str(args.model).strip() or provider_defaults["model"]).strip()
  base_url = (str(args.base_url).strip() or provider_defaults["base_url"]).strip()

  system_tmpl, user_tmpl = load_prompt(root, args.prompt)

  # 根据 prompt 类型使用不同的参数
  if args.prompt == "book_reading":
    user = user_tmpl.format(
      title=args.title,
      author=args.author or "未知",
      goal=args.goal or "深度理解书中核心观点",
      date=date,
      tone_rules="；".join(topic_cfg.get("tone_rules", [])),
      must_link=format_must_links(topic_cfg.get("must_link", [])),
    )
  else:
    user = user_tmpl.format(
      topic=args.topic,
      title=args.title,
      date=date,
      slug=slug,
      sources=format_sources(sources),
      tone_rules="；".join(topic_cfg.get("tone_rules", [])),
      must_link=format_must_links(topic_cfg.get("must_link", [])),
    )

  if args.dry_run:
    print("=== SYSTEM ===")
    print(system_tmpl)
    print("=== USER ===")
    print(user)
    print("")
    print("=== RESOLVED CONFIG ===")
    print(f"provider: {provider}")
    print(f"base_url: {base_url}")
    print(f"model: {model}")
    return 0

  api_key = resolve_api_key(provider, str(args.api_key))

  # 调试信息：显示 resolve_api_key 的返回值
  if not args.dry_run:
    print(f"DEBUG: resolve_api_key 返回值: {api_key[:15] if api_key else '空'}... (长度: {len(api_key) if api_key else 0})", file=sys.stderr)

  # 调试信息：显示实际使用的 API key 来源
  if not args.dry_run:
    provider_defaults = get_provider_defaults(provider)
    api_key_env = provider_defaults.get("api_key_env", "")
    api_key_fallback = provider_defaults.get("api_key_env_fallback", "")

    # 检查环境变量状态
    print(f"🔍 API Key 解析调试:", file=sys.stderr)
    print(f"  Provider: {provider}", file=sys.stderr)
    print(f"  优先 Key ({api_key_env}): {os.getenv(api_key_env, '未设置')[:20] if os.getenv(api_key_env) else '未设置'}... (长度: {len(os.getenv(api_key_env, ''))})", file=sys.stderr)
    print(f"  后备 Key ({api_key_fallback}): {os.getenv(api_key_fallback, '未设置')[:20] if os.getenv(api_key_fallback) else '未设置'}... (长度: {len(os.getenv(api_key_fallback, ''))})", file=sys.stderr)

    # 检查实际使用的 key 来源
    if api_key:
      if api_key_env and os.getenv(api_key_env, "").strip() == api_key:
        key_source = api_key_env
      elif api_key_fallback and os.getenv(api_key_fallback, "").strip() == api_key:
        key_source = api_key_fallback
      elif str(args.api_key).strip() == api_key:
        key_source = "命令行参数 --api-key"
      else:
        key_source = "未知来源"

      print(f"🔑 使用的 API Key: {key_source} (长度: {len(api_key)}, 前缀: {api_key[:10]}...)", file=sys.stderr)

  if not api_key:
    api_key_env = provider_defaults.get("api_key_env", "")
    api_key_fallback = provider_defaults.get("api_key_env_fallback", "")

    # 构建友好的错误提示
    env_vars = []
    if api_key_env:
      env_vars.append(api_key_env)
    if api_key_fallback:
      env_vars.append(api_key_fallback)
    if "AI_API_KEY" not in env_vars:
      env_vars.append("AI_API_KEY")  # 通用后备

    env_vars_str = " 或 ".join(env_vars)
    print(
      f"error: missing API key for provider '{provider}'",
      file=sys.stderr,
    )
    print(
      f"  Please set one of: {env_vars_str}",
      file=sys.stderr,
    )
    print(
      f"  Or use --api-key parameter",
      file=sys.stderr,
    )
    return 2

  try:
    markdown = call_openai_compatible_chat(
      base_url=base_url,
      api_key=api_key,
      model=model,
      system=system_tmpl,
      user=user,
      temperature=args.temperature,
    ).strip()
  except RuntimeError as e:
    # 显示详细的 API 调用错误信息
    print(f"\n❌ API 调用失败:", file=sys.stderr)
    print(str(e), file=sys.stderr)
    print(f"\n配置信息:", file=sys.stderr)
    print(f"  Provider: {provider}", file=sys.stderr)
    print(f"  Base URL: {base_url}", file=sys.stderr)
    print(f"  Model: {model}", file=sys.stderr)
    print(f"  API Key: {'已配置' if api_key else '未配置'} (长度: {len(api_key) if api_key else 0})", file=sys.stderr)
    return 1

  markdown = normalize_model_markdown(markdown)

  # 从生成的 markdown 中提取 slug（如果 frontmatter 中有）
  # 这样可以使用 AI 生成的正确 slug，而不是依赖 slugify 函数（slugify 无法处理中文）
  frontmatter_match = FRONTMATTER_RE.search(markdown)
  if frontmatter_match:
    try:
      fm_text = frontmatter_match.group(0)
      # 移除 --- 标记
      fm_content = fm_text.strip().strip("---").strip()
      fm_data = yaml.safe_load(fm_content)
      if fm_data and "slug" in fm_data:
        extracted_slug = str(fm_data["slug"]).strip()
        if extracted_slug:
          slug = extracted_slug
          print(f"📝 从 frontmatter 提取 slug: {slug}", file=sys.stderr)
    except Exception as e:
      # 如果解析失败，使用原来的 slug
      print(f"⚠️  无法从 frontmatter 提取 slug，使用默认值: {slug}", file=sys.stderr)

  # 先确定输出路径
  out = args.out.strip()
  if not out:
    # 生成文件名格式：{YYYYMMDDHHMMSS}-{slug}.md
    # 使用当前时间的年月日时分秒
    time_prefix = now.strftime("%Y%m%d%H%M%S")
    out = str(Path("content") / "posts" / f"{time_prefix}-{slug}.md")

  # 构建完整路径
  output_path = root / out

  # 验证内容
  errors = basic_validate(markdown, must_links=topic_cfg.get("must_link", []))
  if errors:
    print("⚠️  model output failed validation:", file=sys.stderr)
    for e in errors:
      print(f"  - {e}", file=sys.stderr)

    # 即使验证失败，也尝试写入文件（便于调试）
    print(f"\n⚠️  验证失败，但仍将尝试写入文件到: {out}", file=sys.stderr)
    print(f"   完整路径: {output_path}", file=sys.stderr)

    # 如果 frontmatter 缺失，这是严重错误，不写入
    if "missing YAML frontmatter" in str(errors):
      print("\n❌ 缺少 Frontmatter，拒绝写入文件", file=sys.stderr)
      print("\n--- raw output (前500字符) ---\n", file=sys.stderr)
      print(markdown[:500], file=sys.stderr)
      return 3

  # 写入文件
  try:
    print(f"📝 准备写入文件:", file=sys.stderr)
    print(f"   相对路径: {out}", file=sys.stderr)
    print(f"   完整路径: {output_path}", file=sys.stderr)
    print(f"   父目录: {output_path.parent}", file=sys.stderr)

    write_output(output_path, markdown + "\n", force=args.force)

    print(f"✅ ok: wrote {out}")
    if output_path.exists():
      file_size = output_path.stat().st_size
      print(f"✅ 文件已写入，大小: {file_size} 字节", file=sys.stderr)

      # 如果有验证错误但文件已写入，返回特殊状态码
      if errors:
        print(f"⚠️  文件已写入，但存在 {len(errors)} 个验证警告", file=sys.stderr)
        return 0  # 仍然返回成功，因为文件已写入
    else:
      print(f"❌ 警告: 文件写入后不存在！", file=sys.stderr)
      return 4

    return 0
  except FileExistsError as e:
    print(f"❌ 错误: {e}", file=sys.stderr)
    print(f"   提示: 使用 --force 参数覆盖已存在的文件", file=sys.stderr)
    return 4
  except Exception as e:
    print(f"❌ ERROR: 文件写入失败: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
    return 4


if __name__ == "__main__":
  raise SystemExit(main())
