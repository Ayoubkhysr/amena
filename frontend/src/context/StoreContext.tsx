import { createContext, useContext, useState, ReactNode } from 'react'
import { Banner, StaticPage } from '../pages/admin/admincontenu/AdminContenu'

import adoucissant from '../pages/admin/adminproduits/images/adoucissant.png'
import bhy_vaisselle from '../pages/admin/adminproduits/images/bhy_vaisselle.png'
import gold from '../pages/admin/adminproduits/images/gold.png'
import javel from '../pages/admin/adminproduits/images/javel.png'
import oxybain from '../pages/admin/adminproduits/images/oxybain.png'
import sol_et_surface from '../pages/admin/adminproduits/images/sol_et_surface.png'

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
  { id: 'P01', name: 'Bhy vaisselle', category: 'Entretien', price: 13.6, stock: 50, status: 'Actif', imageUrl: bhy_vaisselle, description: "Liquide vaisselle ultra dégraissant pour une propreté éclatante." },
  { id: 'P02', name: 'Oxybain', category: 'Hygiène', price: 13.9, stock: 35, status: 'Actif', imageUrl: oxybain, description: "Nettoyant désinfectant pour salle de bain, efficace contre le calcaire." },
  { id: 'P03', name: 'Gold', category: 'Entretien', price: 17.5, stock: 20, status: 'Actif', imageUrl: gold, description: "Nettoyant premium pour surfaces délicates et sols brillants." },
  { id: 'P04', name: 'Adoucissant', category: 'Hygiène', price: 5.5, stock: 100, status: 'Actif', imageUrl: adoucissant, description: "Adoucissant textile pour un linge souple et délicatement parfumé." },
  { id: 'P05', name: 'Javel', category: 'Hygiène', price: 5.5, stock: 150, status: 'Actif', imageUrl: javel, description: "Eau de javel classique pour une désinfection totale." },
  { id: 'P06', name: 'Sol et surface', category: 'Entretien', price: 4.5, stock: 80, status: 'Actif', imageUrl: sol_et_surface, description: "Nettoyant multi-usages pour tous types de sols et surfaces." }
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
