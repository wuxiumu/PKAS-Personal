import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { QuoteCard } from '../components/QuoteCard';
import { QuoteFilter } from '../components/QuoteFilter';
import type { Quote } from '../types';
import quotesData from '../data/quotes.json';

const quotes = quotesData as Quote[];
const QUOTES_PER_PAGE = 12;

export const QuoteList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (searchParams.get('view') as 'grid' | 'list') || 'grid'
  );
  const selectedTag = searchParams.get('tag') || '';
  const selectedCategory = searchParams.get('category') || '';

  // 获取所有标签和分类
  const allTags = useMemo(() => {
    return Array.from(new Set(quotes.flatMap((quote) => quote.tags))).sort();
  }, []);

  const allCategories = useMemo(() => {
    return Array.from(new Set(quotes.map((q) => q.category).filter(Boolean) as string[])).sort();
  }, []);

  // 过滤和搜索金句
  const filteredQuotes = useMemo(() => {
    let filtered = quotes.filter((q) => q.status === 'published');

    // 标签过滤
    if (selectedTag) {
      filtered = filtered.filter((quote) => quote.tags.includes(selectedTag));
    }

    // 分类过滤
    if (selectedCategory) {
      filtered = filtered.filter((quote) => quote.category === selectedCategory);
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((quote) => {
        const titleMatch = quote.title?.toLowerCase().includes(query) || false;
        const contentMatch = quote.content.toLowerCase().includes(query);
        const authorMatch = quote.author?.toLowerCase().includes(query) || false;
        const sourceMatch = quote.source?.toLowerCase().includes(query) || false;
        const tagsMatch = quote.tags.some((tag) => tag.toLowerCase().includes(query));
        return titleMatch || contentMatch || authorMatch || sourceMatch || tagsMatch;
      });
    }

    // 按时间倒序排序
    return filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [selectedTag, selectedCategory, searchQuery]);

  // 分页计算
  const totalPages = Math.ceil(filteredQuotes.length / QUOTES_PER_PAGE);
  const startIndex = (currentPage - 1) * QUOTES_PER_PAGE;
  const endIndex = startIndex + QUOTES_PER_PAGE;
  const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex);

  // 当过滤条件改变时，重置到第一页
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
      updateSearchParams({ page: '1' });
    }
  }, [selectedTag, selectedCategory, searchQuery, totalPages]);

  // 更新 URL 参数
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateSearchParams({ q: searchQuery.trim() || null, page: '1' });
  };

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setCurrentPage(1);
    if (selectedTag === tag) {
      updateSearchParams({ tag: null, page: '1' });
    } else {
      updateSearchParams({ tag: tag || null, page: '1' });
    }
  };

  // 处理分类点击
  const handleCategoryClick = (category: string) => {
    setCurrentPage(1);
    if (selectedCategory === category) {
      updateSearchParams({ category: null, page: '1' });
    } else {
      updateSearchParams({ category: category || null, page: '1' });
    }
  };

  // 处理视图切换
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    updateSearchParams({ view: mode });
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 生成分页按钮
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // 第一页
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
    }

    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium ${
            i === currentPage
              ? 'text-white bg-blue-600 border border-blue-600'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // 最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-1 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    );
  };

  // SEO 描述
  const seoDescription = useMemo(() => {
    if (selectedTag) {
      return `标签为"${selectedTag}"的金句列表，共找到 ${filteredQuotes.length} 条金句`;
    }
    if (selectedCategory) {
      return `分类为"${selectedCategory}"的金句列表，共找到 ${filteredQuotes.length} 条金句`;
    }
    if (searchQuery) {
      return `搜索"${searchQuery}"的结果，共找到 ${filteredQuotes.length} 条金句`;
    }
    return `金句库，共 ${quotes.length} 条金句`;
  }, [selectedTag, selectedCategory, searchQuery, filteredQuotes.length]);

  // SEO 标题
  const seoTitle = useMemo(() => {
    if (selectedTag) {
      return `标签: ${selectedTag}`;
    }
    if (selectedCategory) {
      return `分类: ${selectedCategory}`;
    }
    if (searchQuery) {
      return `搜索: ${searchQuery}`;
    }
    return '金句库';
  }, [selectedTag, selectedCategory, searchQuery]);

  // 结构化数据
  const structuredData = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = `${baseUrl}/quotes${selectedTag ? `?tag=${encodeURIComponent(selectedTag)}` : selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`;

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: seoTitle,
      description: seoDescription,
      url: currentUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: filteredQuotes.length,
        itemListElement: paginatedQuotes.map((quote, index) => ({
          '@type': 'ListItem',
          position: startIndex + index + 1,
          item: {
            '@type': 'CreativeWork',
            '@id': `${baseUrl}/quotes/${quote.slug || quote.id}`,
            headline: quote.title || quote.content.substring(0, 50),
            text: quote.content,
            author: quote.author ? {
              '@type': 'Person',
              name: quote.author
            } : undefined,
            keywords: quote.tags.join(', ')
          }
        }))
      }
    };
  }, [seoTitle, seoDescription, filteredQuotes.length, paginatedQuotes, startIndex, selectedTag, selectedCategory, searchQuery]);

  return (
    <Layout title={seoTitle} description={seoDescription} structuredData={structuredData}>
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedTag ? `标签: ${selectedTag}` : selectedCategory ? `分类: ${selectedCategory}` : searchQuery ? `搜索: ${searchQuery}` : '金句库'}
          </h1>
          <div className="flex items-center gap-4">
            {/* 视图切换 */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="网格视图"
              >
                ⏹
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="列表视图"
              >
                ☰
              </button>
            </div>
            <Link
              to="/quotes/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 新建
            </Link>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索金句内容、作者、来源、标签..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              搜索
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  updateSearchParams({ q: null, page: '1' });
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                清除
              </button>
            )}
          </form>
        </div>

        {/* 筛选器 */}
        <QuoteFilter
          allTags={allTags}
          allCategories={allCategories}
          selectedTag={selectedTag}
          selectedCategory={selectedCategory}
          onTagClick={handleTagClick}
          onCategoryClick={handleCategoryClick}
        />

        {/* 结果统计 */}
        <div className="mb-6 text-sm text-gray-600">
          共找到 <span className="font-semibold">{filteredQuotes.length}</span> 条金句
          {currentPage > 1 && (
            <span>
              {' '}
              (第 {startIndex + 1}-{Math.min(endIndex, filteredQuotes.length)} 条)
            </span>
          )}
        </div>

        {/* 金句列表 */}
        {paginatedQuotes.length > 0 ? (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }>
              {paginatedQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* 分页 */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg mb-4">未找到相关金句</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
                updateSearchParams({ q: null, tag: null, category: null, page: '1' });
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              清除所有筛选条件
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

