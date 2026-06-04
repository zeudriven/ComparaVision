const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xoodnuckjmlmejeyyneg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvb2RudWNram1sbWVqZXl5bmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTQwNTQsImV4cCI6MjA2ODQ5MDA1NH0.tu12RS2PsuKvewIEaCXI2eMyLMOYuZi8gSBe6nIPN2s'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing connection to:', supabaseUrl)
    const { data, error } = await supabase.from('users').select('count')
    
    if (error) throw error
    console.log('✅ Connection successful!')
    console.log('Data:', data)
    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
}

testConnection()
  .then(result => {
    if (!result) process.exit(1)
  })
  .catch(console.error)
