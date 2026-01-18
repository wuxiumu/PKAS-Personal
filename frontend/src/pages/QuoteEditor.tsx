import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import type { Quote } from '../types';
import quotesData from '../data/quotes.json';

const quotes = quotesData as Quote[];

const DRAFT_KEY_PREFIX = 'quote_draft_';

// 生成ID：quote_YYYYMMDD_HHMMSS
const generateQuoteId = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().replace(/[-:]/g, '').replace('T', '_').substring(0, 15);
  return `quote_${dateStr}`;
};

// 从ID提取时间戳：quote_20260118_013239 -> 20260118013239
const extractTimestampFromId = (id: string): string => {
  const match = id.match(/quote_(\d{8})_(\d{6})/);
  if (match) {
    return match[1] + match[2]; // YYYYMMDD + HHMMSS
  }
  // 如果格式不对，使用当前时间
  const now = new Date();
  return now.toISOString().replace(/[-:]/g, '').replace('T', '').substring(0, 14);
};

// 生成slug：从内容或标题生成
const generateSlug = (content: string, title?: string): string => {
  // 优先使用标题，否则使用内容的前30个字符
  let text = (title || content || '').trim();
  if (!text) return 'quote';

  // 如果使用内容，只取前30个字符
  if (!title && text.length > 30) {
    text = text.substring(0, 30);
  }

  // 移除标点符号，保留中文、字母、数字
  let slug = text
    .replace(/[，。！？、；：""''（）【】《》]/g, '') // 移除中文标点
    .replace(/[^\w\s\u4e00-\u9fff-]/g, '') // 保留中文、字母、数字、连字符
    .replace(/\s+/g, '-') // 空格转连字符
    .replace(/-+/g, '-'); // 多个连字符合并为一个

  // 只对英文部分转小写，中文保持不变
  slug = slug.replace(/[a-zA-Z]+/g, (match) => match.toLowerCase());

  // 限制长度（中文按字符数计算）
  if (slug.length > 50) {
    slug = slug.substring(0, 50);
  }

  // 移除首尾连字符
  slug = slug.replace(/^-+|-+$/g, '');

  return slug || 'quote';
};

