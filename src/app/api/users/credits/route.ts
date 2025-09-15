import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  try {
    const result = await pool.query('SELECT credits FROM users WHERE id=$1', [
      userPayload.userId,
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { msg: '登录信息过期，请重新登录', code: 401 },
        { status: 401 },
      );
    }

    return NextResponse.json({ code: 200, data: result.rows[0].credits });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: '获取积分信息失败', code: 500 },
      { status: 500 },
    );
  }
}
