import { useState } from 'react'
import { apiFetch } from '../../api'

export default function AdminSettings({ user, onLogout }) {
  const safeUser = user || {}
  const safeUserId = safeUser.userId || ''
  const safeUserName = safeUser.fullName || safeUser.name || 'Administrator'

  const [maxAttempts, setMaxAttempts] = useState(3)
  const [autoLock, setAutoLock] = useState(true)
  const [apiEndpoint, setApiEndpoint] = useState('/edugame_api/')
  const [message, setMessage] = useState('')
  const [unlockUserId, setUnlockUserId] = useState('')
  const [unlockRole, setUnlockRole] = useState('student')
  const [unlockReason, setUnlockReason] = useState('')
  const [unlockTokenInput, setUnlockTokenInput] = useState('')
  const [adminTokenInput, setAdminTokenInput] = useState('')
  const [tokenLookupLoading, setTokenLookupLoading] = useState(false)

  const handleFetchUnlockToken = async () => {
    if (!unlockUserId || !unlockRole) {
      setMessage('⚠️ Enter a user ID and select a role first.')
      return
    }

    setTokenLookupLoading(true)
    setMessage('')

    try {
      const res = await apiFetch(`${apiEndpoint}get_unlock_token.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: unlockUserId, role: unlockRole })
      })

      if (res && res.success && res.unlockToken) {
        setUnlockTokenInput(res.unlockToken)
        setMessage('✅ Unlock token loaded for this user.')
      } else {
        setUnlockTokenInput('')
        setMessage('⚠️ ' + (res?.message || 'No active unlock token found.'))
      }
    } catch (err) {
      setMessage('Error: ' + err.message)
    } finally {
      setTokenLookupLoading(false)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    setMessage('✅ Settings updated successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#0f172a' }}>⚙️ Admin System Settings</h3>
        <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>
          Configure global system security, connection parameters, and administrative controls.
        </p>
      </div>

      {message && <div style={successBannerStyle}>{message}</div>}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Administrator Profile Card */}
        <div style={sectionCardStyle}>
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
        </div>

        {/* Security & Access Policy Settings */}
        <div style={sectionCardStyle}>
          <h4 style={sectionHeaderStyle}>🔒 Security & Attempt Lock Policy</h4>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Max Failed Login Attempts</label>
              <select 
                value={maxAttempts} 
                onChange={(e) => setMaxAttempts(Number(e.target.value))} 
                style={inputStyle}
              >
                <option value={3}>3 Attempts (Default Lock Threshold)</option>
                <option value={5}>5 Attempts</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <label style={{ ...labelStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={autoLock} 
                  onChange={(e) => setAutoLock(e.target.checked)} 
                  style={{ width: '18px', height: '18px' }}
                />
                Auto-lock accounts when attempts exceed threshold
              </label>
            </div>
          </div>
        </div>

        {/* Database & Server Settings */}
        <div style={sectionCardStyle}>
          <h4 style={sectionHeaderStyle}>💾 XAMPP & Server Configuration</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={labelStyle}>PHP / MySQL API Base URL</label>
              <input 
                type="text" 
                value={apiEndpoint} 
                onChange={(e) => setApiEndpoint(e.target.value)} 
                style={inputStyle} 
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', gap: '20px', marginTop: '5px' }}>
              <span>Database Status: <strong style={{ color: '#16A34A' }}>● Connected (edugame_db)</strong></span>
              <span>Web Server: <strong style={{ color: '#2563EB' }}>Apache / XAMPP</strong></span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button type="submit" style={saveBtnStyle}>
          💾 Save Configuration
        </button>

        {/* Simple Unlock UI Example */}
        <div style={sectionCardStyle}>
          <h4 style={sectionHeaderStyle}>🔓 Unlock User (Admin)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>User ID to Unlock</label>
              <input value={unlockUserId} onChange={(e) => setUnlockUserId(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select value={unlockRole} onChange={(e) => setUnlockRole(e.target.value)} style={inputStyle}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Reason (optional)</label>
              <input value={unlockReason} onChange={(e) => setUnlockReason(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>System Unlock Token</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input value={unlockTokenInput} onChange={(e) => setUnlockTokenInput(e.target.value)} placeholder="Paste the generated unlock token from the user" style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={handleFetchUnlockToken} disabled={tokenLookupLoading} style={{ ...saveBtnStyle, backgroundColor: '#0EA5E9', padding: '10px 14px', minWidth: '150px' }}>
                  {tokenLookupLoading ? 'Loading...' : 'Load Token'}
                </button>
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Admin Token</label>
              <input value={adminTokenInput} onChange={(e) => setAdminTokenInput(e.target.value)} placeholder="Paste admin token here" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
            <button type="button" onClick={async () => {
              try {
                if (!safeUserId) {
                  setMessage('⚠️ Administrator session is not ready yet.')
                  return
                }

                setMessage('')
                const res = await apiFetch(`${apiEndpoint}unlock_account.php`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: unlockUserId, role: unlockRole, adminToken: adminTokenInput, unlockToken: unlockTokenInput, adminUser: safeUserId, reason: unlockReason })
                })

                if (res && res.success) {
                  setMessage('✅ ' + (res.message || 'Unlocked and logged'))
                } else {
                  setMessage('⚠️ ' + (res.message || 'Failed to unlock'))
                }
              } catch (err) {
                setMessage('Error: ' + err.message)
              }
            }} style={{ ...saveBtnStyle, backgroundColor: '#16A34A' }} disabled={!safeUserId}>Unlock & Log</button>

            <button type="button" onClick={() => { setUnlockUserId(''); setUnlockRole('student'); setUnlockReason(''); setUnlockTokenInput(''); setAdminTokenInput(''); setMessage('') }} style={{ backgroundColor: '#E2E8F0', border: 'none', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer' }}>Clear</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="button" onClick={onLogout || (() => window.location.reload())} style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            🚪 Logout
          </button>
        </div>

      </form>
    </div>
  )
}

// Styling Objects
const containerStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const sectionCardStyle = { border: '1px solid #E2E8F0', padding: '20px', borderRadius: '8px', backgroundColor: '#F8FAFC' }
const sectionHeaderStyle = { margin: '0 0 15px 0', color: '#4338CA', fontSize: '1rem' }
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }
const disabledInputStyle = { ...inputStyle, backgroundColor: '#E2E8F0', color: '#64748B', cursor: 'not-allowed' }

const saveBtnStyle = { backgroundColor: '#4338CA', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', alignSelf: 'flex-start' }
const successBannerStyle = { backgroundColor: '#DCFCE7', color: '#15803D', padding: '12px', borderRadius: '6px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }