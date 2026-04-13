import { useMemo, useState, type ElementType } from 'react'
import { Link } from 'react-router-dom'
import {
  IconArchive,
  IconChartBar,
  IconChevronDown,
  IconClipboard,
  IconDashboard,
  IconEye,
  IconEyeOff,
  IconImage,
  IconMenu,
  IconMessage,
  IconPackage,
  IconSettings,
  IconStar,
  IconTag,
  IconTrending,
  IconUsers,
} from '../../components/admin'

type Order = {
  id: number
  client: string
  total: number
  statut: 'En attente' | 'Préparée' | 'Livrée'
  date: string
}

type ReviewStatus = 'En attente' | 'Approuvé' | 'Rejeté'

type Review = {
  id: number
  author: string
  product: string
  rating: number
  comment: string
  date: string
  status: ReviewStatus
}

type AdminSection =
  | 'dashboard-vue-generale'
  | 'produits-liste' | 'produits-ajouter' | 'produits-categories' | 'produits-rupture'
  | 'commandes-toutes' | 'commandes-attente' | 'commandes-expediees' | 'commandes-retours'
  | 'clients-liste' | 'clients-historique'
  | 'avis-tous' | 'avis-attente' | 'avis-approuves' | 'avis-rejetes'
  | 'promos-codes' | 'promos-offres'
  | 'contenu-bannieres' | 'contenu-pages'
  | 'rapports-ventes' | 'rapports-produits'
  | 'parametres-infos' | 'parametres-paiement' | 'parametres-livraison'

const SECTION_META: Record<AdminSection, { title: string; subtitle: string }> = {
  'dashboard-vue-generale': { title: 'Vue générale', subtitle: 'CA, commandes du jour, stock faible, nouveaux clients.' },
  'produits-liste': { title: 'Liste des produits', subtitle: 'Gérer tous les produits du catalogue.' },
  'produits-ajouter': { title: 'Ajouter un produit', subtitle: 'Créer une nouvelle fiche produit.' },
  'produits-categories': { title: 'Catégories', subtitle: 'Gérer les catégories de produits.' },
  'produits-rupture': { title: 'Stock & alertes', subtitle: 'Produits en rupture ou stock faible.' },
  'commandes-toutes': { title: 'Toutes les commandes', subtitle: 'Historique complet des commandes.' },
  'commandes-attente': { title: 'En attente', subtitle: 'Commandes à préparer.' },
  'commandes-expediees': { title: 'Expédiées', subtitle: 'Suivi des expéditions.' },
  'commandes-retours': { title: 'Retours & remboursements', subtitle: 'Gérer les retours clients.' },
  'clients-liste': { title: 'Liste des clients', subtitle: 'Annuaire de tous les clients inscrits.' },
  'clients-historique': { title: "Historique d'achat", subtitle: 'Analyser les achats par client.' },
  'avis-tous': { title: 'Tous les avis', subtitle: 'Avis et commentaires globaux.' },
  'avis-attente': { title: 'En attente de modération', subtitle: 'Modérer les nouveaux avis.' },
  'avis-approuves': { title: 'Approuvés', subtitle: 'Avis publiés.' },
  'avis-rejetes': { title: 'Rejetés', subtitle: 'Avis non publiés.' },
  'promos-codes': { title: 'Codes promo', subtitle: 'Créer et gérer les coupons de réduction.' },
  'promos-offres': { title: 'Offres & réductions', subtitle: 'Remises générales.' },
  'contenu-bannieres': { title: 'Bannières / Slider', subtitle: 'Visuels de la page d\'accueil.' },
  'contenu-pages': { title: 'Pages statiques', subtitle: 'À propos, CGV, Mentions légales...' },
  'rapports-ventes': { title: 'Ventes par période', subtitle: 'Statistiques financières.' },
  'rapports-produits': { title: 'Produits les plus vendus', subtitle: 'Top des ventes.' },
  'parametres-infos': { title: 'Infos de la boutique', subtitle: 'Nom, adresses, contacts.' },
  'parametres-paiement': { title: 'Modes de paiement', subtitle: 'Configuration des paiements.' },
  'parametres-livraison': { title: 'Livraison & zones', subtitle: 'Tarifs et méthodes de livraison.' },
}

