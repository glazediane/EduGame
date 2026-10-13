import { useEffect, useRef, useState } from 'react'
import AdminSettings from './AdminSettings'
import ReportAnalytics from '../shared/ReportAnalytics'

const gradeOptions = ['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6']

export default function AdminDashboard({ user, onLogout }) {
  const safeUser = user || {}
  const safeUserId = safeUser.userId || ''
  const safeUserName = safeUser.fullName || 'Administrator'

  const [activeTab, setActiveTab] = useState('students')
  const [students, setStudents] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedLeaderboardGrade, setSelectedLeaderboardGrade] = useState('all')
  const [leaderboardData, setLeaderboardData] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)
  const [formMessage, setFormMessage] = useState({ type: '', text: '' })
  const [teacherFormMessage, setTeacherFormMessage] = useState({ type: '', text: '' })
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [editStudentForm, setEditStudentForm] = useState({ userId: '', fullName: '', password: '' })
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ userId: '', fullName: '', role: 'student', grade: 'grade1', teacherId: '', password: '' })
  const [studentForm, setStudentForm] = useState({ role: 'student', userId: '', fullName: '', password: '', grade: 'grade1', teacherId: '' })
  const [teacherForm, setTeacherForm] = useState({ userId: '', firstName: '', lastName: '', password: '', grade: 'grade1' })
  const importStudentInputRef = useRef(null)

  const normalizeGrade = (value) => {
    const text = String(value || '').trim().toLowerCase().replace(/[_\s]+/g, ' ')
    if (!text) return 'grade1'
    const match = text.match(/grade\s*(\d+)/)
    if (match) return `grade${match[1]}`
    const numberMatch = text.match(/(\d+)/)
    if (numberMatch) return `grade${numberMatch[1]}`
    return 'grade1'
  }

  const parseCsvLine = (line) => {
    const values = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i += 1
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    return values
  }

  const getAccountState = (account = {}) => {
    const isDeactivated = Boolean(account.isDeactivated ?? account.isLocked ?? account.locked ?? false)
    const isTemporarilyLocked = Boolean(account.isTemporarilyLocked ?? account.isTempLocked ?? account.tempLocked ?? false)
    return { isDeactivated, isTemporarilyLocked }
  }

  const loadStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/edugame_api/get_students.php')
      const data = await res.json()
      setStudents(data.success ? (data.students || []) : [])
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const loadAllUsers = async () => {
    try {
      const res = await fetch('/edugame_api/get_all_users.php')
      const data = await res.json()
      setAllUsers(data.success ? (data.users || []) : [])
    } catch (error) {
      console.error('Error fetching all users:', error)
      setAllUsers([])
    }
  }

  const refreshUsers = async () => {
    await Promise.all([loadStudents(), loadAllUsers()])
  }

  useEffect(() => {
    refreshUsers()
  }, [])

  useEffect(() => {
    if (activeTab !== 'leaderboard') return
    const fetchLeaderboard = async () => {
      setLeaderboardLoading(true)
      try {
        const res = await fetch('/edugame_api/get_leaderboard.php?role=admin')
        const data = await res.json()
        setLeaderboardData(data.success ? (data.leaderboard || []) : [])
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setLeaderboardData([])
      } finally {
        setLeaderboardLoading(false)
      }
    }
    fetchLeaderboard()
  }, [activeTab])

  const handleExportStudentTemplate = () => {
    const csv = 'User ID,First Name,Last Name,Grade\n20222794,Juan,Dela Cruz,Grade 1\nSTU1002,Maria,Santos,Grade 2\n'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'admin_student_import_template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportStudents = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter(Boolean)
      if (lines.length < 2) {
        setFormMessage({ type: 'error', text: 'The import file is empty or has no student records.' })
        event.target.value = ''
        return
      }

      const headers = parseCsvLine(lines[0]).map((value) => value.toLowerCase().replace(/[^a-z]/g, ''))
      const userIndex = headers.findIndex((header) => ['userid', 'studentid', 'id'].includes(header))
      const firstIndex = headers.findIndex((header) => ['firstname', 'first_name', 'first name', 'givenname', 'given_name'].includes(header))
      const lastIndex = headers.findIndex((header) => ['lastname', 'last_name', 'last name', 'surname', 'familyname'].includes(header))
      const gradeIndex = headers.findIndex((header) => ['grade', 'gradelevel', 'level'].includes(header))

      if (userIndex === -1 || firstIndex === -1 || lastIndex === -1) {
        setFormMessage({ type: 'error', text: 'CSV template must include User ID, First Name, and Last Name columns.' })
        event.target.value = ''
        return
      }

      const defaultPassword = window.prompt('Enter the default password for all imported students:', '')
      if (!defaultPassword || !defaultPassword.trim()) {
        setFormMessage({ type: 'error', text: 'Default password is required to import student accounts.' })
        event.target.value = ''
        return
      }

      let created = 0
      let failed = 0
      for (let i = 1; i < lines.length; i += 1) {
        const values = parseCsvLine(lines[i])
        const userId = (values[userIndex] || '').trim()
        const firstName = (values[firstIndex] || '').trim()
        const lastName = (values[lastIndex] || '').trim()
        const gradeFromRow = (values[gradeIndex] || '').trim()

        if (!userId || !firstName || !lastName) {
          failed += 1
          continue
        }

        const resolvedGrade = (() => {
          const text = String(gradeFromRow || selectedGrade || 'grade1').trim().toLowerCase()
          const match = text.match(/grade\s*(\d+)/)
          if (match) return `grade${match[1]}`
          const numberMatch = text.match(/(\d+)/)
          if (numberMatch) return `grade${numberMatch[1]}`
          return selectedGrade === 'all' ? 'grade1' : selectedGrade
        })()

        const response = await fetch('/edugame_api/add_user.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, fullName: `${firstName} ${lastName}`.trim(), password: defaultPassword.trim(), role: 'student', grade: resolvedGrade, teacherId: '' })
        })

        const data = await response.json()
        if (data.success) created += 1
        else failed += 1
      }

      await refreshUsers()
      setFormMessage({
        type: created > 0 ? 'success' : 'error',
        text: created > 0 ? `Imported ${created} student account(s). ${failed > 0 ? `${failed} failed.` : ''}` : 'No student accounts were imported.'
      })
    } catch (error) {
      console.error('Import students failed:', error)
      setFormMessage({ type: 'error', text: 'Unable to import the student file. Please check the CSV format.' })
    } finally {
      event.target.value = ''
    }
  }

  const handleAddUser = async (event) => {
    event.preventDefault()
    setFormMessage({ type: '', text: '' })

    if (!studentForm.userId || !studentForm.fullName || !studentForm.password) {
      setFormMessage({ type: 'error', text: 'Please fill in User ID, Full Name, and Password.' })
      return
    }

    try {
      const response = await fetch('/edugame_api/add_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: studentForm.userId.trim(),
          fullName: studentForm.fullName.trim(),
          password: studentForm.password.trim(),
          role: studentForm.role,
          grade: studentForm.role === 'admin' ? 'grade1' : studentForm.grade,
          teacherId: studentForm.role === 'student' ? studentForm.teacherId.trim() : ''
        })
      })

      const data = await response.json()
      if (data.success) {
        setFormMessage({ type: 'success', text: data.message || 'Account created successfully.' })
        setStudentForm({ role: 'student', userId: '', fullName: '', password: '', grade: 'grade1', teacherId: '' })
        refreshUsers()
      } else {
        setFormMessage({ type: 'error', text: data.message || 'Unable to create account.' })
      }
    } catch (error) {
      console.error('Error creating account:', error)
      setFormMessage({ type: 'error', text: 'Server connection failed while creating the account.' })
    }
  }

  const handleAddTeacher = async (event) => {
    event.preventDefault()
    setTeacherFormMessage({ type: '', text: '' })

    const firstName = teacherForm.firstName.trim()
    const lastName = teacherForm.lastName.trim()
    if (!teacherForm.userId || !firstName || !lastName || !teacherForm.password) {
      setTeacherFormMessage({ type: 'error', text: 'Please fill in User ID, First Name, Last Name, and Password to proceed.' })
      return
    }

    try {
      const response = await fetch('/edugame_api/add_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: teacherForm.userId.trim(),
          fullName: `${firstName} ${lastName}`.trim(),
          password: teacherForm.password.trim(),
          role: 'teacher',
          grade: teacherForm.grade || 'grade1',
          teacherId: ''
        })
      })

      const data = await response.json()
      if (data.success) {
        setTeacherFormMessage({ type: 'success', text: data.message || 'Teacher account created successfully.' })
        setTeacherForm({ userId: '', firstName: '', lastName: '', password: '', grade: 'grade1' })
        refreshUsers()
      } else {
        setTeacherFormMessage({ type: 'error', text: data.message || 'Unable to create teacher account.' })
      }
    } catch (error) {
      console.error('Error creating teacher:', error)
      setTeacherFormMessage({ type: 'error', text: 'Server connection failed while creating the teacher account.' })
    }
  }

  const handleDeactivateAccount = async (account) => {
    const confirmed = window.confirm(`Deactivate this ${account.role || 'account'} account?`)
    if (!confirmed) return

    try {
      const response = await fetch('/edugame_api/toggle_lock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: account.userId || account.id, role: (account.role || 'student').toLowerCase(), isLocked: 1 })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Account deactivated successfully.')
        refreshUsers()
      } else {
        alert(data.message || 'Failed to deactivate the account.')
      }
    } catch (error) {
      console.error('Error deactivating account:', error)
      alert('Server connection failed while deactivating the account.')
    }
  }

  const handleReactivateAccount = async (account) => {
    const confirmed = window.confirm(`Reactivate this ${account.role || 'account'} account?`)
    if (!confirmed) return

    try {
      const response = await fetch('/edugame_api/toggle_lock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: account.userId || account.id, role: (account.role || 'student').toLowerCase(), isLocked: 0 })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Account reactivated successfully.')
        refreshUsers()
      } else {
        alert(data.message || 'Failed to reactivate the account.')
      }
    } catch (error) {
      console.error('Error reactivating account:', error)
      alert('Server connection failed while reactivating the account.')
    }
  }

  const handleUnlockAccount = async (account) => {
    const confirmed = window.confirm(`Unlock this ${account.role || 'account'} account?`)
    if (!confirmed) return

    try {
      const response = await fetch('/edugame_api/toggle_lock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: account.userId || account.id, role: (account.role || 'student').toLowerCase(), isLocked: 0 })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Account unlocked successfully.')
        refreshUsers()
      } else {
        alert(data.message || 'Failed to unlock the account.')
      }
    } catch (error) {
      console.error('Error unlocking account:', error)
      alert('Server connection failed while unlocking the account.')
    }
  }

  const openEditStudent = (student) => {
    setEditingStudentId(student.id)
    setEditStudentForm({ userId: student.id || '', fullName: student.name || '', password: '' })
  }

  const handleSaveStudentEdit = async () => {
    if (!editingStudentId) return

    const fullName = editStudentForm.fullName.trim()
    if (!fullName || fullName.split(/\s+/).length < 2) {
      alert('Please enter both the first name and last name to continue.')
      return
    }

    const userId = editStudentForm.userId.trim()
    if (!userId) {
      alert('Student ID is required.')
      return
    }

    try {
      const response = await fetch('/edugame_api/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editingStudentId, newUserId: userId, oldRole: 'student', role: 'student', fullName, grade: 'grade1', teacherId: safeUserId, password: editStudentForm.password.trim() })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Student account updated successfully.')
        setEditingStudentId(null)
        setEditStudentForm({ userId: '', fullName: '', password: '' })
        refreshUsers()
      } else {
        alert(data.message || 'Failed to update student account.')
      }
    } catch (error) {
      console.error('Error editing student account:', error)
      alert('Server connection failed while updating the student account.')
    }
  }

  const startEdit = (account) => {
    setEditingUser(account)
    setEditForm({
      userId: account.userId || '',
      fullName: account.fullName || '',
      role: String(account.role || 'student').toLowerCase() === 'administrator' ? 'admin' : String(account.role || 'student').toLowerCase(),
      grade: account.grade && account.grade !== 'N/A' ? account.grade : 'grade1',
      teacherId: account.teacherId || '',
      password: ''
    })
  }

  const handleSaveEdit = async (event) => {
    event.preventDefault()
    try {
      const role = String(editForm.role || 'student').toLowerCase()
      const payload = {
        userId: editForm.userId,
        oldRole: String(editingUser?.role || role || 'student').toLowerCase(),
        role: role === 'administrator' ? 'admin' : role,
        fullName: editForm.fullName.trim(),
        grade: role === 'admin' ? 'grade1' : editForm.grade,
        teacherId: role === 'student' ? editForm.teacherId.trim() : '',
        password: editForm.password.trim()
      }

      if (!payload.userId || !payload.fullName) {
        alert('User ID and full name are required.')
        return
      }

      const response = await fetch('/edugame_api/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      alert(data.message || 'Profile updated.')
      setEditingUser(null)
      refreshUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user.')
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesGrade = selectedGrade === 'all' || normalizeGrade(student.grade) === normalizeGrade(selectedGrade)
    const matchesSearch = (student.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || (student.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesGrade && matchesSearch
  })

  const teacherDirectory = (allUsers || []).filter((account) => account.role === 'teacher').filter((account) => {
    const search = searchTerm.toLowerCase()
    return (account.fullName || '').toLowerCase().includes(search) || (account.userId || '').toLowerCase().includes(search) || (account.grade || '').toLowerCase().includes(search)
  })

  const leaderboardRows = (leaderboardData || []).filter((entry) => {
    if (selectedLeaderboardGrade === 'all') return true
    return normalizeGrade(entry.grade) === normalizeGrade(selectedLeaderboardGrade)
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Segoe UI, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', color: 'white', padding: '15px 30px', boxShadow: '0 4px 10px rgba(14,165,233,0.2)' }}>
        <div>
          <h2 style={{ margin: 0 }}>⚙️ Admin Control Center</h2>
          <small>Logged in as: <strong>{safeUserName}</strong> (ID: {safeUserId || 'Loading...'})</small>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('students')} style={activeTab === 'students' ? activeTabStyle : navBtnStyle}>🏫 Student Directory</button>
          <button onClick={() => setActiveTab('leaderboard')} style={activeTab === 'leaderboard' ? activeTabStyle : navBtnStyle}>🏆 Leaderboard</button>
          <button onClick={() => setActiveTab('teachers')} style={activeTab === 'teachers' ? activeTabStyle : navBtnStyle}>🧑‍🏫 Teacher Directory</button>
          <button onClick={() => setActiveTab('reports')} style={activeTab === 'reports' ? activeTabStyle : navBtnStyle}>📊 Reports</button>
          <button onClick={() => setActiveTab('settings')} style={activeTab === 'settings' ? activeTabStyle : navBtnStyle}>⚙️ System Settings</button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {activeTab === 'students' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>🏫 Master Student Directory</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>View all registered student accounts, IDs, grade levels, and security states.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={handleExportStudentTemplate} style={{ ...secondaryBtnStyle, padding: '10px 16px' }}>Export Template</button>
                <button type="button" onClick={() => importStudentInputRef.current?.click()} style={{ ...primaryBtnStyle, padding: '10px 16px' }}>Import Students</button>
                <input ref={importStudentInputRef} type="file" accept=".csv" onChange={handleImportStudents} style={{ display: 'none' }} />
                <input type="text" placeholder="🔍 Search by Name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={searchInputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
              <button type="button" onClick={() => setSelectedGrade('all')} style={selectedGrade === 'all' ? { ...gradeChipStyle, ...gradeChipActiveStyle } : gradeChipStyle}>All</button>
              {gradeOptions.map((grade) => (
                <button key={grade} type="button" onClick={() => setSelectedGrade(grade)} style={selectedGrade === grade ? { ...gradeChipStyle, ...gradeChipActiveStyle } : gradeChipStyle}>{grade.replace('grade', 'Grade ')}</button>
              ))}
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>Loading student records...</p>
            ) : filteredStudents.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>No student accounts found for {selectedGrade === 'all' ? 'this view' : selectedGrade.replace('grade', 'Grade ')}.</p>
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
                  {filteredStudents.map((student) => {
                    const state = getAccountState(student)
                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{editingStudentId === student.id ? <input type="text" value={editStudentForm.userId} onChange={(e) => setEditStudentForm(prev => ({ ...prev, userId: e.target.value }))} style={inlineInputStyle} /> : student.id}</td>
                        <td style={{ ...tdStyle, textAlign: 'justify' }}>{editingStudentId === student.id ? <input type="text" value={editStudentForm.fullName} onChange={(e) => setEditStudentForm(prev => ({ ...prev, fullName: e.target.value }))} style={inlineInputStyle} /> : student.name}</td>
                        <td style={tdStyle}><span style={gradeBadgeStyle}>{student.grade ? student.grade.toUpperCase() : 'GRADE 1'}</span></td>
                        <td style={tdStyle}>
                          {!state.isDeactivated && !state.isTemporarilyLocked && <span style={activeBadgeStyle}>✅ Active</span>}
                          {state.isDeactivated && !state.isTemporarilyLocked && <span style={deactivatedBadgeStyle}>🚫 Deactivated</span>}
                          {!state.isDeactivated && state.isTemporarilyLocked && <span style={lockedBadgeStyle}>🔒 Locked</span>}
                          {state.isDeactivated && state.isTemporarilyLocked && <span style={combinedBadgeStyle}>🚫 Deactivated & Locked</span>}
                        </td>
                        <td style={tdStyle}>
                          {editingStudentId === student.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <input type="text" value={editStudentForm.password} onChange={(e) => setEditStudentForm(prev => ({ ...prev, password: e.target.value }))} placeholder="New password (optional)" style={inlineInputStyle} />
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={handleSaveStudentEdit} style={editBtnStyle}>Save</button>
                                <button onClick={() => setEditingStudentId(null)} style={secondaryBtnStyle}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button onClick={() => openEditStudent(student)} style={editBtnStyle}>Edit</button>
                              {state.isDeactivated && <button onClick={() => handleReactivateAccount({ userId: student.id, role: 'student' })} style={reactiveBtnStyle}>Reactivate Account</button>}
                              {state.isTemporarilyLocked && <button onClick={() => handleUnlockAccount({ userId: student.id, role: 'student' })} style={unlockBtnStyle}>Unlock Account</button>}
                              {!state.isDeactivated && !state.isTemporarilyLocked && <button onClick={() => handleDeactivateAccount({ userId: student.id, role: 'student' })} style={deactivateBtnStyle}>Deactivate Account</button>}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '18px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>🏆 School Leaderboard</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Full school rankings across all grade levels.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
              <button type="button" onClick={() => setSelectedLeaderboardGrade('all')} style={selectedLeaderboardGrade === 'all' ? { ...gradeChipStyle, ...gradeChipActiveStyle } : gradeChipStyle}>All</button>
              {gradeOptions.map((grade) => (
                <button key={grade} type="button" onClick={() => setSelectedLeaderboardGrade(grade)} style={selectedLeaderboardGrade === grade ? { ...gradeChipStyle, ...gradeChipActiveStyle } : gradeChipStyle}>{grade.replace('grade', 'Grade ')}</button>
              ))}
            </div>

            {leaderboardLoading ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Loading leaderboard...</p>
            ) : leaderboardRows.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No leaderboard data found for {selectedLeaderboardGrade === 'all' ? 'the school' : selectedLeaderboardGrade.replace('grade', 'Grade ')}.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                    <th style={thStyle}>Rank</th>
                    <th style={thStyle}>Student Name</th>
                    <th style={thStyle}>Grade Level</th>
                    <th style={thStyle}>Total Score</th>
                    <th style={thStyle}>Best Level</th>
                    <th style={thStyle}>Subjects Played</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardRows.map((entry, index) => (
                    <tr key={`${entry.userId}-${entry.grade}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>#{index + 1}</td>
                      <td style={tdStyle}>{entry.name || entry.userId}</td>
                      <td style={tdStyle}><span style={gradeBadgeStyle}>{String(entry.grade || 'grade1').toUpperCase()}</span></td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0EA5E9' }}>{entry.totalScore || 0} pts</td>
                      <td style={tdStyle}>Level {entry.bestLevel || 0}</td>
                      <td style={tdStyle}>{entry.subjectsPlayed || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'teachers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ ...cardStyle, padding: '28px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <span style={{ fontSize: '22px' }}>👩‍🏫</span>
                <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1f2937' }}>Add New Teacher</h3>
              </div>

              <form onSubmit={handleAddTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Role</label>
                    <input type="text" value="Teacher" readOnly style={{ ...inputStyle, backgroundColor: '#e5e7eb', cursor: 'not-allowed' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Teacher ID</label>
                    <input type="text" value={teacherForm.userId} onChange={(e) => setTeacherForm(prev => ({ ...prev, userId: e.target.value }))} placeholder="e.g. TCH1001" style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>First Name</label>
                    <input type="text" value={teacherForm.firstName} onChange={(e) => setTeacherForm(prev => ({ ...prev, firstName: e.target.value }))} placeholder="Maria" style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Last Name</label>
                    <input type="text" value={teacherForm.lastName} onChange={(e) => setTeacherForm(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Dela Cruz" style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Password</label>
                    <input type="text" value={teacherForm.password} onChange={(e) => setTeacherForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Set a password" style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Assigned Grade</label>
                    <select value={teacherForm.grade} onChange={(e) => setTeacherForm(prev => ({ ...prev, grade: e.target.value }))} style={inputStyle}>
                      {gradeOptions.map((grade) => (
                        <option key={grade} value={grade}>{grade.replace('grade', 'Grade ')}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignSelf: 'flex-end', flex: '1 1 180px' }}>
                    <button type="submit" style={addTeacherBtnStyle}>Add Account</button>
                  </div>
                </div>
              </form>
              {teacherFormMessage.text && (
                <div style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: teacherFormMessage.type === 'success' ? '#dcfce7' : '#fee2e2', color: teacherFormMessage.type === 'success' ? '#166534' : '#991b1b', border: teacherFormMessage.type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5' }}>
                  {teacherFormMessage.text}
                </div>
              )}
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1E293B' }}>🧑‍🏫 Teacher Directory</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Manage teacher profiles, class assignment, and access records.</p>
                </div>
                <input type="text" placeholder="🔍 Search teacher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={searchInputStyle} />
              </div>

              {teacherDirectory.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>No teacher records found.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                      <th style={thStyle}>Teacher ID</th>
                      <th style={thStyle}>Full Name</th>
                      <th style={thStyle}>Grade Level</th>
                      <th style={thStyle}>Account Security</th>
                      <th style={thStyle}>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherDirectory.map((account) => {
                      const state = getAccountState(account)
                      const isEditingThisTeacher = editingUser && editingUser.userId === account.userId

                      return (
                        <tr key={`teacher-${account.userId}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ ...tdStyle, fontWeight: 'bold' }}>{isEditingThisTeacher ? <input type="text" value={editForm.userId} onChange={(e) => setEditForm(prev => ({ ...prev, userId: e.target.value }))} style={inlineInputStyle} /> : account.userId}</td>
                          <td style={{ ...tdStyle, textAlign: 'justify' }}>{isEditingThisTeacher ? <input type="text" value={editForm.fullName} onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))} style={inlineInputStyle} /> : account.fullName}</td>
                          <td style={tdStyle}>{isEditingThisTeacher ? <select value={editForm.grade} onChange={(e) => setEditForm(prev => ({ ...prev, grade: e.target.value }))} style={inlineInputStyle}>{gradeOptions.map((grade) => <option key={grade} value={grade}>{grade.replace('grade', 'Grade ')}</option>)}</select> : <span style={gradeBadgeStyle}>{account.grade && account.grade !== 'N/A' ? account.grade.toUpperCase() : 'ALL GRADES'}</span>}</td>
                          <td style={tdStyle}>
                            {!state.isDeactivated && !state.isTemporarilyLocked && <span style={activeBadgeStyle}>✅ Active</span>}
                            {state.isDeactivated && !state.isTemporarilyLocked && <span style={deactivatedBadgeStyle}>🚫 Deactivated</span>}
                            {!state.isDeactivated && state.isTemporarilyLocked && <span style={lockedBadgeStyle}>🔒 Locked</span>}
                            {state.isDeactivated && state.isTemporarilyLocked && <span style={combinedBadgeStyle}>🚫 Deactivated & Locked</span>}
                          </td>
                          <td style={tdStyle}>
                            {isEditingThisTeacher ? (
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={handleSaveEdit} style={editBtnStyle}>Save</button>
                                <button onClick={() => setEditingUser(null)} style={secondaryBtnStyle}>Cancel</button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={() => startEdit(account)} style={editBtnStyle}>Edit</button>
                                {state.isDeactivated && <button onClick={() => handleReactivateAccount(account)} style={reactiveBtnStyle}>Reactivate Account</button>}
                                {state.isTemporarilyLocked && <button onClick={() => handleUnlockAccount(account)} style={unlockBtnStyle}>Unlock Account</button>}
                                {!state.isDeactivated && !state.isTemporarilyLocked && <button onClick={() => handleDeactivateAccount(account)} style={deactivateBtnStyle}>Deactivate Account</button>}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && <AdminSettings user={safeUser} onLogout={onLogout} />}
        {activeTab === 'reports' && <ReportAnalytics role="admin" />}
      </div>
    </div>
  )
}

const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const navBtnStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(224,242,254,0.4)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const activeTabStyle = { background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', color: '#075985', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const searchInputStyle = { padding: '10px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '250px', fontSize: '0.9rem', color: '#0f172a', backgroundColor: '#fff' }
const thStyle = { padding: '12px', fontSize: '0.85rem', color: '#64748B' }
const tdStyle = { padding: '12px', fontSize: '0.9rem', color: '#334155' }
const gradeBadgeStyle = { backgroundColor: '#E0E7FF', color: '#3730A3', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }
const activeBadgeStyle = { backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const lockedBadgeStyle = { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const deactivatedBadgeStyle = { backgroundColor: '#E5E7EB', color: '#374151', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const combinedBadgeStyle = { backgroundColor: '#FDE68A', color: '#92400E', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const gradeChipStyle = { backgroundColor: '#E0F2FE', color: '#075985', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold' }
const gradeChipActiveStyle = { backgroundColor: '#0EA5E9', color: '#fff', borderColor: '#0EA5E9' }
const inlineInputStyle = { width: '100%', minWidth: '140px', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#fff' }
const editBtnStyle = { backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const secondaryBtnStyle = { backgroundColor: '#E2E8F0', color: '#0F172A', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
const reactiveBtnStyle = { backgroundColor: '#16A34A', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const unlockBtnStyle = { backgroundColor: '#4338CA', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const deactivateBtnStyle = { backgroundColor: '#DC2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const primaryBtnStyle = { backgroundColor: '#0EA5E9', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
const addTeacherBtnStyle = { minWidth: '150px', padding: '12px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', color: '#082f49', fontSize: '0.96rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 18px rgba(14, 165, 233, 0.2)' }
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.92rem', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#fff' }
