#!/usr/bin/env python3
"""
PKAS 金句构建脚本

从 content/quotes/ 目录读取 Markdown 文件，解析 Frontmatter，
生成 frontend/src/data/quotes.json 文件。
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime, date
import yaml


class QuoteBuilder:
    """金句构建器"""

    def __init__(self, content_dir: str, output_file: str):
        self.content_dir = Path(content_dir)
        self.output_file = Path(output_file)
        self.quotes: List[Dict[str, Any]] = []
        self.errors: List[str] = []

    def parse_frontmatter(self, content: str) -> tuple[Dict[str, Any], str]:
        """
        解析 Markdown 文件的 Frontmatter

        Returns:
            (frontmatter_dict, markdown_content)
        """
        # 匹配 Frontmatter（--- 包裹的 YAML）
        pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
        match = re.match(pattern, content, re.DOTALL)

        if not match:
            raise ValueError("未找到 Frontmatter，请确保文件以 --- 开头")

        frontmatter_str = match.group(1)
        markdown_content = match.group(2).strip()

        try:
            frontmatter = yaml.safe_load(frontmatter_str)
            if not isinstance(frontmatter, dict):
                raise ValueError("Frontmatter 必须是 YAML 对象格式")
            return frontmatter, markdown_content
        except yaml.YAMLError as e:
            raise ValueError(f"Frontmatter YAML 解析错误: {e}")

    def validate_quote(self, quote: Dict[str, Any], filename: str) -> List[str]:
        """验证金句数据"""
        errors = []
        required_fields = ['id', 'content', 'created_at', 'status']

        # 检查必需字段
        for field in required_fields:
            if field not in quote:
                errors.append(f"{filename}: 缺少必需字段 '{field}'")

        # 验证 id
        if 'id' in quote:
            id_value = quote['id']
            if not id_value:
                errors.append(f"{filename}: id 不能为空")
            elif not re.match(r'^quote_\d{8}_\d{6}$', id_value):
                errors.append(f"{filename}: id 格式不正确（应为 quote_YYYYMMDD_HHMMSS）")

        # 验证 content
        if 'content' in quote:
            if not quote['content'] or not quote['content'].strip():
                errors.append(f"{filename}: content 不能为空")

        # 验证日期格式
        if 'created_at' in quote:
            date_value = quote['created_at']
            # YAML 可能将日期解析为 date 或 datetime 对象
            if isinstance(date_value, datetime):
                quote['created_at'] = date_value.strftime('%Y-%m-%d %H:%M:%S')
            elif hasattr(date_value, 'strftime'):  # date 对象
                quote['created_at'] = date_value.strftime('%Y-%m-%d %H:%M:%S')
            elif isinstance(date_value, str):
                # 尝试解析不同的日期格式
                try:
                    datetime.strptime(date_value, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    try:
                        datetime.strptime(date_value, '%Y-%m-%d')
                        # 如果只有日期，添加默认时间
                        quote['created_at'] = date_value + ' 00:00:00'
                    except ValueError:
                        errors.append(f"{filename}: created_at 格式不正确（应为 YYYY-MM-DD HH:MM:SS 或 YYYY-MM-DD）")
            else:
                errors.append(f"{filename}: created_at 格式不正确")

        # 验证 updated_at（如果存在）
        if 'updated_at' in quote:
            date_value = quote['updated_at']
            if isinstance(date_value, datetime):
                quote['updated_at'] = date_value.strftime('%Y-%m-%d %H:%M:%S')
            elif hasattr(date_value, 'strftime'):
                quote['updated_at'] = date_value.strftime('%Y-%m-%d %H:%M:%S')
            elif isinstance(date_value, str):
                try:
                    datetime.strptime(date_value, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    try:
                        datetime.strptime(date_value, '%Y-%m-%d')
                        quote['updated_at'] = date_value + ' 00:00:00'
                    except ValueError:
                        errors.append(f"{filename}: updated_at 格式不正确")

        # 验证 status
        if 'status' in quote:
            if quote['status'] not in ['published', 'draft']:
                errors.append(f"{filename}: status 必须是 'published' 或 'draft'")

        # 验证 tags
        if 'tags' in quote:
            if not isinstance(quote['tags'], list):
                errors.append(f"{filename}: tags 必须是数组")
            else:
                for tag in quote['tags']:
                    if not isinstance(tag, str):
                        errors.append(f"{filename}: tags 数组中的元素必须是字符串")
                    elif len(tag) > 20:
                        errors.append(f"{filename}: 标签 '{tag}' 长度超过 20 字符")

        return errors

    def process_file(self, filepath: Path) -> bool:
        """处理单个 Markdown 文件"""
        try:
            # 读取文件
            content = filepath.read_text(encoding='utf-8')

            # 解析 Frontmatter
            frontmatter, markdown_content = self.parse_frontmatter(content)

            # 从文件名提取 slug（如果 frontmatter 中没有）
            if 'slug' not in frontmatter or not frontmatter['slug']:
                # 从文件名提取：20260117123456-quote-slug.md -> quote-slug
                stem = filepath.stem
                if '-' in stem:
                    # 移除时间前缀
                    parts = stem.split('-', 1)
                    if len(parts) > 1 and len(parts[0]) == 14 and parts[0].isdigit():
                        frontmatter['slug'] = parts[1]
                    else:
                        frontmatter['slug'] = stem
                else:
                    frontmatter['slug'] = stem

            # 构建金句对象
            quote = {
                'id': frontmatter.get('id', ''),
                'content': markdown_content if markdown_content else frontmatter.get('content', ''),
                'created_at': frontmatter.get('created_at', ''),
                'updated_at': frontmatter.get('updated_at', frontmatter.get('created_at', '')),
                'status': frontmatter.get('status', 'published'),
                'tags': frontmatter.get('tags', []),
                'slug': frontmatter.get('slug', ''),
            }

            # 添加可选字段
            if 'title' in frontmatter:
                quote['title'] = frontmatter['title']
            if 'author' in frontmatter:
                quote['author'] = frontmatter['author']
            if 'source' in frontmatter:
                quote['source'] = frontmatter['source']
            if 'source_url' in frontmatter:
                quote['source_url'] = frontmatter['source_url']
            if 'category' in frontmatter:
                quote['category'] = frontmatter['category']
            if 'poster_template' in frontmatter:
                quote['poster_template'] = frontmatter['poster_template']

            # 如果 content 在 frontmatter 中，优先使用
            if 'content' in frontmatter and frontmatter['content']:
                quote['content'] = frontmatter['content']
            elif not quote['content']:
                # 如果都没有，使用 markdown 内容
                quote['content'] = markdown_content

            # 验证金句
            errors = self.validate_quote(quote, filepath.name)
            if errors:
                self.errors.extend(errors)
                return False

            # 处理 tags：去重、排序
            quote['tags'] = sorted(list(set(quote['tags'])))

            self.quotes.append(quote)
            return True

        except Exception as e:
            self.errors.append(f"{filepath.name}: {str(e)}")
            return False

    def build(self) -> bool:
        """构建所有金句"""
        if not self.content_dir.exists():
            self.errors.append(f"内容目录不存在: {self.content_dir}")
            return False

        # 递归查找所有 .md 文件（支持子目录结构）
        md_files = list(self.content_dir.rglob('*.md'))

        if not md_files:
            self.errors.append(f"在 {self.content_dir} 中未找到 Markdown 文件")
            return False

        print(f"找到 {len(md_files)} 个 Markdown 文件")

        # 处理每个文件
        success_count = 0
        for md_file in md_files:
            if self.process_file(md_file):
                success_count += 1
                print(f"✓ 处理成功: {md_file.relative_to(self.content_dir)}")
            else:
                print(f"✗ 处理失败: {md_file.relative_to(self.content_dir)}")

        # 检查是否有重复的 id 或 slug
        ids = [quote['id'] for quote in self.quotes]
        slugs = [quote.get('slug', '') for quote in self.quotes if quote.get('slug')]

        if len(ids) != len(set(ids)):
            duplicates = [id for id in ids if ids.count(id) > 1]
            self.errors.append(f"发现重复的 id: {set(duplicates)}")

        if slugs and len(slugs) != len(set(slugs)):
            duplicates = [slug for slug in slugs if slugs.count(slug) > 1]
            self.errors.append(f"发现重复的 slug: {set(duplicates)}")

        # 按时间倒序排序
        self.quotes.sort(key=lambda x: x['created_at'], reverse=True)

        print(f"\n成功处理 {success_count}/{len(md_files)} 个文件")

        if self.errors:
            print(f"\n发现 {len(self.errors)} 个错误:")
            for error in self.errors:
                print(f"  - {error}")
            return False

        return True

    def save(self) -> bool:
        """保存到 JSON 文件"""
        try:
            # 确保输出目录存在
            self.output_file.parent.mkdir(parents=True, exist_ok=True)

            # 保存 JSON
            with open(self.output_file, 'w', encoding='utf-8') as f:
                json.dump(self.quotes, f, ensure_ascii=False, indent=2)

            print(f"\n✓ 成功生成 {self.output_file}")
            print(f"  共 {len(self.quotes)} 条金句")

            # 统计标签和分类
            all_tags = []
            categories = []
            for quote in self.quotes:
                all_tags.extend(quote['tags'])
                if 'category' in quote and quote['category']:
                    categories.append(quote['category'])

            unique_tags = sorted(set(all_tags))
            unique_categories = sorted(set(categories))

            if unique_tags:
                print(f"  共 {len(unique_tags)} 个唯一标签: {', '.join(unique_tags[:10])}{'...' if len(unique_tags) > 10 else ''}")
            if unique_categories:
                print(f"  共 {len(unique_categories)} 个分类: {', '.join(unique_categories)}")

            return True
        except Exception as e:
            self.errors.append(f"保存文件失败: {str(e)}")
            return False


def main():
    """主函数"""
    # 获取项目根目录
    project_root = Path(__file__).parent.parent

    content_dir = project_root / 'content' / 'quotes'
    output_file = project_root / 'frontend' / 'src' / 'data' / 'quotes.json'

    print("=" * 60)
    print("PKAS 金句构建脚本")
    print("=" * 60)
    print(f"内容目录: {content_dir}")
    print(f"输出文件: {output_file}")
    print()

    builder = QuoteBuilder(str(content_dir), str(output_file))

    if builder.build():
        if builder.save():
            print("\n✅ 构建完成！")
            return 0
        else:
            print("\n❌ 保存失败")
            return 1
    else:
        print("\n❌ 构建失败，请检查错误信息")
        return 1


if __name__ == '__main__':
    exit(main())

