// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// جلب المفاتيح من ملف البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// إنشاء وتصدير قناة الاتصال
export const supabase = createClient(supabaseUrl, supabaseAnonKey);