export interface EmailRecord {
  uuid: string;
  subject: string;
  summary: string;
  content: string;
  from_name: string;
  from_email: string;
  to_name: string;
  to_email: string;
  created_at: string;
}
