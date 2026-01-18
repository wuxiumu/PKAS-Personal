import { Link } from 'react-router-dom';
import React from 'react';
import type { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  viewMode: 'grid' | 'list';
  onEdit?: (id: string) => void;
  onGeneratePoster?: (id: string) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  viewMode,
  onEdit,
  onGeneratePoster
}) => {
  const quoteUrl = `/quotes/${quote.slug || quote.id}`;

  if (viewMode === 'list') {
    return (
      <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to={quoteUrl} className="block">
              <p className="text-lg text-gray-900 mb-3 leading-relaxed">
                "{quote.content}"
              </p>
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              {quote.author && (
                <span>— {quote.author}</span>
              )}
              {quote.source && (
                <span>《{quote.source}》</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {quote.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/quotes?tag=${encodeURIComponent(tag)}`}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
              {quote.category && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {quote.category}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <span className="text-xs text-gray-500">{quote.created_at.split(' ')[0]}</span>
            {onEdit && (
              <Link
                to={`/quotes/${quote.slug || quote.id}/edit`}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors inline-block"
              >
                编辑
              </Link>
            )}
            {onGeneratePoster && (
              <button
                onClick={() => onGeneratePoster(quote.id)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                海报
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Grid view
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
      <Link to={quoteUrl} className="flex-1 block">
        <p className="text-lg text-gray-900 mb-4 leading-relaxed line-clamp-4">
          "{quote.content}"
        </p>
      </Link>
      <div className="mt-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          {quote.author && (
            <span>— {quote.author}</span>
          )}
          {quote.source && (
            <span className="text-gray-500">《{quote.source}》</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {quote.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                to={`/quotes?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
            {quote.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{quote.tags.length - 3}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{quote.created_at.split(' ')[0]}</span>
        </div>
        {(onEdit || onGeneratePoster) && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <Link
                to={`/quotes/${quote.slug || quote.id}/edit`}
                className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-center inline-block"
              >
                编辑
              </Link>
            )}
            {onGeneratePoster && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onGeneratePoster(quote.id);
                }}
                className="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                海报
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

