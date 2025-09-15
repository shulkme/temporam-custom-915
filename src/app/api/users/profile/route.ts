import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  try {
    // 查询用户信息，不返回密码
    const result = await pool.query(
      'SELECT id, username, created_time, updated_time FROM users WHERE id=$1 AND status = 1',
      [userPayload.userId],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { msg: '用户不存在', code: 400 },
        { status: 400 },
      );
    }

    const user = result.rows[0];
    return NextResponse.json({ code: 200, data: { ...user } });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: '获取用户信息失败', code: 500 },
      { status: 500 },
    );
  }
}
