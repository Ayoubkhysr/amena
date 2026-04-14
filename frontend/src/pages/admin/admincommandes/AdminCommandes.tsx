import React, { useState } from 'react'
import { IconClipboard, IconArchive, IconTrending, IconSettings, IconPackage } from '../../../components/admin'

export type OrderStatus = 'En attente' | 'Préparée' | 'Livrée' | 'Retournée'

export type OrderItem = {
  name: string
  qty: number
  price: number
}

export type Order = {
  id: number
  client: string
  total: number
  statut: OrderStatus
  date: string
  address: string
  items: OrderItem[]
}

export type AdminCommandesProps = {
  orders: Order[]
  activeSection: string
  handleOrderStatus: (id: number, newStatus: OrderStatus) => void
}

export function AdminCommandes({ orders, activeSection, handleOrderStatus }: AdminCommandesProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedOrderId(prev => prev === id ? null : id)
  }

  let filteredOrders = orders;
  if (activeSection === 'commandes-attente') {
    filteredOrders = orders.filter(o => o.statut === 'En attente');
  } else if (activeSection === 'commandes-expediees') {
    filteredOrders = orders.filter(o => o.statut === 'Livrée');
  } else if (activeSection === 'commandes-retours') {
    filteredOrders = orders.filter(o => o.statut === 'Retournée');
  }

  const getTitle = () => {
    switch (activeSection) {
      case 'commandes-toutes': return 'Toutes les commandes'
      case 'commandes-attente': return 'Commandes en attente'
      case 'commandes-expediees': return 'Commandes expédiées'
      case 'commandes-retours': return 'Retours & remboursements'
      default: return 'Commandes'
    }
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-brand-surface py-24 text-center">
        <IconClipboard className="h-8 w-8 text-Brand-light mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-brand-blue">Aucune commande trouvée</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Il n'y a aucune commande dans cette catégorie pour le moment.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-admin-panel-in">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">{getTitle()}</h3>
        <span className="text-xs font-medium text-slate-500">{filteredOrders.length} résultat(s)</span>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
              <th className="px-4 py-3 rounded-tl-lg">ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="border-b border-slate-100 last:border-none transition duration-150 hover:bg-slate-50">
                  <td className="px-4 py-4 font-bold text-brand-blue">#{order.id}</td>
                  <td className="px-4 py-4 text-slate-500">{order.date}</td>
                  <td className="px-4 py-4 font-medium text-slate-700">{order.client}</td>
                  <td className="px-4 py-4 font-semibold text-brand-blue">{order.total} TND</td>
                  <td className="px-4 py-4">
                    <select
                      onClick={(e) => e.stopPropagation()}
                      value={order.statut}
                      onChange={(e) => handleOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`rounded-full px-3 py-1 font-bold text-xs uppercase cursor-pointer outline-none border transition-colors ${
                        order.statut === 'Livrée' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' :
                        order.statut === 'En attente' ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' :
                        order.statut === 'Retournée' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' :
                        'bg-brand-blue/10 text-brand-blue border-brand-blue/20 hover:bg-brand-blue/20'
                      }`}
                    >
                      <option value="En attente" className="text-amber-700">En attente</option>
                      <option value="Préparée" className="text-brand-blue">Préparée</option>
                      <option value="Livrée" className="text-green-700">Livrée</option>
                      <option value="Retournée" className="text-red-700">Retournée</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleExpand(order.id)}
                        className={`p-2 rounded-lg transition-colors inline-flex ${expandedOrderId === order.id ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-brand-blue bg-slate-50 hover:bg-slate-200'}`} 
                        title="Voir détails"
                      >
                        <IconClipboard className="h-4 w-4" />
                      </button>
                      <button className="text-slate-400 hover:text-red-500 p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" title="Archiver">
                        <IconArchive className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <td colSpan={6} className="p-0">
                      <div className="px-6 py-5 animate-admin-panel-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Détails de Livraison</h4>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="font-semibold text-brand-blue">{order.client}</p>
                                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{order.address}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Articles commandés</h4>
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                  <table className="min-w-full text-xs text-left">
                                      <thead className="bg-slate-50 border-b border-slate-100">
                                          <tr>
                                              <th className="px-4 py-2 text-slate-500 font-semibold">Produit</th>
                                              <th className="px-4 py-2 text-slate-500 font-semibold text-center">Qté</th>
                                              <th className="px-4 py-2 text-slate-500 font-semibold text-right">Total</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {order.items.map((item, idx) => (
                                              <tr key={idx} className="border-b border-slate-50 last:border-none">
                                                  <td className="px-4 py-3 font-medium text-slate-700 flex items-center gap-2">
                                                    <IconPackage className="h-3 w-3 text-brand-light" />
                                                    {item.name}
                                                  </td>
                                                  <td className="px-4 py-3 text-center text-slate-600 font-semibold">{item.qty}</td>
                                                  <td className="px-4 py-3 text-right font-semibold text-brand-blue">{item.qty * item.price} TND</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                      <tfoot className="bg-slate-50 border-t border-slate-200">
                                        <tr>
                                            <td colSpan={2} className="px-4 py-3 font-bold text-slate-600 text-right">Frais Livraison:</td>
                                            <td className="px-4 py-3 font-bold text-slate-700 text-right">10 TND</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} className="px-4 py-3 font-extrabold text-brand-blue text-right uppercase tracking-wider">Total Final:</td>
                                            <td className="px-4 py-3 font-extrabold text-brand-blue text-right text-sm">{order.total} TND</td>
                                        </tr>
                                      </tfoot>
                                  </table>
                                </div>
                            </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
