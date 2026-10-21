import React, { Suspense, lazy, useEffect, useState } from 'react'
import bgImage from './assets/portal-background.jpg'
import logoImage from './assets/TCM-Logo.jpg'
import { keepSessionAlive, releaseSession } from './session'

// Logins
const StudentLogin = lazy(() => import('./portals/student/StudentLogin'))
const TeacherLogin = lazy(() => import('./portals/teacher/TeacherLogin'))
const AdminLogin = lazy(() => import('./portals/admin/AdminLogin'))

// Dashboards
const StudentDashboard = lazy(() => import('./portals/student/StudentDashboard'))
const TeacherDashboard = lazy(() => import('./portals/teacher/TeacherDashboard'))
const AdminDashboard = lazy(() => import('./portals/admin/AdminDashboard'))

export default function App() {
  const [activePortal, setActivePortal] = useState('student')
  const [user, setUser] = useState(null)
  const [sessionError, setSessionError] = useState('')
  const normalizedUserRole = String(user?.role || '').toLowerCase()

  useEffect(() => {
    if (!user) return undefined
    return keepSessionAlive(user, () => {
      setUser(null)
      setActivePortal('student')
    })
  }, [user])

  const handleLogout = async () => {
    setSessionError('')
    try {
      await releaseSession(user)
      setUser(null)
      setActivePortal('student')
    } catch (error) {
      console.error('Could not release sign-in session:', error)
      setSessionError('Could not sign out from the server. Check your connection and try again.')
    }
  }

  const globalStyles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      :root {
        --edu-sky: #7dd3fc;
        --edu-sky-strong: #38bdf8;
        --edu-sky-deep: #0ea5e9;
        --edu-sky-soft: rgba(125, 211, 252, 0.18);
        --edu-deep: #071722;
        --edu-panel: rgba(12, 27, 39, 0.8);
        --edu-panel-alt: rgba(15, 34, 56, 0.72);
        --edu-border: rgba(148, 163, 184, 0.24);
        --edu-surface: rgba(15, 23, 42, 0.72);
      }

      * {
        box-sizing: border-box;
      }

      body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        min-width: 100%;
        height: 100%;
        min-height: 100%;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        overflow-x: hidden;
        background: radial-gradient(circle at top, #0b2236 0%, #071722 52%, #040d16 100%);
        color: #f8fafc;
      }

      select option {
        color: #0f172a !important;
        background-color: #ffffff !important;
      }

      input:focus, select:focus {
        outline: none !important;
        border-color: var(--edu-sky) !important;
        box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.2) !important;
      }

      button {
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      button:hover {
        transform: translateY(-2px);
        filter: brightness(1.08);
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  )

  if (user) {
    return (
      <Suspense fallback={<div role="status" style={{ padding: 24, color: '#e2e8f0' }}>Loading portal…</div>}>
        {globalStyles}
        {sessionError && <p role="alert" style={{ position: 'fixed', zIndex: 10, top: 12, left: '50%', transform: 'translateX(-50%)', margin: 0, padding: '10px 16px', borderRadius: 8, color: '#fecaca', background: '#7f1d1d' }}>{sessionError}</p>}
        {(normalizedUserRole === 'student' || normalizedUserRole === 'students') && <StudentDashboard user={user} onLogout={handleLogout} />}
        {(normalizedUserRole === 'teacher' || normalizedUserRole === 'teachers') && <TeacherDashboard user={user} onLogout={handleLogout} />}
        {(normalizedUserRole === 'admin' || normalizedUserRole === 'administrator' || normalizedUserRole === 'admins') && <AdminDashboard user={user} onLogout={handleLogout} />}
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<div role="status" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#e2e8f0' }}>Loading portal…</div>}>
    <div style={fullScreenContainerStyle}>
      {globalStyles}
      <div style={dimOverlayStyle} />

      {/* FULL-WIDTH TOP HEADER */}
      <header style={topHeaderStyle}>
        <div style={brandContainerStyle}>
          {/* OFFICIAL COLLEGE OF MAASIN LOGO */}
          <img 
            src={logoImage} 
            alt="The College of Maasin Logo" 
            style={collegeLogoStyle} 
          />
          <div>
            <h1 style={headerTitleStyle}>The College of Maasin</h1>
            <p style={headerSubtitleStyle}>Learning Management Portal</p>
          </div>
        </div>

        {/* TOP PORTAL SWITCHER BUTTONS */}
        <div style={topTabGroupStyle}>
          <button 
            onClick={() => setActivePortal('student')} 
            style={activePortal === 'student' ? activeTabStyle : inactiveTabStyle}
          >
            🎓 Student Portal
          </button>
          <button 
            onClick={() => setActivePortal('teacher')} 
            style={activePortal === 'teacher' ? activeTabStyle : inactiveTabStyle}
          >
            🏫 Teacher Portal
          </button>
          <button 
            onClick={() => setActivePortal('admin')} 
            style={activePortal === 'admin' ? activeTabStyle : inactiveTabStyle}
          >
            ⚙️ Admin Portal
          </button>
        </div>
      </header>

      {/* CENTER WORKSPACE */}
      <main style={mainWorkspaceStyle}>
        <div style={transparentGlassPanelStyle}>
          {activePortal === 'student' && (
            <StudentLogin onLoginSuccess={setUser} />
          )}

          {activePortal === 'teacher' && (
            <TeacherLogin onLoginSuccess={setUser} />
          )}

          {activePortal === 'admin' && (
            <AdminLogin onLoginSuccess={setUser} />
          )}
        </div>
      </main>

      {/* INSTITUTIONAL FOOTER */}
      <footer style={bottomFooterStyle}>
        <div style={footerCollegeNameStyle}>The College of Maasin</div>
        <div style={footerMottoStyle}>"Nisi Dominus Frustra"</div>
        <div style={footerInfoRowStyle}>
          <span>📍 R. Kangleon Street, Maasin City, Southern Leyte, 6600</span>
        </div>
        <div style={footerInfoRowStyle}>
          <span>📞 053-570-8671</span>
        </div>
      </footer>
    </div>
    </Suspense>
  )
}

// ============================================================
// STYLES OBJECTS
// ============================================================

const fullScreenContainerStyle = {
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundImage: `url("${bgImage}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  color: '#ffffff'
}

const dimOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.75) 100%)',
  zIndex: 1
}

const topHeaderStyle = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  padding: '20px 48px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
  background: 'rgba(8, 23, 34, 0.7)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  flexWrap: 'wrap',
  gap: '16px'
}

const brandContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
}

const collegeLogoStyle = {
  width: '56px',
  height: '56px',
  objectFit: 'contain',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  padding: '2px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
}

const headerTitleStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '800',
  letterSpacing: '-0.02em',
  color: '#ffffff'
}

const headerSubtitleStyle = {
  margin: '2px 0 0',
  fontSize: '13px',
  color: '#94a3b8',
  fontWeight: '500'
}

const topTabGroupStyle = {
  display: 'flex',
  gap: '10px',
  background: 'rgba(255, 255, 255, 0.1)',
  padding: '6px',
  borderRadius: '14px',
  border: '1px solid rgba(255, 255, 255, 0.15)'
}

const activeTabStyle = {
  padding: '10px 20px',
  borderRadius: '10px',
  border: '1px solid rgba(125, 211, 252, 0.7)',
  background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.95) 0%, rgba(56, 189, 248, 0.92) 100%)',
  color: '#082f49',
  fontWeight: '800',
  fontSize: '13px',
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(56, 189, 248, 0.28)'
}

const inactiveTabStyle = {
  padding: '10px 20px',
  borderRadius: '10px',
  border: 'none',
  background: 'transparent',
  color: '#cbd5e1',
  fontWeight: '600',
  fontSize: '13px',
  cursor: 'pointer'
}

const mainWorkspaceStyle = {
  position: 'relative',
  zIndex: 2,
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 20px'
}

const transparentGlassPanelStyle = {
  width: '100%',
  maxWidth: '520px',
  padding: '40px',
  borderRadius: '24px',
  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.82) 0%, rgba(8, 23, 34, 0.8) 100%)',
  border: '1px solid rgba(125, 211, 252, 0.2)',
  boxShadow: '0 30px 60px rgba(2, 6, 23, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
}

const bottomFooterStyle = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  padding: '18px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
  background: 'rgba(15, 23, 42, 0.75)',
  textAlign: 'center',
  gap: '4px'
}

const footerCollegeNameStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#f8fafc',
  letterSpacing: '0.01em'
}

const footerMottoStyle = {
  fontSize: '13px',
  fontStyle: 'italic',
  color: '#cbd5e1',
  marginBottom: '4px'
}

const footerInfoRowStyle = {
  fontSize: '13px',
  color: '#e2e8f0',
  fontWeight: '400',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
}
