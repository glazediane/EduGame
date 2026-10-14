const storageKey = (role, userId) =>
  `edugame_session_${String(role || '').trim().toLowerCase()}_${encodeURIComponent(String(userId || '').trim().toLowerCase())}`

export function getStoredSessionToken(role, userId) {
  return localStorage.getItem(storageKey(role, userId)) || ''
}

export function rememberSession(user) {
  if (!user?.sessionToken || !user?.userId || !user?.role) return
  localStorage.setItem(storageKey(user.role, user.userId), user.sessionToken)
}

export function clearStoredSession(user) {
  if (!user?.userId || !user?.role) return
  localStorage.removeItem(storageKey(user.role, user.userId))
}

export function releaseSession(user) {
  const sessionToken = getStoredSessionToken(user?.role, user?.userId)
  clearStoredSession(user)

  if (!sessionToken) return
  fetch('/edugame_api/logout.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.userId, role: user.role, sessionToken }),
    keepalive: true
  }).catch((error) => console.error('Could not release sign-in session:', error))
}

export function keepSessionAlive(user, onExpired) {
  const sessionToken = user?.sessionToken || getStoredSessionToken(user?.role, user?.userId)
  if (!user?.userId || !user?.role || !sessionToken) return () => {}

  let stopped = false
  let checking = false
  const checkSession = async () => {
    if (stopped || checking) return
    checking = true
    try {
      const response = await fetch('/edugame_api/session_heartbeat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, role: user.role, sessionToken })
      })
      if (response.status === 401 && !stopped) {
        clearStoredSession(user)
        onExpired()
      }
    } catch (error) {
      console.error('Could not refresh sign-in session:', error)
    } finally {
      checking = false
    }
  }

  checkSession()
  const intervalId = window.setInterval(checkSession, 5_000)
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') checkSession()
  }
  const handlePageHide = (event) => {
    // Keep a page restored from the back/forward cache signed in.
    if (!event.persisted) releaseSession(user)
  }
  document.addEventListener('visibilitychange', handleVisibility)
  window.addEventListener('pagehide', handlePageHide)

  return () => {
    stopped = true
    window.clearInterval(intervalId)
    document.removeEventListener('visibilitychange', handleVisibility)
    window.removeEventListener('pagehide', handlePageHide)
  }
}
