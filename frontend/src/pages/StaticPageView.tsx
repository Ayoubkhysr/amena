import { useParams, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const fallbackContent: Record<string, string> = {
  'a-propos': "Bienvenue chez Al Amine. Nous sommes dédiés à fournir les meilleurs produits de nettoyage et d'hygiène pour les professionnels et les particuliers. Notre mission est d'assurer un environnement propre et sain grâce à des produits de qualité supérieure.\n\nFondée en 2020, notre entreprise s'est rapidement imposée comme un leader sur le marché en misant sur l'innovation et la satisfaction client.",
  'cgv': "Les présentes conditions générales de vente (CGV) s'appliquent à toutes les commandes passées sur notre site web. En validant votre commande, vous acceptez sans réserve ces conditions.\n\n1. Commandes et disponibilité : Les produits sont proposés dans la limite des stocks disponibles.\n2. Prix et paiement : Les prix sont indiqués en TND TTC. Le paiement s'effectue en ligne ou à la livraison.\n3. Livraison : Nous livrons partout en Tunisie. Les délais peuvent varier selon la région.",
  'mentions-legales': "Éditeur du site : Etablissement Al Amine\nSiège social : Tunis, Tunisie\nNuméro de registre du commerce : RC-123456\nContact : contact@alamine.tn\n\nHébergement : Ce site est hébergé par Vercel Inc.",
  'retours': "Si vous n'êtes pas entièrement satisfait de votre achat, nous sommes là pour vous aider.\n\nVous disposez de 14 jours francs à compter de la réception de votre article pour nous le retourner. Pour être éligible à un retour, votre article doit être inutilisé, dans le même état que vous l'avez reçu, et dans son emballage d'origine."
}

export default function StaticPageView() {
  const { slug } = useParams()
  const { staticPages } = useStore()
  
  // Find page dynamically from the store and ensure it's published
  const page = staticPages.find(p => p.slug === slug && p.status === 'Publiée')
  
  // Get content (either fallback mock content or generic placeholder)
  const content = page ? (fallbackContent[page.slug] || "Contenu de la page en cours de rédaction...") : ""

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <h1 className="text-4xl font-extrabold text-brand-blue mb-4">404 - Page introuvable</h1>
        <p className="text-slate-600 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link to="/" className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-light transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold text-brand-blue">Al Amine</Link>
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-brand-blue transition-colors">Retour</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 animate-admin-panel-in">
          <header className="mb-8 border-b border-slate-100 pb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue tracking-tight">{page.title}</h1>
          </header>
          
          <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-p:leading-relaxed">
            {content.split('\\n\\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph.split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            ))}
          </div>
        </article>
      </main>
    </div>
  )
}
