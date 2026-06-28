import { useState, useMemo, useEffect } from 'react'
import { IconEye, IconUsers, Pagination } from '../../../components/admin'

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



type ClientSortKey = 'id' | 'name' | 'date' | 'status'
type SortOrder = 'asc' | 'desc'

const compareClients = (a: Client, b: Client, sortBy: ClientSortKey, order: SortOrder) => {
  let cmp = 0
  switch (sortBy) {
    case 'id':
      cmp = a.id.localeCompare(b.id, 'fr', { numeric: true, sensitivity: 'base' })
      break
    case 'name':
      cmp = a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
      break
    case 'date':
      cmp = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
      if (isNaN(cmp)) cmp = a.registrationDate.localeCompare(b.registrationDate)
      break
    case 'status':
      cmp = a.status.localeCompare(b.status, 'fr', { sensitivity: 'base' })
      break
  }
  return order === 'asc' ? cmp : -cmp
}

function ClientsListToolbar({
  searchName,
  searchEmail,
  searchStatus,
  sortBy,
  sortOrder,
  onSearchNameChange,
  onSearchEmailChange,
  onSearchStatusChange,
  onSortByChange,
  onSortOrderChange,
  onReset,
}: {
  searchName: string
  searchEmail: string
  searchStatus: string
  sortBy: ClientSortKey
  sortOrder: SortOrder
  onSearchNameChange: (val: string) => void
  onSearchEmailChange: (val: string) => void
  onSearchStatusChange: (val: string) => void
  onSortByChange: (val: ClientSortKey) => void
  onSortOrderChange: (val: SortOrder) => void
  onReset: () => void
}) {
  const hasFilters = Boolean(searchName.trim() || searchEmail.trim() || searchStatus)
  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recherche et tri</p>
        {hasFilters ? (
          <button type="button" onClick={onReset} className="text-xs font-bold text-brand-blue hover:text-brand-light">Réinitialiser</button>
        ) : null}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Nom du client</label>
          <input type="text" value={searchName} onChange={(e) => onSearchNameChange(e.target.value)} placeholder="Ex: Jean Dupont" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Email</label>
          <input type="text" value={searchEmail} onChange={(e) => onSearchEmailChange(e.target.value)} placeholder="Ex: jean@email.com" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Statut</label>
          <select value={searchStatus} onChange={(e) => onSearchStatusChange(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none">
            <option value="">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Trier par</label>
          <select value={sortBy} onChange={(e) => onSortByChange(e.target.value as ClientSortKey)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none">
            <option value="date">Date d'inscription</option>
            <option value="name">Nom</option>
            <option value="id">ID</option>
            <option value="status">Statut</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Ordre</label>
          <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value as SortOrder)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none">
            <option value="desc">Décroissant</option>
            <option value="asc">Croissant</option>
          </select>
        </div>
      </div>
    </div>
  )
}

import { fetchUsersPage, toUiClient } from '../../../services/userService'

export function AdminClients({ activeSection, orders, handleEditClient }: { activeSection: string, orders: OrderType[], clients?: Client[], handleEditClient?: (c: Client) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Client | null>(null)

  // States for clients list
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [sortBy, setSortBy] = useState<ClientSortKey>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const [serverClients, setServerClients] = useState<Client[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  const isClientsList = activeSection === 'clients-liste'

  useEffect(() => {
    if (!isClientsList) return
    setLoading(true)

    const apiSortBy = sortBy === 'date' ? 'createdAt' : sortBy === 'name' ? 'firstName' : 'id'
    const searchQuery = searchName.trim() || searchEmail.trim() || undefined
    const apiRole = searchStatus || undefined // we mapped 'Actif' / 'Inactif' in backend

    fetchUsersPage(currentPage - 1, itemsPerPage, searchQuery, apiRole, apiSortBy, sortOrder)
      .then(page => {
        setServerClients(page.content.map(toUiClient))
        setTotalElements(page.totalElements)
        setTotalPages(page.totalPages)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))

  }, [currentPage, searchName, searchEmail, searchStatus, sortBy, sortOrder, isClientsList])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchName, searchEmail, searchStatus, sortBy, sortOrder])


  const resetListFilters = () => {
    setSearchName('')
    setSearchEmail('')
    setSearchStatus('')
    setSortBy('date')
    setSortOrder('desc')
  }

  // States for purchase history
  const [historySearch, setHistorySearch] = useState('')
  const [historySort, setHistorySort] = useState<'totalSpent' | 'totalOrders'>('totalSpent')
  const [historyOrder, setHistoryOrder] = useState<SortOrder>('desc')
  const [historyPage, setHistoryPage] = useState(1)
  const historyItemsPerPage = 6

  useEffect(() => {
    setHistoryPage(1)
  }, [historySearch, historySort, historyOrder])

  // For history, since the backend doesn't have an endpoint for this yet,
  // we could just fetch page 0 of users or mock it. To keep the existing
  // UI working, we'll just show the `serverClients` we fetched, or refetch
  // all users (not ideal). We will reuse `serverClients` for now.
  const filteredHistoryClients = useMemo(() => {
    let result = serverClients;
    const query = historySearch.trim().toLowerCase()
    if (query) {
      result = result.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query))
    }

    return [...result].sort((a, b) => {
      let cmp = 0;
      if (historySort === 'totalSpent') cmp = a.totalSpent - b.totalSpent
      else cmp = a.totalOrders - b.totalOrders
      return historyOrder === 'asc' ? cmp : -cmp
    })
  }, [serverClients, historySearch, historySort, historyOrder]);

  const paginatedHistoryClients = useMemo(() => {
    const start = (historyPage - 1) * historyItemsPerPage
    return filteredHistoryClients.slice(start, start + historyItemsPerPage)
  }, [filteredHistoryClients, historyPage])

  if (activeSection === 'clients-liste') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">Liste des clients</h3>
          <span className="text-xs font-medium text-slate-500">{totalElements} inscrit(s) {loading && '(Chargement...)'}</span>
        </header>
        <ClientsListToolbar
          searchName={searchName}
          searchEmail={searchEmail}
          searchStatus={searchStatus}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearchNameChange={setSearchName}
          onSearchEmailChange={setSearchEmail}
          onSearchStatusChange={setSearchStatus}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onReset={resetListFilters}
        />
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
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Chargement des données...</td></tr>
              ) : serverClients.map((client) => {
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
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalElements}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    )
  }

  if (activeSection === 'clients-historique') {
    return (
      <div className="space-y-6">
        <header className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">Historique d'achat par client</h3>
        </header>
        
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="mb-1 block text-xs font-semibold text-slate-600">Rechercher un client</label>
              <input type="text" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} placeholder="Nom ou email..." className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <div className="w-full md:w-48">
              <label className="mb-1 block text-xs font-semibold text-slate-600">Trier par</label>
              <select value={historySort} onChange={(e) => setHistorySort(e.target.value as 'totalSpent'|'totalOrders')} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none">
                <option value="totalSpent">Total dépensé</option>
                <option value="totalOrders">Nombre de commandes</option>
              </select>
            </div>
            <div className="w-full md:w-48">
              <label className="mb-1 block text-xs font-semibold text-slate-600">Ordre</label>
              <select value={historyOrder} onChange={(e) => setHistoryOrder(e.target.value as SortOrder)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-blue focus:outline-none">
                <option value="desc">Décroissant</option>
                <option value="asc">Croissant</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {paginatedHistoryClients.map((client) => {
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
        
        {filteredHistoryClients.length > historyItemsPerPage && (
          <div className="mt-6">
            <Pagination
              currentPage={historyPage}
              totalPages={Math.ceil(filteredHistoryClients.length / historyItemsPerPage)}
              onPageChange={setHistoryPage}
              totalItems={filteredHistoryClients.length}
              itemsPerPage={historyItemsPerPage}
            />
          </div>
        )}
      </div>
    )
  }

  return null;
}
