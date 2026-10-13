import { useState, useEffect } from 'react'
import { getQuestionsForLevel } from '../../questions'

const getQuestionText = (question) => question?.q || question?.question || 'Question'
const getQuestionVisual = (question) => question?.visual || question?.emoji || ''

export default function GameArena({ grade, subject, levelConfig, userId, onBack }) {
  const userGrade = (grade || 'grade1').toLowerCase()
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
  const [score, setScore] = useState(0)
  const [stars, setStars] = useState(0)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [celebrationBurst, setCelebrationBurst] = useState([])

  const playTone = (type = 'correct') => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return

    const audioContext = new AudioCtx()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = type === 'correct' ? 'triangle' : 'sawtooth'
    oscillator.frequency.value = type === 'correct' ? 660 : 180

    gainNode.gain.value = 0.04
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.18)

    setTimeout(() => audioContext.close(), 200)
  }

  // Fetch Questions
  useEffect(() => {
    setLoading(true)

    try {
      const localQuestions = getQuestionsForLevel(userGrade, (subject || 'math').toLowerCase(), currentLevel)
      setQuestions(localQuestions || [])
    } catch (error) {
      console.error('Failed to load local questions:', error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }, [userGrade, subject, currentLevel, userId])

  const currentQ = questions[currentIndex]
  const questionText = getQuestionText(currentQ)
  const questionVisual = getQuestionVisual(currentQ)
  const choiceIcons = currentQ?.optionIcons || []
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0

  useEffect(() => {
    if (!questions.length) {
      setFeedback('')
      setActiveHint('')
    }
  }, [questions.length])

  const handleAnswer = (selectedOption) => {
    if (lives <= 0 || !currentQ) return

    const correctAnswer = currentQ.a || currentQ.answer

    if (selectedOption === correctAnswer) {
      const nextScore = score + 1
      const nextStars = stars + 1
      setScore(nextScore)
      setStars(nextStars)
      setFeedback('✅ Correct! Proceeding to next question...')
      setActiveHint('')
      setWrongAttempts([])
      setIsCelebrating(true)
      setCelebrationBurst(['⭐', '🎉', '✨', '🌟', '🎊'])
      playTone('correct')

      setTimeout(() => {
        setFeedback('')
        setIsCelebrating(false)
        setCelebrationBurst([])
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1)
        } else {
          finishLevel(nextScore)
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
        playTone('wrong')
      } else {
        setFeedback('❌ Incorrect answer! Try again.')
        setActiveHint(currentQ.hint || 'Review the options carefully and choose the correct answer.')
        playTone('wrong')
      }
    }
  }

  // Complete level & unlock the next level in localStorage + save DB progress
  const finishLevel = (finalScore = score) => {
    setIsCompleted(true)

    // Unlock next level for this subject
    const storageKey = `unlocked_${userId}_${subject.toLowerCase()}`
    const currentUnlocked = Number(localStorage.getItem(storageKey)) || 1
    if (currentLevel >= currentUnlocked) {
      localStorage.setItem(storageKey, currentLevel + 1)
    }

    // Score is the number of correct answers; each correct answer = 1 point.
    fetch('/edugame_api/save_progress.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subject,
        level: currentLevel,
        difficulty: levelConfig?.difficulty || 'easy',
        score: Number(finalScore) || 0,
        totalQuestions: questions.length
      })
    })
      .then(async (response) => {
        let payload = null
        try {
          payload = await response.json()
        } catch {
          payload = null
        }

        if (!response.ok || (payload && payload.success === false)) {
          console.error('Save failed:', payload || response.statusText)
          return
        }

        window.dispatchEvent(new CustomEvent('eduGameProgressUpdated', {
          detail: { userId, subject, level: currentLevel, score: Number(finalScore) || 0 }
        }))
      })
      .catch((err) => console.error('Save failed:', err))
  }

  if (lockoutTime) {
    const hoursRemaining = Math.ceil(20 - (Date.now() - lockoutTime) / (1000 * 60 * 60))
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ fontSize: '3rem' }}>🧠❌</div>
          <h2 style={{ color: '#B91C1C', margin: '15px 0' }}>Out of lives. Come back later!</h2>
          <p style={{ color: '#334155', marginBottom: '20px' }}>
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
          <h3 style={{ color: '#0f172a' }}>⏳ Loading level questions...</h3>
        </div>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: '#B91C1C' }}>⚠️ No questions available</h2>
          <p style={{ color: '#334155', margin: '10px 0 20px' }}>
            This level could not load. Please try again or return to the arena.
          </p>
          <button onClick={onBack} style={btnStyle}>Return to Arena</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes popBurst {
          0% {
            transform: scale(0.5) translateY(8px);
            opacity: 0;
          }
          50% {
            transform: scale(1.25) translateY(-4px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(-10px);
            opacity: 0.8;
          }
        }
      `}</style>
      <div style={containerStyle}>
      {/* Header Bar */}
      <div style={headerStyle}>
        <button onClick={onBack} style={backBtnStyle}>← Exit Level</button>
        <span><strong>Subject:</strong> {subject}</span>
        <span><strong>Level:</strong> {currentLevel}</span>
        <span><strong>Stars:</strong> {'⭐'.repeat(stars || 0)}{stars === 0 ? '🌟' : ''}</span>
        <span>
          <strong>Lives:</strong> {'🧠'.repeat(lives)}{'💀'.repeat(Math.max(0, 5 - lives))}
        </span>
      </div>

      {!isCompleted ? (
        <div style={cardStyle}>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#1E293B', marginBottom: '6px' }}>
              <span>Progress</span>
              <span>{Math.min(currentIndex + 1, questions.length)}/{questions.length}</span>
            </div>
            <div style={{ width: '100%', height: '12px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #22c55e 0%, #38bdf8 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '10px' }}>
            Question {currentIndex + 1} of {questions.length}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: '#0F172A', fontWeight: '700' }}>
            <span>Score: {score} pts</span>
            <span>Correct answers: {score}</span>
          </div>

          <div style={badgeStyle}>{currentQ?.reward || '🎉'} Mission</div>

          <div style={mascotBubbleStyle}>🐻‍❄️ I can do it! Let’s learn together!</div>

          {questionVisual && (
            <div style={visualStyle}>{questionVisual}</div>
          )}

          <h3 style={{ margin: '15px 0', color: '#1E293B', fontSize: '1.2rem', lineHeight: 1.5, textAlign: 'justify' }}>
            {questionText}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '20px' }}>
            {currentQ?.options?.map((opt, i) => {
              const optionValue = typeof opt === 'string' ? opt : opt.label || ''
              const isWrong = wrongAttempts.includes(optionValue)
              const optionEmoji = choiceIcons[i] || currentQ?.optionEmoji?.[i] || ''

              return (
                <button
                  key={i}
                  disabled={isWrong}
                  onClick={() => handleAnswer(optionValue)}
                  style={{
                    ...optionBtnStyle,
                    background: isWrong ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' : 'linear-gradient(135deg, #fef3c7 0%, #e0f2fe 100%)',
                    color: isWrong ? '#991B1B' : '#1E293B',
                    borderColor: isWrong ? '#FCA5A5' : '#93C5FD',
                    cursor: isWrong ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    minHeight: '58px',
                    fontSize: '1rem'
                  }}
                >
                  {optionEmoji && <span style={{ fontSize: '1.3rem' }}>{optionEmoji}</span>}
                  {isWrong ? `❌ ${optionValue}` : optionValue}
                </button>
              )
            })}
          </div>

          {isCelebrating && (
            <div style={{ marginTop: '14px' }}>
              <div style={celebrationStyle}>🎉 Great job! 🎉</div>
              <div style={burstStyle}>
                {celebrationBurst.map((item, index) => (
                  <span key={`${item}-${index}`} style={{ ...burstItemStyle, animationDelay: `${index * 100}ms` }}>{item}</span>
                ))}
              </div>
            </div>
          )}

          {feedback && <div style={{ marginTop: '15px', fontWeight: 'bold', color: feedback.startsWith('✅') ? '#166534' : '#991B1B' }}>{feedback}</div>}
          {activeHint && (
            <div style={hintBoxStyle}>
              <strong>🧩 Hint:</strong> {activeHint}
            </div>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ color: '#047857' }}>🎉 Level {currentLevel} Completed!</h2>
          <p style={{ fontSize: '1.1rem', margin: '15px 0', color: '#0f172a' }}>
            You earned <strong>{score}</strong> point{score === 1 ? '' : 's'} in this level.
          </p>
          <p style={{ fontSize: '1rem', margin: '10px 0 20px', color: '#334155' }}>
            Level {currentLevel + 1} is now unlocked!
          </p>
          <button onClick={onBack} style={btnStyle}>
            Continue to Arena
          </button>
        </div>
      )}
    </div>
    </>
  )
}

const containerStyle = { maxWidth: '700px', margin: '30px auto', fontFamily: 'Segoe UI, sans-serif', padding: '0 16px' }
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '12px', gap: '8px', flexWrap: 'wrap', color: '#0f172a', fontWeight: 700 }
const cardStyle = { background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', padding: '30px', borderRadius: '18px', textAlign: 'center', boxShadow: '0 10px 25px rgba(14, 116, 144, 0.12)', border: '1px solid #cbd5e1', color: '#0f172a' }
const badgeStyle = { display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', color: 'white', padding: '8px 14px', borderRadius: '999px', fontWeight: '700', fontSize: '0.8rem', marginBottom: '10px' }
const mascotBubbleStyle = { display: 'inline-block', marginBottom: '12px', padding: '8px 12px', background: '#ecfeff', color: '#0f172a', borderRadius: '999px', border: '1px solid #bae6fd', fontSize: '0.82rem', fontWeight: '600' }
const visualStyle = { fontSize: '3rem', margin: '14px 0 8px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70px', background: 'linear-gradient(135deg, #ecfeff 0%, #fef3c7 100%)', borderRadius: '16px', border: '1px solid #bae6fd' }
const optionBtnStyle = { width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: '700', textAlign: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.06)', color: '#0f172a' }
const backBtnStyle = { padding: '6px 12px', backgroundColor: '#334155', color: '#f8fafc', border: 'none', borderRadius: '6px', cursor: 'pointer' }
const btnStyle = { padding: '10px 20px', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
const hintBoxStyle = { marginTop: '12px', padding: '12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'left' }
const celebrationStyle = { marginTop: '14px', padding: '8px 12px', borderRadius: '999px', background: 'linear-gradient(135deg, #fef3c7 0%, #bbf7d0 100%)', color: '#166534', fontWeight: '800' }
const burstStyle = { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px', fontSize: '1.4rem', minHeight: '32px' }
const burstItemStyle = { animation: 'popBurst 0.7s ease-out forwards', transform: 'translateY(0)' }
