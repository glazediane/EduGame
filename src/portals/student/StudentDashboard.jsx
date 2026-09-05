import { useState, useEffect } from 'react'
import GameArena from './GameArena'
import StudentPerformance from './StudentPerformance'
import StudentSettings from './StudentSettings'


const normalizeGrade = (gradeStr) => {
  if (!gradeStr) return 'kinder'
  const cleaned = gradeStr.toLowerCase().replace(/\s+/g, '')
  return cleaned === 'kindergarten' ? 'kinder' : cleaned
}

export default function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('play')
  const [selectedGrade, setSelectedGrade] = useState(() => normalizeGrade(user?.grade))
  const [selectedSubject, setSelectedSubject] = useState('Math')
  const [activeLevel, setActiveLevel] = useState(null)

  // Track Brain Lives and 20-Hour Lockout State
  const [lives, setLives] = useState(() => {
    const saved = localStorage.getItem(`lives_${user?.userId}`)
    return saved !== null ? Number(saved) : 5
  })

  const [lockoutTime, setLockoutTime] = useState(() => {
    const saved = localStorage.getItem(`lockout_${user?.userId}`)
    return saved ? Number(saved) : null
  })

  // Track max unlocked level per user and subject
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem(`unlocked_${user?.userId}_${selectedSubject.toLowerCase()}`)
    return saved ? Number(saved) : 1
  })

  // Verify Lockout Expiration (20 hours = 72,000,000 ms)
  useEffect(() => {
    if (lockoutTime) {
      const now = Date.now()
      const hoursPassed = (now - lockoutTime) / (1000 * 60 * 60)

      if (hoursPassed >= 20) {
        // 20 hours passed -> Restore 5 lives
        localStorage.removeItem(`lockout_${user?.userId}`)
        localStorage.setItem(`lives_${user?.userId}`, 5)
        setLockoutTime(null)
        setLives(5)
      }
    }
  }, [lockoutTime, user?.userId])

  useEffect(() => {
    const saved = localStorage.getItem(`unlocked_${user?.userId}_${selectedSubject.toLowerCase()}`)
    setUnlockedLevel(saved ? Number(saved) : 1)
  }, [selectedSubject, user?.userId])

  useEffect(() => {
    if (user?.grade) {
      setSelectedGrade(normalizeGrade(user.grade))
    }
  }, [user?.grade])

  const isLockedOut = lives <= 0 || lockoutTime !== null
  const hoursRemaining = lockoutTime ? Math.ceil(20 - (Date.now() - lockoutTime) / (1000 * 60 * 60)) : 0

  const levels = Array.from({ length: 15 }, (_, i) => {
    const lvl = i + 1
    const difficulty = lvl <= 5 ? 'easy' : lvl <= 10 ? 'medium' : 'hard'
    return { level: lvl, difficulty }
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: 'Segoe UI, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', color: 'white', padding: '15px 30px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', borderBottom: '1px solid #334155' }}>
        <div>
          <h2 style={{ margin: 0, color: '#f8fafc' }}>🎓 Student Arena</h2>
          <small style={{ color: '#94a3b8' }}>Welcome back, <strong style={{ color: '#e2e8f0' }}>{user.fullName}</strong> (ID: {user.userId})</small>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
            Lives: {'🧠'.repeat(lives)}{'💀'.repeat(Math.max(0, 5 - lives))}
          </div>
          <button onClick={() => { setActiveTab('play'); setActiveLevel(null); }} style={activeTab === 'play' ? activeTabStyle : navBtnStyle}>🎮 Play Arena</button>
          <button onClick={() => setActiveTab('performance')} style={activeTab === 'performance' ? activeTabStyle : navBtnStyle}>📊 My Performance</button>
          <button onClick={() => setActiveTab('settings')} style={activeTab === 'settings' ? activeTabStyle : navBtnStyle}>⚙️ Settings</button>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        {/* PLAY ARENA TAB */}
        {activeTab === 'play' && !activeLevel && (
          <div style={cardStyle}>
            {/* Lockout Warning Banner */}
            {isLockedOut && (
              <div style={lockoutBannerStyle}>
                <h3 style={{ margin: 0, color: '#f87171' }}>🧠❌ Out of Brain Lives!</h3>
                <p style={{ margin: '8px 0 0 0', color: '#fca5a5' }}>
                  You have 0 lives left. Game access is locked for approximately <strong>{hoursRemaining} hour(s)</strong>.
                </p>
              </div>
            )}

            {/* Grade Level Display */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '10px' }}>1. Your Assigned Grade Level:</h3>
              <select value={selectedGrade} disabled style={lockedSelectStyle}>
                <option value="kinder">Kindergarten</option>
                <option value="grade1">Grade 1</option>
                <option value="grade2">Grade 2</option>
                <option value="grade3">Grade 3</option>
                <option value="grade4">Grade 4</option>
                <option value="grade5">Grade 5</option>
                <option value="grade6">Grade 6</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '10px' }}>2. Choose Subject:</h3>
              <div style={{ display: 'flex', gap: '15px' }}>
                {['Math', 'Science', 'English'].map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    style={{
                      ...subjectBtnStyle,
                      backgroundColor: selectedSubject === subject ? '#0284c7' : '#0f172a',
                      color: selectedSubject === subject ? 'white' : '#94a3b8',
                      border: selectedSubject === subject ? 'none' : '1px solid #334155'
                    }}
                  >
                    {subject === 'Math' ? '📐 Math' : subject === 'Science' ? '🔬 Science' : '📚 English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selector */}
            <div>
              <h3 style={{ color: '#f8fafc', marginBottom: '15px' }}>3. Select Level (1–15):</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
                {levels.map(l => {
                  const isLevelLocked = l.level > unlockedLevel
                  const isDisabled = isLockedOut || isLevelLocked

                  return (
                    <button
                      key={l.level}
                      onClick={() => !isDisabled && setActiveLevel(l)}
                      disabled={isDisabled}
                      style={{
                        ...getLevelButtonStyle(l.difficulty),
                        opacity: isDisabled ? 0.45 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        filter: isDisabled ? 'grayscale(80%)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem' }}>
                        {isDisabled ? `🔒 Level ${l.level}` : `Level ${l.level}`}
                      </div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginTop: '4px', opacity: 0.9 }}>
                        {isLockedOut ? 'Locked Out' : isLevelLocked ? 'Locked' : `${l.difficulty} Tier`}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* GAME ARENA VIEW */}
        {activeTab === 'play' && activeLevel && (
          <GameArena
            grade={selectedGrade}
            subject={selectedSubject}
            levelConfig={activeLevel}
            userId={user.userId}
            onBack={() => {
              const savedLives = localStorage.getItem(`lives_${user?.userId}`)
              setLives(savedLives !== null ? Number(savedLives) : 5)
              const savedLockout = localStorage.getItem(`lockout_${user?.userId}`)
              setLockoutTime(savedLockout ? Number(savedLockout) : null)

              const savedUnlocked = localStorage.getItem(`unlocked_${user?.userId}_${selectedSubject.toLowerCase()}`)
              setUnlockedLevel(savedUnlocked ? Number(savedUnlocked) : 1)
              setActiveLevel(null)
            }}
          />
        )}

        {/* OTHER TABS */}
        {activeTab === 'performance' && <StudentPerformance user={user} />}
        {activeTab === 'settings' && <StudentSettings user={user} onLogout={onLogout} />}
      </div>
    </div>
  )
}

// Styling
const cardStyle = { backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '1px solid #334155' }
const lockoutBannerStyle = { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '15px 20px', borderRadius: '10px', marginBottom: '25px', textAlign: 'center' }
const navBtnStyle = { backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const activeTabStyle = { backgroundColor: '#0284c7', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const lockedSelectStyle = { padding: '10px 15px', borderRadius: '8px', border: '1px solid #334155', fontSize: '1rem', width: '240px', backgroundColor: '#0f172a', color: '#94a3b8', cursor: 'not-allowed', fontWeight: '600' }
const subjectBtnStyle = { padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }

const getLevelButtonStyle = (difficulty) => ({
  padding: '18px 10px',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  backgroundColor: difficulty === 'easy' ? '#059669' : difficulty === 'medium' ? '#d97706' : '#dc2626',
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
})