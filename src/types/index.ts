// Extend Express Request interface to include custom properties
declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: User | undefined; // Will be defined when authentication is implemented
    }
  }
}

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  requestId?: string;
}

// Database model base interface
export interface BaseModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error types
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export {};
