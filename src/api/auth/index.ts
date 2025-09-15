import {
  LoginData,
  LoginResult,
  RegisterData,
  RegisterResult,
} from '@/api/auth/types';
import request from '@/api/request';
import { HttpResponse } from '@/api/types';

/**
 * 登录
 * @param data
 */
export async function login(
  data: LoginData,
): Promise<HttpResponse<LoginResult>> {
  return await request.post('/auth/login', data);
}

/**
 * 注册
 * @param data
 */
export async function register(
  data: RegisterData,
): Promise<HttpResponse<RegisterResult>> {
  return await request.post('/auth/signup', data);
}
