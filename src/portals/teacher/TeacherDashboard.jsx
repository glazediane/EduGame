import { useState, useEffect } from 'react'
import TeacherSettings from './TeacherSettings'

export default function TeacherDashboard({ user, onLogout }) {
  const safeUser = user || {}
  const safeUserId = safeUser.userId || ''
  const safeUserName = safeUser.fullName || 'Teacher'

  const [activeTab, setActiveTab] = useState('roster') // 'roster' | 'leaderboard' | 'settings'
  const teacherAssignedGrade = String(safeUser.grade || 'kinder').toLowerCase()
  const [selectedGrade, setSelectedGrade] = useState(teacherAssignedGrade)
  const [studentsData, setStudentsData] = useState([])
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)

  // Fetch student roster and progress data from XAMPP API
  const fetchRoster = async () => {
    setLoading(true)
    try {
      const encodedGrade = encodeURIComponent(selectedGrade)
      const res = await fetch(`/edugame_api/get_teacher_data.php?grade=${encodedGrade}`)
      const data = await res.json()

      if (data.success) {
        setStudentsData(data.students || [])
      } else {
        setStudentsData([])
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
  }, [selectedGrade, activeTab, safeUserId])

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true)
    try {
      const encodedGrade = encodeURIComponent(selectedGrade)
      const encodedTeacherId = encodeURIComponent(safeUserId)
      const res = await fetch(`/edugame_api/get_leaderboard.php?teacherId=${encodedTeacherId}&grade=${encodedGrade}`)
      const data = await res.json()
      setLeaderboardData(data.success ? (data.leaderboard || []) : [])
    } catch (err) {
      console.error('Error loading leaderboard:', err)
      setLeaderboardData([])
    } finally {
      setLeaderboardLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'leaderboard' && selectedGrade) {
      fetchLeaderboard()
    }
  }, [selectedGrade, activeTab, safeUserId])

  // Teacher manual override action to unlock levels for a student
  const handleUnlockLevel = async (studentId, currentLevel) => {
    const nextLevel = currentLevel + 1
    if (nextLevel > 15) return alert('Student is already at the maximum level (15)!')

    try {
      const res = await fetch('/edugame_api/unlock_level.php', {
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)', color: 'white', padding: '15px 30px', boxShadow: '0 4px 10px rgba(14,165,233,0.2)' }}>
        <div>
          <h2 style={{ margin: 0 }}>👩‍🏫 Teacher Portal</h2>
          <small><strong>{safeUserName}</strong> | ID: {safeUserId || 'Loading...'}</small>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('roster')} 
            style={activeTab === 'roster' ? activeTabStyle : navBtnStyle}
          >
            📋 Class Roster & Progress
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')} 
            style={activeTab === 'leaderboard' ? activeTabStyle : navBtnStyle}
          >
            🏆 Leaderboard
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={activeTab === 'settings' ? activeTabStyle : navBtnStyle}
          >
            ⚙️ Teacher Settings
          </button>
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
                <label style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Assigned Grade:</label>
                <span style={assignedGradeStyle}>{selectedGrade ? selectedGrade.replace('grade', 'Grade ') : 'Kindergarten'}</span>
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

        {activeTab === 'leaderboard' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>🏆 Student Leaderboard</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Top performers in your assigned grade.</p>
              </div>
              <div>
                <label style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>Assigned Grade:</label>
                <span style={assignedGradeStyle}>{selectedGrade ? selectedGrade.replace('grade', 'Grade ') : 'Kindergarten'}</span>
              </div>
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
                    <tr key={entry.userId} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold' }}>#{index + 1}</td>
                      <td style={tdStyle}>{entry.name}</td>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: '#0EA5E9' }}>{entry.totalScore} pts</td>
                      <td style={tdStyle}>Level {entry.bestLevel}</td>
                      <td style={tdStyle}>{entry.subjectsPlayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: TEACHER SETTINGS */}
        {activeTab === 'settings' && <TeacherSettings user={safeUser} onLogout={onLogout} />}

      </div>
    </div>
  )
}

// Inline Styles
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const navBtnStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(224,242,254,0.4)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const activeTabStyle = { background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', color: '#075985', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const logoutBtnStyle = { backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }

const assignedGradeStyle = { backgroundColor: '#E0F2FE', color: '#075985', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }
const thStyle = { padding: '12px', fontSize: '0.85rem', color: '#64748B' }
const tdStyle = { padding: '12px', fontSize: '0.9rem', color: '#334155' }

const badgeStyle = { backgroundColor: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const actionBtnStyle = { backgroundColor: '#059669', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }