# 项目开发计划

## Phase 1：基础可用（1–2 天）✅ **已完成**

### 项目初始化
- [x] 创建 GitHub 仓库并完成初始提交
  - 验证：仓库存在，包含 README.md
- [x] 使用 Vite 初始化 React 项目
  - 验证：`npm run dev` 能启动，显示默认页面 ✅
- [x] 安装核心依赖：react-router、react-helmet-async、markdown-it
  - 验证：`package.json` 包含依赖，无安装错误 ✅

### 数据通路
- [x] 创建 `src/data/posts.json` 示例文件（至少 2 篇文章）
  - 验证：JSON 格式正确，包含 id、title、slug、content 等字段 ✅（3 篇示例文章）
- [x] 实现 Markdown 渲染组件 `MarkdownRenderer.tsx`
  - 验证：能正确渲染 Markdown 内容为 HTML ✅
- [x] 实现路由配置（Home、PostList、PostDetail）
  - 验证：所有路由可访问，无 404 错误 ✅

### 页面实现
- [x] 实现首页 `Home.tsx`（显示最新文章列表）
  - 验证：页面显示文章标题、摘要、日期 ✅
- [x] 实现文章详情页 `PostDetail.tsx`（渲染 Markdown）
  - 验证：点击文章能跳转，内容正确渲染 ✅
- [x] 实现 SEO 组件，动态设置 title 和 meta
  - 验证：浏览器标签页显示正确标题，查看源码有 meta 标签 ✅
- [x] 实现布局组件 `Layout.tsx`（Header、Footer、导航）
  - 验证：所有页面使用统一布局 ✅
- [x] 实现文章列表页 `PostList.tsx`
  - 验证：显示所有文章，支持标签筛选 ✅
- [x] 添加 GEO 页面基础结构
  - 验证：GEO 页面可访问，基础结构完成 ✅

### 额外完成
- [x] 配置 Tailwind CSS 样式系统
- [x] 创建安装优化脚本和诊断工具
- [x] 修复 TypeScript 类型导入问题
- [x] 修复 Rollup 可选依赖问题
- [x] 创建项目文档（README、INSTALL、TROUBLESHOOTING）

### 验收标准

✅ 本地访问 `http://localhost:5173` 能看到 Blog

✅ 点击文章能查看详情页

✅ 查看页面源码，title 和 meta 标签正确

✅ 无控制台错误

✅ 所有功能已验证通过

---

## Phase 2：Python 数据构建（2–3 天）✅ **已完成**

### 目录规范
- [x] 创建 `content/posts/` 目录
- [x] 定义 Markdown Frontmatter 标准（title、date、tags、summary）
  - 验证：编写示例文件，格式符合规范 ✅（3 个示例文件）

### Python 脚本
- [x] 创建 `scripts/build_posts.py`
- [x] 实现解析 Markdown frontmatter
  - 验证：能读取并解析 frontmatter 字段 ✅
- [x] 实现生成 `posts.json`（包含所有文章）
  - 验证：运行脚本后生成正确的 JSON 文件 ✅
- [x] 实现按时间倒序排序
  - 验证：JSON 中文章按日期从新到旧排列 ✅
- [x] 实现标签统计和去重
  - 验证：输出标签列表，无重复 ✅

### 集成
- [x] 添加构建脚本到 `package.json`
  - 验证：`npm run build:data` 能执行 Python 脚本 ✅
- [x] 更新 React 应用读取生成的 `posts.json`
  - 验证：前端能正确加载并显示所有文章 ✅（前端已支持）

### 额外完成
- [x] 创建 Markdown 规范文档
- [x] 创建 Python 数据构建文档
- [x] 实现数据验证和错误处理
- [x] 创建 requirements.txt

### 验收标准
✅ 运行 `python3 scripts/build_posts.py` 无错误
✅ 生成的 `posts.json` 格式正确
✅ 前端能显示所有文章
✅ 文章按时间倒序显示
✅ 所有功能已验证通过

---

## Phase 3：AI 自动生成管道（进阶）

### Prompt 模板
- [ ] 创建 `templates/prompt_reading.md`（读书笔记模板）
- [ ] 创建 `templates/prompt_thought.md`（思考感悟模板）
- [ ] 创建 `templates/prompt_quote.md`（金句模板）
  - 验证：每个模板文件存在，格式清晰

### AI 集成
- [ ] 创建 `scripts/ai_generate.py`（调用 AI API）
- [ ] 实现生成 Markdown 内容
  - 验证：能调用 API 并返回 Markdown 格式内容
- [ ] 实现自动写入 `content/posts/` 目录
  - 验证：生成的文件符合 Frontmatter 规范

### 工作流
- [ ] 实现人工 review 开关（生成后不自动构建）
  - 验证：生成的文件需要手动确认后才进入构建流程
- [ ] 添加生成日志记录
  - 验证：每次生成都有记录（时间、标题、状态）

### 验收标准
✅ 能通过脚本生成符合规范的 Markdown 文件
✅ 生成的文件需要人工 review 后才构建
✅ 有生成记录可查

---

## Phase 4：资产 & 成本模块

### 数据模型
- [ ] 定义服务器 JSON Schema（`schemas/server.json`）
  - 验证：Schema 包含 IP、提供商、配置、月费用等字段
- [ ] 定义域名 JSON Schema（`schemas/domain.json`）
  - 验证：Schema 包含域名、注册商、到期日、年费用等字段

### 功能实现
- [ ] 创建 `src/pages/Assets.tsx` 页面
- [ ] 实现服务器列表展示
  - 验证：页面显示所有服务器信息
- [ ] 实现域名列表展示（高亮即将到期）
  - 验证：30 天内到期的域名有特殊标识
- [ ] 实现成本聚合计算（月/年总成本）
  - 验证：页面显示准确的成本统计

### 可视化
- [ ] 集成图表库（ECharts 或 Recharts）
- [ ] 实现成本趋势图（按月）
  - 验证：图表正确显示数据
- [ ] 实现资产分布图（按类型）
  - 验证：图表正确显示分布

### 验收标准
✅ 能查看所有资产信息
✅ 域名到期提醒功能正常
✅ 成本统计准确
✅ 图表正确显示

---

## Phase 5：进阶演进（可选）

- [ ] 搭建 FastAPI 后端（如需要动态功能）
- [ ] 实现登录认证（仅个人使用）
- [ ] 支持多项目/多站点管理
- [ ] 实现私有/公开内容混合展示

---

## 当前状态

**当前阶段**：Phase 2 ✅ **已完成**

**已完成工作**：

**Phase 1**：
- ✅ React + Vite 项目初始化完成
- ✅ 所有核心依赖安装完成
- ✅ 示例数据文件创建完成（3 篇文章）
- ✅ 所有页面组件实现完成
- ✅ SEO 支持完成
- ✅ Markdown 渲染完成
- ✅ 路由配置完成
- ✅ Tailwind CSS 样式系统配置完成
- ✅ 项目文档完善

**Phase 2**：
- ✅ 创建 `content/posts/` 目录结构
- ✅ 定义 Markdown Frontmatter 标准
- ✅ 开发 Python 数据构建脚本
- ✅ 实现自动生成 posts.json 功能
- ✅ 集成到构建流程（npm run build:data）
- ✅ 数据验证和错误处理
- ✅ 文档完善

**下一步行动**（Phase 3）：
1. 创建 AI 生成 Prompt 模板
2. 开发 AI 内容生成脚本
3. 实现人工 review 机制
4. 添加生成日志记录
