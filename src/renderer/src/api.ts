import type { Spool, SpoolInput, Stats } from './types/filament'

const BASE = '/api'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${url} → ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  spools: {
    getAll: (): Promise<Spool[]> =>
      request(`${BASE}/spools`),

    getStats: (): Promise<Stats> =>
      request(`${BASE}/spools/stats`),

    add: (input: SpoolInput): Promise<Spool> =>
      request(`${BASE}/spools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      }),

    update: (id: number, input: SpoolInput): Promise<Spool> =>
      request(`${BASE}/spools/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      }),

    delete: (id: number): Promise<void> =>
      request(`${BASE}/spools/${id}`, { method: 'DELETE' })
  }
}
