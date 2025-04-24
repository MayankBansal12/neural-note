import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AuthError = {
  message: string
  status?: number
  name?: string
}

export type AuthResponse = {
  data: {
    user: {
      id: string
      email: string
      user_metadata: Record<string, unknown>
    }
    session: {
      access_token: string
      refresh_token: string
      expires_at: number
    }
  } | null
  error: AuthError | null
} 