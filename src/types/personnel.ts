export type Personnel = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  role: string;
  is_active: boolean;
};