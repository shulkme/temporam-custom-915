import request from '@/api/request';
import { HttpResponse } from '@/api/types';
import { ChangePasswordData, UserRecord } from '@/api/user/types';

/**
 * 获取用户信息
 */
export async function getUserProfile(): Promise<HttpResponse<UserRecord>> {
  return await request.get('/users/profile');
}

/**
 * 获取用户积分
 */
export async function getUserCredits(): Promise<HttpResponse<number>> {
  return await request.get('/users/credits');
}

/**
 * 修改密码
 * @param data
 */
export async function changeUserPassword(data: ChangePasswordData) {
  return await request.put('/users/password', data);
}
