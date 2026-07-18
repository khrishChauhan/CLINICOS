'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SessionContext, AuthState } from '@/types/auth'

// ---------------------------------------------------------------------------
// Context definition
// ---------------------------------------------------------------------------
interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const [state, setState] = useState<AuthState>({
    session: null,
    loading: true,
    error: null,
  })

  const loadSession = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setState({ session: null, loading: false, error: null })
        return
      }

      // Single round-trip RPC call — no waterfall
      const { data, error } = await supabase.rpc('get_session_context')

      if (error || !data) {
        setState({ session: null, loading: false, error: error?.message ?? 'Failed to load session.' })
        return
      }

      setState({ session: data as SessionContext, loading: false, error: null })
    } catch (err) {
      setState({ session: null, loading: false, error: 'Unexpected error loading session.' })
    }
  }, [supabase])

  // Initial load + subscribe to auth state changes
  useEffect(() => {
    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadSession()
      } else if (event === 'SIGNED_OUT') {
        setState({ session: null, loading: false, error: null })
      }
    })

    return () => subscription.unsubscribe()
  }, [loadSession, supabase.auth])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ session: null, loading: false, error: null })
  }, [supabase])

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshSession: loadSession }}>
      {children}
    </AuthContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
