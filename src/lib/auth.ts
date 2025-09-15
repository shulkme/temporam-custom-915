import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export interface UserPayload extends JwtPayload {
  userId: number;
  username: string;
}

export interface EmailPayload extends JwtPayload {
  email: string;
}

export function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload as UserPayload;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function requireAuth(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json(
      { msg: 'Unauthorized', code: 401 },
      { status: 401 },
    );
  }
  return user;
}

export function verifyCode(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const code = params.get('code');
  if (!code) return null;
  try {
    const payload = jwt.verify(code, process.env.JWT_SECRET!);

    return payload as EmailPayload;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function requireEmail(req: NextRequest) {
  const email = verifyCode(req);
  if (!email) {
    return NextResponse.json(
      { msg: '无效链接或链接已过期', code: 400 },
      { status: 400 },
    );
  }
  return email;
}
