import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  try {
    // 参数校验
    if (!id) {
      return NextResponse.json({ msg: '数据异常', code: 400 }, { status: 400 });
    }

    const result = await pool.query('SELECT * FROM emails WHERE uuid = $1', [
      id,
    ]);

    return NextResponse.json({ data: result.rows[0], code: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: '获取失败', code: 500 }, { status: 500 });
  }
}
