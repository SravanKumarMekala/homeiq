import { useState, useEffect } from 'react'
import { getRooms, createRoom, deleteRoom, getDevicesByRoom, createDevice, controlDevice, deleteDevice } from '../api'
import Logs from './Logs'
import Scheduler from './Scheduler'
import Guest from './Guest'

const DEVICE_ICONS = { light: '💡', fan: '🌀', ac: '❄️', tv: '📺', other: '🔌' }
const DEVICE_COLORS = { light: '#f59e0b', fan: '#06b6d4', ac: '#3b82f6', tv: '#8b5cf6', other: '#10b981' }
const ROOM_ICONS = ['🛏️', '🍳', '🛋️', '🚿', '🏠', '📚', '🎮', '🌿']

export default function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState('home')
  const [rooms, setRooms] = useState([])
  const [devices, setDevices] = useState({})
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [newRoom, setNewRoom] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('🏠')
  const [newDevice, setNewDevice] = useState({ name: '', type: 'light', power_watts: 60 })
  const [listening, setListening] = useState(false)
  const [voiceResult, setVoiceResult] = useState('')
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [showAddDevice, setShowAddDevice] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { loadRooms() }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadRooms = async () => {
    try {
      const res = await getRooms()
      setRooms(res.data)
      if (res.data.length > 0 && !selectedRoom) {
        loadDevices(res.data[0])
      }
    } catch (e) { console.error(e) }
  }

  const loadDevices = async (room) => {
    setSelectedRoom(room)
    try {
      const res = await getDevicesByRoom(room.id)
      setDevices(prev => ({ ...prev, [room.id]: res.data }))
    } catch (e) { console.error(e) }
  }

  const addRoom = async () => {
    if (!newRoom.trim()) return
    try {
      await createRoom({ name: newRoom, icon: selectedIcon })
      setNewRoom('')
      setShowAddRoom(false)
      showToast(`Room "${newRoom}" added!`)
      loadRooms()
    } catch (e) { showToast('Failed to add room', 'error') }
  }

  const removeRoom = async (room) => {
    if (!confirm(`Delete "${room.name}"?`)) return
    try {
      await deleteRoom(room.id)
      if (selectedRoom?.id === room.id) setSelectedRoom(null)
      showToast(`Room deleted`)
      loadRooms()
    } catch (e) { showToast('Failed to delete room', 'error') }
  }

  const addDevice = async () => {
    if (!selectedRoom || !newDevice.name.trim()) return
    try {
      await createDevice({ ...newDevice, room_id: selectedRoom.id })
      setNewDevice({ name: '', type: 'light', power_watts: 60 })
      setShowAddDevice(false)
      showToast(`Device added!`)
      loadDevices(selectedRoom)
    } catch (e) { showToast('Failed to add device', 'error') }
  }

  const toggle = async (device) => {
    try {
      await controlDevice(device.id, { is_on: !device.is_on })
      showToast(`${device.name} turned ${!device.is_on ? 'ON' : 'OFF'}`, !device.is_on ? 'success' : 'info')
      loadDevices(selectedRoom)
    } catch (e) { showToast('Failed to control device', 'error') }
  }

  const removeDevice = async (device) => {
    try {
      await deleteDevice(device.id)
      showToast(`${device.name} removed`)
      loadDevices(selectedRoom)
    } catch (e) { showToast('Failed to delete device', 'error') }
  }

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return showToast('Voice not supported. Use Chrome!', 'error')
    const rec = new SR()
    setListening(true)
    setVoiceResult('')
    rec.start()
    rec.onresult = (e) => {
      const cmd = e.results[0][0].transcript.toLowerCase()
      setVoiceResult(cmd)
      setListening(false)
      const roomDevices = devices[selectedRoom?.id] || []
      let matched = false
      roomDevices.forEach(device => {
        if (cmd.includes(device.name.toLowerCase())) {
          const turnOn = cmd.includes('on') || cmd.includes('turn on')
          controlDevice(device.id, { is_on: turnOn })
          showToast(`Voice: ${device.name} turned ${turnOn ? 'ON' : 'OFF'}`)
          setTimeout(() => loadDevices(selectedRoom), 500)
          matched = true
        }
      })
      if (!matched) showToast('No device matched your command', 'error')
    }
    rec.onerror = () => { setListening(false); showToast('Voice error. Try again.', 'error') }
    rec.onend = () => setListening(false)
  }

  const currentDevices = selectedRoom ? (devices[selectedRoom.id] || []) : []
  const onDevices = currentDevices.filter(d => d.is_on)
  const totalWatts = onDevices.reduce((a, d) => a + d.power_watts, 0)
  const energyLevel = totalWatts > 2000 ? 'high' : totalWatts > 500 ? 'medium' : 'low'
  const energyColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' }[energyLevel]

  const navItems = [
    { id: 'home', icon: '⚡', label: 'Dashboard' },
    { id: 'logs', icon: '📋', label: 'Activity' },
    { id: 'scheduler', icon: '⏰', label: 'Scheduler' },
    { id: 'guest', icon: '🔗', label: 'Guest Access' },
  ]

  return (
    <div style={s.layout}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarTop}>
          <div style={s.brandRow}>
            <div style={s.brandIcon}>🏠</div>
            <span style={s.brandName}>HomeIQ</span>
          </div>
          <div style={s.userBadge}>
            <div style={s.userAvatar}>{user?.email?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div style={s.userName}>{user?.email?.split('@')[0]}</div>
              <div style={s.userRole}>Owner</div>
            </div>
          </div>
        </div>

        <nav style={s.nav}>
          {navItems.map(item => (
            <button key={item.id}
              style={{ ...s.navBtn, ...(tab === item.id ? s.navBtnActive : {}) }}
              onClick={() => setTab(item.id)}>
              <span style={s.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
              {tab === item.id && <div style={s.navIndicator} />}
            </button>
          ))}
        </nav>

        <button style={s.logoutBtn} onClick={onLogout}>
          <span>🚪</span> Logout
        </button>
      </div>

      {/* Main content */}
      <div style={s.main}>
        {/* Toast */}
        {toast && (
          <div style={{ ...s.toast, background: toast.type === 'error' ? 'rgba(239,68,68,0.9)' : toast.type === 'info' ? 'rgba(99,102,241,0.9)' : 'rgba(16,185,129,0.9)' }}>
            {toast.msg}
          </div>
        )}

        {tab === 'home' && (
          <div style={s.content}>
            {/* Header */}
            <div style={s.header}>
              <div>
                <h1 style={s.pageTitle}>Smart Dashboard</h1>
                <p style={s.pageSubtitle}>{rooms.length} rooms · {Object.values(devices).flat().length} devices</p>
              </div>
              <button style={{ ...s.voiceBtn, ...(listening ? s.voiceBtnActive : {}) }} onClick={startVoice}>
                <span style={{ fontSize: '18px' }}>{listening ? '🎙️' : '🎤'}</span>
                <span>{listening ? 'Listening...' : 'Voice Control'}</span>
              </button>
            </div>

            {voiceResult && (
              <div style={s.voiceResult}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Heard: </span>
                <span style={{ color: '#60a5fa', fontStyle: 'italic' }}>"{voiceResult}"</span>
              </div>
            )}

            {/* Stats row */}
            <div style={s.statsRow}>
              <div style={s.statCard}>
                <div style={s.statIcon}>⚡</div>
                <div>
                  <div style={{ ...s.statValue, color: energyColor }}>{totalWatts}W</div>
                  <div style={s.statLabel}>Energy in use</div>
                </div>
              </div>
              <div style={s.statCard}>
                <div style={s.statIcon}>💡</div>
                <div>
                  <div style={s.statValue}>{onDevices.length}</div>
                  <div style={s.statLabel}>Devices ON</div>
                </div>
              </div>
              <div style={s.statCard}>
                <div style={s.statIcon}>🏠</div>
                <div>
                  <div style={s.statValue}>{rooms.length}</div>
                  <div style={s.statLabel}>Rooms</div>
                </div>
              </div>
              {totalWatts > 1000 && (
                <div style={{ ...s.statCard, borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
                  <div style={s.statIcon}>⚠️</div>
                  <div>
                    <div style={{ ...s.statValue, color: '#f59e0b', fontSize: '13px' }}>High Usage</div>
                    <div style={s.statLabel}>Consider turning off devices</div>
                  </div>
                </div>
              )}
            </div>

            {/* Rooms */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <h2 style={s.sectionTitle}>Rooms</h2>
                <button style={s.addBtn} onClick={() => setShowAddRoom(!showAddRoom)}>
                  {showAddRoom ? '✕ Cancel' : '+ Add Room'}
                </button>
              </div>

              {showAddRoom && (
                <div style={s.addPanel}>
                  <div style={s.iconPicker}>
                    {ROOM_ICONS.map(icon => (
                      <button key={icon} style={{ ...s.iconBtn, ...(selectedIcon === icon ? s.iconBtnActive : {}) }}
                        onClick={() => setSelectedIcon(icon)}>{icon}</button>
                    ))}
                  </div>
                  <div style={s.addRow}>
                    <span style={s.selectedIcon}>{selectedIcon}</span>
                    <input style={s.addInput} placeholder="Room name (e.g. Bedroom)"
                      value={newRoom}
                      onChange={e => setNewRoom(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addRoom()} />
                    <button style={s.confirmBtn} onClick={addRoom}>Add</button>
                  </div>
                </div>
              )}

              <div style={s.roomGrid}>
                {rooms.map(room => (
                  <div key={room.id}
                    style={{ ...s.roomCard, ...(selectedRoom?.id === room.id ? s.roomCardActive : {}) }}
                    onClick={() => loadDevices(room)}>
                    <span style={s.roomEmoji}>{room.icon || '🏠'}</span>
                    <span style={s.roomName}>{room.name}</span>
                    <span style={s.roomCount}>
                      {(devices[room.id] || []).filter(d => d.is_on).length}/{(devices[room.id] || []).length}
                    </span>
                    <button style={s.deleteBtn} onClick={e => { e.stopPropagation(); removeRoom(room) }}>✕</button>
                  </div>
                ))}
                {rooms.length === 0 && (
                  <div style={s.emptyState}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏠</div>
                    <p style={{ color: '#475569' }}>Add your first room to get started!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Devices */}
            {selectedRoom && (
              <div style={s.section}>
                <div style={s.sectionHeader}>
                  <h2 style={s.sectionTitle}>
                    {selectedRoom.icon} {selectedRoom.name}
                    <span style={s.deviceCount}>{currentDevices.length} devices</span>
                  </h2>
                  <button style={s.addBtn} onClick={() => setShowAddDevice(!showAddDevice)}>
                    {showAddDevice ? '✕ Cancel' : '+ Add Device'}
                  </button>
                </div>

                {showAddDevice && (
                  <div style={s.addPanel}>
                    <div style={s.addDeviceForm}>
                      <input style={s.addInput} placeholder="Device name (e.g. Ceiling Fan)"
                        value={newDevice.name}
                        onChange={e => setNewDevice({ ...newDevice, name: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && addDevice()} />
                      <select style={s.addInput} value={newDevice.type}
                        onChange={e => setNewDevice({ ...newDevice, type: e.target.value })}>
                        <option value="light">💡 Light</option>
                        <option value="fan">🌀 Fan</option>
                        <option value="ac">❄️ AC</option>
                        <option value="tv">📺 TV</option>
                        <option value="other">🔌 Other</option>
                      </select>
                      <input style={s.addInput} type="number" placeholder="Watts (e.g. 60)"
                        value={newDevice.power_watts}
                        onChange={e => setNewDevice({ ...newDevice, power_watts: parseInt(e.target.value) || 0 })} />
                      <button style={s.confirmBtn} onClick={addDevice}>Add Device</button>
                    </div>
                  </div>
                )}

                <div style={s.deviceGrid}>
                  {currentDevices.map(device => (
                    <DeviceCard key={device.id} device={device} onToggle={toggle} onDelete={removeDevice} />
                  ))}
                  {currentDevices.length === 0 && (
                    <div style={s.emptyState}>
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔌</div>
                      <p style={{ color: '#475569' }}>No devices yet. Add one above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'logs' && <Logs />}
        {tab === 'scheduler' && <Scheduler />}
        {tab === 'guest' && <Guest />}
      </div>
    </div>
  )
}

function DeviceCard({ device, onToggle, onDelete }) {
  const color = DEVICE_COLORS[device.type] || '#10b981'
  const icon = DEVICE_ICONS[device.type] || '🔌'

  return (
    <div style={{ ...dc.card, borderColor: device.is_on ? color + '40' : 'rgba(99,179,237,0.08)', background: device.is_on ? `rgba(${hexToRgb(color)},0.06)` : 'rgba(13,20,33,0.8)' }}>
      <button style={dc.deleteBtn} onClick={() => onDelete(device)}>✕</button>
      <div style={{ ...dc.iconWrap, background: device.is_on ? color + '20' : 'rgba(255,255,255,0.04)', border: `1px solid ${device.is_on ? color + '40' : 'rgba(255,255,255,0.06)'}` }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        {device.is_on && <div style={{ ...dc.glow, boxShadow: `0 0 20px ${color}60` }} />}
      </div>
      <p style={dc.name}>{device.name}</p>
      <p style={{ ...dc.type, color: device.is_on ? color : '#475569' }}>
        {device.type.toUpperCase()} · {device.power_watts}W
      </p>
      <div style={{ ...dc.toggleTrack, background: device.is_on ? color : 'rgba(255,255,255,0.08)' }}
        onClick={() => onToggle(device)}>
        <div style={{ ...dc.toggleThumb, transform: device.is_on ? 'translateX(26px)' : 'translateX(3px)', boxShadow: device.is_on ? `0 2px 8px ${color}80` : 'none' }} />
      </div>
      <span style={{ ...dc.status, color: device.is_on ? color : '#334155' }}>
        {device.is_on ? '● ON' : '○ OFF'}
      </span>
    </div>
  )
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : '59,130,246'
}

const dc = {
  card: { position: 'relative', borderRadius: '20px', padding: '20px', border: '1px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.3s', cursor: 'default' },
  deleteBtn: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', width: '24px', height: '24px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.3s' },
  glow: { position: 'absolute', inset: '-4px', borderRadius: '22px', opacity: 0.3, pointerEvents: 'none' },
  name: { fontWeight: '700', fontSize: '15px', textAlign: 'center', color: '#e2e8f0' },
  type: { fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', transition: 'color 0.3s', fontFamily: 'JetBrains Mono, monospace' },
  toggleTrack: { width: '52px', height: '28px', borderRadius: '14px', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' },
  toggleThumb: { position: 'absolute', top: '3px', width: '22px', height: '22px', background: 'white', borderRadius: '50%', transition: 'all 0.3s' },
  status: { fontSize: '12px', fontWeight: '700', letterSpacing: '1px', transition: 'color 0.3s' }
}

const s = {
  layout: { display: 'flex', height: '100vh', overflow: 'hidden', background: '#080c14' },
  sidebar: { width: '220px', background: '#0d1421', borderRight: '1px solid rgba(99,179,237,0.08)', display: 'flex', flexDirection: 'column', padding: '20px 12px' },
  sidebarTop: { marginBottom: '32px' },
  brandRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '0 8px' },
  brandIcon: { fontSize: '22px' },
  brandName: { fontSize: '20px', fontWeight: '800', color: '#e2e8f0' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,179,237,0.08)', borderRadius: '12px', padding: '10px' },
  userAvatar: { width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0 },
  userName: { fontSize: '13px', fontWeight: '600', color: '#e2e8f0' },
  userRole: { fontSize: '11px', color: '#475569' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 12px', borderRadius: '12px', border: 'none', background: 'transparent', color: '#475569', fontSize: '14px', fontWeight: '500', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', textAlign: 'left' },
  navBtnActive: { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', fontWeight: '600' },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  navIndicator: { position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', width: '3px', height: '20px', background: '#3b82f6', borderRadius: '2px' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 12px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', color: '#f87171', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' },
  main: { flex: 1, overflowY: 'auto', position: 'relative' },
  content: { padding: '28px', maxWidth: '1100px' },
  toast: { position: 'fixed', top: '20px', right: '20px', padding: '12px 20px', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '14px', zIndex: 1000, backdropFilter: 'blur(10px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  pageTitle: { fontSize: '26px', fontWeight: '800', color: '#e2e8f0', letterSpacing: '-0.5px' },
  pageSubtitle: { color: '#475569', fontSize: '14px', marginTop: '2px' },
  voiceBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#a78bfa', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' },
  voiceBtnActive: { background: 'rgba(139,92,246,0.25)', borderColor: '#8b5cf6', animation: 'pulse 1s infinite' },
  voiceResult: { background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' },
  statCard: { background: 'rgba(13,20,33,0.8)', border: '1px solid rgba(99,179,237,0.1)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' },
  statIcon: { fontSize: '24px' },
  statValue: { fontSize: '22px', fontWeight: '800', color: '#e2e8f0' },
  statLabel: { fontSize: '12px', color: '#475569', marginTop: '2px' },
  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  sectionTitle: { fontSize: '17px', fontWeight: '700', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' },
  deviceCount: { fontSize: '12px', color: '#475569', fontWeight: '500', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '20px' },
  addBtn: { padding: '8px 16px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '10px', color: '#60a5fa', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  addPanel: { background: 'rgba(13,20,33,0.8)', border: '1px solid rgba(99,179,237,0.1)', borderRadius: '14px', padding: '16px', marginBottom: '14px' },
  iconPicker: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' },
  iconBtn: { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(99,179,237,0.1)', background: 'transparent', fontSize: '18px', cursor: 'pointer' },
  iconBtnActive: { background: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6' },
  selectedIcon: { fontSize: '22px', flexShrink: 0 },
  addRow: { display: 'flex', gap: '8px', alignItems: 'center' },
  addDeviceForm: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', alignItems: 'center' },
  addInput: { padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '10px', color: '#e2e8f0', fontSize: '13px', outline: 'none' },
  confirmBtn: { padding: '10px 18px', background: '#3b82f6', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' },
  roomGrid: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  roomCard: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(13,20,33,0.8)', border: '1px solid rgba(99,179,237,0.08)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' },
  roomCardActive: { background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)' },
  roomEmoji: { fontSize: '18px' },
  roomName: { fontSize: '14px', fontWeight: '600', color: '#e2e8f0' },
  roomCount: { fontSize: '12px', color: '#475569', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: '10px' },
  deleteBtn: { background: 'none', border: 'none', color: '#334155', fontSize: '12px', cursor: 'pointer', padding: '2px', marginLeft: '4px' },
  deviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' },
  emptyState: { gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#475569', fontSize: '14px' },
}
