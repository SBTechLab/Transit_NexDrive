'use client'

import { useState } from 'react'
import { requestPasswordReset } from '@/app/actions/auth'
import { toast } from 'sonner'
import Link from 'next/link'
import { Zap, Mail, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    await requestPasswordReset(email)
    setLoading(false)
    setSubmitted(true)
    toast.success('Reset link sent if account exists')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-xl shadow-blue-500/30 mb-4">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transit<span className="text-blue-400">Ops</span></h1>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/20 p-8">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
              <p className="text-sm text-gray-500">We sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>. Check your spam folder if you don't see it.</p>
              <Link href="/login" className="block w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm flex items-center justify-center mt-4 hover:from-blue-700 hover:to-violet-700 transition-all">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot password?</h2>
              <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                </div>
                <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
                </button>
              </form>
              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-blue-600 hover:underline">← Back to login</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
