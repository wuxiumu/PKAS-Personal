import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import type { Quote } from '../types';
import quotesData from '../data/quotes.json';

const quotes = quotesData as Quote[];

export const QuoteDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const quote = quotes.find((q) => (q.slug === slug) || (q.id === slug));

  // 结构化数据
  const structuredData = useMemo(() => {
    if (!quote) return undefined;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const quoteUrl = `${baseUrl}/quotes/${quote.slug || quote.id}`;

    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      headline: quote.title || quote.content.substring(0, 50),
      text: quote.content,
      datePublished: quote.created_at,
      dateModified: quote.updated_at || quote.created_at,
      author: quote.author ? {
        '@type': 'Person',
        name: quote.author
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: 'PKAS Blog',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/vite.svg`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': quoteUrl
      },
      keywords: quote.tags.join(', '),
      url: quoteUrl
    };
  }, [quote]);

  if (!quote) {
    return (
      <Layout title="金句未找到">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">金句未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，找不到您要查看的金句。</p>
          <Link
            to="/quotes"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            返回金句库
          </Link>
        </div>
      </Layout>
    );
  }

  // 复制内容到剪贴板
  const handleCopy = async () => {
    try {
      const textToCopy = quote.author
        ? `"${quote.content}"\n— ${quote.author}${quote.source ? `\n《${quote.source}》` : ''}`
        : `"${quote.content}"${quote.source ? `\n《${quote.source}》` : ''}`;

      await navigator.clipboard.writeText(textToCopy);
      alert('已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    }
  };

  // 分享链接
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: quote.title || '金句',
          text: quote.content,
          url: url
        });
      } catch (err) {
        console.error('分享失败:', err);
      }
    } else {
      // 降级方案：复制链接
      try {
        await navigator.clipboard.writeText(url);
        alert('链接已复制到剪贴板');
      } catch (err) {
        console.error('复制链接失败:', err);
      }
    }
  };

  return (
    <Layout
      title={quote.title || '金句'}
      description={quote.content.substring(0, 150)}
      structuredData={structuredData}
    >
      <article className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            to="/quotes"
            className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
          >
            ← 返回金句库
          </Link>
        </div>

        {/* 金句内容 */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          {quote.title && (
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{quote.title}</h1>
          )}

          <blockquote className="text-2xl md:text-3xl text-gray-900 leading-relaxed mb-6 italic">
            "{quote.content}"
          </blockquote>

          <div className="border-t pt-6">
            {quote.author && (
              <p className="text-lg text-gray-700 mb-2">
                — {quote.author}
              </p>
            )}
            {quote.source && (
              <p className="text-gray-600 mb-4">
                {quote.source_url ? (
                  <a
                    href={quote.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 underline"
                  >
                    《{quote.source}》
                  </a>
                ) : (
                  `《${quote.source}》`
                )}
              </p>
            )}
          </div>

          {/* 标签和分类 */}
          <div className="flex items-center gap-3 flex-wrap mt-6 pt-6 border-t">
            {quote.category && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {quote.category}
              </span>
            )}
            {quote.tags.map((tag) => (
              <Link
                key={tag}
                to={`/quotes?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* 元信息 */}
          <div className="mt-6 pt-6 border-t text-sm text-gray-500">
            <p>创建时间: {quote.created_at}</p>
            {quote.updated_at && quote.updated_at !== quote.created_at && (
              <p>更新时间: {quote.updated_at}</p>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/quotes/${quote.slug || quote.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            编辑
          </Link>
          <Link
            to={`/quotes/${quote.slug || quote.id}/poster`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            生成海报
          </Link>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            复制内容
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            分享
          </button>
        </div>
      </article>
    </Layout>
  );
};

