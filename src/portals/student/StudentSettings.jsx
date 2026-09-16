import { useState } from 'react'

export default function StudentSettings({ user, onLogout }) {
  const safeUser = user || {}
  const safeUserId = safeUser.userId || ''
  const safeUserName = safeUser.fullName || safeUser.name || 'Student'
  const safeGrade = safeUser.grade || 'kinder'

  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState({ text: '', isError: false })

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (!newPassword.trim()) return

    if (!safeUserId) {
      setMsg({ text: 'Student session is not ready yet.', isError: true })
      return
    }

    fetch('/edugame_api/update_password.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: safeUserId, newPassword })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMsg({ text: 'Password updated successfully!', isError: false })
          setNewPassword('')
        } else {
          setMsg({ text: data.message || 'Failed to update password.', isError: true })
        }
      })
      .catch(() => setMsg({ text: 'Error connecting to server.', isError: true }))
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ color: '#0f172a', marginTop: 0, marginBottom: '20px' }}>⚙️ Account Settings</h2>

      {/* Student Details Card */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Profile Information</h3>
        <div style={infoRowStyle}><strong>Full Name:</strong> <span>{safeUserName}</span></div>
        <div style={infoRowStyle}><strong>Student ID:</strong> <span>{safeUserId || 'N/A'}</span></div>
        <div style={infoRowStyle}><strong>Grade Level:</strong> <span>{safeGrade.toUpperCase()} (Locked)</span></div>
      </div>

      {/* Change Password Section */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Change Password</h3>
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={btnStyle}>Update Password</button>
        </form>
        {msg.text && (
          <p style={{ marginTop: '10px', color: msg.isError ? '#DC2626' : '#16A34A', fontWeight: 'bold' }}>
            {msg.text}
          </p>
        )}
      </div>

      {/* Session Management Section */}
      <div style={{ ...sectionStyle, borderBottom: 'none' }}>
        <h3 style={sectionTitleStyle}></h3>
        <button onClick={onLogout} style={logoutBtnStyle}>
          🚪 Log Out of Account
        </button>
      </div>
    </div>
  )
}

// Styling
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const sectionStyle = { paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #E2E8F0' }
const sectionTitleStyle = { color: '#1E293B', fontSize: '1.1rem', marginBottom: '12px' }
const infoRowStyle = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#334155', maxWidth: '400px' }
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', width: '250px' }
const btnStyle = { backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const logoutBtnStyle = { backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }