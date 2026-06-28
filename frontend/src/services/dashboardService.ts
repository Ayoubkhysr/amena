const API_BASE = import.meta.env.VITE_API_URL ?? ''

export type DashboardStats = {
  totalSales: number
  ordersToday: number
  newClients: number
  lowStockCount: number
}

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText)
  throw new Error(message || `Erreur API (${res.status})`)
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/api/dashboard/stats`)
  if (!res.ok) await parseError(res)
  return res.json()
}


