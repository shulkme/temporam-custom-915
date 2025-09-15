import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          code: 400,
          msg: '用户名或密码错误',
        },
        {
          status: 400,
        },
      );
    }

    const exist_user = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username],
    );

    if (exist_user.rowCount && exist_user.rowCount > 0) {
      return NextResponse.json(
        {
          code: 409,
          msg: '用户名已存在',
        },
        {
          status: 409,
        },
      );
    }

    const hash_password = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hash_password],
    );

    const user = result.rows[0];

    const token = jwt.sign(
      {
        userId: user.id,
        username: username,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' },
    );

    return NextResponse.json({
      code: 200,
      data: {
        token,
      },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        code: 500,
        msg: '系统异常',
      },
      {
        status: 500,
      },
    );
  }
}
