import { PageParams } from '@/api/types';

export interface DomainRecord {
  id: string;
  domain: string;
  type: number;
  created_at: string;
}

export interface DomainParams extends PageParams {
  domain?: string;
}
