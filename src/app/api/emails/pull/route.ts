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
      'SELECT * FROM emails WHERE to_email = $1 ORDER BY id DESC LIMIT 1',
      [email],
    );

    return NextResponse.json({ data: result.rows[0] || null, code: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: '获取失败', code: 500 }, { status: 500 });
  }
}
