import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PosterGenerator, type PosterStyle, ASPECT_RATIOS, type AspectRatio } from '../components/PosterGenerator';
import type { Quote } from '../types';
import quotesData from '../data/quotes.json';

const quotes = quotesData as Quote[];

export const QuotePoster: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [style, setStyle] = useState<PosterStyle>('minimal');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]); // 默认16:9

  const quote = useMemo(() => {
    if (!slug) return null;
    return quotes.find((q) => (q.slug === slug) || (q.id === slug)) || null;
  }, [slug]);

  if (!quote) {
    return (
      <Layout title="金句未找到">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">金句未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，找不到您要生成海报的金句。</p>
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

  const handleExport = (imageData: string) => {
    // 下载图片
    const link = document.createElement('a');
    link.download = `quote-${quote.id || 'poster'}-${style}.png`;
    link.href = imageData;
    link.click();
  };

  const styles: { value: PosterStyle; label: string; description: string }[] = [
    {
      value: 'tech',
      label: '赛博朋克',
      description: '霓虹灯、故障艺术、未来感'
    },
    {
      value: 'classic',
      label: '古风水墨',
      description: '传统风格、印章装饰、书法感'
    },
    {
      value: 'minimal',
      label: '精简风格',
      description: '极简设计、留白、现代感'
    }
  ];

  return (
    <Layout title={`生成海报 - ${quote.title || '金句'}`}>
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="mb-6">
          <Link
            to={`/quotes/${quote.slug || quote.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            ← 返回金句详情
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">生成海报</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 左侧：样式选择 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">选择风格</h2>

              <div className="space-y-3">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      style === s.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{s.label}</div>
                    <div className="text-sm text-gray-600">{s.description}</div>
                  </button>
                ))}
              </div>

              {/* 宽高比选择 */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">宽高比</h3>

                {/* PC端 */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">💻 PC端</div>
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.filter(ar => ar.category === 'pc').map((ar) => (
                      <button
                        key={ar.name}
                        onClick={() => setAspectRatio(ar)}
                        className={`px-3 py-1.5 rounded-full border transition-all text-xs whitespace-nowrap ${
                          aspectRatio.name === ar.name
                            ? 'border-blue-600 bg-blue-600 text-white font-medium'
                            : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {ar.name.replace(/\(.*?\)/g, '').trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 手机端 */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">📱 手机端</div>
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.filter(ar => ar.category === 'mobile').map((ar) => (
                      <button
                        key={ar.name}
                        onClick={() => setAspectRatio(ar)}
                        className={`px-3 py-1.5 rounded-full border transition-all text-xs whitespace-nowrap ${
                          aspectRatio.name === ar.name
                            ? 'border-blue-600 bg-blue-600 text-white font-medium'
                            : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {ar.name.replace(/\(.*?\)/g, '').trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 正方形 */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">⬜ 正方形</div>
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.filter(ar => ar.category === 'square').map((ar) => (
                      <button
                        key={ar.name}
                        onClick={() => setAspectRatio(ar)}
                        className={`px-3 py-1.5 rounded-full border transition-all text-xs whitespace-nowrap ${
                          aspectRatio.name === ar.name
                            ? 'border-blue-600 bg-blue-600 text-white font-medium'
                            : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {ar.name.replace(/\(.*?\)/g, '').trim()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 金句信息 */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">金句信息</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {quote.title && <div>标题：{quote.title}</div>}
                  <div className="line-clamp-2">内容：{quote.content}</div>
                  {quote.author && <div>作者：{quote.author}</div>}
                  {quote.source && <div>来源：{quote.source}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：海报预览 */}
          <div className="lg:col-span-3 flex flex-col" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <PosterGenerator
              quote={quote}
              style={style}
              aspectRatio={aspectRatio}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

