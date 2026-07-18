'use client'

import React, { createContext, useContext, useCallback } from 'react'
import { useAuth } from './AuthContext'

// ---------------------------------------------------------------------------
// Context definition
// ---------------------------------------------------------------------------
interface PermissionContextValue {
  /** Check if the user has a specific permission e.g. "patients.create" */
  hasPermission: (permission: string) => boolean
  /** Check if any of the given permissions exist */
  hasAnyPermission: (...permissions: string[]) => boolean
  /** Check if all of the given permissions exist */
  hasAllPermissions: (...permissions: string[]) => boolean
  /** Check if the user has a specific role by name e.g. "Doctor" */
  hasRole: (roleName: string) => boolean
  /** Check if a feature flag is enabled e.g. "sms_notifications" */
  isFeatureEnabled: (flagKey: string) => boolean
}

const PermissionContext = createContext<PermissionContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()

  const hasPermission = useCallback((permission: string): boolean => {
    if (!session) return false
    // Super Admin has everything
    if (session.role_name === 'Super Admin') return true
    return session.permissions.includes(permission)
  }, [session])

  const hasAnyPermission = useCallback((...permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p))
  }, [hasPermission])

  const hasAllPermissions = useCallback((...permissions: string[]): boolean => {
    return permissions.every(p => hasPermission(p))
  }, [hasPermission])

  const hasRole = useCallback((roleName: string): boolean => {
    if (!session) return false
    return session.role_name.toLowerCase() === roleName.toLowerCase()
  }, [session])

  const isFeatureEnabled = useCallback((flagKey: string): boolean => {
    if (!session) return false
    return session.feature_flags[flagKey] === true
  }, [session])

  return (
    <PermissionContext.Provider value={{
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
      isFeatureEnabled,
    }}>
      {children}
    </PermissionContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function usePermission(): PermissionContextValue {
  const ctx = useContext(PermissionContext)
  if (!ctx) throw new Error('usePermission must be used inside <PermissionProvider>')
  return ctx
}
