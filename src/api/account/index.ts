import { AccountData, AccountParams, AccountRecord } from '@/api/account/types';
import request from '@/api/request';
import { HttpResponse, PageResult } from '@/api/types';

export async function getAccountList(
  params?: AccountParams,
): Promise<HttpResponse<PageResult<AccountRecord>>> {
  return await request.get('/accounts/list', {
    params,
  });
}

export async function addAccount(data: AccountData) {
  return await request.post('/accounts', data);
}

export async function delAccount(id: number) {
  return await request.delete(`/accounts/${id}`);
}
