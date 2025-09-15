import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  try {
    const { email, remark } = await req.json();

    // 参数校验
    if (!email) {
      return NextResponse.json({ msg: '数据异常', code: 400 }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO accounts (email, user_id, remark) VALUES ($1, $2, $3)',
      [email, userPayload.userId, remark],
    );

    return NextResponse.json({ msg: '创建成功', code: 200 });
  } catch (err) {
    if ((err as unknown as { code: string }).code === '23505') {
      // 唯一约束冲突
      return NextResponse.json(
        { msg: '该邮箱已存在', code: 400 },
        { status: 400 },
      );
    }
    return NextResponse.json({ msg: '保存失败', code: 500 }, { status: 500 });
  }
}
