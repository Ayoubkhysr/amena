import { useState } from 'react'
import { IconTag, IconTrending, IconArchive, IconEye } from '../../../components/admin'

export type PromoCode = {
  id: string
  code: string
  discount: number
  expiresAt: string
  usageLimit: number
  usedCount: number
  status: 'Actif' | 'Inactif'
}

export type Offre = {
  id: string
  label: string
  category: string
  discount: number
  startsAt: string
  endsAt: string
  status: 'Actif' | 'Inactif'
}

type AdminPromotionsProps = {
  activeSection: string
  categories: string[]
  promoCodes: PromoCode[]
  offres: Offre[]
  handleAddPromoCode: (p: PromoCode) => void
  handleEditPromoCode: (p: PromoCode) => void
  handleDeletePromoCode: (id: string) => void
  handleAddOffre: (o: Offre) => void
  handleEditOffre: (o: Offre) => void
  handleDeleteOffre: (id: string) => void
}

const INPUT = 'w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none'
const BTN_PRIMARY = 'rounded-md bg-brand-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-light transition-colors'
const BTN_GHOST = 'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors'

export function AdminPromotions({
  activeSection, categories,
  promoCodes, offres,
  handleAddPromoCode, handleEditPromoCode, handleDeletePromoCode,
  handleAddOffre, handleEditOffre, handleDeleteOffre,
}: AdminPromotionsProps) {

  // ── Promo Codes state ──────────────────────────────────────────────────
  const [editingCodeId, setEditingCodeId] = useState<string | null>(null)
  const [editCodeForm, setEditCodeForm] = useState<PromoCode | null>(null)
  const [isAddingCode, setIsAddingCode] = useState(false)
  const [newCodeForm, setNewCodeForm] = useState<PromoCode>({
    id: '', code: '', discount: 10, expiresAt: '', usageLimit: 100, usedCount: 0, status: 'Actif'
  })

  // ── Offres state ───────────────────────────────────────────────────────
  const [editingOffreId, setEditingOffreId] = useState<string | null>(null)
  const [editOffreForm, setEditOffreForm] = useState<Offre | null>(null)
  const [isAddingOffre, setIsAddingOffre] = useState(false)
  const [newOffreForm, setNewOffreForm] = useState<Offre>({
    id: '', label: '', category: categories[0] ?? 'Autre', discount: 10,
    startsAt: new Date().toISOString().split('T')[0],
    endsAt: '', status: 'Actif',
  })

  // ── Codes promo ────────────────────────────────────────────────────────
  if (activeSection === 'promos-codes') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-admin-panel-in">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider flex items-center gap-2">
              <IconTag className="h-5 w-5" /> Codes promo
            </h3>
            <p className="mt-1 text-xs text-slate-500">Créez des codes de réduction à distribuer à vos clients.</p>
          </div>
          <button
            onClick={() => {
              setIsAddingCode(true)
              setNewCodeForm({ id: `PC${Date.now()}`, code: '', discount: 10, expiresAt: '', usageLimit: 100, usedCount: 0, status: 'Actif' })
            }}
            className={BTN_PRIMARY}
          >
            + Nouveau code
          </button>
        </header>

        {/* Stats cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total codes', value: promoCodes.length, color: 'text-brand-blue' },
            { label: 'Codes actifs', value: promoCodes.filter(c => c.status === 'Actif').length, color: 'text-green-600' },
            { label: 'Codes inactifs', value: promoCodes.filter(c => c.status === 'Inactif').length, color: 'text-slate-500' },
            { label: 'Utilisations totales', value: promoCodes.reduce((s, c) => s + c.usedCount, 0), color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-brand-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className={`mt-1 text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                <th className="px-4 py-3 rounded-tl-lg">Code</th>
                <th className="px-4 py-3">Réduction</th>
                <th className="px-4 py-3">Expiration</th>
                <th className="px-4 py-3">Utilisations</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isAddingCode && (
                <tr className="border-b border-slate-200 bg-brand-blue/5">
                  <td className="px-4 py-3">
                    <input type="text" placeholder="EX: PROMO20" value={newCodeForm.code}
                      onChange={e => setNewCodeForm({ ...newCodeForm, code: e.target.value.toUpperCase() })}
                      className={INPUT} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <input type="number" min={1} max={100} value={newCodeForm.discount}
                        onChange={e => setNewCodeForm({ ...newCodeForm, discount: +e.target.value })}
                        className="w-16 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none" />
                      <span className="text-slate-500 text-sm">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input type="date" value={newCodeForm.expiresAt}
                      onChange={e => setNewCodeForm({ ...newCodeForm, expiresAt: e.target.value })}
                      className={INPUT} />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min={1} value={newCodeForm.usageLimit}
                      onChange={e => setNewCodeForm({ ...newCodeForm, usageLimit: +e.target.value })}
                      className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none" />
                  </td>
                  <td className="px-4 py-3">
                    <select value={newCodeForm.status}
                      onChange={e => setNewCodeForm({ ...newCodeForm, status: e.target.value as 'Actif' | 'Inactif' })}
                      className={INPUT}>
                      <option>Actif</option>
                      <option>Inactif</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { if (newCodeForm.code) { handleAddPromoCode(newCodeForm); setIsAddingCode(false) } }} className={BTN_PRIMARY}>Ajouter</button>
                      <button onClick={() => setIsAddingCode(false)} className={BTN_GHOST}>Annuler</button>
                    </div>
                  </td>
                </tr>
              )}

              {promoCodes.map(code => {
                const isEditing = editingCodeId === code.id && editCodeForm
                if (isEditing && editCodeForm) {
                  return (
                    <tr key={code.id} className="border-b border-slate-200 bg-brand-blue/5">
                      <td className="px-4 py-3">
                        <input type="text" value={editCodeForm.code}
                          onChange={e => setEditCodeForm({ ...editCodeForm, code: e.target.value.toUpperCase() })}
                          className={INPUT} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <input type="number" min={1} max={100} value={editCodeForm.discount}
                            onChange={e => setEditCodeForm({ ...editCodeForm, discount: +e.target.value })}
                            className="w-16 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none" />
                          <span className="text-slate-500 text-sm">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input type="date" value={editCodeForm.expiresAt}
                          onChange={e => setEditCodeForm({ ...editCodeForm, expiresAt: e.target.value })}
                          className={INPUT} />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" min={1} value={editCodeForm.usageLimit}
                          onChange={e => setEditCodeForm({ ...editCodeForm, usageLimit: +e.target.value })}
                          className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none" />
                      </td>
                      <td className="px-4 py-3">
                        <select value={editCodeForm.status}
                          onChange={e => setEditCodeForm({ ...editCodeForm, status: e.target.value as 'Actif' | 'Inactif' })}
                          className={INPUT}>
                          <option>Actif</option>
                          <option>Inactif</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { handleEditPromoCode(editCodeForm); setEditingCodeId(null) }} className={BTN_PRIMARY}>Sauver</button>
                          <button onClick={() => setEditingCodeId(null)} className={BTN_GHOST}>Annuler</button>
                        </div>
                      </td>
                    </tr>
                  )
                }

                const usagePercent = code.usageLimit > 0 ? Math.min(100, Math.round((code.usedCount / code.usageLimit) * 100)) : 0

                return (
                  <tr key={code.id} className="border-b border-slate-100 last:border-none transition duration-150 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-brand-blue/10 px-3 py-1.5 font-mono text-sm font-bold text-brand-blue tracking-wider">
                        {code.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600">{code.discount}%</td>
                    <td className="px-4 py-3 text-slate-600">{code.expiresAt || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full rounded-full bg-brand-blue" style={{ width: `${usagePercent}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{code.usedCount}/{code.usageLimit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase font-extrabold ${code.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {code.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingCodeId(code.id); setEditCodeForm({ ...code }) }}
                          className="text-slate-400 hover:text-brand-blue p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" title="Modifier">
                          <IconEye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeletePromoCode(code.id)}
                          className="text-slate-400 hover:text-red-500 p-2 rounded-lg bg-slate-50 hover:bg-red-50 transition-colors inline-flex" title="Supprimer">
                          <IconArchive className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {promoCodes.length === 0 && !isAddingCode && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                    Aucun code promo. Cliquez sur «&nbsp;+ Nouveau code&nbsp;» pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ── Offres & Réductions ────────────────────────────────────────────────
  if (activeSection === 'promos-offres') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-admin-panel-in">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider flex items-center gap-2">
              <IconTrending className="h-5 w-5" /> Offres &amp; Réductions
            </h3>
            <p className="mt-1 text-xs text-slate-500">Appliquez des remises globales par catégorie de produits sur une période définie.</p>
          </div>
          <button
            onClick={() => {
              setIsAddingOffre(true)
              setNewOffreForm({
                id: `OF${Date.now()}`, label: '', category: categories[0] ?? 'Autre',
                discount: 10, startsAt: new Date().toISOString().split('T')[0], endsAt: '', status: 'Actif'
              })
            }}
            className={BTN_PRIMARY}
          >
            + Nouvelle offre
          </button>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: 'Offres actives', value: offres.filter(o => o.status === 'Actif').length, color: 'text-green-600' },
            { label: 'Total offres', value: offres.length, color: 'text-brand-blue' },
            { label: 'Remise maximale', value: offres.length ? `${Math.max(...offres.map(o => o.discount))}%` : '—', color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-brand-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className={`mt-1 text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                <th className="px-4 py-3 rounded-tl-lg">Label</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Remise</th>
                <th className="px-4 py-3">Période</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isAddingOffre && (
                <tr className="border-b border-slate-200 bg-brand-blue/5">
                  <td className="px-4 py-3">
                    <input type="text" placeholder="Ex: Promo printemps" value={newOffreForm.label}
                      onChange={e => setNewOffreForm({ ...newOffreForm, label: e.target.value })}
                      className={INPUT} />
                  </td>
                  <td className="px-4 py-3">
                    <select value={newOffreForm.category}
                      onChange={e => setNewOffreForm({ ...newOffreForm, category: e.target.value })}
                      className={INPUT}>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <input type="number" min={1} max={100} value={newOffreForm.discount}
                        onChange={e => setNewOffreForm({ ...newOffreForm, discount: +e.target.value })}
                        className="w-16 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none" />
                      <span className="text-slate-500 text-sm">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <input type="date" value={newOffreForm.startsAt}
                        onChange={e => setNewOffreForm({ ...newOffreForm, startsAt: e.target.value })}
                        className={INPUT} />
                      <input type="date" value={newOffreForm.endsAt}
                        onChange={e => setNewOffreForm({ ...newOffreForm, endsAt: e.target.value })}
                        className={INPUT} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select value={newOffreForm.status}
                      onChange={e => setNewOffreForm({ ...newOffreForm, status: e.target.value as 'Actif' | 'Inactif' })}
                      className={INPUT}>
                      <option>Actif</option>
                      <option>Inactif</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { if (newOffreForm.label) { handleAddOffre(newOffreForm); setIsAddingOffre(false) } }} className={BTN_PRIMARY}>Ajouter</button>
                      <button onClick={() => setIsAddingOffre(false)} className={BTN_GHOST}>Annuler</button>
                    </div>
                  </td>
                </tr>
              )}

              {offres.map(offre => {
                const isEditing = editingOffreId === offre.id && editOffreForm
                if (isEditing && editOffreForm) {
                  return (
                    <tr key={offre.id} className="border-b border-slate-200 bg-brand-blue/5">
                      <td className="px-4 py-3">
                        <input type="text" value={editOffreForm.label}
                          onChange={e => setEditOffreForm({ ...editOffreForm, label: e.target.value })}
                          className={INPUT} />
                      </td>
                      <td className="px-4 py-3">
                        <select value={editOffreForm.category}
                          onChange={e => setEditOffreForm({ ...editOffreForm, category: e.target.value })}
                          className={INPUT}>
                          {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <input type="number" min={1} max={100} value={editOffreForm.discount}
                            onChange={e => setEditOffreForm({ ...editOffreForm, discount: +e.target.value })}
                            className="w-16 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none" />
                          <span className="text-slate-500 text-sm">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <input type="date" value={editOffreForm.startsAt}
                            onChange={e => setEditOffreForm({ ...editOffreForm, startsAt: e.target.value })}
                            className={INPUT} />
                          <input type="date" value={editOffreForm.endsAt}
                            onChange={e => setEditOffreForm({ ...editOffreForm, endsAt: e.target.value })}
                            className={INPUT} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select value={editOffreForm.status}
                          onChange={e => setEditOffreForm({ ...editOffreForm, status: e.target.value as 'Actif' | 'Inactif' })}
                          className={INPUT}>
                          <option>Actif</option>
                          <option>Inactif</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { handleEditOffre(editOffreForm); setEditingOffreId(null) }} className={BTN_PRIMARY}>Sauver</button>
                          <button onClick={() => setEditingOffreId(null)} className={BTN_GHOST}>Annuler</button>
                        </div>
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr key={offre.id} className="border-b border-slate-100 last:border-none transition duration-150 hover:bg-slate-50">
                    <td className="px-4 py-4 font-bold text-brand-blue">{offre.label}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-semibold text-brand-blue">{offre.category}</span>
                    </td>
                    <td className="px-4 py-4 font-bold text-red-500 text-base">-{offre.discount}%</td>
                    <td className="px-4 py-4 text-slate-600">
                      <span className="text-xs">{offre.startsAt}</span>
                      {offre.endsAt && <span className="text-xs text-slate-400"> → {offre.endsAt}</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] uppercase font-extrabold ${offre.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {offre.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingOffreId(offre.id); setEditOffreForm({ ...offre }) }}
                          className="text-slate-400 hover:text-brand-blue p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" title="Modifier">
                          <IconEye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteOffre(offre.id)}
                          className="text-slate-400 hover:text-red-500 p-2 rounded-lg bg-slate-50 hover:bg-red-50 transition-colors inline-flex" title="Supprimer">
                          <IconArchive className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {offres.length === 0 && !isAddingOffre && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                    Aucune offre. Cliquez sur «&nbsp;+ Nouvelle offre&nbsp;» pour en créer une.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return null
}
