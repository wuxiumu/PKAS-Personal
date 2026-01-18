// 文章数据类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  created_at: string;
  content: string;
}

// SEO 配置类型
export interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

// GEO 数据类型（后续扩展）
export interface GeoData {
  country?: string;
  region?: string;
  city?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// 金句数据类型
export interface Quote {
  id: string;
  title?: string;
  content: string;
  author?: string;
  source?: string;
  source_url?: string;
  tags: string[];
  category?: string;
  created_at: string;
  updated_at: string;
  status: 'published' | 'draft';
  poster_template?: string;
  slug?: string;
}

// 海报配置类型
export interface PosterConfig {
  template: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  backgroundImage?: string;
  authorStyle: 'bottom' | 'right' | 'hidden';
  sourceStyle: 'bottom' | 'right' | 'hidden';
  watermark?: string;
}

