#!/usr/bin/env python3
"""
批量创建金句文件
直接创建30个高质量、有智慧的金句
"""

import datetime as dt
from pathlib import Path
import yaml

# 30条精选金句
QUOTES = [
    {
        "content": "真正的力量不在于征服他人，而在于征服自己。",
        "author": "老子",
        "source": "道德经",
        "tags": ["力量", "自我", "哲学"],
        "category": "哲学"
    },
    {
        "content": "智慧不是知道所有答案，而是知道如何提出正确的问题。",
        "author": "未知",
        "tags": ["智慧", "思考", "成长"],
        "category": "思考"
    },
    {
        "content": "最深的智慧往往藏在最简单的道理里。",
        "tags": ["智慧", "简单", "哲学"],
        "category": "哲学"
    },
    {
        "content": "当你停止成长，你就开始衰老。",
        "tags": ["成长", "人生", "自我"],
        "category": "成长"
    },
    {
        "content": "真正的勇气不是不害怕，而是害怕却依然前行。",
        "tags": ["勇气", "坚持", "人生"],
        "category": "人生"
    },
    {
        "content": "时间是最公平的，给每个人都是24小时；时间也是最不公平的，给每个人的价值都不同。",
        "tags": ["时间", "价值", "思考"],
        "category": "思考"
    },
    {
        "content": "真正的自由不是想做什么就做什么，而是不想做什么就不做什么。",
        "author": "康德",
        "tags": ["自由", "哲学", "人生"],
        "category": "哲学"
    },
    {
        "content": "知识改变命运，智慧改变人生。",
        "tags": ["知识", "智慧", "成长"],
        "category": "成长"
    },
    {
        "content": "成功不是终点，失败也不是末日，继续前进的勇气才是最重要的。",
        "tags": ["成功", "失败", "勇气"],
        "category": "人生"
    },
    {
        "content": "最强大的敌人往往是自己内心的恐惧。",
        "tags": ["恐惧", "自我", "成长"],
        "category": "成长"
    },
    {
        "content": "真正的智慧在于知道自己不知道什么。",
        "author": "苏格拉底",
        "tags": ["智慧", "哲学", "谦逊"],
        "category": "哲学"
    },
    {
        "content": "不是所有的努力都会成功，但所有成功都需要努力。",
        "tags": ["努力", "成功", "坚持"],
        "category": "成长"
    },
    {
        "content": "改变世界从改变自己开始，改变自己从改变思维开始。",
        "tags": ["改变", "思维", "成长"],
        "category": "成长"
    },
    {
        "content": "真正的富有不是拥有多少，而是需要多少。",
        "tags": ["富有", "简单", "哲学"],
        "category": "哲学"
    },
    {
        "content": "过去无法改变，未来无法预测，只有现在可以把握。",
        "tags": ["时间", "当下", "人生"],
        "category": "人生"
    },
    {
        "content": "最深的智慧是知道何时该说，何时该沉默。",
        "tags": ["智慧", "沟通", "人生"],
        "category": "智慧"
    },
    {
        "content": "真正的力量来自内心的平静，而不是外在的喧嚣。",
        "tags": ["力量", "内心", "平静"],
        "category": "哲学"
    },
    {
        "content": "失败是成功之母，但只有从失败中学习，它才是你的母亲。",
        "tags": ["失败", "学习", "成长"],
        "category": "成长"
    },
    {
        "content": "最强大的武器是思想，最危险的敌人是偏见。",
        "tags": ["思想", "偏见", "智慧"],
        "category": "智慧"
    },
    {
        "content": "真正的智慧不在于知道答案，而在于知道问题。",
        "tags": ["智慧", "问题", "思考"],
        "category": "思考"
    },
    {
        "content": "人生最大的敌人不是别人，而是自己的惰性和恐惧。",
        "tags": ["人生", "自我", "成长"],
        "category": "成长"
    },
    {
        "content": "真正的成功不是站在顶峰，而是帮助他人也登上顶峰。",
        "tags": ["成功", "帮助", "人生"],
        "category": "人生"
    },
    {
        "content": "最深的智慧往往来自最痛苦的经历。",
        "tags": ["智慧", "经历", "成长"],
        "category": "成长"
    },
    {
        "content": "真正的力量不是控制他人，而是控制自己。",
        "tags": ["力量", "控制", "自我"],
        "category": "哲学"
    },
    {
        "content": "最强大的力量是坚持，最珍贵的品质是耐心。",
        "tags": ["坚持", "耐心", "力量"],
        "category": "成长"
    },
    {
        "content": "真正的智慧是知道自己的无知，真正的力量是承认自己的脆弱。",
        "tags": ["智慧", "力量", "谦逊"],
        "category": "哲学"
    },
    {
        "content": "改变思维，改变命运；改变习惯，改变人生。",
        "tags": ["思维", "习惯", "改变"],
        "category": "成长"
    },
    {
        "content": "最深的智慧藏在最简单的话语里，最大的力量来自最平静的内心。",
        "tags": ["智慧", "力量", "简单"],
        "category": "哲学"
    },
    {
        "content": "真正的成长不是变得完美，而是接受不完美。",
        "tags": ["成长", "完美", "接受"],
        "category": "成长"
    },
    {
        "content": "最强大的力量是内心的平静，最深的智慧是知道何时该行动。",
        "tags": ["力量", "智慧", "行动"],
        "category": "智慧"
    }
]


def create_quote_file(quote_data: dict, output_dir: Path, index: int) -> Path:
    """创建金句文件"""
    now = dt.datetime.now()
    # 生成唯一的时间戳
    base_timestamp = now.strftime("%Y%m%d%H%M%S")
    # 为每个金句添加秒数偏移，确保唯一性
    timestamp = f"{base_timestamp[:-2]}{int(base_timestamp[-2:]) + index:02d}"

    # 从内容生成 slug
    content = quote_data["content"]
    slug = content[:20].replace("，", "").replace("。", "").replace(" ", "-")
    slug = "".join(c if c.isalnum() or c in "-_" else "-" for c in slug)
    slug = slug[:30].strip("-")
    if not slug:
        slug = f"quote-{timestamp}"

    # 生成 ID
    quote_id = f"quote_{timestamp[:8]}_{timestamp[8:14]}"

    # 构建 frontmatter
    frontmatter = {
        "id": quote_id,
        "content": content,
        "created_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": now.strftime("%Y-%m-%d %H:%M:%S"),
        "status": "published",
        "tags": quote_data.get("tags", ["智慧", "思考"]),
        "poster_template": "default"
    }

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
    markdown_content = f"---\n{yaml_content}---\n\n{content}\n"

    # 写入文件
    filepath.write_text(markdown_content, encoding="utf-8")

    return filepath


def main():
    project_root = Path(__file__).parent.parent
    now = dt.datetime.now()
    output_dir = project_root / "content" / "quotes" / str(now.year) / f"{now.month:02d}"
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"创建 {len(QUOTES)} 条金句...")
    print(f"输出目录: {output_dir}")
    print()

    created_files = []
    for i, quote in enumerate(QUOTES):
        filepath = create_quote_file(quote, output_dir, index=i)
        created_files.append(filepath)
        print(f"✓ [{i+1:2d}] {filepath.name}")
        print(f"    {quote['content']}")

    print(f"\n✅ 成功创建 {len(created_files)} 个金句文件")
    print(f"   目录: {output_dir}")


if __name__ == "__main__":
    main()

