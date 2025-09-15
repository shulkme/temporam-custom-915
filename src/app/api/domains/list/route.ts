import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  const params = await req.nextUrl.searchParams;
  const pageParam = params.get('current') || '1';
  const sizeParam = params.get('pageSize') || '10';
  const page = Math.max(parseInt(pageParam, 10), 1);
  const size = Math.min(parseInt(sizeParam, 10), 10);
  const offset = (page - 1) * size;
  try {
    const result = await pool.query(
      'SELECT * FROM domains WHERE user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
      [userPayload.userId, size, offset],
    );

    const count = await pool.query('SELECT COUNT(*) FROM domains');

    const total = parseInt(count.rows[0].count, 10);

    return NextResponse.json({
      code: 200,
      data: {
        items: result.rows,
        total,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: '获取域名信息失败', code: 500 },
      { status: 500 },
    );
  }
}
