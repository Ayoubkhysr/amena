import { useMemo } from 'react'
import { IconChartBar, IconStar, IconTrending, IconPackage } from '../../../components/admin'
import type { Product } from '../../../context/StoreContext'
import type { Order } from '../admincommandes/AdminCommandes'

type AdminRapportsProps = {
  activeSection: string
  orders: Order[]
  products: Product[]
}

function monthLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

export function AdminRapports({ activeSection, orders, products }: AdminRapportsProps) {

  // ── Monthly sales data ─────────────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map = new Map<string, { month: string; revenue: number; orders: number; avgBasket: number }>()
    orders.forEach(o => {
      const key = o.date.slice(0, 7) // "2026-04"
      const label = monthLabel(o.date)
      const existing = map.get(key)
      if (existing) {
        existing.revenue += o.total
        existing.orders += 1
      } else {
        map.set(key, { month: label, revenue: o.total, orders: 1, avgBasket: 0 })
      }
    })
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({ ...v, avgBasket: Math.round(v.revenue / v.orders) }))
  }, [orders])

  const maxRevenue = useMemo(() => Math.max(...monthlyData.map(m => m.revenue), 1), [monthlyData])

  // ── Top products data ──────────────────────────────────────────────────
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; unitsSold: number; revenue: number }>()
    orders.forEach(o => {
      (o.items ?? []).forEach(item => {
        const existing = map.get(item.name)
        if (existing) {
          existing.unitsSold += item.qty
          existing.revenue += item.qty * item.price
        } else {
          map.set(item.name, { name: item.name, unitsSold: item.qty, revenue: item.qty * item.price })
        }
      })
    })
    return [...map.values()].sort((a, b) => b.revenue - a.revenue)
  }, [orders])

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const totalOrders = orders.length
  const avgBasket = totalOrders ? Math.round(totalRevenue / totalOrders) : 0
  const totalUnits = topProducts.reduce((s, p) => s + p.unitsSold, 0)

  // ── Ventes par période ─────────────────────────────────────────────────
  if (activeSection === 'rapports-ventes') {
    return (
      <div className="space-y-6 animate-admin-panel-in">
        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Chiffre d\'affaires', value: `${totalRevenue} TND`, Icon: IconTrending, color: 'text-brand-blue' },
            { label: 'Total commandes', value: totalOrders, Icon: IconChartBar, color: 'text-brand-blue' },
            { label: 'Panier moyen', value: `${avgBasket} TND`, Icon: IconChartBar, color: 'text-green-600' },
            { label: 'Produits vendus', value: `${totalUnits} unités`, Icon: IconPackage, color: 'text-amber-600' },
          ].map(s => (
            <article key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-brand-light">
                <s.Icon className="h-5 w-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.label}</h3>
              </div>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </article>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider flex items-center gap-2">
                <IconChartBar className="h-5 w-5" /> Chiffre d'affaires par mois
              </h3>
              <p className="mt-1 text-xs text-slate-500">Revenus agrégés par mois sur l'ensemble des commandes.</p>
            </div>
          </div>

          {monthlyData.length > 0 ? (
            <div className="flex items-end gap-4 overflow-x-auto pb-4" style={{ minHeight: '220px' }}>
              {monthlyData.map((m) => {
                const barHeight = Math.max(8, Math.round((m.revenue / maxRevenue) * 180))
                return (
                  <div key={m.month} className="flex flex-col items-center gap-2 flex-1 min-w-[80px] group">
                    <div className="relative flex flex-col items-center w-full">
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-blue px-2 py-1 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                        {m.revenue} TND
                      </div>
                      {/* Bar */}
                      <div
                        className="w-full max-w-[60px] rounded-t-xl bg-gradient-to-t from-brand-blue to-brand-light transition-all duration-500 shadow-sm"
                        style={{ height: `${barHeight}px` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 text-center capitalize leading-snug">{m.month}</span>
                    <span className="text-[11px] font-bold text-brand-blue">{m.revenue} TND</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <IconChartBar className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Aucune donnée de vente disponible.</p>
            </div>
          )}
        </div>

        {/* Monthly Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-brand-blue uppercase tracking-wider">Détail mensuel</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="px-4 py-3 rounded-tl-lg">Mois</th>
                  <th className="px-4 py-3">Commandes</th>
                  <th className="px-4 py-3">Chiffre d'affaires</th>
                  <th className="px-4 py-3 rounded-tr-lg">Panier moyen</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((m, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-brand-blue capitalize">{m.month}</td>
                    <td className="px-4 py-3 text-slate-700">{m.orders}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{m.revenue} TND</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">{m.avgBasket} TND</td>
                  </tr>
                ))}
                {monthlyData.length === 0 && (
                  <tr><td colSpan={4} className="py-12 text-center text-slate-400 text-sm">Aucune donnée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ── Produits les plus vendus ───────────────────────────────────────────
  if (activeSection === 'rapports-produits') {
    const maxUnits = topProducts.length ? topProducts[0].unitsSold : 1

    return (
      <div className="space-y-6 animate-admin-panel-in">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: 'Références vendues', value: topProducts.length, color: 'text-brand-blue' },
            { label: 'Unités écoulées', value: totalUnits, color: 'text-green-600' },
            { label: 'CA produits', value: `${totalRevenue} TND`, color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-brand-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className={`mt-1 text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Ranked visual bars */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-brand-blue uppercase tracking-wider flex items-center gap-2">
            <IconStar className="h-5 w-5 text-amber-400" /> Classement des produits
          </h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => {
              const barW = Math.max(4, Math.round((p.unitsSold / maxUnits) * 100))
              const medals = ['🥇', '🥈', '🥉']
              return (
                <div key={p.name} className="flex items-center gap-4">
                  <span className="w-6 shrink-0 text-center text-lg">{medals[i] ?? <span className="text-xs font-bold text-slate-400">#{i + 1}</span>}</span>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-700 truncate">{p.name}</span>
                      <span className="shrink-0 text-xs font-semibold text-slate-500">{p.unitsSold} unités · {p.revenue} TND</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-light transition-all duration-700"
                        style={{ width: `${barW}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            {topProducts.length === 0 && (
              <div className="flex flex-col items-center py-16 text-slate-400">
                <IconStar className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">Aucune donnée de vente par produit.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-brand-blue uppercase tracking-wider">Tableau détaillé</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="px-4 py-3 rounded-tl-lg">Rang</th>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Stock restant</th>
                  <th className="px-4 py-3">Unités vendues</th>
                  <th className="px-4 py-3 rounded-tr-lg">Revenus générés</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => {
                  const product = products.find(pr => pr.name === p.name)
                  return (
                    <tr key={p.name} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-500">#{i + 1}</td>
                      <td className="px-4 py-3 font-bold text-brand-blue">
                        <div className="flex items-center gap-3">
                          {product?.imageUrl && (
                            <img src={product.imageUrl} alt={p.name} className="h-8 w-8 rounded-lg object-cover border border-slate-200" />
                          )}
                          {p.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {product ? (
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${product.stock === 0 ? 'bg-red-100 text-red-600' : product.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {product.stock} restants
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{p.unitsSold}</td>
                      <td className="px-4 py-3 font-bold text-green-600">{p.revenue} TND</td>
                    </tr>
                  )
                })}
                {topProducts.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">Aucune donnée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return null
}
