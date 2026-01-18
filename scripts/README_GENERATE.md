# 文章生成脚本使用指南

## generate_post.py

使用 AI 生成 Markdown 格式的文章，支持多种主题类型。

## 快速开始

### 书籍文章生成

```bash
# 设置 API Key
export DASHSCOPE_API_KEY='your-api-key'

# 运行测试脚本
bash scripts/test_book_generation.sh
```

### 手动生成

```bash
python3 scripts/generate_post.py \
    --topic book \
    --title "穷爸爸富爸爸" \
    --author "罗伯特·清崎" \
    --goal "思维启蒙：从打工思维到资产思维" \
    --date "2026-01-17" \
    --prompt book_reading \
    --force
```

## 输出格式

生成的文件会保存到：`content/posts/{slug}.md`

### Frontmatter 格式

生成的文件包含完整的 YAML Frontmatter，符合项目规范：

```yaml
---
id: book_reading_20260117_123456
title: 穷爸爸富爸爸 - 读书笔记
slug: qiong-ba-ba-fu-ba-ba
summary: 一句话总结本书的核心价值
tags:
  - 读书
  - 理财
  - 思维
created_at: 2026-01-17
status: published
---
```

### 正文结构

包含以下章节：
- ## TL;DR（一句话总结）
- ## 要点（3-5个核心观点）
- ## 事实与来源
- ## 时间线
- ## 增量整理
- ## 风险与边界
- ## 站内延伸阅读

## 参数说明

### 必需参数

- `--topic`: 主题类型（book, ai, finance 等）
- `--title`: 文章标题（书籍标题）

### 书籍相关参数

- `--author`: 作者名称
- `--goal`: 阅读目标
- `--date`: 日期（YYYY-MM-DD），默认今天
- `--prompt`: Prompt 模板名称，默认 `book_reading`

### 其他参数

- `--slug`: 自定义 slug（可选，会自动生成）
- `--source`: 来源 URL（可重复）
- `--force`: 覆盖已存在的文件
- `--dry-run`: 仅显示配置，不实际生成

## 工作流程

1. **生成文章**：
   ```bash
   python3 scripts/generate_post.py --topic book --title "书名" ...
   ```

2. **构建数据**：
   ```bash
   npm run build:data
   ```

3. **查看结果**：
   - 检查 `content/posts/` 目录下的 Markdown 文件
   - 检查 `frontend/src/data/posts.json` 是否已更新

## 环境变量

- `DASHSCOPE_API_KEY`: 阿里云通义千问 API Key（优先）
- `AI_API_KEY`: 通用 API Key（后备）

## 注意事项

1. **文件路径**：生成的文件直接保存在 `content/posts/` 目录，不使用年份子目录
2. **Frontmatter 格式**：必须包含所有必需字段（id, title, slug, summary, tags, created_at）
3. **唯一性**：确保 id 和 slug 唯一，避免冲突
4. **构建**：生成后需要运行 `npm run build:data` 更新 JSON 数据

## 故障排查

### API Key 问题

```bash
# 检查环境变量
echo $DASHSCOPE_API_KEY

# 或使用后备 key
export AI_API_KEY='your-api-key'
```

### 文件已存在

使用 `--force` 参数覆盖：

```bash
python3 scripts/generate_post.py ... --force
```

### 格式验证失败

检查生成的文件是否包含：
- 完整的 Frontmatter
- 所有必需的章节
- 正确的格式
