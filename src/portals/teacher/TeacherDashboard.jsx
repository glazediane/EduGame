import { useEffect, useRef, useState } from 'react'
import { questionBank } from '../../questions'
import TeacherSettings from './TeacherSettings'
import ReportAnalytics from '../shared/ReportAnalytics'

const gradeOptions = ['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6']
const quizSubjects = [
  { key: 'math', label: 'Math' },
  { key: 'english', label: 'English' },
  { key: 'science', label: 'Science' }
]

export default function TeacherDashboard({ user, onLogout }) {
  const safeUser = user || {}
  const safeUserId = safeUser.userId || ''
  const safeUserName = safeUser.fullName || 'Teacher'
  const assignedGrade = String(safeUser.grade || 'grade1').toLowerCase()

  const [activeTab, setActiveTab] = useState('roster')
  const [selectedGrade, setSelectedGrade] = useState(assignedGrade)
  const [studentsData, setStudentsData] = useState([])
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [editStudentForm, setEditStudentForm] = useState({ userId: '', fullName: '', password: '' })
  const [studentForm, setStudentForm] = useState({ userId: '', firstName: '', lastName: '', password: '', grade: assignedGrade, teacherId: safeUserId })
  const [quizSubject, setQuizSubject] = useState('math')
  const [quizLevel, setQuizLevel] = useState(1)
  const [quizBank, setQuizBank] = useState({})
  const [quizMessage, setQuizMessage] = useState({ type: '', text: '' })
  const importInputRef = useRef(null)
  const quizImportRef = useRef(null)

  const normalizedGrade = (value) => {
    const text = String(value || '').trim().toLowerCase().replace(/[_\s]+/g, ' ')
    if (!text) return 'grade1'
    const gradeMatch = text.match(/grade\s*(\d+)/)
    if (gradeMatch) return `grade${gradeMatch[1]}`
    const numberMatch = text.match(/(\d+)/)
    if (numberMatch) return `grade${numberMatch[1]}`
    return 'grade1'
  }

  const buildDefaultQuizBank = (gradeKey) => {
    const safeGrade = normalizedGrade(gradeKey)
    const sourceData = questionBank?.[safeGrade] || {}
    const baseBank = {
      math: sourceData.math || {},
      english: sourceData.english || {},
      science: sourceData.science || {}
    }

    try {
      const stored = localStorage.getItem(`teacher_quiz_bank_${safeGrade}`)
      if (!stored) return baseBank
      const parsed = JSON.parse(stored)
      return {
        math: { ...(baseBank.math || {}), ...(parsed.math || {}) },
        english: { ...(baseBank.english || {}), ...(parsed.english || {}) },
        science: { ...(baseBank.science || {}), ...(parsed.science || {}) }
      }
    } catch (error) {
      console.error('Unable to load teacher quiz bank:', error)
      return baseBank
    }
  }

  const getQuizLevelQuestions = (subject, level) => {
    const selectedSubject = quizBank?.[subject] || {}
    return Array.isArray(selectedSubject[level]) ? selectedSubject[level] : []
  }

  const persistQuizBank = (gradeKey, data) => {
    const safeGrade = normalizedGrade(gradeKey)
    localStorage.setItem(`teacher_quiz_bank_${safeGrade}`, JSON.stringify(data))
    setQuizBank(data)
  }

  const updateQuizQuestion = (index, field, value) => {
    setQuizBank(prev => {
      const currentQuestions = [...(getQuizLevelQuestions(quizSubject, quizLevel) || [])]
      currentQuestions[index] = { ...currentQuestions[index], [field]: value }
      return {
        ...prev,
        [quizSubject]: {
          ...(prev[quizSubject] || {}),
          [quizLevel]: currentQuestions
        }
      }
    })
  }

  const updateQuizOption = (index, optionIndex, value) => {
    setQuizBank(prev => {
      const questions = [...(getQuizLevelQuestions(quizSubject, quizLevel) || [])]
      const updatedOptions = [...(questions[index]?.options || Array(4).fill(''))]
      updatedOptions[optionIndex] = value
      questions[index] = { ...questions[index], options: updatedOptions }
      return {
        ...prev,
        [quizSubject]: {
          ...(prev[quizSubject] || {}),
          [quizLevel]: questions
        }
      }
    })
  }

  const addQuizQuestion = () => {
    const newQuestion = {
      q: 'New quiz question',
      visual: '✨',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      optionIcons: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
      a: 'Option A',
      hint: 'Type a helpful clue here.',
      reward: '🎉 Learning Boost'
    }

    setQuizBank(prev => {
      const nextLevel = [...(getQuizLevelQuestions(quizSubject, quizLevel) || []), newQuestion]
      return {
        ...prev,
        [quizSubject]: {
          ...(prev[quizSubject] || {}),
          [quizLevel]: nextLevel
        }
      }
    })
  }

  const deleteQuizQuestion = (index) => {
    setQuizBank(prev => {
      const remaining = [...(getQuizLevelQuestions(quizSubject, quizLevel) || [])].filter((_, questionIndex) => questionIndex !== index)
      return {
        ...prev,
        [quizSubject]: {
          ...(prev[quizSubject] || {}),
          [quizLevel]: remaining
        }
      }
    })
  }

  const saveCurrentQuizBank = () => {
    const normalized = {
      math: { ...(quizBank.math || {}) },
      english: { ...(quizBank.english || {}) },
      science: { ...(quizBank.science || {}) }
    }
    persistQuizBank(assignedGrade, normalized)
    setQuizMessage({ type: 'success', text: `Quiz changes saved for ${assignedGrade.replace('grade', 'Grade ')}.` })
  }

  const exportQuizBank = () => {
    const payload = {
      grade: assignedGrade,
      math: quizBank.math || {},
      english: quizBank.english || {},
      science: quizBank.science || {}
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${assignedGrade}_quiz_bank.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setQuizMessage({ type: 'success', text: 'Quiz bank exported successfully.' })
  }

  const handleQuizImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const targetGrade = normalizedGrade(assignedGrade)
      const incomingGrade = normalizedGrade(parsed?.grade || targetGrade)
      const incomingData = {
        math: parsed.math || parsed?.[targetGrade]?.math || {},
        english: parsed.english || parsed?.[targetGrade]?.english || {},
        science: parsed.science || parsed?.[targetGrade]?.science || {}
      }

      const mergedBank = {
        math: { ...(questionBank?.[targetGrade]?.math || {}), ...(incomingData.math || {}) },
        english: { ...(questionBank?.[targetGrade]?.english || {}), ...(incomingData.english || {}) },
        science: { ...(questionBank?.[targetGrade]?.science || {}), ...(incomingData.science || {}) }
      }

      persistQuizBank(targetGrade, mergedBank)
      if (incomingGrade !== targetGrade) {
        setQuizMessage({ type: 'success', text: `Imported data was applied to ${targetGrade.replace('grade', 'Grade ')}.` })
      } else {
        setQuizMessage({ type: 'success', text: 'Quiz file imported successfully.' })
      }
    } catch (error) {
      console.error('Quiz import failed:', error)
      setQuizMessage({ type: 'error', text: 'Unable to import quiz data. Please use a valid JSON quiz file.' })
    } finally {
      event.target.value = ''
    }
  }

  useEffect(() => {
    const nextGrade = normalizedGrade(assignedGrade)
    setSelectedGrade(nextGrade)
    const nextBank = buildDefaultQuizBank(nextGrade)
    setQuizBank(nextBank)
    setQuizLevel(1)
    setQuizSubject('math')
  }, [assignedGrade])

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

  const fetchRoster = async () => {
    setLoading(true)
    try {
      const gradeToFetch = normalizedGrade(selectedGrade || assignedGrade)
      const res = await fetch(`/edugame_api/get_teacher_data.php?grade=${encodeURIComponent(gradeToFetch)}`)
      const data = await res.json()
      setStudentsData(data.success ? (data.students || []) : [])
    } catch (error) {
      console.error('Roster fetch failed:', error)
      setStudentsData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSelectedGrade(assignedGrade)
  }, [assignedGrade])

  useEffect(() => {
    if (activeTab === 'roster') {
      fetchRoster()
    }
  }, [activeTab, selectedGrade, safeUserId])

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true)
    try {
      const res = await fetch(`/edugame_api/get_leaderboard.php?teacherId=${encodeURIComponent(safeUserId)}&grade=${encodeURIComponent(selectedGrade)}`)
      const data = await res.json()
      setLeaderboardData(data.success ? (data.leaderboard || []) : [])
    } catch (error) {
      console.error('Leaderboard fetch failed:', error)
      setLeaderboardData([])
    } finally {
      setLeaderboardLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard()
    }
  }, [activeTab, selectedGrade, safeUserId])

  const getStudentState = (student = {}) => {
    const isDeactivated = Boolean(student.isDeactivated ?? student.isLocked ?? student.locked ?? false)
    const isTemporarilyLocked = Boolean(student.isTemporarilyLocked ?? student.isTempLocked ?? false)
    return { isDeactivated, isTemporarilyLocked }
  }

  const handleAddStudent = async (event) => {
    event.preventDefault()
    setMessage({ type: '', text: '' })

    const firstName = studentForm.firstName.trim()
    const lastName = studentForm.lastName.trim()

    if (!studentForm.userId || !firstName || !lastName || !studentForm.password) {
      setMessage({ type: 'error', text: 'Please fill in User ID, First Name, Last Name, and Password to proceed.' })
      return
    }

    if (normalizedGrade(studentForm.grade) !== normalizedGrade(assignedGrade)) {
      setMessage({ type: 'error', text: `You can only add students in ${assignedGrade.replace('grade', 'Grade ')}.` })
      return
    }

    try {
      const response = await fetch('/edugame_api/add_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: studentForm.userId.trim(),
          fullName: `${firstName} ${lastName}`.trim(),
          password: studentForm.password.trim(),
          role: 'student',
          grade: studentForm.grade || assignedGrade,
          teacherId: safeUserId
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessage({ type: 'success', text: data.message || 'Student account created successfully.' })
        setStudentForm({ userId: '', firstName: '', lastName: '', password: '', grade: assignedGrade, teacherId: safeUserId })
        fetchRoster()
      } else {
        setMessage({ type: 'error', text: data.message || 'Unable to create student account.' })
      }
    } catch (error) {
      console.error('Unable to create student:', error)
      setMessage({ type: 'error', text: 'Server connection failed while creating the account.' })
    }
  }

  const handleExportTemplate = () => {
    const csv = 'User ID,First Name,Last Name\n20222794,Juan,Dela Cruz\nSTU1002,Maria,Santos\n'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'teacher_student_import_template.csv'
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
        setMessage({ type: 'error', text: 'The file is empty or missing student records.' })
        event.target.value = ''
        return
      }

      const headers = parseCsvLine(lines[0]).map((value) => value.toLowerCase().replace(/[^a-z]/g, ''))
      const userIndex = headers.findIndex((header) => ['userid', 'studentid', 'id'].includes(header))
      const firstNameIndex = headers.findIndex((header) => ['firstname', 'first_name', 'first name', 'givenname', 'given_name'].includes(header))
      const lastNameIndex = headers.findIndex((header) => ['lastname', 'last_name', 'last name', 'surname', 'familyname'].includes(header))

      if (userIndex === -1 || firstNameIndex === -1 || lastNameIndex === -1) {
        setMessage({ type: 'error', text: 'CSV must include User ID, First Name, and Last Name columns.' })
        event.target.value = ''
        return
      }

      const defaultPassword = window.prompt('Enter the default password for all imported students:', '')
      if (!defaultPassword || !defaultPassword.trim()) {
        setMessage({ type: 'error', text: 'Default password is required to import student accounts.' })
        event.target.value = ''
        return
      }

      let imported = 0
      let failed = 0
      for (let i = 1; i < lines.length; i += 1) {
        const values = parseCsvLine(lines[i])
        const userId = (values[userIndex] || '').trim()
        const firstName = (values[firstNameIndex] || '').trim()
        const lastName = (values[lastNameIndex] || '').trim()

        if (!userId || !firstName || !lastName) {
          failed += 1
          continue
        }

        try {
          const res = await fetch('/edugame_api/add_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              fullName: `${firstName} ${lastName}`.trim(),
              password: defaultPassword.trim(),
              role: 'student',
              grade: assignedGrade,
              teacherId: safeUserId
            })
          })
          const data = await res.json()
          if (data.success) imported += 1
          else failed += 1
        } catch (error) {
          failed += 1
          console.error('Error importing student:', error)
        }
      }

      await fetchRoster()
      setMessage({
        type: imported > 0 ? 'success' : 'error',
        text: imported > 0 ? `Imported ${imported} student account(s). ${failed > 0 ? `${failed} failed.` : ''}` : 'No student accounts were imported.'
      })
    } catch (error) {
      console.error('Import failed:', error)
      setMessage({ type: 'error', text: 'Unable to import the CSV file.' })
    } finally {
      event.target.value = ''
    }
  }

  const openEditStudent = (student) => {
    setEditingStudentId(student.id)
    setEditStudentForm({ userId: student.id || '', fullName: student.name || '', password: '' })
  }

  const handleEditStudent = async () => {
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
        body: JSON.stringify({
          userId: editingStudentId,
          newUserId: userId,
          oldRole: 'student',
          role: 'student',
          fullName,
          grade: assignedGrade,
          teacherId: safeUserId,
          password: editStudentForm.password.trim()
        })
      })

      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Student account updated successfully.')
        setEditingStudentId(null)
        setEditStudentForm({ userId: '', fullName: '', password: '' })
        fetchRoster()
      } else {
        alert(data.message || 'Failed to update student account.')
      }
    } catch (error) {
      console.error('Edit student failed:', error)
      alert('Server connection failed while updating the student account.')
    }
  }

  const handleDeactivateStudent = async (studentId) => {
    const confirmed = window.confirm('Deactivate this student account?')
    if (!confirmed) return

    try {
      const response = await fetch('/edugame_api/toggle_lock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId, role: 'student', isLocked: 1 })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Student account deactivated.')
        fetchRoster()
      } else {
        alert(data.message || 'Failed to deactivate the student account.')
      }
    } catch (error) {
      console.error('Deactivate student failed:', error)
      alert('Server connection failed while deactivating the student account.')
    }
  }

  const handleReactivateStudent = async (studentId) => {
    const confirmed = window.confirm('Reactivate this student account?')
    if (!confirmed) return

    try {
      const response = await fetch('/edugame_api/toggle_lock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId, role: 'student', isLocked: 0 })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Student account reactivated.')
        fetchRoster()
      } else {
        alert(data.message || 'Failed to reactivate the student account.')
      }
    } catch (error) {
      console.error('Reactivate student failed:', error)
      alert('Server connection failed while reactivating the student account.')
    }
  }

  const handleUnlockStudent = async (studentId) => {
    const confirmed = window.confirm('Unlock this student account?')
    if (!confirmed) return

    try {
      const response = await fetch('/edugame_api/toggle_lock.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId, role: 'student', isLocked: 0 })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Student account unlocked.')
        fetchRoster()
      } else {
        alert(data.message || 'Failed to unlock the student account.')
      }
    } catch (error) {
      console.error('Unlock student failed:', error)
      alert('Server connection failed while unlocking the student account.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Segoe UI, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)', color: 'white', padding: '15px 30px', boxShadow: '0 4px 10px rgba(14,165,233,0.2)' }}>
        <div>
          <h2 style={{ margin: 0 }}>👩‍🏫 Teacher Portal</h2>
          <small><strong>{safeUserName}</strong> | ID: {safeUserId || 'Loading...'}</small>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('roster')} style={activeTab === 'roster' ? activeTabStyle : navBtnStyle}>📋 Class Roster</button>
          <button onClick={() => setActiveTab('leaderboard')} style={activeTab === 'leaderboard' ? activeTabStyle : navBtnStyle}>🏆 Leaderboard</button>
          <button onClick={() => setActiveTab('quizzes')} style={activeTab === 'quizzes' ? activeTabStyle : navBtnStyle}>🧠 Quiz Manager</button>
          <button onClick={() => setActiveTab('add-student')} style={activeTab === 'add-student' ? activeTabStyle : navBtnStyle}>➕ Add Student</button>
          <button onClick={() => setActiveTab('reports')} style={activeTab === 'reports' ? activeTabStyle : navBtnStyle}>📊 Reports</button>
          <button onClick={() => setActiveTab('settings')} style={activeTab === 'settings' ? activeTabStyle : navBtnStyle}>⚙️ Teacher Settings</button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {activeTab === 'roster' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>📊 Student Roster</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Track enrolled students, account status, and unlock progress.</p>
              </div>
              <div>
                <label style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Assigned Grade:</label>
                <span style={gradePillStyle}>{assignedGrade ? assignedGrade.replace('grade', 'Grade ') : 'Grade 1'}</span>
              </div>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Fetching student records...</p>
            ) : studentsData.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No students found in this grade level.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                    <th style={thStyle}>Student ID</th>
                    <th style={thStyle}>Student Name</th>
                    <th style={thStyle}>Highest Level</th>
                    <th style={thStyle}>Average Score</th>
                    <th style={thStyle}>Account Security</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((student) => {
                    const state = getStudentState(student)
                    return (
                      <tr key={student.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>
                          {editingStudentId === student.id ? (
                            <input type="text" value={editStudentForm.userId} onChange={(e) => setEditStudentForm(prev => ({ ...prev, userId: e.target.value }))} style={inlineInputStyle} />
                          ) : (
                            student.id
                          )}
                        </td>
                        <td style={tdStyle}>
                          {editingStudentId === student.id ? (
                            <input type="text" value={editStudentForm.fullName} onChange={(e) => setEditStudentForm(prev => ({ ...prev, fullName: e.target.value }))} style={inlineInputStyle} />
                          ) : (
                            student.name
                          )}
                        </td>
                        <td style={tdStyle}><span style={badgeStyle}>Level {student.highestLevel || 1} / 15</span></td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{student.avgScore != null ? `${student.avgScore}%` : 'N/A'}</td>
                        <td style={tdStyle}>
                          {!state.isDeactivated && !state.isTemporarilyLocked && <span style={activeStatusStyle}>✅ Active</span>}
                          {state.isDeactivated && !state.isTemporarilyLocked && <span style={deactivatedStatusStyle}>🚫 Deactivated</span>}
                          {!state.isDeactivated && state.isTemporarilyLocked && <span style={lockedStatusStyle}>🔒 Locked</span>}
                          {state.isDeactivated && state.isTemporarilyLocked && <span style={combinedStatusStyle}>🚫 Deactivated & Locked</span>}
                        </td>
                        <td style={tdStyle}>
                          {editingStudentId === student.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <input type="text" value={editStudentForm.password} onChange={(e) => setEditStudentForm(prev => ({ ...prev, password: e.target.value }))} placeholder="New password (optional)" style={inlineInputStyle} />
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={handleEditStudent} style={editBtnStyle}>Save</button>
                                <button onClick={() => setEditingStudentId(null)} style={secondaryBtnStyle}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button onClick={() => openEditStudent(student)} style={editBtnStyle}>Edit</button>
                              {state.isDeactivated && <button onClick={() => handleReactivateStudent(student.id)} style={reactiveBtnStyle}>Reactivate Account</button>}
                              {state.isTemporarilyLocked && <button onClick={() => handleUnlockStudent(student.id)} style={unlockBtnStyle}>Unlock Account</button>}
                              {!state.isDeactivated && !state.isTemporarilyLocked && <button onClick={() => handleDeactivateStudent(student.id)} style={deactivateBtnStyle}>Deactivate Account</button>}
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

        {activeTab === 'quizzes' && (
          <div style={{ ...cardStyle, padding: '28px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>🧠 Quiz Manager</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Edit, add, import, and export quizzes for your grade level.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={gradePillStyle}>{assignedGrade ? assignedGrade.replace('grade', 'Grade ') : 'Grade 1'}</span>
              </div>
            </div>

            {quizMessage.text && (
              <div style={{ marginBottom: '18px', padding: '10px 12px', borderRadius: '8px', backgroundColor: quizMessage.type === 'success' ? '#dcfce7' : '#fee2e2', border: `1px solid ${quizMessage.type === 'success' ? '#22c55e' : '#ef4444'}`, color: '#0f172a' }}>
                {quizMessage.text}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {quizSubjects.map((subject) => (
                  <button
                    key={subject.key}
                    type="button"
                    onClick={() => setQuizSubject(subject.key)}
                    style={quizSubject === subject.key ? { ...primaryBtnStyle, padding: '10px 16px' } : { ...secondaryBtnStyle, padding: '10px 16px' }}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setQuizLevel((prev) => Math.max(1, prev - 1))} style={secondaryBtnStyle}>Previous Level</button>
                <select value={quizLevel} onChange={(e) => setQuizLevel(Number(e.target.value))} style={{ ...inputStyle, width: '120px' }}>
                  {Array.from({ length: 15 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>Level {index + 1}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setQuizLevel((prev) => Math.min(15, prev + 1))} style={secondaryBtnStyle}>Next Level</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <button type="button" onClick={addQuizQuestion} style={primaryBtnStyle}>Add Question</button>
              <button type="button" onClick={saveCurrentQuizBank} style={secondaryBtnStyle}>Save Quiz</button>
              <button type="button" onClick={exportQuizBank} style={secondaryBtnStyle}>Export JSON</button>
              <button type="button" onClick={() => quizImportRef.current?.click()} style={secondaryBtnStyle}>Import JSON</button>
              <input ref={quizImportRef} type="file" accept="application/json" onChange={handleQuizImport} style={{ display: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {getQuizLevelQuestions(quizSubject, quizLevel).length === 0 ? (
                <div style={{ padding: '18px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', color: '#475569', textAlign: 'center' }}>
                  No questions in this level yet. Add one to begin.
                </div>
              ) : (
                getQuizLevelQuestions(quizSubject, quizLevel).map((question, index) => (
                  <div key={`${quizSubject}-${quizLevel}-${index}`} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <strong style={{ color: '#0f172a' }}>Question {index + 1}</strong>
                      <button type="button" onClick={() => deleteQuizQuestion(index)} style={deactivateBtnStyle}>Delete</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      <label style={fieldLabelStyle}>Question</label>
                      <textarea value={question.q || ''} onChange={(e) => updateQuizQuestion(index, 'q', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />

                      <label style={fieldLabelStyle}>Hint</label>
                      <textarea value={question.hint || ''} onChange={(e) => updateQuizQuestion(index, 'hint', e.target.value)} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />

                      <label style={fieldLabelStyle}>Answer</label>
                      <select value={question.a || question.options?.[0] || ''} onChange={(e) => updateQuizQuestion(index, 'a', e.target.value)} style={inputStyle}>
                        {(question.options || []).map((option, optionIndex) => (
                          <option key={`${question.q || 'option'}-${optionIndex}`} value={option}>{option}</option>
                        ))}
                      </select>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        {(question.options || Array(4).fill('')).map((option, optionIndex) => (
                          <div key={`option-${optionIndex}`}>
                            <label style={fieldLabelStyle}>Option {optionIndex + 1}</label>
                            <input value={option} onChange={(e) => updateQuizOption(index, optionIndex, e.target.value)} style={inputStyle} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>🏆 Student Leaderboard</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Top performers in your assigned grade.</p>
              </div>
              <span style={gradePillStyle}>{selectedGrade ? selectedGrade.replace('grade', 'Grade ') : 'Grade 1'}</span>
            </div>

            {leaderboardLoading ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>Loading leaderboard...</p>
            ) : leaderboardData.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No leaderboard data for this class yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                    <th style={thStyle}>Rank</th>
                    <th style={thStyle}>Student Name</th>
                    <th style={thStyle}>Total Score</th>
                    <th style={thStyle}>Best Level</th>
                    <th style={thStyle}>Subjects Played</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <tr key={`${entry.userId}-${index}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>#{index + 1}</td>
                      <td style={tdStyle}>{entry.name}</td>
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

        {activeTab === 'add-student' && (
          <div style={{ ...cardStyle, padding: '28px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{ fontSize: '22px' }}>👤</span>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#1f2937' }}>Add New Student</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleExportTemplate} style={{ ...secondaryBtnStyle, padding: '10px 16px' }}>Export Template</button>
              <button type="button" onClick={() => importInputRef.current?.click()} style={{ ...primaryBtnStyle, padding: '10px 16px' }}>Import Students</button>
              <input ref={importInputRef} type="file" accept=".csv" onChange={handleImportStudents} style={{ display: 'none' }} />
            </div>

            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Role</label>
                  <input type="text" value="Student" readOnly style={{ ...inputStyle, backgroundColor: '#e5e7eb', cursor: 'not-allowed' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>User ID</label>
                  <input type="text" value={studentForm.userId} onChange={(e) => setStudentForm(prev => ({ ...prev, userId: e.target.value }))} placeholder="e.g. 20222794" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>First Name</label>
                  <input type="text" value={studentForm.firstName} onChange={(e) => setStudentForm(prev => ({ ...prev, firstName: e.target.value }))} placeholder="Juan" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Last Name</label>
                  <input type="text" value={studentForm.lastName} onChange={(e) => setStudentForm(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Dela Cruz" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Password</label>
                  <input type="text" value={studentForm.password} onChange={(e) => setStudentForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Set a password" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Grade</label>
                  <input type="text" value={assignedGrade.replace('grade', 'Grade ')} readOnly style={{ ...inputStyle, backgroundColor: '#e5e7eb', cursor: 'not-allowed' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1 1 180px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 700 }}>Assigned Teacher ID</label>
                  <input type="text" value={safeUserId} readOnly style={{ ...inputStyle, backgroundColor: '#e5e7eb', cursor: 'not-allowed' }} />
                </div>
                <div style={{ display: 'flex', alignSelf: 'flex-end', flex: '1 1 180px' }}>
                  <button type="submit" style={addAccountBtnStyle}>Add Account</button>
                </div>
              </div>
            </form>

            {message.text && (
              <div style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b', border: message.type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5' }}>
                {message.text}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && <TeacherSettings user={safeUser} onLogout={onLogout} />}
        {activeTab === 'reports' && <ReportAnalytics role="teacher" teacherId={safeUserId} assignedGrade={assignedGrade} />}
      </div>
    </div>
  )
}

const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const navBtnStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(224,242,254,0.4)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const activeTabStyle = { background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', color: '#075985', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const gradePillStyle = { backgroundColor: '#E0F2FE', color: '#075985', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }
const thStyle = { padding: '12px', fontSize: '0.85rem', color: '#64748B' }
const tdStyle = { padding: '12px', fontSize: '0.9rem', color: '#334155' }
const badgeStyle = { backgroundColor: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const inlineInputStyle = { width: '100%', minWidth: '140px', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#fff' }
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.92rem', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#fff' }
const primaryBtnStyle = { backgroundColor: '#0EA5E9', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
const secondaryBtnStyle = { backgroundColor: '#E2E8F0', color: '#0F172A', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const editBtnStyle = { backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const reactiveBtnStyle = { backgroundColor: '#16A34A', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const unlockBtnStyle = { backgroundColor: '#4338CA', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const deactivateBtnStyle = { backgroundColor: '#DC2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }
const addAccountBtnStyle = { minWidth: '150px', padding: '12px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', color: '#082f49', fontSize: '0.96rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 18px rgba(14, 165, 233, 0.2)' }
const fieldLabelStyle = { display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#334155', fontSize: '0.82rem' }
const activeStatusStyle = { backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }
const lockedStatusStyle = { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }
const deactivatedStatusStyle = { backgroundColor: '#E5E7EB', color: '#374151', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }
const combinedStatusStyle = { backgroundColor: '#FDE68A', color: '#92400E', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }
