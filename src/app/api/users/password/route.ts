import { requireAuth } from '@/lib/auth';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  // 鉴权
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload;

  try {
    const { old_password, new_password } = await req.json();

    // 参数校验
    if (!old_password || !new_password) {
      return NextResponse.json(
        { msg: '密码不能为空', code: 400 },
        { status: 400 },
      );
    }

    // 查询用户当前密码
    const result = await pool.query('SELECT password FROM users WHERE id=$1', [
      userPayload.userId,
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { msg: '用户不存在', code: 400 },
        { status: 400 },
      );
    }

    const currentPasswordHash = result.rows[0].password;

    // 校验旧密码
    const isMatch = await bcrypt.compare(old_password, currentPasswordHash);
    if (!isMatch) {
      return NextResponse.json(
        { msg: '旧密码不正确', code: 400 },
        { status: 400 },
      );
    }

    // 更新新密码
    const newHashedPassword = await bcrypt.hash(new_password, 10);

    await pool.query(
      'UPDATE users SET password=$1, updated_time=NOW() WHERE id=$2',
      [newHashedPassword, userPayload.userId],
    );

    return NextResponse.json({ msg: '密码修改成功', code: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: '修改密码失败', code: 500 },
      { status: 500 },
    );
  }
}
