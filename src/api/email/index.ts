import { EmailRecord } from '@/api/email/types';
import request from '@/api/request';
import { HttpResponse } from '@/api/types';

/**
 * 获取邮件列表
 * @param email
 */
export async function getEmailList(
  email: string,
): Promise<HttpResponse<EmailRecord[]>> {
  return await request.get('/emails/messages', {
    params: {
      email,
    },
  });
}

/**
 * 获取邮件详情
 * @param pk
 */
export async function getEmailDetail(
  pk: string,
): Promise<HttpResponse<EmailRecord>> {
  return await request.get(`/emails/${pk}`);
}

/**
 *拉取邮件
 * @param email
 */
export async function pullEmailDetail(
  email: string,
): Promise<HttpResponse<EmailRecord>> {
  return await request.get('/emails/pull', {
    params: {
      email,
    },
  });
}
