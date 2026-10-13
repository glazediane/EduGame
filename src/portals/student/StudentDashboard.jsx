import { Fragment, useState, useEffect } from 'react'
import GameArena from './GameArena'
import StudentPerformance from './StudentPerformance'
import StudentSettings from './StudentSettings'
import { apiFetch } from '../../api'

const normalizeGrade = (gradeStr) => {
  if (!gradeStr) return 'grade1'

  const cleaned = String(gradeStr).trim().toLowerCase().replace(/[^a-z0-9]+/g, '')

  if (cleaned.includes('grade1') || cleaned.includes('gradeone') || cleaned.includes('ps1')) return 'grade1'
  if (cleaned.includes('grade2') || cleaned.includes('gradetwo') || cleaned.includes('ps2')) return 'grade2'
  if (cleaned.includes('grade3') || cleaned.includes('gradethree') || cleaned.includes('ps3')) return 'grade3'
  if (cleaned.includes('grade4') || cleaned.includes('gradefour')) return 'grade4'
  if (cleaned.includes('grade5') || cleaned.includes('gradefive')) return 'grade5'
  if (cleaned.includes('grade6') || cleaned.includes('gradesix')) return 'grade6'

  return cleaned || 'grade1'
}

const getAvailableSubjects = (grade) => {
  switch (normalizeGrade(grade)) {
    case 'grade1':
      return [
        { key: 'math', label: 'Math' },
        { key: 'english', label: 'Reading and Literacy' }
      ]
    case 'grade2':
      return [
        { key: 'math', label: 'Math' },
        { key: 'english', label: 'English' }
      ]
    default:
      return [
        { key: 'math', label: 'Math' },
        { key: 'science', label: 'Science' },
        { key: 'english', label: 'English' }
      ]
  }
}

const normalizeSubjectKey = (subject) => {
  const cleaned = String(subject || 'math').trim().toLowerCase()

  if (cleaned === 'reading and literacy' || cleaned === 'readingandliteracy' || cleaned === 'english' || cleaned === 'literacy') return 'english'
  if (cleaned === 'science') return 'science'

  return 'math'
}

const RobotMascot = () => (
  <>
    <style>{`
      @keyframes robotDance {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-12px) rotate(-2deg); }
        50% { transform: translateY(-4px) rotate(2deg); }
        75% { transform: translateY(-10px) rotate(-1deg); }
      }
      @keyframes robotBlink {
        0%, 48%, 52%, 100% { opacity: 1; }
        50% { opacity: 0.25; }
      }
      @keyframes robotWaveLeft {
        0%, 100% { transform: rotate(22deg); }
        50% { transform: rotate(-22deg); }
      }
      @keyframes robotWaveRight {
        0%, 100% { transform: rotate(-28deg); }
        50% { transform: rotate(24deg); }
      }
    `}</style>
    <div style={selectorRobotWrapStyle}>
      <div style={selectorRobotStyle}>
        <div style={selectorRobotHeadStyle}>
          <div style={selectorRobotAntennaStyle} />
          <div style={selectorRobotEyesStyle}>
            <span style={selectorRobotEyeStyle} />
            <span style={selectorRobotEyeStyle} />
          </div>
          <div style={selectorRobotMouthStyle} />
        </div>
        <div style={selectorRobotBodyStyle}>
          <div style={{ ...selectorRobotArmStyle, left: '-12px', animation: 'robotWaveLeft 0.9s ease-in-out infinite alternate' }} />
          <div style={{ ...selectorRobotArmStyle, right: '-12px', animation: 'robotWaveRight 0.9s ease-in-out infinite alternate-reverse' }} />
          <div style={selectorRobotPanelStyle} />
        </div>
        <div style={selectorRobotWheelsStyle}>
          <span style={selectorRobotWheelStyle} />
          <span style={selectorRobotWheelStyle} />
        </div>
      </div>
    </div>
  </>
)

