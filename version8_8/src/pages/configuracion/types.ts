
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  bank_account: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean | null;
}

export interface TabProps {
  userProfile: UserProfile | null;
  user: User | null;
}
