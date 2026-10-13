import { useState } from 'react'

export default function AdminSettings({ user, onLogout }) {
  const safeUser = user || {}
  const safeUserId = safeUser.userId || safeUser.id || ''
  const safeUserName = safeUser.fullName || safeUser.name || 'Administrator'

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [maxAttempts, setMaxAttempts] = useState(3)
  const [autoLock, setAutoLock] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'Password must be at least 4 characters long.' })
      return
    }
    if (!safeUserId) {
      setMessage({ type: 'error', text: 'Administrator session is not ready yet.' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/edugame_api/change_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: safeUserId, currentPassword, newPassword, role: 'admin' })
      })
      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password.' })
      }
    } catch (err) {
      console.error('Password change error:', err)
      setMessage({ type: 'error', text: 'Could not connect to the XAMPP server.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#0f172a' }}>⚙️ Admin Profile & Settings</h3>
        <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>
          Manage your administrator profile, security preferences, and session.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section style={sectionCardStyle}>
          <h4 style={sectionHeaderStyle}>👤 Administrator Profile</h4>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Admin Full Name</label>
              <input type="text" value={safeUserName} disabled style={disabledInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Admin User ID</label>
              <input type="text" value={safeUserId || 'N/A'} disabled style={disabledInputStyle} />
            </div>
          </div>
        </section>

        <section style={sectionCardStyle}>
          <h4 style={sectionHeaderStyle}>🔑 Security & Password Reset</h4>
          {message.text && (
            <div role="status" style={message.type === 'success' ? successBannerStyle : errorBannerStyle}>
              {message.text}
            </div>
          )}
          <form onSubmit={handlePasswordChange} style={formStyle}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input type="password" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input type="password" placeholder="Re-enter new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} required />
            </div>
            <button type="submit" disabled={loading} style={{ ...saveBtnStyle, backgroundColor: loading ? '#6EE7B7' : '#059669' }}>
              {loading ? 'Updating...' : '🔒 Save New Password'}
            </button>
          </form>
        </section>

        <section style={sectionCardStyle}>
          <h4 style={sectionHeaderStyle}>🔒 Security & Attempt Lock Policy</h4>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Max Failed Login Attempts</label>
              <select value={maxAttempts} onChange={(e) => setMaxAttempts(Number(e.target.value))} style={inputStyle}>
                <option value={3}>3 Attempts (Default Lock Threshold)</option>
                <option value={5}>5 Attempts</option>
              </select>
            </div>
            <label style={checkboxLabelStyle}>
              <input type="checkbox" checked={autoLock} onChange={(e) => setAutoLock(e.target.checked)} style={checkboxStyle} />
              Auto-lock accounts when attempts exceed threshold
            </label>
          </div>
        </section>

        <section style={{ ...sectionCardStyle, borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
          <h4 style={{ ...sectionHeaderStyle, color: '#B91C1C' }}>🚪 Session</h4>
          <button type="button" onClick={onLogout} style={{ ...saveBtnStyle, backgroundColor: '#DC2626', width: 'fit-content', marginTop: 0 }}>
            Logout
          </button>
        </section>
      </div>
    </div>
  )
}

const containerStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const sectionCardStyle = { border: '1px solid #E2E8F0', padding: '20px', borderRadius: '8px', backgroundColor: '#F8FAFC' }
const sectionHeaderStyle = { margin: '0 0 15px 0', color: '#4338CA', fontSize: '1rem' }
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }
const disabledInputStyle = { ...inputStyle, backgroundColor: '#E2E8F0', color: '#64748B', cursor: 'not-allowed' }
const checkboxLabelStyle = { fontSize: '0.9rem', fontWeight: 'bold', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }
const checkboxStyle = { width: '18px', height: '18px', cursor: 'pointer' }
const saveBtnStyle = { color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', marginTop: '5px' }
const successBannerStyle = { backgroundColor: '#DCFCE7', color: '#15803D', padding: '10px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '10px' }
const errorBannerStyle = { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '10px' }
