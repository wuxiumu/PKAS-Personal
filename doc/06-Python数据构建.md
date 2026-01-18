# Python 数据构建

## 概述

Python 数据构建器负责从 Markdown 源文件生成标准化的 JSON 数据，供 React 前端使用。

## 工作流程

```
content/posts/*.md  (Markdown 文件)
        ↓
build_posts.py     (Python 脚本)
        ↓
frontend/src/data/posts.json  (JSON 数据)
```

## 使用方法

### 方式一：直接运行 Python 脚本

```bash
python3 scripts/build_posts.py
```

### 方式二：使用 npm 脚本（推荐）

```bash
npm run build:data
```

### 方式三：完整构建（数据 + 前端）

```bash
npm run build
```

## 目录结构

```
PKAS-Personal/
├── content/
│   └── posts/              # Markdown 源文件目录
│       ├── post-1.md
│       └── post-2.md
├── scripts/
│   └── build_posts.py      # 构建脚本
└── frontend/
    └── src/
        └── data/
            └── posts.json  # 生成的 JSON 文件
```

## 功能特性

### ✅ 已实现功能

1. **Frontmatter 解析**
   - 支持 YAML 格式的 Frontmatter
   - 自动提取元数据

2. **数据验证**
   - 检查必需字段
   - 验证日期格式
   - 验证 slug 格式
   - 检查重复的 id 和 slug

3. **数据处理**
   - 标签自动去重和排序
   - 文章按时间倒序排序
   - 自动处理日期格式转换

4. **错误报告**
   - 详细的错误信息
   - 文件级别的错误定位

## 必需字段

每个 Markdown 文件必须包含以下 Frontmatter 字段：

- `id`: 唯一标识符
- `title`: 文章标题
- `slug`: URL 友好的标识符
- `summary`: 文章摘要
- `tags`: 标签数组
- `created_at`: 创建日期（YYYY-MM-DD）

## 可选字段

- `updated_at`: 更新日期
- `author`: 作者
- `category`: 分类
- `status`: 状态（draft/published）

## 输出格式

生成的 `posts.json` 格式：

```json
[
  {
    "id": "unique_id",
    "title": "文章标题",
    "slug": "url-friendly-slug",
    "summary": "文章摘要",
    "tags": ["标签1", "标签2"],
    "created_at": "2026-01-10",
    "content": "Markdown 格式的正文内容"
  }
]
```

## 依赖安装

```bash
pip install -r requirements.txt
```

或直接安装：

```bash
pip install PyYAML
```

## 错误处理

脚本会检查并报告以下错误：

- ❌ 缺少必需字段
- ❌ 格式不正确的字段（日期、slug 等）
- ❌ 重复的 id 或 slug
- ❌ 空的 content
- ❌ Frontmatter 格式错误

## 示例输出

```
============================================================
PKAS 文章构建脚本
============================================================
内容目录: /path/to/content/posts
输出文件: /path/to/frontend/src/data/posts.json

找到 3 个 Markdown 文件
✓ 处理成功: post-1.md
✓ 处理成功: post-2.md
✓ 处理成功: post-3.md

成功处理 3/3 个文件

✓ 成功生成 /path/to/frontend/src/data/posts.json
  共 3 篇文章
  共 8 个唯一标签: AI, LLM, Prompt, 工程, 方法论, 系统思考, 认知, 读书

✅ 构建完成！
```

## 集成到 CI/CD

可以在 CI/CD 流程中使用：

```yaml
# GitHub Actions 示例
- name: Build posts data
  run: |
    pip install -r requirements.txt
    npm run build:data
```

## 下一步

- [ ] 支持草稿状态过滤
- [ ] 支持分类筛选
- [ ] 支持增量构建
- [ ] 支持图片资源处理

