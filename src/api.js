// Lightweight API helper for fetching from backend PHP endpoints
export async function apiFetch(path, options = {}) {
  const fetchOptions = { credentials: 'same-origin', ...options }

  const response = await fetch(path, fetchOptions)

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
