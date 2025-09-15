import { PageParams } from '@/api/types';

export interface AccountRecord {
  id: number;
  email: string;
  created_time: string;
  remark: string;
  user_id: number;
  code: string;
}

export interface AccountParams extends PageParams {
  email?: string;
}

export interface AccountData {
  email: string;
  remark?: string;
  user_id: number;
}
