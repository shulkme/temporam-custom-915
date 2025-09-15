import { PageParams } from '@/api/types';

export interface DomainRecord {
  id: string;
  domain: string;
  type: number;
  created_at: string;
  user_id?: number;
}

export interface DomainParams extends PageParams {
  domain?: string;
}
