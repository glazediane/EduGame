import { apiRequest } from '../../api.js'
import { useEffect, useMemo, useState } from 'react'

const panel = { background: '#fff', borderRadius: 12, padding: 22, boxShadow: '0 4px 15px rgba(0,0,0,.05)', color: '#1e293b' }
const input = { padding: '9px 11px', border: '1px solid #cbd5e1', borderRadius: 7, background: '#fff', color: '#0f172a' }

export default function ReportAnalytics({ role, teacherId = '', assignedGrade = '' }) {
  const [filters, setFilters] = useState({ grade: role === 'teacher' ? assignedGrade : 'all', subject: 'all', from: '', to: '' })
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (role === 'teacher' && assignedGrade) setFilters((current) => ({ ...current, grade: assignedGrade }))
  }, [role, assignedGrade])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ role, subject: filters.subject, from: filters.from, to: filters.to })
    if (role === 'teacher') {
      params.set('teacher_id', teacherId)
      params.set('grade', assignedGrade || filters.grade)
    } else {
      params.set('grade', filters.grade)
    }
    setLoading(true)
    setError('')
    apiRequest(`/edugame_api/get_learning_report.php?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Unable to load report data.')
        setAttempts(data.attempts || [])
      })
      .catch((err) => { if (err.name !== 'AbortError') { setError(err.message || 'Server connection failed.'); setAttempts([]) } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [role, teacherId, assignedGrade, filters])

  const report = useMemo(() => {
    const students = new Map()
    const subjects = new Map()
    const days = new Map()
    let correct = 0
    let questions = 0
    attempts.forEach((attempt) => {
      const key = attempt.userId
      const student = students.get(key) || { userId: key, name: attempt.student || key, grade: attempt.grade, attempts: 0, correct: 0, questions: 0, levels: new Set() }
      student.attempts += 1
      student.correct += attempt.score
      student.questions += attempt.totalQuestions
      student.levels.add(`${attempt.subject}-${attempt.level}`)
      students.set(key, student)
      const subject = subjects.get(attempt.subject) || { name: attempt.subject, attempts: 0, correct: 0, questions: 0 }
      subject.attempts += 1; subject.correct += attempt.score; subject.questions += attempt.totalQuestions
      subjects.set(attempt.subject, subject)
      correct += attempt.score; questions += attempt.totalQuestions
      const day = String(attempt.attemptedAt || '').slice(0, 10)
      if (day) days.set(day, (days.get(day) || 0) + 1)
    })
    return { students: [...students.values()].map((student) => ({ ...student, levels: student.levels.size, accuracy: student.questions ? Math.round(student.correct * 100 / student.questions) : null })).sort((a, b) => b.attempts - a.attempts), subjects: [...subjects.values()].map((subject) => ({ ...subject, accuracy: subject.questions ? Math.round(subject.correct * 100 / subject.questions) : null })), accuracy: questions ? Math.round(correct * 100 / questions) : null, days: [...days.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-14) }
  }, [attempts])

  const exportCsv = () => {
    const headers = ['Student', 'User ID', 'Grade', 'Subject', 'Level', 'Difficulty', 'Correct', 'Questions', 'Accuracy', 'Attempted At']
    const rows = attempts.map((item) => [item.student, item.userId, item.grade, item.subject, item.level, item.difficulty, item.score, item.totalQuestions, item.totalQuestions ? `${Math.round(item.score * 100 / item.totalQuestions)}%` : '', item.attemptedAt])
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = 'learning_report.csv'; link.click(); URL.revokeObjectURL(url)
  }
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const metric = (title, value, color) => <div key={title} style={{ background: '#f1f5f9', borderRadius: 9, padding: 16 }}><div style={{ color: '#64748b', fontWeight: 700 }}>{title}</div><div style={{ fontSize: 27, fontWeight: 800, color }}>{value}</div></div>

  return <section style={panel}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div><h2 style={{ margin: 0, color: '#0f172a', fontWeight: 800 }}>📊 Reports &amp; Learning Analytics</h2><p style={{ color: '#475569', margin: '6px 0 0' }}>Completed game attempts, accuracy, and student activity.</p></div>
      <button type="button" onClick={exportCsv} disabled={!attempts.length} style={{ padding: '10px 15px', border: 0, borderRadius: 7, color: '#fff', background: '#0284c7', fontWeight: 700, cursor: attempts.length ? 'pointer' : 'not-allowed' }}>Export CSV</button>
    </div>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '20px 0' }}>
      {role === 'admin' && <select aria-label="Grade" value={filters.grade} onChange={(e) => setFilter('grade', e.target.value)} style={input}><option value="all">All grades</option>{[1,2,3,4,5,6].map((grade) => <option key={grade} value={`grade${grade}`}>Grade {grade}</option>)}</select>}
      {role === 'teacher' && <span style={{ ...input, background: '#f1f5f9' }}>Assigned class: {String(assignedGrade).replace('grade', 'Grade ')}</span>}
      <select aria-label="Subject" value={filters.subject} onChange={(e) => setFilter('subject', e.target.value)} style={input}><option value="all">All subjects</option><option value="math">Math</option><option value="science">Science</option><option value="english">English</option></select>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>From <input aria-label="From date" type="date" value={filters.from} onChange={(e) => setFilter('from', e.target.value)} style={input} /></label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>To <input aria-label="To date" type="date" value={filters.to} onChange={(e) => setFilter('to', e.target.value)} style={input} /></label>
    </div>
    {error && <p role="alert" style={{ padding: 12, color: '#991b1b', background: '#fee2e2', borderRadius: 7 }}>{error}</p>}
    {loading ? <p>Loading report…</p> : <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
        {metric('Active Students', report.students.length, '#0284c7')}{metric('Completed Attempts', attempts.length, '#7c3aed')}{metric('Average Accuracy', report.accuracy == null ? '—' : `${report.accuracy}%`, '#059669')}
      </div>
      {!attempts.length ? <p style={{ textAlign: 'center', color: '#475569', padding: 24 }}>No attempt data found for these filters. New completed games will be tracked from now on.</p> : <>
        {!!report.days.length && <div style={{ marginBottom: 22 }}><h3>Daily Activity</h3><div style={{ display: 'flex', alignItems: 'end', gap: 8, minHeight: 110, overflowX: 'auto' }}>{report.days.map(([day, count]) => <div key={day} title={`${day}: ${count} attempts`} style={{ minWidth: 34, textAlign: 'center', color: '#475569', fontSize: 11 }}><div style={{ height: Math.max(8, count / Math.max(...report.days.map((entry) => entry[1])) * 75), background: '#38bdf8', borderRadius: '5px 5px 0 0' }} /><span>{day.slice(5)}</span></div>)}</div></div>}
        <h3>Student Summary</h3><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}><thead><tr>{['Student','Grade','Attempts','Levels Played','Accuracy'].map((label) => <th key={label} style={th}>{label}</th>)}</tr></thead><tbody>{report.students.map((student) => <tr key={student.userId}><td style={td}>{student.name}<small style={{ display: 'block', color: '#64748b' }}>{student.userId}</small></td><td style={td}>{student.grade}</td><td style={td}>{student.attempts}</td><td style={td}>{student.levels}</td><td style={td}>{student.accuracy == null ? '—' : `${student.accuracy}%`}</td></tr>)}</tbody></table></div>
        <h3>Subject Summary</h3><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{report.subjects.map((subject) => <div key={subject.name} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 13, minWidth: 140 }}><b>{subject.name}</b><div>{subject.attempts} attempts</div><div>{subject.accuracy}% accuracy</div></div>)}</div>
        <h3>Recent Attempts</h3><div style={{ maxHeight: 330, overflow: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}><thead><tr>{['Student','Subject','Level','Score','Date'].map((label) => <th key={label} style={th}>{label}</th>)}</tr></thead><tbody>{attempts.slice(0, 100).map((attempt, index) => <tr key={`${attempt.userId}-${attempt.attemptedAt}-${index}`}><td style={td}>{attempt.student}</td><td style={td}>{attempt.subject}</td><td style={td}>{attempt.level}</td><td style={td}>{attempt.score}/{attempt.totalQuestions}{attempt.totalQuestions ? ` (${Math.round(attempt.score * 100 / attempt.totalQuestions)}%)` : ''}</td><td style={td}>{attempt.attemptedAt}</td></tr>)}</tbody></table></div>
      </>}
    </>}
  </section>
}

const th = { textAlign: 'left', padding: 10, background: '#f1f5f9', color: '#475569', position: 'sticky', top: 0 }
const td = { padding: 10, borderBottom: '1px solid #e2e8f0' }
