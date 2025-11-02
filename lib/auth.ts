// lib/auth.ts
import { supabase } from './supabase'

const ADMIN_EMAIL = 'etitaneva@gmail.com'

export async function isAdmin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Supabase getUser error:', error)
      return false
    }

    return data.user?.email === ADMIN_EMAIL
  } catch (err) {
    console.error(err)
    return false
  }
}
