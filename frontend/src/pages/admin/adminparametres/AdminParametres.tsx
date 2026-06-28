import { useState } from 'react'
import { IconSettings, IconTag, IconArchive, IconEye } from '../../../components/admin'

type StoreInfo = {
  name: string
  email: string
  phone: string
  address: string
  logoUrl: string
  currency: string
  website: string
}

type PaymentMethod = {
  id: string
  label: string
  description: string
  enabled: boolean
  icon: string
}

type DeliveryZone = {
  id: string
  city: string
  price: number
  days: string
}

type AdminParametresProps = {
  activeSection: string
}

const INPUT = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none transition-colors'
const LABEL = 'mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500'
const BTN_PRIMARY = 'rounded-md bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:bg-brand-light transition-colors shadow-sm'
const BTN_GHOST = 'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors'

const DEFAULT_STORE_INFO: StoreInfo = {
  name: 'Etablissement Al Amine',
  email: 'contact@etablissement-alamine.tn',
  phone: '+216 71 000 000',
  address: '12 Rue de la République, Tunis, 1001',
  logoUrl: '/logo-el-amine.png',
  currency: 'TND',
  website: 'https://www.etablissement-alamine.tn',
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cash', label: 'Espèces à la livraison', description: 'Paiement en cash lors de la réception de la commande.', enabled: true, icon: '💵' },
  { id: 'virement', label: 'Virement bancaire', description: 'Virement vers le compte de l\'établissement avant expédition.', enabled: true, icon: '🏦' },
  { id: 'cheque', label: 'Chèque', description: 'Chèque libellé à l\'ordre de l\'établissement.', enabled: false, icon: '📄' },
  { id: 'carte', label: 'Carte bancaire en ligne', description: 'Paiement sécurisé via gateway (Stripe / CMI).', enabled: false, icon: '💳' },
]

const DEFAULT_ZONES: DeliveryZone[] = [
  { id: 'Z1', city: 'Tunis', price: 7, days: '1-2 jours' },
  { id: 'Z2', city: 'Sfax', price: 10, days: '2-3 jours' },
  { id: 'Z3', city: 'Sousse', price: 9, days: '2-3 jours' },
  { id: 'Z4', city: 'Monastir', price: 9, days: '2-3 jours' },
  { id: 'Z5', city: 'Gabès', price: 12, days: '3-4 jours' },
]

