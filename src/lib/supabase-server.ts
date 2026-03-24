import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Supabase Server Client (Admin Role)
 * strictly for Server Actions and Route Handlers to bypass RLS and broadcast to channels.
 * NEVER IMPORT THIS IN 'use client' FILES.
 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})
