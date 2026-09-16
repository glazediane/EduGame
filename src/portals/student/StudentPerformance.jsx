import { useState, useEffect } from 'react';
import { apiFetch } from '../../api';

export default function StudentPerformance({ user }) {
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectSummary, setSubjectSummary] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPerformance = () => {
    if (!user?.userId) return;

    setLoading(true);
    Promise.all([
      apiFetch(`/edugame_api/get_performance.php?user_id=${user.userId}`),
      apiFetch(`/edugame_api/get_subject_summary.php?user_id=${user.userId}`),
      apiFetch(`/edugame_api/get_leaderboard.php?user_id=${user.userId}`)
    ])
      .then(([performanceRes, summaryRes, leaderboardRes]) => {
        if (performanceRes && performanceRes.success) {
          setPerformanceData(performanceRes.data || []);
        }
        if (summaryRes && summaryRes.success) {
          setSubjectSummary(summaryRes.data || []);
        }
        if (leaderboardRes && leaderboardRes.success) {
          setLeaderboard(leaderboardRes.leaderboard || []);
        }
      })
      .catch(err => console.error('Error loading performance:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPerformance();

    const handleProgressUpdate = () => loadPerformance();
    window.addEventListener('eduGameProgressUpdated', handleProgressUpdate);

    return () => {
      window.removeEventListener('eduGameProgressUpdated', handleProgressUpdate);
    };
  }, [user?.userId]);

  const totalLevelsCompleted = performanceData.length;
  const totalScoreEarned = performanceData.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const bestLevel = performanceData.reduce((best, curr) => Math.max(best, Number(curr.level) || 0), 0);
  const userRank = leaderboard.findIndex(entry => entry.userId === user?.userId) + 1 || 'N/A';

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Loading performance records...</div>;
  }

  return (
    <div style={{ background: 'linear-gradient(180deg, #10263d 0%, #0d1f2f 100%)', padding: '30px', borderRadius: '12px', border: '1px solid rgba(125, 211, 252, 0.22)' }}>
      <h2 style={{ color: 'white', marginTop: 0 }}>📊 My Game Performance</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#0d1f2f', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ color: '#bfdbfe', margin: 0 }}>Levels Completed</h4>
          <h1 style={{ color: '#38bdf8', margin: '10px 0 0 0' }}>{totalLevelsCompleted}</h1>
        </div>
        <div style={{ backgroundColor: '#0d1f2f', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ color: '#bfdbfe', margin: 0 }}>Total Score</h4>
          <h1 style={{ color: '#22c55e', margin: '10px 0 0 0' }}>{totalScoreEarned} pts</h1>
        </div>
        <div style={{ backgroundColor: '#0d1f2f', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ color: '#bfdbfe', margin: 0 }}>Best Level</h4>
          <h1 style={{ color: 'var(--edu-sky)', margin: '10px 0 0 0' }}>Level {bestLevel || 0}</h1>
        </div>
        <div style={{ backgroundColor: '#0d1f2f', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ color: '#bfdbfe', margin: 0 }}>Rank</h4>
          <h1 style={{ color: '#f472b6', margin: '10px 0 0 0' }}>#{userRank}</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#0d1f2f', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: 'white', marginTop: 0 }}>📚 Subject Summary</h3>
          {subjectSummary.length === 0 ? (
            <p style={{ color: '#94a3b8', margin: 0 }}>No subject data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subjectSummary.map(item => (
                <div key={item.subject} style={{ backgroundColor: '#12253b', borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', marginBottom: '6px' }}>
                    <strong style={{ textTransform: 'capitalize' }}>{item.subject}</strong>
                    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{item.totalScore} pts</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    Highest level: {item.highestLevel} • Completed: {item.levelsCompleted}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#0d1f2f', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: 'white', marginTop: 0 }}>🏆 Leaderboard</h3>
          {leaderboard.length === 0 ? (
            <p style={{ color: '#94a3b8', margin: 0 }}>No leaderboard data yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.userId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', backgroundColor: index === 0 ? '#1b3650' : '#12253b', color: 'white' }}>
                  <span>#{index + 1} {entry.name}</span>
                  <strong style={{ color: 'var(--edu-sky)' }}>{entry.totalScore} pts</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {performanceData.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
          <h3>No records found yet!</h3>
          <p>Complete a game level in the Play Arena to log your first score.</p>
        </div>
      ) : (
        <table style={{ width: '100%', color: 'white', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>Subject</th>
              <th style={{ padding: '10px' }}>Level</th>
              <th style={{ padding: '10px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '10px', textTransform: 'capitalize' }}>{item.subject}</td>
                <td style={{ padding: '10px' }}>Level {item.level}</td>
                <td style={{ padding: '10px', color: '#22c55e', fontWeight: 'bold' }}>{item.score} pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}