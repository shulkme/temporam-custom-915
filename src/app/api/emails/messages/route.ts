import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const params = await req.nextUrl.searchParams;
  const email = params.get('email');
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  if (!email) {
    return NextResponse.json({ msg: '数据异常', code: 400 }, { status: 400 });
  }
  try {
    // 限制10分钟内的邮件
    const time_limit = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const result = await pool.query(
      'SELECT uuid, from_name, from_email, to_name, to_email, subject, summary, created_at  FROM emails WHERE to_email = $1 AND created_at >= $2 ORDER BY created_at DESC LIMIT 100',
      [email, time_limit],
    );

    return NextResponse.json({
      code: 200,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: '获取失败', code: 500 }, { status: 500 });
  }
}
