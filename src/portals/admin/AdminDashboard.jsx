import { useState, useEffect } from 'react'
import AdminSettings from './AdminSettings'

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('students') // 'students' | 'settings'
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch all students from XAMPP backend
  const loadStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost/edugame_api/get_students.php')
      const data = await res.json()
      if (data.success) {
        setStudents(data.students)
      }
    } catch (err) {
      console.error('Error fetching student roster:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // Administrative unlock action for locked student accounts
  const handleUnlock = async (studentId) => {
    try {
      const res = await fetch('http://localhost/edugame_api/unlock_student.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      })
      const data = await res.json()
      alert(data.message)
      loadStudents() // Refresh student roster
    } catch (err) {
      console.error('Error unlocking account:', err)
      alert('Failed to connect to server.')
    }
  }

  // Filter students by ID or Name
  const filteredStudents = students.filter(s =>
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Top Admin Navigation Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#4338CA', color: 'white', padding: '15px 30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <div>
          <h2 style={{ margin: 0 }}>⚙️ Admin Control Center</h2>
          <small>Logged in as: <strong>{user.fullName}</strong> (ID: {user.userId})</small>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('students')} 
            style={activeTab === 'students' ? activeTabStyle : navBtnStyle}
          >
            🏫 Student Directory
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={activeTab === 'settings' ? activeTabStyle : navBtnStyle}
          >
            ⚙️ System Settings
          </button>
          <button onClick={onLogout} style={logoutBtnStyle}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        
        {/* TAB 1: MASTER STUDENT DIRECTORY */}
        {activeTab === 'students' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#1E293B' }}>🏫 Master Student Directory</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>View all registered student accounts, IDs, grade levels, and security states.</p>
              </div>
              
              {/* Search Bar */}
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
                      <td style={tdStyle}>
                        <span style={gradeBadgeStyle}>
                          {student.grade ? student.grade.toUpperCase() : 'KINDER'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {student.locked ? (
                          <span style={lockedBadgeStyle}>🔒 Locked (Exceeded 3 Attempts)</span>
                        ) : (
                          <span style={activeBadgeStyle}>✅ Active</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {student.locked ? (
                          <button onClick={() => handleUnlock(student.id)} style={unlockBtnStyle}>
                            🔓 Unlock Student
                          </button>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No action required</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: ADMIN SETTINGS */}
        {activeTab === 'settings' && <AdminSettings user={user} />}
      </div>
    </div>
  )
}

// Inline Styling Object
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const navBtnStyle = { backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const activeTabStyle = { backgroundColor: 'white', color: '#4338CA', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const logoutBtnStyle = { backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }

const searchInputStyle = { padding: '10px 15px', borderRadius: '8px', border: '1px solid #CBD5E1', width: '250px', fontSize: '0.9rem' }
const thStyle = { padding: '12px', fontSize: '0.85rem', color: '#64748B' }
const tdStyle = { padding: '12px', fontSize: '0.9rem', color: '#334155' }

const gradeBadgeStyle = { backgroundColor: '#E0E7FF', color: '#3730A3', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }
const lockedBadgeStyle = { backgroundColor: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const activeBadgeStyle = { backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }
const unlockBtnStyle = { backgroundColor: '#4338CA', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }