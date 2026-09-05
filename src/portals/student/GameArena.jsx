import { useState, useEffect } from 'react'
import { getQuestionsForLevel } from '../../questions'

export default function GameArena({ grade, subject, levelConfig, userId, onBack }) {
  const userGrade = (grade || 'kinder').toLowerCase()
  const currentLevel = levelConfig?.level || 1

  const [lives, setLives] = useState(() => {
    const saved = localStorage.getItem(`lives_${userId}`)
    return saved !== null ? Number(saved) : 5
  })

  const [lockoutTime, setLockoutTime] = useState(() => {
    const saved = localStorage.getItem(`lockout_${userId}`)
    return saved ? Number(saved) : null
  })

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wrongAttempts, setWrongAttempts] = useState([])
  const [activeHint, setActiveHint] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch Questions
  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost/edugame_api/get_questions.php?userId=${userId}&subject=${subject}&level=${currentLevel}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.questions?.length > 0) {
          setQuestions(data.questions)
        } else {
          const fallbackQs = getQuestionsForLevel(userGrade, subject.toLowerCase(), currentLevel)
          setQuestions(fallbackQs || [])
        }
      })
      .catch(() => {
        const fallbackQs = getQuestionsForLevel(userGrade, subject.toLowerCase(), currentLevel)
        setQuestions(fallbackQs || [])
      })
      .finally(() => setLoading(false))
  }, [userGrade, subject, currentLevel, userId])

  const currentQ = questions[currentIndex]

  const handleAnswer = (selectedOption) => {
    if (lives <= 0 || !currentQ) return

    const correctAnswer = currentQ.a || currentQ.answer

    if (selectedOption === correctAnswer) {
      // Correct Answer -> Move to Next Question
      setFeedback('✅ Correct! Proceeding to next question...')
      setActiveHint('')
      setWrongAttempts([])

      setTimeout(() => {
        setFeedback('')
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1)
        } else {
          finishLevel()
        }
      }, 1000)
    } else {
      // Wrong Answer -> Lock this option, drop a life, require retry
      const newLives = lives - 1
      setLives(newLives)
      localStorage.setItem(`lives_${userId}`, newLives)
      setWrongAttempts((prev) => [...prev, selectedOption])

      if (newLives <= 0) {
        const now = Date.now()
        setLockoutTime(now)
        localStorage.setItem(`lockout_${userId}`, now)
      } else {
        setFeedback('❌ Incorrect answer! Try again.')
        setActiveHint(currentQ.hint || 'Review the options carefully and choose the correct answer.')
      }
    }
  }

  // Complete level & unlock the next level in localStorage + save DB progress
  const finishLevel = () => {
    setIsCompleted(true)

    // Unlock next level for this subject
    const storageKey = `unlocked_${userId}_${subject.toLowerCase()}`
    const currentUnlocked = Number(localStorage.getItem(storageKey)) || 1
    if (currentLevel >= currentUnlocked) {
      localStorage.setItem(storageKey, currentLevel + 1)
    }

    // Save to XAMPP API
    fetch('http://localhost/edugame_api/save_progress.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subject,
        level: currentLevel,
        difficulty: levelConfig?.difficulty || 'easy',
        score: questions.length,
        totalQuestions: questions.length
      })
    }).catch((err) => console.error('Save failed:', err))
  }

  if (lockoutTime) {
    const hoursRemaining = Math.ceil(20 - (Date.now() - lockoutTime) / (1000 * 60 * 60))
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '3rem' }}>🧠❌</div>
          <h2 style={{ color: '#DC2626', margin: '15px 0' }}>Out of lives. Come back later!</h2>
          <p style={{ color: '#64748B', marginBottom: '20px' }}>
            Locked for approximately <strong>{hoursRemaining} hour(s)</strong>.
          </p>
          <button onClick={onBack} style={btnStyle}>Exit Game</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h3>⏳ Loading level questions...</h3>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* Header Bar */}
      <div style={headerStyle}>
        <button onClick={onBack} style={backBtnStyle}>← Exit Level</button>
        <span><strong>Subject:</strong> {subject}</span>
        <span><strong>Level:</strong> {currentLevel}</span>
        <span>
          <strong>Lives:</strong> {'🧠'.repeat(lives)}{'💀'.repeat(Math.max(0, 5 - lives))}
        </span>
      </div>

      {!isCompleted ? (
        <div style={cardStyle}>
          <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '10px' }}>
            Question {currentIndex + 1} of {questions.length}
          </div>

          <h3 style={{ margin: '15px 0', color: '#1E293B', fontSize: '1.2rem' }}>
            {currentQ?.q || currentQ?.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            {currentQ?.options?.map((opt, i) => {
              const isWrong = wrongAttempts.includes(opt)
              return (
                <button
                  key={i}
                  disabled={isWrong}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    ...optionBtnStyle,
                    backgroundColor: isWrong ? '#FEE2E2' : '#F8FAFC',
                    color: isWrong ? '#991B1B' : '#1E293B',
                    borderColor: isWrong ? '#FCA5A5' : '#CBD5E1',
                    cursor: isWrong ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isWrong ? `❌ ${opt}` : opt}
                </button>
              )
            })}
          </div>

          {feedback && <div style={{ marginTop: '15px', fontWeight: 'bold', color: feedback.startsWith('✅') ? '#16A34A' : '#DC2626' }}>{feedback}</div>}
          {activeHint && (
            <div style={hintBoxStyle}>
              <strong>🧩 Hint:</strong> {activeHint}
            </div>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ color: '#059669' }}>🎉 Level {currentLevel} Completed!</h2>
          <p style={{ fontSize: '1.1rem', margin: '15px 0' }}>
            Level {currentLevel + 1} is now unlocked!
          </p>
          <button onClick={onBack} style={btnStyle}>
            Continue to Arena
          </button>
        </div>
      )}
    </div>
  )
}

const containerStyle = { maxWidth: '650px', margin: '30px auto', fontFamily: 'Segoe UI, sans-serif' }
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', backgroundColor: '#F1F5F9', borderRadius: '8px' }
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }
const optionBtnStyle = { width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: '600', textAlign: 'left' }
const backBtnStyle = { padding: '6px 12px', backgroundColor: '#64748B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
const btnStyle = { padding: '10px 20px', backgroundColor: '#0284C7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
const hintBoxStyle = { marginTop: '12px', padding: '12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'left' }