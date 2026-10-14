export interface StrapiImageFormat {
  url: string;
  width?: number;
  height?: number;
}

export interface StrapiMedia {
  id?: number;
  documentId?: string;
  url?: string;
  alternativeText?: string;
  caption?: string;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  attributes?: {
    url: string;
    alternativeText?: string;
    caption?: string;
    formats?: {
      thumbnail?: StrapiImageFormat;
      small?: StrapiImageFormat;
      medium?: StrapiImageFormat;
      large?: StrapiImageFormat;
    };
  };
}

export interface NewsArticle {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  isFeatured?: boolean;
  coverImage?: StrapiMedia | { data?: StrapiMedia };
  externalLinks?: string[];
  externalUrls?: string[];
  attributes?: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    category?: string;
    publishedAt: string;
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    isFeatured?: boolean;
    coverImage?: { data?: StrapiMedia } | StrapiMedia;
    externalLinks?: string[];
    externalUrls?: string[];
  };
}

export interface StrapiMetaPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta?: {
    pagination?: StrapiMetaPagination;
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta?: unknown;
}

export type NewsCategoryType = 'all' | 'announcements' | 'press' | 'events' | 'general';
