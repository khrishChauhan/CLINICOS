'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <Card className="bg-white/80 backdrop-blur-xl border-white shadow-2xl shadow-slate-200/50">
      <CardContent className="p-8">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Check your email</h2>
            <p className="text-sm text-slate-500 mt-2">We have sent a password reset link to your email address.</p>
            <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800">Reset Password</h2>
              <p className="text-sm text-slate-500 mt-1">Enter your email to receive a reset link.</p>
            </div>
            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-medium">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </Button>
              <div className="text-center">
                <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </div>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
