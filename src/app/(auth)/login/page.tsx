'use client'

import React, { useState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ArrowRight, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-xl border-white shadow-2xl shadow-slate-200/50">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to your secure portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                name="email"
                type="email" 
                required 
                placeholder="dr.neha.patel@durgaclinic.in"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm font-medium placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                name="password"
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm font-medium placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group transition"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-500">
            Protected by enterprise-grade security and <br /> Row Level Security (RLS).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
