#!/usr/bin/env python3
"""
PKAS 文章构建脚本

从 content/posts/ 目录读取 Markdown 文件，解析 Frontmatter，
生成 frontend/src/data/posts.json 文件。
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime, date
import yaml


class PostBuilder:
    """文章构建器"""

    def __init__(self, content_dir: str, output_file: str):
        self.content_dir = Path(content_dir)
        self.output_file = Path(output_file)
        self.posts: List[Dict[str, Any]] = []
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

    def validate_post(self, post: Dict[str, Any], filename: str) -> List[str]:
        """验证文章数据"""
        errors = []
        required_fields = ['id', 'title', 'slug', 'summary', 'tags', 'created_at']

        # 检查必需字段
        for field in required_fields:
            if field not in post:
                errors.append(f"{filename}: 缺少必需字段 '{field}'")

        # 验证 id
        if 'id' in post and not post['id']:
            errors.append(f"{filename}: id 不能为空")

        # 验证 slug
        if 'slug' in post:
            slug = post['slug']
            if not re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', slug):
                errors.append(f"{filename}: slug 格式不正确（应是小写字母、数字和连字符）")

        # 验证日期格式
        if 'created_at' in post:
            date_value = post['created_at']
            # YAML 可能将日期解析为 date 对象，需要转换
            if isinstance(date_value, datetime):
                post['created_at'] = date_value.strftime('%Y-%m-%d')
            elif hasattr(date_value, 'strftime'):  # date 对象
                post['created_at'] = date_value.strftime('%Y-%m-%d')
            elif isinstance(date_value, str):
                try:
                    datetime.strptime(date_value, '%Y-%m-%d')
                except ValueError:
                    errors.append(f"{filename}: created_at 格式不正确（应为 YYYY-MM-DD）")
            else:
                errors.append(f"{filename}: created_at 格式不正确（应为 YYYY-MM-DD）")

        # 验证 tags
        if 'tags' in post:
            if not isinstance(post['tags'], list):
                errors.append(f"{filename}: tags 必须是数组")
            elif not all(isinstance(tag, str) for tag in post['tags']):
                errors.append(f"{filename}: tags 数组中的元素必须是字符串")

        # 验证 content
        if 'content' not in post or not post['content']:
            errors.append(f"{filename}: content 不能为空")

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
                frontmatter['slug'] = filepath.stem

            # 构建文章对象
            post = {
                'id': frontmatter.get('id', ''),
                'title': frontmatter.get('title', ''),
                'slug': frontmatter.get('slug', ''),
                'summary': frontmatter.get('summary', ''),
                'tags': frontmatter.get('tags', []),
                'created_at': frontmatter.get('created_at', ''),
                'content': markdown_content
            }

            # 添加可选字段
            if 'updated_at' in frontmatter:
                post['updated_at'] = frontmatter['updated_at']
            if 'author' in frontmatter:
                post['author'] = frontmatter['author']
            if 'category' in frontmatter:
                post['category'] = frontmatter['category']

            # 验证文章
            errors = self.validate_post(post, filepath.name)
            if errors:
                self.errors.extend(errors)
                return False

            # 处理 tags：去重、排序
            post['tags'] = sorted(list(set(post['tags'])))

            self.posts.append(post)
            return True

        except Exception as e:
            self.errors.append(f"{filepath.name}: {str(e)}")
            return False

    def build(self) -> bool:
        """构建所有文章"""
        if not self.content_dir.exists():
            self.errors.append(f"内容目录不存在: {self.content_dir}")
            return False

        # 查找所有 .md 文件
        md_files = list(self.content_dir.glob('*.md'))

        if not md_files:
            self.errors.append(f"在 {self.content_dir} 中未找到 Markdown 文件")
            return False

        print(f"找到 {len(md_files)} 个 Markdown 文件")

        # 处理每个文件
        success_count = 0
        for md_file in md_files:
            if self.process_file(md_file):
                success_count += 1
                print(f"✓ 处理成功: {md_file.name}")
            else:
                print(f"✗ 处理失败: {md_file.name}")

        # 检查是否有重复的 id 或 slug
        ids = [post['id'] for post in self.posts]
        slugs = [post['slug'] for post in self.posts]

        if len(ids) != len(set(ids)):
            duplicates = [id for id in ids if ids.count(id) > 1]
            self.errors.append(f"发现重复的 id: {set(duplicates)}")

        if len(slugs) != len(set(slugs)):
            duplicates = [slug for slug in slugs if slugs.count(slug) > 1]
            self.errors.append(f"发现重复的 slug: {set(duplicates)}")

        # 按时间倒序排序
        self.posts.sort(key=lambda x: x['created_at'], reverse=True)

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
                json.dump(self.posts, f, ensure_ascii=False, indent=2)

            print(f"\n✓ 成功生成 {self.output_file}")
            print(f"  共 {len(self.posts)} 篇文章")

            # 统计标签
            all_tags = []
            for post in self.posts:
                all_tags.extend(post['tags'])
            unique_tags = sorted(set(all_tags))
            print(f"  共 {len(unique_tags)} 个唯一标签: {', '.join(unique_tags)}")

            return True
        except Exception as e:
            self.errors.append(f"保存文件失败: {str(e)}")
            return False


def main():
    """主函数"""
    # 获取项目根目录
    project_root = Path(__file__).parent.parent

    content_dir = project_root / 'content' / 'posts'
    output_file = project_root / 'frontend' / 'src' / 'data' / 'posts.json'

    print("=" * 60)
    print("PKAS 文章构建脚本")
    print("=" * 60)
    print(f"内容目录: {content_dir}")
    print(f"输出文件: {output_file}")
    print()

    builder = PostBuilder(str(content_dir), str(output_file))

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

