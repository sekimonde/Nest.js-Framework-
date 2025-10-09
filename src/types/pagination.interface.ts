export interface PaginationResult<T> {
    page: number;
    limit: number;
    total: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    dataLength: number;
    data: T[]; // <- T represents the type of the items
  }
  