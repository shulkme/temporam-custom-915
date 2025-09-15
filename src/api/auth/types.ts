import { UserRecord } from '@/api/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: UserRecord;
}

export interface RegisterResult {
  token: string;
  user: UserRecord;
}
