import { createContext, useContext, useState, ReactNode } from 'react'
import { Banner, StaticPage } from '../pages/admin/admincontenu/AdminContenu'

import p01 from '../pages/admin/adminproduits/images/p01.png'
import p02 from '../pages/admin/adminproduits/images/p02.png'
import p03 from '../pages/admin/adminproduits/images/p03.png'
import p04 from '../pages/admin/adminproduits/images/p04.png'
import p05 from '../pages/admin/adminproduits/images/p05.png'
import p06 from '../pages/admin/adminproduits/images/p06.png'

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'Actif' | 'Inactif' | 'Rupture'
  imageUrl?: string
  description?: string
}

type StoreContextType = {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  categories: string[]
  setCategories: React.Dispatch<React.SetStateAction<string[]>>
  banners: Banner[]
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>
  staticPages: StaticPage[]
  setStaticPages: React.Dispatch<React.SetStateAction<StaticPage[]>>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const MOCK_CATEGORIES: string[] = ['Entretien', 'Hygiène', 'Accessoires', 'Autre']

const MOCK_BANNERS: Banner[] = [
  { id: 'B1', title: 'Promo Printemps', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1200', targetUrl: '/promotions', position: 1, status: 'Actif' },
  { id: 'B2', title: 'Nouveautés Hygiène', imageUrl: 'https://images.unsplash.com/photo-1527515637-eed60c49bcbf?auto=format&fit=crop&q=80&w=1200', targetUrl: '/nouveautes', position: 2, status: 'Actif' },
  { id: 'B3', title: 'Destockage', imageUrl: '', targetUrl: '/destockage', position: 3, status: 'Inactif' },
]

const MOCK_PAGES: StaticPage[] = [
  { id: 'P1', title: 'À propos de nous', slug: 'a-propos', lastModified: '2026-03-15', status: 'Publiée' },
  { id: 'P2', title: 'Conditions Générales de Vente', slug: 'cgv', lastModified: '2026-01-10', status: 'Publiée' },
  { id: 'P3', title: 'Mentions Légales', slug: 'mentions-legales', lastModified: '2026-01-10', status: 'Publiée' },
  { id: 'P4', title: 'Politique de Retour', slug: 'retours', lastModified: '2026-04-05', status: 'Brouillon' },
]

const MOCK_PRODUCTS: Product[] = [
  { id: 'P01', name: 'Détergent Sol Pro 5L', category: 'Entretien', price: 25.5, stock: 4, status: 'Actif', imageUrl: p01, description: "Un détergent professionnel ultra-performant conçu pour le nettoyage en profondeur de tous types de sols. Idéal pour les grandes surfaces et les environnements exigeants. Laisse un parfum frais et durable." },
  { id: 'P02', name: 'Liquide Vaisselle Ultra', category: 'Entretien', price: 12.0, stock: 7, status: 'Actif', imageUrl: p02, description: "Formule concentrée dégraissante pour un nettoyage impeccable de votre vaisselle. Doux pour les mains tout en restant redoutable contre les graisses incrustées." },
  { id: 'P03', name: 'Désinfectant Surfaces', category: 'Hygiène', price: 9.9, stock: 3, status: 'Actif', imageUrl: p03, description: "Spray désinfectant multi-surfaces éliminant 99.9% des bactéries et virus. Séchage rapide sans laisser de traces, parfait pour les espaces médicaux, les bureaux et la maison." },
  { id: 'P04', name: 'Papier Toilette x12', category: 'Hygiène', price: 14.5, stock: 150, status: 'Actif', imageUrl: p04, description: "Pack économique de 12 rouleaux de papier toilette double épaisseur. Confort supérieur et résistance optimale, respectueux des peaux sensibles." },
  { id: 'P05', name: 'Brosse de nettoyage', category: 'Accessoires', price: 4.5, stock: 0, status: 'Rupture', imageUrl: p05, description: "Brosse ergonomique à poils durs, parfaite pour récurer les surfaces difficiles, les joints et les carrelages. Manche antidérapant pour une prise en main optimale." },
  { id: 'P06', name: 'Savon liquide mains', category: 'Hygiène', price: 8.0, stock: 45, status: 'Actif', imageUrl: p06, description: "Savon liquide antibactérien enrichi en aloé vera. Nettoie efficacement vos mains tout en préservant leur hydratation naturelle. Parfum lavande doux." }
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [categories, setCategories] = useState<string[]>(MOCK_CATEGORIES)
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS)
  const [staticPages, setStaticPages] = useState<StaticPage[]>(MOCK_PAGES)

  return (
    <StoreContext.Provider value={{ 
      products, setProducts, 
      categories, setCategories,
      banners, setBanners, 
      staticPages, setStaticPages, 
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}
