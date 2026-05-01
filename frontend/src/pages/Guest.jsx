import { useState } from 'react'
import { createGuest } from '../api'

export default function Guest() {
  const [hours, setHours] = useState(2)
  const [rooms, setRooms] = useState('all')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await createGuest({ allowed_rooms: rooms, hours_valid: hours })
      setResult(res.data)
    } catch (e) { alert('Failed to generate guest access') }
    setLoading(false)
  }

  const copyToken = () => {
    navigator.clipboard.writeText(result.token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [
    { label: '1 hour', value: 1 },
    { label: '2 hours', value: 2 },
    { label: '6 hours', value: 6 },
    { label: '24 hours', value: 24 },
    { label: '3 days', value: 72 },
  ]

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Guest Access</h1>
          <p style={s.subtitle}>Share temporary access links that expire automatically</p>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <span style={{ fontSize: '20px' }}>🔗</span>
          <h3 style={s.cardTitle}>Generate Guest Link</h3>
        </div>

        <div style={s.field}>
          <label style={s.label}>Access Duration</label>
          <div style={s.presets}>
            {(presets || []).map(p => (
              <button key={p.value}
                style={{ ...s.preset, ...(hours === p.value ? s.presetActive : {}) }}
                onClick={() => setHours(p.value)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>Room Access</label>
          <div style={s.roomOptions}>
            {(['all', 'bedroom', 'kitchen', 'living room'] || []).map(r => (
              <button key={r}
                style={{ ...s.roomOption, ...(rooms === r ? s.roomOptionActive : {}) }}
                onClick={() => setRooms(r)}>
                {r === 'all' ? '🏠 All Rooms' : r}
              </button>
            ))}
          </div>
        </div>

        <div style={s.infoBox}>
          <span style={{ fontSize: '16px' }}>ℹ️</span>
          <p style={s.infoText}>Guest will have access for <strong style={{ color: '#60a5fa' }}>{hours} hour{hours > 1 ? 's' : ''}</strong> to <strong style={{ color: '#60a5fa' }}>{rooms}</strong> rooms. The link expires automatically.</p>
        </div>

        <button style={{ ...s.generateBtn, opacity: loading ? 0.7 : 1 }} onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : '🔗 Generate Access Link'}
        </button>
      </div>

      {result && (
        <div style={s.resultCard}>
          <div style={s.resultHeader}>
            <span style={{ fontSize: '22px' }}>✅</span>
            <div>
              <h3 style={{ color: '#34d399', fontWeight: '700' }}>Guest Access Created!</h3>
              <p style={{ color: '#475569', fontSize: '13px' }}>Share this token with your guest</p>
            </div>
          </div>

          <div style={s.tokenBox}>
            <span style={s.tokenLabel}>Access Token</span>
            <div style={s.tokenRow}>
              <code style={s.token}>{result.token}</code>
              <button style={{ ...s.copyBtn, background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.15)', borderColor: copied ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.3)', color: copied ? '#34d399' : '#60a5fa' }}
                onClick={copyToken}>
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>

          <div style={s.metaRow}>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Expires</span>
              <span style={s.metaValue}>{new Date(result.expires_at).toLocaleString()}</span>
            </div>
            <div style={s.metaItem}>
              <span style={s.metaLabel}>Rooms</span>
              <span style={s.metaValue}>{result.allowed_rooms}</span>
            </div>
          </div>

          <button style={s.newBtn} onClick={() => setResult(null)}>Generate Another</button>
        </div>
      )}
    </div>
  )
}

const s = {
  page: { padding: '28px', maxWidth: '600px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#e2e8f0' },
  subtitle: { color: '#475569', fontSize: '14px', marginTop: '2px' },
  card: { background: 'rgba(13,20,33,0.9)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '20px', padding: '24px', marginBottom: '20px' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' },
  cardTitle: { fontSize: '17px', fontWeight: '700', color: '#e2e8f0' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px' },
  presets: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  preset: { padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(99,179,237,0.1)', background: 'transparent', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  presetActive: { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)', color: '#60a5fa' },
  roomOptions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  roomOption: { padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(99,179,237,0.1)', background: 'transparent', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  roomOptionActive: { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.4)', color: '#60a5fa' },
  infoBox: { display: 'flex', gap: '10px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' },
  infoText: { fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' },
  generateBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' },
  resultCard: { background: 'rgba(13,20,33,0.9)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '24px' },
  resultHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  tokenBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,179,237,0.1)', borderRadius: '12px', padding: '14px', marginBottom: '16px' },
  tokenLabel: { fontSize: '11px', fontWeight: '600', color: '#334155', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' },
  tokenRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  token: { flex: 1, fontSize: '12px', color: '#60a5fa', wordBreak: 'break-all', fontFamily: 'JetBrains Mono, monospace' },
  copyBtn: { padding: '8px 14px', border: '1px solid', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 },
  metaRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' },
  metaItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  metaLabel: { fontSize: '11px', color: '#334155', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  metaValue: { fontSize: '13px', color: '#94a3b8' },
  newBtn: { width: '100%', padding: '11px', background: 'transparent', border: '1px solid rgba(99,179,237,0.15)', borderRadius: '10px', color: '#475569', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
}