export default function StudentDashboard({ user, onLogout }) {
  const safeUser = user || {}
  const safeUserId = safeUser.userId || ''
  const safeUserName = safeUser.fullName || 'Student'

  const [activeTab, setActiveTab] = useState('play')
  const [selectedGrade, setSelectedGrade] = useState(() => normalizeGrade(safeUser.grade))
  const [selectedSubject, setSelectedSubject] = useState('math')
  const [activeLevel, setActiveLevel] = useState(null)

  const availableSubjects = getAvailableSubjects(selectedGrade)
  const selectedSubjectKey = normalizeSubjectKey(selectedSubject)

  // Track Brain Lives and 20-Hour Lockout State
  const [lives, setLives] = useState(() => {
    const saved = localStorage.getItem(`lives_${safeUserId}`)
    return saved !== null ? Number(saved) : 5
  })

  const [lockoutTime, setLockoutTime] = useState(() => {
    const saved = localStorage.getItem(`lockout_${safeUserId}`)
    return saved ? Number(saved) : null
  })

  // Track max unlocked level per user and subject
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem(`unlocked_${safeUserId}_math`)
    return saved ? Number(saved) : 1
  })

  // Fetch the live student record from the XAMPP database so the dashboard reflects the current account state.
  useEffect(() => {
    if (!safeUserId) return

    apiFetch(`/edugame_api/student_data.php?user_id=${safeUserId}`)
      .then(data => {
        if (data && data.success && data.student) {
          const studentGrade = data.student.grade || safeUser.grade
          if (studentGrade) {
            setSelectedGrade(normalizeGrade(studentGrade))
          }
        }
      })
      .catch(err => console.error('Failed to fetch student data:', err))
  }, [safeUser.grade, safeUserId])

  // Verify Lockout Expiration (20 hours = 72,000,000 ms)
  useEffect(() => {
    if (!safeUserId || !lockoutTime) return

    const now = Date.now()
    const hoursPassed = (now - lockoutTime) / (1000 * 60 * 60)

    if (hoursPassed >= 20) {
      // 20 hours passed -> Restore 5 lives
      localStorage.removeItem(`lockout_${safeUserId}`)
      localStorage.setItem(`lives_${safeUserId}`, 5)
      setLockoutTime(null)
      setLives(5)
    }
  }, [lockoutTime, safeUserId])

  // Sync unlocked level with backend database, fallback to LocalStorage
  useEffect(() => {
    if (!safeUserId) return

    apiFetch(`/edugame_api/get_student_progress.php?user_id=${safeUserId}&subject=${selectedSubjectKey}`)
      .then(data => {
        if (data && data.unlockedLevel) {
          setUnlockedLevel(Number(data.unlockedLevel))
        } else {
          const saved = localStorage.getItem(`unlocked_${safeUserId}_${selectedSubjectKey}`)
          setUnlockedLevel(saved ? Number(saved) : 1)
        }
      })
      .catch(err => {
        console.error('Error loading progress:', err)
        const saved = localStorage.getItem(`unlocked_${safeUserId}_${selectedSubjectKey}`)
        setUnlockedLevel(saved ? Number(saved) : 1)
      })
  }, [selectedSubjectKey, safeUserId])

  useEffect(() => {
    if (safeUser.grade) {
      setSelectedGrade(normalizeGrade(safeUser.grade))
    }
  }, [safeUser.grade])

  useEffect(() => {
    if (!availableSubjects.some(subject => subject.key === selectedSubjectKey)) {
      setSelectedSubject('math')
    }
  }, [availableSubjects, selectedSubjectKey])

  const isLockedOut = lives <= 0 || lockoutTime !== null
  const hoursRemaining = lockoutTime ? Math.ceil(20 - (Date.now() - lockoutTime) / (1000 * 60 * 60)) : 0

  const levels = Array.from({ length: 15 }, (_, i) => {
    const lvl = i + 1
    const difficulty = lvl <= 5 ? 'easy' : lvl <= 10 ? 'medium' : 'hard'
    return { level: lvl, difficulty }
  })

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'radial-gradient(circle at top, rgba(56, 189, 248, 0.14), transparent 38%), linear-gradient(180deg, #071722 0%, #0b1d2d 45%, #0a1824 100%)', fontFamily: 'Segoe UI, sans-serif', overflow: 'hidden' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(9, 24, 36, 0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: 'white', padding: '15px 30px', boxShadow: '0 10px 30px rgba(14, 165, 233, 0.12)', borderBottom: '1px solid rgba(125, 211, 252, 0.18)', position: 'relative', zIndex: 2 }}>
        <div>
          <h2 style={{ margin: 0, color: '#f8fafc' }}>🎓 Student Arena</h2>
          <small style={{ color: '#94a3b8' }}>Welcome back, <strong style={{ color: '#e2e8f0' }}>{safeUserName}</strong> (ID: {safeUserId || 'Loading...'})</small>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#0d1f2f', border: '1px solid rgba(125, 211, 252, 0.22)', color: '#e0f2fe', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
            Lives: {'🧠'.repeat(lives)}{'💀'.repeat(Math.max(0, 5 - lives))}
          </div>
          <button onClick={() => { setActiveTab('play'); setActiveLevel(null); }} style={activeTab === 'play' ? activeTabStyle : navBtnStyle}>🎮 Play Arena</button>
          <button onClick={() => setActiveTab('performance')} style={activeTab === 'performance' ? activeTabStyle : navBtnStyle}>📊 My Performance</button>
          <button onClick={() => setActiveTab('settings')} style={activeTab === 'settings' ? activeTabStyle : navBtnStyle}>⚙️ Settings</button>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        {/* PLAY ARENA TAB */}
        {activeTab === 'play' && !activeLevel && (
          <div style={cardStyle}>
            <style>{selectorSetupResponsiveStyle}</style>
            {/* Lockout Warning Banner */}
            {isLockedOut && (
              <div style={lockoutBannerStyle}>
                <h3 style={{ margin: 0, color: '#f87171' }}>🧠❌ Out of Brain Lives!</h3>
                <p style={{ margin: '8px 0 0 0', color: '#fca5a5' }}>
                  You have 0 lives left. Game access is locked for approximately <strong>{hoursRemaining} hour(s)</strong>.
                </p>
              </div>
            )}

            <div className="student-setup-row">
              <div className="student-setup-controls">
            {/* Grade Level Display */}
            <div className="student-grade-setup" style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '10px' }}>1. Your Assigned Grade Level:</h3>
              <select value={selectedGrade} disabled style={lockedSelectStyle}>
                <option value="grade1">Grade 1</option>
                <option value="grade2">Grade 2</option>
                <option value="grade3">Grade 3</option>
                <option value="grade4">Grade 4</option>
                <option value="grade5">Grade 5</option>
                <option value="grade6">Grade 6</option>
              </select>
            </div>

            {/* Subject Selector */}
              <div className="student-subject-setup" style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#f8fafc', marginBottom: '10px' }}>2. Choose Subject:</h3>
              <div className="student-subject-buttons">
                {availableSubjects.map(subject => (
                  <button
                    key={subject.key}
                    onClick={() => setSelectedSubject(subject.key)}
                    style={{
                      ...subjectBtnStyle,
                      backgroundColor: selectedSubjectKey === subject.key ? '#38bdf8' : '#0f172a',
                      color: selectedSubjectKey === subject.key ? '#082f49' : '#94a3b8',
                      border: selectedSubjectKey === subject.key ? 'none' : '1px solid #334155'
                    }}
                  >
                    {subject.label === 'Math'
                      ? '📐 Math'
                      : subject.label === 'Science'
                        ? '🔬 Science'
                        : subject.label === 'Reading and Literacy'
                          ? '📚 Reading and Literacy'
                          : '📘 English'}
                  </button>
                ))}
              </div>
            </div>
              </div>

            <div className="student-selector-mascot" aria-hidden="true">
              <RobotMascot />
            </div>
            </div>

            {/* Level Selector */}
            <div>
              <h3 style={{ color: '#f8fafc', marginBottom: '15px' }}>3. Select Level (1–15):</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
                {levels.map(l => {
                  const isLevelLocked = l.level > unlockedLevel
                  const isDisabled = isLockedOut || isLevelLocked

                  const levelButton = (
                    <button
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

                  return <Fragment key={l.level}>{levelButton}</Fragment>
                })}
              </div>
            </div>
          </div>
        )}

        {/* GAME ARENA VIEW */}
        {activeTab === 'play' && activeLevel && (
          <GameArena
            grade={selectedGrade}
            subject={selectedSubjectKey}
            levelConfig={activeLevel}
            userId={safeUserId}
            onBack={() => {
              const savedLives = localStorage.getItem(`lives_${safeUserId}`)
              setLives(savedLives !== null ? Number(savedLives) : 5)
              const savedLockout = localStorage.getItem(`lockout_${safeUserId}`)
              setLockoutTime(savedLockout ? Number(savedLockout) : null)

              const savedUnlocked = localStorage.getItem(`unlocked_${safeUserId}_${selectedSubject.toLowerCase()}`)
              setUnlockedLevel(savedUnlocked ? Number(savedUnlocked) : 1)
              setActiveLevel(null)
            }}
          />
        )}

        {/* OTHER TABS */}
        {activeTab === 'performance' && <StudentPerformance user={safeUser} />}
        {activeTab === 'settings' && <StudentSettings user={safeUser} onLogout={onLogout} />}
      </div>
    </div>
  )
}

