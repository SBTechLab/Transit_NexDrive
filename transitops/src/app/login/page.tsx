'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Zap, Mail, Lock, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      toast.error('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const inputClass = "w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-xl shadow-blue-500/30 mb-4">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transit<span className="text-blue-400">Ops</span></h1>
          <p className="text-slate-400 text-sm mt-1">Smart Fleet Management Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/20 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Login — password: <span className="text-blue-600">pass123</span></p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Fleet Manager', email: 'sbbhalani11@gmail.com', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: 'Safety Officer', email: 'sbpro1820@gmail.com', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                { label: 'Financial Analyst', email: 'masterprompt8@gmail.com', color: 'bg-violet-50 text-violet-700 hover:bg-violet-100' },
                { label: 'Driver', email: 'smartmax650@gmail.com', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              ].map(a => (
                <button key={a.email} type="button" onClick={() => { setEmail(a.email); setPassword('pass123') }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${a.color}`}>
                  <div className="font-semibold">{a.label}</div>
                  <div className="opacity-70 truncate">{a.email.split('@')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
