import { useState, useEffect } from 'react'

export default function StudentPerformance({ user }) {
  const [performance, setPerformance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost/edugame_api/get_progress.php?userId=${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.performance)) {
          setPerformance(data.performance)
        }
      })
      .catch((err) => console.error('Error fetching performance:', err))
      .finally(() => setLoading(false))
  }, [user.userId])

  const totalGames = performance.length
  const totalScore = performance.reduce((acc, curr) => acc + Number(curr.score || 0), 0)

  return (
    <div style={cardStyle}>
      <h2 style={{ color: '#1E293B', marginTop: 0, marginBottom: '20px' }}>📊 My Game Performance</h2>

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={statBoxStyle}>
          <small style={statLabelStyle}>Total Levels Completed</small>
          <div style={statNumberStyle}>{totalGames}</div>
        </div>
        <div style={statBoxStyle}>
          <small style={statLabelStyle}>Total Score Earned</small>
          <div style={{ ...statNumberStyle, color: '#16A34A' }}>{totalScore} pts</div>
        </div>
      </div>

      {/* Performance Records Table */}
      {loading ? (
        <p style={{ color: '#64748B' }}>⏳ Loading your performance history...</p>
      ) : performance.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748B' }}>
          <p style={{ fontSize: '1.1rem' }}>No records found yet!</p>
          <small>Complete a game level in the Play Arena to log your first score.</small>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left' }}>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Level</th>
                <th style={thStyle}>Tier</th>
                <th style={thStyle}>Score</th>
                <th style={thStyle}>Completed At</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={tdStyle}>{row.subject}</td>
                  <td style={tdStyle}>Level {row.level}</td>
                  <td style={tdStyle}>
                    <span style={getBadgeStyle(row.difficulty)}>
                      {(row.difficulty || 'easy').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{row.score} pts</td>
                  <td style={tdStyle}>{row.completed_at || 'Recently'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Styling
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
const statBoxStyle = { backgroundColor: '#F8FAFC', padding: '15px 20px', borderRadius: '10px', border: '1px solid #E2E8F0' }
const statLabelStyle = { color: '#64748B', fontSize: '0.85rem', fontWeight: 'bold' }
const statNumberStyle = { fontSize: '1.6rem', fontWeight: 'bold', color: '#2563EB', marginTop: '5px' }
const thStyle = { padding: '12px', fontSize: '0.85rem', color: '#475569' }
const tdStyle = { padding: '12px', fontSize: '0.9rem', color: '#1E293B' }

const getBadgeStyle = (diff) => ({
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: diff === 'hard' ? '#DC2626' : diff === 'medium' ? '#D97706' : '#16A34A'
})