import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { syncUserWithSupabase, getUserFromSupabase } from '../lib/supabase'

export const useSupabaseAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const [supabaseUser, setSupabaseUser] = useState(null)
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleUserSync = async () => {
      if (isAuthenticated && user) {
        setIsSupabaseLoading(true)
        setError(null)

        try {
          // First, try to get existing user from Supabase
          let supabaseUserData = await getUserFromSupabase(user.sub)

          // If user doesn't exist, sync them to Supabase
          if (!supabaseUserData) {
            supabaseUserData = await syncUserWithSupabase(user)
          }

          setSupabaseUser(supabaseUserData)
        } catch (err) {
          setError('Failed to sync user with Supabase')
          console.error('Supabase sync error:', err)
        } finally {
          setIsSupabaseLoading(false)
        }
      } else {
        setSupabaseUser(null)
      }
    }

    if (!isLoading) {
      handleUserSync()
    }
  }, [user, isAuthenticated, isLoading])

  return {
    user,
    supabaseUser,
    isAuthenticated,
    isLoading: isLoading || isSupabaseLoading,
    error
  }
}
