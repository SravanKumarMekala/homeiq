import { useState, useEffect } from 'react'
import { createSchedule, getSchedules, getDevices } from '../api'

export default function Scheduler() {
  const [schedules, setSchedules] = useState([])
  const [devices, setDevices] = useState([])
  const [form, setForm] = useState({ device_id: '', action: 'turn_off', scheduled_time: '22:00', repeat_days: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun' })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getSchedules().then(r => setSchedules(r.data))
    getDevices().then(r => setDevices(r.data))
  }, [])

  const save = async () => {
    if (!form.device_id) return alert('Please select a device!')
    setLoading(true)
    try {
      await createSchedule(form)
      const res = await getSchedules()
      setSchedules(res.data)
      setShowForm(false)
    } catch (e) { alert('Failed to save schedule') }
    setLoading(false)
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const selectedDays = form.repeat_days ? form.repeat_days.split(',') : []
  const toggleDay = (day) => {
    const current = selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day]
    setForm({ ...form, repeat_days: current.join(',') })
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Auto Scheduler</h1>
          <p style={s.subtitle}>Automate your devices with time-based rules</p>
        </div>
        <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Schedule'}
        </button>
      </div>

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>⏰ Create New Schedule</h3>
          <div style={s.formGrid}>
            <div style={s.field}>
              <label style={s.label}>Device</label>
              <select style={s.input} value={form.device_id}
                onChange={e => setForm({ ...form, device_id: e.target.value })}>
                <option value="">Select a device...</option>
                {devices.map(d => <option key={d.id} value={d.id}>{d.name} ({d.type})</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Action</label>
              <select style={s.input} value={form.action}
                onChange={e => setForm({ ...form, action: e.target.value })}>
                <option value="turn_off">🌙 Turn OFF</option>
                <option value="turn_on">⚡ Turn ON</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Time</label>
              <input style={s.input} type="time" value={form.scheduled_time}
                onChange={e => setForm({ ...form, scheduled_time: e.target.value })} />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Repeat on days</label>
            <div style={s.dayPicker}>
              {days.map(day => (
                <button key={day}
                  style={{ ...s.dayBtn, ...(selectedDays.includes(day) ? s.dayBtnActive : {}) }}
                  onClick={() => toggleDay(day)}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          <button style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }} onClick={save} disabled={loading}>
            {loading ? 'Saving...' : '✓ Save Schedule'}
          </button>
        </div>
      )}

      <div style={s.list}>
        {schedules.length === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
            <p>No schedules yet.</p>
            <p style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>Create one to automate your devices!</p>
          </div>
        )}
        {schedules.map(sc => (
          <div key={sc.id} style={s.scheduleCard}>
            <div style={{ ...s.actionBadge, background: sc.action === 'turn_on' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', color: sc.action === 'turn_on' ? '#34d399' : '#a78bfa', border: `1px solid ${sc.action === 'turn_on' ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}` }}>
              {sc.action === 'turn_on' ? '⚡ Turn ON' : '🌙 Turn OFF'}
            </div>
            <div style={s.scheduleInfo}>
              <span style={s.scheduleTime}>{sc.scheduled_time}</span>
              {sc.repeat_days && <span style={s.scheduleDays}>{sc.repeat_days}</span>}
            </div>
            <div style={{ ...s.statusDot, background: sc.is_active ? '#10b981' : '#334155' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

const s = {
  page: { padding: '28px', maxWidth: '700px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#e2e8f0' },
  subtitle: { color: '#475569', fontSize: '14px', marginTop: '2px' },
  addBtn: { padding: '10px 18px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '10px', color: '#60a5fa', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  formCard: { background: 'rgba(13,20,33,0.9)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '18px', padding: '24px', marginBottom: '24px' },
  formTitle: { fontSize: '16px', fontWeight: '700', color: '#e2e8f0', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '10px', color: '#e2e8f0', fontSize: '14px', outline: 'none' },
  dayPicker: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  dayBtn: { padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(99,179,237,0.1)', background: 'transparent', color: '#475569', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  dayBtnActive: { background: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6', color: '#60a5fa' },
  saveBtn: { marginTop: '16px', width: '100%', padding: '13px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  empty: { textAlign: 'center', padding: '60px', color: '#475569' },
  scheduleCard: { display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(13,20,33,0.8)', border: '1px solid rgba(99,179,237,0.08)', borderRadius: '14px', padding: '16px 20px' },
  actionBadge: { padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' },
  scheduleInfo: { flex: 1, display: 'flex', alignItems: 'center', gap: '12px' },
  scheduleTime: { fontSize: '20px', fontWeight: '800', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' },
  scheduleDays: { fontSize: '12px', color: '#475569', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '20px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
}
