import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://npvydmvhtefmkmotxyej.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdnlkbXZodGVmbWttb3R4eWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA5ODU2NDEsImV4cCI6MTk4NjU2MTY0MX0.kOghX3Pl-AWAgEJpXcYOW4P00J8mwi_uzM3Ww6AIxnE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})