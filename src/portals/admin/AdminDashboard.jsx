import { useState, useEffect } from 'react'
import AdminSettings from './AdminSettings'

const gradeOptions = ['kinder', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6']

export default function AdminDashboard({ user, onLogout }) {
  const safeUser = user || {}
  const safeUserId = safeUser.userId || ''
  const safeUserName = safeUser.fullName || 'Administrator'

  const [activeTab, setActiveTab] = useState('students')
  const [students, setStudents] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [formMessage, setFormMessage] = useState({ type: '', text: '' })
  const [form, setForm] = useState({
    role: 'student',
    userId: '',
    fullName: '',
    password: '',
    grade: 'kinder',
    teacherId: ''
  })
  const [editingUser, setEditingUser] = useState(null)
  const [editSearch, setEditSearch] = useState('')
  const [editForm, setEditForm] = useState({
    userId: '',
    fullName: '',
    role: 'student',
    grade: 'kinder',
    teacherId: '',
    password: ''
  })

  const loadStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/edugame_api/get_students.php')
      const data = await res.json()
      if (data.success) {
        setStudents(data.students || [])
      }
    } catch (err) {
      console.error('Error fetching student roster:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadAllUsers = async () => {
    try {
      const res = await fetch('/edugame_api/get_all_users.php')
      const data = await res.json()
      if (data.success) {
        setAllUsers(data.users || [])
      }
    } catch (err) {
      console.error('Error fetching user directory:', err)
    }
  }

  const refreshUsers = async () => {
    await Promise.all([loadStudents(), loadAllUsers()])
  }

  useEffect(() => {
    refreshUsers()
  }, [])

  const handleUnlock = async (studentId) => {
    try {
      const res = await fetch('/edugame_api/unlock_student.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      })
      const data = await res.json()
      alert(data.message)
      loadStudents()
    } catch (err) {
      console.error('Error unlocking account:', err)
      alert('Failed to connect to server.')
    }
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setFormMessage({ type: '', text: '' })

    if (!form.userId || !form.fullName || !form.password) {
      setFormMessage({ type: 'error', text: 'Please fill in User ID, Full Name, and Password.' })
      return
    }

    try {
      const payload = {
        userId: form.userId.trim(),
        fullName: form.fullName.trim(),
        password: form.password.trim(),
        role: form.role,
        grade: form.role === 'admin' ? 'kinder' : form.grade,
        teacherId: form.role === 'student' ? form.teacherId.trim() : ''
      }

      const res = await fetch('/edugame_api/add_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.success) {
        setFormMessage({ type: 'success', text: data.message || 'Account created successfully.' })
        setForm({ role: 'student', userId: '', fullName: '', password: '', grade: 'kinder', teacherId: '' })
        refreshUsers()
      } else {
        setFormMessage({ type: 'error', text: data.message || 'Unable to create account.' })
      }
    } catch (err) {
      console.error('Error creating account:', err)
      setFormMessage({ type: 'error', text: 'Server connection failed while creating the account.' })
    }
  }

  const handleDeleteUser = async (account) => {
    const confirmed = window.confirm(`Remove ${account.fullName || account.userId} from the ${account.role} list?`)
    if (!confirmed) return

    try {
      const res = await fetch('/edugame_api/delete_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: account.userId, role: account.role })
      })

      const data = await res.json()
      alert(data.message || 'User removed.')
      refreshUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Failed to remove user from server.')
    }
  }

  const handleShowToken = async (account) => {
    if (!account?.userId || !account?.role) {
      alert('User identity is missing.')
      return
    }

    try {
      const res = await fetch('/edugame_api/get_unlock_token.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: account.userId, role: account.role })
      })

      const data = await res.json()
      if (data.success && data.unlockToken) {
        alert(`Active unlock token for ${account.fullName || account.userId}: ${data.unlockToken}`)
      } else {
        alert(data.message || 'No active unlock token found for this user.')
      }
    } catch (err) {
      console.error('Error fetching unlock token:', err)
      alert('Unable to fetch the unlock token right now.')
    }
  }

  const startEdit = (account) => {
    const normalizedRole = String(account?.role || 'student').toLowerCase()
    setEditingUser(account)
    setEditSearch(account.userId || '')
    setEditForm({
      userId: account.userId,
      fullName: account.fullName || '',
      role: normalizedRole === 'administrator' ? 'admin' : normalizedRole,
      grade: account.grade && account.grade !== 'N/A' ? account.grade : 'kinder',
      teacherId: account.teacherId || '',
      password: ''
    })
  }

  const handleSearchEditUser = () => {
    const term = editSearch.trim()
    if (!term) {
      alert('Enter a user ID or name to search.')
      return
    }

    const match = (allUsers || []).find(account => {
      const userId = (account.userId || '').toLowerCase()
      const fullName = (account.fullName || '').toLowerCase()
      return userId === term.toLowerCase() || fullName.includes(term.toLowerCase())
    })

    if (!match) {
      alert('No matching student or teacher found.')
      return
    }

    startEdit(match)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()

    try {
      const normalizedRole = String(editForm.role || 'student').toLowerCase()
      const payload = {
        userId: editForm.userId,
        oldRole: String(editingUser?.role || editForm.role || 'student').toLowerCase(),
        role: normalizedRole === 'administrator' ? 'admin' : normalizedRole,
        fullName: editForm.fullName.trim(),
        grade: normalizedRole === 'admin' ? 'kinder' : editForm.grade,
        teacherId: normalizedRole === 'student' ? editForm.teacherId.trim() : '',
        password: editForm.password.trim()
      }

      if (!payload.userId || !payload.fullName) {
        alert('User ID and full name are required.')
        return
      }

      const res = await fetch('/edugame_api/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      alert(data.message || 'Profile updated.')
      setEditingUser(null)
      refreshUsers()
    } catch (err) {
      console.error('Error updating user:', err)
      alert('Failed to update user.')
    }
  }

  const filteredStudents = students.filter(s =>
    (s.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const teacherDirectory = (allUsers || [])
    .filter(account => account.role === 'teacher')
    .filter(account =>
      (account.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.grade || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

  const userDirectory = (allUsers || []).filter(account => account.role !== 'admin')
    .filter(account =>
      (account.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Segoe UI, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', color: 'white', padding: '15px 30px', boxShadow: '0 4px 10px rgba(14,165,233,0.2)' }}>
        <div>
          <h2 style={{ margin: 0 }}>⚙️ Admin Control Center</h2>
          <small>Logged in as: <strong>{safeUserName}</strong> (ID: {safeUserId || 'Loading...'})</small>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('students')} style={activeTab === 'students' ? activeTabStyle : navBtnStyle}>🏫 Student Directory</button>
          <button onClick={() => setActiveTab('teachers')} style={activeTab === 'teachers' ? activeTabStyle : navBtnStyle}>🧑‍🏫 Teacher Directory</button>
          <button onClick={() => setActiveTab('manage')} style={activeTab === 'manage' ? activeTabStyle : navBtnStyle}>🛠️ Manage Accounts</button>
          <button onClick={() => setActiveTab('settings')} style={activeTab === 'settings' ? activeTabStyle : navBtnStyle}>⚙️ System Settings</button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {activeTab === 'students' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>🏫 Master Student Directory</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>View all registered student accounts, IDs, grade levels, and security states.</p>
              </div>

              <input
                type="text"
                placeholder="🔍 Search by Name or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={searchInputStyle}
              />
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>Loading student records...</p>
            ) : filteredStudents.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>No student accounts found.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                    <th style={thStyle}>School ID</th>
                    <th style={thStyle}>Student Full Name</th>
                    <th style={thStyle}>Grade Level</th>
                    <th style={thStyle}>Account Security</th>
                    <th style={thStyle}>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>{student.id}</td>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}><span style={gradeBadgeStyle}>{student.grade ? student.grade.toUpperCase() : 'KINDER'}</span></td>
                      <td style={tdStyle}>{student.locked ? <span style={lockedBadgeStyle}>🔒 Locked</span> : <span style={activeBadgeStyle}>✅ Active</span>}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {student.locked && (
                            <>
                              <button onClick={() => handleShowToken({ userId: student.id, role: 'student', fullName: student.name })} style={tokenBtnStyle}>Show Active Token</button>
                              <button onClick={() => handleUnlock(student.id)} style={unlockBtnStyle}>🔓 Unlock Student</button>
                            </>
                          )}
                          {!student.locked && <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No action required</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'teachers' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>🧑‍🏫 Teacher Directory</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Manage teacher profiles, class assignment, and access records.</p>
              </div>

              <input
                type="text"
                placeholder="🔍 Search teacher..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={searchInputStyle}
              />
            </div>

            {teacherDirectory.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>No teacher records found.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                    <th style={thStyle}>Teacher ID</th>
                    <th style={thStyle}>Full Name</th>
                    <th style={thStyle}>Grade / Track</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherDirectory.map(account => (
                    <tr key={`teacher-${account.userId}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>{account.userId}</td>
                      <td style={tdStyle}>{account.fullName}</td>
                      <td style={tdStyle}><span style={gradeBadgeStyle}>{(account.grade && account.grade !== 'N/A') ? account.grade.toUpperCase() : 'ALL GRADES'}</span></td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={account.isLocked ? lockedBadgeStyle : activeBadgeStyle}>{account.isLocked ? '🔒 Locked' : '✅ Active'}</span>
                          {account.isLocked && <button onClick={() => handleShowToken(account)} style={tokenBtnStyle}>Show Token</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 15px 0', color: '#1E293B' }}>🧑‍🏫 Add New Student or Teacher</h3>

              {formMessage.text && (
                <div style={{ marginBottom: '15px', padding: '10px 12px', borderRadius: '8px', backgroundColor: formMessage.type === 'success' ? '#DCFCE7' : '#FEE2E2', color: formMessage.type === 'success' ? '#166534' : '#991B1B', fontWeight: '700' }}>
                  {formMessage.text}
                </div>
              )}

              <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select value={form.role} onChange={e => handleInputChange('role', e.target.value)} style={inputStyle}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>User ID</label>
                  <input value={form.userId} onChange={e => handleInputChange('userId', e.target.value)} style={inputStyle} placeholder="e.g. STU1001" />
                </div>

                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input value={form.fullName} onChange={e => handleInputChange('fullName', e.target.value)} style={inputStyle} placeholder="Juan Dela Cruz" />
                </div>

                <div>
                  <label style={labelStyle}>Password</label>
                  <input type="password" value={form.password} onChange={e => handleInputChange('password', e.target.value)} style={inputStyle} placeholder="Set a password" />
                </div>

                {form.role !== 'admin' && (
                  <div>
                    <label style={labelStyle}>Grade</label>
                    <select value={form.grade} onChange={e => handleInputChange('grade', e.target.value)} style={inputStyle}>
                      {gradeOptions.map(grade => (
                        <option key={grade} value={grade}>{grade.replace('grade', 'Grade ')}</option>
                      ))}
                    </select>
                  </div>
                )}

                {form.role === 'student' && (
                  <div>
                    <label style={labelStyle}>Assigned Teacher ID</label>
                    <input value={form.teacherId} onChange={e => handleInputChange('teacherId', e.target.value)} style={inputStyle} placeholder="Optional teacher ID" />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'end' }}>
                  <button type="submit" style={primaryBtnStyle}>Add Account</button>
                </div>
              </form>
            </div>

            {editingUser && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1E293B' }}>✏️ Edit Account</h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <input
                    value={editSearch}
                    onChange={e => setEditSearch(e.target.value)}
                    placeholder="Search by User ID or Name"
                    style={{ ...inputStyle, maxWidth: '300px' }}
                  />
                  <button type="button" onClick={handleSearchEditUser} style={primaryBtnStyle}>Search User</button>
                </div>

                <form onSubmit={handleSaveEdit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Role</label>
                    <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} style={inputStyle}>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>User ID</label>
                    <input value={editForm.userId} disabled style={{ ...inputStyle, backgroundColor: '#E2E8F0', color: '#475569', cursor: 'not-allowed' }} />
                  </div>

                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} style={inputStyle} />
                  </div>

                  {editForm.role !== 'admin' && (
                    <div>
                      <label style={labelStyle}>Grade</label>
                      <select value={editForm.grade} onChange={e => setEditForm({ ...editForm, grade: e.target.value })} style={inputStyle}>
                        {gradeOptions.map(grade => (
                          <option key={grade} value={grade}>{grade.replace('grade', 'Grade ')}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {editForm.role === 'student' && (
                    <div>
                      <label style={labelStyle}>Assigned Teacher ID</label>
                      <input value={editForm.teacherId} onChange={e => setEditForm({ ...editForm, teacherId: e.target.value })} style={inputStyle} placeholder="Optional teacher ID" />
                    </div>
                  )}

                  <div>
                    <label style={labelStyle}>New Password (optional)</label>
                    <input type="password" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} style={inputStyle} placeholder="Leave blank to keep current password" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'end', gap: '10px' }}>
                    <button type="submit" style={primaryBtnStyle}>Save Changes</button>
                    <button type="button" onClick={() => setEditingUser(null)} style={secondaryBtnStyle}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1E293B' }}>📋 Remove Existing Student & Teacher Records</h3>
                <input
                  type="text"
                  placeholder="Search user list..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={searchInputStyle}
                />
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>User ID</th>
                    <th style={thStyle}>Full Name</th>
                    <th style={thStyle}>Grade</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userDirectory.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>No student or teacher records found.</td>
                    </tr>
                  ) : (
                    userDirectory.map(account => (
                      <tr key={`${account.role}-${account.userId}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={tdStyle}><span style={{ ...roleBadgeStyle, background: account.role === 'student' ? '#DBEAFE' : '#DCFCE7' }}>{account.role}</span></td>
                        <td style={tdStyle}>{account.userId}</td>
                        <td style={tdStyle}>{account.fullName}</td>
                        <td style={tdStyle}>{account.grade && account.grade !== 'N/A' ? account.grade.toUpperCase() : 'N/A'}</td>
                        <td style={tdStyle}><span style={account.isLocked ? lockedBadgeStyle : activeBadgeStyle}>{account.isLocked ? '🔒 Locked' : '✅ Active'}</span></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {account.isLocked && <button onClick={() => handleShowToken(account)} style={tokenBtnStyle}>Show Token</button>}
                            <button onClick={() => handleDeleteUser(account)} style={deleteBtnStyle}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && <AdminSettings user={safeUser} onLogout={onLogout} />}
      </div>
    </div>
  )
}

const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const navBtnStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(224,242,254,0.4)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const activeTabStyle = { background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', color: '#075985', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const logoutBtnStyle = { backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const searchInputStyle = { padding: '10px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '250px', fontSize: '0.9rem' }
const thStyle = { padding: '12px', fontSize: '0.85rem', color: '#64748B' }
const tdStyle = { padding: '12px', fontSize: '0.9rem', color: '#334155' }
const labelStyle = { display: 'block', marginBottom: '6px', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }
const primaryBtnStyle = { backgroundColor: '#0EA5E9', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
const secondaryBtnStyle = { backgroundColor: '#E2E8F0', color: '#0F172A', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
const editBtnStyle = { backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const deleteBtnStyle = { backgroundColor: '#DC2626', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const unlockBtnStyle = { backgroundColor: '#4338CA', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const tokenBtnStyle = { backgroundColor: '#F59E0B', color: '#ffffff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }
const gradeBadgeStyle = { backgroundColor: '#E0E7FF', color: '#3730A3', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }
const lockedBadgeStyle = { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const activeBadgeStyle = { backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const roleBadgeStyle = { padding: '4px 8px', borderRadius: '999px', fontSize: '0.72rem', textTransform: 'capitalize', fontWeight: 'bold', color: '#0F172A' }