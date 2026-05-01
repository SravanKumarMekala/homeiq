import { useEffect, useState } from 'react'
import { getLogs } from '../api'

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getLogs().then(r => { setLogs(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action.includes(filter === 'on' ? 'on' : 'off'))

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Activity Logs</h1>
          <p style={s.subtitle}>{(logs || []).length} total events recorded</p>
        </div>
        <div style={s.filters}>
          {['all', 'on', 'off'].map(f => (
            <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? '📋 All' : f === 'on' ? '💡 Turned ON' : '🌙 Turned OFF'}
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={s.empty}>Loading...</div>}

      {!loading && filtered.length === 0 && (
        <div style={s.empty}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
          <p>No activity logs yet.</p>
          <p style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>Start controlling devices to see logs here.</p>
        </div>
      )}

      <div style={s.list}>
        {(filtered || []).map((log, i) => (
          <div key={log.id} style={{ ...s.logCard, animationDelay: `${i * 0.05}s` }}>
            <div style={{ ...s.dot, background: log.action === 'turned_on' ? '#10b981' : '#ef4444' }} />
            <div style={s.logInfo}>
              <span style={{ ...s.action, color: log.action === 'turned_on' ? '#34d399' : '#f87171' }}>
                {log.action === 'turned_on' ? '⚡ Turned ON' : '🌙 Turned OFF'}
              </span>
              <span style={s.via}>via {log.triggered_by}</span>
            </div>
            <div style={s.timeWrap}>
              <span style={s.time}>{new Date(log.created_at).toLocaleTimeString()}</span>
              <span style={s.date}>{new Date(log.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const s = {
  page: { padding: '28px', maxWidth: '800px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#e2e8f0' },
  subtitle: { color: '#475569', fontSize: '14px', marginTop: '2px' },
  filters: { display: 'flex', gap: '8px' },
  filterBtn: { padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.1)', borderRadius: '10px', color: '#475569', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  filterActive: { background: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.3)', color: '#60a5fa' },
  empty: { textAlign: 'center', padding: '60px', color: '#475569' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  logCard: { display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(13,20,33,0.8)', border: '1px solid rgba(99,179,237,0.08)', borderRadius: '14px', padding: '14px 18px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  logInfo: { flex: 1, display: 'flex', alignItems: 'center', gap: '12px' },
  action: { fontSize: '14px', fontWeight: '600' },
  via: { fontSize: '12px', color: '#334155', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px' },
  timeWrap: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  time: { fontSize: '13px', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' },
  date: { fontSize: '11px', color: '#334155' },
}
