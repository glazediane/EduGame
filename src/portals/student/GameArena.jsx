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
  const [confettiPieces, setConfettiPieces] = useState([])
  const [robotMood, setRobotMood] = useState('idle')
  const [robotMessage, setRobotMessage] = useState('You can do it! Let’s learn together!')
  const [robotWave, setRobotWave] = useState(false)

  const createConfetti = () =>
    Array.from({ length: 42 }, (_, index) => ({
      id: `${index}-${Date.now()}`,
      left: Math.random() * 100,
      delay: `${(index % 8) * 0.08}s`,
      color: ['#f97316', '#22c55e', '#38bdf8', '#facc15', '#f472b6', '#a78bfa'][index % 6],
      duration: `${1.8 + (index % 6) * 0.22}s`
    }))

  useEffect(() => {
    if (isCompleted) {
      setRobotMood('happy')
      setRobotMessage('Congratulations! Level complete! You did great!')
      return
    }

    if (feedback.startsWith('✅')) {
      setRobotMood('happy')
      setRobotMessage('Amazing! You nailed it!')
      return
    }

    if (feedback.startsWith('❌')) {
      setRobotMood('thinking')
      setRobotMessage('Oops! Let’s try again together.')
      return
    }

    setRobotMood('idle')
    setRobotMessage('You can do it! Let’s learn together!')
  }, [feedback, isCompleted])

  const speakAnnouncement = (text) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.98
    utterance.pitch = 1.15
    window.speechSynthesis.speak(utterance)
  }

  const playTone = (type = 'correct') => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return

    const audioContext = new AudioCtx()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    if (type === 'correct') {
      oscillator.type = 'triangle'
      oscillator.frequency.value = 660
      gainNode.gain.value = 0.045
    } else if (type === 'wrong') {
      oscillator.type = 'sawtooth'
      oscillator.frequency.value = 180
      gainNode.gain.value = 0.04
    } else if (type === 'level') {
      oscillator.type = 'triangle'
      oscillator.frequency.value = 880
      gainNode.gain.value = 0.06
    }

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + (type === 'level' ? 0.42 : 0.18))

    setTimeout(() => audioContext.close(), 250)
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
      setRobotMood('happy')
      setRobotWave(true)
      setRobotMessage('Fantastic! You got it!')
      setIsCelebrating(true)
      setCelebrationBurst(['⭐', '🎉', '✨', '🌟', '🎊'])
      setConfettiPieces(createConfetti())
      playTone('correct')

      setTimeout(() => {
        setFeedback('')
        setIsCelebrating(false)
        setCelebrationBurst([])
        setConfettiPieces([])
        setRobotWave(false)
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
        setRobotMood('sad')
        setRobotMessage('Oh no! I need a quick break, but we can try again later.')
        playTone('wrong')
      } else {
        setFeedback('❌ Incorrect answer! Try again.')
        setActiveHint(currentQ.hint || 'Review the options carefully and choose the correct answer.')
        setRobotMood('thinking')
        setRobotMessage('Almost there! Let’s look closely and try again.')
        playTone('wrong')
      }
    }
  }

  // Complete level & unlock the next level in localStorage + save DB progress
  const finishLevel = (finalScore = score) => {
    setIsCompleted(true)
    setRobotMood('happy')
    setRobotWave(true)
    setRobotMessage('Congratulations! You did great!')
    setConfettiPieces(createConfetti())
    setIsCelebrating(true)
    playTone('level')
    speakAnnouncement('Congratulations! You did great!')

    setTimeout(() => {
      setIsCelebrating(false)
      setConfettiPieces([])
      setRobotWave(false)
    }, 2200)

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

        @keyframes robotBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes robotBlink {
          0%, 45%, 47%, 100% { transform: scaleY(1); opacity: 1; }
          46% { transform: scaleY(0.1); opacity: 0.6; }
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(56, 189, 248, 0.0); }
          50% { box-shadow: 0 0 18px rgba(56, 189, 248, 0.45); }
        }

        @keyframes armWaveLeft {
          0% { transform: rotate(22deg); }
          100% { transform: rotate(-28deg) translateY(-4px); }
        }

        @keyframes armWaveRight {
          0% { transform: rotate(-22deg); }
          100% { transform: rotate(28deg) translateY(-4px); }
        }

        @keyframes confettiFall {
          0% {
            transform: translate3d(0, -12px, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(18px, 115vh, 0) rotate(540deg);
            opacity: 0.7;
          }
        }
      `}</style>
      {(isCelebrating || isCompleted) && confettiPieces.length > 0 && (
        <div style={confettiOverlayStyle}>
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              style={{
                ...confettiPieceStyle,
                left: `${piece.left}%`,
                background: piece.color,
                animationDelay: piece.delay,
                animationDuration: piece.duration
              }}
            />
          ))}
        </div>
      )}
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

          <div style={robotStageStyle}>
            <div
              style={{
                ...robotWrapperStyle,
                ...(robotMood === 'happy' ? robotHappyStyle : robotMood === 'thinking' ? robotThinkingStyle : robotMood === 'sad' ? robotSadStyle : robotIdleStyle),
                animation: 'robotBob 2.2s ease-in-out infinite'
              }}
            >
              <div style={robotHeadStyle}>
                <div style={robotAntennaStyle} />
                <div style={robotFaceStyle}>
                  <span style={{ ...robotEyeStyle, animation: 'robotBlink 3.6s infinite' }} />
                  <span style={{ ...robotEyeStyle, animation: 'robotBlink 3.6s infinite 0.2s' }} />
                  <div style={robotMouthStyle} />
                </div>
              </div>
              <div style={robotBodyStyle}>
                <div
                  style={{
                    ...robotArmStyleLeft,
                    animation: robotWave ? 'armWaveLeft 0.75s ease-in-out infinite alternate' : 'none'
                  }}
                />
                <div
                  style={{
                    ...robotArmStyleRight,
                    animation: robotWave ? 'armWaveRight 0.75s ease-in-out infinite alternate' : 'none'
                  }}
                />
                <div style={robotPanelStyle} />
              </div>
            </div>
          </div>

          <div style={mascotBubbleStyle}>{robotMessage}</div>

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
const confettiOverlayStyle = { position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }
const confettiPieceStyle = { position: 'absolute', top: '-10px', width: '10px', height: '18px', borderRadius: '3px', opacity: 0.9, animation: 'confettiFall linear forwards' }
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '12px', gap: '8px', flexWrap: 'wrap', color: '#0f172a', fontWeight: 700 }
const cardStyle = { background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', padding: '30px', borderRadius: '18px', textAlign: 'center', boxShadow: '0 10px 25px rgba(14, 116, 144, 0.12)', border: '1px solid #cbd5e1', color: '#0f172a' }
const badgeStyle = { display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', color: 'white', padding: '8px 14px', borderRadius: '999px', fontWeight: '700', fontSize: '0.8rem', marginBottom: '10px' }
const robotStageStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '18px 0 12px' }
const robotWrapperStyle = { position: 'relative', width: '160px', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '24px', background: 'linear-gradient(180deg, #dbeafe 0%, #e0f2fe 100%)', border: '2px solid rgba(14, 165, 233, 0.3)', animation: 'glowPulse 2s ease-in-out infinite' }
const robotHappyStyle = { background: 'linear-gradient(180deg, #dcfce7 0%, #d9f99d 100%)', borderColor: '#4ade80' }
const robotThinkingStyle = { background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)', borderColor: '#fbbf24' }
const robotSadStyle = { background: 'linear-gradient(180deg, #fee2e2 0%, #fecaca 100%)', borderColor: '#f87171' }
const robotIdleStyle = { background: 'linear-gradient(180deg, #dbeafe 0%, #e0f2fe 100%)', borderColor: '#7dd3fc' }
const robotHeadStyle = { position: 'relative', width: '92px', height: '78px', borderRadius: '18px', background: '#e2e8f0', border: '3px solid #475569', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px' }
const robotAntennaStyle = { position: 'absolute', top: '-18px', width: '6px', height: '18px', background: '#475569', borderRadius: '999px' }
const robotFaceStyle = { width: '72px', height: '46px', borderRadius: '12px', background: '#f8fafc', border: '2px solid #64748b', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 10px' }
const robotEyeStyle = { width: '12px', height: '12px', background: '#0f172a', borderRadius: '50%' }
const robotMouthStyle = { position: 'absolute', bottom: '8px', left: '50%', width: '26px', height: '10px', transform: 'translateX(-50%)', borderBottom: '4px solid #0f172a', borderRadius: '0 0 20px 20px' }
const robotBodyStyle = { position: 'relative', width: '115px', height: '70px', marginTop: '10px', borderRadius: '18px', background: '#334155', border: '3px solid #1e293b' }
const robotArmStyleLeft = { position: 'absolute', left: '-12px', top: '18px', width: '12px', height: '28px', background: '#475569', borderRadius: '999px', transform: 'rotate(22deg)', transformOrigin: 'center top' }
const robotArmStyleRight = { position: 'absolute', right: '-12px', top: '18px', width: '12px', height: '28px', background: '#475569', borderRadius: '999px', transform: 'rotate(-22deg)', transformOrigin: 'center top' }
const robotPanelStyle = { position: 'absolute', left: '50%', top: '50%', width: '38px', height: '24px', transform: 'translate(-50%, -50%)', borderRadius: '8px', background: 'linear-gradient(135deg, #22c55e 0%, #38bdf8 100%)', boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.4)' }
const mascotBubbleStyle = { display: 'inline-block', marginBottom: '12px', padding: '9px 14px', background: '#ecfeff', color: '#0f172a', borderRadius: '999px', border: '1px solid #bae6fd', fontSize: '0.82rem', fontWeight: '600', maxWidth: '100%' }
const visualStyle = { fontSize: '3rem', margin: '14px 0 8px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70px', background: 'linear-gradient(135deg, #ecfeff 0%, #fef3c7 100%)', borderRadius: '16px', border: '1px solid #bae6fd' }
const optionBtnStyle = { width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: '700', textAlign: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.06)', color: '#0f172a' }
const backBtnStyle = { padding: '6px 12px', backgroundColor: '#334155', color: '#f8fafc', border: 'none', borderRadius: '6px', cursor: 'pointer' }
const btnStyle = { padding: '10px 20px', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
const hintBoxStyle = { marginTop: '12px', padding: '12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'left' }
const celebrationStyle = { marginTop: '14px', padding: '8px 12px', borderRadius: '999px', background: 'linear-gradient(135deg, #fef3c7 0%, #bbf7d0 100%)', color: '#166534', fontWeight: '800' }
const burstStyle = { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px', fontSize: '1.4rem', minHeight: '32px' }
const burstItemStyle = { animation: 'popBurst 0.7s ease-out forwards', transform: 'translateY(0)' }
