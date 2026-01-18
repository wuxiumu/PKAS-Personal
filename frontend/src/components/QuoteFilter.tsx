interface QuoteFilterProps {
  allTags: string[];
  allCategories: string[];
  selectedTag?: string;
  selectedCategory?: string;
  onTagClick: (tag: string) => void;
  onCategoryClick: (category: string) => void;
}

export const QuoteFilter: React.FC<QuoteFilterProps> = ({
  allTags,
  allCategories,
  selectedTag,
  selectedCategory,
  onTagClick,
  onCategoryClick
}) => {
  return (
    <div className="mb-8 space-y-4">
      {/* 分类筛选 */}
      {allCategories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">分类</h3>
            {selectedCategory && (
              <button
                onClick={() => onCategoryClick('')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                清除
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryClick(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 标签筛选 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">标签</h3>
          {selectedTag && (
            <button
              onClick={() => onTagClick('')}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              清除
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
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
    </div>
  );
};

