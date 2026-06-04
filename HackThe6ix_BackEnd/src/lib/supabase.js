import { createClient } from '@supabase/supabase-js'

// Production Supabase project URL and anon key
const supabaseUrl = 'https://xoodnuckjmlmejeyyneg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvb2RudWNram1sbWVqZXl5bmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTQwNTQsImV4cCI6MjA2ODQ5MDA1NH0.tu12RS2PsuKvewIEaCXI2eMyLMOYuZi8gSBe6nIPN2s'

// Add connection verification
export const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count')
    if (error) throw error
    console.log('Supabase connection successful!')
    return true
  } catch (error) {
    console.error('Supabase connection error:', error.message)
    return false
  }
}

// Verify connection on init
testConnection()
  .then(isConnected => {
    if (!isConnected) {
      console.error('Failed to connect to Supabase. Check your configuration.')
    }
  })

// Helper function to sync Auth0 user with Supabase
export const syncUserWithSupabase = async (auth0User) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        auth0_id: auth0User.sub,
        email: auth0User.email,
        name: auth0User.name,
        picture: auth0User.picture,
        email_verified: auth0User.email_verified,
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error syncing user with Supabase:', error)
      return null
    }

    return data[0]
  } catch (error) {
    console.error('Error syncing user with Supabase:', error)
    return null
  }
}

// Helper function to get user from Supabase by Auth0 ID
export const getUserFromSupabase = async (auth0Id) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth0_id', auth0Id)
      .single()

    if (error) {
      console.error('Error fetching user from Supabase:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching user from Supabase:', error)
    return null
  }
}
