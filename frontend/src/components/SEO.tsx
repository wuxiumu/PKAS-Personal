import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import type { SEOConfig } from '../types';

interface SEOProps extends SEOConfig {
  children?: React.ReactNode;
  structuredData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  structuredData,
  children
}) => {
  const location = useLocation();
  const fullTitle = title ? `${title} | PKAS Blog` : 'PKAS Blog';
  const defaultDescription = '个人知识与资产管理系统 - 一个可控、低成本、AI 友好的知识管理平台';
  const defaultKeywords = 'PKAS, Blog, 知识管理, AI, Markdown';

  // 构建完整 URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = url || `${baseUrl}${location.pathname}${location.search}`;

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="keywords" content={keywords || defaultKeywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description || defaultDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="PKAS Blog" />
        {image && <meta property="og:image" content={image} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description || defaultDescription} />
        {image && <meta name="twitter:image" content={image} />}

        {/* 结构化数据 */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>
      {children}
    </>
  );
};

