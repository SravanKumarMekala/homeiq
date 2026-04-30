import { useState } from 'react'
import { loginUser, registerUser } from '../api'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await registerUser(form)
        alert('Account created! Please login.')
        setIsRegister(false)
      } else {
        const res = await loginUser(form)
        onLogin({ email: form.email, token: res.data.access_token })
      }
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    }
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter') handle() }

  return (
    <div style={s.page}>
      {/* Animated background grid */}
      <div style={s.grid} />
      <div style={s.glow1} />
      <div style={s.glow2} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12h6v10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={s.logo}>HomeIQ</h1>
        </div>
        <p style={s.tagline}>Smart Home Control Center</p>

        <div style={s.tabs}>
          <button style={{...s.tab, ...(isRegister ? {} : s.tabActive)}} onClick={() => setIsRegister(false)}>Login</button>
          <button style={{...s.tab, ...(isRegister ? s.tabActive : {})}} onClick={() => setIsRegister(true)}>Register</button>
        </div>

        <div style={s.form}>
          {isRegister && (
            <div style={s.inputWrap}>
              <span style={s.inputIcon}>👤</span>
              <input style={s.input} placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onKeyDown={handleKey} />
            </div>
          )}
          <div style={s.inputWrap}>
            <span style={s.inputIcon}>✉️</span>
            <input style={s.input} placeholder="Email address" type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={handleKey} />
          </div>
          <div style={s.inputWrap}>
            <span style={s.inputIcon}>🔒</span>
            <input style={s.input} placeholder="Password" type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKey} />
          </div>

          {error && (
            <div style={s.error}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button style={{...s.btn, opacity: loading ? 0.7 : 1}} onClick={handle} disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Login to HomeIQ')}
          </button>
        </div>

        <p style={s.hint}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span style={s.link} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#080c14' },
  grid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' },
  glow1: { position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', borderRadius: '50%' },
  glow2: { position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%' },
  card: { position: 'relative', background: 'rgba(13,20,33,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '24px', padding: '40px', width: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.05)' },
  logoWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' },
  logoIcon: { width: '48px', height: '48px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: '32px', fontWeight: '800', color: '#e2e8f0', letterSpacing: '-0.5px' },
  tagline: { textAlign: 'center', color: '#475569', fontSize: '14px', marginBottom: '28px' },
  tabs: { display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '24px' },
  tab: { flex: 1, padding: '10px', border: 'none', background: 'transparent', color: '#475569', borderRadius: '10px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' },
  tabActive: { background: '#3b82f6', color: 'white', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  inputWrap: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' },
  inputIcon: { padding: '0 14px', fontSize: '16px' },
  input: { flex: 1, padding: '14px 14px 14px 0', background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '14px', outline: 'none' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', color: '#fca5a5', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' },
  btn: { padding: '15px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', letterSpacing: '0.3px', boxShadow: '0 8px 24px rgba(59,130,246,0.4)', transition: 'all 0.2s', marginTop: '4px' },
  hint: { textAlign: 'center', color: '#475569', fontSize: '13px', marginTop: '20px' },
  link: { color: '#60a5fa', cursor: 'pointer', fontWeight: '600' }
}