// Styling
const mainRobotStyle = {
  position: 'relative',
  width: '360px',
  height: '280px',
  bottom: '-10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  animation: 'robotDance 2.6s ease-in-out infinite',
  filter: 'drop-shadow(0 16px 28px rgba(14, 165, 233, 0.25))'
}

const robotHeadStyle = {
  position: 'relative',
  width: '190px',
  height: '120px',
  background: 'linear-gradient(180deg, #d9f99d 0%, #8fe6f8 100%)',
  border: '5px solid #1d4ed8',
  borderRadius: '36px 36px 28px 28px',
  boxShadow: 'inset 0 -10px 0 rgba(59, 130, 246, 0.15)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '12px'
}

const robotAntennaStyle = {
  position: 'absolute',
  top: '-28px',
  width: '10px',
  height: '32px',
  borderRadius: '999px',
  background: '#1d4ed8'
}

const robotEyeRowStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '22px',
  marginTop: '8px'
}

const robotEyeStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: '#0f172a',
  boxShadow: '0 0 0 7px rgba(255,255,255,0.7)',
  animation: 'robotBlink 2.8s infinite'
}

const robotMouthStyle = {
  position: 'absolute',
  bottom: '18px',
  width: '70px',
  height: '20px',
  borderBottom: '6px solid #0f172a',
  borderRadius: '0 0 20px 20px'
}

