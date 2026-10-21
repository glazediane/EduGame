import React, { useState } from 'react'
import { getStoredSessionToken, rememberSession } from '../../session'

export default function StudentLogin({ onLoginSuccess }) {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/edugame_api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId, password, role: 'student', sessionToken: getStoredSessionToken('student', studentId) })
      })
      const data = await res.json()

      if (data.success) {
        rememberSession(data.user)
        window.setTimeout(() => {
          onLoginSuccess(data.user)
        }, 800)
        return
      }

      setError(data.message || 'Invalid student credentials')
    } catch {
      setError('Server error. Please ensure XAMPP is running.')
    } finally {
      setIsLoading(false)
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
            placeholder="Enter your student ID"
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...submitBtnStyle,
            background: isLoading
              ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
              : 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
            color: '#082f49',
            opacity: isLoading ? 0.85 : 1,
            cursor: isLoading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {isLoading && <span style={spinnerStyle} />}
          {isLoading ? 'Signing In...' : 'Access Learning Portal'}
        </button>
      </form>
    </div>
  )
}

const formContainerStyle = {
  width: '100%',
  maxWidth: '560px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const portalBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: 'rgba(2, 132, 199, 0.15)',
  color: '#38bdf8',
  border: '1px solid rgba(56, 189, 248, 0.3)',
  fontSize: '12px',
  fontWeight: '700',
  marginBottom: '20px',
  alignSelf: 'center'
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
  textAlign: 'left',
  width: '100%'
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
  border: '1px solid rgba(255, 255, 255, 0.25)',
  fontSize: '14px',
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
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
  padding: '12px 16px',
  borderRadius: '10px',
  backgroundColor: 'rgba(239, 68, 68, 0.18)',
  color: '#fca5a5',
  border: '1px solid rgba(239, 68, 68, 0.45)',
  fontSize: '14px',
  fontWeight: '700',
  textAlign: 'center',
  marginBottom: '16px',
  boxSizing: 'border-box'
}

const spinnerStyle = {
  width: '14px',
  height: '14px',
  border: '2px solid rgba(8, 47, 73, 0.35)',
  borderTop: '2px solid #082f49',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  display: 'inline-block'
}
