import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import type { Post } from '../types';
import postsData from '../data/posts.json';

const posts = postsData as Post[];

export const Home: React.FC = () => {
  // 获取最新 3 篇文章
  const latestPosts = posts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <Layout title="首页" description="PKAS Blog - 个人知识与资产管理系统">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PKAS Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            一个个人可控、低成本、AI 友好的知识与资产管理系统
          </p>
        </div>

        {/* Latest Posts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">最新文章</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-500">{post.created_at}</span>
                    <div className="ml-auto flex gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link
                      to={`/posts/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
                  <Link
                    to={`/posts/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    阅读更多 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <Link
            to="/posts"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            查看所有文章
          </Link>
        </div>
      </div>
    </Layout>
  );
};