const robotBodyStyle = {
  position: 'relative',
  width: '220px',
  height: '120px',
  marginTop: '8px',
  background: 'linear-gradient(180deg, #a5b4fc 0%, #7dd3fc 100%)',
  border: '5px solid #1d4ed8',
  borderRadius: '24px 24px 18px 18px',
  boxShadow: 'inset 0 -12px 0 rgba(29,78,216,0.14)'
}

const robotArmStyle = {
  position: 'absolute',
  width: '16px',
  height: '76px',
  top: '14px',
  background: '#1d4ed8',
  borderRadius: '999px',
  transformOrigin: 'center top',
  boxShadow: 'inset 0 -8px 0 rgba(255,255,255,0.18)'
}

const robotPanelStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '56px',
  height: '36px',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, #34d399 0%, #22d3ee 100%)',
  boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.28)'
}

const robotWheelRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '260px',
  marginTop: '-2px',
  padding: '0 12px'
}

const robotWheelStyle = {
  width: '56px',
  height: '56px',
  background: 'radial-gradient(circle at 35% 35%, #e2e8f0 0%, #475569 38%, #0f172a 100%)',
  borderRadius: '50%',
  border: '5px solid #020617',
  boxShadow: 'inset 0 0 0 8px rgba(255,255,255,0.12)'
}