export function AdminParametres({ activeSection }: AdminParametresProps) {
  // ── Store info ─────────────────────────────────────────────────────────
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(DEFAULT_STORE_INFO)
  const [savedInfo, setSavedInfo] = useState(false)
  const handleSaveInfo = () => { setSavedInfo(true); setTimeout(() => setSavedInfo(false), 2500) }

  // ── Payment methods ────────────────────────────────────────────────────
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS)
  const togglePayment = (id: string) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m))
  }

  // ── Delivery zones ─────────────────────────────────────────────────────
  const [zones, setZones] = useState<DeliveryZone[]>(DEFAULT_ZONES)
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null)
  const [editZoneForm, setEditZoneForm] = useState<DeliveryZone | null>(null)
  const [isAddingZone, setIsAddingZone] = useState(false)
  const [newZoneForm, setNewZoneForm] = useState<DeliveryZone>({ id: '', city: '', price: 8, days: '2-3 jours' })

  // ── Infos boutique ─────────────────────────────────────────────────────
  if (activeSection === 'parametres-infos') {
    return (
      <div className="animate-admin-panel-in space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10">
              <IconSettings className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider">Informations de la boutique</h3>
              <p className="text-xs text-slate-500">Ces informations apparaissent sur les factures et la page de contact.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={LABEL}>Nom de l'établissement</label>
              <input type="text" value={storeInfo.name}
                onChange={e => setStoreInfo({ ...storeInfo, name: e.target.value })}
                className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Email de contact</label>
              <input type="email" value={storeInfo.email}
                onChange={e => setStoreInfo({ ...storeInfo, email: e.target.value })}
                className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Téléphone</label>
              <input type="text" value={storeInfo.phone}
                onChange={e => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Site web</label>
              <input type="text" value={storeInfo.website}
                onChange={e => setStoreInfo({ ...storeInfo, website: e.target.value })}
                className={INPUT} />
            </div>
            <div className="md:col-span-2">
              <label className={LABEL}>Adresse postale</label>
              <input type="text" value={storeInfo.address}
                onChange={e => setStoreInfo({ ...storeInfo, address: e.target.value })}
                className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>URL du logo</label>
              <div className="flex gap-3 items-center">
                {storeInfo.logoUrl && (
                  <img src={storeInfo.logoUrl} alt="Logo" className="h-10 w-10 rounded-lg object-contain border border-slate-200 bg-slate-50 p-1" onError={e => (e.currentTarget.style.display = 'none')} />
                )}
                <input type="text" value={storeInfo.logoUrl}
                  onChange={e => setStoreInfo({ ...storeInfo, logoUrl: e.target.value })}
                  className={INPUT} />
              </div>
            </div>
            <div>
              <label className={LABEL}>Devise</label>
              <select value={storeInfo.currency}
                onChange={e => setStoreInfo({ ...storeInfo, currency: e.target.value })}
                className={INPUT}>
                <option>TND</option>
                <option>EUR</option>
                <option>USD</option>
                <option>MAD</option>
                <option>DZD</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
            <button onClick={handleSaveInfo} className={BTN_PRIMARY}>
              Enregistrer les modifications
            </button>
            {savedInfo && (
              <span className="text-sm font-semibold text-green-600 animate-fade-in flex items-center gap-1.5">
                ✓ Enregistré avec succès !
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Modes de paiement ──────────────────────────────────────────────────
  if (activeSection === 'parametres-paiement') {
    return (
      <div className="animate-admin-panel-in space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10">
              <IconTag className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider">Modes de paiement</h3>
              <p className="text-xs text-slate-500">Activez ou désactivez les méthodes de paiement acceptées par votre boutique.</p>
            </div>
          </div>

          <div className="space-y-4">
            {paymentMethods.map(method => (
              <div key={method.id}
                className={`flex items-center gap-4 rounded-2xl border p-5 transition-all duration-200 ${method.enabled ? 'border-brand-blue/30 bg-brand-blue/5' : 'border-slate-200 bg-white'}`}>
                <span className="text-3xl shrink-0">{method.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-blue">{method.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>
                </div>
                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => togglePayment(method.id)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-300 focus:outline-none ${method.enabled ? 'bg-brand-blue border-brand-blue' : 'bg-slate-200 border-slate-200'}`}
                  title={method.enabled ? 'Désactiver' : 'Activer'}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${method.enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </button>
                <span className={`text-xs font-bold uppercase w-14 text-right ${method.enabled ? 'text-green-600' : 'text-slate-400'}`}>
                  {method.enabled ? 'Actif' : 'Inactif'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Livraison & Zones ──────────────────────────────────────────────────
  if (activeSection === 'parametres-livraison') {
    return (
      <div className="animate-admin-panel-in space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10">
                <IconArchive className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-blue uppercase tracking-wider">Zones de livraison</h3>
                <p className="text-xs text-slate-500">Définissez les tarifs et délais par région.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAddingZone(true)
                setNewZoneForm({ id: `Z${Date.now()}`, city: '', price: 8, days: '2-3 jours' })
              }}
              className={BTN_PRIMARY}
            >
              + Ajouter une zone
            </button>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Zones configurées', value: zones.length, color: 'text-brand-blue' },
              { label: 'Tarif moyen', value: zones.length ? `${Math.round(zones.reduce((s, z) => s + z.price, 0) / zones.length)} TND` : '—', color: 'text-green-600' },
              { label: 'Tarif minimum', value: zones.length ? `${Math.min(...zones.map(z => z.price))} TND` : '—', color: 'text-amber-600' },
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
                  <th className="px-4 py-3 rounded-tl-lg">Ville / Région</th>
                  <th className="px-4 py-3">Tarif (TND)</th>
                  <th className="px-4 py-3">Délai estimé</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isAddingZone && (
                  <tr className="border-b border-slate-200 bg-brand-blue/5">
                    <td className="px-4 py-3">
                      <input type="text" placeholder="Ex: Bizerte" value={newZoneForm.city}
                        onChange={e => setNewZoneForm({ ...newZoneForm, city: e.target.value })}
                        className={INPUT} />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" min={0} step={0.5} value={newZoneForm.price}
                        onChange={e => setNewZoneForm({ ...newZoneForm, price: +e.target.value })}
                        className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" placeholder="Ex: 2-3 jours" value={newZoneForm.days}
                        onChange={e => setNewZoneForm({ ...newZoneForm, days: e.target.value })}
                        className={INPUT} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => {
                          if (newZoneForm.city) {
                            setZones(prev => [...prev, newZoneForm])
                            setIsAddingZone(false)
                          }
                        }} className={BTN_PRIMARY}>Ajouter</button>
                        <button onClick={() => setIsAddingZone(false)} className={BTN_GHOST}>Annuler</button>
                      </div>
                    </td>
                  </tr>
                )}

                {zones.map(zone => {
                  const isEditing = editingZoneId === zone.id && editZoneForm
                  if (isEditing && editZoneForm) {
                    return (
                      <tr key={zone.id} className="border-b border-slate-200 bg-brand-blue/5">
                        <td className="px-4 py-3">
                          <input type="text" value={editZoneForm.city}
                            onChange={e => setEditZoneForm({ ...editZoneForm, city: e.target.value })}
                            className={INPUT} />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" min={0} step={0.5} value={editZoneForm.price}
                            onChange={e => setEditZoneForm({ ...editZoneForm, price: +e.target.value })}
                            className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-blue focus:outline-none" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" value={editZoneForm.days}
                            onChange={e => setEditZoneForm({ ...editZoneForm, days: e.target.value })}
                            className={INPUT} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => {
                              setZones(prev => prev.map(z => z.id === editZoneForm.id ? editZoneForm : z))
                              setEditingZoneId(null)
                            }} className={BTN_PRIMARY}>Sauver</button>
                            <button onClick={() => setEditingZoneId(null)} className={BTN_GHOST}>Annuler</button>
                          </div>
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={zone.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 font-bold text-brand-blue">{zone.city}</td>
                      <td className="px-4 py-4 font-bold text-slate-700">{zone.price} TND</td>
                      <td className="px-4 py-4 text-slate-600">
                        <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-semibold text-brand-blue">{zone.days}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditingZoneId(zone.id); setEditZoneForm({ ...zone }) }}
                            className="text-slate-400 hover:text-brand-blue p-2 rounded-lg bg-slate-50 hover:bg-slate-200 transition-colors inline-flex" title="Modifier">
                            <IconEye className="h-4 w-4" />
                          </button>
                          <button onClick={() => setZones(prev => prev.filter(z => z.id !== zone.id))}
                            className="text-slate-400 hover:text-red-500 p-2 rounded-lg bg-slate-50 hover:bg-red-50 transition-colors inline-flex" title="Supprimer">
                            <IconArchive className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {zones.length === 0 && !isAddingZone && (
                  <tr><td colSpan={4} className="py-12 text-center text-slate-400 text-sm">Aucune zone configurée.</td></tr>
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
