import { createClient } from '@supabase/supabase-js'

// Temporary hardcoded values
const supabaseUrl = 'https://fsakwzzcbnqkmchrvzzq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYWt3enpjYm5xa21jaHJ2enpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDUxOTQsImV4cCI6MjA5MjI4MTE5NH0.zxt49Ow0QExcMozFUWayhCrqczxy-HpSBzbon60dAhA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)