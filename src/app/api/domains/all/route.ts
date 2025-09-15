import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM domains');

    return NextResponse.json({ code: 200, data: result.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: '获取域名信息失败', code: 500 },
      { status: 500 },
    );
  }
}
