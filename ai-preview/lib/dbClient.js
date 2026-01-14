// lib/dbClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function dbClient(table) {
  const client = createClient(supabaseUrl, supabaseAnonKey);
  return client.from(table);
}