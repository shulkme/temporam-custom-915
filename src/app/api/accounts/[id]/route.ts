import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } },
) {
  const { id } = ctx.params;
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  try {
    // 参数校验
    if (!id) {
      return NextResponse.json({ msg: '数据异常', code: 400 }, { status: 400 });
    }

    await pool.query('DELETE FROM accounts WHERE id = $1 AND user_id = $2', [
      id,
      userPayload.userId,
    ]);

    return NextResponse.json({ msg: '删除成功', code: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: '删除失败', code: 500 }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  try {
    const { remark } = await req.json();

    await pool.query('UPDATE accounts SET remark = $1 WHERE id = $2', [
      remark,
      id,
    ]);

    return NextResponse.json({ msg: '修改成功', code: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: '修改失败', code: 500 }, { status: 500 });
  }
}
