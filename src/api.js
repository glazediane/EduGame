import { getActiveSession } from './session.js'

// Add the current sign-in proof to every application API call.
export function apiRequest(path, options = {}) {
  const fetchOptions = { credentials: 'same-origin', ...options }
  const headers = new Headers(fetchOptions.headers || {})
  const session = getActiveSession()
  if (session?.userId && session?.role && session?.sessionToken) {
    headers.set('X-EduGame-User', session.userId)
    headers.set('X-EduGame-Role', session.role)
    headers.set('X-EduGame-Session', session.sessionToken)
  }
  fetchOptions.headers = headers
  return fetch(path, fetchOptions)
}

// Lightweight API helper for JSON endpoints.
export async function apiFetch(path, options = {}) {
  const response = await apiRequest(path, options)

  const contentType = response.headers.get('content-type') || ''
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`API request failed: ${response.status} ${response.statusText} ${text}`)
  }

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export default apiFetch
