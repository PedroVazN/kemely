import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qnzguamukkoiqieqeskm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuemd1YW11a2tvaXFpZXFlc2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTg5MzAsImV4cCI6MjA3NTA5NDkzMH0.XIZBT3b7g4FpVjHz929NJ0Y9XhSiboMwLpxunXOsnuM'

export const supabase = createClient(supabaseUrl, supabaseKey)
