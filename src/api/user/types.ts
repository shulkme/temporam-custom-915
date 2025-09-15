export interface UserRecord {
  id: string;
  username: string;
  created_time: string;
  updated_time: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
