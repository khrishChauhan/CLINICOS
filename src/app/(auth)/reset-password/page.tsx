'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Lock, Loader2, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/'), 2000)
    }
    setLoading(false)
  }

  return (
    <Card className="bg-white/80 backdrop-blur-xl border-white shadow-2xl shadow-slate-200/50">
      <CardContent className="p-8">
        {done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Password Updated!</h2>
            <p className="text-sm text-slate-500 mt-2">Redirecting you to the dashboard…</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800">Set New Password</h2>
              <p className="text-sm text-slate-500 mt-1">Choose a strong password for your account.</p>
            </div>
            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-medium">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="password" type="password" required minLength={8} className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="confirm" type="password" required minLength={8} className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm" />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
