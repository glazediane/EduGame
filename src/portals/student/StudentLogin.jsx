import React, { useState } from 'react'

export default function StudentLogin({ onLoginSuccess }) {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost/edugame_api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId, password, role: 'student' })
      })
      const data = await res.json()
      if (data.success) {
        onLoginSuccess(data.user)
      } else {
        setError(data.message || 'Invalid student credentials')
      }
    } catch (err) {
      setError('Server error. Please ensure XAMPP is running.')
    }
  }

  return (
    <div style={formContainerStyle}>
      <div style={portalBadgeStyle}>
        <span>🎓</span> Student Access
      </div>

      {error && <div style={errorMessageStyle}>{error}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Student ID Number</label>
          <input
            type="text"
            placeholder="e.g. 20222794"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <button type="submit" style={submitBtnStyle}>
          Access Learning Portal
        </button>
      </form>
    </div>
  )
}

const formContainerStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const portalBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: 'rgba(2, 132, 199, 0.15)',
  color: '#38bdf8',
  border: '1px solid rgba(56, 189, 248, 0.3)',
  fontSize: '12px',
  fontWeight: '700',
  marginBottom: '20px'
}

const formStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px'
}

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  textAlign: 'left'
}

const labelStyle = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#e2e8f0',
  letterSpacing: '-0.01em'
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  fontSize: '14px',
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  boxSizing: 'border-box'
}

const submitBtnStyle = {
  marginTop: '8px',
  width: '100%',
  padding: '14px',
  borderRadius: '10px',
  border: 'none',
  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
}

const errorMessageStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  backgroundColor: 'rgba(239, 68, 68, 0.2)',
  color: '#fca5a5',
  border: '1px solid rgba(239, 68, 68, 0.4)',
  fontSize: '12px',
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: '16px'
}