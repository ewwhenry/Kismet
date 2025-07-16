export enum ErrorCodes {
  ENDPOINT_NOT_FOUND = 'ENDPOINT_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

type ErrorData = {
  message: string;
  code: ErrorCodes;
  details?: unknown;
};

type SuccessResponse<T = unknown> = {
  status: number;
  message: string;
  data: T;
};

type PaginationMeta = {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

type PaginatedResponse<T> = {
  status: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
};

type CursorPaginatedResponse<T> = {
  status: number;
  message: string;
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

const ErrorStatusMap: Record<ErrorCodes, number> = {
  [ErrorCodes.ENDPOINT_NOT_FOUND]: 404,
  [ErrorCodes.UNAUTHORIZED]: 401,
  [ErrorCodes.VALIDATION_ERROR]: 400,
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 500,
};

export const createError = (data: ErrorData) => {
  const status = ErrorStatusMap[data.code] ?? 500; // Fallback por seguridad
  return {
    status,
    message: data.message,
    code: data.code,
    details: data.details,
  };
};

export const createSuccessResponse = <T>(
  data: T,
  message = 'Request successful',
  status = 200,
): SuccessResponse<T> => ({
  status,
  message,
  data,
});

export const createPaginatedResponse = <T>(
  items: T[],
  totalItems: number,
  currentPage: number,
  pageSize: number,
  message = 'Data retrieved successfully',
  status = 200,
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    status,
    message,
    data: items,
    meta: {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
    },
  };
};

export function createCursorPaginatedResponse<T>(
  items: T[],
  limit: number,
): CursorPaginatedResponse<T> {
  const hasNextPage = items.length > limit;
  const results = hasNextPage ? items.slice(0, limit) : items;

  return {
    status: 200,
    message: 'Data retrieved successfully',
    data: results,
    nextCursor: hasNextPage ? (results[results.length - 1] as any).id : null,
    hasNextPage,
  };
}