const cardStyle = { background: 'linear-gradient(180deg, rgba(16, 38, 61, 0.88) 0%, rgba(10, 24, 36, 0.82) 100%)', padding: '30px', borderRadius: '12px', boxShadow: '0 14px 32px rgba(14, 165, 233, 0.12)', border: '1px solid rgba(125, 211, 252, 0.18)', position: 'relative', overflow: 'hidden' }
const lockoutBannerStyle = { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '15px 20px', borderRadius: '10px', marginBottom: '25px', textAlign: 'center' }
const navBtnStyle = { backgroundColor: 'transparent', color: '#bfdbfe', border: '1px solid rgba(125, 211, 252, 0.22)', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
const activeTabStyle = { background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.96) 0%, rgba(56, 189, 248, 0.92) 100%)', color: '#082f49', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 8px 20px rgba(56, 189, 248, 0.2)' }
const lockedSelectStyle = { padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(125, 211, 252, 0.22)', fontSize: '1rem', width: '240px', backgroundColor: 'rgba(9, 24, 36, 0.78)', color: '#bfdbfe', cursor: 'not-allowed', fontWeight: '600' }
const subjectBtnStyle = { padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }
const selectorSetupResponsiveStyle = `
  .student-setup-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 90px;
    align-items: center;
    gap: 20px;
  }
  .student-setup-controls { min-width: 0; }
  .student-subject-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    width: 100%;
  }
  .student-selector-mascot {
    position: relative;
    width: 90px;
    height: 150px;
    justify-self: center;
    grid-column: 2;
    grid-row: 1;
    align-self: center;
  }
  .student-selector-mascot > div {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%) scale(0.52);
    transform-origin: bottom center;
  }
  @media (max-width: 760px) {
    .student-setup-row {
      grid-template-columns: minmax(0, 1fr) 72px;
      gap: 12px;
    }
    .student-selector-mascot { width: 72px; }
    .student-subject-buttons { gap: 8px; }
  }
`
const selectorRobotWrapStyle = { position: 'relative', width: '120px', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', filter: 'drop-shadow(0 12px 12px rgba(42, 164, 255, 0.18))' }
const selectorRobotStyle = { position: 'relative', width: '92px', height: '120px', animation: 'robotDance 2.6s ease-in-out infinite' }
const selectorRobotHeadStyle = { position: 'relative', width: '76px', height: '52px', background: 'linear-gradient(180deg, #d9f99d 0%, #a5f3fc 100%)', border: '3px solid #1d4ed8', borderRadius: '12px 12px 10px 10px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }
const selectorRobotAntennaStyle = { position: 'absolute', top: '-16px', width: '6px', height: '18px', background: '#1d4ed8', borderRadius: '999px' }
const selectorRobotEyesStyle = { display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginTop: '4px' }
const selectorRobotEyeStyle = { width: '8px', height: '8px', borderRadius: '50%', background: '#0f172a', display: 'inline-block', animation: 'robotBlink 2.8s infinite' }
const selectorRobotMouthStyle = { position: 'absolute', bottom: '8px', width: '24px', height: '8px', borderBottom: '3px solid #0f172a', borderRadius: '0 0 12px 12px' }
const selectorRobotBodyStyle = { position: 'relative', width: '82px', height: '46px', margin: '8px auto 0', background: 'linear-gradient(180deg, #a5b4fc 0%, #7dd3fc 100%)', border: '3px solid #1d4ed8', borderRadius: '12px', boxShadow: 'inset 0 -6px 0 rgba(29,78,216,0.12)' }
const selectorRobotArmStyle = { position: 'absolute', width: '9px', height: '28px', top: '8px', background: '#1d4ed8', borderRadius: '999px', transformOrigin: 'center top' }
const selectorRobotPanelStyle = { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '28px', height: '16px', borderRadius: '6px', background: 'linear-gradient(135deg, #34d399 0%, #22d3ee 100%)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.25)' }
const selectorRobotWheelsStyle = { display: 'flex', justifyContent: 'space-between', width: '78px', margin: '0 auto' }
const selectorRobotWheelStyle = { display: 'inline-block', width: '18px', height: '18px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #e2e8f0 0%, #475569 38%, #0f172a 100%)', border: '2px solid #020617' }

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
