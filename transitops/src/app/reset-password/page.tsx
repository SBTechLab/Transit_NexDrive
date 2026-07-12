'use client'

import { useState, Suspense } from 'react'
import { resetPassword } from '@/app/actions/auth'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Lock, Loader2 } from 'lucide-react'

function ResetPasswordForm() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return toast.error('No reset token provided')
    const fd = new FormData(e.currentTarget)
    const password = fd.get('password') as string
    const confirm = fd.get('confirm') as string
    if (password !== confirm) return toast.error('Passwords do not match')
    if (password.length < 8) return toast.error('Minimum 8 characters required')
    setLoading(true)
    const res = await resetPassword(token, password)
    setLoading(false)
    if (res.success) { toast.success('Password reset! Please login.'); router.push('/login') }
    else toast.error(res.error || 'Failed to reset password')
  }

  const inputClass = "w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"

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
          {!token ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-red-600">Invalid Link</h2>
              <p className="text-sm text-gray-500">This reset link is invalid or has expired.</p>
              <Link href="/forgot-password" className="block w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm flex items-center justify-center hover:from-blue-700 hover:to-violet-700 transition-all">
                Request New Link
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Set new password</h2>
              <p className="text-sm text-gray-500 mb-6">Must be at least 8 characters</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="password" name="password" placeholder="New password" required minLength={8} className={inputClass} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="password" name="confirm" placeholder="Confirm password" required minLength={8} className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Resetting...</> : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
