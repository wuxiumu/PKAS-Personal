import { Link, useLocation } from 'react-router-dom';
import { SEO } from './SEO';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  structuredData?: object;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  description,
  structuredData
}) => {
  const location = useLocation();

  return (
    <SEO title={title || 'PKAS Blog'} description={description} structuredData={structuredData}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                PKAS Blog
              </Link>
              <nav className="flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  首页
                </Link>
                <Link
                  to="/posts"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/posts' || location.pathname.startsWith('/posts/')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  文章
                </Link>
                <Link
                  to="/quotes"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/quotes' || location.pathname.startsWith('/quotes/')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  金句
                </Link>
                <Link
                  to="/geo"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/geo'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  GEO
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">
              © 2026 PKAS - Personal Knowledge & Asset System
            </p>
          </div>
        </footer>
      </div>
    </SEO>
  );
};

