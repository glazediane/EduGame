import { useState, useEffect } from 'react'
import TeacherSettings from './TeacherSettings'

export default function TeacherDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('roster') // 'roster' | 'settings'
  const [selectedGrade, setSelectedGrade] = useState('kinder')
  const [studentsData, setStudentsData] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch student roster and progress data from XAMPP API
const fetchRoster = async () => {
  setLoading(true)
  try {
    const encodedGrade = encodeURIComponent(selectedGrade)
    const res = await fetch(`http://localhost/edugame_api/get_teacher_data.php?grade=${encodedGrade}`)
    const data = await res.json()
    
    if (data.success) {
      setStudentsData(data.students || [])
    } else {
      setStudentsData([]) // Clear state if no students found
    }
  } catch (err) {
    console.error('Error loading roster:', err)
    setStudentsData([])
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  if (activeTab === 'roster' && selectedGrade) {
    fetchRoster()
  }
}, [selectedGrade, activeTab])

  // Teacher manual override action to unlock levels for a student
  const handleUnlockLevel = async (studentId, currentLevel) => {
    const nextLevel = currentLevel + 1
    if (nextLevel > 15) return alert('Student is already at the maximum level (15)!')

    try {
      const res = await fetch('http://localhost/edugame_api/unlock_level.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, levelToUnlock: nextLevel })
      })
      const data = await res.json()
      if (data.success) {
        alert(`Successfully unlocked Level ${nextLevel} for student!`)
        fetchRoster()
      } else {
        alert(data.message || 'Failed to unlock level.')
      }
    } catch (err) {
      console.error('Error unlocking level:', err)
      alert('Server connection error.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Header Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#059669', color: 'white', padding: '15px 30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <div>
          <h2 style={{ margin: 0 }}>👩‍🏫 Teacher Portal</h2>
          <small>Welcome back, <strong>{user.fullName}</strong> (ID: {user.userId})</small>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('roster')} 
            style={activeTab === 'roster' ? activeTabStyle : navBtnStyle}
          >
            📋 Class Roster & Progress
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={activeTab === 'settings' ? activeTabStyle : navBtnStyle}
          >
            ⚙️ Teacher Settings
          </button>
          <button onClick={onLogout} style={logoutBtnStyle}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        
        {/* TAB 1: CLASS ROSTER & PERFORMANCE */}
        {activeTab === 'roster' && (
          <div style={cardStyle}>
            {/* Grade Selector Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>📊 Student Performance Roster</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Track score progress and unlock level progression.</p>
              </div>

              <div>
                <label style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Filter Grade:</label>
                <select 
                  value={selectedGrade} 
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  style={selectStyle}
                >
                  <option value="kinder">Kindergarten</option>
                  <option value="grade1">Grade 1</option>
                  <option value="grade2">Grade 2</option>
                  <option value="grade3">Grade 3</option>
                  <option value="grade4">Grade 4</option>
                  <option value="grade5">Grade 5</option>
                  <option value="grade6">Grade 6</option>
                </select>
              </div>
            </div>

            {/* Roster Table */}
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
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map(student => (
                    <tr key={student.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>{student.id}</td>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle}>
                          Level {student.highestLevel || 1} / 15
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>
                        {student.avgScore != null ? `${student.avgScore}%` : 'N/A'}
                      </td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => handleUnlockLevel(student.id, student.highestLevel || 1)}
                          style={actionBtnStyle}
                        >
                          🔓 Unlock Next Level
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: TEACHER SETTINGS */}
        {activeTab === 'settings' && <TeacherSettings user={user} />}

      </div>
    </div>
  )
}

// Inline Styles
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const navBtnStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const activeTabStyle = { backgroundColor: 'white', color: '#059669', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const logoutBtnStyle = { backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }

const selectStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#F8FAFC' }
const thStyle = { padding: '12px', fontSize: '0.85rem', color: '#64748B' }
const tdStyle = { padding: '12px', fontSize: '0.9rem', color: '#334155' }

const badgeStyle = { backgroundColor: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const actionBtnStyle = { backgroundColor: '#059669', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }