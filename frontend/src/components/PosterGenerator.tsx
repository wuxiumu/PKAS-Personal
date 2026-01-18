import { useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import type { Quote } from '../types';

export type PosterStyle = 'tech' | 'classic' | 'minimal';

export interface AspectRatio {
  name: string;
  ratio: number; // width / height
  width: number;
  height: number;
  category: 'pc' | 'mobile' | 'square';
}

// 预定义的宽高比
export const ASPECT_RATIOS: AspectRatio[] = [
  // PC端
  { name: '16:9 (宽屏)', ratio: 16/9, width: 1920, height: 1080, category: 'pc' },
  { name: '16:10 (宽屏)', ratio: 16/10, width: 1920, height: 1200, category: 'pc' },
  { name: '4:3 (传统)', ratio: 4/3, width: 1600, height: 1200, category: 'pc' },
  { name: '21:9 (超宽屏)', ratio: 21/9, width: 2560, height: 1080, category: 'pc' },
  // 手机端
  { name: '9:16 (竖屏)', ratio: 9/16, width: 1080, height: 1920, category: 'mobile' },
  { name: '16:9 (横屏)', ratio: 16/9, width: 1920, height: 1080, category: 'mobile' },
  { name: '1:1 (正方形)', ratio: 1, width: 1080, height: 1080, category: 'square' },
  // 海报常用
  { name: '2:3 (竖版海报)', ratio: 2/3, width: 800, height: 1200, category: 'mobile' },
  { name: '3:2 (横版海报)', ratio: 3/2, width: 1200, height: 800, category: 'pc' },
];

interface PosterGeneratorProps {
  quote: Quote;
  style: PosterStyle;
  aspectRatio?: AspectRatio;
  onExport?: (imageData: string) => void;
}

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({
  quote,
  style,
  aspectRatio = ASPECT_RATIOS[0], // 默认16:9
  onExport
}) => {
  const posterRef = useRef<HTMLDivElement>(null);

  // 根据宽高比确定尺寸（用于导出，保持高清）
  // 预览时会通过 CSS 自动缩放
  const posterSize = useMemo(() => ({
    width: aspectRatio.width,
    height: aspectRatio.height
  }), [aspectRatio.width, aspectRatio.height]);

  // 判断是横版还是竖版（用于布局）
  const isLandscape = useMemo(() => aspectRatio.ratio > 1, [aspectRatio.ratio]);

  // 导出为图片
  const handleExport = async () => {
    if (!posterRef.current) return;

    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: null,
        scale: 2, // 提高清晰度
        useCORS: true,
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      if (onExport) {
        onExport(dataUrl);
      } else {
        // 默认下载
        const link = document.createElement('a');
        link.download = `quote-${quote.id || 'poster'}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  // 渲染不同风格的海报
  const renderPoster = () => {
    const content = quote.content || '';
    const author = quote.author || '';
    const source = quote.source || '';

    switch (style) {
      case 'tech':
        return (
          <div className="w-full h-full relative overflow-hidden bg-black">
            {/* 赛博朋克背景 - 深色渐变 */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-pink-900">
              {/* 霓虹网格线 */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `
                  linear-gradient(cyan 1px, transparent 1px),
                  linear-gradient(90deg, cyan 1px, transparent 1px),
                  linear-gradient(magenta 1px, transparent 1px),
                  linear-gradient(90deg, magenta 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px, 40px 40px, 80px 80px, 80px 80px',
                backgroundPosition: '0 0, 0 0, 20px 20px, 20px 20px'
              }}></div>

              {/* 霓虹光效 */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full opacity-30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-0 w-64 h-64 bg-magenta-500 rounded-full opacity-20 blur-3xl"></div>

              {/* 故障艺术效果 */}
              <div className="absolute inset-0 opacity-5" style={{
                background: `
                  repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px),
                  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,0,255,0.1) 2px, rgba(255,0,255,0.1) 4px)
                `
              }}></div>
            </div>

            {/* 内容 */}
            <div className={`relative z-10 h-full flex ${isLandscape ? 'flex-row items-center' : 'flex-col justify-center items-center'} p-12 text-center`}>
              <div className={isLandscape ? 'flex-1' : 'w-full'}>
                <div className="mb-6">
                  <div className="inline-block px-4 py-2 bg-cyan-500/20 backdrop-blur-sm rounded border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)] mb-6">
                    <span className="text-cyan-300 text-sm font-mono font-bold tracking-wider">[QUOTE]</span>
                  </div>
                </div>

                <blockquote className={`${isLandscape ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold leading-relaxed mb-8 max-w-4xl mx-auto`} style={{
                  textShadow: `
                    0 0 10px rgba(0,255,255,0.8),
                    0 0 20px rgba(0,255,255,0.5),
                    0 0 30px rgba(255,0,255,0.3),
                    2px 2px 0px rgba(0,0,0,0.8)
                  `,
                  color: '#00ffff'
                }}>
                  "{content}"
                </blockquote>

                {(author || source) && (
                  <div className={`mt-8 ${isLandscape ? 'text-lg' : 'text-xl'}`} style={{
                    color: '#ff00ff',
                    textShadow: '0 0 10px rgba(255,0,255,0.8), 0 0 20px rgba(255,0,255,0.5)'
                  }}>
                    {author && <span className="font-medium">— {author}</span>}
                    {author && source && <span className="mx-2">·</span>}
                    {source && <span>《{source}》</span>}
                  </div>
                )}
              </div>

              {/* 赛博朋克装饰元素 */}
              <div className="absolute bottom-8 right-8 text-cyan-400/30 text-6xl font-mono font-bold" style={{
                textShadow: '0 0 20px rgba(0,255,255,0.5)',
                fontFamily: 'monospace'
              }}>
                {quote.id?.substring(6, 14) || '2026'}
              </div>

              {/* 霓虹边框 */}
              <div className="absolute inset-0 border-4 border-cyan-400/50" style={{
                boxShadow: `
                  inset 0 0 20px rgba(0,255,255,0.3),
                  0 0 40px rgba(0,255,255,0.2)
                `
              }}></div>

              {/* 角落装饰 */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-pink-400"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-magenta-400"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>
            </div>
          </div>
        );

      case 'classic':
        return (
          <div className={`w-full h-full relative overflow-hidden bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50`}>
            {/* 古风水墨背景 - 使用CSS创建纹理 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(0,0,0,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 0%, transparent 70%)
                `
              }}></div>
            </div>

            {/* 印章效果 */}
            <div className={`absolute ${isLandscape ? 'top-12 right-12' : 'top-16 right-16'} w-20 h-20 border-4 border-red-600 rounded-full opacity-25 flex items-center justify-center`}>
              <div className="w-12 h-12 border-2 border-red-600 rounded-full"></div>
            </div>
            <div className={`absolute ${isLandscape ? 'bottom-12 left-12' : 'bottom-16 left-16'} w-14 h-14 border-3 border-red-600 rounded-full opacity-20`}></div>

            {/* 边框装饰 */}
            <div className="absolute inset-8 border-2 border-stone-300 opacity-30"></div>
            <div className="absolute inset-12 border border-stone-200 opacity-20"></div>

            {/* 内容 */}
            <div className={`relative z-10 h-full flex ${isLandscape ? 'flex-row items-center' : 'flex-col justify-center items-center'} p-20 text-center`}>
              <div className={isLandscape ? 'flex-1' : 'w-full'}>
                {quote.title && (
                  <h2 className={`${isLandscape ? 'text-2xl' : 'text-3xl md:text-4xl'} font-serif text-stone-800 mb-10 tracking-wider`}>
                    {quote.title}
                  </h2>
                )}

                <div className="relative mb-12">
                  {/* 引号装饰 */}
                  <div className={`absolute ${isLandscape ? '-top-8 -left-8' : '-top-12 -left-12'} ${isLandscape ? 'text-5xl' : 'text-7xl'} text-stone-200 font-serif leading-none`}>"</div>
                  <blockquote className={`${isLandscape ? 'text-2xl' : 'text-3xl md:text-4xl'} font-serif text-stone-900 leading-relaxed max-w-3xl italic px-8`}>
                    {content}
                  </blockquote>
                  <div className={`absolute ${isLandscape ? '-bottom-8 -right-8' : '-bottom-12 -right-12'} ${isLandscape ? 'text-5xl' : 'text-7xl'} text-stone-200 font-serif leading-none`}>"</div>
                </div>

                {(author || source) && (
                  <div className={`mt-10 ${isLandscape ? 'text-lg' : 'text-xl'} text-stone-700 font-serif`}>
                    {author && <span className="font-bold text-stone-800">— {author}</span>}
                    {author && source && <span className="mx-3 text-stone-400">·</span>}
                    {source && <span className="text-stone-600">《{source}》</span>}
                  </div>
                )}
              </div>

              {/* 落款 */}
              <div className={`absolute ${isLandscape ? 'bottom-12 right-12' : 'bottom-20 right-20'} text-stone-400 text-sm font-serif`}>
                {quote.created_at?.split(' ')[0] || ''}
              </div>
            </div>
          </div>
        );

      case 'minimal':
      default:
        return (
          <div className={`w-full h-full bg-white flex ${isLandscape ? 'flex-row items-center' : 'flex-col justify-center items-center'} p-12`}>
            <div className={`${isLandscape ? 'flex-1' : 'max-w-2xl'} text-center`}>
              <blockquote className={`${isLandscape ? 'text-2xl' : 'text-3xl md:text-4xl'} font-light text-gray-900 leading-relaxed mb-8`}>
                "{content}"
              </blockquote>

              {(author || source) && (
                <div className={`mt-8 pt-8 border-t border-gray-200 text-gray-600 ${isLandscape ? 'text-base' : 'text-lg'}`}>
                  {author && <span>— {author}</span>}
                  {author && source && <span className="mx-2">·</span>}
                  {source && <span>《{source}》</span>}
                </div>
              )}

              {/* 简洁装饰线 */}
              <div className="mt-12 flex items-center justify-center gap-4">
                <div className="w-12 h-px bg-gray-300"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-12 h-px bg-gray-300"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 海报预览 - 只显示海报核心部分，100%展示且不超出屏幕 */}
      <div
        className="flex-1 bg-gray-100 rounded-lg p-4 flex items-center justify-center"
        style={{
          minHeight: '400px',
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          ref={posterRef}
          className="bg-white shadow-2xl"
          style={{
            width: `${posterSize.width}px`,
            height: `${posterSize.height}px`,
            // 预览时自适应容器，保持宽高比
            maxWidth: '100%',
            maxHeight: '100%',
            // 使用 aspect-ratio 确保比例正确
            aspectRatio: `${aspectRatio.width}/${aspectRatio.height}`,
            // 确保内容不溢出
            boxSizing: 'border-box',
            // 居中显示
            margin: 'auto'
          }}
        >
          {renderPoster()}
        </div>
      </div>

      {/* 导出按钮 */}
      <div className="mt-4 flex justify-center gap-4 flex-shrink-0">
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          📥 导出为 PNG
        </button>
      </div>
    </div>
  );
};

