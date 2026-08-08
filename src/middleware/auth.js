import { supabase } from '@/lib/supabase'

export const requireAuth = async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    return { name: 'admin-login' }
  }
  return true
}
