# Markdown Frontmatter 规范

## 文件格式

每个 Markdown 文件必须包含 YAML Frontmatter 和正文内容。

## Frontmatter 标准

### 必需字段

```yaml
---
id: unique_post_id          # 唯一标识符，如：llm_thought_001
title: 文章标题              # 文章标题
slug: url-friendly-slug     # URL 友好的标识符，如：llm-as-cognition-amplifier
summary: 文章摘要            # 简短摘要，用于列表页显示
tags:                        # 标签数组
  - AI
  - LLM
  - 认知
created_at: 2026-01-10      # 创建日期，格式：YYYY-MM-DD
---
```

### 可选字段

```yaml
---
updated_at: 2026-01-15      # 更新日期（可选）
author: 作者名               # 作者（可选，默认不显示）
category: 分类              # 分类（可选）
status: published           # 状态：draft（草稿）/ published（已发布）
---
```

## 完整示例

```markdown
---
id: llm_thought_001
title: 为什么大模型更像认知放大器
slug: llm-as-cognition-amplifier
summary: 从工程和认知角度理解 LLM 的本质。
tags:
  - AI
  - LLM
  - 认知
created_at: 2026-01-10
status: published
---

## 正文

这里是 Markdown 格式的正文内容。

### 大模型的核心价值

大模型不仅仅是文本生成工具，更是**认知放大器**。
```

## 文件命名规范

- 文件名：使用 slug 命名，如：`llm-as-cognition-amplifier.md`
- 位置：`content/posts/` 目录下
- 编码：UTF-8

## 数据转换

Python 脚本会将 Markdown 文件转换为 JSON 格式：

```json
{
  "id": "llm_thought_001",
  "title": "为什么大模型更像认知放大器",
  "slug": "llm-as-cognition-amplifier",
  "summary": "从工程和认知角度理解 LLM 的本质。",
  "tags": ["AI", "LLM", "认知"],
  "created_at": "2026-01-10",
  "content": "## 正文\n\n这里是 Markdown 格式的正文内容..."
}
```

## 验证规则

1. **id**：必须唯一，不能重复
2. **slug**：必须唯一，URL 友好（小写、连字符分隔）
3. **created_at**：必须是有效的日期格式（YYYY-MM-DD）
4. **tags**：数组格式，每个标签为字符串
5. **content**：不能为空

## 注意事项

- Frontmatter 必须使用 `---` 包裹
- 日期格式必须严格遵循 `YYYY-MM-DD`
- slug 会自动从文件名提取（如果 frontmatter 中没有）
- 标签会自动去重和排序

