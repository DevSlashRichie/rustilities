export interface PaginationParameters {
  cursor?: string;
  limit: number;
}

export interface CursorMetadata {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  nextCursor?: string;
}
