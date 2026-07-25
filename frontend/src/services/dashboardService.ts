import { DashboardService } from '../generated'
import type { DashboardStatsResponse } from '../generated'

export type DashboardStats = DashboardStatsResponse

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return DashboardService.getDashboardStats()
}
