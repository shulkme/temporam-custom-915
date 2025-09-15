import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const params = await req.nextUrl.searchParams;
  const email = params.get('email');
  if (!email) {
    return NextResponse.json({ msg: '数据异常', code: 400 }, { status: 400 });
  }
  try {
    const result = await pool.query(
      "SELECT uuid, from_name, from_email, to_name, to_email, subject, summary, created_at  FROM emails WHERE to_email = $1 AND created_at >= NOW() - interval '10 minutes' ORDER BY created_at DESC LIMIT 100",
      [email],
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
