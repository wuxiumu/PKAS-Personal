#!/usr/bin/env python3
"""
生成金句脚本

使用 AI API 生成高质量金句，并保存为 Markdown 文件。
"""

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


def slugify(value: str) -> str:
    """生成 slug"""
    value = value.strip().lower()
    # 保留中文字符、字母、数字和连字符
    value = re.sub(r"[^\w\s\u4e00-\u9fff-]", "", value)
    value = re.sub(r"\s+", "-", value)
    value = re.sub(r"-{2,}", "-", value)
    return value.strip("-")


def resolve_api_key(provider: str = "qwen") -> str:
    """解析 API key"""
    # 优先使用 DASHSCOPE_API_KEY
    api_key = os.getenv("DASHSCOPE_API_KEY", "").strip()
    if api_key:
        return api_key

    # 后备使用 AI_API_KEY
    api_key = os.getenv("AI_API_KEY", "").strip()
    if api_key:
        return api_key

    return ""


def call_openai_compatible_chat(
    base_url: str,
    api_key: str,
    model: str,
    system: str,
    user: str,
    temperature: float = 0.7,
) -> str:
    """调用 OpenAI 兼容的 API"""
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

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode("utf-8")
            data = json.loads(body)
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"API 调用失败: {e}") from e


def generate_quote_content(
    theme: str = "",
    style: str = "智慧深刻",
    count: int = 1
) -> List[Dict[str, str]]:
    """生成金句内容"""
    api_key = resolve_api_key()
    if not api_key:
        raise RuntimeError("未找到 API Key，请设置 DASHSCOPE_API_KEY 或 AI_API_KEY 环境变量")

    base_url = os.getenv("AI_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
    model = os.getenv("AI_MODEL", "qwen-plus")

    system_prompt = """你是一位智慧深邃的思想家，擅长创作富有哲理、启发性强的金句。

要求：
1. 金句要简洁有力，通常不超过50字
2. 要有深度和智慧，能引发思考
3. 语言优美，有韵律感
4. 避免陈词滥调，要有新意
5. 可以涉及人生、成长、智慧、成功、思考等主题

输出格式：每行一个金句，不要编号，不要多余说明。"""

    user_prompt = f"请生成{count}条{style}风格的金句"
    if theme:
        user_prompt += f"，主题围绕：{theme}"
    user_prompt += "。每条金句单独一行，不要编号，直接输出金句内容。"

    try:
        response = call_openai_compatible_chat(
            base_url=base_url,
            api_key=api_key,
            model=model,
            system=system_prompt,
            user=user_prompt,
            temperature=0.8
        )

        # 解析响应，提取金句
        quotes = []
        lines = response.strip().split('\n')
        for line in lines:
            line = line.strip()
            # 移除可能的编号（如 "1. "、"• "等）
            line = re.sub(r'^[\d\s\.\-\*•]+', '', line).strip()
            if line and len(line) > 5:  # 过滤太短的内容
                quotes.append({"content": line})

        # 如果解析出的数量不够，尝试其他方式
        if len(quotes) < count:
            # 尝试按句号、问号、感叹号分割
            sentences = re.split(r'[。！？\n]', response)
            for sent in sentences:
                sent = sent.strip()
                if sent and len(sent) > 5 and len(quotes) < count:
                    quotes.append({"content": sent})

        return quotes[:count]
    except Exception as e:
        print(f"生成金句失败: {e}", file=sys.stderr)
        raise


def create_quote_file(
    quote_data: Dict[str, str],
    output_dir: Path,
    index: int = 0
) -> Path:
    """创建金句文件"""
    now = dt.datetime.now()
    # 生成唯一的时间戳（避免重复）
    timestamp = now.strftime("%Y%m%d%H%M%S")
    if index > 0:
        # 如果是批量生成，添加微秒偏移
        timestamp = f"{timestamp}{index:02d}"

    # 从内容生成 slug
    content_preview = quote_data.get("content", "")[:30]
    slug = slugify(content_preview) or f"quote-{timestamp}"

    # 生成 ID
    quote_id = f"quote_{timestamp[:8]}_{timestamp[8:14]}"

    # 构建 frontmatter
    frontmatter = {
        "id": quote_id,
        "content": quote_data.get("content", ""),
        "created_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        "status": "published",
        "tags": quote_data.get("tags", ["智慧", "思考"]),
        "poster_template": "default"
    }

    # 添加可选字段
    if quote_data.get("title"):
        frontmatter["title"] = quote_data["title"]
    if quote_data.get("author"):
        frontmatter["author"] = quote_data["author"]
    if quote_data.get("source"):
        frontmatter["source"] = quote_data["source"]
    if quote_data.get("category"):
        frontmatter["category"] = quote_data["category"]

    # 生成文件名
    filename = f"{timestamp}-{slug}.md"
    filepath = output_dir / filename

    # 生成 Markdown 内容
    yaml_content = yaml.dump(frontmatter, allow_unicode=True, default_flow_style=False)
    markdown_content = f"---\n{yaml_content}---\n\n{frontmatter['content']}\n"

    # 写入文件
    filepath.write_text(markdown_content, encoding="utf-8")

    return filepath


def main() -> int:
    parser = argparse.ArgumentParser(description="生成高质量金句")
    parser.add_argument("--count", type=int, default=1, help="生成数量（默认：1）")
    parser.add_argument("--theme", default="", help="主题（可选）")
    parser.add_argument("--style", default="智慧深刻", help="风格（默认：智慧深刻）")
    parser.add_argument("--output-dir", default="", help="输出目录（默认：content/quotes/YYYY/MM）")
    parser.add_argument("--dry-run", action="store_true", help="仅显示，不保存文件")

    args = parser.parse_args()

    # 确定输出目录
    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        project_root = Path(__file__).parent.parent
        now = dt.datetime.now()
        output_dir = project_root / "content" / "quotes" / str(now.year) / f"{now.month:02d}"

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"生成 {args.count} 条金句...")
    print(f"输出目录: {output_dir}")
    print()

    try:
        # 生成金句内容
        quotes = generate_quote_content(
            theme=args.theme,
            style=args.style,
            count=args.count
        )

        if not quotes:
            print("❌ 未能生成金句", file=sys.stderr)
            return 1

        # 创建文件
        created_files = []
        for i, quote in enumerate(quotes):
            if args.dry_run:
                print(f"[预览] {quote.get('content', '')}")
            else:
                filepath = create_quote_file(quote, output_dir, index=i)
                created_files.append(filepath)
                print(f"✓ 已创建: {filepath.name}")
                print(f"  内容: {quote.get('content', '')[:50]}...")

        if not args.dry_run:
            print(f"\n✅ 成功生成 {len(created_files)} 个金句文件")
            print(f"   目录: {output_dir}")

        return 0

    except Exception as e:
        print(f"❌ 错误: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return 1


if __name__ == "__main__":
    exit(main())

