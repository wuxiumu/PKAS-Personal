import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import type { Post } from '../types';
import postsData from '../data/posts.json';

const posts = postsData as Post[];
const POSTS_PER_PAGE = 10;

export const PostList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const selectedTag = searchParams.get('tag') || '';

  // 获取所有标签
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  // 过滤和搜索文章
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // 标签过滤
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const summaryMatch = post.summary.toLowerCase().includes(query);
        const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(query));
        const contentMatch = post.content.toLowerCase().includes(query);
        return titleMatch || summaryMatch || tagsMatch || contentMatch;
      });
    }

    // 按时间倒序排序
    return filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [selectedTag, searchQuery]);

  // 分页计算
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // 当过滤条件改变时，重置到第一页
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
      updateSearchParams({ page: '1' });
    }
  }, [selectedTag, searchQuery, totalPages]);

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
      updateSearchParams({ tag, page: '1' });
    }
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
      return `标签为"${selectedTag}"的文章列表，共找到 ${filteredPosts.length} 篇文章`;
    }
    if (searchQuery) {
      return `搜索"${searchQuery}"的结果，共找到 ${filteredPosts.length} 篇文章`;
    }
    return `所有文章列表，共 ${posts.length} 篇文章`;
  }, [selectedTag, searchQuery, filteredPosts.length]);

  // SEO 标题
  const seoTitle = useMemo(() => {
    if (selectedTag) {
      return `标签: ${selectedTag}`;
    }
    if (searchQuery) {
      return `搜索: ${searchQuery}`;
    }
    return '文章列表';
  }, [selectedTag, searchQuery]);

  // 结构化数据
  const structuredData = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = `${baseUrl}/posts${selectedTag ? `?tag=${encodeURIComponent(selectedTag)}` : searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`;

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: seoTitle,
      description: seoDescription,
      url: currentUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: filteredPosts.length,
        itemListElement: paginatedPosts.map((post, index) => ({
          '@type': 'ListItem',
          position: startIndex + index + 1,
          item: {
            '@type': 'BlogPosting',
            '@id': `${baseUrl}/posts/${post.slug}`,
            headline: post.title,
            description: post.summary,
            datePublished: post.created_at,
            author: {
              '@type': 'Person',
              name: 'PKAS'
            },
            keywords: post.tags.join(', ')
          }
        }))
      }
    };
  }, [seoTitle, seoDescription, filteredPosts.length, paginatedPosts, startIndex, selectedTag, searchQuery]);

  return (
    <Layout title={seoTitle} description={seoDescription} structuredData={structuredData}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {selectedTag ? `标签: ${selectedTag}` : searchQuery ? `搜索: ${searchQuery}` : '所有文章'}
        </h1>

        {/* 搜索框 */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章标题、摘要、标签或内容..."
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

        {/* 标签筛选 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">标签</h2>
            {selectedTag && (
              <button
                onClick={() => handleTagClick(selectedTag)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                清除标签筛选
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-6 text-sm text-gray-600">
          共找到 <span className="font-semibold">{filteredPosts.length}</span> 篇文章
          {currentPage > 1 && (
            <span>
              {' '}
              (第 {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} 条)
            </span>
          )}
        </div>

        {/* 文章列表 */}
        {paginatedPosts.length > 0 ? (
          <>
            <div className="space-y-6">
              {paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        <Link
                          to={`/posts/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4">{post.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{post.created_at}</span>
                      <Link
                        to={`/posts/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        阅读全文 →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 分页 */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg mb-4">未找到相关文章</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
                updateSearchParams({ q: null, tag: null, page: '1' });
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

