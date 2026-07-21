export interface TimelineEntry {
  _id: string;
  year: number;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  category?: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface HistoryRequest {
  page: number;
  limit: number;
  locale: string;
}

export interface HistoryResponse {
  data: TimelineEntry[];
  total: number;
  hasMore: boolean;
}
