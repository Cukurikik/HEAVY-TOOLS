import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase Client (Frontend)
 * Safe to be used in 'use client' components and React hooks.
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