const PRODUITS_KEYS: AdminSection[] = ['produits-liste', 'produits-ajouter', 'produits-categories', 'produits-rupture']
const COMMANDES_KEYS: AdminSection[] = ['commandes-toutes', 'commandes-attente', 'commandes-expediees', 'commandes-retours']
const CLIENTS_KEYS: AdminSection[] = ['clients-liste', 'clients-historique']
const AVIS_KEYS: AdminSection[] = ['avis-tous', 'avis-attente', 'avis-approuves', 'avis-rejetes']
const PROMOS_KEYS: AdminSection[] = ['promos-codes', 'promos-offres']
const CONTENU_KEYS: AdminSection[] = ['contenu-bannieres', 'contenu-pages']
const RAPPORTS_KEYS: AdminSection[] = ['rapports-ventes', 'rapports-produits']
const PARAM_KEYS: AdminSection[] = ['parametres-infos', 'parametres-paiement', 'parametres-livraison']

const LOW_STOCK_PRODUCTS = [
  { name: 'Détergent Sol Pro 5L', stock: 4 },
  { name: 'Liquide Vaisselle Ultra', stock: 7 },
  { name: 'Désinfectant Surfaces', stock: 3 },
]

function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard-vue-generale')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [navOpen, setNavOpen] = useState({
    produits: false,
    commandes: false,
    clients: false,
    avis: false,
    promotions: false,
    contenu: false,
    rapports: false,
    parametres: false,
  })

  // Exemples de données
  const [orders] = useState<Order[]>([
    { id: 1001, client: 'Société Atlas', total: 420, statut: 'En attente', date: '2026-04-01' },
    { id: 1002, client: 'Hôtel Jasmin', total: 980, statut: 'Préparée', date: '2026-04-03' },
    { id: 1003, client: 'Clinique Nour', total: 730, statut: 'Livrée', date: '2026-04-04' },
  ])

  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, author: 'Alice Dupont', product: 'Détergent Sol Pro 5L', rating: 5, comment: 'Excellent produit, nettoie très bien.', date: '2026-04-10', status: 'En attente' },
    { id: 2, author: 'Jean Martin', product: 'Liquide Vaisselle Ultra', rating: 4, comment: 'Bon rapport qualité/prix.', date: '2026-04-11', status: 'Approuvé' },
    { id: 3, author: 'Sophie Laurent', product: 'Désinfectant Surfaces', rating: 2, comment: 'Odeur un peu trop forte.', date: '2026-04-12', status: 'Rejeté' },
    { id: 4, author: 'Marc Tremblay', product: 'Pack Entretien Complet', rating: 5, comment: 'Parfait pour le bureau, je recommande fortement ce pack.', date: '2026-04-12', status: 'En attente' }
  ])

  const salesStats = useMemo(() => {
    const totalCommandes = orders.length
    const chiffreAffaires = orders.reduce((sum, order) => sum + order.total, 0)
    const panierMoyen = totalCommandes ? Math.round(chiffreAffaires / totalCommandes) : 0
    return { totalCommandes, chiffreAffaires, panierMoyen }
  }, [orders])

  const selectNav = (key: AdminSection) => {
    setActiveSection(key)
    setSidebarOpen(false)
    setNavOpen((o) => ({
      ...o,
      produits: PRODUITS_KEYS.includes(key) ? true : o.produits,
      commandes: COMMANDES_KEYS.includes(key) ? true : o.commandes,
      clients: CLIENTS_KEYS.includes(key) ? true : o.clients,
      avis: AVIS_KEYS.includes(key) ? true : o.avis,
      promotions: PROMOS_KEYS.includes(key) ? true : o.promotions,
      contenu: CONTENU_KEYS.includes(key) ? true : o.contenu,
      rapports: RAPPORTS_KEYS.includes(key) ? true : o.rapports,
      parametres: PARAM_KEYS.includes(key) ? true : o.parametres,
    }))
  }

  const meta = SECTION_META[activeSection]
  const pendingOrders = orders.filter((order) => order.statut === 'En attente').length
  const pendingReviews = reviews.filter((review) => review.status === 'En attente').length
  const newClients = 12

  const handleReviewStatus = (id: number, newStatus: ReviewStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }

  const NavLeaf = ({ sectionKey, label, Icon, badge }: { sectionKey: AdminSection; label: string; Icon: ElementType; badge?: string }) => {
    const isActive = activeSection === sectionKey
    return (
      <button
        type="button"
        onClick={() => selectNav(sectionKey)}
        className={`group relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all duration-200 ease-out ${isActive
            ? 'bg-brand-blue text-white shadow-md'
            : 'text-brand-blue hover:bg-slate-100'
          }`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-light'}`} />
        <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug">{label}</span>
        {badge && (
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isActive ? 'bg-white text-brand-red' : 'bg-brand-red text-white'}`}>
            {badge}
          </span>
        )}
      </button>
    )
  }

  const NavGroupHeader = ({ label, Icon, open, onToggle }: { label: string; Icon: ElementType; open: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-2 rounded-xl px-2 py-2 text-left text-brand-blue transition-colors duration-200 hover:bg-slate-50"
    >
      <span className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0079dd]/10 text-brand-light">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </span>
      <IconChevronDown className={`h-4 w-4 shrink-0 text-brand-light transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
    </button>
  )

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <button
        type="button"
        aria-label="Fermer le menu"
        className={`fixed inset-0 z-40 bg-brand-blue/30 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${sidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="grid min-h-screen md:grid-cols-[310px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[310px] flex-col border-r border-slate-200 bg-white shadow-xl shadow-brand-blue/5 transition-transform duration-300 ease-out md:static md:z-auto md:translate-x-0 md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="border-b border-slate-100 px-6 py-6">
            <div className="rounded-2xl border border-slate-200 bg-brand-surface px-4 py-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-el-amine.png"
                  alt="Logo Etablissement El Amine"
                  className="h-14 w-16 rounded-md object-contain bg-white p-1 shadow-sm"
                  onError={(e) => {
                    ; (e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div>
                  <h1 className="text-lg font-extrabold tracking-tight text-brand-blue">Etablissement El Amena</h1>
                  <p className="mt-0.5 text-xs font-medium text-brand-light">Panneau d'administration</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto px-4 py-6 custom-scrollbar">
            <div className="rounded-xl border border-slate-200 bg-white p-1">
              <NavLeaf sectionKey="dashboard-vue-generale" label="Dashboard" Icon={IconDashboard} />
            </div>

            <div>
              <NavGroupHeader label="Produits" Icon={IconPackage} open={navOpen.produits} onToggle={() => setNavOpen((o) => ({ ...o, produits: !o.produits }))} />
              {navOpen.produits && (
                <div className="mt-1 space-y-1 border-l-2 border-[#0079dd]/20 pl-3 ml-4">
                  <NavLeaf sectionKey="produits-liste" label="Liste des produits" Icon={IconArchive} />
                  <NavLeaf sectionKey="produits-ajouter" label="Ajouter un produit" Icon={IconPackage} />
                  <NavLeaf sectionKey="produits-categories" label="Catégories" Icon={IconTag} />
                  <NavLeaf sectionKey="produits-rupture" label="Stock & alertes de rupture" Icon={IconTrending} badge="5" />
                </div>
              )}
            </div>

            <div>
              <NavGroupHeader label="Commandes" Icon={IconClipboard} open={navOpen.commandes} onToggle={() => setNavOpen((o) => ({ ...o, commandes: !o.commandes }))} />
              {navOpen.commandes && (
                <div className="mt-1 space-y-1 border-l-2 border-[#0079dd]/20 pl-3 ml-4">
                  <NavLeaf sectionKey="commandes-toutes" label="Toutes les commandes" Icon={IconClipboard} />
                  <NavLeaf sectionKey="commandes-attente" label="En attente" Icon={IconArchive} badge="12" />
                  <NavLeaf sectionKey="commandes-expediees" label="Expédiées" Icon={IconTrending} />
                  <NavLeaf sectionKey="commandes-retours" label="Retours & remboursements" Icon={IconSettings} />
                </div>
              )}
            </div>

            <div>
              <NavGroupHeader label="Clients" Icon={IconUsers} open={navOpen.clients} onToggle={() => setNavOpen((o) => ({ ...o, clients: !o.clients }))} />
              {navOpen.clients && (
                <div className="mt-1 space-y-1 border-l-2 border-[#0079dd]/20 pl-3 ml-4">
                  <NavLeaf sectionKey="clients-liste" label="Liste des clients" Icon={IconUsers} />
                  <NavLeaf sectionKey="clients-historique" label="Historique d'achat" Icon={IconTrending} />
                </div>
              )}
            </div>

            <div>
              <NavGroupHeader label="Avis & Commentaires" Icon={IconMessage} open={navOpen.avis} onToggle={() => setNavOpen((o) => ({ ...o, avis: !o.avis }))} />
              {navOpen.avis && (
                <div className="mt-1 space-y-1 border-l-2 border-[#0079dd]/20 pl-3 ml-4">
                  <NavLeaf sectionKey="avis-tous" label="Tous les avis" Icon={IconMessage} />
                  <NavLeaf sectionKey="avis-attente" label="En attente de modération" Icon={IconEyeOff} badge={pendingReviews > 0 ? pendingReviews.toString() : undefined} />
                  <NavLeaf sectionKey="avis-approuves" label="Approuvés" Icon={IconStar} />
                  <NavLeaf sectionKey="avis-rejetes" label="Rejetés" Icon={IconArchive} />
                </div>
              )}
            </div>

            <div>
              <NavGroupHeader label="Promotions" Icon={IconTag} open={navOpen.promotions} onToggle={() => setNavOpen((o) => ({ ...o, promotions: !o.promotions }))} />
              {navOpen.promotions && (
                <div className="mt-1 space-y-1 border-l-2 border-[#0079dd]/20 pl-3 ml-4">
                  <NavLeaf sectionKey="promos-codes" label="Codes promo" Icon={IconTag} />
                  <NavLeaf sectionKey="promos-offres" label="Offres & réductions" Icon={IconTrending} />
                </div>
              )}
            </div>

            <div>
              <NavGroupHeader label="Contenu" Icon={IconImage} open={navOpen.contenu} onToggle={() => setNavOpen((o) => ({ ...o, contenu: !o.contenu }))} />
              {navOpen.contenu && (
                <div className="mt-1 space-y-1 border-l-2 border-[#0079dd]/20 pl-3 ml-4">
                  <NavLeaf sectionKey="contenu-bannieres" label="Bannières / Slider" Icon={IconImage} />
                  <NavLeaf sectionKey="contenu-pages" label="Pages statiques" Icon={IconSettings} />
                </div>
              )}
            </div>

            <div>
              <NavGroupHeader label="Rapports" Icon={IconChartBar} open={navOpen.rapports} onToggle={() => setNavOpen((o) => ({ ...o, rapports: !o.rapports }))} />
              {navOpen.rapports && (
                <div className="mt-1 space-y-1 border-l-2 border-[#0079dd]/20 pl-3 ml-4">
                  <NavLeaf sectionKey="rapports-ventes" label="Ventes par période" Icon={IconChartBar} />
                  <NavLeaf sectionKey="rapports-produits" label="Produits les plus vendus" Icon={IconStar} />
                </div>
              )}
            </div>

            <div>
              <NavGroupHeader label="Paramètres" Icon={IconSettings} open={navOpen.parametres} onToggle={() => setNavOpen((o) => ({ ...o, parametres: !o.parametres }))} />
              {navOpen.parametres && (
                <div className="mt-1 space-y-1 border-l-2 border-[#0079dd]/20 pl-3 ml-4">
                  <NavLeaf sectionKey="parametres-infos" label="Infos de la boutique" Icon={IconSettings} />
                  <NavLeaf sectionKey="parametres-paiement" label="Modes de paiement" Icon={IconTag} />
                  <NavLeaf sectionKey="parametres-livraison" label="Livraison & zones" Icon={IconArchive} />
                </div>
              )}
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex flex-col bg-white">
          <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 shadow-sm md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand-blue transition-all duration-200 hover:border-brand-light hover:bg-brand-light/5"
            >
              <IconMenu className="h-5 w-5" />
            </button>
            <span className="truncate text-sm font-bold text-brand-blue uppercase tracking-wider">{meta.title}</span>
            <Link
              to="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-light text-white shadow-md shadow-brand-light/20 transition-all duration-200 hover:bg-brand-blue"
            >
              <IconEye className="h-5 w-5" />
            </Link>
          </div>

          <div className="flex-1 p-6 md:p-10">
            <header className="mb-8 rounded-2xl border border-slate-200 bg-brand-surface px-6 py-5">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-brand-blue">{meta.title}</h2>
                  <p className="mt-2 text-sm font-medium text-slate-600">{meta.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-brand-light/20 bg-white px-3 py-1 text-xs font-semibold text-brand-light">
                    Mise a jour: aujourd&apos;hui
                  </span>
                  <Link
                    to="/"
                    className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-brand-light"
                  >
                    <IconEye className="h-4 w-4" />
                    Voir le site
                  </Link>
                </div>
              </div>
            </header>

            <div className="animate-admin-panel-in space-y-8">
              {activeSection === 'dashboard-vue-generale' ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center gap-2 text-brand-light">
                        <IconTrending className="h-5 w-5" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Chiffre d&apos;affaires</h3>
                      </div>
                      <p className="text-3xl font-extrabold text-brand-blue">{salesStats.chiffreAffaires} TND</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">Performance globale des ventes</p>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center gap-2 text-brand-red">
                        <IconClipboard className="h-5 w-5" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Commandes du jour</h3>
                      </div>
                      <p className="text-3xl font-extrabold text-brand-blue">{salesStats.totalCommandes}</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">{pendingOrders} commande(s) en attente</p>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center gap-2 text-amber-500">
                        <IconArchive className="h-5 w-5" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Stock faible</h3>
                      </div>
                      <p className="text-3xl font-extrabold text-brand-blue">{LOW_STOCK_PRODUCTS.length}</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">Produits proches de la rupture</p>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center gap-2 text-brand-light">
                        <IconUsers className="h-5 w-5" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Nouveaux clients</h3>
                      </div>
                      <p className="text-3xl font-extrabold text-brand-blue">{newClients}</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">Inscriptions sur 30 jours</p>
                    </article>
                  </div>

                  <section className="grid gap-5 xl:grid-cols-5">
                    <article className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <header className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">Activite recente</h3>
                        <span className="text-xs font-medium text-slate-500">Dernieres commandes</span>
                      </header>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                              <th className="px-2 py-2">Commande</th>
                              <th className="px-2 py-2">Client</th>
                              <th className="px-2 py-2">Total</th>
                              <th className="px-2 py-2">Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order.id} className="border-b border-slate-100 last:border-none">
                                <td className="px-2 py-3 font-semibold text-brand-blue">#{order.id}</td>
                                <td className="px-2 py-3 text-slate-700">{order.client}</td>
                                <td className="px-2 py-3 text-slate-700">{order.total} TND</td>
                                <td className="px-2 py-3">
                                  <span className="rounded-full border border-brand-light/20 bg-brand-light/10 px-2 py-1 text-xs font-semibold text-brand-light">
                                    {order.statut}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </article>

                    <article className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <header className="mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-blue">Alertes stock</h3>
                        <p className="mt-1 text-xs text-slate-500">Action recommandee pour reapprovisionnement</p>
                      </header>
                      <div className="space-y-3">
                        {LOW_STOCK_PRODUCTS.map((product) => (
                          <div key={product.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <p className="text-sm font-semibold text-slate-700">{product.name}</p>
                            <span className="rounded-full bg-brand-red px-2 py-1 text-xs font-bold text-white">
                              {product.stock} restants
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>
                  </section>
                </>
              ) : AVIS_KEYS.includes(activeSection) ? (
                <div className="space-y-4">
                  {(() => {
                    let filteredReviews = reviews;
                    if (activeSection === 'avis-attente') filteredReviews = reviews.filter(r => r.status === 'En attente');
                    else if (activeSection === 'avis-approuves') filteredReviews = reviews.filter(r => r.status === 'Approuvé');
                    else if (activeSection === 'avis-rejetes') filteredReviews = reviews.filter(r => r.status === 'Rejeté');

                    if (filteredReviews.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-brand-surface py-24 text-center">
                          <IconMessage className="h-8 w-8 text-Brand-light mb-4 opacity-50" />
                          <h3 className="text-lg font-bold text-brand-blue">Aucun avis trouvé</h3>
                          <p className="mt-2 max-w-sm text-sm text-slate-500">
                            Il n'y a aucun avis dans cette catégorie pour le moment.
                          </p>
                        </div>
                      )
                    }

                    return filteredReviews.map(review => (
                      <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                          <div className="flex-1">
                            <h4 className="font-bold text-brand-blue text-base">{review.author}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {review.date} &bull; Produit : <span className="font-semibold text-slate-700">{review.product}</span>
                            </p>
                            <div className="my-2 flex text-amber-400 gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <IconStar key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                              ))}
                            </div>
                            <p className="text-sm text-slate-700 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg">{review.comment}</p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                            <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full w-fit ${review.status === 'En attente' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                review.status === 'Approuvé' ? 'bg-green-100 text-green-700 border border-green-200' :
                                  'bg-red-100 text-red-700 border border-red-200'
                              }`}>
                              {review.status}
                            </span>

                            {['avis-tous', 'avis-attente', 'avis-rejetes'].includes(activeSection) || activeSection === 'avis-approuves' ? (
                              <div className="flex gap-2 w-full sm:w-auto justify-end">
                                {review.status !== 'Approuvé' && (
                                  <button
                                    onClick={() => handleReviewStatus(review.id, 'Approuvé')}
                                    className="px-4 py-2 bg-green-50 hover:bg-green-500 hover:text-white text-green-600 text-xs font-bold rounded-lg transition-all duration-200 border border-green-200 shadow-sm flex-1 sm:flex-none"
                                  >
                                    Approuver
                                  </button>
                                )}
                                {review.status !== 'Rejeté' && (
                                  <button
                                    onClick={() => handleReviewStatus(review.id, 'Rejeté')}
                                    className="px-4 py-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 text-xs font-bold rounded-lg transition-all duration-200 border border-red-200 shadow-sm flex-1 sm:flex-none"
                                  >
                                    Rejeter
                                  </button>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-brand-surface py-24 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-light shadow-sm">
                    <IconDashboard className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-brand-blue">Section prete pour implementation</h3>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">
                    La vue "{meta.title}" est structuree dans la navigation et peut etre branchee sur vos donnees metier.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardPage
