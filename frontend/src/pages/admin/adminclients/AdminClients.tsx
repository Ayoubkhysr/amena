import { useState } from 'react'
import { IconEye, IconUsers } from '../../../components/admin'

export type Client = {
  id: string
  name: string
  email: string
  phone: string
  registrationDate: string
  totalOrders: number
  totalSpent: number
  status: 'Actif' | 'Inactif'
}

type OrderType = {
  id: number
  client: string
  total: number
  statut: 'En attente' | 'Préparée' | 'Livrée' | string
  date: string
}



export function AdminClients({ activeSection, orders, clients, handleEditClient }: { activeSection: string, orders: OrderType[], clients: Client[], handleEditClient?: (c: Client) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Client | null>(null)
  if (activeSection === 'clients-liste') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">Liste des clients</h3>
          <span className="text-xs font-medium text-slate-500">{clients.length} inscrits</span>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Inscription</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const isEditing = editingId === client.id;
                
                if (isEditing && editForm) {
                  return (
                  <tr key={client.id} className="border-b border-slate-200 bg-brand-blue/5">
                    <td className="px-4 py-4 font-semibold text-brand-blue">{client.id}</td>
                    <td className="px-4 py-4">
                      <input 
                        type="text" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-4 space-y-2">
                      <input 
                        type="email" 
                        value={editForm.email} 
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-brand-blue focus:outline-none"
                      />
                      <input 
                        type="text" 
                        value={editForm.phone} 
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-brand-blue focus:outline-none text-xs"
                        placeholder="Téléphone"
                      />
                    </td>
                    <td className="px-4 py-4 text-slate-600">{client.registrationDate}</td>
                    <td className="px-4 py-4">
                      <select 
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value as 'Actif'|'Inactif'})}
                        className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-brand-blue focus:outline-none"
                      >
                        <option>Actif</option>
                        <option>Inactif</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            if (handleEditClient) handleEditClient(editForm);
                            setEditingId(null);
                          }}
                          className="rounded-md bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-light transition-colors"
                        >
                          Sauver
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          Annul.
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                }

                return (
                <tr key={client.id} className="border-b border-slate-100 last:border-none transition duration-150 hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-brand-blue">{client.id}</td>
                  <td className="px-4 py-4 text-slate-700 font-medium">{client.name}</td>
                  <td className="px-4 py-4">
                    <p className="text-slate-700 font-semibold">{client.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{client.phone}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{client.registrationDate}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase font-extrabold ${
                      client.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => { setEditingId(client.id); setEditForm({...client}); }}
                      className="text-brand-light hover:text-brand-blue p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex items-center justify-center"
                      title="Modifier"
                    >
                      <IconEye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (activeSection === 'clients-historique') {
    return (
      <div className="space-y-6">
        <header className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">Historique d'achat par client</h3>
        </header>
        <div className="grid gap-5 xl:grid-cols-2">
          {clients.map((client) => {
            const clientOrders = orders.filter(o => o.client === client.name);
            return (
            <article key={client.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-5">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <IconUsers className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-blue text-base">{client.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Membre depuis {client.registrationDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-brand-blue">{client.totalSpent} TND</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{client.totalOrders} Achats globaux</p>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4">
                <h5 className="text-xs font-bold text-slate-500 mb-3">Dernières commandes actives</h5>
                {clientOrders.length > 0 ? (
                  <div className="space-y-2">
                    {clientOrders.map(order => (
                      <div key={order.id} className="flex justify-between items-center bg-slate-50/80 border border-slate-100 rounded-xl p-3 text-sm">
                        <span className="font-bold text-brand-blue">#{order.id}</span>
                        <span className="text-slate-500 text-xs">{order.date}</span>
                        <span className="font-semibold text-slate-700">{order.total} TND</span>
                        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                          order.statut === 'Livrée' ? 'bg-green-100 text-green-700' :
                          order.statut === 'En attente' ? 'bg-amber-100 text-amber-700' : 'bg-brand-blue/10 text-brand-blue'
                        }`}>
                          {order.statut}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                    <p className="text-sm font-medium">Aucune commande récente trouvée</p>
                  </div>
                )}
              </div>
            </article>
          )})}
        </div>
      </div>
    )
  }

  return null;
}
