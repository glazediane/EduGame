import React, { useState } from 'react'

export default function TeacherLogin({ onLoginSuccess }) {
  const [teacherId, setTeacherId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const lockedOut = /locked|multiple failed attempts|request unlock token|contact admin/i.test(error)
  const unlockToken = /unlock token is:\s*([A-Z0-9]+)/i.exec(error)?.[1] || null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/edugame_api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: teacherId, password, role: 'teacher' })
      })
      const data = await res.json()

      if (data.success) {
        window.setTimeout(() => {
          onLoginSuccess(data.user)
        }, 800)
        return
      }

      const message = data.unlockToken
        ? `Account locked due to multiple failed attempts. Your unlock token is: ${data.unlockToken}. Bring it to the ISAO office.`
        : (data.message || 'Invalid teacher credentials')

      setError(message)
      if (data.unlockToken) {
        window.alert(`Your unlock token is: ${data.unlockToken}\nBring it to the ISAO office for admin release.`)
      }
    } catch (err) {
      setError('Server connection error.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={formContainerStyle}>
      <div style={{ ...portalBadgeStyle, backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.3)' }}>
        <span>🏫</span> Faculty Access
      </div>

      {error && <div style={errorMessageStyle}>{error}</div>}

      {unlockToken && (
        <div style={tokenBoxStyle}>
          <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fef3c7', fontWeight: 700 }}>
            Unlock Token
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>
            {unlockToken}
          </div>
        </div>
      )}

      {lockedOut && (
        <button
          type="button"
          onClick={() => window.location.href = '/request-unlock.html'}
          style={contactBtnStyle}
        >
          Request Unlock Token
        </button>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Teacher / Employee ID</label>
          <input
            type="text"
            placeholder="Enter your teacher ID"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
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
          {isLoading ? 'Signing In...' : 'Access Faculty Dashboard'}
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

const tokenBoxStyle = {
  width: '100%',
  marginBottom: '16px',
  padding: '14px 16px',
  borderRadius: '12px',
  background: 'rgba(251, 191, 36, 0.12)',
  border: '1px solid rgba(251, 191, 36, 0.35)',
  textAlign: 'center',
  boxShadow: '0 8px 22px rgba(251, 191, 36, 0.08)'
}

const contactBtnStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(125, 211, 252, 0.6)',
  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(59, 130, 246, 0.12))',
  color: '#e0f2fe',
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer',
  marginBottom: '14px'
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