# 文件命名格式说明

## 新格式

所有 `content/posts/` 目录下的文件现在使用统一格式：

```
{YYYYMMDDHH}-{slug}.md
```

### 格式说明

- `YYYYMMDDHH`: 年月日小时（10位数字）
  - `YYYY`: 年份（4位）
  - `MM`: 月份（2位）
  - `DD`: 日期（2位）
  - `HH`: 小时（2位，24小时制）
- `-`: 连字符分隔符
- `slug`: 文章的唯一标识符（URL 友好）

### 示例

- `2026011714-poor-dad-rich-dad.md` - 2026年1月17日14点生成的文章
- `2025011719-rich-dad-poor-dad-mindshift.md` - 2025年1月17日19点生成的文章

## 脚本更新

### generate_post.py

已更新为自动生成新格式的文件名：

```bash
python3 scripts/generate_post.py \
    --topic book \
    --title "书名" \
    --author "作者" \
    --goal "目标" \
    --prompt book_reading
```

生成的文件会自动使用当前时间（年月日小时）+ slug 的格式。

### rename_posts.py

用于将现有文件重命名为新格式：

```bash
# 预览将要执行的操作（不实际重命名）
python3 scripts/rename_posts.py --dry-run

# 实际执行重命名
python3 scripts/rename_posts.py
```

#### 重命名逻辑

1. 从文件的 frontmatter 中提取 `created_at` 日期和 `slug`
2. 如果 frontmatter 中有日期，使用该日期 + 文件修改时间的小时
3. 如果 frontmatter 中没有日期，使用文件修改时间
4. 生成新文件名：`{YYYYMMDDHH}-{slug}.md`

## 已重命名的文件

以下文件已自动重命名为新格式：

- `llm-as-cognition-amplifier.md` → `2026011018-llm-as-cognition-amplifier.md`
- `poor-dad-rich-dad.md` → `2025011719-poor-dad-rich-dad.md`
- `prompt-engineering-principles.md` → `2026010518-prompt-engineering-principles.md`
- `rich-dad-poor-dad-mindshift.md` → `2025011719-rich-dad-poor-dad-mindshift.md`
- `system-thinking-practice-guide.md` → `2026011719-system-thinking-practice-guide.md`
- `systems-thinking-notes.md` → `2026010819-systems-thinking-notes.md`
- `yuan-dai-ma.md` → `2026011720-yuan-dai-ma.md`

## 注意事项

1. **时间戳来源**：
   - 新生成的文件：使用当前时间（`datetime.now()`）
   - 重命名的文件：使用 frontmatter 中的 `created_at` + 文件修改时间的小时

2. **唯一性**：
   - 如果同一小时生成多篇文章，文件名会包含相同的 `YYYYMMDDHH` 前缀
   - slug 必须唯一，确保文件名不冲突

3. **构建脚本**：
   - 重命名后需要运行 `npm run build:data` 更新 JSON 数据
   - 前端会自动读取新文件名

## 故障排查

### 文件名格式不正确

检查 frontmatter 中是否有 `slug` 字段：

```yaml
---
slug: your-article-slug
created_at: 2026-01-17
---
```

### 重命名失败

1. 检查文件是否有 frontmatter
2. 检查 frontmatter 中是否有 `slug` 字段
3. 使用 `--dry-run` 预览操作

### 时间戳不准确

- 新文件：使用脚本执行时的当前时间
- 旧文件：使用文件修改时间或 frontmatter 中的日期

