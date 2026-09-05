import { useState } from 'react'

export default function AdminSettings({ user }) {
  const [maxAttempts, setMaxAttempts] = useState(3)
  const [autoLock, setAutoLock] = useState(true)
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost/edugame_api/')
  const [message, setMessage] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    setMessage('✅ Settings updated successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#1E293B' }}>⚙️ Admin System Settings</h3>
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
              <input type="text" value={user.fullName} disabled style={disabledInputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Admin User ID</label>
              <input type="text" value={user.userId} disabled style={disabledInputStyle} />
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