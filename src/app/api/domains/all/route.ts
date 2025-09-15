import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  try {
    const result = await pool.query(
      'SELECT * FROM domains WHERE user_id IS NULL OR user_id = $1',
      [userPayload.userId],
    );

    return NextResponse.json({ code: 200, data: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: '获取域名信息失败', code: 500 },
      { status: 500 },
    );
  }
}
