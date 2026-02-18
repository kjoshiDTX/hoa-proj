import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://vizodtahstidnranjnhx.supabase.co';
const supabaseAnonKey = 'sb_publishable_m0_nQjXmZVlPlIih19gt5w_H4DrmX6Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
