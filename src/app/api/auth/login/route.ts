import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { msg: '用户名和密码错误', code: 400 },
        { status: 400 },
      );
    }

    const result = await pool.query('SELECT * FROM users WHERE username=$1', [
      username,
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { msg: '用户不存在', code: 400 },
        { status: 400 },
      );
    }

    const { password: pw, ...user } = result.rows[0];
    const valid = await bcrypt.compare(password, pw);

    if (!valid) {
      return NextResponse.json({ msg: '密码错误', code: 400 }, { status: 400 });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' },
    );

    return NextResponse.json({ data: { token, user }, code: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: '登录失败', code: 500 }, { status: 500 });
  }
}
