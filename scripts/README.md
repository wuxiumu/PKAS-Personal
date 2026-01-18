# PKAS 构建脚本

## build_posts.py

从 `content/posts/` 目录读取 Markdown 文件，解析 Frontmatter，生成 `frontend/src/data/posts.json`。

### 使用方法

```bash
# 直接运行
python3 scripts/build_posts.py

# 或使用 npm 脚本
npm run build:data
```

### 功能

- ✅ 解析 Markdown Frontmatter（YAML 格式）
- ✅ 验证必需字段（id、title、slug、summary、tags、created_at）
- ✅ 自动去重和排序标签
- ✅ 按时间倒序排序文章
- ✅ 检查重复的 id 和 slug
- ✅ 生成标准化的 JSON 文件

### 输出

生成的文件：`frontend/src/data/posts.json`

格式：
```json
[
  {
    "id": "unique_id",
    "title": "文章标题",
    "slug": "url-friendly-slug",
    "summary": "文章摘要",
    "tags": ["标签1", "标签2"],
    "created_at": "2026-01-10",
    "content": "Markdown 格式的内容"
  }
]
```

### 错误处理

脚本会检查并报告以下错误：
- 缺少必需字段
- 格式不正确的字段（日期、slug 等）
- 重复的 id 或 slug
- 空的 content

### 依赖

- Python 3.7+
- PyYAML

安装依赖：
```bash
pip3 install -r requirements.txt
```

