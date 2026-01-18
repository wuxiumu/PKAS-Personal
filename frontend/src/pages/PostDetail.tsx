import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import type { Post } from '../types';
import postsData from '../data/posts.json';

const posts = postsData as Post[];

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  // 结构化数据
  const structuredData = useMemo(() => {
    if (!post) return undefined;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const postUrl = `${baseUrl}/posts/${post.slug}`;

    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      datePublished: post.created_at,
      dateModified: post.created_at,
      author: {
        '@type': 'Person',
        name: 'PKAS'
      },
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
        '@id': postUrl
      },
      keywords: post.tags.join(', '),
      articleSection: post.tags[0] || 'General',
      url: postUrl
    };
  }, [post]);

  if (!post) {
    return (
      <Layout title="文章未找到">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，找不到您要查看的文章。</p>
          <Link
            to="/posts"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            返回文章列表
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={post.title}
      description={post.summary}
      structuredData={structuredData}
    >
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link
            to="/posts"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            ← 返回文章列表
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-500">{post.created_at}</span>
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/posts?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          {post.summary && (
            <p className="text-xl text-gray-600 italic">{post.summary}</p>
          )}
        </header>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-8 border-t">
          <div className="flex justify-between items-center">
            <Link
              to="/posts"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← 返回文章列表
            </Link>
            <div className="text-sm text-gray-500">
              文章 ID: {post.id}
            </div>
          </div>
        </footer>
      </article>
    </Layout>
  );
};