export const QuoteEditor: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const isEditMode = !!slug;

  // 获取现有金句（编辑模式）
  const existingQuote = useMemo(() => {
    if (!slug) return null;
    return quotes.find((q) => (q.slug === slug) || (q.id === slug)) || null;
  }, [slug]);

  // 从 localStorage 加载草稿
  const loadDraft = (): Partial<Quote> => {
    if (!slug) {
      // 新建模式：从 new 草稿加载
      try {
        const draft = localStorage.getItem(`${DRAFT_KEY_PREFIX}new`);
        if (draft) {
          return JSON.parse(draft);
        }
      } catch (e) {
        console.error('加载草稿失败:', e);
      }
      return {};
    }
    // 编辑模式：从 slug 草稿加载
    try {
      const draft = localStorage.getItem(`${DRAFT_KEY_PREFIX}${slug}`);
      if (draft) {
        return JSON.parse(draft);
      }
    } catch (e) {
      console.error('加载草稿失败:', e);
    }
    return {};
  };

  // 初始化表单数据
  const [formData, setFormData] = useState<Partial<Quote>>(() => {
    if (isEditMode && existingQuote) {
      const draft = loadDraft();
      return {
        ...existingQuote,
        ...draft,
        // 确保 content 在 frontmatter 中
        content: draft.content || existingQuote.content || ''
      };
    }
    // 新建模式：从草稿或默认值
    const draft = loadDraft();
    const now = new Date();
    const nowStr = now.toISOString().replace('T', ' ').substring(0, 19);
    return {
      id: draft.id || generateQuoteId(), // 自动生成ID
      title: draft.title || '',
      content: draft.content || '',
      author: draft.author || '',
      source: draft.source || '',
      source_url: draft.source_url || '',
      tags: draft.tags || [],
      category: draft.category || '',
      status: (draft.status as 'published' | 'draft') || 'draft',
      poster_template: draft.poster_template || 'default',
      created_at: draft.created_at || nowStr,
      updated_at: nowStr
    };
  });

  const [tagsInput, setTagsInput] = useState<string>(formData.tags?.join(', ') || '');
  const [showPreview, setShowPreview] = useState(true);

  // 自动保存草稿
  useEffect(() => {
    const draftKey = slug ? `${DRAFT_KEY_PREFIX}${slug}` : `${DRAFT_KEY_PREFIX}new`;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({
          ...formData,
          tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        }));
        console.log('草稿已自动保存');
      } catch (e) {
        console.error('保存草稿失败:', e);
      }
    }, 1000); // 1秒后保存

    return () => clearTimeout(timer);
  }, [formData, tagsInput, slug]);

  // 处理表单字段变化
  const handleChange = (field: keyof Quote, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 处理标签输入
  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);
    handleChange('tags', tags);
  };

  // 生成 Markdown 内容
  const generateMarkdown = (): string => {
    // 确保ID存在，如果不存在则自动生成
    const quoteId = formData.id || (isEditMode ? existingQuote?.id : generateQuoteId());

    // 生成slug（如果不存在）
    const slug = formData.slug || generateSlug(formData.content || '', formData.title);

    const frontmatter: Record<string, any> = {
      id: quoteId,
      content: formData.content || '',
      created_at: formData.created_at || new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: formData.status || 'draft',
      tags: formData.tags || [],
      slug: slug
    };

    if (formData.title) frontmatter.title = formData.title;
    if (formData.author) frontmatter.author = formData.author;
    if (formData.source) frontmatter.source = formData.source;
    if (formData.source_url) frontmatter.source_url = formData.source_url;
    if (formData.category) frontmatter.category = formData.category;
    if (formData.poster_template) frontmatter.poster_template = formData.poster_template;

    // 生成 YAML frontmatter
    const yamlLines = Object.entries(frontmatter).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
      }
      return `${key}: ${value}`;
    });

    return `---\n${yamlLines.join('\n')}\n---\n\n${formData.content || ''}`;
  };

  // 下载 Markdown 文件
  const handleDownload = () => {
    const markdown = generateMarkdown();

    // 生成符合规范的文件名：YYYYMMDDHHMMSS-slug.md
    const quoteId = formData.id || generateQuoteId();
    const timestamp = extractTimestampFromId(quoteId);
    const slug = generateSlug(formData.content || '', formData.title);
    const filename = `${timestamp}-${slug}.md`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 验证表单
  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!formData.content || !formData.content.trim()) {
      errors.push('内容不能为空');
    }
    if (!formData.id || !formData.id.trim()) {
      errors.push('ID 不能为空');
    } else if (!/^quote_\d{8}_\d{6}$/.test(formData.id)) {
      errors.push('ID 格式不正确（应为 quote_YYYYMMDD_HHMMSS）');
    }
    if (formData.tags && formData.tags.some(tag => tag.length > 20)) {
      errors.push('标签长度不能超过 20 字符');
    }
    return errors;
  };

  // 保存（下载文件）
  const handleSave = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('表单验证失败：\n' + errors.join('\n'));
      return;
    }

    handleDownload();
    alert('Markdown 文件已下载，请将其保存到 content/quotes/ 目录');
  };

  // 清除草稿
  const handleClearDraft = () => {
    if (confirm('确定要清除草稿吗？')) {
      const draftKey = slug ? `${DRAFT_KEY_PREFIX}${slug}` : `${DRAFT_KEY_PREFIX}new`;
      localStorage.removeItem(draftKey);
      if (isEditMode && existingQuote) {
        setFormData(existingQuote);
        setTagsInput(existingQuote.tags?.join(', ') || '');
      } else {
        const now = new Date();
        const nowStr = now.toISOString().replace('T', ' ').substring(0, 19);
        setFormData({
          id: generateQuoteId(), // 重新生成ID
          title: '',
          content: '',
          author: '',
          source: '',
          source_url: '',
          tags: [],
          category: '',
          status: 'draft',
          poster_template: 'default',
          created_at: nowStr,
          updated_at: nowStr
        });
        setTagsInput('');
      }
    }
  };

  // 快捷键：Ctrl+S 保存
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, tagsInput]);

  return (
    <Layout title={isEditMode ? '编辑金句' : '新建金句'}>
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to="/quotes"
              className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block"
            >
              ← 返回金句库
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? '编辑金句' : '新建金句'}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showPreview ? '隐藏预览' : '显示预览'}
            </button>
            <button
              onClick={handleClearDraft}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              清除草稿
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存 (Ctrl+S)
            </button>
          </div>
        </div>

        {/* 编辑器 */}
        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* 左侧：编辑区 */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      ID <span className="text-red-500">*</span>
                    </label>
                    {!isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleChange('id', generateQuoteId())}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        title="重新生成ID"
                      >
                        🔄 重新生成
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.id || ''}
                    onChange={(e) => handleChange('id', e.target.value)}
                    placeholder="quote_20260117_120000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    readOnly={!isEditMode}
                    title={isEditMode ? "编辑模式下可修改" : "新建模式下自动生成，点击重新生成按钮可更新"}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? "格式：quote_YYYYMMDD_HHMMSS（编辑模式下可修改）" : "自动生成，格式：quote_YYYYMMDD_HHMMSS"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标题
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="金句标题（可选）"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="输入金句内容..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      作者
                    </label>
                    <input
                      type="text"
                      value={formData.author || ''}
                      onChange={(e) => handleChange('author', e.target.value)}
                      placeholder="作者名称"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      来源
                    </label>
                    <input
                      type="text"
                      value={formData.source || ''}
                      onChange={(e) => handleChange('source', e.target.value)}
                      placeholder="书籍/文章名称"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    来源链接
                  </label>
                  <input
                    type="url"
                    value={formData.source_url || ''}
                    onChange={(e) => handleChange('source_url', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标签（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="思考, 哲学, 读书"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分类
                    </label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                      placeholder="读书"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      状态
                    </label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">草稿</option>
                      <option value="published">已发布</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    创建时间
                  </label>
                  <input
                    type="text"
                    value={formData.created_at || ''}
                    onChange={(e) => handleChange('created_at', e.target.value)}
                    placeholder="2026-01-17 12:00:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：预览区 */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">预览</h2>
              <div className="border rounded-lg p-6 bg-gray-50 min-h-[400px]">
                {formData.title && (
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{formData.title}</h3>
                )}
                <blockquote className="text-lg text-gray-900 leading-relaxed mb-4 italic">
                  "{formData.content || '（内容为空）'}"
                </blockquote>
                {formData.author && (
                  <p className="text-gray-700 mb-2">— {formData.author}</p>
                )}
                {formData.source && (
                  <p className="text-gray-600 mb-4">
                    {formData.source_url ? (
                      <a href={formData.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline">
                        《{formData.source}》
                      </a>
                    ) : (
                      `《${formData.source}》`
                    )}
                  </p>
                )}
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-4">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {formData.category && (
                  <div className="mt-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {formData.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Markdown 预览 */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">生成的 Markdown</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-64">
                  {generateMarkdown()}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

