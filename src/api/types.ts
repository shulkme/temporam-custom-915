export interface HttpResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface PageResult<T> {
  items: T[];
  total: number;
}

export interface PageParams {
  pageSize: number;
  current: number;
  [key: string]: unknown;
}
