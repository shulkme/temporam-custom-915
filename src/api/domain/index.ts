import { DomainParams, DomainRecord } from '@/api/domain/types';
import request from '@/api/request';
import { HttpResponse, PageResult } from '@/api/types';

/**
 * 获取域名列表
 * @param params
 */
export async function getDomainList(
  params?: DomainParams,
): Promise<HttpResponse<PageResult<DomainRecord>>> {
  return await request.get('/domains/list', {
    params,
  });
}

/**
 * 获取全部域名
 */
export async function getAllDomains(): Promise<HttpResponse<DomainRecord[]>> {
  return await request.get('/domains/all');
}
